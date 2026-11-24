import { describe, it, expect } from "vitest";
import {
  parsePatch,
  normalizeFilePath,
  isLineInAddedRanges,
  isRangeOverlappingAddedLines,
  parsePullRequestFiles,
} from "@/services/diff-parser-service";

describe("Diff Parser Service", () => {
  it("normalizes file paths correctly across Windows and POSIX separators", () => {
    expect(normalizeFilePath("src\\services\\auth.ts")).toBe("src/services/auth.ts");
    expect(normalizeFilePath("./components/Header.tsx")).toBe("components/header.tsx");
    expect(normalizeFilePath("   APP/API/ROUTE.TS  ")).toBe("app/api/route.ts");
  });

  it("parses unified diff patch into added and deleted lines", () => {
    const patch = `@@ -10,4 +10,6 @@
 import express from 'express';
+import cors from 'cors';
 const app = express();
+app.use(cors());
-app.listen(3000);
+app.listen(8080);`;

    const { hunks, addedLines, deletedLines } = parsePatch(patch);

    expect(hunks).toHaveLength(1);
    expect(hunks[0].oldStart).toBe(10);
    expect(hunks[0].newStart).toBe(10);

    // Added lines:
    // line 10: context (old:10, new:10)
    // line 11: +import cors (new:11)
    // line 12: context (old:11, new:12)
    // line 13: +app.use(cors()) (new:13)
    // line 12 (old): -app.listen(3000) (old:12)
    // line 14: +app.listen(8080) (new:14)
    expect(addedLines).toContain(11);
    expect(addedLines).toContain(13);
    expect(addedLines).toContain(14);
    expect(deletedLines).toContain(12);
  });

  it("identifies whether a line number falls within added diff ranges", () => {
    const addedLines = [15, 16, 17, 45, 46];

    expect(isLineInAddedRanges(16, addedLines)).toBe(true);
    expect(isLineInAddedRanges(18, addedLines, 1)).toBe(true); // Within tolerance 1
    expect(isLineInAddedRanges(30, addedLines)).toBe(false);
    expect(isLineInAddedRanges(undefined, addedLines)).toBe(false);
  });

  it("checks range overlap between findings and added lines", () => {
    const addedLines = [25, 26, 27];

    expect(isRangeOverlappingAddedLines(20, 25, addedLines)).toBe(true);
    expect(isRangeOverlappingAddedLines(26, 30, addedLines)).toBe(true);
    expect(isRangeOverlappingAddedLines(1, 10, addedLines)).toBe(false);
  });

  it("parses pull request files into structured map", () => {
    const prFiles = [
      {
        filename: "src/auth.ts",
        status: "modified" as const,
        additions: 5,
        deletions: 2,
        changes: 7,
        patch: "@@ -1,2 +1,3 @@\n const a = 1;\n+const b = 2;\n",
      },
      {
        filename: "src/deleted.ts",
        status: "removed" as const,
        additions: 0,
        deletions: 10,
        changes: 10,
      },
    ];

    const diffMap = parsePullRequestFiles(prFiles);
    expect(diffMap.has("src/auth.ts")).toBe(true);
    expect(diffMap.get("src/auth.ts")?.addedLines).toContain(2);
    expect(diffMap.has("src/deleted.ts")).toBe(true);
    expect(diffMap.get("src/deleted.ts")?.status).toBe("removed");
  });
});
