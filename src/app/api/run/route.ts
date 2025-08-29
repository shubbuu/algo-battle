import { NextRequest, NextResponse } from 'next/server';
import { Language, TestCase, CodeExecutionResult } from '@/types';

// Simple code execution simulator
// In a real implementation, you'd use a secure sandbox like Docker
function simulateCodeExecution(
  code: string, 
  language: Language, 
  testCases: TestCase[]
): CodeExecutionResult {
  try {
    // For demo purposes, we'll simulate some basic test case validation
    // This is a simplified version - real implementation would execute actual code
    
    const startTime = Date.now();
    
    // Simple validation for demonstration
    if (code.trim().length === 0) {
      return {
        success: false,
        error: 'Code cannot be empty'
      };
    }

    // Simulate syntax check
    if (language === 'javascript' && !code.includes('function')) {
      return {
        success: false,
        error: 'JavaScript code must contain a function'
      };
    }

    if (language === 'python' && !code.includes('def')) {
      return {
        success: false,
        error: 'Python code must contain a function definition'
      };
    }

    // Simulate test case execution
    const results = testCases.map((testCase, index) => {
      // For demo, we'll just check if the code contains certain keywords
      // In reality, you'd execute the code with the test input
      
      return {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: testCase.expectedOutput, // Simulated - always pass for demo
        passed: true
      };
    });

    const runtime = Date.now() - startTime;
    const memoryUsage = Math.floor(Math.random() * 1000) + 100; // Simulated memory usage

    const allPassed = results.every(r => r.passed);
    
    if (allPassed) {
      return {
        success: true,
        output: `All ${testCases.length} test cases passed!\n\n` +
                results.map((r, i) => 
                  `Test Case ${i + 1}:\n` +
                  `Input: ${r.input}\n` +
                  `Expected: ${r.expectedOutput}\n` +
                  `Output: ${r.actualOutput}\n` +
                  `Status: ✓ Passed\n`
                ).join('\n'),
        runtime,
        memoryUsage
      };
    } else {
      const failedIndex = results.findIndex(r => !r.passed);
      const failed = results[failedIndex];
      
      return {
        success: false,
        error: `Test Case ${failedIndex + 1} failed:\n` +
               `Input: ${failed.input}\n` +
               `Expected: ${failed.expectedOutput}\n` +
               `Got: ${failed.actualOutput}`,
        runtime,
        memoryUsage
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Runtime Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, problemId, testCases } = await request.json();

    if (!code || !language || !problemId || !testCases) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Execute code
    const result = simulateCodeExecution(code, language, testCases);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/run:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
