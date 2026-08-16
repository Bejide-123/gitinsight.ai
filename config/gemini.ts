import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireEnv } from "@/lib/env";

export function getGeminiModel() {
  const { GEMINI_API_KEY } = requireEnv(["GEMINI_API_KEY"]);

  const gemini = new GoogleGenerativeAI(GEMINI_API_KEY as string);

  return gemini.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
}