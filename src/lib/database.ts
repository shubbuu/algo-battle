import fs from 'fs';
import path from 'path';

// Simple JSON-based database for cross-platform compatibility
const dbPath = path.join(process.cwd(), 'algo-battle-db.json');

interface DatabaseSchema {
  problems: any[];
  submissions: any[];
  problemAttempts: any[];
  nextIds: {
    problems: number;
    submissions: number;
    problemAttempts: number;
  };
}

let database: DatabaseSchema;

// Initialize database
function initializeDB(): DatabaseSchema {
  if (fs.existsSync(dbPath)) {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Error reading database file, creating new one:', error);
    }
  }
  
  return {
    problems: [],
    submissions: [],
    problemAttempts: [],
    nextIds: {
      problems: 1,
      submissions: 1,
      problemAttempts: 1
    }
  };
}

// Save database to file
function saveDB() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Database operations
export const db: any = {
  prepare: (query: string) => ({
    all: (...params: any[]) => {
      if (query.includes('FROM problems')) {
        return database.problems.map(p => ({
          ...p,
          test_cases: p.testCases ? JSON.stringify(p.testCases) : '[]',
          created_at: p.createdAt
        }));
      }
      if (query.includes('FROM submissions')) {
        return database.submissions.map(s => ({
          ...s,
          problem_id: s.problemId,
          submitted_at: s.submittedAt,
          memory_usage: s.memoryUsage
        }));
      }
      if (query.includes('FROM problem_attempts')) {
        return database.problemAttempts.map(pa => ({
          ...pa,
          problem_id: pa.problemId,
          attempted_at: pa.attemptedAt
        }));
      }
      return [];
    },
    get: (...params: any[]) => {
      const [param] = params;
      if (query.includes('FROM problems') && query.includes('WHERE id = ?')) {
        const problem = database.problems.find(p => p.id === param);
        return problem ? {
          ...problem,
          test_cases: JSON.stringify(problem.testCases || []),
          created_at: problem.createdAt
        } : null;
      }
      if (query.includes('FROM submissions')) {
        const submission = database.submissions.find(s => s.problemId === param);
        return submission ? {
          ...submission,
          problem_id: submission.problemId,
          submitted_at: submission.submittedAt,
          memory_usage: submission.memoryUsage
        } : null;
      }
      if (query.includes('FROM problem_attempts')) {
        return database.problemAttempts.find(pa => pa.problemId === param) || null;
      }
      return null;
    },
    run: (...params: any[]) => {
      if (query.includes('INSERT INTO problems')) {
        const [title, description, difficulty, testCases, solution] = params;
        const id = database.nextIds.problems++;
        const problem = {
          id,
          title,
          description,
          difficulty,
          testCases: JSON.parse(testCases),
          solution,
          createdAt: new Date().toISOString()
        };
        database.problems.push(problem);
        saveDB();
        return { lastInsertRowid: id };
      }
      if (query.includes('INSERT INTO submissions')) {
        const [problemId, code, language, status, runtime, memoryUsage] = params;
        const id = database.nextIds.submissions++;
        const submission = {
          id,
          problemId,
          code,
          language,
          status,
          runtime,
          memoryUsage,
          submittedAt: new Date().toISOString()
        };
        database.submissions.push(submission);
        saveDB();
        return { lastInsertRowid: id };
      }
      if (query.includes('INSERT INTO problem_attempts')) {
        const [problemId] = params;
        const id = database.nextIds.problemAttempts++;
        const attempt = {
          id,
          problemId,
          attemptedAt: new Date().toISOString()
        };
        database.problemAttempts.push(attempt);
        saveDB();
        return { lastInsertRowid: id };
      }
      return { lastInsertRowid: 0 };
    }
  })
};

// Initialize database on module load
database = initializeDB();

// Add clear function to db object
db.clearAllData = () => {
  database.problems = [];
  database.submissions = [];
  database.problemAttempts = [];
  database.nextIds = {
    problems: 1,
    submissions: 1,
    problemAttempts: 1
  };
  saveDB();
  console.log('Database cleared successfully');
};

export default db;
