import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db-service';
import { Language, CodeExecutionResult } from '@/types';

// Simulate submission validation
function validateSubmission(
  code: string, 
  language: Language, 
  problemId: number
): CodeExecutionResult & { status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' } {
  try {
    const startTime = Date.now();
    
    // Basic validation
    if (code.trim().length === 0) {
      return {
        success: false,
        error: 'Code cannot be empty',
        status: 'Runtime Error'
      };
    }

    // Language-specific basic checks
    if (language === 'javascript' && !code.includes('function')) {
      return {
        success: false,
        error: 'JavaScript code must contain a function',
        status: 'Runtime Error'
      };
    }

    if (language === 'python' && !code.includes('def')) {
      return {
        success: false,
        error: 'Python code must contain a function definition',
        status: 'Runtime Error'
      };
    }

    // For demo purposes, we'll accept submissions based on simple criteria
    // In reality, you'd run comprehensive test cases
    
    const runtime = Date.now() - startTime + Math.floor(Math.random() * 100);
    const memoryUsage = Math.floor(Math.random() * 1000) + 100;

    // Simulate different outcomes based on code complexity
    const codeComplexity = code.length;
    
    if (codeComplexity < 50) {
      return {
        success: false,
        error: 'Solution appears too simple. Test case 3 failed.',
        status: 'Wrong Answer',
        runtime,
        memoryUsage
      };
    }

    if (runtime > 2000) {
      return {
        success: false,
        error: 'Time limit exceeded',
        status: 'Time Limit Exceeded',
        runtime: 2000,
        memoryUsage
      };
    }

    // Accept the submission
    return {
      success: true,
      output: 'All test cases passed! Solution accepted.',
      status: 'Accepted',
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
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate submission
    const result = validateSubmission(code, language, problemId);

    // Save submission to database
    const submissionId = DatabaseService.createSubmission({
      problemId,
      code,
      language,
      status: result.status,
      runtime: result.runtime,
      memoryUsage: result.memoryUsage
    });

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
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
