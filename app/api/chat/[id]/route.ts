import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const chat = await Chat.findById(params.id).populate("report");

    if (!chat) {
      return NextResponse.json(
        {
          success: false,
          error: "Chat not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: chat,
    });
  } catch (error: unknown) {
    console.error("Get Chat API Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
