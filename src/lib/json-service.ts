import { Problem, ProblemWithStatus } from '@/types';
import { 
  SOLVE_STATUS, 
  ERROR_MESSAGES, 
  STORAGE_KEYS, 
  API_ENDPOINTS,
  FILE_SYSTEM,
  PROBLEM_STATUS 
} from '@/constants';

interface JsonData {
  problems: Problem[];
}

export class JsonService {
  // Server-side method for fetching problems (for use in server components)
  static async getAllProblemsServer(): Promise<ProblemWithStatus[]> {
    try {
      // Dynamic imports for server-side only
      const fs = await import('fs');
      const path = await import('path');
      
      // For server-side rendering, read the file directly
      const dbPath = path.join(process.cwd(), 'public', FILE_SYSTEM.LEETCODE_DB_PATH);
      const data = fs.readFileSync(dbPath, 'utf8');
      const jsonData: JsonData = JSON.parse(data);
      
      return this.processProblems(jsonData.problems);
    } catch (error) {
      console.error('Error fetching problems:', error);
      return [];
    }
  }

  // Client-side method for fetching problems (for use in browser)
  static async getAllProblemsClient(): Promise<ProblemWithStatus[]> {
    try {
      // Fetch the JSON data from the public folder
      const response = await fetch(`/${FILE_SYSTEM.LEETCODE_DB_PATH}`);
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH);
      }
      
      const data: JsonData = await response.json();
      return this.processProblems(data.problems);
    } catch (error) {
      console.error('Error fetching problems:', error);
      return [];
    }
  }

  // Unified method that works in both client and server contexts
  static async getAllProblems(): Promise<ProblemWithStatus[]> {
    if (typeof window === 'undefined') {
      return this.getAllProblemsServer();
    } else {
      return this.getAllProblemsClient();
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
          solve: problem.solve || SOLVE_STATUS.UNSOLVED
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching problem:', error);
      return null;
    }
  }

  // Update solve status for a problem
  static async updateSolveStatus(problemId: number, solveStatus: string): Promise<void> {
    try {
      // Call the API endpoint to update solve status
      const response = await fetch(API_ENDPOINTS.SOLVE_STATUS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId,
          solveStatus
        })
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_STATUS);
      }

      const result = await response.json();
      console.log(result.message);
      
      // Also save to localStorage for immediate UI updates
      const stored = localStorage.getItem(STORAGE_KEYS.PROBLEM_SOLVE_STATUS) || '{}';
      const statuses = JSON.parse(stored);
      statuses[problemId] = solveStatus;
      localStorage.setItem(STORAGE_KEYS.PROBLEM_SOLVE_STATUS, JSON.stringify(statuses));
    } catch (error) {
      console.error('Error updating solve status:', error);
      
      // Fallback to localStorage only
      const stored = localStorage.getItem(STORAGE_KEYS.PROBLEM_SOLVE_STATUS) || '{}';
      const statuses = JSON.parse(stored);
      statuses[problemId] = solveStatus;
      localStorage.setItem(STORAGE_KEYS.PROBLEM_SOLVE_STATUS, JSON.stringify(statuses));
    }
  }

  // Get solve status from localStorage
  static getSolveStatus(problemId: number): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROBLEM_SOLVE_STATUS);
      if (stored) {
        const statuses = JSON.parse(stored);
        return statuses[problemId] || SOLVE_STATUS.UNSOLVED;
      }
    } catch (error) {
      console.error('Error reading solve status:', error);
    }
    return SOLVE_STATUS.UNSOLVED;
  }

  // Private helper method to process problems
  private static processProblems(problems: Problem[]): ProblemWithStatus[] {
    // Add solve attribute to each problem
    const problemsWithSolve = problems.map(problem => ({
      ...problem,
      solve: problem.solve || SOLVE_STATUS.UNSOLVED // Default to "0" for unsolved
    }));
    
    // Convert to ProblemWithStatus format
    const problemsWithStatus: ProblemWithStatus[] = problemsWithSolve.map(problem => ({
      ...problem,
      status: PROBLEM_STATUS.NOT_ATTEMPTED // Default status
    }));
    
    return problemsWithStatus;
  }
}
