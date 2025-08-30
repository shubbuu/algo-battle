import { Problem, ProblemWithStatus } from '@/types';

interface JsonData {
  problems: Problem[];
}

export class JsonService {
  // Client-side method for fetching problems (for use in browser)
  static async getAllProblems(): Promise<ProblemWithStatus[]> {
    try {
      // Fetch the JSON data from the public folder
      const response = await fetch('/leetcode-db.json');
      if (!response.ok) {
        throw new Error('Failed to fetch problems data');
      }
      
      const data: JsonData = await response.json();
      
      // Add solve attribute to each problem
      const problemsWithSolve = data.problems.map(problem => ({
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

  // Update solve status for a problem
  static async updateSolveStatus(problemId: number, solveStatus: string): Promise<void> {
    try {
      // Call the API endpoint to update solve status
      const response = await fetch('/api/solve-status', {
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
        throw new Error('Failed to update solve status');
      }

      const result = await response.json();
      console.log(result.message);
      
      // Also save to localStorage for immediate UI updates
      const stored = localStorage.getItem('problemSolveStatus') || '{}';
      const statuses = JSON.parse(stored);
      statuses[problemId] = solveStatus;
      localStorage.setItem('problemSolveStatus', JSON.stringify(statuses));
    } catch (error) {
      console.error('Error updating solve status:', error);
      
      // Fallback to localStorage only
      const stored = localStorage.getItem('problemSolveStatus') || '{}';
      const statuses = JSON.parse(stored);
      statuses[problemId] = solveStatus;
      localStorage.setItem('problemSolveStatus', JSON.stringify(statuses));
    }
  }

  // Get solve status from localStorage
  static getSolveStatus(problemId: number): string {
    try {
      const stored = localStorage.getItem('problemSolveStatus');
      if (stored) {
        const statuses = JSON.parse(stored);
        return statuses[problemId] || "0";
      }
    } catch (error) {
      console.error('Error reading solve status:', error);
    }
    return "0";
  }
}
