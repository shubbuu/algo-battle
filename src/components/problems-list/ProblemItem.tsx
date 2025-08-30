'use client';

import { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ProblemWithStatus } from '@/types';
import StatusIcon from './StatusIcon';
import { SOLVE_STATUS, UI, PROBLEM_STATUS } from '@/constants';

interface ProblemItemProps {
  problem: ProblemWithStatus;
  onToggleSolveStatus: (problemId: number, currentSolve: string) => void;
  isUpdating: (problemId: number) => boolean;
}

const ProblemItem = memo(({ 
  problem, 
  onToggleSolveStatus, 
  isUpdating 
}: ProblemItemProps) => {
  // Memoize expensive computations
  const statusBg = useMemo(() => {
    switch (problem.status) {
      case PROBLEM_STATUS.SOLVED:
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case PROBLEM_STATUS.ATTEMPTED:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  }, [problem.status]);

  const difficultyColor = useMemo(() => {
    switch (problem.difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }, [problem.difficulty]);

  const solveStatus = problem.solve || SOLVE_STATUS.UNSOLVED;
  const isSolved = solveStatus === SOLVE_STATUS.SOLVED;

  const handleToggleClick = useCallback(() => {
    onToggleSolveStatus(problem.id, solveStatus);
  }, [problem.id, solveStatus, onToggleSolveStatus]);

  return (
    <div
      className={clsx(
        `border rounded-lg p-6 transition-all duration-${UI.TRANSITION_DURATION_MS} hover:shadow-md`,
        statusBg
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0">
            <StatusIcon status={problem.status} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                #{problem.id}
              </span>
              <Link
                href={`/problem/${problem.id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {problem.title}
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={clsx('text-sm font-medium', difficultyColor)}>
                {problem.difficulty}
              </span>
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Solve: {solveStatus}
              </span>
              
              {problem.status !== PROBLEM_STATUS.NOT_ATTEMPTED && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {problem.status === PROBLEM_STATUS.SOLVED ? 'Solved' : problem.status === PROBLEM_STATUS.ATTEMPTED ? 'Attempted' : 'In Progress'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleClick}
            disabled={isUpdating(problem.id)}
            className={clsx(
              'inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md transition-colors',
              isSolved
                ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
              isUpdating(problem.id) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUpdating(problem.id) ? 'Updating...' : isSolved ? "Solved" : "Unsolved"}
          </button>
          
          {problem.status === PROBLEM_STATUS.SOLVED && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Accepted
            </span>
          )}
          
          <Link
            href={`/problem/${problem.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {problem.status === PROBLEM_STATUS.NOT_ATTEMPTED ? 'Solve' : 'View'}
          </Link>
        </div>
      </div>
    </div>
  );
});

ProblemItem.displayName = 'ProblemItem';

export default ProblemItem;
