'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { ProblemWithStatus } from '@/types';
import { useSolveStatus } from '@/hooks/useSolveStatus';
import { ProblemItem, PaginationControls, ProblemSkeleton } from './index';
import { SOLVE_STATUS, PAGINATION } from '@/constants';

interface ProblemsListProps {
  initialProblems: ProblemWithStatus[];
}

// Client-side only wrapper to prevent hydration issues
const ProblemsList = memo(({ initialProblems }: ProblemsListProps) => {
  const [mounted, setMounted] = useState(false);
  const [localProblems, setLocalProblems] = useState(initialProblems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.DEFAULT_ITEMS_PER_PAGE);
  const { toggleSolveStatus, isUpdating, setCachedStatus } = useSolveStatus();

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize cache with initial problems - use useEffect to avoid hydration issues
  useEffect(() => {
    if (mounted) {
      initialProblems.forEach(problem => {
        setCachedStatus(problem.id, problem.solve || SOLVE_STATUS.UNSOLVED);
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
          <ProblemSkeleton key={problem.id} problem={problem} />
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
