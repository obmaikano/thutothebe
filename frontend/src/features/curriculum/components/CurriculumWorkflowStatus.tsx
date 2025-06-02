import React from 'react';
import { Curriculum } from '../../../api/services/curriculumApi';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Play, 
  Pause, 
  Archive, 
  AlertTriangle,
  ArrowRight,
  User,
  Calendar
} from 'lucide-react';

interface CurriculumWorkflowStatusProps {
  curriculum: Curriculum;
  showNextActions?: boolean;
  variant?: 'compact' | 'detailed';
}

const CurriculumWorkflowStatus: React.FC<CurriculumWorkflowStatusProps> = ({
  curriculum,
  showNextActions = true,
  variant = 'compact'
}) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      'DRAFT': {
        icon: FileText,
        label: 'Draft',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        description: 'Curriculum is being developed',
        nextActions: ['Submit for Review', 'Edit', 'Delete']
      },
      'UNDER_REVIEW': {
        icon: Clock,
        label: 'Under Review',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Curriculum is being reviewed for approval',
        nextActions: ['Approve', 'Reject', 'Request Changes']
      },
      'APPROVED': {
        icon: CheckCircle,
        label: 'Approved',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Curriculum has been approved and ready for activation',
        nextActions: ['Activate', 'Edit', 'Archive']
      },
      'ACTIVE': {
        icon: Play,
        label: 'Active',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Curriculum is currently active and in use',
        nextActions: ['Suspend', 'Archive', 'Create New Version']
      },
      'SUSPENDED': {
        icon: Pause,
        label: 'Suspended',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'Curriculum is temporarily suspended',
        nextActions: ['Reactivate', 'Archive', 'Edit']
      },
      'ARCHIVED': {
        icon: Archive,
        label: 'Archived',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Curriculum has been archived and is no longer active',
        nextActions: ['View Only', 'Duplicate']
      },
      'DEPRECATED': {
        icon: AlertTriangle,
        label: 'Deprecated',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        description: 'Curriculum is deprecated and should not be used',
        nextActions: ['Archive', 'View Only']
      }
    };
    
    return configs[status as keyof typeof configs] || configs.DRAFT;
  };

  const getWorkflowSteps = () => {
    return [
      { key: 'DRAFT', label: 'Draft', order: 1 },
      { key: 'UNDER_REVIEW', label: 'Review', order: 2 },
      { key: 'APPROVED', label: 'Approved', order: 3 },
      { key: 'ACTIVE', label: 'Active', order: 4 }
    ];
  };

  const getCurrentStepOrder = (status: string) => {
    const step = getWorkflowSteps().find(s => s.key === status);
    return step?.order || 0;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const statusConfig = getStatusConfig(curriculum.status);
  const IconComponent = statusConfig.icon;
  const currentStepOrder = getCurrentStepOrder(curriculum.status);
  const workflowSteps = getWorkflowSteps();

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {/* Current Status */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border ${statusConfig.color}`}>
            <IconComponent className="w-4 h-4" />
            {statusConfig.label}
          </span>
          <span className="text-sm text-gray-600">{statusConfig.description}</span>
        </div>

        {/* Workflow Progress */}
        <div className="flex items-center gap-2">
          {workflowSteps.map((step, index) => {
            const isCompleted = step.order < currentStepOrder;
            const isCurrent = step.key === curriculum.status;
            const isUpcoming = step.order > currentStepOrder;

            return (
              <React.Fragment key={step.key}>
                <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${
                  isCompleted ? 'bg-green-100 text-green-800' :
                  isCurrent ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {isCompleted && <CheckCircle className="w-3 h-3" />}
                  {isCurrent && <Clock className="w-3 h-3" />}
                  {step.label}
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Next Actions */}
        {showNextActions && statusConfig.nextActions.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-600">Next actions: </span>
            <span className="text-gray-900">{statusConfig.nextActions.join(', ')}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusConfig.color.replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', '')}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workflow Status</h3>
              <p className="text-sm text-gray-600">{statusConfig.description}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Workflow Timeline */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Workflow Progress</h4>
          <div className="space-y-3">
            {workflowSteps.map((step, index) => {
              const isCompleted = step.order < currentStepOrder;
              const isCurrent = step.key === curriculum.status;
              const isUpcoming = step.order > currentStepOrder;

              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100 text-green-600' :
                    isCurrent ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{step.order}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-gray-600 mt-1">Current stage</div>
                    )}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-px h-8 ${
                      isCompleted ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Status Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">{formatDate(curriculum.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Modified:</span>
                <span className="text-gray-900">{formatDate(curriculum.modifiedAt)}</span>
              </div>
              {curriculum.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved:</span>
                  <span className="text-gray-900">{formatDate(curriculum.approvedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">People Involved</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">Created by:</span>
                <span className="text-gray-900">{curriculum.createdByName || 'Unknown'}</span>
              </div>
              {curriculum.approvedByName && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600">Approved by:</span>
                  <span className="text-gray-900">{curriculum.approvedByName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Actions */}
        {showNextActions && statusConfig.nextActions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Available Actions</h4>
            <div className="flex flex-wrap gap-2">
              {statusConfig.nextActions.map((action) => (
                <span
                  key={action}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                >
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default CurriculumWorkflowStatus; 