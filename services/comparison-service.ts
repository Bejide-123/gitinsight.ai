import type { Issue, IssueSeverity } from "@/types/analysis";
import type {
  AnalysisComparisonResult,
  ComparedFinding,
  CategoryComparison,
  ScoreAttribution,
  FairnessAssessment,
  AnalysisRunData,
  AnalysisRunMetadata,
} from "@/types/comparison";

// Weights used for category importance across intents
const DEFAULT_WEIGHTS: Record<string, Record<string, number>> = {
  portfolio: {
    security: 0.2,
    architecture: 0.25,
    testing: 0.1,
    completeness: 0.15,
    maintainability: 0.2,
    readiness: 0.1,
  },
  learning: {
    security: 0.15,
    architecture: 0.3,
    testing: 0.15,
    completeness: 0.12,
    maintainability: 0.18,
    readiness: 0.1,
  },
  "open-source-library": {
    security: 0.2,
    architecture: 0.28,
    testing: 0.3,
    completeness: 0.12,
    maintainability: 0.05,
    readiness: 0.05,
  },
  mvp: {
    security: 0.25,
    architecture: 0.25,
    testing: 0.2,
    completeness: 0.1,
    maintainability: 0.12,
    readiness: 0.08,
  },
  startup: {
    security: 0.3,
    architecture: 0.25,
    testing: 0.2,
    completeness: 0.08,
    maintainability: 0.1,
    readiness: 0.07,
  },
  "production-saas": {
    security: 0.35,
    architecture: 0.25,
    testing: 0.2,
    completeness: 0.05,
    maintainability: 0.08,
    readiness: 0.07,
  },
  enterprise: {
    security: 0.35,
    architecture: 0.25,
    testing: 0.18,
    completeness: 0.08,
    maintainability: 0.07,
    readiness: 0.07,
  },
};

const SEVERITY_SEVERITY_ORDER: Record<IssueSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Normalizes file paths (removing Windows backslashes, leading slashes, etc.)
 */
