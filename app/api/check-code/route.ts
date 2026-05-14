import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type CheckCodeRequest = {
  tutorName: string;
  tutorPersonality: string;
  language: string;
  lessonTitle: string;
  learningGoal: string;
  realLifeWhy: string;
  starterCode: string;
  taskInstruction: string;
  successCriteria: string[];
  userCode: string;
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

    const body = (await request.json()) as CheckCodeRequest;

    if (!body.userCode || !body.lessonTitle || !body.language) {
      return NextResponse.json(
        {
          error: "Missing required lesson or code data.",
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

Lesson title:
${body.lessonTitle}

Lesson goal:
${body.learningGoal}

Real-life reason:
${body.realLifeWhy}

Starter code:
${body.starterCode}

User task:
${body.taskInstruction}

Success criteria:
${body.successCriteria.map((item) => `- ${item}`).join("\n")}

User submitted code:
${body.userCode}

Your job:
Review the user's code based only on this lesson's goal.
Be short, specific, encouraging, and beginner-friendly.
Do not give a long lecture.
If the code is correct, celebrate briefly and explain what they did right.
If the code has an issue, point out the most important fix first.
Do not solve the whole thing unless the user is clearly stuck.

Response format:
Write 2 to 5 short sentences only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const feedback =
      response.text ||
      "I checked your code, but I could not generate feedback this time.";

    return NextResponse.json({
      feedback,
    });
  } catch (error) {
    console.error("Gemini code check error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while checking the code.",
      },
      { status: 500 }
    );
  }
}