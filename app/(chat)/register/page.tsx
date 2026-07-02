"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
// import { HiOutlineMail } from "react-icons/hi";
import { FiUserPlus } from "react-icons/fi";
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
      setError("Registration Failed, Please try again later");
      console.log(err);
    } finally {
      setLoading(false);
    }

    // Wire to your registration flow
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(15, 15, 15, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "4px",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            marginBottom: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "10px",
            background: "#141414",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            margin: 0,
            marginBottom: "8px",
            fontSize: "28px",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.25,
            backgroundImage: "linear-gradient(90deg, #60a5fa, #a855f7)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "'Space Grotesk', Inter, sans-serif",
          }}
        >
          Join GitInsight AI
        </h1>
        <p
          style={{
            margin: 0,
            marginBottom: "32px",
            fontSize: "13px",
            color: "#9a9a9a",
            textAlign: "center",
          }}
        >
          Autonomous Repository Intelligence &amp; Security
        </p>

        {/* GitHub button */}
        <button
          onClick={handleGitHubSignup}
          onMouseEnter={() => setGithubHovered(true)}
          onMouseLeave={() => setGithubHovered(false)}
          style={{
            width: "100%",
            height: "52px",
            background: githubHovered ? "#f0f0f0" : "#ffffff",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: githubHovered
              ? "0 0 30px rgba(0, 255, 255, 0.25)"
              : "0 0 16px rgba(0, 255, 255, 0.12)",
            transform: githubHovered ? "translateY(-1px)" : "translateY(0)",
            transition: "all 0.25s ease",
          }}
        >
          <FaGithub size={20} />
          Sign up with GitHub
        </button>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "28px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "#6b6b6b",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            OR
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailSignup} style={{ width: "100%" }}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8e9192",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
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
              style={{
                width: "100%",
                height: "52px",
                background: "rgba(255, 255, 255, 0.03)",
                border: nameFocused
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "0 16px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8e9192",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Work Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="dev@company.ai"
              style={{
                width: "100%",
                height: "52px",
                background: "rgba(255, 255, 255, 0.03)",
                border: emailFocused
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "0 16px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8e9192",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
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
              style={{
                width: "100%",
                height: "52px",
                background: "rgba(255, 255, 255, 0.03)",
                border: passwordFocused
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "0 16px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8e9192",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
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
              style={{
                width: "100%",
                height: "52px",
                background: "rgba(255, 255, 255, 0.03)",
                border: confirmFocused
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "0 16px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                margin: "0 0 16px",
                fontSize: "12px",
                color: "#ff8585",
              }}
            >
              {error}
            </p>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            onMouseEnter={() => setSignupHovered(true)}
            onMouseLeave={() => setSignupHovered(false)}
            disabled={loading}
            style={{
              width: "100%",
              height: "52px",
              background: signupHovered
                ? "linear-gradient(135deg, #60a5fa, #a855f7)"
                : "linear-gradient(135deg, #3b82f6, #7c3aed)",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: signupHovered
                ? "0 0 30px rgba(96, 165, 250, 0.3)"
                : "0 0 16px rgba(96, 165, 250, 0.15)",
              transform: signupHovered ? "translateY(-1px)" : "translateY(0)",
              transition: "all 0.25s ease",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                <FiUserPlus size={18} />
                Sign Up
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: "32px", textAlign: "center", width: "100%" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#b0b0b0" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Sign in instead
            </Link>
          </p>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 auto",
                maxWidth: "280px",
                fontSize: "10px",
                lineHeight: 1.6,
                color: "#6b6b6b",
              }}
            >
              By continuing, you agree to GitInsight&apos;s{" "}
              <a href="#" style={{ color: "#8e9192" }}>
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a href="#" style={{ color: "#8e9192" }}>
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
