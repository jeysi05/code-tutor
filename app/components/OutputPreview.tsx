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
  const numericValue = parseNumber(displayValue);

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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replacePythonCasts(expression: string, variables: VariableMap) {
  let replacedExpression = expression;

  Object.entries(variables).forEach(([variableName, variable]) => {
    const numericValue = parseNumber(variable.displayValue);

    if (numericValue === null) return;

    const escapedVariableName = escapeRegExp(variableName);

    const intPattern = new RegExp(
      `\\bint\\s*\\(\\s*${escapedVariableName}\\s*\\)`,
      "g"
    );

    const floatPattern = new RegExp(
      `\\bfloat\\s*\\(\\s*${escapedVariableName}\\s*\\)`,
      "g"
    );

    replacedExpression = replacedExpression.replace(
      intPattern,
      String(Math.trunc(numericValue))
    );

    replacedExpression = replacedExpression.replace(
      floatPattern,
      String(numericValue)
    );
  });

  replacedExpression = replacedExpression.replace(
    /\bint\s*\(\s*["'](-?\d+(\.\d+)?)["']\s*\)/g,
    (_match, numberText: string) => String(Math.trunc(Number(numberText)))
  );

  replacedExpression = replacedExpression.replace(
    /\bfloat\s*\(\s*["'](-?\d+(\.\d+)?)["']\s*\)/g,
    (_match, numberText: string) => String(Number(numberText))
  );

  return replacedExpression;
}

function replaceNumericVariables(expression: string, variables: VariableMap) {
  let replacedExpression = replacePythonCasts(expression, variables);

  Object.entries(variables).forEach(([variableName, variable]) => {
    if (variable.numericValue === null) return;

    const variablePattern = new RegExp(`\\b${escapeRegExp(variableName)}\\b`, "g");

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
    normalizedVariableName.includes("year") ||
    normalizedPrompt.includes("year")
  ) {
    return "2026";
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

  if (
    normalizedVariableName.includes("grade") ||
    normalizedVariableName.includes("score") ||
    normalizedPrompt.includes("grade") ||
    normalizedPrompt.includes("score")
  ) {
    return "85";
  }

  if (
    normalizedVariableName.includes("price") ||
    normalizedVariableName.includes("number") ||
    normalizedPrompt.includes("price") ||
    normalizedPrompt.includes("number")
  ) {
    return "10";
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

type PythonRuntimeLine = {
  indent: number;
  text: string;
};

function getCleanPythonLines(code: string) {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function getPythonRuntimeLines(code: string): PythonRuntimeLine[] {
  return code
    .split("\n")
    .map((line) => line.replace(/\t/g, "    "))
    .map((line) => {
      const text = line.trim();
      const indentMatch = line.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0].length : 0;

      return { indent, text };
    })
    .filter((line) => line.text.length > 0 && !line.text.startsWith("#"));
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

  const template = removeQuotes(expression);

  return template.replace(/\{([^{}]+)\}/g, (_match, innerExpression) => {
    const evaluatedExpression = evaluatePythonExpression(
      innerExpression,
      variables
    );

    if (evaluatedExpression.length > 0) {
      return evaluatedExpression;
    }

    return `{${innerExpression}}`;
  });
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

    const mathExpression = replaceNumericVariables(part, variables);
    const mathResult = safelyEvaluateMathExpression(mathExpression);

    if (mathResult !== null) {
      return mathResult;
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

  const directNumber = parseNumber(cleanedExpression);

  if (directNumber !== null) {
    return String(directNumber);
  }

  const mathExpression = replaceNumericVariables(cleanedExpression, variables);
  const mathResult = safelyEvaluateMathExpression(mathExpression);

  if (mathResult !== null) {
    return mathResult;
  }

  const stringConcatOutput = evaluatePythonStringConcat(
    cleanedExpression,
    variables
  );

  if (stringConcatOutput.length > 0) {
    return stringConcatOutput;
  }

  return "";
}

function splitPythonConditionByKeyword(condition: string, keyword: "and" | "or") {
  const parts: string[] = [];
  let currentPart = "";
  let quoteCharacter: string | null = null;
  let index = 0;

  while (index < condition.length) {
    const character = condition[index];

    if (
      (character === '"' || character === "'") &&
      condition[index - 1] !== "\\"
    ) {
      if (quoteCharacter === character) {
        quoteCharacter = null;
      } else if (!quoteCharacter) {
        quoteCharacter = character;
      }

      currentPart += character;
      index += 1;
      continue;
    }

    const keywordWithSpaces = ` ${keyword} `;
    const nextChunk = condition.slice(index, index + keywordWithSpaces.length);

    if (!quoteCharacter && nextChunk === keywordWithSpaces) {
      parts.push(currentPart.trim());
      currentPart = "";
      index += keywordWithSpaces.length;
      continue;
    }

    currentPart += character;
    index += 1;
  }

  if (currentPart.trim().length > 0) {
    parts.push(currentPart.trim());
  }

  return parts;
}

function stripOuterParentheses(expression: string) {
  let cleanedExpression = expression.trim();

  while (
    cleanedExpression.startsWith("(") &&
    cleanedExpression.endsWith(")")
  ) {
    cleanedExpression = cleanedExpression.slice(1, -1).trim();
  }

  return cleanedExpression;
}

function evaluatePythonConditionOperand(
  operand: string,
  variables: VariableMap
) {
  const evaluatedOperand = evaluatePythonExpression(operand, variables);

  if (evaluatedOperand.length > 0) {
    return evaluatedOperand;
  }

  return removeQuotes(operand.trim());
}

function evaluatePythonAtomicCondition(
  condition: string,
  variables: VariableMap
) {
  const cleanedCondition = stripOuterParentheses(condition);
  const comparisonMatch = cleanedCondition.match(/(>=|<=|==|!=|>|<)/);

  if (!comparisonMatch) {
    const value = evaluatePythonConditionOperand(cleanedCondition, variables);

    if (value === "") return false;
    if (value === "0") return false;
    if (value.toLowerCase() === "false") return false;

    return true;
  }

  const operator = comparisonMatch[1];
  const operatorIndex = cleanedCondition.indexOf(operator);
  const leftOperand = cleanedCondition.slice(0, operatorIndex).trim();
  const rightOperand = cleanedCondition
    .slice(operatorIndex + operator.length)
    .trim();

  const leftValue = evaluatePythonConditionOperand(leftOperand, variables);
  const rightValue = evaluatePythonConditionOperand(rightOperand, variables);
  const leftNumber = parseNumber(leftValue);
  const rightNumber = parseNumber(rightValue);

  if (leftNumber !== null && rightNumber !== null) {
    if (operator === ">=") return leftNumber >= rightNumber;
    if (operator === "<=") return leftNumber <= rightNumber;
    if (operator === ">") return leftNumber > rightNumber;
    if (operator === "<") return leftNumber < rightNumber;
    if (operator === "==") return leftNumber === rightNumber;
    if (operator === "!=") return leftNumber !== rightNumber;
  }

  if (operator === "==") return leftValue === rightValue;
  if (operator === "!=") return leftValue !== rightValue;

  return false;
}

function evaluatePythonCondition(condition: string, variables: VariableMap) {
  const cleanedCondition = stripOuterParentheses(condition);

  const orParts = splitPythonConditionByKeyword(cleanedCondition, "or");

  if (orParts.length > 1) {
    return orParts.some((part) => evaluatePythonCondition(part, variables));
  }

  const andParts = splitPythonConditionByKeyword(cleanedCondition, "and");

  if (andParts.length > 1) {
    return andParts.every((part) => evaluatePythonCondition(part, variables));
  }

  if (cleanedCondition.startsWith("not ")) {
    return !evaluatePythonCondition(cleanedCondition.slice(4), variables);
  }

  return evaluatePythonAtomicCondition(cleanedCondition, variables);
}

function findPythonBlockEnd(
  lines: PythonRuntimeLine[],
  startIndex: number,
  parentIndent: number
) {
  let index = startIndex;

  while (index < lines.length && lines[index].indent > parentIndent) {
    index += 1;
  }

  return index;
}

type PythonExecutionState = {
  inputIndex: number;
};

function executePythonStatement(
  text: string,
  variables: VariableMap,
  outputLines: string[],
  simulatedInputValues: SimulatedInputValues,
  state: PythonExecutionState
) {
  const assignmentMatch = text.match(
    /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
  );

  if (assignmentMatch) {
    const variableName = assignmentMatch[1];
    const rawValue = assignmentMatch[2].trim();
    const inputPrompt = getPythonInputPrompt(rawValue);

    if (inputPrompt !== null) {
      const inputKey = `${variableName}:${state.inputIndex}`;
      const fallbackInputValue = getDefaultSimulatedPythonInputValue(
        variableName,
        inputPrompt
      );
      const simulatedInputValue =
        simulatedInputValues[inputKey] ?? fallbackInputValue;

      variables[variableName] = createStoredVariable(simulatedInputValue);
      outputLines.push(`${inputPrompt}${simulatedInputValue}`);
      state.inputIndex += 1;
      return;
    }

    const evaluatedValue = evaluatePythonExpression(rawValue, variables);

    variables[variableName] = createStoredVariable(
      evaluatedValue.length > 0 ? evaluatedValue : rawValue
    );
    return;
  }

  const printMatch = text.match(/^print\s*\((.*)\)\s*$/);

  if (!printMatch) return;

  const expression = printMatch[1];
  const output = evaluatePythonExpression(expression, variables);

  if (output.length > 0) {
    outputLines.push(output);
  }
}

function executePythonLines(
  lines: PythonRuntimeLine[],
  variables: VariableMap,
  outputLines: string[],
  simulatedInputValues: SimulatedInputValues,
  state: PythonExecutionState
) {
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index];
    const ifMatch = currentLine.text.match(/^if\s+(.+):$/);

    if (ifMatch) {
      const parentIndent = currentLine.indent;
      const ifBlockStart = index + 1;
      const ifBlockEnd = findPythonBlockEnd(lines, ifBlockStart, parentIndent);
      const possibleElseLine = lines[ifBlockEnd];
      let elseBlockStart = ifBlockEnd;
      let elseBlockEnd = ifBlockEnd;

      if (
        possibleElseLine &&
        possibleElseLine.indent === parentIndent &&
        /^else\s*:$/.test(possibleElseLine.text)
      ) {
        elseBlockStart = ifBlockEnd + 1;
        elseBlockEnd = findPythonBlockEnd(
          lines,
          elseBlockStart,
          parentIndent
        );
      }

      const shouldRunIfBlock = evaluatePythonCondition(ifMatch[1], variables);
      const selectedBlock = shouldRunIfBlock
        ? lines.slice(ifBlockStart, ifBlockEnd)
        : lines.slice(elseBlockStart, elseBlockEnd);

      executePythonLines(
        selectedBlock,
        variables,
        outputLines,
        simulatedInputValues,
        state
      );

      index = elseBlockEnd;
      continue;
    }

    if (/^else\s*:$/.test(currentLine.text)) {
      const elseBlockEnd = findPythonBlockEnd(
        lines,
        index + 1,
        currentLine.indent
      );
      index = elseBlockEnd;
      continue;
    }

    executePythonStatement(
      currentLine.text,
      variables,
      outputLines,
      simulatedInputValues,
      state
    );
    index += 1;
  }
}

function getPythonOutput(
  code: string,
  simulatedInputValues: SimulatedInputValues
) {
  const lines = getPythonRuntimeLines(code);
  const variables: VariableMap = {};
  const outputLines: string[] = [];
  const state: PythonExecutionState = { inputIndex: 0 };

  executePythonLines(
    lines,
    variables,
    outputLines,
    simulatedInputValues,
    state
  );

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
