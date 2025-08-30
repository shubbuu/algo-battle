// Solve Status Constants
export const SOLVE_STATUS = {
  UNSOLVED: "0",
  SOLVED: "1"
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Code Execution Constants
export const CODE_EXECUTION = {
  // Time limits
  TIMEOUT_MS: 10000, // 10 seconds
  TIME_LIMIT_MS: 2000, // 2 seconds for submission validation
  
  // Code complexity thresholds
  MIN_CODE_LENGTH: 50, // Minimum code length for acceptance
  
  // Memory usage ranges (for simulation)
  MIN_MEMORY_USAGE: 100,
  MAX_MEMORY_USAGE: 1000,
  
  // Runtime simulation ranges
  RUNTIME_VARIATION_MS: 100, // Random variation added to runtime
} as const;

// UI/UX Constants
export const UI = {
  // Debounce delays
  DEBOUNCE_DELAY_MS: 100, // 100ms debounce for rapid clicks
  
  // Animation durations
  TRANSITION_DURATION_MS: 200,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_ITEMS_PER_PAGE: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
} as const;

// File System Constants
export const FILE_SYSTEM = {
  // Database file paths
  LEETCODE_DB_PATH: 'leetcode-db.json',
  ALGO_BATTLE_DB_PATH: 'algo-battle-db.json',
  
  // Temporary directory prefix
  TEMP_DIR_PREFIX: 'code-exec-',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  PROBLEM_SOLVE_STATUS: 'problemSolveStatus',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  SOLVE_STATUS: '/api/solve-status',
  RUN: '/api/run',
  SUBMIT: '/api/submit',
} as const;

// Language-specific Constants
export const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  JAVA: 'java',
  CPP: 'cpp',
  C: 'c',
} as const;

// File Extensions
export const FILE_EXTENSIONS = {
  [LANGUAGES.JAVASCRIPT]: 'js',
  [LANGUAGES.PYTHON]: 'py',
  [LANGUAGES.JAVA]: 'java',
  [LANGUAGES.CPP]: 'cpp',
  [LANGUAGES.C]: 'c',
  DEFAULT: 'txt',
} as const;

// Submission Status
export const SUBMISSION_STATUS = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  RUNTIME_ERROR: 'Runtime Error',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
} as const;

// Problem Status
export const PROBLEM_STATUS = {
  NOT_ATTEMPTED: 'not-attempted',
  ATTEMPTED: 'attempted',
  SOLVED: 'solved',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  CODE_EMPTY: 'Code cannot be empty',
  MISSING_FUNCTION_JS: 'JavaScript code must contain a function',
  MISSING_FUNCTION_PYTHON: 'Python code must contain a function definition',
  SOLUTION_TOO_SIMPLE: 'Solution appears too simple. Test case 3 failed.',
  TIME_LIMIT_EXCEEDED: 'Time limit exceeded',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  MISSING_REQUIRED_FIELDS_DETAILED: 'Missing required fields: code, language, problemId',
  UNSUPPORTED_LANGUAGE: 'Unsupported language:',
  MISSING_INPUT: 'Either testCases or customInput must be provided',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  FAILED_TO_FETCH: 'Failed to fetch problems data',
  FAILED_TO_UPDATE_STATUS: 'Failed to update solve status',
  PROBLEM_NOT_FOUND: 'Problem not found',
  FAILED_TO_READ_STATUS: 'Failed to read solve status',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ALL_TEST_CASES_PASSED: 'All test cases passed! Solution accepted.',
  PROGRAM_EXECUTED: 'Program executed successfully (no output)',
  STATUS_UPDATED: 'Problem solve status updated to',
} as const;

// Header Constants
export const HEADER = {
  BRAND_NAME: 'Algo Battle',
  TAGLINE: 'Master Your Coding Skills',
  SCROLL_THRESHOLD: 10,
  STATS: {
    SOLVED: '1,234',
    STREAK: '567',
    ACCURACY: '89%',
  },
  NAVIGATION: {
    PROBLEMS: 'Problems',
    LEADERBOARD: 'Leaderboard',
    PROFILE: 'Profile',
  },
  CTA: 'Start Coding',
} as const;
