'use client';

import { useState, useCallback } from 'react';
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
#include <iostream>
#include <vector>
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

export default function ProblemSolver({ problem, submissions, initialStatus }: ProblemSolverProps) {
  const [code, setCode] = useState(languageTemplates.javascript);
  const [language, setLanguage] = useState<Language>('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<CodeExecutionResult | null>(null);
  const [status, setStatus] = useState(initialStatus);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage]);
    setOutput(null);
  }, []);

  const handleRun = async () => {
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
          testCases: problem.testCases
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
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id
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
  };

  const getDifficultyColor = (difficulty: string) => {
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
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'attempted':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
              {getStatusIcon()}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium',
              getDifficultyColor(problem.difficulty)
            )}>
              {problem.difficulty}
            </span>
            
            <button
              onClick={() => setShowSubmissions(!showSubmissions)}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            >
              {submissions.length} Submissions
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <div 
                className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: problem.description
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^(Example \d+:)/gm, '<strong>$1</strong>')
                  .replace(/^(Constraints:)/gm, '<strong>$1</strong>')
                }}
              />
            </div>

            {/* Test Cases */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Test Cases
              </h3>
              <div className="space-y-4">
                {problem.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Input:
                        </span>
                        <pre className="mt-1 text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                          {testCase.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Expected Output:
                        </span>
                        <pre className="mt-1 text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                          {testCase.expectedOutput}
                        </pre>
                      </div>
                      {testCase.explanation && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Explanation:
                          </span>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {testCase.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Controls */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>

              <div className="flex space-x-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run'}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoEditor
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>

          {/* Output Panel */}
          <OutputPanel output={output} />
        </div>
      </div>

      {/* Submission History Modal */}
      {showSubmissions && (
        <SubmissionHistory
          submissions={submissions}
          onClose={() => setShowSubmissions(false)}
        />
      )}
    </div>
  );
}
