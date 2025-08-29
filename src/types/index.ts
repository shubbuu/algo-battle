export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: TestCase[];
  solution?: string;
  createdAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Submission {
  id: number;
  problemId: number;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  runtime?: number;
  memoryUsage?: number;
  submittedAt: string;
}

export interface ProblemAttempt {
  id: number;
  problemId: number;
  attemptedAt: string;
}

export interface ProblemWithStatus extends Problem {
  status: 'not-attempted' | 'attempted' | 'submitted';
  lastSubmission?: Submission;
}

export type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'c';

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  runtime?: number;
  memoryUsage?: number;
}
