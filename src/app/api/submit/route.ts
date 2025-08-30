import { NextRequest, NextResponse } from 'next/server';
import { Language, CodeExecutionResult } from '@/types';
import { 
  HTTP_STATUS, 
  CODE_EXECUTION, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  SUBMISSION_STATUS 
} from '@/constants';

// Configure runtime to use Node.js
export const runtime = 'nodejs';

// Simulate submission validation
function validateSubmission(
  code: string, 
  language: Language
): CodeExecutionResult & { status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' } {
  try {
    const startTime = Date.now();
    
    // Basic validation
    if (code.trim().length === 0) {
      return {
        success: false,
        error: ERROR_MESSAGES.CODE_EMPTY,
        status: SUBMISSION_STATUS.RUNTIME_ERROR
      };
    }

    // Language-specific basic checks
    if (language === 'javascript' && !code.includes('function')) {
      return {
        success: false,
        error: ERROR_MESSAGES.MISSING_FUNCTION_JS,
        status: SUBMISSION_STATUS.RUNTIME_ERROR
      };
    }

    if (language === 'python' && !code.includes('def')) {
      return {
        success: false,
        error: ERROR_MESSAGES.MISSING_FUNCTION_PYTHON,
        status: SUBMISSION_STATUS.RUNTIME_ERROR
      };
    }

    // For demo purposes, we'll accept submissions based on simple criteria
    // In reality, you'd run comprehensive test cases
    
    const runtime = Date.now() - startTime + Math.floor(Math.random() * CODE_EXECUTION.RUNTIME_VARIATION_MS);
    const memoryUsage = Math.floor(Math.random() * (CODE_EXECUTION.MAX_MEMORY_USAGE - CODE_EXECUTION.MIN_MEMORY_USAGE)) + CODE_EXECUTION.MIN_MEMORY_USAGE;

    // Simulate different outcomes based on code complexity
    const codeComplexity = code.length;
    
    if (codeComplexity < CODE_EXECUTION.MIN_CODE_LENGTH) {
      return {
        success: false,
        error: ERROR_MESSAGES.SOLUTION_TOO_SIMPLE,
        status: SUBMISSION_STATUS.WRONG_ANSWER,
        runtime,
        memoryUsage
      };
    }

    if (runtime > CODE_EXECUTION.TIME_LIMIT_MS) {
      return {
        success: false,
        error: ERROR_MESSAGES.TIME_LIMIT_EXCEEDED,
        status: SUBMISSION_STATUS.TIME_LIMIT_EXCEEDED,
        runtime: CODE_EXECUTION.TIME_LIMIT_MS,
        memoryUsage
      };
    }

    // Accept the submission
    return {
      success: true,
      output: SUCCESS_MESSAGES.ALL_TEST_CASES_PASSED,
      status: SUBMISSION_STATUS.ACCEPTED,
      runtime,
      memoryUsage
    };

  } catch (error) {
    return {
      success: false,
      error: `Runtime Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: 'Runtime Error'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, problemId } = await request.json();

    if (!code || !language || !problemId) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validate submission
    const result = validateSubmission(code, language);

    // Generate a simple submission ID for tracking
    const submissionId = Date.now();

    return NextResponse.json({
      success: result.success,
      output: result.output,
      error: result.error,
      runtime: result.runtime,
      memoryUsage: result.memoryUsage,
      submissionId
    });
  } catch (error) {
    console.error('Error in /api/submit:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
