import { NextResponse } from "next/server";
import { analyzeRepository } from "@/services/analysis-service";
import { analyzeRepoSchema } from "@/lib/validation";
import { ZodError } from "zod";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import Chat from "@/models/Chat";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = analyzeRepoSchema.parse(body);

    console.log(`[ANALYSE API] Starting analysis for repo: ${validated.repoUrl}`);

    const token = request.headers.get("x-auth-token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      if (
        typeof decodedToken === "string" ||
        !decodedToken ||
        typeof decodedToken !== "object" ||
        typeof decodedToken.id !== "string"
      ) {
        throw new Error("Invalid token payload");
      }

      userId = decodedToken.id;
    } catch (err) {
      console.error(`[ANALYSE API] JWT verification failed:`, err);
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Run the analysis
    const analysisResult = await analyzeRepository(validated.repoUrl);

    await dbConnect();

    // ── Upsert report ──────────────────────────────────────────
    // Instead of always creating a new document, find an existing report
    // for this user + repoUrl and update it in place. If none exists,
    // create one. This prevents duplicate reports for the same repo.
    const report = await Report.findOneAndUpdate(
      {
        userId,
        repoUrl: validated.repoUrl,
      },
      {
        $set: {
          ...analysisResult,
          userId,
          analyzedAt: new Date(), // always refresh the timestamp
        },
      },
      {
        new: true,    // return the updated document
        upsert: true, // create if it doesn't exist
        setDefaultsOnInsert: true,
      }
    );

    // ── Upsert chat ────────────────────────────────────────────
    // Same logic — one chat per user + report, not a new one every run.
    const chat = await Chat.findOneAndUpdate(
      {
        userId,
        report: report._id,
      },
      {
        $set: {
          userId,
          report: report._id,
        },
        // Only push the assistant message if the chat is brand new —
        // $setOnInsert runs only on the insert path, not on updates.
        $setOnInsert: {
          messages: [
            {
              role: "assistant",
              content: "Analysis complete. Here is your report.",
            },
          ],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(
      `[ANALYSE API] Report ${report._id} ${report.isNew ? "created" : "updated"} for ${validated.repoUrl}`
    );

    return NextResponse.json({
      success: true,
      data: analysisResult,
      reportId: report._id,
      chatId: chat._id,
      userId,
    });
  } catch (error: unknown) {
    console.error("Analysis API Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

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