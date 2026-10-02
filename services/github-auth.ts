import { signIn } from "next-auth/react";

export async function startGitHubConnection() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `github_connect_intent=1; path=/; max-age=300; SameSite=Lax${secure}`;

  try {
    const result = await signIn("github", {
      callbackUrl: "/dashboard?github=connected",
    });
    if (result?.error) throw new Error(result.error);
  } catch (error) {
    document.cookie = `github_connect_intent=; path=/; max-age=0; SameSite=Lax${secure}`;
    throw error;
  }
}