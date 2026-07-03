"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { login } from "@/services/auth-service";
import { LoginData } from "@/types/auth";
import { AccessGrantedModal, PerimeterAlertModal } from "@/components/modals/Modals";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();

  const handleGitHubLogin = () => {
    // Wire to your GitHub OAuth provider
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowErrorModal(false);
    
    try {
      const loginData: LoginData = { email, password };
      await login(loginData);
      
      // Token is automatically saved in cookies by the auth service
      // Show success modal first
      setShowSuccessModal(true);
      
      // Redirect to chat page after 2 seconds
      setTimeout(() => {
        router.push("/chat");
      }, 2000);
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || "Invalid email or password. Please try again.";
      setError(errorMessage);
      setShowErrorModal(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
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
          Welcome to GitInsight AI
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
          onClick={handleGitHubLogin}
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
          Continue with GitHub
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
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
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
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailLogin} style={{ width: "100%" }}>
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

          <div style={{ marginBottom: "20px" }}>
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

          {error && (
            <p style={{ color: "red", fontSize: "12px", textAlign: "center", marginBottom: "16px" }}>
              {error}
            </p>
          )}
          
          {/* Login Button */}
          <button
            type="submit"
            onMouseEnter={() => setLoginHovered(true)}
            onMouseLeave={() => setLoginHovered(false)}
            disabled={loading}
            style={{
              width: "100%",
              height: "52px",
              background: loginHovered 
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
              boxShadow: loginHovered && !loading
                ? "0 0 30px rgba(96, 165, 250, 0.3)"
                : "0 0 16px rgba(96, 165, 250, 0.15)",
              transform: loginHovered && !loading ? "translateY(-1px)" : "translateY(0)",
              transition: "all 0.25s ease",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <FiLogIn size={18} />
                Log In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: "32px", textAlign: "center", width: "100%" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#b0b0b0" }}>
            New user?{" "}
            <Link
              href="/register"
              style={{
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Create an account
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

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 50,
          }}
        >
          <div style={{ maxWidth: "500px", width: "90%" }}>
            <AccessGrantedModal 
              onDashboardClick={() => {
                setShowSuccessModal(false);
                router.push("/chat");
              }}
            />
          </div>
        </div>
      )}

      {/* Error Modal Overlay */}
      {showErrorModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 50,
          }}
        >
          <div style={{ maxWidth: "500px", width: "90%" }}>
            <PerimeterAlertModal 
              onRetry={() => {
                setShowErrorModal(false);
                setError(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}