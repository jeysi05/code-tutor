"use client";

import { KeyboardEvent, UIEvent, useRef, useState } from "react";

type CodeEditorProps = {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onRun?: () => void;
};

export default function CodeEditor({
  value,
  language,
  onChange,
  onRun,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const lineCount = Math.max(value.split("\n").length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1);

  function getLineStart(code: string, cursorPosition: number) {
    return code.lastIndexOf("\n", cursorPosition - 1) + 1;
  }

  function getLineEnd(code: string, cursorPosition: number) {
    const nextLineBreak = code.indexOf("\n", cursorPosition);
    return nextLineBreak === -1 ? code.length : nextLineBreak;
  }

  function getCurrentLine(code: string, cursorPosition: number) {
    const lineStart = getLineStart(code, cursorPosition);
    const lineEnd = getLineEnd(code, cursorPosition);

    return code.slice(lineStart, lineEnd);
  }

  function getLeadingWhitespace(text: string) {
    const match = text.match(/^\s*/);
    return match ? match[0] : "";
  }

  function shouldAddExtraIndent(line: string) {
    const trimmedLine = line.trimEnd();

    return (
      trimmedLine.endsWith(":") ||
      trimmedLine.endsWith("{") ||
      trimmedLine.endsWith("[") ||
      trimmedLine.endsWith("(")
    );
  }

  function indentSelectedLines(
    code: string,
    selectionStart: number,
    selectionEnd: number
  ) {
    const indentation = "  ";
    const startLineStart = getLineStart(code, selectionStart);
    const endLineEnd = getLineEnd(code, selectionEnd);

    const beforeSelection = code.slice(0, startLineStart);
    const selectedBlock = code.slice(startLineStart, endLineEnd);
    const afterSelection = code.slice(endLineEnd);

    const indentedBlock = selectedBlock
      .split("\n")
      .map((line) => indentation + line)
      .join("\n");

    const newCode = beforeSelection + indentedBlock + afterSelection;
    const selectedLineCount = selectedBlock.split("\n").length;

    return {
      newCode,
      newSelectionStart: selectionStart + indentation.length,
      newSelectionEnd: selectionEnd + indentation.length * selectedLineCount,
    };
  }

  function unindentSelectedLines(
    code: string,
    selectionStart: number,
    selectionEnd: number
  ) {
    const startLineStart = getLineStart(code, selectionStart);
    const endLineEnd = getLineEnd(code, selectionEnd);

    const beforeSelection = code.slice(0, startLineStart);
    const selectedBlock = code.slice(startLineStart, endLineEnd);
    const afterSelection = code.slice(endLineEnd);

    let removedBeforeStart = 0;
    let removedBeforeEnd = 0;
    let runningIndex = startLineStart;

    const unindentedLines = selectedBlock.split("\n").map((line) => {
      let removeCount = 0;

      if (line.startsWith("  ")) {
        removeCount = 2;
      } else if (line.startsWith(" ")) {
        removeCount = 1;
      }

      const lineStart = runningIndex;

      if (lineStart < selectionStart) {
        removedBeforeStart += Math.min(removeCount, selectionStart - lineStart);
      }

      if (lineStart < selectionEnd) {
        removedBeforeEnd += Math.min(removeCount, selectionEnd - lineStart);
      }

      runningIndex = runningIndex + line.length + 1;

      return line.slice(removeCount);
    });

    const unindentedBlock = unindentedLines.join("\n");
    const newCode = beforeSelection + unindentedBlock + afterSelection;

    return {
      newCode,
      newSelectionStart: Math.max(
        startLineStart,
        selectionStart - removedBeforeStart
      ),
      newSelectionEnd: Math.max(
        startLineStart,
        selectionEnd - removedBeforeEnd
      ),
    };
  }

  function handleEnterKey(textarea: HTMLTextAreaElement) {
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const currentLine = getCurrentLine(value, selectionStart);
    const currentIndentation = getLeadingWhitespace(currentLine);
    const extraIndentation = shouldAddExtraIndent(currentLine) ? "  " : "";
    const insertedText = `\n${currentIndentation}${extraIndentation}`;

    const updatedCode =
      value.slice(0, selectionStart) + insertedText + value.slice(selectionEnd);

    const newCursorPosition = selectionStart + insertedText.length;

    onChange(updatedCode);

    window.requestAnimationFrame(() => {
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;
      textarea.focus();
    });
  }

  function handleTabKey(
    event: KeyboardEvent<HTMLTextAreaElement>,
    textarea: HTMLTextAreaElement
  ) {
    event.preventDefault();

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const result = event.shiftKey
      ? unindentSelectedLines(value, selectionStart, selectionEnd)
      : indentSelectedLines(value, selectionStart, selectionEnd);

    onChange(result.newCode);

    window.requestAnimationFrame(() => {
      textarea.selectionStart = result.newSelectionStart;
      textarea.selectionEnd = result.newSelectionEnd;
      textarea.focus();
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = textareaRef.current;

    if (!textarea) return;

    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onRun?.();
      return;
    }

    if (event.key === "Tab") {
      handleTabKey(event, textarea);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleEnterKey(textarea);
    }
  }

  function handleScroll(event: UIEvent<HTMLTextAreaElement>) {
    const nextScrollTop = event.currentTarget.scrollTop;
    setScrollTop(nextScrollTop);

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = nextScrollTop;
    }
  }

  return (
    <div className="flex h-full min-h-[260px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#050816]">
      <div
        ref={lineNumbersRef}
        className="select-none overflow-hidden border-r border-white/10 bg-white/[0.03] px-4 py-4 text-right font-mono text-sm leading-6 text-white/35"
        style={{ scrollTop }}
      >
        {lineNumbers.map((lineNumber) => (
          <div key={lineNumber}>{lineNumber}</div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        aria-label={`${language} code editor`}
        className="h-full min-h-[260px] flex-1 resize-none overflow-auto bg-[#050816] p-4 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/30"
        placeholder="Write your code here..."
      />
    </div>
  );
}