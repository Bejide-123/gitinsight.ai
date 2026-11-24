// LoginPage.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { ArrowRight, CircleAlert, Eye, EyeOff, Terminal } from "lucide-react";
import { login } from "@/services/auth-service";
import type { LoginData } from "@/types/auth";
import { signIn } from "next-auth/react";
import { useAuth } from "@/app/context/AuthContext";
import { loginSchema } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    const parsedLogin = loginSchema.safeParse({ email, password });
    if (!parsedLogin.success) {
      setError(parsedLogin.error.issues[0]?.message || "Enter valid login details.");
      return;
    }

    setLoading(true);
    try {
      const loginData: LoginData = parsedLogin.data;
      const { user } = await login(loginData);
      setAuthUser(user);
      router.replace("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Invalid email or password. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080b] px-4 py-24 sm:px-6">
      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0f16] p-6 shadow-2xl sm:p-8">
        <Link href="/" className="mb-7 inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-white">GitInsight</span>
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
          <p className="mt-1 text-xs text-zinc-400">Sign in to continue to your workspace.</p>
        </div>

        {/* GitHub button */}
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <FaGithub size={16} />
          Continue with GitHub
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">or with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        {githubError && (
          <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2 text-xs text-rose-200">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
            <span>GitHub sign-in didn&apos;t complete. Try again or continue with email.</span>
          </div>
        )}
        {registrationComplete && (
          <p role="status" className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] px-3 py-2 text-xs text-emerald-300">
            Account created successfully. Sign in to continue.
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
              className="h-10 w-full rounded-lg border border-white/10 bg-[#08090e] px-3 text-xs text-white outline-none transition focus:border-white/20 placeholder:text-zinc-600"
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
                className="h-10 w-full rounded-lg border border-white/10 bg-[#08090e] px-3 pr-10 text-xs text-white outline-none transition focus:border-white/20 placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Logging in...
              </div>
            ) : (
              <>
                Log In
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-white hover:underline">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
