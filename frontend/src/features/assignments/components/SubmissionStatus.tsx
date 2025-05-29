import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, Star, FileText } from 'lucide-react';

interface SubmissionStatusProps {
  status: string;
  isLate?: boolean;
  score?: number;
  maxScore?: number;
  percentage?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  status,
  isLate = false,
  score,
  maxScore,
  percentage,
  showScore = true,
  size = 'md'
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle,
          label: 'Submitted'
        };
      case 'GRADED':
        return {
          color: 'bg-green-100 text-green-800',
          icon: Star,
          label: 'Graded'
        };
      case 'DRAFT':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: FileText,
          label: 'Draft'
        };
      case 'RETURNED':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: CheckCircle,
          label: 'Returned'
        };
      case 'LATE':
        return {
          color: 'bg-red-100 text-red-800',
          icon: Clock,
          label: 'Late'
        };
      case 'MISSING':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: XCircle,
          label: 'Missing'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          label: status
        };
    }
  };

  const getScoreColor = () => {
    if (percentage !== undefined) {
      if (percentage >= 80) return 'text-green-600';
      if (percentage >= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'text-xs',
          icon: 'w-3 h-3',
          padding: 'px-2 py-1'
        };
      case 'lg':
        return {
          container: 'text-base',
          icon: 'w-5 h-5',
          padding: 'px-4 py-2'
        };
      default:
        return {
          container: 'text-sm',
          icon: 'w-4 h-4',
          padding: 'px-3 py-1'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeClasses = getSizeClasses();
  const Icon = statusConfig.icon;

  const getScoreDisplay = () => {
    if (score !== undefined && maxScore !== undefined) {
      const calculatedPercentage = percentage || (score / maxScore) * 100;
      return `${score}/${maxScore} (${calculatedPercentage.toFixed(1)}%)`;
    }
    return 'Not graded';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 rounded-full font-medium ${statusConfig.color} ${sizeClasses.container} ${sizeClasses.padding}`}>
        <Icon className={sizeClasses.icon} />
        {statusConfig.label}
        {isLate && status !== 'LATE' && (
          <span className="ml-1 text-red-500">(Late)</span>
        )}
      </span>
      
      {showScore && (score !== undefined || percentage !== undefined) && (
        <span className={`${sizeClasses.container} font-medium ${getScoreColor()}`}>
          {getScoreDisplay()}
        </span>
      )}
    </div>
  );
};

export default SubmissionStatus; 