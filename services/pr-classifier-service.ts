import type { Issue, IssueSeverity } from "@/types/analysis";
import type {
  ParsedFileDiff,
  ClassifiedPRFinding,
  PRVerdict,
} from "@/types/pr";
import {
  normalizeFilePath,
  isLineInAddedRanges,
  isRangeOverlappingAddedLines,
} from "./diff-parser-service";
import { getFindingFingerprint } from "./comparison-service";

const SEVERITY_ORDER: Record<IssueSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function normalizeCategory(category?: string): string {
  return (category || "general").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface PRClassificationResult {
  introducedIssues: ClassifiedPRFinding[];
  resolvedIssues: ClassifiedPRFinding[];
  persistentIssues: ClassifiedPRFinding[];
  worsenedIssues: ClassifiedPRFinding[];
  improvedIssues: ClassifiedPRFinding[];
  counts: {
    introduced: number;
    resolved: number;
    persistent: number;
    worsened: number;
    improved: number;
  };
  verdict: PRVerdict;
  verdictReason: string;
}

/**
 * Deterministically classifies findings between Base and Head commits
 * against the PR Git diff hunks.
 */
export function classifyPullRequestFindings(
  baseIssues: Issue[],
  headIssues: Issue[],
  diffMap: Map<string, ParsedFileDiff>,
  scoreDelta: number
): PRClassificationResult {
  const baseEntries = baseIssues.map((issue) => {
    const fingerprint = issue.fingerprint || getFindingFingerprint(issue);
    return {
      issue: { ...issue, fingerprint },
      fingerprint,
      matched: false,
    };
  });

  const exactMatches = new Map<string, typeof baseEntries>();
  const categoryTitleMatches = new Map<string, typeof baseEntries>();

  for (const entry of baseEntries) {
    const stableKey = `${normalizeCategory(entry.issue.category)}::${normalizeTitle(entry.issue.title)}`;
    
    const exactList = exactMatches.get(entry.fingerprint) || [];
    exactList.push(entry);
    exactMatches.set(entry.fingerprint, exactList);

    const stableList = categoryTitleMatches.get(stableKey) || [];
    stableList.push(entry);
    categoryTitleMatches.set(stableKey, stableList);
  }

  const introducedIssues: ClassifiedPRFinding[] = [];
  const persistentIssues: ClassifiedPRFinding[] = [];
  const worsenedIssues: ClassifiedPRFinding[] = [];
  const improvedIssues: ClassifiedPRFinding[] = [];

  for (const headIssue of headIssues) {
    const fingerprint = headIssue.fingerprint || getFindingFingerprint(headIssue);
    const enrichedHeadIssue: Issue = { ...headIssue, fingerprint };
    const stableKey = `${normalizeCategory(headIssue.category)}::${normalizeTitle(headIssue.title)}`;

    const normFile = normalizeFilePath(headIssue.file);
    const fileDiff = diffMap.get(normFile);

    const baseEntry =
      exactMatches.get(fingerprint)?.find((e) => !e.matched) ||
      categoryTitleMatches.get(stableKey)?.find((e) => !e.matched);

    if (!baseEntry) {
      // Finding does NOT exist in Base commit
      const isFileNewlyAdded = fileDiff?.status === "added";
      const isLineInDiff = fileDiff
        ? isLineInAddedRanges(headIssue.lineNumber, fileDiff.addedLines, 2) ||
          isRangeOverlappingAddedLines(
            headIssue.startLine,
            headIssue.endLine,
            fileDiff.addedLines
          )
        : false;

      const introducedInLines = isFileNewlyAdded || isLineInDiff;
      const state = introducedInLines ? "introduced" : "collateral_introduced";

      introducedIssues.push({
        state,
        issue: enrichedHeadIssue,
        fingerprint,
        introducedInLineRange: introducedInLines,
        fileStatus: fileDiff?.status,
        changeSummary: introducedInLines
          ? `Newly introduced in PR diff (${headIssue.file}${headIssue.lineNumber ? `:${headIssue.lineNumber}` : ""})`
          : `Surfaced in repo outside direct PR diff hunks (${headIssue.file})`,
      });
    } else {
      // Finding matched in Base commit
      baseEntry.matched = true;
      const baseIssue = baseEntry.issue;

      const baseSev = (baseIssue.severity || "low").toLowerCase() as IssueSeverity;
      const headSev = (headIssue.severity || "low").toLowerCase() as IssueSeverity;
      const baseRank = SEVERITY_ORDER[baseSev] || 1;
      const headRank = SEVERITY_ORDER[headSev] || 1;

      if (headRank > baseRank) {
        worsenedIssues.push({
          state: "worsened",
          issue: enrichedHeadIssue,
          previousIssue: baseIssue,
          fingerprint,
          fileStatus: fileDiff?.status,
          changeSummary: `Severity escalated from ${baseSev} to ${headSev}`,
        });
      } else if (headRank < baseRank) {
        improvedIssues.push({
          state: "improved",
          issue: enrichedHeadIssue,
          previousIssue: baseIssue,
          fingerprint,
          fileStatus: fileDiff?.status,
          changeSummary: `Severity improved from ${baseSev} to ${headSev}`,
        });
      } else {
        const lineMoved =
          headIssue.lineNumber &&
          baseIssue.lineNumber &&
          headIssue.lineNumber !== baseIssue.lineNumber;

        persistentIssues.push({
          state: "persistent",
          issue: enrichedHeadIssue,
          previousIssue: baseIssue,
          fingerprint,
          fileStatus: fileDiff?.status,
          changeSummary: lineMoved
            ? `Persistent issue (line moved from :${baseIssue.lineNumber} to :${headIssue.lineNumber})`
            : "Pre-existing issue unchanged in this PR",
        });
      }
    }
  }

  // Identify resolved issues from unmatched base entries
  const resolvedIssues: ClassifiedPRFinding[] = [];

  for (const baseEntry of baseEntries) {
    if (!baseEntry.matched) {
      const baseIssue = baseEntry.issue;
      const normFile = normalizeFilePath(baseIssue.file);
      const fileDiff = diffMap.get(normFile);

      const isFileRemoved = fileDiff?.status === "removed";
      const isLineDeleted = fileDiff
        ? fileDiff.deletedLines.includes(baseIssue.lineNumber || -1)
        : false;

      const resolvedByDiff = isFileRemoved || isLineDeleted || Boolean(fileDiff);
      const state = resolvedByDiff ? "resolved" : "collateral_resolved";

      resolvedIssues.push({
        state,
        issue: baseIssue,
        fingerprint: baseEntry.fingerprint,
        fileStatus: fileDiff?.status,
        changeSummary: resolvedByDiff
          ? `Issue resolved by PR changes in ${baseIssue.file}`
          : `Issue resolved outside direct file diff`,
      });
    }
  }

  // Compute PR Verdict
  const { verdict, verdictReason } = determinePRVerdict(
    introducedIssues,
    worsenedIssues,
    scoreDelta
  );

  return {
    introducedIssues,
    resolvedIssues,
    persistentIssues,
    worsenedIssues,
    improvedIssues,
    counts: {
      introduced: introducedIssues.length,
      resolved: resolvedIssues.length,
      persistent: persistentIssues.length,
      worsened: worsenedIssues.length,
      improved: improvedIssues.length,
    },
    verdict,
    verdictReason,
  };
}

function determinePRVerdict(
  introduced: ClassifiedPRFinding[],
  worsened: ClassifiedPRFinding[],
  scoreDelta: number
): { verdict: PRVerdict; verdictReason: string } {
  const criticalOrHighIntroduced = introduced.filter((f) =>
    ["critical", "high"].includes(f.issue.severity.toLowerCase())
  );
  const criticalOrHighWorsened = worsened.filter((f) =>
    ["critical", "high"].includes(f.issue.severity.toLowerCase())
  );

  if (criticalOrHighIntroduced.length > 0 || criticalOrHighWorsened.length > 0) {
    const reasons: string[] = [];
    if (criticalOrHighIntroduced.length > 0) {
      reasons.push(
        `${criticalOrHighIntroduced.length} critical/high issue(s) introduced`
      );
    }
    if (criticalOrHighWorsened.length > 0) {
      reasons.push(`${criticalOrHighWorsened.length} issue(s) escalated in severity`);
    }
    return {
      verdict: "blocked",
      verdictReason: `PR blocked: ${reasons.join(" and ")}.`,
    };
  }

  const mediumIntroduced = introduced.filter(
    (f) => f.issue.severity.toLowerCase() === "medium"
  );

  if (mediumIntroduced.length > 0 || scoreDelta < -5) {
    const reasons: string[] = [];
    if (mediumIntroduced.length > 0) {
      reasons.push(`${mediumIntroduced.length} medium-priority issue(s) introduced`);
    }
    if (scoreDelta < -5) {
      reasons.push(`overall health score decreased by ${Math.abs(scoreDelta)} points`);
    }
    return {
      verdict: "needs_work",
      verdictReason: `PR requires attention: ${reasons.join("; ")}.`,
    };
  }

  return {
    verdict: "approved",
    verdictReason: "Clean review: No critical or high issues introduced in this PR.",
  };
}
