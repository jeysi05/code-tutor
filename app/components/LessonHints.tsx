"use client";

import { useEffect, useState } from "react";

type Hint = {
  id: string;
  text: string;
};

type LessonHintsProps = {
  lessonId: string;
  hints: Hint[];
};

export default function LessonHints({ lessonId, hints }: LessonHintsProps) {
  const [visibleHintCount, setVisibleHintCount] = useState(0);

  const visibleHints = hints.slice(0, visibleHintCount);
  const hasMoreHints = visibleHintCount < hints.length;

  useEffect(() => {
    setVisibleHintCount(0);
  }, [lessonId]);

  function showNextHint() {
    if (!hasMoreHints) return;
    setVisibleHintCount((currentCount) => currentCount + 1);
  }

  function resetHints() {
    setVisibleHintCount(0);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111936] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-300">Need a hint?</p>
          <p className="mt-1 text-xs text-white/45">
            Hints reveal one at a time, so you still solve it yourself.
          </p>
        </div>

        {visibleHintCount > 0 && (
          <button
            onClick={resetHints}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Hide
          </button>
        )}
      </div>

      {visibleHints.length > 0 && (
        <div className="mt-4 space-y-3">
          {visibleHints.map((hint, index) => (
            <div
              key={hint.id}
              className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                Hint {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                {hint.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasMoreHints ? (
        <button
          onClick={showNextHint}
          className="mt-4 w-full rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20"
        >
          {visibleHintCount === 0 ? "Show a hint" : "Show another hint"}
        </button>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-white/55">
          No more hints for this lesson. Try editing your code, then click
          “Check my code.”
        </p>
      )}
    </div>
  );
}