import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getJwtSecret } from "@/lib/env";
import { generateCsrfToken } from "@/lib/csrf";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { message: "Invalid JSON provided" },
          { status: 400 }
        );
      }
      throw error;
    }

    const parsedBody = loginSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid login data", errors: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = parsedBody.data;
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      getJwtSecret(),
      {
        expiresIn: "1h",
      }
    );

    // Generate CSRF token for this session
    const csrfToken = generateCsrfToken(token);

    const response = NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          githubConnected: Boolean(user.githubId),
          githubUsername: user.githubUsername || null,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    response.cookies.set("csrf_token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
