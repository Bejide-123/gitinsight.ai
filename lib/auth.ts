import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/db";
import User from "@/models/User";

console.log("🔥🔥🔥 LIB/AUTH.TS LOADED");

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "github") {
        token.githubId = account.providerAccountId;
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
        const email = user.email ||
          (profile as { email?: string } | undefined)?.email ||
          `${githubId}@users.noreply.github.com`;

        if (!githubId || !email) {
          console.error("GitHub account is missing ID or email");
          return false;
        }

        // Check if this GitHub account already exists
        let existingUser = await User.findOne({ githubId });

        if (!existingUser) {
          // Check if the email already belongs to a GitInsight account
          existingUser = await User.findOne({ email });

          if (existingUser) {
            // Link the GitHub account to the existing user
            existingUser.githubId = githubId;
            existingUser.githubUsername = (profile as { login?: string } | undefined)?.login;
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
              githubUsername: (profile as { login?: string } | undefined)?.login,
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