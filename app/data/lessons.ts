import type { LanguageId } from "./onboarding";

export type LessonCheckMode =
  | "static-rules"
  | "ai-code-review"
  | "simulated-output"
  | "visual-check"
  | "self-check";

export type LessonDifficulty = "beginner" | "easy" | "medium";

export type LessonType =
  | "concept"
  | "practice"
  | "mini-project"
  | "challenge"
  | "final-project";

export type Lesson = {
  id: string;
  language: LanguageId;
  order: number;
  slug: string;
  title: string;
  shortDescription: string;
  difficulty: LessonDifficulty;
  estimatedMinutes: number;
  xpReward: number;

  moduleId: string;
  moduleTitle: string;
  moduleOrder: number;
  lessonType: LessonType;

  learningGoal: string;
  realLifeWhy: string;
  concept: {
    explanation: string;
    keyIdea: string;
  };
  starterCode: {
    editorLanguage: string;
    code: string;
  };
  task: {
    instruction: string;
    successCriteria: string[];
  };
  hints: {
    id: string;
    text: string;
  }[];
  check: {
    mode: LessonCheckMode;
    rules: {
      id: string;
      description: string;
      requiredIncludes?: string[];
      forbiddenIncludes?: string[];
      expectedOutput?: string;
    }[];
    aiPromptTemplate: string;
  };
  success: {
    message: string;
    nextLessonPrompt: string;
  };
  failure: {
    encouragement: string;
    retryPrompt: string;
  };
};

const defaultAiPromptTemplate = `
You are {tutorName}, the AI tutor for {language}.

Tutor personality:
{tutorPersonality}

Lesson title:
{lessonTitle}

Lesson goal:
{learningGoal}

Real-life reason:
{realLifeWhy}

Starter code:
{starterCode}

User task:
{taskInstruction}

Success criteria:
{successCriteria}

User submitted code:
{userCode}

Your job:
Review the user's code based only on this lesson's goal.
Be short, specific, encouraging, and beginner-friendly.
Do not give a long lecture.
If the code is correct, celebrate briefly and explain what they did right.
If the code has an issue, point out the most important fix first.
Do not solve the whole thing unless the user is clearly stuck.
`;

