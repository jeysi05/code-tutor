import type { Lesson } from "../data/lessons";

type OutputPreviewProps = {
  lesson: Lesson;
  code: string;
};

type StoredVariable = {
  rawValue: string;
  displayValue: string;
  numericValue: number | null;
};

type VariableMap = Record<string, StoredVariable>;

function removeTrailingSemicolon(value: string) {
  return value.trim().replace(/;$/, "").trim();
}

function isQuotedText(value: string) {
  const trimmedValue = value.trim();

  return (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  );
}

function removeQuotes(value: string) {
  const trimmedValue = value.trim();

  if (isQuotedText(trimmedValue)) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function parseNumber(value: string) {
  const trimmedValue = value.trim();

  if (/^-?\d+(\.\d+)?$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return null;
}

function createStoredVariable(rawValue: string): StoredVariable {
  const cleanedRawValue = removeTrailingSemicolon(rawValue);
  const displayValue = removeQuotes(cleanedRawValue);
  const numericValue = parseNumber(cleanedRawValue);

  return {
    rawValue: cleanedRawValue,
    displayValue,
    numericValue,
  };
}

function safelyEvaluateMathExpression(expression: string) {
  const cleanedExpression = expression.trim();

  if (!/^[0-9+\-*/().\s]+$/.test(cleanedExpression)) {
    return null;
  }

  try {
    const result = Function(`"use strict"; return (${cleanedExpression});`)();

    if (typeof result !== "number" || Number.isNaN(result)) {
      return null;
    }

    if (!Number.isFinite(result)) {
      return null;
    }

    return String(result);
  } catch {
    return null;
  }
}

function replaceNumericVariables(expression: string, variables: VariableMap) {
  let replacedExpression = expression;

  Object.entries(variables).forEach(([variableName, variable]) => {
    if (variable.numericValue === null) return;

    const variablePattern = new RegExp(`\\b${variableName}\\b`, "g");

    replacedExpression = replacedExpression.replace(
      variablePattern,
      String(variable.numericValue)
    );
  });

  return replacedExpression;
}

function getPythonVariables(lines: string[]) {
  const variables: VariableMap = {};

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const assignmentMatch = trimmedLine.match(
      /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
    );

    if (!assignmentMatch) return;

    const variableName = assignmentMatch[1];
    const rawValue = assignmentMatch[2].trim();

    variables[variableName] = createStoredVariable(rawValue);
  });

  return variables;
}

function evaluatePythonExpression(expression: string, variables: VariableMap) {
  const cleanedExpression = expression.trim();

  if (isQuotedText(cleanedExpression)) {
    return removeQuotes(cleanedExpression);
  }

  if (variables[cleanedExpression] !== undefined) {
    return variables[cleanedExpression].displayValue;
  }

  const directNumber = parseNumber(cleanedExpression);

  if (directNumber !== null) {
    return String(directNumber);
  }

  const mathExpression = replaceNumericVariables(cleanedExpression, variables);
  const mathResult = safelyEvaluateMathExpression(mathExpression);

  if (mathResult !== null) {
    return mathResult;
  }

  return "";
}

function getPythonOutput(code: string) {
  const lines = code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  const variables = getPythonVariables(lines);
  const outputLines: string[] = [];

  lines.forEach((line) => {
    const printMatch = line.match(/^print\s*\((.*)\)\s*$/);

    if (!printMatch) return;

    const expression = printMatch[1];
    const output = evaluatePythonExpression(expression, variables);

    if (output.length > 0) {
      outputLines.push(output);
    }
  });

  if (outputLines.length === 0) {
    return ["Python output will appear here when your code uses print()."];
  }

  return outputLines;
}

function getJavaScriptVariables(lines: string[]) {
  const variables: VariableMap = {};

  lines.forEach((line) => {
    const trimmedLine = removeTrailingSemicolon(line);
    const assignmentMatch = trimmedLine.match(
      /^(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)$/
    );

    if (!assignmentMatch) return;

    const variableName = assignmentMatch[2];
    const rawValue = assignmentMatch[3].trim();

    variables[variableName] = createStoredVariable(rawValue);
  });

  return variables;
}

