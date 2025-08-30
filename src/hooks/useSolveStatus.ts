import { useState, useCallback, useRef } from 'react';
import { JsonService } from '@/lib/json-service';

// Cache for solve status to prevent unnecessary API calls
let solveStatusCache: Map<number, string>;
let pendingUpdates: Set<number>;

// Initialize cache only on client side to prevent hydration issues
if (typeof window !== 'undefined') {
  solveStatusCache = new Map<number, string>();
  pendingUpdates = new Set<number>();
} else {
  // Server-side fallback
  solveStatusCache = new Map<number, string>();
  pendingUpdates = new Set<number>();
}

export function useSolveStatus() {
  const [updating, setUpdating] = useState(false);
  const [updatingProblemId, setUpdatingProblemId] = useState<number | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateSolveStatus = useCallback(async (problemId: number, solveStatus: string) => {
    // Check if this update is already pending
    if (pendingUpdates.has(problemId)) {
      return;
    }

    // Check if the status is actually changing
    const currentStatus = solveStatusCache.get(problemId);
    if (currentStatus === solveStatus) {
      return;
    }

    try {
      pendingUpdates.add(problemId);
      setUpdating(true);
      setUpdatingProblemId(problemId);
      
      await JsonService.updateSolveStatus(problemId, solveStatus);
      
      // Update cache
      solveStatusCache.set(problemId, solveStatus);
    } catch (_error) {
      console.error('Error updating solve status:', _error);
      throw _error;
    } finally {
      pendingUpdates.delete(problemId);
      setUpdating(false);
      setUpdatingProblemId(null);
    }
  }, []);

  const toggleSolveStatus = useCallback(async (problemId: number, currentStatus: string) => {
    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const newStatus = currentStatus === "0" ? "1" : "0";
    
    // Debounce rapid clicks to prevent spam
    return new Promise<string>((resolve) => {
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          await updateSolveStatus(problemId, newStatus);
          resolve(newStatus);
        } catch (error) {
          // Revert on error
          resolve(currentStatus);
        }
      }, 100); // 100ms debounce
    });
  }, [updateSolveStatus]);

  // Function to check if a specific problem is being updated
  const isUpdating = useCallback((problemId: number) => {
    return updatingProblemId === problemId || pendingUpdates.has(problemId);
  }, [updatingProblemId]);

  // Function to get cached status
  const getCachedStatus = useCallback((problemId: number) => {
    return solveStatusCache.get(problemId);
  }, []);

  // Function to set cached status (useful for initial load)
  const setCachedStatus = useCallback((problemId: number, status: string) => {
    solveStatusCache.set(problemId, status);
  }, []);

  return {
    updateSolveStatus,
    toggleSolveStatus,
    updating,
    isUpdating,
    getCachedStatus,
    setCachedStatus
  };
}
