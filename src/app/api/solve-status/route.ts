import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  SOLVE_STATUS,
  FILE_SYSTEM 
} from '@/constants';

const dbPath = path.join(process.cwd(), 'public', FILE_SYSTEM.LEETCODE_DB_PATH);

export async function POST(request: NextRequest) {
  try {
    const { problemId, solveStatus } = await request.json();
    
    // Read the current JSON file
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Update the solve status for the specific problem
    const problemIndex = jsonData.problems.findIndex((p: { id: number }) => p.id === problemId);
    if (problemIndex !== -1) {
      jsonData.problems[problemIndex].solve = solveStatus;
      
      // Write back to file
      fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        message: `${SUCCESS_MESSAGES.STATUS_UPDATED} ${solveStatus}` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: ERROR_MESSAGES.PROBLEM_NOT_FOUND 
      }, { status: HTTP_STATUS.NOT_FOUND });
    }
  } catch (error) {
    console.error('Error updating solve status:', error);
    return NextResponse.json({ 
      success: false, 
      message: ERROR_MESSAGES.FAILED_TO_UPDATE_STATUS 
    }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');
    
    if (!problemId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Problem ID is required' 
      }, { status: HTTP_STATUS.BAD_REQUEST });
    }
    
    // Read the JSON file
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Find the problem
    const problem = jsonData.problems.find((p: { id: number }) => p.id === parseInt(problemId));
    
    if (problem) {
      return NextResponse.json({ 
        success: true, 
        solveStatus: problem.solve || SOLVE_STATUS.UNSOLVED 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: ERROR_MESSAGES.PROBLEM_NOT_FOUND 
      }, { status: HTTP_STATUS.NOT_FOUND });
    }
  } catch (error) {
    console.error('Error reading solve status:', error);
    return NextResponse.json({ 
      success: false, 
      message: ERROR_MESSAGES.FAILED_TO_READ_STATUS 
    }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}
