import type {
  PullRequestFile,
  ParsedDiffHunk,
  ParsedFileDiff,
} from "@/types/pr";

/**
 * Parses unified diff patch text into structured hunks and line arrays.
 */
export function parsePatch(patch: string): {
  hunks: ParsedDiffHunk[];
  addedLines: number[];
  deletedLines: number[];
} {
  const hunks: ParsedDiffHunk[] = [];
  const addedLines: number[] = [];
  const deletedLines: number[] = [];

  if (!patch) {
    return { hunks, addedLines, deletedLines };
  }

  const lines = patch.split("\n");
  let currentHunk: ParsedDiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;

  for (const line of lines) {
    // Hunk header: @@ -oldStart[,oldLines] +newStart[,newLines] @@
    if (line.startsWith("@@")) {
      const match = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
      if (match) {
        if (currentHunk) {
          hunks.push(currentHunk);
        }

        const oldStart = parseInt(match[1], 10);
        const oldLinesCount = match[2] !== undefined ? parseInt(match[2], 10) : 1;
        const newStart = parseInt(match[3], 10);
        const newLinesCount = match[4] !== undefined ? parseInt(match[4], 10) : 1;

        oldLine = oldStart;
        newLine = newStart;

        currentHunk = {
          oldStart,
          oldLines: oldLinesCount,
          newStart,
          newLines: newLinesCount,
          header: line,
          lines: [],
        };
      }
      continue;
    }

    if (!currentHunk) {
      continue;
    }

    currentHunk.lines.push(line);

    if (line.startsWith("+")) {
      addedLines.push(newLine);
      newLine++;
    } else if (line.startsWith("-")) {
      deletedLines.push(oldLine);
      oldLine++;
    } else if (line.startsWith(" ")) {
      oldLine++;
      newLine++;
    } else if (line.startsWith("\\")) {
      // "\\ No newline at end of file" - does not advance line numbers
    }
  }

  if (currentHunk) {
    hunks.push(currentHunk);
  }

  return { hunks, addedLines, deletedLines };
}

/**
 * Normalizes file paths for consistent map keys
 */
export function normalizeFilePath(path?: string): string {
  if (!path) return "";
  return path.toLowerCase().replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

/**
 * Parses all PullRequestFiles into a normalized map of ParsedFileDiff
 */
export function parsePullRequestFiles(
  files: PullRequestFile[]
): Map<string, ParsedFileDiff> {
  const diffMap = new Map<string, ParsedFileDiff>();

  for (const file of files) {
    const { hunks, addedLines, deletedLines } = parsePatch(file.patch || "");
    const normalized = normalizeFilePath(file.filename);

    diffMap.set(normalized, {
      filename: file.filename,
      status: file.status,
      previousFilename: file.previousFilename,
      addedLines,
      deletedLines,
      hunks,
    });
  }

  return diffMap;
}

/**
 * Checks whether a given line number falls within the added/modified lines of a file
 */
export function isLineInAddedRanges(
  lineNumber: number | undefined,
  addedLines: number[],
  tolerance = 1
): boolean {
  if (!lineNumber || lineNumber <= 0 || addedLines.length === 0) {
    return false;
  }

  // Exact match
  if (addedLines.includes(lineNumber)) {
    return true;
  }

  // Tolerance check (within +/- tolerance lines of a diff addition)
  if (tolerance > 0) {
    return addedLines.some(
      (added) => Math.abs(added - lineNumber) <= tolerance
    );
  }

  return false;
}

/**
 * Checks if a multi-line range [startLine, endLine] intersects with added/modified lines
 */
export function isRangeOverlappingAddedLines(
  startLine: number | undefined,
  endLine: number | undefined,
  addedLines: number[]
): boolean {
  if (!startLine && !endLine) return false;
  const start = startLine || endLine || 1;
  const end = endLine || startLine || start;

  return addedLines.some((line) => line >= start && line <= end);
}
