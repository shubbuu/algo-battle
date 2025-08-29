'use client';

import { CodeExecutionResult } from '@/types';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface OutputPanelProps {
  output: CodeExecutionResult | null;
}

export default function OutputPanel({ output }: OutputPanelProps) {
  if (!output) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 h-48">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Output
        </h3>
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Run your code to see the output here.
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (output.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (output.success) {
      return 'text-green-700 dark:text-green-300';
    } else {
      return 'text-red-700 dark:text-red-300';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 h-48 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-3">
        {getStatusIcon()}
        <h3 className={clsx('text-sm font-medium', getStatusColor())}>
          {output.success ? 'Success' : 'Error'}
        </h3>
        {output.runtime && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Runtime: {output.runtime}ms
            </span>
          </>
        )}
        {output.memoryUsage && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Memory: {output.memoryUsage}KB
            </span>
          </>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono overflow-x-auto">
          {output.output || output.error || 'No output'}
        </pre>
      </div>
    </div>
  );
}
