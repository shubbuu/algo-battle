'use client';

import { useMemo, memo } from 'react';
import { Submission } from '@/types';
import { X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface SubmissionHistoryProps {
  submissions: Submission[];
  onClose: () => void;
}

// Memoized status icon component
const StatusIcon = memo(({ status }: { status: Submission['status'] }) => {
  switch (status) {
    case 'Accepted':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Wrong Answer':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Runtime Error':
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case 'Time Limit Exceeded':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <XCircle className="h-4 w-4 text-gray-500" />;
  }
});
StatusIcon.displayName = 'StatusIcon';

// Memoized submission item component
const SubmissionItem = memo(({ submission }: { submission: Submission }) => {
  const statusColor = useMemo(() => {
    switch (submission.status) {
      case 'Accepted':
        return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30';
      case 'Wrong Answer':
        return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30';
      case 'Runtime Error':
        return 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30';
      case 'Time Limit Exceeded':
        return 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30';
      default:
        return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30';
    }
  }, [submission.status]);

  const formattedDate = useMemo(() => {
    const date = new Date(submission.submittedAt);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  }, [submission.submittedAt]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <StatusIcon status={submission.status} />
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColor
          )}>
            {submission.status}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {submission.language}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {submission.runtime && (
            <span>Runtime: {submission.runtime}ms</span>
          )}
          {submission.memoryUsage && (
            <span>Memory: {submission.memoryUsage}KB</span>
          )}
          <span>
            {formattedDate.date} {formattedDate.time}
          </span>
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          View Code
        </summary>
        <div className="mt-3">
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
            {submission.code}
          </pre>
        </div>
      </details>
    </div>
  );
});
SubmissionItem.displayName = 'SubmissionItem';

const SubmissionHistory = memo(({ submissions, onClose }: SubmissionHistoryProps) => {
  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [submissions]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Submission History ({submissions.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedSubmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSubmissions.map((submission) => (
                <SubmissionItem key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SubmissionHistory.displayName = 'SubmissionHistory';

export default SubmissionHistory;
