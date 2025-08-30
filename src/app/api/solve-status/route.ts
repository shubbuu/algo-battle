import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'public', 'leetcode-db.json');

export async function POST(request: NextRequest) {
  try {
    const { problemId, solveStatus } = await request.json();
    
    // Read the current JSON file
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Update the solve status for the specific problem
    const problemIndex = jsonData.problems.findIndex((p: any) => p.id === problemId);
    if (problemIndex !== -1) {
      jsonData.problems[problemIndex].solve = solveStatus;
      
      // Write back to file
      fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        message: `Problem ${problemId} solve status updated to ${solveStatus}` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Problem ${problemId} not found` 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating solve status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update solve status' 
    }, { status: 500 });
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
      }, { status: 400 });
    }
    
    // Read the JSON file
    const data = fs.readFileSync(dbPath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Find the problem
    const problem = jsonData.problems.find((p: any) => p.id === parseInt(problemId));
    
    if (problem) {
      return NextResponse.json({ 
        success: true, 
        solveStatus: problem.solve || "0" 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Problem ${problemId} not found` 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error reading solve status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to read solve status' 
    }, { status: 500 });
  }
}
