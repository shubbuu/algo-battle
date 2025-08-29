'use client';

import { Submission } from '@/types';
import { X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface SubmissionHistoryProps {
  submissions: Submission[];
  onClose: () => void;
}

export default function SubmissionHistory({ submissions, onClose }: SubmissionHistoryProps) {
  const getStatusIcon = (status: Submission['status']) => {
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
  };

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
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
  };

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
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(submission.status)}
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(submission.status)
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
                        {new Date(submission.submittedAt).toLocaleDateString()} {' '}
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      View Code
                    </summary>
                    <div className="mt-3 bg-gray-50 dark:bg-gray-900 rounded-md p-3 border">
                      <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                        <code>{submission.code}</code>
                      </pre>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
