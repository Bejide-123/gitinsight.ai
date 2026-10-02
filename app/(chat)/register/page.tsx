// RegisterPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { ArrowRight, CircleAlert, Eye, EyeOff, Terminal } from "lucide-react";
import { register } from "@/services/auth-service";
import type { RegisterData } from "@/types/auth";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGitHubSignup = () => {
    void signIn("github", { callbackUrl: "/dashboard" });
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const RegisterData: RegisterData = { name, email, password };
      await register(RegisterData);
      window.location.assign("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090c] px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_55%)]" />
      <section className="relative w-full max-w-md rounded-lg border border-white/[0.09] bg-[#0d1115] p-5 shadow-2xl shadow-black/30 sm:p-7">
        <Link href="/" className="mb-7 inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.05]">
            <Terminal className="h-4 w-4 text-cyan-100" />
          </span>
          <span className="text-sm font-semibold text-white">GitInsight</span>
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Create your account</h1>
          <p className="mt-1.5 text-sm leading-6 text-zinc-400">Start reviewing repository health in your workspace.</p>
        </div>

        {/* GitHub button */}
        <button
          type="button"
          onClick={handleGitHubSignup}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded border border-white/10 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
        >
          <FaGithub size={18} />
          Sign up with GitHub
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] text-zinc-500">or with email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              autoComplete="name"
              required
              className="h-11 w-full rounded border border-white/10 bg-[#090c0f] px-3 text-sm text-white outline-none transition focus:border-cyan-200/30 placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev@company.ai"
              autoComplete="email"
              required
              className="h-11 w-full rounded border border-white/10 bg-[#090c0f] px-3 text-sm text-white outline-none transition focus:border-cyan-200/30 placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Password
            </label>
            <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
              className="h-11 w-full rounded border border-white/10 bg-[#090c0f] px-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-200/30 placeholder:text-zinc-600"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 hover:text-white">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Confirm Password
            </label>
            <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              className="h-11 w-full rounded border border-white/10 bg-[#090c0f] px-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-200/30 placeholder:text-zinc-600"
            />
            <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 hover:text-white">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="flex items-start gap-2 rounded border border-rose-200/15 bg-rose-200/[0.04] px-3 py-2.5 text-sm text-rose-100">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-200" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded bg-cyan-300 text-sm font-semibold text-[#071013] transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-cyan-100 transition-colors hover:text-cyan-200">
              Sign in
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}