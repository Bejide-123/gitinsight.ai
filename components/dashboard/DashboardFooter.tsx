export function DashboardFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 border-t border-white/[0.08] px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <span>GitInsight repository intelligence</span>
      <span>© {new Date().getFullYear()} GitInsight</span>
    </footer>
  );
}