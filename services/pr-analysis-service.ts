import { createGitHubClient } from "@/lib/github";
import {
  parseGitHubUrl,
  fetchMultipleFiles,
  fetchPackageJson,
} from "./github-service";
import {
  fetchPullRequestDetails,
  fetchPullRequestFiles,
} from "./github-pr-service";
import { parsePullRequestFiles, normalizeFilePath } from "./diff-parser-service";
import { classifyPullRequestFindings } from "./pr-classifier-service";
import { enrichFindingsList } from "./remediation-service";
import { analyzeSecurityIssues } from "./securityAnalyser-service";
import { analyzeArchitectureIssues } from "./architecturalAnalyser-service";
import { analyzeCompleteness } from "./CompletenessAnalyser-service";
import { analyzeMaintainability } from "./MaintainabilityAnalyser-service";
import { analyzeReadiness } from "./ReadinessAnalyser-service";
import { analyzeTesting } from "./testingAnalyser-service";
import type { Issue } from "@/types/analysis";
import type { PullRequestAnalysisResult, PullRequestFile } from "@/types/pr";

function calculateWeightedScore(
  scores: Record<string, number>,
  weights: Record<string, number>
): number {
  let totalScore = 0;
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) {
    const vals = Object.values(scores);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }
  for (const [cat, weight] of Object.entries(weights)) {
    const s = scores[cat] ?? 0;
    totalScore += s * weight;
  }
  return Math.round((totalScore / totalWeight) * 100) / 100;
}

const CODE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".py",
  ".go",
  ".rs",
  ".java",
];

function isCodeFile(filename: string): boolean {
  return CODE_EXTENSIONS.some((ext) => filename.toLowerCase().endsWith(ext));
}

const DEFAULT_INTENT_WEIGHTS = {
  security: 0.3,
  architecture: 0.25,
  testing: 0.2,
  completeness: 0.08,
  maintainability: 0.1,
  readiness: 0.07,
};

async function runAnalyzersOnFiles(
  codeFiles: Record<string, string>,
  packageJson: Record<string, unknown> | null,
  filesList: PullRequestFile[]
): Promise<{ issues: Issue[]; score: number }> {
  const fileTree = filesList.map((f) => ({
    path: f.filename,
    mode: "100644",
    type: "blob" as const,
    sha: "",
    size: f.changes,
    url: "",
  }));

  const dependencies = {
    ...((packageJson?.dependencies as Record<string, string>) || {}),
    ...((packageJson?.devDependencies as Record<string, string>) || {}),
  };

  const [
    securityResult,
    architectureResult,
    testingResult,
    completenessResult,
    maintainabilityResult,
    readinessResult,
  ] = await Promise.all([
    Promise.resolve(analyzeSecurityIssues(codeFiles, dependencies)),
    Promise.resolve(analyzeArchitectureIssues(codeFiles, fileTree)),
    Promise.resolve(analyzeTesting(fileTree)),
    Promise.resolve(analyzeCompleteness(codeFiles, fileTree, packageJson)),
    Promise.resolve(analyzeMaintainability(codeFiles, fileTree, packageJson)),
    Promise.resolve(analyzeReadiness(codeFiles, fileTree, packageJson, null)),
  ]);

  const allIssues: Issue[] = [
    ...securityResult.issues,
    ...architectureResult.issues,
    ...testingResult.issues,
    ...completenessResult.issues,
    ...maintainabilityResult.issues,
    ...readinessResult.issues,
  ];

  const categoryScores = {
    security: securityResult.score,
    architecture: architectureResult.score,
    testing: testingResult.score,
    completeness: completenessResult.score,
    maintainability: maintainabilityResult.score,
    readiness: readinessResult.score,
  };

  const score = calculateWeightedScore(categoryScores, DEFAULT_INTENT_WEIGHTS);

  return { issues: allIssues, score };
}

