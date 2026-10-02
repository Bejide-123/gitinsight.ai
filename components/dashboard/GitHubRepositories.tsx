"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitFork, LockKeyhole, Search, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useGitHubRepos } from "@/hooks/useGithubRepos";
import { startGitHubConnection } from "@/services/github-auth";
import type { DashboardGitHubRepository } from "@/types/github";

interface GitHubRepositoriesProps {
  connected: boolean;
}

export function GitHubRepositories({ connected }: GitHubRepositoriesProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { data, isLoading, error, refetch, isPlaceholderData } = useGitHubRepos(
    connected,
    page,
    perPage,
  );
  const repositories = data?.repositories ?? [];
  const [search, setSearch] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return repositories;
    return repositories.filter((repository) =>
      `${repository.fullName} ${repository.description ?? ""} ${repository.language ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [repositories, search]);

  const connectGitHub = async () => {
    setIsConnecting(true);
    setConnectError(null);
    try {
      await startGitHubConnection();
    } catch {
      setConnectError("Could not start GitHub connection. Please try again.");
      setIsConnecting(false);
    }
  };

  const changePerPage = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const analyzeRepository = (repository: DashboardGitHubRepository) => {
    router.push(
      `/chat/${repository.id}?repoUrl=${encodeURIComponent(repository.htmlUrl)}`,
    );
  };

  return (
    <section className="min-w-0 border-t border-white/[0.08] pt-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Your repositories</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose a repository to start an analysis.
          </p>
        </div>
        {connected && !error && repositories.length > 0 && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex h-10 w-full items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-3 text-zinc-400 focus-within:border-cyan-300/40 sm:max-w-[240px]">
              <Search className="h-4 w-4 shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filter this page"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>
            <label className="flex h-10 items-center gap-2 rounded border border-white/10 px-3 text-xs text-zinc-400">
              <span>Per page</span>
              <select
                value={perPage}
                onChange={(event) => changePerPage(Number(event.target.value))}
                className="bg-transparent text-sm text-white outline-none"
                aria-label="Repositories per page"
              >
                {[5, 10, 20].map((count) => (
                  <option key={count} value={count} className="bg-zinc-900">
                    {count}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {!connected ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <FaGithub className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" />
            <div>
              <p className="text-sm font-medium text-white">Connect GitHub to browse your repositories</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Repository access is used to list and analyze the projects you can access.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={connectGitHub}
            disabled={isConnecting}
            className="shrink-0 rounded bg-white px-3.5 py-2 text-sm font-medium text-zinc-950 transition hover:bg-cyan-200 disabled:opacity-60"
          >
            {isConnecting ? "Connecting..." : "Connect GitHub"}
          </button>
        </div>
      ) : isLoading && !data ? (
        <div className="flex flex-col gap-2" aria-label="Loading repositories">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-[82px] animate-pulse rounded-lg border border-white/[0.08] bg-[#0d1115]" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-amber-200/15 bg-amber-200/[0.04] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-100">{error.message}</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded border border-white/10 px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.05]"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={connectGitHub}
              disabled={isConnecting}
              className="rounded bg-white px-3 py-2 text-xs font-medium text-zinc-950 transition hover:bg-cyan-200 disabled:opacity-60"
            >
              {isConnecting ? "Connecting..." : "Reconnect GitHub"}
            </button>
          </div>
        </div>
      ) : repositories.length === 0 && page === 1 ? (
        <div className="rounded-lg border border-dashed border-white/15 px-5 py-8 text-center">
          <p className="text-sm font-medium text-white">No repositories found</p>
          <p className="mt-1 text-xs text-zinc-500">Repositories you can access will appear here.</p>
        </div>
      ) : filteredRepositories.length === 0 ? (
        <div className="rounded-lg border border-white/10 px-5 py-8 text-center text-sm text-zinc-500">
          {search
            ? `No repositories on this page match “${search}”.`
            : "No repositories on this page."}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredRepositories.map((repository) => (
            <RepositoryRow
              key={repository.id}
              repository={repository}
              onAnalyze={() => analyzeRepository(repository)}
            />
          ))}
        </div>
      )}
      {connected && !error && data && data.totalPages > 0 && (
        <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Page {page}{data.totalPages > 1 ? ` of ${data.totalPages}` : ""}
            {isPlaceholderData && <span className="ml-2">Loading page...</span>}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || isPlaceholderData}
              className="inline-flex h-9 items-center gap-2 rounded border border-white/10 px-3 text-xs text-zinc-200 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!data.hasNextPage || isPlaceholderData}
              className="inline-flex h-9 items-center gap-2 rounded border border-white/10 px-3 text-xs text-zinc-200 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
      {connectError && <p role="alert" className="mt-3 text-sm text-red-300">{connectError}</p>}
    </section>
  );
}

function RepositoryRow({
  repository,
  onAnalyze,
}: {
  repository: DashboardGitHubRepository;
  onAnalyze: () => void;
}) {
  const updatedAt = new Date(repository.updatedAt);
  const updatedLabel = Number.isNaN(updatedAt.getTime())
    ? "Updated date unavailable"
    : `Updated ${formatDistanceToNow(updatedAt, { addSuffix: true })}`;

  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-lg border border-white/[0.08] bg-[#0d1115] px-4 py-3 transition hover:border-white/20 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-zinc-300">
          {repository.isPrivate ? <LockKeyhole className="h-4 w-4" /> : <FaGithub className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="max-w-full truncate text-sm font-medium text-white">{repository.fullName}</h3>
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400">
              {repository.isPrivate ? "Private" : "Public"}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {repository.description || updatedLabel}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
            {repository.language && <span>{repository.language}</span>}
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{repository.stars}</span>
            <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" />{repository.forks}</span>
            <span>{updatedLabel}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onAnalyze}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded bg-cyan-300 px-3.5 text-xs font-semibold text-[#071013] transition hover:bg-cyan-200 sm:min-w-28"
      >
        Analyze
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}