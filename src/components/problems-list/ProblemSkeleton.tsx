'use client';

import { Circle } from 'lucide-react';
import Link from 'next/link';
import { ProblemWithStatus } from '@/types';
import { SOLVE_STATUS, UI } from '@/constants';

interface ProblemSkeletonProps {
  problem: ProblemWithStatus;
}

const ProblemSkeleton = ({ problem }: ProblemSkeletonProps) => {
  return (
    <div className={`border rounded-lg p-6 transition-all duration-${UI.TRANSITION_DURATION_MS} hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0">
            <Circle className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                #{problem.id}
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {problem.title}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {problem.difficulty}
              </span>
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Solve: {problem.solve || SOLVE_STATUS.UNSOLVED}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            disabled
            className="inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md transition-colors bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
          >
            Loading...
          </button>
          
          <Link
            href={`/problem/${problem.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Solve
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProblemSkeleton;
