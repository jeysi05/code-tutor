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
    title: "Your First Message",
    shortDescription: "Write a simple message using Python.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 20,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "concept",
    learningGoal: "Learn how to display text using the print function.",
    realLifeWhy:
      "Every program needs a way to show results. Whether you are building a calculator, a chatbot, or a data tool, printing output helps you see what your code is doing.",
    concept: {
      explanation:
        "In Python, print() tells the computer to show a message on the screen. Put your message inside quotation marks so Python knows it is text.",
      keyIdea: "print() is how Python speaks back to you.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `print("Hello, world!")`,
    },
    task: {
      instruction:
        "Change the message so Python prints your own short introduction.",
      successCriteria: [
        "The code uses print()",
        "The message is inside quotation marks",
        "The message is different from Hello, world!",
      ],
    },
    hints: [
      {
        id: "hint-1",
        text: "Keep the word print, then change only the text inside the quotation marks.",
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
        "Nice! You just made Python speak with your own message. That is your first tiny program.",
      nextLessonPrompt: "Next, we’ll store information using a variable.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is just about making Python print your own message.",
      retryPrompt: "Try changing only the words inside the quotation marks.",
    },
  },
  {
    id: "python-002",
    language: "python",
    order: 2,
    slug: "store-your-name",
    title: "Store Your Name",
    shortDescription: "Use a variable to remember text.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "concept",
    learningGoal: "Learn how to store text in a variable and print it.",
    realLifeWhy:
      "Apps remember information all the time: names, usernames, scores, settings, and messages. Variables are how programs store values so they can reuse them later.",
    concept: {
      explanation:
        "A variable is a named container for a value. In Python, you create one by writing a name, an equals sign, and the value you want to store.",
      keyIdea: "A variable lets your code remember something.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = "Alex"
print(name)`,
    },
    task: {
      instruction:
        "Change the variable value so Python stores and prints your own name.",
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
        text: "Change only the text inside the quotation marks on the first line.",
      },
      {
        id: "hint-3",
        text: "The second line should still be print(name).",
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
      message: "Great! You stored text in a variable and printed it back out.",
      nextLessonPrompt:
        "Next, you’ll store a number and learn when quotation marks are not needed.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is about storing your own name in a variable.",
      retryPrompt:
        "Keep the variable name as name, change Alex to your own name, then print it with print(name).",
    },
  },
  {
    id: "python-003",
    language: "python",
    order: 3,
    slug: "store-a-number",
    title: "Store a Number",
    shortDescription: "Use a variable to remember a number.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "concept",
    learningGoal: "Learn how to store a number in a variable and print it.",
    realLifeWhy:
      "Real programs constantly work with numbers: prices, ages, scores, steps, totals, ratings, and measurements. Storing numbers is the beginning of making programs calculate things.",
    concept: {
      explanation:
        "Python can store numbers without quotation marks. Text usually uses quotation marks, but numbers can be written directly.",
      keyIdea: "Text uses quotation marks. Numbers usually do not.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `age = 18
print(age)`,
    },
    task: {
      instruction:
        "Change the number so Python stores and prints your own age or any favorite number.",
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
      message: "Nice! You stored a number in a variable and printed it.",
      nextLessonPrompt:
        "Next, you’ll print multiple lines to create a small profile.",
    },
    failure: {
      encouragement: "Almost. This lesson is about storing a number, not text.",
      retryPrompt: "Use age = your_number, then print it with print(age).",
    },
  },
  {
    id: "python-004",
    language: "python",
    order: 4,
    slug: "print-multiple-lines",
    title: "Print Multiple Lines",
    shortDescription: "Use more than one print statement.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 25,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn how multiple print statements create multiple output lines.",
    realLifeWhy:
      "Programs often show more than one piece of information at a time. A receipt, profile page, quiz result, or report usually needs several lines of output.",
    concept: {
      explanation:
        "Python runs code from top to bottom. If you write multiple print() statements, each one appears on its own line in the output.",
      keyIdea: "Each print() creates a new line of output.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `print("Name: Alex")
print("Favorite language: Python")`,
    },
    task: {
      instruction:
        "Change the two lines so Python prints a tiny profile about you.",
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
        text: "Change only the text inside the quotation marks.",
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
        "Nice! You used multiple print statements to show more than one line of output.",
      nextLessonPrompt:
        "Next, we can start using numbers to do simple calculations.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is about printing two separate lines.",
      retryPrompt:
        "Keep two print() statements, then change the text inside both quotation marks.",
    },
  },
  {
    id: "python-005",
    language: "python",
    order: 5,
    slug: "simple-math",
    title: "Simple Math",
    shortDescription: "Use Python to calculate numbers.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    xpReward: 30,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "practice",
    learningGoal:
      "Learn how Python can add, subtract, multiply, and divide numbers.",
    realLifeWhy:
      "Most useful programs do calculations. A budget tracker, grade calculator, receipt generator, fitness tracker, or game score system all need math.",
    concept: {
      explanation:
        "Python can calculate numbers using operators. Use + for addition, - for subtraction, * for multiplication, and / for division.",
      keyIdea: "Python can work like a calculator inside your code.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `score = 10
bonus = 5
print(score + bonus)`,
    },
    task: {
      instruction:
        "Change the numbers and the calculation so Python prints a new result.",
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
        text: "Try changing the values of score and bonus first.",
      },
      {
        id: "hint-2",
        text: "You can replace + with -, *, or /.",
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
        "Nice! You used Python variables and math operators to calculate a result.",
      nextLessonPrompt:
        "Next, you’ll combine everything from this module into your first mini project.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is about changing the numbers and using Python to calculate.",
      retryPrompt:
        "Change the starter numbers, keep print(), and use a math operator like +, -, *, or /.",
    },
  },
  {
    id: "python-006",
    language: "python",
    order: 6,
    slug: "personal-profile-generator",
    title: "Personal Profile Generator",
    shortDescription:
      "Build your first tiny Python mini-project using variables and print().",
    difficulty: "beginner",
    estimatedMinutes: 10,
    xpReward: 40,
    moduleId: "python-module-1",
    moduleTitle: "First Programs",
    moduleOrder: 1,
    lessonType: "mini-project",
    learningGoal:
      "Combine print(), text variables, number variables, and multiple output lines into one small program.",
    realLifeWhy:
      "Real projects are made by combining small concepts. This mini-project proves you can use output, variables, numbers, and multiple lines together instead of only practicing them separately.",
    concept: {
      explanation:
        "A mini-project combines several ideas into one useful program. Here, you will store information in variables, then print those variables to create a simple profile.",
      keyIdea:
        "Small concepts become real programs when you combine them together.",
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
        "Create a tiny profile about yourself by changing the name, age, and goal variables.",
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
        text: "Change only the values after the equals signs first.",
      },
      {
        id: "hint-2",
        text: "Text values need quotation marks. Number values usually do not.",
      },
      {
        id: "hint-3",
        text: "Keep print(name), print(age), and print(goal) so Python prints the variables.",
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
        "Module 1 complete! You can now write simple Python programs with output, variables, numbers, math, and multiple lines.",
      nextLessonPrompt:
        "Next, we’ll start Module 2 and make programs more interactive.",
    },
    failure: {
      encouragement:
        "You’re close. This mini-project needs name, age, and goal variables, then it should print each one.",
      retryPrompt:
        "Change the starter values, then keep print(name), print(age), and print(goal).",
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