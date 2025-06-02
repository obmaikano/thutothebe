import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Department } from '../../../api/services/departmentApi';
import { activateDepartment, deactivateDepartment } from '../departmentsSlice';
import { 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  UserCheck, 
  Eye, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  Settings,
  Copy,
  Archive
} from 'lucide-react';

interface DepartmentWorkflowControlsProps {
  department: Department;
  userRole: string;
  variant?: 'compact' | 'expanded' | 'dropdown';
  showLabels?: boolean;
  onAction?: (action: string, department: Department) => void;
}

const DepartmentWorkflowControls: React.FC<DepartmentWorkflowControlsProps> = ({ 
  department, 
  userRole,
  variant = 'compact',
  showLabels = false,
  onAction
}) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.departments);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Permission checks
  const canEdit = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(userRole);
  const canDelete = ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(userRole);
  const canManageAssignments = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(userRole);
  const canActivateDeactivate = ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(userRole);

  // Action handlers
  const handleView = () => {
    dispatch(openModal({
      title: 'View Department Details',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_VIEW,
      extraObject: department,
      size: 'lg'
    }));
    onAction?.('view', department);
  };

  const handleEdit = () => {
    dispatch(openModal({
      title: 'Edit Department',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_EDIT,
      extraObject: department,
      size: 'lg'
    }));
    onAction?.('edit', department);
  };

  const handleDelete = () => {
    dispatch(openModal({
      title: 'Delete Department',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_DELETE_CONFIRMATION,
      extraObject: department,
      size: 'md'
    }));
    onAction?.('delete', department);
  };

  const handleAssignHead = () => {
    dispatch(openModal({
      title: 'Assign Department Head',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_HEAD,
      extraObject: department,
      size: 'lg'
    }));
    onAction?.('assign_head', department);
  };

  const handleAssignTeacher = () => {
    dispatch(openModal({
      title: 'Manage Teachers',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_TEACHER,
      extraObject: department,
      size: 'lg'
    }));
    onAction?.('assign_teacher', department);
  };

  const handleAssignSubject = () => {
    dispatch(openModal({
      title: 'Manage Subjects',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_SUBJECT,
      extraObject: department,
      size: 'lg'
    }));
    onAction?.('assign_subject', department);
  };

  const handleActivate = async () => {
    try {
      setIsLoading('activate');
      await dispatch(activateDepartment(department.id)).unwrap();
      onAction?.('activate', department);
    } catch (error) {
      console.error('Failed to activate department:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeactivate = async () => {
    try {
      setIsLoading('deactivate');
      await dispatch(deactivateDepartment(department.id)).unwrap();
      onAction?.('deactivate', department);
    } catch (error) {
      console.error('Failed to deactivate department:', error);
    } finally {
      setIsLoading(null);
    }
  };

  // Get available actions based on permissions and department status
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

    // Edit action
    if (canEdit) {
      actions.push({
        key: 'edit',
        label: 'Edit Department',
        icon: Edit,
        handler: handleEdit,
        variant: 'primary' as const,
        available: true
      });
    }

    // Assignment actions
    if (canManageAssignments) {
      actions.push({
        key: 'assign_head',
        label: 'Assign Head',
        icon: UserCheck,
        handler: handleAssignHead,
        variant: 'secondary' as const,
        available: true
      });

      actions.push({
        key: 'assign_teacher',
        label: 'Manage Teachers',
        icon: Users,
        handler: handleAssignTeacher,
        variant: 'secondary' as const,
        available: true
      });

      actions.push({
        key: 'assign_subject',
        label: 'Manage Subjects',
        icon: BookOpen,
        handler: handleAssignSubject,
        variant: 'secondary' as const,
        available: true
      });
    }

    // Status actions
    if (canActivateDeactivate) {
      if (department.active) {
        actions.push({
          key: 'deactivate',
          label: 'Deactivate',
          icon: XCircle,
          handler: handleDeactivate,
          variant: 'warning' as const,
          available: true
        });
      } else {
        actions.push({
          key: 'activate',
          label: 'Activate',
          icon: CheckCircle,
          handler: handleActivate,
          variant: 'success' as const,
          available: true
        });
      }
    }

    // Delete action
    if (canDelete) {
      actions.push({
        key: 'delete',
        label: 'Delete Department',
        icon: Trash2,
        handler: handleDelete,
        variant: 'danger' as const,
        available: true
      });
    }

    return actions.filter(action => action.available);
  };

  const availableActions = getAvailableActions();

  // Get button styling based on variant
  const getButtonVariant = (actionVariant: string) => {
    const variants = {
      primary: 'text-blue-600 hover:text-blue-700',
      secondary: 'text-gray-600 hover:text-gray-700',
      success: 'text-green-600 hover:text-green-700',
      warning: 'text-orange-600 hover:text-orange-700',
      danger: 'text-red-600 hover:text-red-700'
    };
    return variants[actionVariant as keyof typeof variants] || variants.secondary;
  };

  const getIconButtonVariant = (actionVariant: string) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-ghost',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-error'
    };
    return variants[actionVariant as keyof typeof variants] || variants.secondary;
  };

  if (variant === 'dropdown') {
    return (
      <div className="dropdown dropdown-end">
        <button
          tabIndex={0}
          className="btn btn-ghost btn-sm"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreHorizontal size={16} />
        </button>
        {showDropdown && (
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {availableActions.map((action) => (
              <li key={action.key}>
                <button
                  onClick={() => {
                    action.handler();
                    setShowDropdown(false);
                  }}
                  disabled={isLoading === action.key}
                  className="text-sm flex items-center gap-2"
                >
                  <action.icon size={14} />
                  {action.label}
                  {isLoading === action.key && (
                    <span className="loading loading-spinner loading-xs ml-auto"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className="flex flex-wrap gap-2">
        {availableActions.map((action) => (
          <button
            key={action.key}
            onClick={action.handler}
            disabled={isLoading === action.key}
            className={`btn btn-sm ${getIconButtonVariant(action.variant)} flex items-center gap-2`}
          >
            <action.icon size={14} />
            {showLabels && action.label}
            {isLoading === action.key && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Compact variant (default)
  return (
    <div className="flex items-center gap-1">
      {/* Primary actions (first 4) */}
      {availableActions.slice(0, 4).map((action) => (
        <button
          key={action.key}
          onClick={action.handler}
          disabled={isLoading === action.key}
          className={`btn btn-ghost btn-sm ${getButtonVariant(action.variant)}`}
          title={action.label}
        >
          <action.icon size={16} />
          {isLoading === action.key && (
            <span className="loading loading-spinner loading-xs ml-1"></span>
          )}
        </button>
      ))}

      {/* More actions dropdown if there are more than 4 actions */}
      {availableActions.length > 4 && (
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-sm"
            title="More Actions"
          >
            <MoreHorizontal size={16} />
          </button>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {availableActions.slice(4).map((action) => (
              <li key={action.key}>
                <button
                  onClick={action.handler}
                  disabled={isLoading === action.key}
                  className="text-sm flex items-center gap-2"
                >
                  <action.icon size={14} />
                  {action.label}
                  {isLoading === action.key && (
                    <span className="loading loading-spinner loading-xs ml-auto"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DepartmentWorkflowControls; 