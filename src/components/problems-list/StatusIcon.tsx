'use client';

import { memo } from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { ProblemWithStatus } from '@/types';

interface StatusIconProps {
  status: ProblemWithStatus['status'];
}

const StatusIcon = memo(({ status }: StatusIconProps) => {
  switch (status) {
    case 'submitted':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'attempted':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
});

StatusIcon.displayName = 'StatusIcon';

export default StatusIcon;