export const lessons: Lesson[] = [
  {
    id: "html-css-001",
    language: "html-css",
    order: 1,
    slug: "style-your-first-card",
    title: "Style Your First Card",
    shortDescription: "Edit text and CSS to make a simple card feel personal.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 20,
    moduleId: "html-css-module-1",
    moduleTitle: "HTML/CSS Foundations",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn how HTML creates content and CSS changes how that content looks.",
    realLifeWhy:
      "Every website is made of content and style. HTML gives the page meaning, while CSS makes it feel designed instead of plain.",
    concept: {
      explanation:
        "HTML is the structure of a page. CSS is the styling layer that controls colors, spacing, borders, and layout.",
      keyIdea: "HTML says what something is. CSS decides how it looks.",
    },
    starterCode: {
      editorLanguage: "html",
      code: `<div class="card">
  <h1>Hello, learner!</h1>
  <p>This is my first styled card.</p>
  <button>Click me</button>
</div>

<style>
  .card {
    background-color: white;
    color: black;
    padding: 24px;
    border-radius: 16px;
    font-family: Arial, sans-serif;
  }

  button {
    background-color: royalblue;
    color: white;
    padding: 12px 16px;
    border: none;
    border-radius: 999px;
  }
</style>`,
    },
    task: {
      instruction:
        "Change the heading text, paragraph text, and at least one color in the CSS.",
      successCriteria: [
        "The heading text is changed",
        "The paragraph text is changed",
        "At least one CSS color is changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Try changing the words inside the <h1> and <p> tags first.",
      },
      {
        id: "hint-2",
        text: "Look for background-color or color in the CSS and change one value.",
      },
    ],
    check: {
      mode: "visual-check",
      rules: [
        {
          id: "has-card",
          description: "The code should still include the card container.",
          requiredIncludes: ['class="card"'],
        },
        {
          id: "changed-heading",
          description: "The default heading should be changed.",
          forbiddenIncludes: ["Hello, learner!"],
        },
        {
          id: "changed-paragraph",
          description: "The default paragraph should be changed.",
          forbiddenIncludes: ["This is my first styled card."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You changed both the content and the style. That is the heart of building web pages.",
      nextLessonPrompt:
        "Next, you’ll style a button so it feels more clickable.",
    },
    failure: {
      encouragement:
        "You’re close. This task is about changing both the text and at least one style.",
      retryPrompt:
        "Try editing the heading, the paragraph, and one color value.",
    },
  },
  {
    id: "javascript-001",
    language: "javascript",
    order: 1,
    slug: "change-a-message",
    title: "Change a Message",
    shortDescription: "Use a variable to control what appears on the page.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 20,
    moduleId: "javascript-module-1",
    moduleTitle: "JavaScript Foundations",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn how a JavaScript variable can store a value and reuse it.",
    realLifeWhy:
      "Apps constantly store small pieces of information like names, scores, prices, and messages. Variables are how programs remember those values.",
    concept: {
      explanation:
        "A variable is a named container for a value. In JavaScript, let lets you create a variable that can be changed later.",
      keyIdea: "A variable lets your code remember something.",
    },
    starterCode: {
      editorLanguage: "javascript",
      code: `let message = "Hello, learner!";

console.log(message);`,
    },
    task: {
      instruction:
        "Change the message variable so it prints your own short message.",
      successCriteria: [
        "The code uses let message",
        "The code uses console.log(message)",
        "The message is different from Hello, learner!",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep let message, but change the text inside the quotation marks.",
      },
      {
        id: "hint-2",
        text: 'Example: let message = "I am learning JavaScript!";',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-message-variable",
          description: "The code should use the message variable.",
          requiredIncludes: ["let message"],
        },
        {
          id: "logs-message",
          description: "The code should print the message variable.",
          requiredIncludes: ["console.log(message)"],
        },
        {
          id: "changed-message",
          description: "The default message should be changed.",
          forbiddenIncludes: ["Hello, learner!"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message: "Nice! You used a variable to control what JavaScript prints.",
      nextLessonPrompt:
        "Next, you’ll use a condition so your code can make a decision.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is about changing the value stored in the message variable.",
      retryPrompt:
        "Change only the text inside the quotation marks, then keep console.log(message).",
    },
  },
  {
    id: "react-001",
    language: "react",
    order: 1,
    slug: "your-first-component",
    title: "Your First Component",
    shortDescription: "Create a tiny reusable piece of UI.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    xpReward: 25,
    moduleId: "react-module-1",
    moduleTitle: "React Foundations",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal: "Learn that React apps are built from components.",
    realLifeWhy:
      "Modern websites reuse UI pieces everywhere: buttons, cards, navbars, and profile sections. React components help you build those pieces once and reuse them.",
    concept: {
      explanation:
        "A React component is a function that returns UI. You can think of it like a custom building block for your page.",
      keyIdea: "Components are reusable UI building blocks.",
    },
    starterCode: {
      editorLanguage: "typescript",
      code: `function WelcomeCard() {
  return (
    <div>
      <h1>Hello, learner!</h1>
      <p>This is my first React component.</p>
    </div>
  );
}

export default WelcomeCard;`,
    },
    task: {
      instruction:
        "Change the heading and paragraph so the component introduces you.",
      successCriteria: [
        "The component is still named WelcomeCard",
        "The heading text is changed",
        "The paragraph text is changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Change the text between <h1> and </h1>.",
      },
      {
        id: "hint-2",
        text: "Then change the text between <p> and </p>.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "keeps-component",
          description: "The WelcomeCard component should still exist.",
          requiredIncludes: ["function WelcomeCard()"],
        },
        {
          id: "changed-heading",
          description: "The default heading should be changed.",
          forbiddenIncludes: ["Hello, learner!"],
        },
        {
          id: "changed-paragraph",
          description: "The default paragraph should be changed.",
          forbiddenIncludes: ["This is my first React component."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Great work! You edited your first React component. That is how React pages start becoming real interfaces.",
      nextLessonPrompt:
        "Next, you’ll pass information into a component using props.",
    },
    failure: {
      encouragement:
        "Almost there. This lesson is just about editing the text inside the component.",
      retryPrompt:
        "Keep the component structure, then change the heading and paragraph text.",
    },
  },
  {
    id: "typescript-001",
    language: "typescript",
    order: 1,
    slug: "catch-a-wrong-type",
    title: "Catch a Wrong Type",
    shortDescription: "Fix a value that does not match its expected type.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "typescript-module-1",
    moduleTitle: "TypeScript Foundations",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn that TypeScript helps catch wrong value types before the app runs.",
    realLifeWhy:
      "A lot of bugs happen because code receives the wrong kind of value. TypeScript helps catch those mistakes earlier.",
    concept: {
      explanation:
        "A type describes what kind of value something should be, like string, number, or boolean. If the value does not match, TypeScript warns you.",
      keyIdea: "Types help your code catch mistakes early.",
    },
    starterCode: {
      editorLanguage: "typescript",
      code: `let age: number = "18";

console.log(age);`,
    },
    task: {
      instruction: "Fix the age variable so it stores a number instead of text.",
      successCriteria: [
        "The variable is still named age",
        "The type is still number",
        "The value is no longer inside quotation marks",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: 'The value "18" is text because it is inside quotation marks.',
      },
      {
        id: "hint-2",
        text: 'Try changing "18" into 18.',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "keeps-number-type",
          description: "The age variable should still be typed as number.",
          requiredIncludes: ["let age: number"],
        },
        {
          id: "removes-string-age",
          description: "The age value should not be a string.",
          forbiddenIncludes: ['"18"'],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice fix! You turned the value into a real number, so the type now matches.",
      nextLessonPrompt: "Next, you’ll type a function parameter.",
    },
    failure: {
      encouragement:
        "You’re close. TypeScript wants age to be a number, not text.",
      retryPrompt: "Remove the quotation marks around 18.",
    },
  },
  {
    id: "python-001",
    language: "python",
    order: 1,
    slug: "your-first-message",
    title: "Make Python Say Something",
    shortDescription: "Change one line and make Python print your own message.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 20,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "concept",
    learningGoal: "Make Python show text on the screen using print().",
    realLifeWhy:
      "Before a program can feel useful, it needs to talk back. A calculator shows answers, a game shows scores, and a chatbot shows replies. print() is your first way to make Python respond.",
    concept: {
      explanation:
        "print() is Python’s “say this on screen” command. Put text inside quotation marks so Python treats it as words, not code.",
      keyIdea: "print() is how your program talks to you.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `print("Hello, world!")`,
    },
    task: {
      instruction:
        "Change the message so Python prints a short intro in your own words.",
      successCriteria: [
        "The code uses print()",
        "The message is inside quotation marks",
        "The message is different from Hello, world!",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep print() exactly where it is first.",
      },
      {
        id: "hint-2",
        text: 'Example: print("Hi, I’m John and I’m learning Python!")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-print",
          description: "Code should use print().",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-message",
          description: "Message should not stay as the default Hello, world!",
          forbiddenIncludes: ["Hello, world!"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice — you made Python say something that came from you, not the starter code.",
      nextLessonPrompt: "Next, we’ll give Python something to remember.",
    },
    failure: {
      encouragement:
        "You’re close. This one is just about changing the message inside print().",
      retryPrompt: "Keep print(), keep the quotation marks, and replace Hello, world! with your own message.",
    },
  },
  {
    id: "python-002",
    language: "python",
    order: 2,
    slug: "store-your-name",
    title: "Give Python a Name to Remember",
    shortDescription: "Store a name in a variable and print it back.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "concept",
    learningGoal: "Store text in a variable, then reuse that variable with print().",
    realLifeWhy:
      "Apps remember things all the time: usernames, saved drafts, scores, settings, and profile names. A variable is the first tiny version of that memory.",
    concept: {
      explanation:
        "A variable is a label attached to a value. Instead of typing the same text again and again, you store it once and reuse the name.",
      keyIdea: "A variable lets Python remember something for later.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = "Alex"
print(name)`,
    },
    task: {
      instruction:
        "Put your own name inside the name variable, then print the variable.",
      successCriteria: [
        "The code creates a variable named name",
        "The code uses = to store a value",
        "The code prints the name variable",
        "The name is different from Alex",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep the variable name as name.",
      },
      {
        id: "hint-2",
        text: "Change the text inside the quotation marks on the first line.",
      },
      {
        id: "hint-3",
        text: "Keep print(name). That prints the value stored in the variable.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-name-variable",
          description: "The code should create a variable named name.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "prints-name-variable",
          description: "The code should print the name variable.",
          requiredIncludes: ["print(name)"],
        },
        {
          id: "changed-default-name",
          description: "The default name should be changed.",
          forbiddenIncludes: ['name = "Alex"', "name = 'Alex'"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message: "Nice! Python remembered the name and printed it back using the variable.",
      nextLessonPrompt:
        "Next, we’ll store a number instead of text.",
    },
    failure: {
      encouragement:
        "Almost. The goal is to change what the name variable stores.",
      retryPrompt:
        "Keep name = ..., change Alex to another name, then keep print(name).",
    },
  },
  {
    id: "python-003",
    language: "python",
    order: 3,
    slug: "store-a-number",
    title: "Store a Number Python Can Use",
    shortDescription: "Save a number in a variable without quotation marks.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "concept",
    learningGoal: "Store a number in a variable and print it.",
    realLifeWhy:
      "Programs use numbers everywhere: ages, prices, grades, scores, quantities, timers, and measurements. Once Python can store numbers, it can start calculating.",
    concept: {
      explanation:
        "Text usually goes inside quotation marks. Numbers usually do not. That difference matters because Python can do math with numbers.",
      keyIdea: "Text gets quotes. Numbers usually stand on their own.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `age = 18
print(age)`,
    },
    task: {
      instruction:
        "Change the number stored in age, then print it.",
      successCriteria: [
        "The code creates a variable named age",
        "The value is a number",
        "The code prints the age variable",
        "The number is different from 18",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep the variable name as age.",
      },
      {
        id: "hint-2",
        text: "Change the number after the equals sign.",
      },
      {
        id: "hint-3",
        text: "Do not put quotation marks around the number.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-age-variable",
          description: "The code should create a variable named age.",
          requiredIncludes: ["age", "="],
        },
        {
          id: "prints-age-variable",
          description: "The code should print the age variable.",
          requiredIncludes: ["print(age)"],
        },
        {
          id: "changed-default-age",
          description: "The default age should be changed.",
          forbiddenIncludes: ["age = 18"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message: "Great — you stored a real number that Python can use later.",
      nextLessonPrompt:
        "Next, we’ll print more than one line so output feels like a tiny profile.",
    },
    failure: {
      encouragement: "You’re close. This should be a number, not text.",
      retryPrompt: "Use age = your_number, then print it with print(age).",
    },
  },
  {
    id: "python-004",
    language: "python",
    order: 4,
    slug: "print-multiple-lines",
    title: "Print a Mini Profile",
    shortDescription: "Use multiple print lines to show more than one detail.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Use more than one print() statement to create multi-line output.",
    realLifeWhy:
      "A real result rarely fits on one line. Receipts, profiles, quiz results, and summaries all need multiple pieces of information.",
    concept: {
      explanation:
        "Python runs from top to bottom. Each print() creates a new line in the output.",
      keyIdea: "More print() lines means more output lines.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `print("Name: Alex")
print("Favorite language: Python")`,
    },
    task: {
      instruction:
        "Change both print lines so Python shows a tiny profile about you.",
      successCriteria: [
        "The code uses at least two print() statements",
        "The first line is different from Name: Alex",
        "The second line is different from Favorite language: Python",
        "The output shows two lines",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep both print() statements.",
      },
      {
        id: "hint-2",
        text: "Change the text inside each pair of quotation marks.",
      },
      {
        id: "hint-3",
        text: 'Example: print("Name: KC") and print("Goal: Build apps").',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-print",
          description: "The code should use print().",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-default-name-line",
          description: "The first default line should be changed.",
          forbiddenIncludes: ["Name: Alex"],
        },
        {
          id: "changed-default-language-line",
          description: "The second default line should be changed.",
          forbiddenIncludes: ["Favorite language: Python"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice — your output now feels like a small profile, not just one random line.",
      nextLessonPrompt:
        "Next, we’ll make Python calculate something.",
    },
    failure: {
      encouragement:
        "Almost. This lesson needs two separate print() lines.",
      retryPrompt:
        "Keep two print() statements and change the text inside both.",
    },
  },
  {
    id: "python-005",
    language: "python",
    order: 5,
    slug: "simple-math",
    title: "Make Python Do the Math",
    shortDescription: "Change the numbers and let Python calculate the answer.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    xpReward: 30,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Use variables and math operators to calculate a result.",
    realLifeWhy:
      "Useful apps calculate constantly: totals, discounts, grades, scores, calories, budgets, and game points. This is where Python starts doing work for you.",
    concept: {
      explanation:
        "Python can calculate with +, -, *, and /. Store numbers in variables, then combine those variables inside print().",
      keyIdea: "Variables plus math operators turn Python into a tiny calculator.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `score = 10
bonus = 5
print(score + bonus)`,
    },
    task: {
      instruction:
        "Change the numbers and the operation so Python prints a new result.",
      successCriteria: [
        "The code stores at least two numbers in variables",
        "The code uses print()",
        "The code uses a math operator like +, -, *, or /",
        "The numbers are different from the starter values",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Start by changing the values of score and bonus.",
      },
      {
        id: "hint-2",
        text: "Try replacing + with -, *, or /.",
      },
      {
        id: "hint-3",
        text: "Example: price = 100, discount = 20, then print(price - discount).",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-print",
          description: "The code should use print().",
          requiredIncludes: ["print("],
        },
        {
          id: "uses-assignment",
          description: "The code should store numbers in variables.",
          requiredIncludes: ["="],
        },
        {
          id: "changed-score",
          description: "The starter score should be changed.",
          forbiddenIncludes: ["score = 10"],
        },
        {
          id: "changed-bonus",
          description: "The starter bonus should be changed.",
          forbiddenIncludes: ["bonus = 5"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You made Python calculate using variables instead of hardcoded answers.",
      nextLessonPrompt:
        "Next, we’ll combine your first skills into a mini-project.",
    },
    failure: {
      encouragement:
        "You’re close. The program needs variables, numbers, print(), and a math operation.",
      retryPrompt:
        "Change the starter numbers, keep print(), and use +, -, *, or /.",
    },
  },
  {
    id: "python-006",
    language: "python",
    order: 6,
    slug: "personal-profile-generator",
    title: "Build Your First Tiny Profile App",
    shortDescription:
      "Combine variables and print lines into a small profile generator.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    xpReward: 40,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "mini-project",
    learningGoal:
      "Combine text variables, number variables, and multiple print lines in one mini-project.",
    realLifeWhy:
      "Real projects are built by combining small skills. This mini-project turns output, variables, numbers, and labels into something that feels like a tiny app.",
    concept: {
      explanation:
        "A mini-project is just small ideas working together. Here, Python stores your details, then prints them in a readable format.",
      keyIdea:
        "Small coding skills become useful when you combine them.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = "Alex"
age = 18
goal = "Learn Python"

print("Name:")
print(name)
print("Age:")
print(age)
print("Goal:")
print(goal)`,
    },
    task: {
      instruction:
        "Customize the profile by changing the name, age, and goal variables.",
      successCriteria: [
        "The code has a name variable",
        "The code has an age variable",
        "The code has a goal variable",
        "The code prints the name variable",
        "The code prints the age variable",
        "The code prints the goal variable",
        "The default starter values are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Change the values after the equals signs first.",
      },
      {
        id: "hint-2",
        text: "Text needs quotation marks. Numbers usually do not.",
      },
      {
        id: "hint-3",
        text: "Keep print(name), print(age), and print(goal) so Python prints the stored values.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "has-name-variable",
          description: "The code should have a name variable.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "has-age-variable",
          description: "The code should have an age variable.",
          requiredIncludes: ["age", "="],
        },
        {
          id: "has-goal-variable",
          description: "The code should have a goal variable.",
          requiredIncludes: ["goal", "="],
        },
        {
          id: "prints-name",
          description: "The code should print the name variable.",
          requiredIncludes: ["print(name)"],
        },
        {
          id: "prints-age",
          description: "The code should print the age variable.",
          requiredIncludes: ["print(age)"],
        },
        {
          id: "prints-goal",
          description: "The code should print the goal variable.",
          requiredIncludes: ["print(goal)"],
        },
        {
          id: "changed-default-name",
          description: "The default name should be changed.",
          forbiddenIncludes: ['name = "Alex"', "name = 'Alex'"],
        },
        {
          id: "changed-default-age",
          description: "The default age should be changed.",
          forbiddenIncludes: ["age = 18"],
        },
        {
          id: "changed-default-goal",
          description: "The default goal should be changed.",
          forbiddenIncludes: ['goal = "Learn Python"', "goal = 'Learn Python'"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Module 1 complete! You can now make Python show output, remember values, store numbers, calculate, and build a tiny profile.",
      nextLessonPrompt:
        "Next, we’ll make your programs interactive so the user can type answers.",
    },
    failure: {
      encouragement:
        "You’re close. This project needs name, age, and goal variables, then it should print each one.",
      retryPrompt:
        "Change the starter values, then keep print(name), print(age), and print(goal).",
    },
  },
  {
    id: "python-007",
    language: "python",
    order: 7,
    slug: "ask-for-user-input",
    title: "Let the User Talk Back",
    shortDescription: "Use input() so the user can type an answer.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    xpReward: 30,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "concept",
    learningGoal:
      "Ask the user for information with input() and store the answer.",
    realLifeWhy:
      "A program that only talks is limited. Search bars, login forms, quizzes, calculators, and chatbots all begin by listening to what the user types.",
    concept: {
      explanation:
        "input() shows a prompt and waits for the user to type. Whatever they type can be saved in a variable.",
      keyIdea: "input() lets your program listen, not just speak.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("What is your name? ")
print(name)`,
    },
    task: {
      instruction:
        "Change the prompt so Python asks for a name in your own words, then print the answer.",
      successCriteria: [
        "The code uses input()",
        "The input answer is stored in a variable named name",
        "The code prints the name variable",
        "The prompt is different from What is your name?",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep name = input(...) so the answer is saved in name.",
      },
      {
        id: "hint-2",
        text: "Change the words inside the quotation marks inside input().",
      },
      {
        id: "hint-3",
        text: 'Example: name = input("Type your first name: ")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should use input().",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-name",
          description: "The input should be stored in a variable named name.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "prints-name",
          description: "The code should print the name variable.",
          requiredIncludes: ["print(name)"],
        },
        {
          id: "changed-default-prompt",
          description: "The default input prompt should be changed.",
          forbiddenIncludes: ["What is your name?"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice — your program can now ask a question and use the answer.",
      nextLessonPrompt:
        "Next, we’ll make that answer feel more personal inside a message.",
    },
    failure: {
      encouragement:
        "Almost. This lesson is about asking for input and storing the answer.",
      retryPrompt:
        "Use name = input(...), change the prompt text, then keep print(name).",
    },
  },
  {
    id: "python-008",
    language: "python",
    order: 8,
    slug: "use-input-in-a-message",
    title: "Greet the User by Name",
    shortDescription: "Use what the user typed inside a friendly message.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 30,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "practice",
    learningGoal:
      "Combine user input with your own text in print().",
    realLifeWhy:
      "Personal messages make apps feel alive. A greeting, confirmation screen, quiz result, or chatbot reply often includes something the user typed.",
    concept: {
      explanation:
        "After input() stores an answer in a variable, you can place that variable inside a message using + or an f-string.",
      keyIdea:
        "Input becomes useful when your program responds with it.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("Type your name: ")
print("Hello, " + name)`,
    },
    task: {
      instruction:
        "Change the prompt and greeting so Python prints a custom message using name.",
      successCriteria: [
        "The code uses input()",
        "The answer is stored in a variable named name",
        "The code uses print()",
        "The printed message uses the name variable",
        "The prompt is different from Type your name:",
        "The greeting is different from Hello,",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "You can use either + or an f-string, like print(f\"Welcome, {name}\").",
      },
      {
        id: "hint-2",
        text: 'You can use string concatenation: print("Welcome, " + name).',
      },
      {
        id: "hint-3",
        text: 'Or you can use an f-string: print(f"Welcome, {name}").',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should use input().",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-name",
          description: "The input should be stored in a variable named name.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "uses-print",
          description: "The code should use print().",
          requiredIncludes: ["print("],
        },
        {
          id: "uses-name-in-message",
          description: "The printed message should use the name variable.",
          requiredIncludes: ["name"],
        },
        {
          id: "changed-default-prompt",
          description: "The default prompt should be changed.",
          forbiddenIncludes: ["Type your name:"],
        },
        {
          id: "changed-default-greeting",
          description: "The default greeting should be changed.",
          forbiddenIncludes: ["Hello, "],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! Your program now replies using the user’s own name.",
      nextLessonPrompt:
        "Next, we’ll ask for more than one answer.",
    },
    failure: {
      encouragement:
        "You’re close. The message needs to include the user’s input.",
      retryPrompt:
        "Use name = input(...), change the prompt, then print a message that includes name.",
    },
  },
  {
    id: "python-009",
    language: "python",
    order: 9,
    slug: "store-multiple-inputs",
    title: "Remember Two Answers",
    shortDescription: "Ask for two details and use both in one sentence.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 30,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "practice",
    learningGoal:
      "Collect multiple pieces of information with input().",
    realLifeWhy:
      "Imagine a food app that remembers your name but forgets your order. Not very useful. Real apps usually need more than one answer.",
    concept: {
      explanation:
        "You can use input() more than once. Each answer should go into its own variable so Python can use them separately.",
      keyIdea:
        "Two inputs let your program feel more like a real conversation.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("Enter your name: ")
favorite_food = input("Enter your favorite food: ")

print(f"{name} likes {favorite_food}.")`,
    },
    task: {
      instruction:
        "Ask for a name and a favorite food, then print one sentence using both answers.",
      successCriteria: [
        "The code uses input() at least twice",
        "The first answer is stored in a variable named name",
        "The second answer is stored in a variable named favorite_food",
        "The code uses print()",
        "The printed sentence uses both name and favorite_food",
        "The prompts are different from the starter prompts",
        "The final sentence is different from the starter sentence",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep two input() lines: one for name and one for favorite_food.",
      },
      {
        id: "hint-2",
        text: "Use both variables in the final print() line.",
      },
      {
        id: "hint-3",
        text: 'Example: print(f"{name} wants to eat {favorite_food} today.")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should use input().",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-name",
          description: "The first input should be stored in name.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "stores-favorite-food",
          description: "The second input should be stored in favorite_food.",
          requiredIncludes: ["favorite_food", "="],
        },
        {
          id: "uses-print",
          description: "The code should use print().",
          requiredIncludes: ["print("],
        },
        {
          id: "uses-name-variable",
          description: "The final sentence should use name.",
          requiredIncludes: ["name"],
        },
        {
          id: "uses-favorite-food-variable",
          description: "The final sentence should use favorite_food.",
          requiredIncludes: ["favorite_food"],
        },
        {
          id: "changed-name-prompt",
          description: "The first starter prompt should be changed.",
          forbiddenIncludes: ["Enter your name:"],
        },
        {
          id: "changed-food-prompt",
          description: "The second starter prompt should be changed.",
          forbiddenIncludes: ["Enter your favorite food:"],
        },
        {
          id: "changed-starter-sentence-double",
          description: "The starter sentence should be changed.",
          forbiddenIncludes: ['f"{name} likes {favorite_food}."'],
        },
        {
          id: "changed-starter-sentence-single",
          description: "The starter sentence should be changed.",
          forbiddenIncludes: ["f'{name} likes {favorite_food}.'"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Great! Your program collected two answers and used them together.",
      nextLessonPrompt:
        "Next, we’ll turn typed number answers into real numbers Python can calculate with.",
    },
    failure: {
      encouragement:
        "You’re close. This needs two input() lines and one final message using both answers.",
      retryPrompt:
        "Ask for name and favorite_food, change both prompts, then print a sentence using both variables.",
    },
  },
  {
    id: "python-010",
    language: "python",
    order: 10,
    slug: "convert-text-to-numbers",
    title: "Turn Typed Text into a Number",
    shortDescription: "Use int() so Python can calculate with user input.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 35,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "concept",
    learningGoal:
      "Convert input text into a number using int().",
    realLifeWhy:
      "When a user types 19, Python first receives it as text. For age calculators, budgets, quantities, and scores, you need to convert that text before doing math.",
    concept: {
      explanation:
        "input() always gives text. int() turns number-looking text, like \"19\", into the number 19.",
      keyIdea: "Use int() when typed input needs to become a number.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `age = input("Enter your age: ")
next_year = int(age) + 1

print(f"Next year, you will be {next_year}.")`,
    },
    task: {
      instruction:
        "Change the prompt and final message, then calculate the user’s age next year with int(age).",
      successCriteria: [
        "The code uses input()",
        "The answer is stored in a variable named age",
        "The code uses int(age)",
        "The code adds 1 to the converted age",
        "The code stores the result in next_year",
        "The code prints a sentence using next_year",
        "The prompt is different from Enter your age:",
        "The final message is different from Next year, you will be",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "input() gives text, even when the user types digits.",
      },
      {
        id: "hint-2",
        text: "int(age) turns the typed age into a number.",
      },
      {
        id: "hint-3",
        text: "Keep next_year = int(age) + 1.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should use input().",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-age",
          description: "The input should be stored in a variable named age.",
          requiredIncludes: ["age", "="],
        },
        {
          id: "uses-int-age",
          description: "The code should convert age using int(age).",
          requiredIncludes: ["int(age)"],
        },
        {
          id: "uses-addition",
          description: "The code should add 1 to the converted age.",
          requiredIncludes: ["+", "1"],
        },
        {
          id: "stores-next-year",
          description: "The result should be stored in next_year.",
          requiredIncludes: ["next_year", "="],
        },
        {
          id: "uses-print",
          description: "The code should print a result.",
          requiredIncludes: ["print("],
        },
        {
          id: "uses-next-year-in-message",
          description: "The printed message should use next_year.",
          requiredIncludes: ["next_year"],
        },
        {
          id: "changed-default-prompt",
          description: "The default prompt should be changed.",
          forbiddenIncludes: ["Enter your age:"],
        },
        {
          id: "changed-default-message",
          description: "The default final message should be changed.",
          forbiddenIncludes: ["Next year, you will be"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You converted typed text into a number and used it in a calculation.",
      nextLessonPrompt:
        "Next, we’ll use this pattern in a small calculator project.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson needs input(), int(age), + 1, and a message using next_year.",
      retryPrompt:
        "Store the input in age, calculate next_year = int(age) + 1, then print a custom sentence using next_year.",
    },
  },
  {
    id: "python-011",
    language: "python",
    order: 11,
    slug: "age-calculator-mini-project",
    title: "Build a Tiny Age Calculator",
    shortDescription:
      "Ask, convert, calculate, and respond in one mini-project.",
    difficulty: "beginner",
    estimatedMinutes: 12,
    xpReward: 45,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "mini-project",
    learningGoal:
      "Combine input(), int(), variables, math, and friendly output.",
    realLifeWhy:
      "This is the pattern behind many beginner-friendly apps: ask for information, convert what needs converting, calculate something, then show a helpful result.",
    concept: {
      explanation:
        "This mini-project asks for a name and age, converts the age into a number, calculates two results, and prints friendly messages.",
      keyIdea:
        "Interactive programs ask, convert, calculate, and respond.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("Enter your name: ")
age = input("Enter your age: ")
next_year = int(age) + 1

double_age = int(age) * 2

print(f"Hi {name}!")
print(f"Next year, you will be {next_year}.")
print(f"Double your age is {double_age}.")`,
    },
    task: {
      instruction:
        "Customize the calculator by changing both prompts and all final messages while keeping the math working.",
      successCriteria: [
        "The code asks for a name using input()",
        "The code asks for an age using input()",
        "The code stores the name in a variable named name",
        "The code stores the age in a variable named age",
        "The code uses int(age)",
        "The code calculates next_year",
        "The code calculates double_age",
        "The code prints messages using name, next_year, and double_age",
        "The starter prompts are changed",
        "The starter messages are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep the two input() lines for name and age.",
      },
      {
        id: "hint-2",
        text: "Use int(age) before doing math with the typed age.",
      },
      {
        id: "hint-3",
        text: "Change the message text, but keep the variable names working.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should use input().",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-name",
          description: "The code should store the user's name.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "stores-age",
          description: "The code should store the user's age.",
          requiredIncludes: ["age", "="],
        },
        {
          id: "uses-int-age",
          description: "The code should convert age using int(age).",
          requiredIncludes: ["int(age)"],
        },
        {
          id: "stores-next-year",
          description: "The code should calculate next_year.",
          requiredIncludes: ["next_year", "="],
        },
        {
          id: "stores-double-age",
          description: "The code should calculate double_age.",
          requiredIncludes: ["double_age", "="],
        },
        {
          id: "uses-print",
          description: "The code should print output.",
          requiredIncludes: ["print("],
        },
        {
          id: "uses-name-in-output",
          description: "The output should use name.",
          requiredIncludes: ["name"],
        },
        {
          id: "uses-next-year-in-output",
          description: "The output should use next_year.",
          requiredIncludes: ["next_year"],
        },
        {
          id: "uses-double-age-in-output",
          description: "The output should use double_age.",
          requiredIncludes: ["double_age"],
        },
        {
          id: "changed-name-prompt",
          description: "The default name prompt should be changed.",
          forbiddenIncludes: ["Enter your name:"],
        },
        {
          id: "changed-age-prompt",
          description: "The default age prompt should be changed.",
          forbiddenIncludes: ["Enter your age:"],
        },
        {
          id: "changed-hi-message",
          description: "The default greeting should be changed.",
          forbiddenIncludes: ["Hi {name}!"],
        },
        {
          id: "changed-next-year-message",
          description: "The default next-year message should be changed.",
          forbiddenIncludes: ["Next year, you will be"],
        },
        {
          id: "changed-double-age-message",
          description: "The default double-age message should be changed.",
          forbiddenIncludes: ["Double your age is"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Module 2 complete! Your programs can now ask questions, use answers, convert typed numbers, and build a small interactive calculator.",
      nextLessonPrompt:
        "Next, we’ll teach Python how to make decisions.",
    },
    failure: {
      encouragement:
        "You’re close. This project needs name input, age input, int(age), next_year, double_age, and custom messages.",
      retryPrompt:
        "Change both prompts and final messages, but keep name, age, int(age), next_year, and double_age working.",
    },
  },
  {
    id: "python-012",
    language: "python",
    order: 12,
    slug: "your-first-if-statement",
    title: "Teach Python to Choose",
    shortDescription: "Use if so Python only runs code when a condition is true.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "concept",
    learningGoal:
      "Make Python choose whether to run a block of code using if.",
    realLifeWhy:
      "Apps make decisions constantly: show a warning, unlock a button, check an answer, or decide which message to show.",
    concept: {
      explanation:
        "An if statement checks a condition. If it is true, Python runs the indented code below it. If it is false, Python skips that block.",
      keyIdea: "if gives your program a choice.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `is_ready = "yes"

if is_ready == "yes":
    print("Let's start learning!")`,
    },
    task: {
      instruction:
        "Change the value, condition, and message while keeping the if statement working.",
      successCriteria: [
        "The code uses an if statement",
        "The code uses == to compare values",
        "The code prints a message only inside the if block",
        "The starter value is changed",
        "The starter message is changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep the colon after the if condition.",
      },
      {
        id: "hint-2",
        text: "The print line must stay indented under the if statement.",
      },
      {
        id: "hint-3",
        text: 'Example: if mood == "happy": print("Keep going!")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-if",
          description: "The code should use an if statement.",
          requiredIncludes: ["if ", ":"],
        },
        {
          id: "uses-equality",
          description: "The code should compare values using ==.",
          requiredIncludes: ["=="],
        },
        {
          id: "uses-print",
          description: "The code should print a message.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-default-value",
          description: "The starter value should be changed.",
          forbiddenIncludes: ['is_ready = "yes"', "is_ready = 'yes'"],
        },
        {
          id: "changed-default-message",
          description: "The starter message should be changed.",
          forbiddenIncludes: ["Let's start learning!"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! Python made its first decision in your code.",
      nextLessonPrompt:
        "Next, we’ll add an “otherwise” path with else.",
    },
    failure: {
      encouragement:
        "You’re close. This needs an if statement, a comparison, and an indented print message.",
      retryPrompt:
        "Use if, include ==, keep the colon, and indent the print line under the if statement.",
    },
  },
  {
    id: "python-013",
    language: "python",
    order: 13,
    slug: "else-statements",
    title: "Add the “Otherwise” Path",
    shortDescription: "Use else so your program has a second response.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "concept",
    learningGoal:
      "Use else to handle what happens when an if condition is false.",
    realLifeWhy:
      "Good apps do not only handle the perfect case. They also respond when something is wrong, missing, unavailable, or not allowed.",
    concept: {
      explanation:
        "else runs when the if condition is false. Together, if and else give your program two possible paths.",
      keyIdea: "if handles true. else handles everything else.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `score = 60

if score >= 75:
    print("You passed!")
else:
    print("Try again.")`,
    },
    task: {
      instruction:
        "Change the score and both messages while keeping the if/else decision working.",
      successCriteria: [
        "The code uses if",
        "The code uses else",
        "The condition uses >=",
        "The code has one message for passing",
        "The code has one message for not passing",
        "The starter score and messages are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "The else line should line up with the if line.",
      },
      {
        id: "hint-2",
        text: "The print lines should be indented under if and else.",
      },
      {
        id: "hint-3",
        text: "Try a score above and below the cutoff to see both outcomes.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-if",
          description: "The code should use if.",
          requiredIncludes: ["if "],
        },
        {
          id: "uses-else",
          description: "The code should use else.",
          requiredIncludes: ["else:"],
        },
        {
          id: "uses-greater-equal",
          description: "The condition should use >=.",
          requiredIncludes: [">="],
        },
        {
          id: "uses-print",
          description: "The code should print messages.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-score",
          description: "The starter score should be changed.",
          forbiddenIncludes: ["score = 60"],
        },
        {
          id: "changed-pass-message",
          description: "The starter pass message should be changed.",
          forbiddenIncludes: ["You passed!"],
        },
        {
          id: "changed-fail-message",
          description: "The starter else message should be changed.",
          forbiddenIncludes: ["Try again."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Great! Your program now handles two different outcomes.",
      nextLessonPrompt:
        "Next, we’ll practice checking whether answers match.",
    },
    failure: {
      encouragement:
        "Almost. This lesson needs both if and else with different messages.",
      retryPrompt:
        "Keep if, else, >=, and two indented print messages. Then change the starter score and messages.",
    },
  },
  {
    id: "python-014",
    language: "python",
    order: 14,
    slug: "comparison-operators",
    title: "Check If an Answer Matches",
    shortDescription: "Use == and != to compare text values.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "practice",
    learningGoal:
      "Use comparison operators to check whether values match or do not match.",
    realLifeWhy:
      "Apps compare values all the time: passwords, quiz answers, selected options, status labels, and search filters.",
    concept: {
      explanation:
        "== asks “are these the same?” while != asks “are these different?” Both create a true-or-false result.",
      keyIdea: "Comparisons turn values into decisions.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `answer = "python"

if answer == "python":
    print("Correct answer!")
else:
    print("Not quite.")`,
    },
    task: {
      instruction:
        "Create your own answer check by changing the answer, comparison value, and both messages.",
      successCriteria: [
        "The code stores an answer variable",
        "The code uses if and else",
        "The code uses == or !=",
        "The code prints different messages for each outcome",
        "The starter answer and messages are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Use == when two values should match.",
      },
      {
        id: "hint-2",
        text: "Use != when two values should be different.",
      },
      {
        id: "hint-3",
        text: 'Example: if answer == "blue": print("That matches!")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "has-answer-variable",
          description: "The code should store an answer variable.",
          requiredIncludes: ["answer", "="],
        },
        {
          id: "uses-if",
          description: "The code should use if.",
          requiredIncludes: ["if "],
        },
        {
          id: "uses-else",
          description: "The code should use else.",
          requiredIncludes: ["else:"],
        },
        {
          id: "uses-print",
          description: "The code should print messages.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-answer",
          description: "The starter answer should be changed.",
          forbiddenIncludes: ['answer = "python"', "answer = 'python'"],
        },
        {
          id: "changed-correct-message",
          description: "The starter correct message should be changed.",
          forbiddenIncludes: ["Correct answer!"],
        },
        {
          id: "changed-wrong-message",
          description: "The starter else message should be changed.",
          forbiddenIncludes: ["Not quite."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You made Python check whether an answer matches.",
      nextLessonPrompt:
        "Next, we’ll compare numbers with greater-than and less-than.",
    },
    failure: {
      encouragement:
        "You’re close. This needs an answer variable, an if/else decision, and custom messages.",
      retryPrompt:
        "Change the answer value, use if with == or !=, keep else, and update both messages.",
    },
  },
  {
    id: "python-015",
    language: "python",
    order: 15,
    slug: "greater-than-less-than",
    title: "React to a Number",
    shortDescription: "Use >, <, >=, and <= to check number limits.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "practice",
    learningGoal:
      "Compare numbers so Python can react to cutoffs and ranges.",
    realLifeWhy:
      "Number checks power age limits, grade cutoffs, stock warnings, temperature alerts, budgets, points, and levels.",
    concept: {
      explanation:
        "Use >, <, >=, and <= when your program needs to ask whether a number is above, below, or equal to a limit.",
      keyIdea: "Number comparisons let programs react to limits.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `temperature = 30

if temperature > 25:
    print("It is hot today.")
else:
    print("It is not too hot.")`,
    },
    task: {
      instruction:
        "Change the number, comparison, and messages to create your own number-based decision.",
      successCriteria: [
        "The code stores a number in a variable",
        "The code uses if and else",
        "The condition uses a number comparison like >, <, >=, or <=",
        "The code prints different messages for each outcome",
        "The starter number and messages are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Try changing temperature to score, age, points, or budget.",
      },
      {
        id: "hint-2",
        text: "Use >= when the cutoff value should count too.",
      },
      {
        id: "hint-3",
        text: "Example: if points >= 100: print(\"Level unlocked!\").",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-if",
          description: "The code should use if.",
          requiredIncludes: ["if "],
        },
        {
          id: "uses-else",
          description: "The code should use else.",
          requiredIncludes: ["else:"],
        },
        {
          id: "uses-print",
          description: "The code should print messages.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-temperature",
          description: "The starter number should be changed.",
          forbiddenIncludes: ["temperature = 30"],
        },
        {
          id: "changed-hot-message",
          description: "The starter first message should be changed.",
          forbiddenIncludes: ["It is hot today."],
        },
        {
          id: "changed-cool-message",
          description: "The starter second message should be changed.",
          forbiddenIncludes: ["It is not too hot."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Great! Your program can now react to a number cutoff.",
      nextLessonPrompt:
        "Next, we’ll check more than one condition at a time.",
    },
    failure: {
      encouragement:
        "Almost. This needs a number variable, an if/else decision, and custom messages.",
      retryPrompt:
        "Change the starter number and messages, then use a comparison like >, <, >=, or <=.",
    },
  },
  {
    id: "python-016",
    language: "python",
    order: 16,
    slug: "multiple-conditions",
    title: "Check Two Things at Once",
    shortDescription: "Use and/or to combine conditions.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 40,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "practice",
    learningGoal:
      "Use and and or to check multiple conditions in one decision.",
    realLifeWhy:
      "Real rules often depend on more than one thing: username and password, age and ID, stock and payment, schedule and availability.",
    concept: {
      explanation:
        "and means both conditions must be true. or means at least one condition must be true.",
      keyIdea: "Multiple conditions make your program’s decisions more realistic.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `age = 20
has_id = "yes"

if age >= 18 and has_id == "yes":
    print("You can enter.")
else:
    print("You cannot enter yet.")`,
    },
    task: {
      instruction:
        "Create your own decision that checks two conditions using and or or.",
      successCriteria: [
        "The code stores at least two values in variables",
        "The code uses if and else",
        "The condition uses and or or",
        "The code prints different messages for each outcome",
        "The starter values and messages are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Use and when both conditions must be true.",
      },
      {
        id: "hint-2",
        text: "Use or when only one condition needs to be true.",
      },
      {
        id: "hint-3",
        text: 'Example: if points >= 100 or badge == "yes": print("Reward unlocked!")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-if",
          description: "The code should use if.",
          requiredIncludes: ["if "],
        },
        {
          id: "uses-else",
          description: "The code should use else.",
          requiredIncludes: ["else:"],
        },
        {
          id: "uses-print",
          description: "The code should print messages.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-age",
          description: "The starter age should be changed.",
          forbiddenIncludes: ["age = 20"],
        },
        {
          id: "changed-id",
          description: "The starter ID value should be changed.",
          forbiddenIncludes: ['has_id = "yes"', "has_id = 'yes'"],
        },
        {
          id: "changed-enter-message",
          description: "The starter first message should be changed.",
          forbiddenIncludes: ["You can enter."],
        },
        {
          id: "changed-blocked-message",
          description: "The starter second message should be changed.",
          forbiddenIncludes: ["You cannot enter yet."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You combined conditions to make a more realistic decision.",
      nextLessonPrompt:
        "Next, we’ll build a pass-or-fail checker mini-project.",
    },
    failure: {
      encouragement:
        "You’re close. This needs two values, if/else, and a condition using and or or.",
      retryPrompt:
        "Change the starter values and messages, then use and or or inside the if condition.",
    },
  },
  {
    id: "python-017",
    language: "python",
    order: 17,
    slug: "pass-or-fail-checker",
    title: "Build a Pass-or-Fail Checker",
    shortDescription:
      "Ask for a score, make a decision, and print the result.",
    difficulty: "beginner",
    estimatedMinutes: 12,
    xpReward: 50,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "mini-project",
    learningGoal:
      "Combine input(), int(), if/else, comparisons, and custom messages.",
    realLifeWhy:
      "Decision-based programs are everywhere: grade checkers, eligibility forms, quiz results, warnings, recommendations, and approval systems.",
    concept: {
      explanation:
        "This mini-project follows a useful pattern: ask for input, convert the number, check a condition, then print one of two results.",
      keyIdea: "A useful program can ask, calculate, decide, and respond.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("Enter your name: ")
score = input("Enter your score: ")

if int(score) >= 75:
    print(f"{name}, you passed!")
else:
    print(f"{name}, keep practicing.")`,
    },
    task: {
      instruction:
        "Customize the checker by changing the prompts, cutoff logic if you want, and both result messages.",
      successCriteria: [
        "The code asks for a name using input()",
        "The code asks for a score using input()",
        "The score is converted using int(score)",
        "The code uses if and else",
        "The code compares the score with a passing cutoff",
        "The pass message uses the name variable",
        "The fail message uses the name variable",
        "The starter prompts and messages are changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep int(score) so Python compares score as a number.",
      },
      {
        id: "hint-2",
        text: "The if block prints the passing result. The else block prints the other result.",
      },
      {
        id: "hint-3",
        text: 'Example: if int(score) >= 80: print(f"Great job, {name}!")',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should use input().",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-name",
          description: "The code should store the user's name.",
          requiredIncludes: ["name", "="],
        },
        {
          id: "stores-score",
          description: "The code should store the user's score.",
          requiredIncludes: ["score", "="],
        },
        {
          id: "uses-int-score",
          description: "The code should convert score using int(score).",
          requiredIncludes: ["int(score)"],
        },
        {
          id: "uses-if",
          description: "The code should use if.",
          requiredIncludes: ["if "],
        },
        {
          id: "uses-else",
          description: "The code should use else.",
          requiredIncludes: ["else:"],
        },
        {
          id: "uses-comparison",
          description: "The code should compare the score with a cutoff.",
          requiredIncludes: [">="],
        },
        {
          id: "uses-print",
          description: "The code should print result messages.",
          requiredIncludes: ["print("],
        },
        {
          id: "uses-name-in-messages",
          description: "The result messages should use name.",
          requiredIncludes: ["name"],
        },
        {
          id: "changed-name-prompt",
          description: "The starter name prompt should be changed.",
          forbiddenIncludes: ["Enter your name:"],
        },
        {
          id: "changed-score-prompt",
          description: "The starter score prompt should be changed.",
          forbiddenIncludes: ["Enter your score:"],
        },
        {
          id: "changed-pass-message",
          description: "The starter pass message should be changed.",
          forbiddenIncludes: ["you passed!"],
        },
        {
          id: "changed-fail-message",
          description: "The starter fail message should be changed.",
          forbiddenIncludes: ["keep practicing."],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Module 3 complete! Your programs can now make decisions using if, else, comparisons, and multiple conditions.",
      nextLessonPrompt:
        "Next, we’ll make Python repeat actions with loops.",
    },
    failure: {
      encouragement:
        "You’re close. This project needs name input, score input, int(score), if/else, and custom messages.",
      retryPrompt:
        "Keep input(), int(score), if, else, and messages that use name. Then customize the prompts and results.",
    },
  },
  {
    id: "python-018",
    language: "python",
    order: 18,
    slug: "repeat-with-while-loops",
    title: "Repeat Until It Stops",
    shortDescription: "Use a while loop to repeat while a condition is true.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 35,
    moduleId: "python-module-4",
    moduleTitle: "Loops",
    moduleOrder: 4,
    lessonType: "concept",
    learningGoal:
      "Repeat code with a while loop and stop it safely.",
    realLifeWhy:
      "Programs often need to repeat actions: checking attempts, counting steps, retrying tasks, or waiting until something changes.",
    concept: {
      explanation:
        "A while loop keeps running while its condition is true. Something inside the loop should eventually change the condition so it does not run forever.",
      keyIdea:
        "A while loop repeats until the condition becomes false.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `count = 1

while count <= 3:
    print(count)
    count = count + 1`,
    },
    task: {
      instruction:
        "Change the loop so it counts to a different number and prints each count.",
      successCriteria: [
        "The code creates a variable named count",
        "The code uses a while loop",
        "The while condition uses count",
        "The code prints count inside the loop",
        "The code updates count inside the loop",
        "The loop limit is different from 3",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep count = 1 at the start.",
      },
      {
        id: "hint-2",
        text: "Change the number in the while condition.",
      },
      {
        id: "hint-3",
        text: "Keep count = count + 1 so the loop eventually stops.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "has-count",
          description: "The code should create a count variable.",
          requiredIncludes: ["count", "="],
        },
        {
          id: "uses-while",
          description: "The code should use a while loop.",
          requiredIncludes: ["while "],
        },
        {
          id: "uses-condition",
          description: "The while loop should compare count.",
          requiredIncludes: ["count", "<="],
        },
        {
          id: "prints-count",
          description: "The code should print count.",
          requiredIncludes: ["print(count)"],
        },
        {
          id: "updates-count",
          description: "The code should update count.",
          requiredIncludes: ["count = count + 1"],
        },
        {
          id: "changed-limit",
          description: "The starter loop limit should be changed.",
          forbiddenIncludes: ["count <= 3"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You made Python repeat code and stop safely by updating count.",
      nextLessonPrompt:
        "Next, we’ll count with a for loop using less setup.",
    },
    failure: {
      encouragement:
        "You’re close. This needs count, while, print(count), and count = count + 1.",
      retryPrompt:
        "Change the loop limit, but keep the count variable, while loop, print(count), and count update.",
    },
  },
  {
    id: "python-019",
    language: "python",
    order: 19,
    slug: "count-with-for-loops",
    title: "Count with a For Loop",
    shortDescription: "Use for and range() to repeat a set number of times.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 35,
    moduleId: "python-module-4",
    moduleTitle: "Loops",
    moduleOrder: 4,
    lessonType: "concept",
    learningGoal:
      "Use a for loop with range() to count through numbers.",
    realLifeWhy:
      "Many programs repeat a task a known number of times: showing quiz questions, printing tickets, counting levels, or generating items.",
    concept: {
      explanation:
        "A for loop repeats once for each item in a sequence. range() creates a sequence of numbers for the loop to use.",
      keyIdea:
        "Use for with range() when you know how many times to repeat.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `for number in range(1, 4):
    print(number)`,
    },
    task: {
      instruction:
        "Change the range so Python counts through a different set of numbers.",
      successCriteria: [
        "The code uses a for loop",
        "The code uses range()",
        "The loop variable is named number",
        "The code prints number inside the loop",
        "The range is different from range(1, 4)",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "range(1, 4) gives 1, 2, and 3. The stop number is not included.",
      },
      {
        id: "hint-2",
        text: "Try range(1, 6) to print 1 through 5.",
      },
      {
        id: "hint-3",
        text: "Keep print(number) indented under the for loop.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-for",
          description: "The code should use a for loop.",
          requiredIncludes: ["for "],
        },
        {
          id: "uses-number",
          description: "The loop variable should be number.",
          requiredIncludes: ["number"],
        },
        {
          id: "uses-range",
          description: "The code should use range().",
          requiredIncludes: ["range("],
        },
        {
          id: "prints-number",
          description: "The code should print number.",
          requiredIncludes: ["print(number)"],
        },
        {
          id: "changed-range",
          description: "The starter range should be changed.",
          forbiddenIncludes: ["range(1, 4)"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Great! You used for and range() to count through numbers.",
      nextLessonPrompt:
        "Next, we’ll loop through text one character at a time.",
    },
    failure: {
      encouragement:
        "You’re close. This needs for, number, range(), and print(number).",
      retryPrompt:
        "Change the range numbers, but keep the for loop and print(number).",
    },
  },
  {
    id: "python-020",
    language: "python",
    order: 20,
    slug: "loop-through-text",
    title: "Spell Out a Word",
    shortDescription: "Loop through text and print one character at a time.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 35,
    moduleId: "python-module-4",
    moduleTitle: "Loops",
    moduleOrder: 4,
    lessonType: "practice",
    learningGoal:
      "Use a for loop to go through each character in a string.",
    realLifeWhy:
      "Text tools often inspect words piece by piece: checking passwords, scanning names, counting letters, or formatting messages.",
    concept: {
      explanation:
        "A string is a sequence of characters. A for loop can visit each character one by one.",
      keyIdea:
        "A for loop can loop through text, not just numbers.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `word = "code"

for letter in word:
    print(letter)`,
    },
    task: {
      instruction:
        "Change the word and print each letter using a for loop.",
      successCriteria: [
        "The code creates a variable named word",
        "The word value is changed from code",
        "The code uses a for loop",
        "The loop variable is named letter",
        "The code prints letter inside the loop",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Change only the text inside the quotation marks first.",
      },
      {
        id: "hint-2",
        text: "Keep for letter in word: so Python loops through the text.",
      },
      {
        id: "hint-3",
        text: "Keep print(letter) indented under the loop.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "has-word",
          description: "The code should create a word variable.",
          requiredIncludes: ["word", "="],
        },
        {
          id: "uses-for-letter",
          description: "The code should loop through letters.",
          requiredIncludes: ["for letter in word:"],
        },
        {
          id: "prints-letter",
          description: "The code should print letter.",
          requiredIncludes: ["print(letter)"],
        },
        {
          id: "changed-word",
          description: "The starter word should be changed.",
          forbiddenIncludes: ['word = "code"', "word = 'code'"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! Python spelled out the word one character at a time.",
      nextLessonPrompt:
        "Next, we’ll control exactly where counting starts and stops.",
    },
    failure: {
      encouragement:
        "You’re close. This needs word, for letter in word, and print(letter).",
      retryPrompt:
        "Change the word value, then keep the loop and print(letter).",
    },
  },
  {
    id: "python-021",
    language: "python",
    order: 21,
    slug: "loop-through-a-range",
    title: "Choose Where Counting Starts and Stops",
    shortDescription: "Control the start and stop numbers in range().",
    difficulty: "beginner",
    estimatedMinutes: 10,
    xpReward: 40,
    moduleId: "python-module-4",
    moduleTitle: "Loops",
    moduleOrder: 4,
    lessonType: "practice",
    learningGoal:
      "Use range(start, stop) to control a for loop’s numbers.",
    realLifeWhy:
      "Real programs often count from a specific starting point: page numbers, item IDs, levels, seats, or score ranges.",
    concept: {
      explanation:
        "range(start, stop) starts at the first number and stops before the second number. The stop number is not included.",
      keyIdea:
        "The stop number in range() is not included.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `for number in range(2, 6):
    print(number)`,
    },
    task: {
      instruction:
        "Change the start and stop numbers so Python prints a different range.",
      successCriteria: [
        "The code uses a for loop",
        "The code uses range() with two numbers",
        "The loop variable is named number",
        "The code prints number",
        "The range is different from range(2, 6)",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "The first number is where counting starts.",
      },
      {
        id: "hint-2",
        text: "The second number is where counting stops, but it is not included.",
      },
      {
        id: "hint-3",
        text: "Try range(5, 10) to print 5 through 9.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-for",
          description: "The code should use a for loop.",
          requiredIncludes: ["for "],
        },
        {
          id: "uses-number",
          description: "The loop variable should be number.",
          requiredIncludes: ["number"],
        },
        {
          id: "uses-range",
          description: "The code should use range().",
          requiredIncludes: ["range("],
        },
        {
          id: "prints-number",
          description: "The code should print number.",
          requiredIncludes: ["print(number)"],
        },
        {
          id: "changed-range",
          description: "The starter range should be changed.",
          forbiddenIncludes: ["range(2, 6)"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Great! You controlled where the loop starts and where it stops.",
      nextLessonPrompt:
        "Next, we’ll use loops to build a tiny countdown.",
    },
    failure: {
      encouragement:
        "You’re close. This needs a for loop, range(), and print(number).",
      retryPrompt:
        "Change the two numbers inside range(), then keep print(number).",
    },
  },
  {
    id: "python-022",
    language: "python",
    order: 22,
    slug: "countdown-timer-mini-project",
    title: "Build a Countdown",
    shortDescription: "Count backward with range() and print a final message.",
    difficulty: "beginner",
    estimatedMinutes: 12,
    xpReward: 45,
    moduleId: "python-module-4",
    moduleTitle: "Loops",
    moduleOrder: 4,
    lessonType: "mini-project",
    learningGoal:
      "Use a for loop with a negative range step to count backward.",
    realLifeWhy:
      "Countdowns show up in games, workouts, launches, timers, quizzes, and reminders. A loop is the simplest way to make one.",
    concept: {
      explanation:
        "range() can count backward if the step is negative. For example, range(5, 0, -1) gives 5, 4, 3, 2, 1.",
      keyIdea:
        "A negative step makes range() count backward.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `for number in range(5, 0, -1):
    print(number)

print("Go!")`,
    },
    task: {
      instruction:
        "Customize the countdown by changing the starting number and final message.",
      successCriteria: [
        "The code uses a for loop",
        "The code uses range()",
        "The range uses a negative step",
        "The code prints number inside the loop",
        "The code prints a final message after the loop",
        "The starting countdown number is different from 5",
        "The final message is different from Go!",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "range(5, 0, -1) counts from 5 down to 1.",
      },
      {
        id: "hint-2",
        text: "Change the first number to start from a different countdown number.",
      },
      {
        id: "hint-3",
        text: "Keep the final print() outside the loop so it prints once.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-for",
          description: "The code should use a for loop.",
          requiredIncludes: ["for "],
        },
        {
          id: "uses-range",
          description: "The code should use range().",
          requiredIncludes: ["range("],
        },
        {
          id: "uses-negative-step",
          description: "The range should count backward.",
          requiredIncludes: ["-1"],
        },
        {
          id: "prints-number",
          description: "The code should print number inside the loop.",
          requiredIncludes: ["print(number)"],
        },
        {
          id: "uses-print",
          description: "The code should print a final message.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-start",
          description: "The starter countdown range should be changed.",
          forbiddenIncludes: ["range(5, 0, -1)"],
        },
        {
          id: "changed-final-message",
          description: "The starter final message should be changed.",
          forbiddenIncludes: ['print("Go!")', "print('Go!')"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You built a countdown with a loop and a final message.",
      nextLessonPrompt:
        "Next, we’ll let user input control how many times a loop repeats.",
    },
    failure: {
      encouragement:
        "You’re close. This project needs a backward range, print(number), and a changed final message.",
      retryPrompt:
        "Change the countdown start number and final message, but keep the negative step and print(number).",
    },
  },
  {
    id: "python-023",
    language: "python",
    order: 23,
    slug: "number-repeater-mini-project",
    title: "Build a User-Controlled Repeater",
    shortDescription: "Ask for a number and repeat a message that many times.",
    difficulty: "beginner",
    estimatedMinutes: 13,
    xpReward: 50,
    moduleId: "python-module-4",
    moduleTitle: "Loops",
    moduleOrder: 4,
    lessonType: "mini-project",
    learningGoal:
      "Combine input(), int(), range(), for loops, and custom output.",
    realLifeWhy:
      "User-controlled repetition appears in real tools: generating tickets, showing reminders, printing labels, repeating quiz attempts, or creating multiple items.",
    concept: {
      explanation:
        "Ask the user how many times to repeat, convert that input with int(), then use it inside range().",
      keyIdea:
        "User input can control how many times a loop repeats.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `times = input("How many times should I repeat? ")

for number in range(int(times)):
    print("Practice Python!")`,
    },
    task: {
      instruction:
        "Customize the repeater by changing the prompt and repeated message.",
      successCriteria: [
        "The code asks for input",
        "The answer is stored in a variable named times",
        "The code uses int(times)",
        "The code uses a for loop",
        "The code uses range(int(times))",
        "The code prints a repeated message inside the loop",
        "The starter prompt is changed",
        "The repeated message is changed",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep times = input(...) so the user controls the repeat count.",
      },
      {
        id: "hint-2",
        text: "Use range(int(times)) so Python repeats based on the typed number.",
      },
      {
        id: "hint-3",
        text: "Change the message inside print() to something custom.",
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-input",
          description: "The code should ask for input.",
          requiredIncludes: ["input("],
        },
        {
          id: "stores-times",
          description: "The input should be stored in times.",
          requiredIncludes: ["times", "="],
        },
        {
          id: "uses-int-times",
          description: "The code should convert times using int(times).",
          requiredIncludes: ["int(times)"],
        },
        {
          id: "uses-for",
          description: "The code should use a for loop.",
          requiredIncludes: ["for "],
        },
        {
          id: "uses-range",
          description: "The code should use range().",
          requiredIncludes: ["range("],
        },
        {
          id: "uses-print",
          description: "The code should print inside the loop.",
          requiredIncludes: ["print("],
        },
        {
          id: "changed-prompt",
          description: "The starter prompt should be changed.",
          forbiddenIncludes: ["How many times should I repeat?"],
        },
        {
          id: "changed-message",
          description: "The starter repeated message should be changed.",
          forbiddenIncludes: ["Practice Python!"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Module 4 complete! You can now repeat actions using while loops, for loops, range(), text loops, countdowns, and user-controlled loops.",
      nextLessonPrompt:
        "Next, we’ll start Module 5 and learn how to store many values using lists.",
    },
    failure: {
      encouragement:
        "You’re close. This project needs input, int(times), range(), a for loop, and a changed repeated message.",
      retryPrompt:
        "Keep times, int(times), range(), and the for loop, then change the prompt and print message.",
    },
  },
  {
    id: "sql-001",
    language: "sql",
    order: 1,
    slug: "select-your-first-data",
    title: "Select Your First Data",
    shortDescription: "Use SELECT to ask for data from a table.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 20,
    moduleId: "sql-module-1",
    moduleTitle: "SQL Foundations",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn how SELECT and FROM work together in a basic SQL query.",
    realLifeWhy:
      "Apps store information in databases. SQL helps you ask questions like 'show me all users' or 'find all orders from today.'",
    concept: {
      explanation:
        "SELECT chooses which columns you want to see. FROM tells SQL which table to get the data from.",
      keyIdea: "SQL is how you ask questions from stored data.",
    },
    starterCode: {
      editorLanguage: "sql",
      code: `SELECT name
FROM students;`,
    },
    task: {
      instruction:
        "Change the query so it selects both name and course from the students table.",
      successCriteria: [
        "The query uses SELECT",
        "The query includes name",
        "The query includes course",
        "The query uses FROM students",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "You can select multiple columns by separating them with a comma.",
      },
      {
        id: "hint-2",
        text: "Try: SELECT name, course FROM students;",
      },
    ],
    check: {
      mode: "simulated-output",
      rules: [
        {
          id: "uses-select",
          description: "The query should use SELECT.",
          requiredIncludes: ["SELECT"],
        },
        {
          id: "selects-name",
          description: "The query should include the name column.",
          requiredIncludes: ["name"],
        },
        {
          id: "selects-course",
          description: "The query should include the course column.",
          requiredIncludes: ["course"],
        },
        {
          id: "uses-students-table",
          description: "The query should use the students table.",
          requiredIncludes: ["FROM students"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Good query! You asked for two specific pieces of information from the students table.",
      nextLessonPrompt: "Next, you’ll filter rows using WHERE.",
    },
    failure: {
      encouragement:
        "You’re close. This query needs to ask for both name and course.",
      retryPrompt: "Try adding course after name, separated by a comma.",
    },
  },
  {
    id: "git-001",
    language: "git",
    order: 1,
    slug: "commit-as-a-save-point",
    title: "Commit as a Save Point",
    shortDescription: "Understand commits as saved versions of your project.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 20,
    moduleId: "git-module-1",
    moduleTitle: "Git Foundations",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn that a Git commit is a saved checkpoint in your project history.",
    realLifeWhy:
      "When you build real projects, you need safe checkpoints. Commits let you save progress, compare changes, and go back if something breaks.",
    concept: {
      explanation:
        "A commit is like a named save point for your code. It records what changed at a specific moment.",
      keyIdea: "A commit saves a snapshot of your project.",
    },
    starterCode: {
      editorLanguage: "shell",
      code: `git add .
git commit -m "first commit"`,
    },
    task: {
      instruction:
        "Change the commit message so it clearly describes what was saved.",
      successCriteria: [
        "The code uses git add",
        "The code uses git commit -m",
        "The commit message is different from first commit",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "The message is the text inside the quotation marks.",
      },
      {
        id: "hint-2",
        text: 'Example: git commit -m "add homepage layout"',
      },
    ],
    check: {
      mode: "static-rules",
      rules: [
        {
          id: "uses-git-add",
          description: "The command should stage files.",
          requiredIncludes: ["git add"],
        },
        {
          id: "uses-git-commit",
          description: "The command should create a commit message.",
          requiredIncludes: ["git commit -m"],
        },
        {
          id: "changed-message",
          description: "The default commit message should be changed.",
          forbiddenIncludes: ["first commit"],
        },
      ],
      aiPromptTemplate: defaultAiPromptTemplate,
    },
    success: {
      message:
        "Nice! You wrote a clearer commit message. Future you will understand what changed.",
      nextLessonPrompt:
        "Next, you’ll learn how branches let you experiment safely.",
    },
    failure: {
      encouragement:
        "Almost. A good commit message should describe what changed.",
      retryPrompt:
        "Change the words inside the quotation marks after git commit -m.",
    },
  },
];

export const firstLessons = lessons;

export function getLessonsByLanguage(languageId: LanguageId) {
  return lessons
    .filter((lesson) => lesson.language === languageId)
    .sort((firstLesson, secondLesson) => firstLesson.order - secondLesson.order);
}

export function getFirstLessonByLanguage(languageId: LanguageId) {
  return getLessonsByLanguage(languageId)[0];
}

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getNextLesson(currentLessonId: string) {
  const currentLesson = getLessonById(currentLessonId);

  if (!currentLesson) return undefined;

  return getLessonsByLanguage(currentLesson.language).find(
    (lesson) => lesson.order === currentLesson.order + 1
  );
}

export function getPreviousLesson(currentLessonId: string) {
  const currentLesson = getLessonById(currentLessonId);

  if (!currentLesson) return undefined;

  return getLessonsByLanguage(currentLesson.language).find(
    (lesson) => lesson.order === currentLesson.order - 1
  );
}