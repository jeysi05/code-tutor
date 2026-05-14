export type LanguageId =
  | "html-css"
  | "javascript"
  | "react"
  | "typescript"
  | "python"
  | "sql"
  | "git";

export type GoalId =
  | "build-website"
  | "make-interactive-apps"
  | "analyze-data"
  | "get-tech-job"
  | "understand-web-apps"
  | "organize-code-projects";

export type Language = {
  id: LanguageId;
  name: string;
  shortName: string;
  description: string;
  tutorName: string;
  tutorPersonality: string;
  tutorIntro: string;
  learningStyle: string;
};

export type Goal = {
  id: GoalId;
  title: string;
  description: string;
  recommendedLanguages: LanguageId[];
};

export const languages: Language[] = [
  {
    id: "html-css",
    name: "HTML/CSS",
    shortName: "HTML/CSS",
    description: "Build and style web pages that people can see and use.",
    tutorName: "Pixel",
    tutorPersonality: "Fun, visual, and encouraging like an art teacher.",
    tutorIntro:
      "Hey, I’m Pixel. I’ll help you turn plain pages into something that actually looks good.",
    learningStyle: "Live preview, design-first learning",
  },
  {
    id: "javascript",
    name: "JavaScript",
    shortName: "JS",
    description: "Make websites interactive with buttons, logic, and behavior.",
    tutorName: "Jax",
    tutorPersonality: "Energetic and playful, focused on making things move.",
    tutorIntro:
      "Yo, I’m Jax. We’re going to make your pages react, move, and feel alive.",
    learningStyle: "Browser feedback and interactive experiments",
  },
  {
    id: "react",
    name: "React",
    shortName: "React",
    description: "Build modern user interfaces piece by piece.",
    tutorName: "Rhea",
    tutorPersonality: "Hype, creative, and focused on building real UI.",
    tutorIntro:
      "I’m Rhea. We’ll build interfaces one piece at a time until React finally clicks.",
    learningStyle: "Component-based UI building",
  },
  {
    id: "typescript",
    name: "TypeScript",
    shortName: "TS",
    description: "Write safer JavaScript by catching mistakes earlier.",
    tutorName: "Archie",
    tutorPersonality: "Careful architect who loves structure and clarity.",
    tutorIntro:
      "I’m Archie. I’ll help you spot bugs before they become real problems.",
    learningStyle: "Catch-the-bug challenges",
  },
  {
    id: "python",
    name: "Python",
    shortName: "Python",
    description: "Learn beginner-friendly coding for scripts, logic, and problem solving.",
    tutorName: "Py",
    tutorPersonality: "Chill, friendly mentor who explains with simple analogies.",
    tutorIntro:
      "Hey, I’m Py. We’ll keep things simple, useful, and beginner-friendly.",
    learningStyle: "Story and project-driven learning",
  },
  {
    id: "sql",
    name: "SQL",
    shortName: "SQL",
    description: "Ask questions from data and find useful answers.",
    tutorName: "Query",
    tutorPersonality: "Curious detective who investigates data step by step.",
    tutorIntro:
      "I’m Query. Think of every database like a mystery, and every query like a clue.",
    learningStyle: "Dataset exploration",
  },
  {
    id: "git",
    name: "Git",
    shortName: "Git",
    description: "Track code changes, save progress, and work like a developer.",
    tutorName: "Libby",
    tutorPersonality: "Organized librarian who keeps every version in order.",
    tutorIntro:
      "I’m Libby. I’ll help you save your work properly and understand your project history.",
    learningStyle: "Visual branching and version control practice",
  },
];

export const goals: Goal[] = [
  {
    id: "build-website",
    title: "Build a website",
    description: "I want to create pages, style them, and make them look good.",
    recommendedLanguages: ["html-css", "javascript", "react"],
  },
  {
    id: "make-interactive-apps",
    title: "Make interactive apps",
    description: "I want buttons, inputs, logic, and pages that respond to users.",
    recommendedLanguages: ["javascript", "react", "typescript"],
  },
  {
    id: "analyze-data",
    title: "Analyze data",
    description: "I want to explore information, filter results, and find patterns.",
    recommendedLanguages: ["python", "sql"],
  },
  {
    id: "get-tech-job",
    title: "Get a job in tech",
    description: "I want practical skills that show up in real developer work.",
    recommendedLanguages: ["javascript", "react", "typescript", "git"],
  },
  {
    id: "understand-web-apps",
    title: "Understand web apps",
    description: "I want to understand how modern websites are built.",
    recommendedLanguages: ["html-css", "javascript", "react", "typescript"],
  },
  {
    id: "organize-code-projects",
    title: "Organize code projects",
    description: "I want to save versions, track changes, and manage projects properly.",
    recommendedLanguages: ["git"],
  },
];

export function getLanguageById(languageId: LanguageId) {
  return languages.find((language) => language.id === languageId);
}

export function getGoalById(goalId: GoalId) {
  return goals.find((goal) => goal.id === goalId);
}