export async function analyzePullRequest(
  repoUrl: string,
  pullNumber: number,
  githubAccessToken?: string
): Promise<PullRequestAnalysisResult> {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  const client = createGitHubClient(githubAccessToken);

  // 1. Fetch PR metadata and file list
  const [prDetails, prFiles] = await Promise.all([
    fetchPullRequestDetails(owner, repo, pullNumber, client),
    fetchPullRequestFiles(owner, repo, pullNumber, client),
  ]);

  // 2. Parse diffs into line number sets
  const diffMap = parsePullRequestFiles(prFiles);

  // 3. Determine files to inspect for Head and Base commits
  const headTargetPaths = prFiles
    .filter((f) => f.status !== "removed" && isCodeFile(f.filename))
    .map((f) => f.filename)
    .slice(0, 60);

  const baseTargetPaths = prFiles
    .filter((f) => f.status !== "added" && isCodeFile(f.filename))
    .map((f) => f.previousFilename || f.filename)
    .slice(0, 60);

  // 4. Fetch file contents at respective commit SHAs
  const [headCodeFiles, baseCodeFiles, headPkg, basePkg] = await Promise.all([
    fetchMultipleFiles(owner, repo, headTargetPaths, client, prDetails.headSha),
    fetchMultipleFiles(owner, repo, baseTargetPaths, client, prDetails.baseSha),
    fetchPackageJson(owner, repo, client, prDetails.headSha),
    fetchPackageJson(owner, repo, client, prDetails.baseSha),
  ]);

  // 5. Run static analyzers on both revisions
  const [headAnalysis, baseAnalysis] = await Promise.all([
    runAnalyzersOnFiles(headCodeFiles, headPkg, prFiles),
    runAnalyzersOnFiles(baseCodeFiles, basePkg, prFiles),
  ]);

  const scoreDelta = Math.round(headAnalysis.score - baseAnalysis.score);

  // 6. Deterministically classify findings against diff hunks
  const classification = classifyPullRequestFindings(
    baseAnalysis.issues,
    headAnalysis.issues,
    diffMap,
    scoreDelta
  );

  // 7. Enrich findings with remediation guidance
  const [enrichedIntroduced, enrichedWorsened, enrichedPersistent, enrichedResolved, enrichedImproved] =
    await Promise.all([
      enrichFindingsList(classification.introducedIssues),
      enrichFindingsList(classification.worsenedIssues),
      enrichFindingsList(classification.persistentIssues),
      enrichFindingsList(classification.resolvedIssues),
      enrichFindingsList(classification.improvedIssues),
    ]);

  const summary = `${prDetails.title} (#${pullNumber}) - ${classification.verdict.toUpperCase()}: ${classification.verdictReason} (Health Score: ${headAnalysis.score}/100, delta: ${scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts).`;

  return {
    repoUrl,
    repoName: `${owner}/${repo}`,
    prNumber: pullNumber,
    prTitle: prDetails.title,
    prAuthor: prDetails.author,
    prAuthorAvatar: prDetails.authorAvatar,
    baseSha: prDetails.baseSha,
    headSha: prDetails.headSha,
    baseBranch: prDetails.baseBranch,
    headBranch: prDetails.headBranch,
    status: prDetails.state,
    verdict: classification.verdict,
    verdictReason: classification.verdictReason,
    scoreDelta,
    baseScore: Math.round(baseAnalysis.score),
    headScore: Math.round(headAnalysis.score),
    changedFilesCount: prDetails.changedFilesCount,
    additions: prDetails.additions,
    deletions: prDetails.deletions,
    counts: classification.counts,
    introducedIssues: enrichedIntroduced,
    resolvedIssues: enrichedResolved,
    persistentIssues: enrichedPersistent,
    worsenedIssues: enrichedWorsened,
    improvedIssues: enrichedImproved,
    summary,
    analyzedAt: new Date().toISOString(),
  };
}
