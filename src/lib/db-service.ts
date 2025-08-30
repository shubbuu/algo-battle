import db from './database';
import { Problem, Submission, ProblemAttempt, ProblemWithStatus, TestCase } from '@/types';
import { cacheService } from './cache-service';
import fs from 'fs';
import path from 'path';

export class DatabaseService {
  // Problem operations
  static getAllProblems(): ProblemWithStatus[] {
    // Check cache first
    const cachedProblems = cacheService.getProblemsList();
    if (cachedProblems) {
      return cachedProblems;
    }

    // If not in cache, fetch from database
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

    const processedProblems = problems.map(problem => ({
      ...problem,
      testCases: JSON.parse(problem.test_cases),
      createdAt: problem.created_at
    }));

    // Cache the results
    cacheService.setProblemsList(processedProblems);
    
    return processedProblems;
  }

  static getProblemById(id: number): Problem | null {
    // Check cache first
    const cachedProblem = cacheService.getProblem(id);
    if (cachedProblem) {
      return cachedProblem;
    }

    // If not in cache, fetch from database
    const problem = db.prepare(`
      SELECT * FROM problems WHERE id = ?
    `).get(id) as any;

    if (!problem) return null;

    const processedProblem = {
      ...problem,
      testCases: JSON.parse(problem.test_cases),
      createdAt: problem.created_at
    };

    // Cache the result
    cacheService.setProblem(id, processedProblem);
    
    return processedProblem;
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
    
    const newId = result.lastInsertRowid as number;
    
    // Invalidate cache when new problem is created
    cacheService.clearProblemsListCache();
    
    return newId;
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
    
    const newId = result.lastInsertRowid as number;
    
    // Invalidate cache when new submission is created (affects problem status)
    cacheService.clearProblemsListCache();
    cacheService.clearProblem(submission.problemId);
    
    return newId;
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
    const newId = result.lastInsertRowid as number;
    
    // Invalidate cache when attempt is recorded (affects problem status)
    cacheService.clearProblemsListCache();
    cacheService.clearProblem(problemId);
    
    return newId;
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
    // Clear all cache when database is reset
    cacheService.clearAll();
  }
}
