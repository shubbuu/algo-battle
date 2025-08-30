import { Problem, ProblemWithStatus } from '@/types';

class CacheService {
  private problemsCache: Map<number, Problem> = new Map();
  private problemsListCache: ProblemWithStatus[] | null = null;
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastCacheTime: number = 0;

  // Cache individual problem
  setProblem(id: number, problem: Problem): void {
    this.problemsCache.set(id, problem);
  }

  // Get individual problem from cache
  getProblem(id: number): Problem | null {
    return this.problemsCache.get(id) || null;
  }

  // Cache problems list
  setProblemsList(problems: ProblemWithStatus[]): void {
    this.problemsListCache = problems;
    this.lastCacheTime = Date.now();
  }

  // Get problems list from cache
  getProblemsList(): ProblemWithStatus[] | null {
    if (!this.problemsListCache) return null;
    
    // Check if cache has expired
    if (Date.now() - this.lastCacheTime > this.cacheExpiry) {
      this.clearProblemsListCache();
      return null;
    }
    
    return this.problemsListCache;
  }

  // Clear specific problem from cache
  clearProblem(id: number): void {
    this.problemsCache.delete(id);
  }

  // Clear problems list cache
  clearProblemsListCache(): void {
    this.problemsListCache = null;
    this.lastCacheTime = 0;
  }

  // Clear all caches
  clearAll(): void {
    this.problemsCache.clear();
    this.clearProblemsListCache();
  }

  // Check if cache is valid
  isCacheValid(): boolean {
    return this.problemsListCache !== null && 
           (Date.now() - this.lastCacheTime) <= this.cacheExpiry;
  }
}

export const cacheService = new CacheService();
