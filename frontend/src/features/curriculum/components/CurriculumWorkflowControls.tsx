import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  approveCurriculum, 
  activateCurriculum, 
  suspendCurriculum, 
  archiveCurriculum,
  deleteCurriculum,
  submitCurriculumForReview
} from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  Archive, 
  Trash2, 
  Edit, 
  Eye, 
  Copy,
  Send,
  RotateCcw,
  AlertTriangle,
  Clock,
  FileText,
  Settings
} from 'lucide-react';

interface CurriculumWorkflowControlsProps {
  curriculum: Curriculum;
  variant?: 'compact' | 'expanded' | 'dropdown';
  showLabels?: boolean;
  onAction?: (action: string, curriculum: Curriculum) => void;
}

const CurriculumWorkflowControls: React.FC<CurriculumWorkflowControlsProps> = ({
  curriculum,
  variant = 'compact',
  showLabels = false,
  onAction
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Permission checks
  const canEdit = user && (
    curriculum.createdById === user.id ||
    ['MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(user.role)
  );

  const canApprove = user && [
    'MINISTRY_EXECUTIVE',
    'DIRECTOR', 
    'REGIONAL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const canManageStatus = user && [
    'MINISTRY_EXECUTIVE',
    'REGIONAL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const canDelete = user && (
    curriculum.createdById === user.id ||
    ['SUPER_ADMIN'].includes(user.role)
  );

  // Action handlers
  const handleView = () => {
    dispatch(openModal({
      title: 'View Curriculum Details',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_VIEW,
      extraObject: { curriculum },
      size: 'lg'
    }));
    onAction?.('view', curriculum);
  };

  const handleEdit = () => {
    dispatch(openModal({
      title: 'Edit Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_EDIT,
      extraObject: { curriculum },
      size: 'lg'
    }));
    onAction?.('edit', curriculum);
  };

  const handleSubmitForReview = async () => {
    try {
      setIsLoading('submit');
      await dispatch(submitCurriculumForReview(curriculum.id)).unwrap();
      onAction?.('submit', curriculum);
    } catch (error) {
      console.error('Failed to submit for review:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleApprove = () => {
    dispatch(openModal({
      title: 'Approve Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_APPROVE,
      extraObject: { curriculum },
      size: 'lg'
    }));
    onAction?.('approve', curriculum);
  };

  const handleReject = () => {
    dispatch(openModal({
      title: 'Reject Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_REJECT,
      extraObject: { curriculum },
      size: 'lg'
    }));
    onAction?.('reject', curriculum);
  };

  const handleActivate = async () => {
    try {
      setIsLoading('activate');
      await dispatch(activateCurriculum(curriculum.id)).unwrap();
      onAction?.('activate', curriculum);
    } catch (error) {
      console.error('Failed to activate curriculum:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleSuspend = async () => {
    try {
      setIsLoading('suspend');
      await dispatch(suspendCurriculum(curriculum.id)).unwrap();
      onAction?.('suspend', curriculum);
    } catch (error) {
      console.error('Failed to suspend curriculum:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleArchive = async () => {
    try {
      setIsLoading('archive');
      await dispatch(archiveCurriculum(curriculum.id)).unwrap();
      onAction?.('archive', curriculum);
    } catch (error) {
      console.error('Failed to archive curriculum:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDuplicate = () => {
    dispatch(openModal({
      title: 'Duplicate Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DUPLICATE,
      extraObject: { curriculum },
      size: 'lg'
    }));
    onAction?.('duplicate', curriculum);
  };

  const handleDelete = () => {
    dispatch(openModal({
      title: 'Delete Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION,
      extraObject: { curriculum }
    }));
    onAction?.('delete', curriculum);
  };

  // Get available actions based on current status and permissions
  const getAvailableActions = () => {
    const actions = [];

    // Always available actions
    actions.push({
      key: 'view',
      label: 'View Details',
      icon: Eye,
      handler: handleView,
      variant: 'secondary' as const,
      available: true
    });

    // Status-specific actions
    switch (curriculum.status) {
      case 'DRAFT':
        if (canEdit) {
          actions.push({
            key: 'edit',
            label: 'Edit',
            icon: Edit,
            handler: handleEdit,
            variant: 'primary' as const,
            available: true
          });
          actions.push({
            key: 'submit',
            label: 'Submit for Review',
            icon: Send,
            handler: handleSubmitForReview,
            variant: 'success' as const,
            available: true
          });
        }
        break;

      case 'UNDER_REVIEW':
        if (canApprove) {
          actions.push({
            key: 'approve',
            label: 'Approve',
            icon: CheckCircle,
            handler: handleApprove,
            variant: 'success' as const,
            available: true
          });
          actions.push({
            key: 'reject',
            label: 'Reject',
            icon: XCircle,
            handler: handleReject,
            variant: 'danger' as const,
            available: true
          });
        }
        break;

      case 'APPROVED':
        if (canManageStatus) {
          actions.push({
            key: 'activate',
            label: 'Activate',
            icon: Play,
            handler: handleActivate,
            variant: 'success' as const,
            available: true
          });
        }
        if (canEdit) {
          actions.push({
            key: 'edit',
            label: 'Edit',
            icon: Edit,
            handler: handleEdit,
            variant: 'primary' as const,
            available: true
          });
        }
        break;

      case 'ACTIVE':
        if (canManageStatus) {
          actions.push({
            key: 'suspend',
            label: 'Suspend',
            icon: Pause,
            handler: handleSuspend,
            variant: 'warning' as const,
            available: true
          });
          actions.push({
            key: 'archive',
            label: 'Archive',
            icon: Archive,
            handler: handleArchive,
            variant: 'secondary' as const,
            available: true
          });
        }
        break;

      case 'SUSPENDED':
        if (canManageStatus) {
          actions.push({
            key: 'activate',
            label: 'Reactivate',
            icon: Play,
            handler: handleActivate,
            variant: 'success' as const,
            available: true
          });
          actions.push({
            key: 'archive',
            label: 'Archive',
            icon: Archive,
            handler: handleArchive,
            variant: 'secondary' as const,
            available: true
          });
        }
        break;

      case 'ARCHIVED':
        // Limited actions for archived curricula
        break;
    }

    // Always available utility actions
    actions.push({
      key: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      handler: handleDuplicate,
      variant: 'secondary' as const,
      available: true
    });

    // Delete action (restricted)
    if (canDelete && ['DRAFT', 'SUSPENDED'].includes(curriculum.status)) {
      actions.push({
        key: 'delete',
        label: 'Delete',
        icon: Trash2,
        handler: handleDelete,
        variant: 'danger' as const,
        available: true
      });
    }

    return actions.filter(action => action.available);
  };

  const getButtonVariant = (variant: string) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white border border-gray-300'
    };
    return variants[variant as keyof typeof variants] || variants.secondary;
  };

  const getIconButtonVariant = (variant: string) => {
    const variants = {
      primary: 'text-blue-600 hover:bg-blue-50',
      success: 'text-green-600 hover:bg-green-50',
      warning: 'text-yellow-600 hover:bg-yellow-50',
      danger: 'text-red-600 hover:bg-red-50',
      secondary: 'text-gray-600 hover:bg-gray-50'
    };
    return variants[variant as keyof typeof variants] || variants.secondary;
  };

  const availableActions = getAvailableActions();

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {availableActions.slice(0, 3).map((action) => {
          const IconComponent = action.icon;
          const isActionLoading = isLoading === action.key;
          
          return (
            <button
              key={action.key}
              onClick={action.handler}
              disabled={isActionLoading}
              className={`p-2 rounded-lg transition-colors ${getIconButtonVariant(action.variant)}`}
              title={action.label}
            >
              {isActionLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <IconComponent className="w-4 h-4" />
              )}
            </button>
          );
        })}
        
        {availableActions.length > 3 && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="More actions"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {availableActions.slice(3).map((action) => {
                    const IconComponent = action.icon;
                    const isActionLoading = isLoading === action.key;
                    
                    return (
                      <button
                        key={action.key}
                        onClick={() => {
                          setShowDropdown(false);
                          action.handler();
                        }}
                        disabled={isActionLoading}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        {isActionLoading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => {
          const IconComponent = action.icon;
          const isActionLoading = isLoading === action.key;
          
          return (
            <button
              key={action.key}
              onClick={action.handler}
              disabled={isActionLoading}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${getButtonVariant(action.variant)}`}
            >
              {isActionLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <IconComponent className="w-4 h-4" />
              )}
              {showLabels && action.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Actions
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="py-1">
              {availableActions.map((action) => {
                const IconComponent = action.icon;
                const isActionLoading = isLoading === action.key;
                
                return (
                  <button
                    key={action.key}
                    onClick={() => {
                      setShowDropdown(false);
                      action.handler();
                    }}
                    disabled={isActionLoading}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    {isActionLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default CurriculumWorkflowControls; 