import React from 'react';
import { Assignment } from '../../../api/services/assignmentApi';
import { Calendar, Clock, Users, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AssignmentCardProps {
  assignment: Assignment;
  onView?: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
  onViewSubmissions?: (assignment: Assignment) => void;
  showActions?: boolean;
  userRole?: string;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onView,
  onEdit,
  onDelete,
  onViewSubmissions,
  showActions = true,
  userRole
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="w-4 h-4" />;
      case 'DRAFT':
        return <AlertCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      case 'ARCHIVED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const canEdit = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER'].includes(userRole || '');
  const canViewSubmissions = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER'].includes(userRole || '');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{assignment.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
            {getStatusIcon(assignment.status)}
            {assignment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Due: {assignment.dueDate ? format(new Date(assignment.dueDate), 'MMM dd, yyyy') : 'No due date'}</span>
          {isOverdue && <span className="text-red-500 text-xs">(Overdue)</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>Max Score: {assignment.maxScore || 'Not set'}</span>
        </div>
        {assignment.timeLimit && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Time Limit: {assignment.timeLimit} min</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Submissions: {assignment.submissionCount || 0}</span>
        </div>
      </div>

      {assignment.tags && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {assignment.tags.split(',').map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            {onView && (
              <button
                onClick={() => onView(assignment)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </button>
            )}
            {canViewSubmissions && onViewSubmissions && (
              <button
                onClick={() => onViewSubmissions(assignment)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                View Submissions ({assignment.submissionCount || 0})
              </button>
            )}
          </div>
          {canEdit && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(assignment)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(assignment)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard; 