import React from 'react';
import { Submission } from '../../../api/services/submissionApi';
import SubmissionStatus from './SubmissionStatus';
import { Calendar, Clock, User, FileText, Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface SubmissionCardProps {
  submission: Submission;
  onView?: (submission: Submission) => void;
  onGrade?: (submission: Submission) => void;
  onEdit?: (submission: Submission) => void;
  onDelete?: (submission: Submission) => void;
  onDownload?: (submission: Submission) => void;
  showActions?: boolean;
  userRole?: string;
  showStudentInfo?: boolean;
  showAssignmentInfo?: boolean;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  onView,
  onGrade,
  onEdit,
  onDelete,
  onDownload,
  showActions = true,
  userRole,
  showStudentInfo = true,
  showAssignmentInfo = false
}) => {
  const canGrade = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER'].includes(userRole || '');
  const canEdit = ['STUDENT'].includes(userRole || '') && submission.status === 'DRAFT';
  const canDelete = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER'].includes(userRole || '');

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'SUBMISSION':
        return 'bg-blue-100 text-blue-800';
      case 'ASSESSMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'GRADING':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (sizeStr: string | undefined) => {
    if (!sizeStr) return 'Unknown size';
    const size = parseInt(sizeStr);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <SubmissionStatus
              status={submission.status}
              isLate={submission.isLateSubmission}
              score={submission.score}
              maxScore={submission.maxScore}
              percentage={submission.percentage}
              showScore={submission.status === 'GRADED'}
              size="sm"
            />
            {submission.phase && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(submission.phase)}`}>
                {submission.phase}
              </span>
            )}
          </div>
          
          {showStudentInfo && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User className="w-4 h-4" />
              <span>Student ID: {submission.studentId}</span>
            </div>
          )}
          
          {showAssignmentInfo && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <FileText className="w-4 h-4" />
              <span>Assignment ID: {submission.assignmentId}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {submission.content && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Content</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{submission.content}</p>
          </div>
        )}

        {submission.originalFileName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{submission.originalFileName}</span>
            {submission.fileSize && (
              <span className="text-xs text-gray-500">({formatFileSize(submission.fileSize)})</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {submission.submittedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Submitted: {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {submission.attemptNumber && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Attempt: {submission.attemptNumber}</span>
            </div>
          )}
        </div>

        {submission.feedback && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-medium text-gray-900">Feedback</h4>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{submission.feedback}</p>
          </div>
        )}

        {submission.status === 'GRADED' && submission.gradedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            <span>Graded: {format(new Date(submission.gradedAt), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>

      {/* Flags and Indicators */}
      <div className="flex flex-wrap gap-2 mb-4">
        {submission.isLateSubmission && (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
            Late Submission
          </span>
        )}
        {submission.needsReview && (
          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
            Needs Review
          </span>
        )}
        {submission.autoGraded && (
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            Auto Graded
          </span>
        )}
        {submission.manuallyGraded && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            Manually Graded
          </span>
        )}
        {submission.plagiarismChecked && (
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
            Plagiarism Checked
          </span>
        )}
      </div>

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            {onView && (
              <button
                onClick={() => onView(submission)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </button>
            )}
            {submission.originalFileName && onDownload && (
              <button
                onClick={() => onDownload(submission)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Download
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {canGrade && submission.status === 'SUBMITTED' && onGrade && (
              <button
                onClick={() => onGrade(submission)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Grade
              </button>
            )}
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(submission)}
                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
            {canDelete && onDelete && (
              <button
                onClick={() => onDelete(submission)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard; 