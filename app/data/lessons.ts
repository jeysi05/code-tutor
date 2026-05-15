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
    id: "python-007",
    language: "python",
    order: 7,
    slug: "ask-for-user-input",
    title: "Ask for User Input",
    shortDescription: "Use input() to let the user type an answer.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    xpReward: 30,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "concept",
    learningGoal:
      "Learn how input() lets a Python program ask the user for information.",
    realLifeWhy:
      "Interactive apps need information from the user. Login forms, search bars, quizzes, calculators, and chatbots all start by asking the user for input.",
    concept: {
      explanation:
        "In Python, input() shows a prompt and waits for the user to type something. The answer can be stored in a variable and reused later.",
      keyIdea: "input() lets your program listen, not just speak.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("What is your name? ")
print(name)`,
    },
    task: {
      instruction:
        "Change the input prompt so Python asks for your name in your own words, then print the answer.",
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
        text: "Keep name = input(...) so the answer is stored in the name variable.",
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
        "Nice! You used input() to make your program ask for information and then print the answer.",
      nextLessonPrompt:
        "Next, you’ll use the user’s input inside a friendlier message.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is about asking the user for input and storing the answer.",
      retryPrompt:
        "Use name = input(...), change the prompt text, then keep print(name).",
    },
  },
  {
    id: "python-008",
    language: "python",
    order: 8,
    slug: "use-input-in-a-message",
    title: "Use Input in a Message",
    shortDescription: "Combine user input with your own text.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 30,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "practice",
    learningGoal:
      "Learn how to combine a value from input() with a custom message.",
    realLifeWhy:
      "Apps feel more personal when they respond using the user’s information. A greeting, profile screen, chatbot reply, or confirmation message often includes something the user typed.",
    concept: {
      explanation:
        "After input() stores an answer in a variable, you can use that variable inside print(). You can combine text and variables using string concatenation or an f-string.",
      keyIdea:
        "User input becomes more useful when your program uses it in a message.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("Type your name: ")
print("Hello, " + name)`,
    },
    task: {
      instruction:
        "Change the prompt and greeting so Python asks for a name and prints a friendly custom message.",
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
        text: "Keep name = input(...) so the answer is saved.",
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
        "Nice! You made your program respond with a message that uses the user’s input.",
      nextLessonPrompt:
        "Next, you’ll collect more than one input and print a short introduction.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson is about using the user's input inside a friendly message.",
      retryPrompt:
        "Use name = input(...), change the prompt, then print a message that includes name.",
    },
  },
  {
    id: "python-009",
    language: "python",
    order: 9,
    slug: "store-multiple-inputs",
    title: "Store Multiple Inputs",
    shortDescription: "Ask the user for more than one answer.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 30,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "practice",
    learningGoal:
      "Learn how to collect multiple pieces of information using input().",
    realLifeWhy:
      "Most apps ask for more than one detail. A sign-up form asks for a name and email, a food app asks for an order and address, and a quiz asks several answers.",
    concept: {
      explanation:
        "You can use input() more than once. Each answer should usually be stored in its own variable so your program can use them later.",
      keyIdea:
        "Multiple inputs let your program collect multiple details from the user.",
    },
    starterCode: {
      editorLanguage: "python",
      code: `name = input("Enter your name: ")
favorite_food = input("Enter your favorite food: ")

print(f"{name} likes {favorite_food}.")`,
    },
    task: {
      instruction:
        "Ask for two details, then print one complete sentence that uses both answers.",
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
        text: "Use both variables inside the final print() line.",
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
        "Great work! You collected multiple inputs and used both answers in one sentence.",
      nextLessonPrompt:
        "Next, you’ll convert text input into numbers so your programs can calculate user answers.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson needs two input() lines and a final message that uses both answers.",
      retryPrompt:
        "Ask for name and favorite_food, change both prompts, then print a sentence using both variables.",
    },
  },
  {
    id: "python-010",
    language: "python",
    order: 10,
    slug: "convert-text-to-numbers",
    title: "Convert Text to Numbers",
    shortDescription: "Use int() to turn input text into a number.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 35,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "concept",
    learningGoal:
      "Learn why input() gives text by default and how int() converts it into a number.",
    realLifeWhy:
      "Apps often ask users for numbers: age, quantity, budget, score, or price. But user input starts as text, so programs must convert it before doing math.",
    concept: {
      explanation:
        "In Python, input() always gives back text. If the user types 19, Python treats it like the text \"19\". To calculate with it, use int() to convert it into a number.",
      keyIdea: "Use int() when you need to do math with a number from input().",
    },
    starterCode: {
      editorLanguage: "python",
      code: `age = input("Enter your age: ")
next_year = int(age) + 1

print(f"Next year, you will be {next_year}.")`,
    },
    task: {
      instruction:
        "Change the prompt and final message, then use int() to calculate the user's age next year.",
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
        text: "input() gives text, even if the user types a number.",
      },
      {
        id: "hint-2",
        text: "Use int(age) to turn the age text into a number.",
      },
      {
        id: "hint-3",
        text: "Example: next_year = int(age) + 1",
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
        "Nice! You converted input text into a number and used it in a calculation.",
      nextLessonPrompt:
        "Next, you’ll combine input and number conversion into a small age calculator.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson needs input(), int(age), + 1, and a printed message using next_year.",
      retryPrompt:
        "Store the input in age, calculate next_year = int(age) + 1, then print a custom sentence using next_year.",
    },
  },
  {
    id: "python-011",
    language: "python",
    order: 11,
    slug: "age-calculator-mini-project",
    title: "Age Calculator Mini Project",
    shortDescription:
      "Build a tiny interactive age calculator using input(), int(), variables, and print().",
    difficulty: "beginner",
    estimatedMinutes: 12,
    xpReward: 45,
    moduleId: "python-module-2",
    moduleTitle: "Input and Interaction",
    moduleOrder: 2,
    lessonType: "mini-project",
    learningGoal:
      "Combine multiple inputs, number conversion, math, and friendly output into one mini-project.",
    realLifeWhy:
      "Real interactive programs often collect information, convert values, calculate results, and show a friendly response. This is the basic pattern behind forms, calculators, quizzes, and dashboards.",
    concept: {
      explanation:
        "A mini-project combines several skills. This time, you will ask for a name and age, convert the age into a number, calculate a result, and print clear messages for the user.",
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
        "Customize the age calculator by changing both prompts and all final messages while keeping the calculation working.",
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
        text: "Keep the two input() lines so your program asks for name and age.",
      },
      {
        id: "hint-2",
        text: "Use int(age) before doing math with the age input.",
      },
      {
        id: "hint-3",
        text: "You can customize the messages inside print() without changing the variable names.",
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
        "Module 2 complete! You can now ask for input, use input in messages, collect multiple answers, convert text into numbers, and build a small interactive calculator.",
      nextLessonPrompt:
        "Next, we’ll start Module 3 and teach your programs how to make decisions with if statements.",
    },
    failure: {
      encouragement:
        "You’re close. This mini-project needs name input, age input, int(age), next_year, double_age, and custom printed messages.",
      retryPrompt:
        "Change both prompts and final messages, but keep name, age, int(age), next_year, and double_age working.",
    },
  },
  {
    id: "python-012",
    language: "python",
    order: 12,
    slug: "your-first-if-statement",
    title: "Your First If Statement",
    shortDescription: "Use if to make Python run code only when something is true.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "concept",
    learningGoal:
      "Learn how an if statement lets a Python program make a simple decision.",
    realLifeWhy:
      "Programs make decisions all the time: showing a warning, unlocking a feature, checking an answer, or deciding what message to show next.",
    concept: {
      explanation:
        "An if statement checks a condition. If the condition is true, Python runs the indented code below it. If the condition is false, Python skips that block.",
      keyIdea: "if lets your program choose whether to run a block of code.",
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
        "Nice! You used if to make Python run code only when a condition is true.",
      nextLessonPrompt:
        "Next, you’ll add else so your program can respond when the condition is false.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson needs an if statement, a comparison, and an indented print message.",
      retryPrompt:
        "Use if, include ==, keep the colon, and indent the print line under the if statement.",
    },
  },
  {
    id: "python-013",
    language: "python",
    order: 13,
    slug: "else-statements",
    title: "Else Statements",
    shortDescription: "Use else to handle the other outcome.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "concept",
    learningGoal:
      "Learn how else gives your program a second path when an if condition is false.",
    realLifeWhy:
      "Good apps do not only handle the happy path. They also respond when something is missing, incorrect, unavailable, or not allowed.",
    concept: {
      explanation:
        "else runs when the if condition is false. Together, if and else let your program choose between two possible paths.",
      keyIdea: "if handles true. else handles false.",
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
        text: "Try changing score to a number above 75 and watch the output change.",
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
        "Great! You used if and else to handle two different outcomes.",
      nextLessonPrompt:
        "Next, you’ll practice equality checks with comparison operators.",
    },
    failure: {
      encouragement:
        "Almost. This lesson needs both if and else, with different messages for each path.",
      retryPrompt:
        "Keep if, else, >=, and two indented print messages. Then change the starter score and messages.",
    },
  },
  {
    id: "python-014",
    language: "python",
    order: 14,
    slug: "comparison-operators",
    title: "Comparison Operators",
    shortDescription: "Use == and != to compare values.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "practice",
    learningGoal:
      "Learn how comparison operators help Python check whether values match or do not match.",
    realLifeWhy:
      "Programs compare values constantly: checking passwords, quiz answers, selected options, search filters, and status labels.",
    concept: {
      explanation:
        "Comparison operators ask questions. == checks if two values are equal. != checks if two values are not equal.",
      keyIdea: "Comparisons turn values into true-or-false decisions.",
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
        "Create your own answer check by changing the answer value, comparison value, and both messages.",
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
        text: "Use == when you want to check if two values match.",
      },
      {
        id: "hint-2",
        text: "Use != when you want to check if two values are different.",
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
        "Nice! You used a comparison to make Python check an answer.",
      nextLessonPrompt:
        "Next, you’ll compare numbers using greater than and less than.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson needs an answer variable, an if/else decision, and custom messages.",
      retryPrompt:
        "Change the answer value, use if with == or !=, keep else, and update both messages.",
    },
  },
  {
    id: "python-015",
    language: "python",
    order: 15,
    slug: "greater-than-less-than",
    title: "Greater Than and Less Than",
    shortDescription: "Compare numbers with >, <, >=, and <=.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    xpReward: 35,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "practice",
    learningGoal:
      "Learn how Python compares numbers using greater than and less than operators.",
    realLifeWhy:
      "Many programs depend on number checks: age limits, grade cutoffs, stock levels, temperature warnings, and budget alerts.",
    concept: {
      explanation:
        "Use > for greater than, < for less than, >= for greater than or equal to, and <= for less than or equal to.",
      keyIdea: "Number comparisons let programs react to ranges and limits.",
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
        text: "Example: if points >= 100: print('Level unlocked!')",
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
        "Great! You used number comparisons to make your program respond to a cutoff.",
      nextLessonPrompt:
        "Next, you’ll combine conditions using and and or.",
    },
    failure: {
      encouragement:
        "Almost. This lesson needs a number variable, an if/else decision, and custom messages.",
      retryPrompt:
        "Change the starter number and messages, then use a comparison like >, <, >=, or <=.",
    },
  },
  {
    id: "python-016",
    language: "python",
    order: 16,
    slug: "multiple-conditions",
    title: "Multiple Conditions",
    shortDescription: "Use and/or to check more than one condition.",
    difficulty: "beginner",
    estimatedMinutes: 9,
    xpReward: 40,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "practice",
    learningGoal:
      "Learn how and and or let Python check multiple conditions in one decision.",
    realLifeWhy:
      "Real decisions often need more than one rule. Apps check age and ID, username and password, stock and payment, or schedule and availability.",
    concept: {
      explanation:
        "and means both conditions must be true. or means at least one condition must be true.",
      keyIdea: "Multiple conditions let programs make more realistic decisions.",
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
        "Nice! You used multiple conditions to create a more realistic decision.",
      nextLessonPrompt:
        "Next, you’ll combine decisions into a pass-or-fail mini project.",
    },
    failure: {
      encouragement:
        "You’re close. This lesson needs two values, if/else, and a condition using and or or.",
      retryPrompt:
        "Change the starter values and messages, then use and or or inside the if condition.",
    },
  },
  {
    id: "python-017",
    language: "python",
    order: 17,
    slug: "pass-or-fail-checker",
    title: "Pass or Fail Checker Mini Project",
    shortDescription:
      "Build a small program that checks a score and prints the result.",
    difficulty: "beginner",
    estimatedMinutes: 12,
    xpReward: 50,
    moduleId: "python-module-3",
    moduleTitle: "Decisions",
    moduleOrder: 3,
    lessonType: "mini-project",
    learningGoal:
      "Combine input(), int(), if/else, comparison operators, and custom messages into one decision-based mini project.",
    realLifeWhy:
      "Decision-based programs are everywhere: grade checkers, eligibility forms, quiz results, warnings, recommendations, and approval systems.",
    concept: {
      explanation:
        "This mini-project uses the full decision pattern: ask for input, convert the number, check a condition, and print one of two possible results.",
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
        "Customize the pass-or-fail checker by changing the prompts, cutoff logic if you want, and both result messages.",
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
        text: "Keep int(score) so Python can compare the score as a number.",
      },
      {
        id: "hint-2",
        text: "The if block should print the passing result. The else block should print the other result.",
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
        "Module 3 complete! You can now make Python programs choose between outcomes using if, else, comparisons, and multiple conditions.",
      nextLessonPrompt:
        "Next, we’ll start Module 4 and teach your programs how to repeat actions with loops.",
    },
    failure: {
      encouragement:
        "You’re close. This mini-project needs name input, score input, int(score), if/else, and custom result messages.",
      retryPrompt:
        "Change both prompts and messages, but keep name, score, int(score), if, else, and the score comparison working.",
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