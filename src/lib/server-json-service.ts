import { Problem, ProblemWithStatus } from '@/types';
import fs from 'fs';
import path from 'path';

interface JsonData {
  problems: Problem[];
}

export class ServerJsonService {
  // Server-side method for fetching problems (for use in server components)
  static async getAllProblems(): Promise<ProblemWithStatus[]> {
    try {
      // For server-side rendering, read the file directly
      const dbPath = path.join(process.cwd(), 'public', 'leetcode-db.json');
      const data = fs.readFileSync(dbPath, 'utf8');
      const jsonData: JsonData = JSON.parse(data);
      
      // Add solve attribute to each problem
      const problemsWithSolve = jsonData.problems.map(problem => ({
        ...problem,
        solve: "0" // Default to "0" for unsolved
      }));
      
      // Convert to ProblemWithStatus format
      const problemsWithStatus: ProblemWithStatus[] = problemsWithSolve.map(problem => ({
        ...problem,
        status: 'not-attempted' // Default status
      }));
      
      return problemsWithStatus;
    } catch (error) {
      console.error('Error fetching problems:', error);
      return [];
    }
  }

  // Get a single problem by ID
  static async getProblemById(id: number): Promise<Problem | null> {
    try {
      const problems = await this.getAllProblems();
      const problem = problems.find(p => p.id === id);
      
      if (problem) {
        // Add solve attribute if not present
        return {
          ...problem,
          solve: problem.solve || "0"
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching problem:', error);
      return null;
    }
  }
}
