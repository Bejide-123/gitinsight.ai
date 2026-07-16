// RegisterPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { Sparkles } from "lucide-react";
import { register } from "@/services/auth-service";
import { RegisterData } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [signupHovered, setSignupHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGitHubSignup = () => {
    // Wire to your GitHub OAuth provider
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
      router.push("/login");
    } catch (err) {
      setError("Registration failed. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 font-['Inter',-apple-system,sans-serif]">
      <div className="w-full max-w-[440px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 backdrop-blur-xl shadow-2xl shadow-purple-500/5">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20 flex items-center justify-center mb-4 group hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500">
            <div className="absolute inset-0 bg-purple-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-sm text-zinc-400 mt-1">Join GitInsight AI today</p>
        </div>

        {/* GitHub button */}
        <button
          onClick={handleGitHubSignup}
          onMouseEnter={() => setGithubHovered(true)}
          onMouseLeave={() => setGithubHovered(false)}
          className={`w-full h-12 flex items-center justify-center gap-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            githubHovered
              ? "bg-white/10 text-white border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
          }`}
        >
          <FaGithub size={18} />
          Sign up with GitHub
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] tracking-[0.2em] text-zinc-500 font-medium uppercase">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Ada Lovelace"
              className={`w-full h-12 px-4 bg-white/5 border rounded-xl text-white text-sm outline-none transition-all duration-300 placeholder:text-zinc-600 ${
                nameFocused
                  ? "border-purple-500/50 bg-white/10 shadow-[0_0_30px_rgba(168,85,247,0.05)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="dev@company.ai"
              className={`w-full h-12 px-4 bg-white/5 border rounded-xl text-white text-sm outline-none transition-all duration-300 placeholder:text-zinc-600 ${
                emailFocused
                  ? "border-purple-500/50 bg-white/10 shadow-[0_0_30px_rgba(168,85,247,0.05)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="••••••••"
              className={`w-full h-12 px-4 bg-white/5 border rounded-xl text-white text-sm outline-none transition-all duration-300 placeholder:text-zinc-600 ${
                passwordFocused
                  ? "border-purple-500/50 bg-white/10 shadow-[0_0_30px_rgba(168,85,247,0.05)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              placeholder="••••••••"
              className={`w-full h-12 px-4 bg-white/5 border rounded-xl text-white text-sm outline-none transition-all duration-300 placeholder:text-zinc-600 ${
                confirmFocused
                  ? "border-purple-500/50 bg-white/10 shadow-[0_0_30px_rgba(168,85,247,0.05)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setSignupHovered(true)}
            onMouseLeave={() => setSignupHovered(false)}
            className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
              signupHovered && !loading
                ? "bg-purple-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-[1.02]"
                : "bg-purple-500/90 text-white hover:bg-purple-500"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <>
                <FiUserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[10px] text-zinc-600 leading-relaxed max-w-xs mx-auto">
              By continuing, you agree to GitInsight&apos;s{" "}
              <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors">Terms of Service</a>{" "}
              &amp;{" "}
              <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}