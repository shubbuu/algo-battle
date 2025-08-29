import { DatabaseService } from '@/lib/db-service';
import { seedDatabase } from '@/lib/seed-data';
import ProblemsList from '@/components/ProblemsList';

export default function Home() {
  // Seed the database on first load
  // seedDatabase();
  
  const problems = DatabaseService.getAllProblems();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Algo Battle
              </h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Master Your Coding Skills
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Problems
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Challenge yourself with algorithmic problems of varying difficulty levels.
          </p>
        </div>
        
        <ProblemsList problems={problems} />
      </main>
    </div>
  );
}
