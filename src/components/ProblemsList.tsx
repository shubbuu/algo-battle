'use client';

import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { ProblemWithStatus } from '@/types';
import { useSolveStatus } from '@/hooks/useSolveStatus';
import Link from 'next/link';
import { CheckCircle, Circle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ProblemsListProps {
  initialProblems: ProblemWithStatus[];
}

// Memoized status icon component
const StatusIcon = memo(({ status }: { status: ProblemWithStatus['status'] }) => {
  switch (status) {
    case 'submitted':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'attempted':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
});
StatusIcon.displayName = 'StatusIcon';

// Memoized individual problem item component
const ProblemItem = memo(({ 
  problem, 
  onToggleSolveStatus, 
  isUpdating 
}: { 
  problem: ProblemWithStatus; 
  onToggleSolveStatus: (problemId: number, currentSolve: string) => void;
  isUpdating: (problemId: number) => boolean;
}) => {
  // Memoize expensive computations
  const statusBg = useMemo(() => {
    switch (problem.status) {
      case 'submitted':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'attempted':
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

  const solveStatus = problem.solve || "0";
  const isSolved = solveStatus === "1";

  const handleToggleClick = useCallback(() => {
    onToggleSolveStatus(problem.id, solveStatus);
  }, [problem.id, solveStatus, onToggleSolveStatus]);

  return (
    <div
      className={clsx(
        'border rounded-lg p-6 transition-all duration-200 hover:shadow-md',
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
              
              {problem.status !== 'not-attempted' && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {problem.status === 'submitted' ? 'Solved' : problem.status === 'attempted' ? 'Attempted' : 'In Progress'}
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
  );
});
ProblemItem.displayName = 'ProblemItem';

// Pagination controls component
const PaginationControls = memo(({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange: (items: number) => void;
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="items-per-page" className="text-sm text-gray-700 dark:text-gray-300">
            Show:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={clsx(
            'inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md',
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={clsx(
                  'inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md',
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={clsx(
            'inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md',
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
PaginationControls.displayName = 'PaginationControls';

// Client-side only wrapper to prevent hydration issues
const ProblemsList = memo(({ initialProblems }: ProblemsListProps) => {
  const [mounted, setMounted] = useState(false);
  const [localProblems, setLocalProblems] = useState(initialProblems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const { toggleSolveStatus, isUpdating, setCachedStatus } = useSolveStatus();

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize cache with initial problems - use useEffect to avoid hydration issues
  useEffect(() => {
    if (mounted) {
      initialProblems.forEach(problem => {
        setCachedStatus(problem.id, problem.solve || "0");
      });
    }
  }, [initialProblems, setCachedStatus, mounted]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleToggleSolveStatus = useCallback(async (problemId: number, currentSolve: string) => {
    try {
      const newSolveStatus = await toggleSolveStatus(problemId, currentSolve);
      
      // Update locally using functional update for better performance
      setLocalProblems(prev => 
        prev.map(problem => 
          problem.id === problemId 
            ? { ...problem, solve: newSolveStatus }
            : problem
        )
      );
    } catch (error) {
      console.error('Failed to toggle solve status:', error);
    }
  }, [toggleSolveStatus]);

  // Calculate pagination
  const totalItems = localProblems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProblems = localProblems.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-4">
        {initialProblems.slice(0, 25).map((problem) => (
          <div
            key={problem.id}
            className="border rounded-lg p-6 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
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
                      Solve: {problem.solve || "0"}
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
        ))}
      </div>
    );
  }

  if (localProblems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No problems available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Problems List */}
      <div className="space-y-4">
        {currentProblems.map((problem) => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            onToggleSolveStatus={handleToggleSolveStatus}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
});

ProblemsList.displayName = 'ProblemsList';

export default ProblemsList;
