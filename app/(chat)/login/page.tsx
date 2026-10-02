// LoginPage.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { ArrowRight, CircleAlert, Eye, EyeOff, Terminal } from "lucide-react";
import { login } from "@/services/auth-service";
import type { LoginData } from "@/types/auth";
import { signIn } from "next-auth/react";
import { AccessGrantedModal, PerimeterAlertModal } from "@/components/modals/Modals";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [githubError, setGithubError] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { login: setAuthUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const timeout = window.setTimeout(() => {
      setGithubError(params.has("error"));
      setRegistrationComplete(params.get("registered") === "1");
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleGitHubLogin = () => {
    signIn("github", {
      callbackUrl: "/dashboard",
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowErrorModal(false);
    
    try {
      const loginData: LoginData = { email, password };
      const { user } = await login(loginData);
      setAuthUser(user);
      setShowSuccessModal(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Invalid email or password. Please try again.");
      setShowErrorModal(true);
      console.log(err);
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
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1.5 text-sm leading-6 text-zinc-400">Sign in to continue to your workspace.</p>
        </div>

        {/* GitHub button */}
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded border border-white/10 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
        >
          <FaGithub size={17} />
          Continue with GitHub
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-zinc-500">or with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        {githubError && (
          <div role="alert" className="mb-4 flex items-start gap-2 rounded border border-rose-200/15 bg-rose-200/[0.04] px-3 py-2.5 text-sm text-rose-100">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-200" />
            <span>GitHub sign-in didn’t complete. Try again or continue with email.</span>
          </div>
        )}
        {registrationComplete && (
          <p role="status" className="mb-4 rounded border border-emerald-200/15 bg-emerald-200/[0.04] px-3 py-2.5 text-sm text-emerald-100">
            Account created. Sign in to continue.
          </p>
        )}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-zinc-300">
              Password
              </label>
            </div>
            <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="h-11 w-full rounded border border-white/10 bg-[#090c0f] px-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-200/30 placeholder:text-zinc-600"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 hover:text-white">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            </div>
          </div>

          {error && (
            <p className="rounded border border-rose-200/15 bg-rose-200/[0.04] px-3 py-2.5 text-sm text-rose-100">
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
                Logging in...
              </div>
            ) : (
              <>
                Log In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center">
          <p className="text-sm text-zinc-400">
            New to GitInsight?{" "}
            <Link href="/register" className="font-medium text-cyan-100 transition-colors hover:text-cyan-200">
              Create an account
            </Link>
          </p>

        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="w-full max-w-[500px] mx-4">
            <AccessGrantedModal 
              onDashboardClick={() => {
                setShowSuccessModal(false);
                window.location.assign("/dashboard");
              }}
            />
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="w-full max-w-[500px] mx-4">
            <PerimeterAlertModal 
              message={error || undefined}
              onRetry={() => {
                setShowErrorModal(false);
                setError(null);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}