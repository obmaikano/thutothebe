import React, { lazy, Suspense } from 'react';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

// Subject management modals
const CreateSubjectModal = lazy(() => import('../../subjects/modals/CreateSubjectModal'));
const EditSubjectModal = lazy(() => import('../../subjects/modals/EditSubjectModal'));
const DeleteSubjectModal = lazy(() => import('../../subjects/modals/DeleteSubjectModal'));

// School management modals
const CreateSchoolModal = lazy(() => import('../../schools/modals/CreateSchoolModal'));
const EditSchoolModal = lazy(() => import('../../schools/modals/EditSchoolModal'));
const DeleteSchoolModal = lazy(() => import('../../schools/modals/DeleteSchoolModal'));

// Region management modals
const CreateRegionModal = lazy(() => import('../../regions/modals/CreateRegionModal'));
const EditRegionModal = lazy(() => import('../../regions/modals/EditRegionModal'));
const DeleteRegionModal = lazy(() => import('../../regions/modals/DeleteRegionModal'));

// User management modals
const CreateUserModal = lazy(() => import('../../users/modals/CreateUserModal'));
const EditUserModal = lazy(() => import('../../users/modals/EditUserModal'));
const DeleteUserModal = lazy(() => import('../../users/modals/DeleteUserModal'));

// Course management modals
const CreateCourseModal = lazy(() => import('../../courses/modals/CreateCourseModal'));
const EditCourseModal = lazy(() => import('../../courses/modals/EditCourseModal'));
const DeleteCourseModal = lazy(() => import('../../courses/modals/DeleteCourseModal'));
const CourseViewModal = lazy(() => import('../../courses/modals/CourseViewModal'));

// Class management modals
const CreateClassModal = lazy(() => import('../../classes/modals/CreateClassModal'));
const EditClassModal = lazy(() => import('../../classes/modals/EditClassModal'));
const DeleteClassModal = lazy(() => import('../../classes/modals/DeleteClassModal'));
const ClassViewModal = lazy(() => import('../../classes/modals/ClassViewModal'));
const StudentAssignClassModal = lazy(() => import('../../classes/modals/StudentAssignClassModal'));
const TeacherAssignClassModal = lazy(() => import('../../classes/modals/TeacherAssignClassModal'));
const TakeAttendanceModal = lazy(() => import('../../classes/modals/TakeAttendanceModal'));
const GenerateReportModal = lazy(() => import('../../classes/modals/GenerateReportModal'));
const CalendarViewModal = lazy(() => import('../../classes/modals/CalendarViewModal'));

interface ModalContentSwitchProps {
  content: string;
  contentProps?: any;
}

export const ModalContentSwitch: React.FC<ModalContentSwitchProps> = ({ content, contentProps }) => {
  // Fallback UI for Suspense
  const fallback = <div className="flex justify-center items-center p-4">Loading...</div>;
  
  // Render the appropriate component based on content type
  switch (content) {
    // Subject Management Modals
    case MODAL_BODY_TYPES.SUBJECT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateSubjectModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBJECT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditSubjectModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBJECT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteSubjectModal extraObject={contentProps} />
        </Suspense>
      );

    // School Management Modals
    case MODAL_BODY_TYPES.SCHOOL_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateSchoolModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SCHOOL_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditSchoolModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SCHOOL_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteSchoolModal extraObject={contentProps} />
        </Suspense>
      );

    // Region Management Modals
    case MODAL_BODY_TYPES.REGION_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateRegionModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.REGION_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditRegionModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.REGION_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteRegionModal extraObject={contentProps} />
        </Suspense>
      );

    // User Management Modals
    case MODAL_BODY_TYPES.USER_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateUserModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.USER_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditUserModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.USER_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteUserModal extraObject={contentProps} />
        </Suspense>
      );

    // Course Management Modals
    case MODAL_BODY_TYPES.COURSE_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateCourseModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.COURSE_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditCourseModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.COURSE_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteCourseModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.COURSE_VIEW:
      return (
        <Suspense fallback={fallback}>
          <CourseViewModal extraObject={contentProps} />
        </Suspense>
      );

    // Class Management Modals
    case MODAL_BODY_TYPES.CLASS_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateClassModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CLASS_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditClassModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CLASS_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteClassModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CLASS_VIEW:
      return (
        <Suspense fallback={fallback}>
          <ClassViewModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.STUDENT_ASSIGN_CLASS:
      return (
        <Suspense fallback={fallback}>
          <StudentAssignClassModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS:
      return (
        <Suspense fallback={fallback}>
          <TeacherAssignClassModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ATTENDANCE_TAKE:
      return (
        <Suspense fallback={fallback}>
          <TakeAttendanceModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.REPORT_GENERATE:
      return (
        <Suspense fallback={fallback}>
          <GenerateReportModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CALENDAR_VIEW:
      return (
        <Suspense fallback={fallback}>
          <CalendarViewModal extraObject={contentProps} />
        </Suspense>
      );
      
    default:
      return <div>No content found for type: {content}</div>;
  }
}; 