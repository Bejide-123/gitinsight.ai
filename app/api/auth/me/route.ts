import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = (await cookies()) as any;
    const tokenFromCookie = cookieStore.get("token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = tokenFromCookie || authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "your-secret-key";
    let decoded;

    try {
      decoded = jwt.verify(token, secret) as { id: string; email: string; name: string };
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.id) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("_id name email");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