function evaluateJavaScriptExpression(
  expression: string,
  variables: VariableMap
) {
  const cleanedExpression = removeTrailingSemicolon(expression);

  if (isQuotedText(cleanedExpression)) {
    return removeQuotes(cleanedExpression);
  }

  if (variables[cleanedExpression] !== undefined) {
    return variables[cleanedExpression].displayValue;
  }

  const directNumber = parseNumber(cleanedExpression);

  if (directNumber !== null) {
    return String(directNumber);
  }

  const mathExpression = replaceNumericVariables(cleanedExpression, variables);
  const mathResult = safelyEvaluateMathExpression(mathExpression);

  if (mathResult !== null) {
    return mathResult;
  }

  return "";
}

function getJavaScriptOutput(code: string) {
  const lines = code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("//"));

  const variables = getJavaScriptVariables(lines);
  const outputLines: string[] = [];

  lines.forEach((line) => {
    const consoleLogMatch = line.match(/^console\.log\s*\((.*)\)\s*;?$/);

    if (!consoleLogMatch) return;

    const expression = consoleLogMatch[1];
    const output = evaluateJavaScriptExpression(expression, variables);

    if (output.length > 0) {
      outputLines.push(output);
    }
  });

  if (outputLines.length === 0) {
    return [
      "JavaScript output will appear here when your code uses console.log().",
    ];
  }

  return outputLines;
}

function getSqlOutput(code: string) {
  const normalizedCode = code.toLowerCase();

  if (
    normalizedCode.includes("select") &&
    normalizedCode.includes("name") &&
    normalizedCode.includes("course") &&
    normalizedCode.includes("from students")
  ) {
    return [
      "name        course",
      "Mika        Computer Science",
      "John        Computer Engineering",
      "Aya         Information Systems",
    ];
  }

  if (
    normalizedCode.includes("select") &&
    normalizedCode.includes("name") &&
    normalizedCode.includes("from students")
  ) {
    return ["name", "Mika", "John", "Aya"];
  }

  return ["SQL preview will appear here when your query uses SELECT and FROM."];
}

function getGitOutput(code: string) {
  const hasGitAdd = code.includes("git add");
  const hasGitCommit = code.includes("git commit -m");

  if (hasGitAdd && hasGitCommit) {
    const commitMessageMatch = code.match(/git commit -m\s+["'](.+)["']/);
    const commitMessage = commitMessageMatch
      ? commitMessageMatch[1]
      : "commit message";

    return [
      "$ git add .",
      `$ git commit -m "${commitMessage}"`,
      "[main abc123] " + commitMessage,
      "Files saved into project history.",
    ];
  }

  return [
    "Git output will appear here when your command stages and commits files.",
  ];
}

function getTextOutput(lesson: Lesson, code: string) {
  const editorLanguage = lesson.starterCode.editorLanguage;

  if (editorLanguage === "python") {
    return getPythonOutput(code);
  }

  if (editorLanguage === "javascript" || editorLanguage === "typescript") {
    return getJavaScriptOutput(code);
  }

  if (editorLanguage === "sql") {
    return getSqlOutput(code);
  }

  if (editorLanguage === "shell") {
    return getGitOutput(code);
  }

  return ["Output preview is not available for this lesson yet."];
}

export default function OutputPreview({ lesson, code }: OutputPreviewProps) {
  const editorLanguage = lesson.starterCode.editorLanguage;

  if (editorLanguage === "html") {
    return (
      <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050816]">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-sm font-semibold text-blue-300">Output preview</p>
          <p className="mt-1 text-xs text-white/45">
            Shows what your HTML/CSS creates
          </p>
        </div>

        <iframe
          title="HTML and CSS preview"
          srcDoc={code}
          className="h-full min-h-0 w-full flex-1 bg-white"
          sandbox=""
        />
      </div>
    );
  }

  const outputLines = getTextOutput(lesson, code);

  return (
    <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050816]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold text-blue-300">Output preview</p>
        <p className="mt-1 text-xs text-white/45">Shows what your code does</p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-white">
          {outputLines.join("\n")}
        </pre>
      </div>
    </div>
  );
}