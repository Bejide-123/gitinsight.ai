import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getJwtSecret } from "@/lib/env";
import { generateCsrfToken } from "@/lib/csrf";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    const nextAuthSession = await getServerSession(authOptions);
    const userId = nextAuthSession?.user?.id;
    const githubId = nextAuthSession?.user?.githubId;
    const email = nextAuthSession?.user?.email;

    if (!userId && !githubId && !email) {
      return NextResponse.json({ success: false, error: "GitHub session not found" }, { status: 401 });
    }

    await dbConnect();
    const user = userId
      ? await User.findById(userId)
      : githubId
        ? await User.findOne({ githubId })
        : await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, error: "GitHub user was not found" }, { status: 404 });
    }

    const token = jwt.sign(
      { id: String(user._id), name: user.name, email: user.email },
      getJwtSecret(),
      { expiresIn: "1h" }
    );
    const csrfToken = generateCsrfToken(token);

    const response = NextResponse.json({
      success: true,
      csrfToken,
      user: {
        id: String(user._id),
        name: user.name || "GitHub User",
        email: user.email || `${user.githubId}@users.noreply.github.com`,
        githubConnected: Boolean(user.githubId),
        githubUsername: user.githubUsername || null,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });
    response.cookies.set("auth_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });
    response.cookies.set("csrf_token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GitHub session bridge error:", error);
    return NextResponse.json({ success: false, error: "Unable to complete GitHub login" }, { status: 500 });
  }
}