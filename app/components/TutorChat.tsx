"use client";

import { useState } from "react";
import type { Language } from "../data/onboarding";
import type { Lesson } from "../data/lessons";

type ChatMessage = {
  id: string;
  role: "user" | "tutor";
  text: string;
};

type TutorChatProps = {
  lesson: Lesson;
  language: Language;
  currentCode: string;
  anonymousSessionId: string;
};

export default function TutorChat({
  lesson,
  language,
  currentCode,
  anonymousSessionId,
}: TutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "tutor",
      text: `Hi, I’m ${language.tutorName}. Ask me anything about this lesson when you get stuck.`,
    },
  ]);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  async function askTutor() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isAsking) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmedQuestion,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuestion("");
    setIsAsking(true);

    try {
      const response = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anonymousSessionId,
          tutorName: language.tutorName,
          tutorPersonality: language.tutorPersonality,
          language: language.name,
          lessonTitle: lesson.title,
          learningGoal: lesson.learningGoal,
          currentCode,
          userQuestion: trimmedQuestion,
        }),
      });

      const data = await response.json();

      const tutorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "tutor",
        text:
          response.ok && data.reply
            ? data.reply
            : data.error || "I could not answer that right now.",
      };

      setMessages((currentMessages) => [...currentMessages, tutorMessage]);
    } catch {
      const tutorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "tutor",
        text: "I could not connect to the tutor right now. Try again in a moment.",
      };

      setMessages((currentMessages) => [...currentMessages, tutorMessage]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="flex flex-col rounded-3xl border border-white/10 bg-[#111936]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold text-blue-300">
          Ask {language.tutorName}
        </p>
        <p className="mt-1 text-xs text-white/45">
          Use this when you’re confused or want a simpler explanation.
        </p>
      </div>

      <div className="flex max-h-[320px] flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-8 bg-blue-500 text-white"
                : "mr-8 border border-white/10 bg-white/[0.05] text-white/75"
            }`}
          >
            {message.text}
          </div>
        ))}

        {isAsking && (
          <div className="mr-8 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white/55">
            {language.tutorName} is thinking...
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about this lesson..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-white/10 bg-[#050816] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-blue-300"
        />

        <button
          onClick={askTutor}
          disabled={!question.trim() || isAsking}
          className="mt-3 w-full rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
        >
          {isAsking ? "Asking..." : "Ask tutor"}
        </button>
      </div>
    </div>
  );
}