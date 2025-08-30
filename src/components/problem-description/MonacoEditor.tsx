'use client';

import { useCallback, memo } from 'react';
import { Editor } from '@monaco-editor/react';
import { Language } from '@/types';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

const languageMap: Record<Language, string> = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c'
};

// Memoized editor options to prevent unnecessary re-renders
const editorOptions = {
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  lineNumbers: 'on' as const,
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 20,
  lineNumbersMinChars: 4,
  renderLineHighlight: 'line' as const,
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line' as const,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: false,
  trimAutoWhitespace: true,
  padding: { top: 16, bottom: 16 }
};

const MonacoEditor = memo(({ value, onChange, language }: MonacoEditorProps) => {
  const handleEditorChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  return (
    <Editor
      height="100%"
      language={languageMap[language]}
      value={value}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={editorOptions}
    />
  );
});

MonacoEditor.displayName = 'MonacoEditor';

export default MonacoEditor;
