import { DatabaseService } from '@/lib/db-service';
import { notFound } from 'next/navigation';
import ProblemSolver from '@/components/ProblemSolver';

interface ProblemPageProps {
  params: {
    id: string;
  };
}

export default function ProblemPage({ params }: ProblemPageProps) {
  const problemId = parseInt(params.id);
  
  if (isNaN(problemId)) {
    notFound();
  }

  const problem = DatabaseService.getProblemById(problemId);
  
  if (!problem) {
    notFound();
  }

  // Record attempt when problem is visited (only if not already attempted or submitted)
  const currentStatus = DatabaseService.getProblemStatus(problemId);
  if (currentStatus === 'not-attempted') {
    DatabaseService.recordAttempt(problemId);
  }

  const submissions = DatabaseService.getSubmissionsByProblem(problemId);
  const problemStatus = DatabaseService.getProblemStatus(problemId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProblemSolver 
        problem={problem} 
        submissions={submissions}
        initialStatus={problemStatus}
      />
    </div>
  );
}
