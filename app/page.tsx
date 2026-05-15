"use client";

import { useEffect, useState } from "react";
import AiUsageBadge from "./components/AiUsageBadge";
import CodeEditor from "./components/CodeEditor";
import LessonHints from "./components/LessonHints";
import OutputPreview from "./components/OutputPreview";
import TutorChat from "./components/TutorChat";
import UserStats from "./components/UserStats";
import {
  goals,
  languages,
  type GoalId,
  type LanguageId,
} from "./data/onboarding";
import {
  getFirstLessonByLanguage,
  getLessonById,
  getLessonsByLanguage,
  getNextLesson,
  getPreviousLesson,
  type Lesson,
} from "./data/lessons";

type OnboardingStep =
  | "start"
  | "goal-picker"
  | "language-picker"
  | "tutor-intro"
  | "lesson";

type DraftSaveStatus = "idle" | "saved";

type LessonModuleGroup = {
  moduleId: string;
  moduleTitle: string;
  moduleOrder: number;
  lessons: Lesson[];
};

export default function Home() {
  const [step, setStep] = useState<OnboardingStep>("start");
  const [selectedGoalId, setSelectedGoalId] = useState<GoalId | null>(null);
  const [selectedLanguageId, setSelectedLanguageId] =
    useState<LanguageId | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  const aiDailyLimit = 30;
  const [aiChecksUsed, setAiChecksUsed] = useState(0);
  const [useAiFeedback, setUseAiFeedback] = useState(true);
  const [anonymousSessionId, setAnonymousSessionId] = useState("");
  const [draftSaveStatus, setDraftSaveStatus] =
    useState<DraftSaveStatus>("idle");
  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);
  const selectedLanguage = languages.find(
    (language) => language.id === selectedLanguageId
  );

  const selectedLanguageLessons = selectedLanguageId
    ? getLessonsByLanguage(selectedLanguageId)
    : [];

  const selectedLanguageCompletedCount = selectedLanguageLessons.filter(
    (lesson) => completedLessonIds.includes(lesson.id)
  ).length;

  const selectedLesson = currentLessonId
    ? getLessonById(currentLessonId)
    : selectedLanguageId
      ? getFirstLessonByLanguage(selectedLanguageId)
      : undefined;

  const selectedLessonCompleted = selectedLesson
    ? completedLessonIds.includes(selectedLesson.id)
    : false;

  const activeModuleId = selectedLesson?.moduleId;

  const nextLesson = selectedLesson ? getNextLesson(selectedLesson.id) : undefined;
  const previousLesson = selectedLesson
    ? getPreviousLesson(selectedLesson.id)
    : undefined;

  const recommendedLanguages = selectedGoal
    ? languages.filter((language) =>
        selectedGoal.recommendedLanguages.includes(language.id)
      )
    : [];

  const selectedLanguageModuleGroups = getLessonModuleGroups(
    selectedLanguageLessons
  );

  function getLessonModuleGroups(lessons: Lesson[]): LessonModuleGroup[] {
    const moduleMap = new Map<string, LessonModuleGroup>();

    lessons.forEach((lesson) => {
      const existingModule = moduleMap.get(lesson.moduleId);

      if (existingModule) {
        existingModule.lessons.push(lesson);
        return;
      }

      moduleMap.set(lesson.moduleId, {
        moduleId: lesson.moduleId,
        moduleTitle: lesson.moduleTitle,
        moduleOrder: lesson.moduleOrder,
        lessons: [lesson],
      });
    });

    return Array.from(moduleMap.values())
      .map((moduleGroup) => ({
        ...moduleGroup,
        lessons: moduleGroup.lessons.sort(
          (firstLesson, secondLesson) => firstLesson.order - secondLesson.order
        ),
      }))
      .sort(
        (firstModule, secondModule) =>
          firstModule.moduleOrder - secondModule.moduleOrder
      );
  }

  function getLessonTypeLabel(lesson: Lesson) {
    if (lesson.lessonType === "mini-project") return "Mini project";
    if (lesson.lessonType === "final-project") return "Final project";
    if (lesson.lessonType === "challenge") return "Challenge";
    if (lesson.lessonType === "practice") return "Practice";

    return "Concept";
  }

  function isModuleExpanded(moduleId: string) {
    return expandedModuleIds.includes(moduleId) || activeModuleId === moduleId;
  }

  function toggleModule(moduleId: string) {
    setExpandedModuleIds((currentModuleIds) => {
      if (currentModuleIds.includes(moduleId)) {
        return currentModuleIds.filter(
          (currentModuleId) => currentModuleId !== moduleId
        );
      }

      return [...currentModuleIds, moduleId];
    });
  }

  function createAnonymousSessionId() {
    return `anon_${crypto.randomUUID()}`;
  }

  function getCookieValue(cookieName: string) {
    const cookies = document.cookie.split("; ");

    const foundCookie = cookies.find((cookie) =>
      cookie.startsWith(`${cookieName}=`)
    );

    return foundCookie?.split("=")[1] || "";
  }

  function saveCookieValue(cookieName: string, value: string, days: number) {
    const maxAge = days * 24 * 60 * 60;

    document.cookie = `${cookieName}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  function getLessonDraftKey(lessonId: string) {
    return `code-tutor-draft-${lessonId}`;
  }

  function clearAllLessonDrafts() {
    const keysToRemove: string[] = [];

    for (let index = 0; index < window.localStorage.length; index++) {
      const key = window.localStorage.key(index);

      if (key?.startsWith("code-tutor-draft-")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  }

  function isLessonUnlocked(lesson: Lesson) {
    if (lesson.order === 1) return true;
    if (completedLessonIds.includes(lesson.id)) return true;

    const lessonBefore = getPreviousLesson(lesson.id);

    if (!lessonBefore) return true;

    return completedLessonIds.includes(lessonBefore.id);
  }

  function loadLesson(lesson: Lesson) {
    if (!isLessonUnlocked(lesson)) return;

    const savedDraft = window.localStorage.getItem(getLessonDraftKey(lesson.id));

    setCurrentLessonId(lesson.id);
    setExpandedModuleIds((currentModuleIds) =>
      currentModuleIds.includes(lesson.moduleId)
        ? currentModuleIds
        : [...currentModuleIds, lesson.moduleId]
    );
    setUserCode(savedDraft ?? lesson.starterCode.code);
    setFeedback("");
    setDraftSaveStatus("idle");
    setStep("lesson");
  }

  useEffect(() => {
    const existingSessionId = getCookieValue("code-tutor-session-id");

    if (existingSessionId) {
      setAnonymousSessionId(existingSessionId);
    } else {
      const newSessionId = createAnonymousSessionId();
      saveCookieValue("code-tutor-session-id", newSessionId, 30);
      setAnonymousSessionId(newSessionId);
    }

    const savedXp = window.localStorage.getItem("code-tutor-xp");
    const savedStreak = window.localStorage.getItem("code-tutor-streak");
    const savedCompletedLessonIds = window.localStorage.getItem(
      "code-tutor-completed-lesson-ids"
    );
    const savedAiChecksUsed = window.localStorage.getItem(
      "code-tutor-ai-checks-used"
    );
    const savedAiUsageDate = window.localStorage.getItem(
      "code-tutor-ai-usage-date"
    );
    const today = new Date().toISOString().slice(0, 10);

    if (savedXp) {
      setXp(Number(savedXp));
    }

    if (savedStreak) {
      setStreak(Number(savedStreak));
    }

    if (savedCompletedLessonIds) {
      try {
        const parsedLessonIds = JSON.parse(savedCompletedLessonIds);

        if (Array.isArray(parsedLessonIds)) {
          setCompletedLessonIds(parsedLessonIds);
        }
      } catch {
        setCompletedLessonIds([]);
      }
    }

    if (savedAiUsageDate === today && savedAiChecksUsed) {
      setAiChecksUsed(Number(savedAiChecksUsed));
    } else {
      window.localStorage.setItem("code-tutor-ai-usage-date", today);
      window.localStorage.setItem("code-tutor-ai-checks-used", "0");
      setAiChecksUsed(0);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("code-tutor-xp", String(xp));
    window.localStorage.setItem("code-tutor-streak", String(streak));
    window.localStorage.setItem(
      "code-tutor-completed-lesson-ids",
      JSON.stringify(completedLessonIds)
    );
    window.localStorage.setItem(
      "code-tutor-ai-checks-used",
      String(aiChecksUsed)
    );
  }, [xp, streak, completedLessonIds, aiChecksUsed]);

  useEffect(() => {
    if (step !== "lesson" || !selectedLesson) return;

    window.localStorage.setItem(getLessonDraftKey(selectedLesson.id), userCode);
    setDraftSaveStatus("saved");

    const timeoutId = window.setTimeout(() => {
      setDraftSaveStatus("idle");
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [step, selectedLesson, userCode]);

  function goBackToStart() {
    setStep("start");
    setSelectedGoalId(null);
    setSelectedLanguageId(null);
    setCurrentLessonId(null);
    setExpandedModuleIds([]);
    setUserCode("");
    setFeedback("");
    setDraftSaveStatus("idle");
  }

  function goToTutorIntro() {
    if (!selectedLanguageId) return;
    setCurrentLessonId(null);
    setStep("tutor-intro");
  }

  function startFirstLesson() {
    if (!selectedLanguageId) return;

    const firstLesson = getFirstLessonByLanguage(selectedLanguageId);

    if (!firstLesson) return;

    loadLesson(firstLesson);
  }

  function goBackOneStep() {
    if (step === "tutor-intro") {
      if (selectedGoalId) {
        setStep("goal-picker");
      } else {
        setStep("language-picker");
      }
      return;
    }

    if (step === "lesson") {
      setStep("tutor-intro");
      setFeedback("");
      setDraftSaveStatus("idle");
      return;
    }

    goBackToStart();
  }

  async function checkCode() {
    if (!selectedLesson || !selectedLanguage) return;

    const code = userCode.trim();
    const failedRules: string[] = [];

    selectedLesson.check.rules.forEach((rule) => {
      rule.requiredIncludes?.forEach((requiredText) => {
        if (!code.includes(requiredText)) {
          failedRules.push(rule.description);
        }
      });

      rule.forbiddenIncludes?.forEach((forbiddenText) => {
        if (code.includes(forbiddenText)) {
          failedRules.push(rule.description);
        }
      });
    });

    if (failedRules.length > 0) {
      setFeedback(
        `${selectedLesson.failure.encouragement} ${selectedLesson.failure.retryPrompt}`
      );
      return;
    }

    const lessonWasAlreadyCompleted = completedLessonIds.includes(
      selectedLesson.id
    );

    if (!lessonWasAlreadyCompleted) {
      setXp((currentXp) => currentXp + selectedLesson.xpReward);
      setStreak((currentStreak) => Math.max(currentStreak, 1));
      setCompletedLessonIds((currentLessonIds) => [
        ...currentLessonIds,
        selectedLesson.id,
      ]);
    }

    const unlockMessage = nextLesson
      ? ` ${selectedLesson.success.nextLessonPrompt}`
      : " You finished the current mini-path.";

    if (!useAiFeedback) {
      setFeedback(
        `${selectedLesson.success.message}${unlockMessage} You used the basic checker, so this did not count against your AI checks.`
      );
      return;
    }

    if (aiChecksUsed >= aiDailyLimit) {
      setFeedback(
        `${selectedLesson.success.message}${unlockMessage} You have reached today's free AI check limit, so I used the basic checker for now.`
      );
      return;
    }

    setFeedback(`${selectedLanguage.tutorName} is checking your code...`);

    try {
      const response = await fetch("/api/check-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anonymousSessionId,
          tutorName: selectedLanguage.tutorName,
          tutorPersonality: selectedLanguage.tutorPersonality,
          language: selectedLanguage.name,
          lessonTitle: selectedLesson.title,
          learningGoal: selectedLesson.learningGoal,
          realLifeWhy: selectedLesson.realLifeWhy,
          starterCode: selectedLesson.starterCode.code,
          taskInstruction: selectedLesson.task.instruction,
          successCriteria: selectedLesson.task.successCriteria,
          userCode: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(
          data.error ||
            `${selectedLesson.success.message}${unlockMessage} Gemini feedback is not available right now.`
        );
        return;
      }

      setAiChecksUsed((currentUsed) => currentUsed + 1);
      setFeedback(
        data.feedback || `${selectedLesson.success.message}${unlockMessage}`
      );
    } catch {
      setFeedback(
        `${selectedLesson.success.message}${unlockMessage} Gemini feedback is not available right now.`
      );
    }
  }

  function resetProgress() {
    setXp(0);
    setStreak(0);
    setCompletedLessonIds([]);
    setAiChecksUsed(0);
    setFeedback("");
    setUserCode("");
    setCurrentLessonId(null);
    setExpandedModuleIds([]);
    setDraftSaveStatus("idle");
    setStep("start");

    window.localStorage.removeItem("code-tutor-xp");
    window.localStorage.removeItem("code-tutor-streak");
    window.localStorage.removeItem("code-tutor-completed-lesson-ids");
    window.localStorage.removeItem("code-tutor-ai-checks-used");
    window.localStorage.removeItem("code-tutor-ai-usage-date");
    clearAllLessonDrafts();

    const newSessionId = createAnonymousSessionId();
    saveCookieValue("code-tutor-session-id", newSessionId, 30);
    setAnonymousSessionId(newSessionId);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#0b1020] text-white">
      <section className="mx-auto flex h-screen w-full max-w-[1700px] flex-col px-5 py-5">
        <header className="mb-4 shrink-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goBackToStart}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Code Tutor
            </button>

            <div className="hidden w-full max-w-lg md:block">
              <UserStats
                xp={xp}
                streak={streak}
                completedLessons={completedLessonIds.length}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetProgress}
                className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
              >
                Reset
              </button>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                MVP Preview
              </div>
            </div>
          </div>
        </header>

        {step === "start" && (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-16 text-center">
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Built for learners who hate boring tutorials
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              Learn to code by building,
              <span className="block text-blue-400">
                not by watching forever.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              A goal-first coding tutor that explains concepts in short bursts,
              lets you write code, then reacts to your actual work.
            </p>

            <div className="mt-8 w-full max-w-lg md:hidden">
              <UserStats
                xp={xp}
                streak={streak}
                completedLessons={completedLessonIds.length}
              />
            </div>

            <div className="mt-10 grid w-full max-w-3xl gap-4 md:grid-cols-2">
              <button
                onClick={() => setStep("goal-picker")}
                className="rounded-3xl border border-blue-400/30 bg-blue-500/15 p-6 text-left transition hover:border-blue-300/60 hover:bg-blue-500/25"
              >
                <p className="text-sm font-semibold text-blue-300">Path 1</p>
                <h2 className="mt-3 text-2xl font-bold">I have a goal</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Choose what you want to build or achieve, then we’ll recommend
                  the best language to start with.
                </p>
              </button>

              <button
                onClick={() => setStep("language-picker")}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                <p className="text-sm font-semibold text-blue-300">Path 2</p>
                <h2 className="mt-3 text-2xl font-bold">
                  I know what I want to learn
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Skip recommendations and go straight to HTML/CSS, JavaScript,
                  React, TypeScript, Python, SQL, or Git.
                </p>
              </button>
            </div>
          </div>
        )}

        {step === "goal-picker" && (
          <div className="flex flex-1 flex-col justify-center overflow-y-auto py-12">
            <button
              onClick={goBackToStart}
              className="mb-8 w-fit text-sm font-semibold text-white/60 transition hover:text-white"
            >
              ← Back
            </button>

            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-300">Goal-first</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                What do you want coding to help you do?
              </h1>
              <p className="mt-5 text-base leading-7 text-white/65">
                Pick the closest goal. We’ll recommend a starting language based
                on what you want to build.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {goals.map((goal) => {
                const isSelected = selectedGoalId === goal.id;

                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setSelectedLanguageId(null);
                      setCurrentLessonId(null);
                    }}
                    className={`rounded-3xl border p-6 text-left transition ${
                      isSelected
                        ? "border-blue-300 bg-blue-500/20"
                        : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]"
                    }`}
                  >
                    <h2 className="text-xl font-bold">{goal.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {goal.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedGoal && (
              <div className="mt-8 rounded-3xl border border-blue-400/30 bg-blue-500/10 p-6">
                <p className="text-sm font-semibold text-blue-300">
                  Recommended for: {selectedGoal.title}
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {recommendedLanguages.map((language) => (
                    <button
                      key={language.id}
                      onClick={() => {
                        setSelectedLanguageId(language.id);
                        setCurrentLessonId(null);
                      }}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selectedLanguageId === language.id
                          ? "border-blue-300 bg-blue-500/30"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <p className="font-bold">{language.name}</p>
                      <p className="mt-2 text-xs leading-5 text-white/60">
                        {language.description}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedLanguageId && (
                  <button
                    onClick={goToTutorIntro}
                    className="mt-6 rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400"
                  >
                    Continue to tutor intro
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {step === "language-picker" && (
          <div className="flex flex-1 flex-col justify-center overflow-y-auto py-12">
            <button
              onClick={goBackToStart}
              className="mb-8 w-fit text-sm font-semibold text-white/60 transition hover:text-white"
            >
              ← Back
            </button>

            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-300">
                Language-first
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                What do you want to learn first?
              </h1>
              <p className="mt-5 text-base leading-7 text-white/65">
                Choose one language. You’ll meet its tutor and start with a tiny
                first lesson.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {languages.map((language) => {
                const isSelected = selectedLanguageId === language.id;

                return (
                  <button
                    key={language.id}
                    onClick={() => {
                      setSelectedLanguageId(language.id);
                      setCurrentLessonId(null);
                    }}
                    className={`rounded-3xl border p-6 text-left transition ${
                      isSelected
                        ? "border-blue-300 bg-blue-500/20"
                        : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-xl font-bold">{language.name}</h2>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                        {language.shortName}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {language.description}
                    </p>

                    <p className="mt-4 text-xs font-semibold text-blue-300">
                      {language.learningStyle}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedLanguageId && (
              <button
                onClick={goToTutorIntro}
                className="mt-8 w-fit rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400"
              >
                Continue to tutor intro
              </button>
            )}
          </div>
        )}

        {step === "tutor-intro" && selectedLanguage && (
          <div className="flex flex-1 items-center overflow-y-auto py-12">
            <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <button
                  onClick={goBackOneStep}
                  className="mb-8 text-sm font-semibold text-white/60 transition hover:text-white"
                >
                  ← Back
                </button>

                <p className="text-sm font-semibold text-blue-300">
                  Your tutor is ready
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
                  Meet {selectedLanguage.tutorName}
                </h1>

                <p className="mt-6 text-lg leading-8 text-white/70">
                  {selectedLanguage.tutorIntro}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm font-semibold text-blue-300">
                      Language
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {selectedLanguage.name}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm font-semibold text-blue-300">
                      Learning style
                    </p>
                    <p className="mt-2 text-base font-semibold text-white/80">
                      {selectedLanguage.learningStyle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={startFirstLesson}
                  className="mt-8 rounded-2xl bg-blue-500 px-7 py-4 text-base font-semibold text-white transition hover:bg-blue-400"
                >
                  Start first lesson
                </button>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/40">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#111936] p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-black">
                      {selectedLanguage.tutorName.charAt(0)}
                    </div>

                    <div>
                      <p className="text-xl font-bold">
                        {selectedLanguage.tutorName}
                      </p>
                      <p className="text-sm text-white/55">
                        {selectedLanguage.name} Tutor
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl bg-white/[0.06] p-5">
                    <p className="text-sm leading-7 text-white/75">
                      “{selectedLanguage.tutorIntro}”
                    </p>
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/10 p-5">
                    <p className="text-sm font-semibold text-blue-300">
                      Personality
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {selectedLanguage.tutorPersonality}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "lesson" && selectedLanguage && selectedLesson && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mb-3 flex shrink-0 items-center justify-between gap-4">
              <button
                onClick={goBackOneStep}
                className="w-fit text-sm font-semibold text-white/60 transition hover:text-white"
              >
                ← Back to tutor intro
              </button>

              <AiUsageBadge used={aiChecksUsed} limit={aiDailyLimit} />
            </div>

            <div
              className="grid min-h-0 flex-1 gap-5 overflow-hidden"
              style={{
                gridTemplateColumns: "minmax(360px, 2fr) minmax(0, 3fr)",
              }}
            >
              <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="rounded-3xl border border-white/10 bg-[#111936] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-blue-300">
                          {selectedLanguage.name} path
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Complete a lesson to unlock the next one.
                        </p>
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
                        {selectedLanguageCompletedCount}/
                        {selectedLanguageLessons.length}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {selectedLanguageModuleGroups.map((moduleGroup) => {
                        const completedInModule = moduleGroup.lessons.filter(
                          (lesson) => completedLessonIds.includes(lesson.id)
                        ).length;
                        const isExpanded = isModuleExpanded(
                          moduleGroup.moduleId
                        );
                        const isActiveModule =
                          selectedLesson.moduleId === moduleGroup.moduleId;
                        const moduleIsCompleted =
                          completedInModule === moduleGroup.lessons.length;
                        const moduleHasUnlockedLessons =
                          moduleGroup.lessons.some((lesson) =>
                            isLessonUnlocked(lesson)
                          );

                        return (
                          <div
                            key={moduleGroup.moduleId}
                            className={`overflow-hidden rounded-2xl border transition ${
                              isActiveModule
                                ? "border-blue-300/40 bg-blue-500/[0.08]"
                                : "border-white/10 bg-white/[0.03]"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleModule(moduleGroup.moduleId)}
                              className="flex w-full items-center justify-between gap-3 p-3 text-left transition hover:bg-white/[0.04]"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">
                                    {isExpanded ? "▾" : "▸"}
                                  </span>

                                  <p className="truncate text-sm font-bold text-white">
                                    Module {moduleGroup.moduleOrder}:{" "}
                                    {moduleGroup.moduleTitle}
                                  </p>
                                </div>

                                <p className="mt-1 text-xs text-white/45">
                                  {completedInModule}/
                                  {moduleGroup.lessons.length} lessons complete
                                </p>
                              </div>

                              <span
                                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                                  moduleIsCompleted
                                    ? "bg-emerald-400/10 text-emerald-200"
                                    : moduleHasUnlockedLessons
                                      ? "bg-blue-400/10 text-blue-200"
                                      : "bg-white/5 text-white/45"
                                }`}
                              >
                                {moduleIsCompleted
                                  ? "Complete"
                                  : moduleHasUnlockedLessons
                                    ? "Available"
                                    : "Locked"}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="grid gap-2 border-t border-white/10 p-3 pt-3">
                                {moduleGroup.lessons.map((lesson) => {
                                  const isActiveLesson =
                                    selectedLesson.id === lesson.id;
                                  const isCompleted =
                                    completedLessonIds.includes(lesson.id);
                                  const isUnlocked = isLessonUnlocked(lesson);

                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => loadLesson(lesson)}
                                      disabled={!isUnlocked}
                                      className={`rounded-2xl border p-3 text-left transition ${
                                        isActiveLesson
                                          ? "border-blue-300/60 bg-blue-500/20"
                                          : isUnlocked
                                            ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                                            : "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-45"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <p className="text-sm font-semibold">
                                            Lesson {lesson.order}: {lesson.title}
                                          </p>
                                          <p className="mt-1 text-xs text-white/45">
                                            {getLessonTypeLabel(lesson)} ·{" "}
                                            {lesson.estimatedMinutes} min · +
                                            {lesson.xpReward} XP
                                          </p>
                                        </div>

                                        <span
                                          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                                            isCompleted
                                              ? "bg-emerald-400/10 text-emerald-200"
                                              : isUnlocked
                                                ? "bg-blue-400/10 text-blue-200"
                                                : "bg-white/5 text-white/45"
                                          }`}
                                        >
                                          {isCompleted
                                            ? "Done"
                                            : isUnlocked
                                              ? "Open"
                                              : "Locked"}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-blue-300">
                        Lesson {selectedLesson.order}
                      </p>
                      <h1 className="mt-2 text-3xl font-bold leading-tight">
                        {selectedLesson.title}
                      </h1>
                    </div>

                    <div className="shrink-0 rounded-2xl bg-blue-500/15 px-4 py-3 text-sm font-semibold text-blue-200">
                      +{selectedLesson.xpReward} XP
                    </div>
                  </div>

                  {selectedLessonCompleted && (
                    <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                      Lesson completed
                    </div>
                  )}

                  <p className="mt-4 text-sm leading-6 text-white/60">
                    {selectedLesson.shortDescription}
                  </p>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-[#111936] p-5">
                    <p className="text-sm font-semibold text-blue-300">
                      Why this matters
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/75">
                      {selectedLesson.realLifeWhy}
                    </p>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-[#111936] p-5">
                    <p className="text-sm font-semibold text-blue-300">
                      Tiny concept
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/75">
                      {selectedLesson.concept.explanation}
                    </p>
                    <p className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-sm font-semibold text-white/85">
                      {selectedLesson.concept.keyIdea}
                    </p>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-[#111936] p-5">
                    <p className="text-sm font-semibold text-blue-300">
                      Your task
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/75">
                      {selectedLesson.task.instruction}
                    </p>

                    <ul className="mt-4 space-y-2 text-sm text-white/60">
                      {selectedLesson.task.successCriteria.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <LessonHints
                      lessonId={selectedLesson.id}
                      hints={selectedLesson.hints}
                    />
                  </div>

                  <div className="mt-4">
                    <TutorChat
                      lesson={selectedLesson}
                      language={selectedLanguage}
                      currentCode={userCode}
                      anonymousSessionId={anonymousSessionId}
                    />
                  </div>
                </div>
              </section>

              <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex shrink-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-blue-300">
                        Code editor
                      </p>

                      {draftSaveStatus === "saved" && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                          Autosaved
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-white/50">
                      {selectedLesson.starterCode.editorLanguage}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {previousLesson && (
                        <button
                          onClick={() => loadLesson(previousLesson)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                          Previous
                        </button>
                      )}

                      {nextLesson && (
                        <button
                          onClick={() => loadLesson(nextLesson)}
                          disabled={!isLessonUnlocked(nextLesson)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next
                        </button>
                      )}

                      <button
                        onClick={() => setUseAiFeedback((current) => !current)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          useAiFeedback
                            ? "border-blue-400/30 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20"
                            : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {useAiFeedback ? "AI check: On" : "AI check: Off"}
                      </button>

                      <button
                        onClick={() => {
                          setUserCode(selectedLesson.starterCode.code);
                          setFeedback("");
                          setDraftSaveStatus("saved");
                          window.localStorage.removeItem(
                            getLessonDraftKey(selectedLesson.id)
                          );
                        }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        Reset code
                      </button>

                      <button
                        onClick={checkCode}
                        className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                      >
                        Check my code
                      </button>
                    </div>

                    <p className="text-xs leading-5 text-white/45">
                      {useAiFeedback
                        ? "AI check gives personalized tutor feedback and uses 1 AI check. Shortcut: Ctrl + Enter."
                        : "Basic check is instant and does not use your AI checks. Shortcut: Ctrl + Enter."}
                    </p>
                  </div>
                </div>

                <div className="min-h-0 flex-[1.15] overflow-hidden">
                  <CodeEditor
                    value={userCode}
                    language={selectedLesson.starterCode.editorLanguage}
                    onChange={setUserCode}
                    onRun={checkCode}
                  />
                </div>

                <div className="mt-4 min-h-0 flex-[0.85] overflow-hidden">
                  <OutputPreview lesson={selectedLesson} code={userCode} />
                </div>

                {feedback && (
                  <div className="mt-4 max-h-40 shrink-0 overflow-y-auto rounded-3xl border border-blue-400/30 bg-blue-500/10 p-4">
                    <p className="text-sm font-semibold text-blue-300">
                      {selectedLanguage.tutorName} says:
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {feedback}
                    </p>

                    {selectedLessonCompleted && nextLesson && (
                      <button
                        onClick={() => loadLesson(nextLesson)}
                        disabled={!isLessonUnlocked(nextLesson)}
                        className="mt-4 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                      >
                        Start Lesson {nextLesson.order}: {nextLesson.title}
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}