import { notFound } from 'next/navigation';
import { JsonService } from '@/lib/json-service';
import ProblemSolver from '@/components/ProblemSolver';

interface ProblemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { id } = await params;
  const problemId = parseInt(id);
  
  if (isNaN(problemId)) {
    notFound();
  }

  const problem = await JsonService.getProblemById(problemId);
  
  if (!problem) {
    notFound();
  }

  // For now, we'll use empty submissions and default status
  // You can extend this later if needed
  const submissions: never[] = [];
  const problemStatus = 'not-attempted';

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
