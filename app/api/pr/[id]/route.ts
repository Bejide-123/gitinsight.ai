import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import { getJwtSecret } from "@/lib/env";
import PullRequestReport from "@/models/PullRequestReport";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;
    const appToken =
      bearerToken ||
      request.headers.get("x-auth-token") ||
      request.cookies.get("token")?.value;

    if (!appToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let appUserId: string;
    try {
      const payload = jwt.verify(appToken, getJwtSecret()) as { id?: string };
      if (!payload.id) throw new Error("Invalid token");
      appUserId = payload.id;
    } catch {
      return NextResponse.json(
        { success: false, error: "Session expired or invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Pull request report ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const report = await PullRequestReport.findOne({
      _id: id,
      userId: appUserId,
    }).lean();

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Pull request analysis report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: unknown) {
    console.error("Error fetching pull request report:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
