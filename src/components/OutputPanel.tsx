'use client';

import { useMemo, memo } from 'react';
import { CodeExecutionResult } from '@/types';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface OutputPanelProps {
  output: CodeExecutionResult | null;
}

// Memoized status icon component
const StatusIcon = memo(({ success }: { success: boolean }) => {
  if (success) {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  } else {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
});
StatusIcon.displayName = 'StatusIcon';

const OutputPanel = memo(({ output }: OutputPanelProps) => {
  // Memoize expensive computations
  const statusColor = useMemo(() => {
    if (!output) return '';
    return output.success 
      ? 'text-green-700 dark:text-green-300' 
      : 'text-red-700 dark:text-red-300';
  }, [output]);

  const statusText = useMemo(() => {
    if (!output) return '';
    return output.success ? 'Success' : 'Error';
  }, [output]);

  const outputContent = useMemo(() => {
    if (!output) return 'No output';
    return output.output || output.error || 'No output';
  }, [output]);

  if (!output) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 h-80">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Output
        </h3>
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Run your code to see the output here.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 h-80 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-3">
        <StatusIcon success={output.success} />
        <h3 className={clsx('text-sm font-medium', statusColor)}>
          {statusText}
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
          {outputContent}
        </pre>
      </div>
    </div>
  );
});

OutputPanel.displayName = 'OutputPanel';

export default OutputPanel;