function normalizeFilePath(path?: string): string {
  if (!path) return "";
  return path.toLowerCase().replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

/**
 * Normalizes title for stable matching across minor text variations
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCategory(category?: string): string {
  return (category || "general").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getCategoryScore(
  scores: AnalysisRunData["categoryScores"],
  category: string
) {
  return Object.entries(scores || {}).find(
    ([name]) => normalizeCategory(name) === normalizeCategory(category)
  )?.[1];
}

function getCategoryWeight(
  category: string,
  scores: AnalysisRunData["categoryScores"],
  intent: string
): number {
  const score = getCategoryScore(scores, category);
  if (score && Number.isFinite(score.weight) && score.weight >= 0) {
    return score.weight;
  }

  const configuredWeight = DEFAULT_WEIGHTS[intent]?.[category];
  return configuredWeight ?? 0.1;
}

/**
 * Computes a resilient fingerprint for matching findings across commits
 */
export function getFindingFingerprint(issue: Issue): string {
  const normFile = normalizeFilePath(issue.file);
  const normTitle = normalizeTitle(issue.title);
  const normCat = normalizeCategory(issue.category);
  return `${normCat}::${normFile}::${normTitle}`;
}

/**
 * Compares issues between Base (Run A) and Target (Run B)
 * Classifies into new, resolved, persistent, changed
 */
export function compareFindings(
  baseIssues: Issue[] = [],
  targetIssues: Issue[] = []
): {
  all: ComparedFinding[];
  new: ComparedFinding[];
  resolved: ComparedFinding[];
  persistent: ComparedFinding[];
  changed: ComparedFinding[];
  counts: {
    total: number;
    new: number;
    resolved: number;
    persistent: number;
    changed: number;
  };
} {
  const baseEntries = baseIssues.map((issue) => ({
    issue,
    fingerprint: getFindingFingerprint(issue),
    matched: false,
  }));
  const exactMatches = new Map<string, typeof baseEntries>();
  const locationIndependentMatches = new Map<string, typeof baseEntries>();
  for (const entry of baseEntries) {
    const stableKey = `${normalizeCategory(entry.issue.category)}::${normalizeTitle(entry.issue.title)}`;
    const exactEntries = exactMatches.get(entry.fingerprint) || [];
    exactEntries.push(entry);
    exactMatches.set(entry.fingerprint, exactEntries);

    const stableEntries = locationIndependentMatches.get(stableKey) || [];
    stableEntries.push(entry);
    locationIndependentMatches.set(stableKey, stableEntries);
  }

  const newFindings: ComparedFinding[] = [];
  const persistentFindings: ComparedFinding[] = [];
  const changedFindings: ComparedFinding[] = [];

  for (const targetIssue of targetIssues) {
    const fingerprint = getFindingFingerprint(targetIssue);
    const stableKey = `${normalizeCategory(targetIssue.category)}::${normalizeTitle(targetIssue.title)}`;
    const baseEntry =
      exactMatches.get(fingerprint)?.find((entry) => !entry.matched) ||
      locationIndependentMatches.get(stableKey)?.find((entry) => !entry.matched);

    if (!baseEntry) {
      newFindings.push({
        state: "new",
        issue: targetIssue,
        fingerprint,
        changeSummary: "Newly introduced in this analysis",
      });
    } else {
      baseEntry.matched = true;
      const baseIssue = baseEntry.issue;

      // Match moved findings by category and title, then report their location change.
      const baseSev = (baseIssue.severity || "low").toLowerCase() as IssueSeverity;
      const targetSev = (targetIssue.severity || "low").toLowerCase() as IssueSeverity;
      const severityChanged = baseSev !== targetSev;
      const lineChanged = baseIssue.lineNumber !== targetIssue.lineNumber;
      const fileChanged = normalizeFilePath(baseIssue.file) !== normalizeFilePath(targetIssue.file);
      const detailsChanged =
        baseIssue.description !== targetIssue.description ||
        baseIssue.impact !== targetIssue.impact ||
        baseIssue.recommendation !== targetIssue.recommendation ||
        baseIssue.isDangerous !== targetIssue.isDangerous ||
        (baseIssue.evidence || []).join("\n") !== (targetIssue.evidence || []).join("\n");

      if (severityChanged || lineChanged || fileChanged || detailsChanged) {
        const changeParts: string[] = [];
        if (severityChanged) {
          const escalated =
            (SEVERITY_SEVERITY_ORDER[targetSev] || 0) >
            (SEVERITY_SEVERITY_ORDER[baseSev] || 0);
          changeParts.push(
            escalated
              ? `Severity escalated from ${baseSev} to ${targetSev}`
              : `Severity lowered from ${baseSev} to ${targetSev}`
          );
        }
        if (fileChanged) {
          changeParts.push(`File moved from ${baseIssue.file || "unknown"} to ${targetIssue.file || "unknown"}`);
        }
        if (lineChanged && targetIssue.lineNumber && baseIssue.lineNumber) {
          changeParts.push(
            `Line moved from :${baseIssue.lineNumber} to :${targetIssue.lineNumber}`
          );
        } else if (lineChanged) {
          changeParts.push("Line location changed");
        }
        if (detailsChanged) {
          changeParts.push("Finding details modified");
        }

        changedFindings.push({
          state: "changed",
          issue: targetIssue,
          previousIssue: baseIssue,
          fingerprint,
          changeSummary: changeParts.join("; ") || "Finding details modified",
          details: {
            previousSeverity: baseSev,
            newSeverity: targetSev,
            previousLineNumber: baseIssue.lineNumber,
            newLineNumber: targetIssue.lineNumber,
            previousFile: baseIssue.file,
            newFile: targetIssue.file,
          },
        });
      } else {
        persistentFindings.push({
          state: "persistent",
          issue: targetIssue,
          previousIssue: baseIssue,
          fingerprint,
          changeSummary: "Persists from previous analysis",
        });
      }
    }
  }

  // Resolved findings: were in Base, but not in Target
  const resolvedFindings: ComparedFinding[] = [];
  for (const { fingerprint, issue: baseIssue, matched } of baseEntries) {
    if (!matched) {
      resolvedFindings.push({
        state: "resolved",
        issue: baseIssue,
        fingerprint,
        changeSummary: "Resolved / no longer detected in this analysis",
      });
    }
  }

  // Sort "all" by priority: new critical first, changed, persistent, then resolved
  const allFindings = [
    ...newFindings.sort(
      (a, b) =>
        (SEVERITY_SEVERITY_ORDER[b.issue.severity] || 0) -
        (SEVERITY_SEVERITY_ORDER[a.issue.severity] || 0)
    ),
    ...changedFindings,
    ...persistentFindings.sort(
      (a, b) =>
        (SEVERITY_SEVERITY_ORDER[b.issue.severity] || 0) -
        (SEVERITY_SEVERITY_ORDER[a.issue.severity] || 0)
    ),
    ...resolvedFindings,
  ];

  return {
    all: allFindings,
    new: newFindings,
    resolved: resolvedFindings,
    persistent: persistentFindings,
    changed: changedFindings,
    counts: {
      total: allFindings.length,
      new: newFindings.length,
      resolved: resolvedFindings.length,
      persistent: persistentFindings.length,
      changed: changedFindings.length,
    },
  };
}

/**
 * Assesses whether the comparison between two runs is apples-to-apples,
 * or whether intent, file scope, or configuration changed.
 */
export function assessFairness(
  base: AnalysisRunData,
  target: AnalysisRunData,
  categoryComparisons: Record<string, CategoryComparison>
): FairnessAssessment {
  const notices: string[] = [];

  const baseIntent = base.projectContext?.intent || "portfolio";
  const targetIntent = target.projectContext?.intent || baseIntent;
  const intentChanged = baseIntent !== targetIntent;

  const baseFiles = base.selectedFilesCount ?? 0;
  const targetFiles = target.selectedFilesCount ?? 0;
  const fileDelta = targetFiles - baseFiles;
  const fileScopeChanged = baseFiles > 0 && targetFiles > 0 && fileDelta !== 0;

  const baseSha = base.commitSha?.trim() || "";
  const targetSha = target.commitSha?.trim() || "";
  const sameCommit = Boolean(baseSha && targetSha && baseSha.toLowerCase() === targetSha.toLowerCase());

  const commonCategories = Object.entries(categoryComparisons).filter(([, comparison]) => comparison.available);
  let baseWeightTotal = 0;
  let normalizedTargetScore = 0;
  let normalizedBaseScore = 0;

  for (const [category, comparison] of commonCategories) {
    const weight = getCategoryWeight(category, base.categoryScores, baseIntent);
    baseWeightTotal += weight;
    normalizedBaseScore += comparison.baseScore * weight;
    normalizedTargetScore += comparison.targetScore * weight;
  }

  const normalizedBase = baseWeightTotal > 0 ? normalizedBaseScore / baseWeightTotal : base.maturityScore;
  const normalizedTarget = baseWeightTotal > 0 ? normalizedTargetScore / baseWeightTotal : target.maturityScore;
  const normalizedScoreDelta = Math.round(normalizedTarget - normalizedBase);

  const categoryWeightsChanged = commonCategories.some(([category]) => {
    const baseWeight = getCategoryWeight(category, base.categoryScores, baseIntent);
    const targetWeight = getCategoryWeight(category, target.categoryScores, targetIntent);
    return Math.abs(baseWeight - targetWeight) > 0.0001;
  });

  if (sameCommit) {
    notices.push(
      `Both analyses evaluate the same commit (${baseSha.slice(0, 7)}). Code did not change between runs; score differences may reflect analysis settings, scope, analyzer behavior, or nondeterminism.`
    );
  }

  if (intentChanged) {
    notices.push(
      `Analysis project intent changed from "${baseIntent}" to "${targetIntent}". Stricter weights may affect overall maturity scores even if code is unchanged.`
    );
  }

  if (fileScopeChanged) {
    notices.push(
      fileDelta > 0
        ? `Analysis scope expanded by +${fileDelta} files (${baseFiles} → ${targetFiles} files). Additional files may introduce new findings.`
        : `Analysis scope reduced by ${Math.abs(fileDelta)} files (${baseFiles} → ${targetFiles} files).`
    );
  }

  if (categoryWeightsChanged) {
    notices.push(
      "Category scoring weights changed between runs. The normalized delta holds the baseline weights constant."
    );
  }

  return {
    intentChanged,
    categoryWeightsChanged,
    baseIntent,
    targetIntent,
    fileScopeChanged,
    fileDelta,
    sameCommit,
    normalizedScoreDelta,
    notices,
  };
}

/**
 * Calculates score attributions explaining why the score increased or decreased
 */
export function calculateAttributions(
  categoryComparisons: Record<string, CategoryComparison>,
  findingsDiff: ReturnType<typeof compareFindings>
): ScoreAttribution[] {
  const attributions: ScoreAttribution[] = [];

  for (const [catName, catComp] of Object.entries(categoryComparisons)) {
    if (!catComp.available || catComp.delta === 0 || catComp.pointContribution === 0) continue;

    const resolvedInCat = findingsDiff.resolved.filter(
      (f) => normalizeCategory(f.issue.category) === normalizeCategory(catName)
    );
    const newInCat = findingsDiff.new.filter(
      (f) => normalizeCategory(f.issue.category) === normalizeCategory(catName)
    );

    let explanation = "";
    if (catComp.delta > 0) {
      if (resolvedInCat.length > 0) {
        explanation = `Resolved ${resolvedInCat.length} issue${
          resolvedInCat.length > 1 ? "s" : ""
        } in ${catName} (e.g. "${resolvedInCat[0].issue.title}")`;
      } else {
        explanation = `${catName} dimension improved by +${catComp.delta}%`;
      }
    } else {
      if (newInCat.length > 0) {
        explanation = `Detected ${newInCat.length} new issue${
          newInCat.length > 1 ? "s" : ""
        } in ${catName} (e.g. "${newInCat[0].issue.title}")`;
      } else {
        explanation = `${catName} dimension score decreased by ${Math.abs(catComp.delta)}%`;
      }
    }

    attributions.push({
      category: catName,
      pointContribution: catComp.pointContribution,
      delta: catComp.delta,
      explanation,
      type: catComp.delta > 0 ? "positive" : "negative",
    });
  }

  // Sort by absolute point contribution descending
  return attributions.sort(
    (a, b) => Math.abs(b.pointContribution) - Math.abs(a.pointContribution)
  );
}

/**
 * Generates an executive natural language summary of the comparison
 */
export function generateComparisonSummary(
  base: AnalysisRunMetadata,
  target: AnalysisRunMetadata,
  overallDelta: number,
  findingsDiff: ReturnType<typeof compareFindings>,
  attributions: ScoreAttribution[],
  fairness: FairnessAssessment
): string {
  const deltaStr = overallDelta > 0 ? `+${overallDelta}` : `${overallDelta}`;
  const dirWord = overallDelta > 0 ? "improved" : overallDelta < 0 ? "declined" : "remained unchanged";

  const parts: string[] = [];

  parts.push(
    `Overall repository maturity ${dirWord} by ${deltaStr} points (from ${base.maturityScore} to ${target.maturityScore}/100).`
  );

  if (findingsDiff.counts.resolved > 0 || findingsDiff.counts.new > 0) {
    const findingParts: string[] = [];
    if (findingsDiff.counts.resolved > 0) {
      findingParts.push(`${findingsDiff.counts.resolved} issue(s) resolved`);
    }
    if (findingsDiff.counts.new > 0) {
      findingParts.push(`${findingsDiff.counts.new} new issue(s) introduced`);
    }
    if (findingsDiff.counts.changed > 0) {
      findingParts.push(`${findingsDiff.counts.changed} modified`);
    }
    parts.push(`Findings breakdown: ${findingParts.join(", ")}.`);
  }

  if (attributions.length > 0) {
    const top = attributions[0];
    parts.push(`Primary contributor: ${top.explanation} (${top.pointContribution > 0 ? "+" : ""}${top.pointContribution} pts).`);
  }

  if (fairness.intentChanged || fairness.categoryWeightsChanged) {
    parts.push(
      `Normalized score change holding baseline evaluation standards constant is ${
        fairness.normalizedScoreDelta > 0 ? "+" : ""
      }${fairness.normalizedScoreDelta} points.`
    );
  }

  return parts.join(" ");
}

function getRunId(run: Partial<AnalysisRunData>, fallback: string): string {
  const runWithMongoId = run as Partial<AnalysisRunData> & {
    _id?: { toString(): string };
  };
  return runWithMongoId._id?.toString() || run.runId || fallback;
}

/**
 * Main Comparison Function: Compares any two analysis runs or reports
 */
export function compareAnalyses(
  base: Partial<AnalysisRunData>,
  target: Partial<AnalysisRunData>
): AnalysisComparisonResult {
  const baseScore = Math.round(base.maturityScore ?? 0);
  const targetScore = Math.round(target.maturityScore ?? 0);
  const overallDelta = targetScore - baseScore;

  const baseLevel = base.level || "Unknown";
  const targetLevel = target.level || "Unknown";
  const levelChanged = baseLevel !== targetLevel;

  const baseReady = Boolean(base.isProductionReady);
  const targetReady = Boolean(target.isProductionReady);
  const readinessChanged = baseReady !== targetReady;

  const baseIntent = base.projectContext?.intent || "portfolio";
  const targetIntent = target.projectContext?.intent || baseIntent;
  // Aggregate issues
  const baseAllIssues: Issue[] = [
    ...(base.dangerousIssues || []),
    ...(base.missingImprovements || []),
  ];
  const targetAllIssues: Issue[] = [
    ...(target.dangerousIssues || []),
    ...(target.missingImprovements || []),
  ];

  // Compare findings
  const findingsDiff = compareFindings(baseAllIssues, targetAllIssues);

  // Compare Category Scores
  const categoryNames = new Set<string>([
    "security",
    "architecture",
    "testing",
    "completeness",
    "readiness",
    "maintainability",
    ...Object.keys(base.categoryScores || {}),
    ...Object.keys(target.categoryScores || {}),
  ]);

  const categoryComparisons: Record<string, CategoryComparison> = {};

  for (const cat of categoryNames) {
    const normCat = cat.toLowerCase();
    const baseCat = getCategoryScore(base.categoryScores, cat);
    const targetCat = getCategoryScore(target.categoryScores, cat);
    const available = Boolean(baseCat && targetCat);

    const baseCatScore = Math.round(baseCat?.score ?? 0);
    const targetCatScore = Math.round(targetCat?.score ?? 0);
    const delta = available ? targetCatScore - baseCatScore : 0;

    const baseWeight = getCategoryWeight(normCat, base.categoryScores, baseIntent);
    const targetWeight = getCategoryWeight(normCat, target.categoryScores, targetIntent);
    const weight = baseWeight;
    const pointContribution = 0;

    const status: "improved" | "degraded" | "unchanged" =
      delta > 0 ? "improved" : delta < 0 ? "degraded" : "unchanged";

    const newInCat = findingsDiff.new.filter(
      (f) => normalizeCategory(f.issue.category) === normalizeCategory(normCat)
    ).length;
    const resolvedInCat = findingsDiff.resolved.filter(
      (f) => normalizeCategory(f.issue.category) === normalizeCategory(normCat)
    ).length;
    const persistentInCat = findingsDiff.persistent.filter(
      (f) => normalizeCategory(f.issue.category) === normalizeCategory(normCat)
    ).length;
    const changedInCat = findingsDiff.changed.filter(
      (f) => normalizeCategory(f.issue.category) === normalizeCategory(normCat)
    ).length;

    categoryComparisons[normCat] = {
      category: normCat.charAt(0).toUpperCase() + normCat.slice(1),
      available,
      baseScore: baseCatScore,
      targetScore: targetCatScore,
      delta,
      weight,
      baseWeight,
      targetWeight,
      pointContribution,
      status,
      issuesSummary: {
        new: newInCat,
        resolved: resolvedInCat,
        persistent: persistentInCat,
        changed: changedInCat,
        totalTarget: newInCat + persistentInCat + changedInCat,
      },
    };
  }

  const availableWeightTotal = Object.values(categoryComparisons)
    .filter((comparison) => comparison.available)
    .reduce((sum, comparison) => sum + comparison.baseWeight, 0);
  for (const comparison of Object.values(categoryComparisons)) {
    comparison.pointContribution = availableWeightTotal > 0 && comparison.available
      ? Number((comparison.delta * comparison.baseWeight / availableWeightTotal).toFixed(1))
      : 0;
  }

  // Assess fairness
  const baseRunData: AnalysisRunData = {
    id: getRunId(base, "base"),
    commitSha: base.commitSha,
    commitMessage: base.commitMessage,
    branch: base.branch,
    commitAuthor: base.commitAuthor,
    analyzedAt: base.analyzedAt || new Date(0),
    maturityScore: baseScore,
    level: baseLevel,
    isProductionReady: baseReady,
    intent: baseIntent,
    selectedFilesCount: base.selectedFilesCount || 0,
    projectContext: base.projectContext,
    categoryScores: base.categoryScores,
  };

  const targetRunData: AnalysisRunData = {
    id: getRunId(target, "target"),
    commitSha: target.commitSha,
    commitMessage: target.commitMessage,
    branch: target.branch,
    commitAuthor: target.commitAuthor,
    analyzedAt: target.analyzedAt || new Date(),
    maturityScore: targetScore,
    level: targetLevel,
    isProductionReady: targetReady,
    intent: targetIntent,
    selectedFilesCount: target.selectedFilesCount || 0,
    projectContext: target.projectContext,
    categoryScores: target.categoryScores,
  };

  const fairness = assessFairness(baseRunData, targetRunData, categoryComparisons);
  const attributions = calculateAttributions(categoryComparisons, findingsDiff);
  const summary = generateComparisonSummary(
    baseRunData,
    targetRunData,
    overallDelta,
    findingsDiff,
    attributions,
    fairness
  );

  return {
    baseRun: baseRunData,
    targetRun: targetRunData,
    overallDelta,
    levelChanged,
    readinessChanged,
    categoryComparisons,
    findings: findingsDiff,
    attributions,
    summary,
    fairness,
  };
}
