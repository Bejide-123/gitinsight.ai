import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import Chat from "@/models/Chat";
import { getJwtSecret } from "@/lib/env";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;
    const token = bearerToken || request.headers.get("x-auth-token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let userPayload;
    try {
      userPayload = jwt.verify(token, getJwtSecret());
    } catch (err) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = userPayload as { id: string };

    await dbConnect();

    const reports = await Report.find({ userId: user.id })
      .sort({ analyzedAt: -1 })
      .lean();

    const chats = await Chat.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .populate("report")
      .lean();

    return NextResponse.json({ success: true, reports, chats });
  } catch (error: unknown) {
    console.error("History API Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
