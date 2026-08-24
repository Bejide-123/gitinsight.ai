"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const createAppSession = async () => {
      try {
        const response = await fetch("/api/auth/github/session", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Unable to complete GitHub login");
        }

        const payload = await response.json();
        if (payload.csrfToken) {
          localStorage.setItem("csrfToken", payload.csrfToken);
        }

        setAuthUser(payload.user);

        if (!cancelled) {
          router.replace("/chat");
        }
      } catch (callbackError) {
        if (!cancelled) {
          setError(callbackError instanceof Error ? callbackError.message : "Unable to complete GitHub login");
        }
      }
    };

    createAppSession();

    return () => {
      cancelled = true;
    };
  }, [router, setAuthUser]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-center text-red-400">
        {error}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-zinc-400">
      Completing GitHub login...
    </main>
  );
}