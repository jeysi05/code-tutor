import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type TutorChatRequest = {
  anonymousSessionId?: string;
  tutorName: string;
  tutorPersonality: string;
  language: string;
  lessonTitle: string;
  learningGoal: string;
  currentCode: string;
  userQuestion: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY. Add it to .env.local, then restart the dev server.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as TutorChatRequest;

    if (
      !body.tutorName ||
      !body.language ||
      !body.lessonTitle ||
      !body.userQuestion
    ) {
      return NextResponse.json(
        {
          error: "Missing required tutor chat data.",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are ${body.tutorName}, the AI tutor for ${body.language}.

Tutor personality:
${body.tutorPersonality}

Current lesson:
${body.lessonTitle}

Lesson goal:
${body.learningGoal}

User's current code:
${body.currentCode}

User question:
${body.userQuestion}

Your job:
Answer the user's question as their coding tutor.
Keep the answer beginner-friendly, short, and specific.
Do not give a long lecture.
Do not overwhelm the user.
If the user is confused, explain using a simple analogy.
If the user asks for the full answer, guide them instead of doing all the work.
Stay focused on the current lesson and their code.

Response format:
Write 2 to 6 short sentences only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =
      response.text ||
      "I tried to answer, but I could not generate a response this time.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("Tutor chat error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while asking the tutor.",
      },
      { status: 500 }
    );
  }
}