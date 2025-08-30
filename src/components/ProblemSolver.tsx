'use client';

import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import Link from 'next/link';
import { Problem, Submission, Language, CodeExecutionResult } from '@/types';
import MonacoEditor from '@/components/MonacoEditor';
import OutputPanel from '@/components/OutputPanel';
import SubmissionHistory from '@/components/SubmissionHistory';
import { ArrowLeft, Play, Send, Clock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface ProblemSolverProps {
  problem: Problem;
  submissions: Submission[];
  initialStatus: 'not-attempted' | 'attempted' | 'submitted';
}

const languageTemplates: Record<Language, string> = {
  javascript: `// Write your solution here
function solution(input) {
    // Your code here
    return result;
}`,
  python: `# Write your solution here
def solution(input):
    # Your code here
    return result`,
  java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
  cpp: `// Write your solution here
#include <bits/stdc++.h>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  c: `// Write your solution here
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Your code here
    return 0;
}`
};

// Memoized difficulty color component
const DifficultyBadge = memo(({ difficulty }: { difficulty: string }) => {
  const difficultyColor = useMemo(() => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  }, [difficulty]);

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', difficultyColor)}>
      {difficulty}
    </span>
  );
});
DifficultyBadge.displayName = 'DifficultyBadge';

// Memoized status icon component
const StatusIcon = memo(({ status }: { status: string }) => {
  switch (status) {
    case 'submitted':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'attempted':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
});
StatusIcon.displayName = 'StatusIcon';

// Client-side only Monaco Editor wrapper
const MonacoEditorWrapper = memo(({ value, onChange, language }: { value: string; onChange: (value: string) => void; language: Language }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: '600px' }} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '600px' }}>
      <MonacoEditor
        value={value}
        onChange={onChange}
        language={language}
      />
    </div>
  );
});
MonacoEditorWrapper.displayName = 'MonacoEditorWrapper';

export default function ProblemSolver({ problem, submissions, initialStatus }: ProblemSolverProps) {
  const [code, setCode] = useState(languageTemplates.java);
  const [language, setLanguage] = useState<Language>('java');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<CodeExecutionResult | null>(null);
  const [status, setStatus] = useState(initialStatus);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage]);
    setOutput(null);
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return; // Prevent multiple simultaneous runs
    
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          testCases: customInput.trim() ? null : problem.testCases,
          customInput: customInput.trim() || null
        })
      });

      const result = await response.json();
      setOutput(result);
      
      // Record attempt if not already attempted/submitted
      if (status === 'not-attempted') {
        setStatus('attempted');
      }
    } catch (error) {
      setOutput({
        success: false,
        error: 'Failed to execute code. Please try again.'
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, problem.id, problem.testCases, status, isRunning, customInput]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Prevent multiple simultaneous submissions
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          customInput: customInput
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('submitted');
        setOutput({
          success: true,
          output: 'All test cases passed! Solution accepted.'
        });
      } else {
        setOutput(result);
      }
    } catch (error) {
      setOutput({
        success: false,
        error: 'Failed to submit solution. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [code, language, problem.id, isSubmitting, customInput]);

  const toggleSubmissions = useCallback(() => {
    setShowSubmissions(prev => !prev);
  }, []);

  // Memoize expensive computations
  const canSubmit = useMemo(() => {
    return !isRunning && !isSubmitting && code.trim().length > 0;
  }, [isRunning, isSubmitting, code]);

  const canRun = useMemo(() => {
    return !isRunning && !isSubmitting && code.trim().length > 0;
  }, [isRunning, isSubmitting, code]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Problems
              </Link>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  #{problem.id}
                </span>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {problem.title}
                </h1>
                <DifficultyBadge difficulty={problem.difficulty} />
                <StatusIcon status={status} />
              </div>
            </div>
            
            <button
              onClick={toggleSubmissions}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {showSubmissions ? 'Hide' : 'Show'} Submissions ({submissions.length})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Problem Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Problem Description
            </h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
            <div 
              className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: problem.description
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^(Example \d+:)/gm, '<strong>$1</strong>')
                .replace(/^(Constraints:)/gm, '<strong>$1</strong>')
              }}
            />
            </div>
          </div>

          {/* Code Editor and Output */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Code Editor
                  </h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <MonacoEditorWrapper
                value={code}
                onChange={setCode}
                language={language}
              />
              
              {/* Input Panel */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Custom Input
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCustomInput('')}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter your custom input here (e.g., '5 10' for multiple values on separate lines)"
                    className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {customInput.trim() ? 
                      'Using custom input for testing' : 
                      'Leave empty to use problem test cases'
                    }
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRun}
                    disabled={!canRun}
                    className={clsx(
                      'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                      (!canRun || isRunning) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={clsx(
                      'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
                      (!canSubmit || isSubmitting) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                  </button>
                </div>
              </div>
            </div>

            {output && (
              <OutputPanel output={output} />
            )}
          </div>

          {/* Submissions History */}
          {showSubmissions && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <SubmissionHistory 
                submissions={submissions} 
                onClose={() => setShowSubmissions(false)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
