import { notFound } from 'next/navigation';
import { ServerJsonService } from '@/lib/server-json-service';
import ProblemSolver from '@/components/ProblemSolver';

interface ProblemPageProps {
  params: {
    id: string;
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const problemId = parseInt(params.id);
  
  if (isNaN(problemId)) {
    notFound();
  }

  const problem = await ServerJsonService.getProblemById(problemId);
  
  if (!problem) {
    notFound();
  }

  // For now, we'll use empty submissions and default status
  // You can extend this later if needed
  const submissions: any[] = [];
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
