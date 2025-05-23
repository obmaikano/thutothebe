import React, { lazy, Suspense } from 'react';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

// Lazy load modal components
const AddUserModal = lazy(() => import('../../admin/modals/AddUserModal').then(m => ({ default: m.AddUserModal })));
const AssignSchoolAdminModal = lazy(() => import('../../admin/modals/AssignSchoolAdminModal').then(m => ({ default: m.AssignSchoolAdminModal })));
const ConfirmationModal = lazy(() => import('../../admin/modals/ConfirmationModal').then(m => ({ default: m.ConfirmationModal })));

interface ModalContentSwitchProps {
  content: string;
  contentProps?: any;
}

export const ModalContentSwitch: React.FC<ModalContentSwitchProps> = ({ content, contentProps }) => {
  // Fallback UI for Suspense
  const fallback = <div className="flex justify-center items-center p-4">Loading...</div>;
  
  // Render the appropriate component based on content type
  switch (content) {
    case MODAL_BODY_TYPES.USER_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <AddUserModal extraObject={contentProps} />
        </Suspense>
      );
      
    case MODAL_BODY_TYPES.SCHOOL_ASSIGN_ADMIN:
      return (
        <Suspense fallback={fallback}>
          <AssignSchoolAdminModal extraObject={contentProps} />
        </Suspense>
      );
      
    case MODAL_BODY_TYPES.CONFIRMATION:
    case MODAL_BODY_TYPES.USER_DELETE_CONFIRMATION:
    case MODAL_BODY_TYPES.SCHOOL_DELETE_CONFIRMATION:
    case MODAL_BODY_TYPES.REGION_DELETE_CONFIRMATION:
    case MODAL_BODY_TYPES.ROLE_DELETE_CONFIRMATION:
    case MODAL_BODY_TYPES.COURSE_DELETE_CONFIRMATION:
    case MODAL_BODY_TYPES.SYSTEM_RULE_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <ConfirmationModal extraObject={contentProps} />
        </Suspense>
      );
      
    default:
      return <div>No content found for type: {content}</div>;
  }
}; 