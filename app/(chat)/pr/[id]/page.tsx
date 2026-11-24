import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import PullRequestReport from "@/models/PullRequestReport";
import { PullRequestAnalysisView } from "@/components/analysis/PullRequestAnalysisView";
import type { PullRequestAnalysisResult } from "@/types/pr";

interface PRPageProps {
  params: Promise<{ id: string }>;
}

async function getPRReport(id: string): Promise<PullRequestAnalysisResult | null> {
  await dbConnect();

  try {
    const doc = await PullRequestReport.findById(id).lean();
    if (!doc) return null;

    return {
      reportId: (doc as any)._id.toString(),
      repoUrl: (doc as any).repoUrl,
      repoName: (doc as any).repoName,
      prNumber: (doc as any).prNumber,
      prTitle: (doc as any).prTitle,
      prAuthor: (doc as any).prAuthor,
      prAuthorAvatar: (doc as any).prAuthorAvatar,
      baseSha: (doc as any).baseSha,
      headSha: (doc as any).headSha,
      baseBranch: (doc as any).baseBranch,
      headBranch: (doc as any).headBranch,
      status: (doc as any).status || "open",
      verdict: (doc as any).verdict,
      verdictReason: (doc as any).verdictReason,
      scoreDelta: (doc as any).scoreDelta,
      baseScore: (doc as any).baseScore,
      headScore: (doc as any).headScore,
      changedFilesCount: (doc as any).changedFilesCount,
      additions: (doc as any).additions,
      deletions: (doc as any).deletions,
      counts: (doc as any).counts,
      introducedIssues: (doc as any).introducedIssues || [],
      resolvedIssues: (doc as any).resolvedIssues || [],
      persistentIssues: (doc as any).persistentIssues || [],
      worsenedIssues: (doc as any).worsenedIssues || [],
      improvedIssues: (doc as any).improvedIssues || [],
      summary: (doc as any).summary || "",
      analyzedAt: (doc as any).analyzedAt
        ? new Date((doc as any).analyzedAt).toISOString()
        : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export default async function PullRequestReportPage({ params }: PRPageProps) {
  const { id } = await params;
  const report = await getPRReport(id);

  if (!report) {
    notFound();
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-8 lg:px-8 hide-scrollbar">
      <PullRequestAnalysisView analysis={report} />
    </div>
  );
}
