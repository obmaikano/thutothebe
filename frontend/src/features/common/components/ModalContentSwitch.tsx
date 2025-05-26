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

// Student management modals
const CreateStudentModal = lazy(() => import('../../students/modals/CreateStudentModal'));
const EditStudentModal = lazy(() => import('../../students/modals/EditStudentModal'));
const DeleteStudentModal = lazy(() => import('../../students/modals/DeleteStudentModal'));
const UpdateProgressModal = lazy(() => import('../../students/modals/UpdateProgressModal'));

// Parent management modals
const CreateParentModal = lazy(() => import('../../parents/modals/CreateParentModal'));
const EditParentModal = lazy(() => import('../../parents/modals/EditParentModal'));
const DeleteParentModal = lazy(() => import('../../parents/modals/DeleteParentModal'));
const LinkChildModal = lazy(() => import('../../parents/modals/LinkChildModal'));

// Teacher management modals
const CreateTeacherModal = lazy(() => import('../../teachers/modals/CreateTeacherModal'));
const EditTeacherModal = lazy(() => import('../../teachers/modals/EditTeacherModal'));
const DeleteTeacherModal = lazy(() => import('../../teachers/modals/DeleteTeacherModal'));
const TeacherViewDetailsModal = lazy(() => import('../../teachers/modals/TeacherViewDetailsModal'));

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

    // Student Management Modals
    case MODAL_BODY_TYPES.STUDENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateStudentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.STUDENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditStudentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.STUDENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteStudentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.UPDATE_STUDENT_PROGRESS:
      return (
        <Suspense fallback={fallback}>
          <UpdateProgressModal extraObject={contentProps} />
        </Suspense>
      );

    // Parent Management Modals
    case MODAL_BODY_TYPES.PARENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateParentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.PARENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditParentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.PARENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteParentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.PARENT_LINK_CHILD:
      return (
        <Suspense fallback={fallback}>
          <LinkChildModal extraObject={contentProps} />
        </Suspense>
      );

    // Teacher Management Modals
    case MODAL_BODY_TYPES.TEACHER_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateTeacherModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.TEACHER_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditTeacherModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.TEACHER_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteTeacherModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.TEACHER_VIEW_DETAILS:
      return (
        <Suspense fallback={fallback}>
          <TeacherViewDetailsModal extraObject={contentProps} />
        </Suspense>
      );
      
    default:
      return <div>No content found for type: {content}</div>;
  }
}; 