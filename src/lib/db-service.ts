import db from './database';
import { Problem, Submission, ProblemAttempt, ProblemWithStatus, TestCase } from '@/types';
import fs from 'fs';
import path from 'path';

export class DatabaseService {
  // Problem operations
  static getAllProblems(): ProblemWithStatus[] {
    const problems = db.prepare(`
      SELECT 
        p.*,
        CASE 
          WHEN s.id IS NOT NULL THEN 'submitted'
          WHEN pa.id IS NOT NULL THEN 'attempted'
          ELSE 'not-attempted'
        END as status
      FROM problems p
      LEFT JOIN submissions s ON p.id = s.problem_id AND s.status = 'Accepted'
      LEFT JOIN problem_attempts pa ON p.id = pa.problem_id
      GROUP BY p.id
      ORDER BY p.id
    `).all() as any[];

    return problems.map(problem => ({
      ...problem,
      testCases: JSON.parse(problem.test_cases),
      createdAt: problem.created_at
    }));
  }

  static getProblemById(id: number): Problem | null {
    const problem = db.prepare(`
      SELECT * FROM problems WHERE id = ?
    `).get(id) as any;

    if (!problem) return null;

    return {
      ...problem,
      testCases: JSON.parse(problem.test_cases),
      createdAt: problem.created_at
    };
  }

  static createProblem(problem: Omit<Problem, 'id' | 'createdAt'>): number {
    const stmt = db.prepare(`
      INSERT INTO problems (title, description, difficulty, test_cases, solution)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      problem.title,
      problem.description,
      problem.difficulty,
      JSON.stringify(problem.testCases),
      problem.solution
    );
    
    return result.lastInsertRowid as number;
  }

  // Submission operations
  static createSubmission(submission: Omit<Submission, 'id' | 'submittedAt'>): number {
    const stmt = db.prepare(`
      INSERT INTO submissions (problem_id, code, language, status, runtime, memory_usage)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      submission.problemId,
      submission.code,
      submission.language,
      submission.status,
      submission.runtime,
      submission.memoryUsage
    );
    
    return result.lastInsertRowid as number;
  }

  static getSubmissionsByProblem(problemId: number): Submission[] {
    const submissions = db.prepare(`
      SELECT * FROM submissions 
      WHERE problem_id = ? 
      ORDER BY submitted_at DESC
    `).all(problemId) as any[];

    return submissions.map(sub => ({
      ...sub,
      problemId: sub.problem_id,
      submittedAt: sub.submitted_at,
      memoryUsage: sub.memory_usage
    }));
  }

  static getLatestSubmission(problemId: number): Submission | null {
    const submission = db.prepare(`
      SELECT * FROM submissions 
      WHERE problem_id = ? 
      ORDER BY submitted_at DESC 
      LIMIT 1
    `).get(problemId) as any;

    if (!submission) return null;

    return {
      ...submission,
      problemId: submission.problem_id,
      submittedAt: submission.submitted_at,
      memoryUsage: submission.memory_usage
    };
  }

  // Attempt tracking
  static recordAttempt(problemId: number): number {
    const stmt = db.prepare(`
      INSERT INTO problem_attempts (problem_id)
      VALUES (?)
    `);
    
    const result = stmt.run(problemId);
    return result.lastInsertRowid as number;
  }

  // Get problem status
  static getProblemStatus(problemId: number): 'not-attempted' | 'attempted' | 'submitted' {
    const acceptedSubmission = db.prepare(`
      SELECT id FROM submissions 
      WHERE problem_id = ? AND status = 'Accepted'
      LIMIT 1
    `).get(problemId);

    if (acceptedSubmission) return 'submitted';

    const attempt = db.prepare(`
      SELECT id FROM problem_attempts 
      WHERE problem_id = ?
      LIMIT 1
    `).get(problemId);

    return attempt ? 'attempted' : 'not-attempted';
  }

  // Clear all data
  static clearAllData() {
    db.clearAllData();
  }
}
