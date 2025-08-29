'use client';

import Link from 'next/link';
import { ProblemWithStatus } from '@/types';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface ProblemsListProps {
  problems: ProblemWithStatus[];
}

export default function ProblemsList({ problems }: ProblemsListProps) {
  const getStatusIcon = (status: ProblemWithStatus['status']) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'attempted':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBg = (status: ProblemWithStatus['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'attempted':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No problems available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className={clsx(
            'border rounded-lg p-6 transition-all duration-200 hover:shadow-md',
            getStatusBg(problem.status)
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                {getStatusIcon(problem.status)}
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
                  <span className={clsx('text-sm font-medium', getDifficultyColor(problem.difficulty))}>
                    {problem.difficulty}
                  </span>
                  
                  {problem.status !== 'not-attempted' && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {problem.status === 'submitted' ? 'Solved' : problem.status === 'attempted' ? 'Attempted' : 'In Progress'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {problem.status === 'submitted' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Accepted
                </span>
              )}
              
              <Link
                href={`/problem/${problem.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {problem.status === 'not-attempted' ? 'Solve' : 'View'}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
