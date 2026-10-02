import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import { getJwtSecret } from "@/lib/env";
import User from "@/models/User";

console.log("🔥🔥🔥 LIB/AUTH.TS LOADED");

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "github") {
        token.githubId = account.providerAccountId;
        if (account.access_token) {
          token.githubAccessToken = account.access_token;
        }
      }

      if (user?.id) {
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId ? String(token.userId) : session.user.id;
        session.user.githubId = token.githubId ? String(token.githubId) : undefined;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider !== "github") {
        return true;
      }

      try {
        await dbConnect();

        const githubId = account.providerAccountId;
        const githubUsername = (profile as { login?: string } | undefined)?.login;
        const email = user.email ||
          (profile as { email?: string } | undefined)?.email ||
          `${githubId}@users.noreply.github.com`;

        if (!githubId || !email) {
          console.error("GitHub account is missing ID or email");
          return false;
        }

        const cookieStore = await cookies();
        const isConnectIntent = cookieStore.get("github_connect_intent")?.value === "1";

        if (isConnectIntent) {
          cookieStore.delete("github_connect_intent");
          const appToken = cookieStore.get("token")?.value ?? cookieStore.get("auth_token")?.value;
          if (!appToken) return false;

          let appUserId: string;
          try {
            const payload = jwt.verify(appToken, getJwtSecret());
            if (typeof payload !== "object" || !payload.id) return false;
            appUserId = String(payload.id);
          } catch {
            return false;
          }

          const linkedAccount = await User.findOne({ githubId });
          if (linkedAccount && String(linkedAccount._id) !== appUserId) return false;

          const appUser = await User.findById(appUserId);
          if (!appUser || (appUser.githubId && appUser.githubId !== githubId)) return false;

          appUser.githubId = githubId;
          appUser.githubUsername = githubUsername;
          appUser.image = appUser.image || user.image;
          await appUser.save();
          user.id = String(appUser._id);
          return true;
        }

        // Check if this GitHub account already exists
        let existingUser = await User.findOne({ githubId });

        if (!existingUser) {
          // Check if the email already belongs to a GitInsight account
          existingUser = await User.findOne({ email });

          if (existingUser) {
            // Link the GitHub account to the existing user
            existingUser.githubId = githubId;
            existingUser.githubUsername = githubUsername;
            existingUser.image = user.image;

            await existingUser.save();
          } else {
            // Create a brand-new GitInsight user
            existingUser = await User.create({
              name:
                user.name ||
                (profile as { login?: string } | undefined)?.login ||
                "GitHub User",
              email,
              githubId,
              githubUsername,
              image: user.image,
            });
          }
        }

        user.id = String(existingUser._id);
        return true;
      } catch (error) {
        console.error("GitHub user synchronization failed:", error);
        return false;
      }
    },
  },
};