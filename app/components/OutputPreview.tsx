"use client";

import { useEffect, useMemo, useState } from "react";
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

type PythonInputDefinition = {
  key: string;
  variableName: string;
  prompt: string;
  defaultValue: string;
};

type SimulatedInputValues = Record<string, string>;

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

function isFString(value: string) {
  const trimmedValue = value.trim();

  return (
    (trimmedValue.startsWith('f"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("f'") && trimmedValue.endsWith("'")) ||
    (trimmedValue.startsWith('F"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("F'") && trimmedValue.endsWith("'"))
  );
}

function removeQuotes(value: string) {
  const trimmedValue = value.trim();

  if (isFString(trimmedValue)) {
    return trimmedValue.slice(2, -1);
  }

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

function getDefaultSimulatedPythonInputValue(variableName: string, prompt: string) {
  const normalizedVariableName = variableName.toLowerCase();
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedVariableName.includes("name") ||
    normalizedPrompt.includes("name")
  ) {
    return "John";
  }

  if (
    normalizedVariableName.includes("age") ||
    normalizedPrompt.includes("age")
  ) {
    return "19";
  }

  if (
    normalizedVariableName.includes("goal") ||
    normalizedPrompt.includes("goal")
  ) {
    return "Learn Python";
  }

  if (
    normalizedVariableName.includes("food") ||
    normalizedPrompt.includes("food")
  ) {
    return "pizza";
  }

  if (
    normalizedVariableName.includes("color") ||
    normalizedPrompt.includes("color")
  ) {
    return "blue";
  }

  if (
    normalizedVariableName.includes("answer") ||
    normalizedPrompt.includes("answer")
  ) {
    return "yes";
  }

  return "sample input";
}

function getPythonInputPrompt(expression: string) {
  const inputMatch = expression.match(/^input\s*\((.*)\)\s*$/);

  if (!inputMatch) return null;

  const promptExpression = inputMatch[1].trim();

  if (promptExpression.length === 0) {
    return "";
  }

  if (isQuotedText(promptExpression)) {
    return removeQuotes(promptExpression);
  }

  return "";
}

function getCleanPythonLines(code: string) {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function getPythonInputDefinitions(code: string): PythonInputDefinition[] {
  const lines = getCleanPythonLines(code);
  const inputDefinitions: PythonInputDefinition[] = [];
  let inputIndex = 0;

  lines.forEach((line) => {
    const assignmentMatch = line.match(
      /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
    );

    if (!assignmentMatch) return;

    const variableName = assignmentMatch[1];
    const rawValue = assignmentMatch[2].trim();
    const inputPrompt = getPythonInputPrompt(rawValue);

    if (inputPrompt === null) return;

    inputDefinitions.push({
      key: `${variableName}:${inputIndex}`,
      variableName,
      prompt: inputPrompt,
      defaultValue: getDefaultSimulatedPythonInputValue(
        variableName,
        inputPrompt
      ),
    });

    inputIndex += 1;
  });

  return inputDefinitions;
}

function splitExpressionByPlus(expression: string) {
  const parts: string[] = [];
  let currentPart = "";
  let quoteCharacter: string | null = null;

  for (let index = 0; index < expression.length; index++) {
    const character = expression[index];

    if (
      (character === '"' || character === "'") &&
      expression[index - 1] !== "\\"
    ) {
      if (quoteCharacter === character) {
        quoteCharacter = null;
      } else if (!quoteCharacter) {
        quoteCharacter = character;
      }

      currentPart += character;
      continue;
    }

    if (character === "+" && !quoteCharacter) {
      parts.push(currentPart.trim());
      currentPart = "";
      continue;
    }

    currentPart += character;
  }

  if (currentPart.trim().length > 0) {
    parts.push(currentPart.trim());
  }

  return parts;
}

function evaluatePythonFString(expression: string, variables: VariableMap) {
  if (!isFString(expression)) return "";

  let template = removeQuotes(expression);

  Object.entries(variables).forEach(([variableName, variable]) => {
    const variablePattern = new RegExp(`\\{\\s*${variableName}\\s*\\}`, "g");
    template = template.replace(variablePattern, variable.displayValue);
  });

  return template;
}

function evaluatePythonStringConcat(expression: string, variables: VariableMap) {
  const parts = splitExpressionByPlus(expression);

  if (parts.length <= 1) return "";

  const evaluatedParts = parts.map((part) => {
    if (isQuotedText(part)) {
      return removeQuotes(part);
    }

    if (variables[part] !== undefined) {
      return variables[part].displayValue;
    }

    const directNumber = parseNumber(part);

    if (directNumber !== null) {
      return String(directNumber);
    }

    return "";
  });

  if (evaluatedParts.some((part) => part.length === 0)) {
    return "";
  }

  return evaluatedParts.join("");
}

function evaluatePythonExpression(expression: string, variables: VariableMap) {
  const cleanedExpression = expression.trim();

  if (isFString(cleanedExpression)) {
    return evaluatePythonFString(cleanedExpression, variables);
  }

  if (isQuotedText(cleanedExpression)) {
    return removeQuotes(cleanedExpression);
  }

  if (variables[cleanedExpression] !== undefined) {
    return variables[cleanedExpression].displayValue;
  }

  const stringConcatOutput = evaluatePythonStringConcat(
    cleanedExpression,
    variables
  );

  if (stringConcatOutput.length > 0) {
    return stringConcatOutput;
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

function getPythonOutput(
  code: string,
  simulatedInputValues: SimulatedInputValues
) {
  const lines = getCleanPythonLines(code);
  const variables: VariableMap = {};
  const outputLines: string[] = [];
  let inputIndex = 0;

  lines.forEach((line) => {
    const assignmentMatch = line.match(
      /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
    );

    if (assignmentMatch) {
      const variableName = assignmentMatch[1];
      const rawValue = assignmentMatch[2].trim();
      const inputPrompt = getPythonInputPrompt(rawValue);

      if (inputPrompt !== null) {
        const inputKey = `${variableName}:${inputIndex}`;
        const fallbackInputValue = getDefaultSimulatedPythonInputValue(
          variableName,
          inputPrompt
        );
        const simulatedInputValue =
          simulatedInputValues[inputKey] ?? fallbackInputValue;

        variables[variableName] = createStoredVariable(simulatedInputValue);
        outputLines.push(`${inputPrompt}${simulatedInputValue}`);
        inputIndex += 1;
        return;
      }

      variables[variableName] = createStoredVariable(rawValue);
      return;
    }

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

function getTextOutput(
  lesson: Lesson,
  code: string,
  simulatedInputValues: SimulatedInputValues
) {
  const editorLanguage = lesson.starterCode.editorLanguage;

  if (editorLanguage === "python") {
    return getPythonOutput(code, simulatedInputValues);
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
  const [simulatedInputValues, setSimulatedInputValues] =
    useState<SimulatedInputValues>({});

  const pythonInputDefinitions = useMemo(() => {
    if (editorLanguage !== "python") return [];

    return getPythonInputDefinitions(code);
  }, [code, editorLanguage]);

  useEffect(() => {
    if (pythonInputDefinitions.length === 0) {
      setSimulatedInputValues({});
      return;
    }

    setSimulatedInputValues((currentValues) => {
      const nextValues: SimulatedInputValues = {};

      pythonInputDefinitions.forEach((inputDefinition) => {
        nextValues[inputDefinition.key] =
          currentValues[inputDefinition.key] ?? inputDefinition.defaultValue;
      });

      return nextValues;
    });
  }, [pythonInputDefinitions]);

  function updateSimulatedInputValue(inputKey: string, nextValue: string) {
    setSimulatedInputValues((currentValues) => ({
      ...currentValues,
      [inputKey]: nextValue,
    }));
  }

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

  const outputLines = getTextOutput(lesson, code, simulatedInputValues);

  return (
    <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050816]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold text-blue-300">Output preview</p>
        <p className="mt-1 text-xs text-white/45">Shows what your code does</p>
      </div>

      {pythonInputDefinitions.length > 0 && (
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/80">
            Simulated input
          </p>

          <div className="mt-3 grid gap-3">
            {pythonInputDefinitions.map((inputDefinition) => (
              <label
                key={inputDefinition.key}
                className="grid gap-2 text-sm text-white/70"
              >
                <span>
                  Value for{" "}
                  <span className="font-mono text-blue-200">
                    {inputDefinition.variableName}
                  </span>
                </span>

                <input
                  value={
                    simulatedInputValues[inputDefinition.key] ??
                    inputDefinition.defaultValue
                  }
                  onChange={(event) =>
                    updateSimulatedInputValue(
                      inputDefinition.key,
                      event.target.value
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-white/30 focus:border-blue-300/60"
                  placeholder={inputDefinition.defaultValue}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-white">
          {outputLines.join("\n")}
        </pre>
      </div>
    </div>
  );
}