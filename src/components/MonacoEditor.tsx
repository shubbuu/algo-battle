'use client';

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

export default function MonacoEditor({ value, onChange, language }: MonacoEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height="100%"
      language={languageMap[language]}
      value={value}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: false,
        trimAutoWhitespace: true
      }}
    />
  );
}
