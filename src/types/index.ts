export interface Problem {
  id: number;
  title: string;
  description: string;
  is_premium: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solution_link?: string;
  acceptance_rate?: number;
  frequency?: number;
  url?: string;
  discuss_count?: number;
  accepted?: string;
  submissions?: string;
  companies?: string;
  related_topics?: string;
  likes?: number;
  dislikes?: number;
  rating?: number;
  asked_by_faang?: number;
  similar_questions?: string;
  testCases?: TestCase[];
  solution?: string;
  createdAt?: string;
  solve?: string; // "0" for unsolved, "1" for solved
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
