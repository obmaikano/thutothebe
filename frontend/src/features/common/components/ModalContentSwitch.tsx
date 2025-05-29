import React, { lazy, Suspense } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../modalSlice';
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
const AssignCourseModal = lazy(() => import('../../teachers/modals/AssignCourseModal'));
const AssignClassModal = lazy(() => import('../../teachers/modals/AssignClassModal'));

// Announcement management modals
const CreateAnnouncementModal = lazy(() => import('../../announcements/modals/CreateAnnouncementModal'));
const EditAnnouncementModal = lazy(() => import('../../announcements/modals/EditAnnouncementModal'));
const DeleteAnnouncementModal = lazy(() => import('../../announcements/modals/DeleteAnnouncementModal'));
const AnnouncementDetailsModal = lazy(() => import('../../announcements/modals/AnnouncementDetailsModal'));
const AnnouncementAnalyticsModal = lazy(() => import('../../announcements/modals/AnnouncementAnalyticsModal'));

// Schedule management modals
const ScheduleAddNewModal = lazy(() => import('../../school_admin/modals/ScheduleAddNewModal'));
const ScheduleEditModal = lazy(() => import('../../school_admin/modals/ScheduleEditModal'));
const ScheduleDeleteModal = lazy(() => import('../../school_admin/modals/ScheduleDeleteModal'));
const ScheduleViewModal = lazy(() => import('../../school_admin/modals/ScheduleViewModal'));

// Assessment management modals
const GradeCategoryAddNewModal = lazy(() => import('../../school_admin/modals/GradeCategoryAddNewModal'));
const AssignmentAddNewModal = lazy(() => import('../../school_admin/modals/AssignmentAddNewModal'));
const SubjectAssignTeacherModal = lazy(() => import('../../school_admin/modals/SubjectAssignTeacherModal'));

// Assignment and Submission modals
const AssignmentFormModal = lazy(() => import('../../assignments/modals/AssignmentFormModal'));
const SubmissionGradeModal = lazy(() => import('../../assignments/modals/SubmissionGradeModal'));

// Quiz Management Modals
const CreateQuizModal = lazy(() => import('../../quizzes/modals/CreateQuizModal'));
const EditQuizModal = lazy(() => import('../../quizzes/modals/EditQuizModal'));
const DeleteQuizModal = lazy(() => import('../../quizzes/modals/DeleteQuizModal'));

interface ModalContentSwitchProps {
  content: string;
  contentProps?: any;
}

export const ModalContentSwitch: React.FC<ModalContentSwitchProps> = ({ content, contentProps }) => {
  const dispatch = useAppDispatch();
  
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
          <AssignClassModal extraObject={contentProps} />
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

    // Announcement Management Modals
    case MODAL_BODY_TYPES.ANNOUNCEMENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateAnnouncementModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ANNOUNCEMENT_VIEW_DETAILS:
      return (
        <Suspense fallback={fallback}>
          <AnnouncementDetailsModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ANNOUNCEMENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditAnnouncementModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ANNOUNCEMENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteAnnouncementModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ANNOUNCEMENT_ANALYTICS:
      return (
        <Suspense fallback={fallback}>
          <AnnouncementAnalyticsModal extraObject={contentProps} />
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

    case MODAL_BODY_TYPES.TEACHER_ASSIGN_COURSE:
      return (
        <Suspense fallback={fallback}>
          <AssignCourseModal extraObject={contentProps} />
        </Suspense>
      );

    // Schedule Management Modals
    case MODAL_BODY_TYPES.SCHEDULE_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <ScheduleAddNewModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SCHEDULE_EDIT:
      return (
        <Suspense fallback={fallback}>
          <ScheduleEditModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SCHEDULE_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <ScheduleDeleteModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SCHEDULE_VIEW:
      return (
        <Suspense fallback={fallback}>
          <ScheduleViewModal extraObject={contentProps} />
        </Suspense>
      );

    // Assessment Management Modals
    case MODAL_BODY_TYPES.GRADE_CATEGORY_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <GradeCategoryAddNewModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ASSIGNMENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <AssignmentFormModal assignment={contentProps} mode="create" />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ASSIGNMENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <AssignmentFormModal assignment={contentProps} mode="edit" />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ASSIGNMENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Assignment</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this assignment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => dispatch(closeModal({}))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Handle delete logic here
                  dispatch(closeModal({}));
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Suspense>
      );

    case MODAL_BODY_TYPES.ASSIGNMENT_VIEW_DETAILS:
      return (
        <Suspense fallback={fallback}>
          <div className="max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h3>
            {contentProps && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {contentProps.dueDate ? new Date(contentProps.dueDate).toLocaleDateString() : 'No due date'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.status}</p>
                </div>
              </div>
            )}
          </div>
        </Suspense>
      );

    case MODAL_BODY_TYPES.ASSIGNMENT_VIEW_SUBMISSIONS:
      return (
        <Suspense fallback={fallback}>
          <div className="max-w-4xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Submissions</h3>
            <p className="text-sm text-gray-500">
              Submissions for: {contentProps?.title || 'Assignment'}
            </p>
            {/* This would contain a list of submissions */}
          </div>
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBMISSION_GRADE:
      return (
        <Suspense fallback={fallback}>
          <SubmissionGradeModal submission={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBMISSION_VIEW_DETAILS:
      return (
        <Suspense fallback={fallback}>
          <div className="max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Details</h3>
            {contentProps && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.studentId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assignment ID</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.assignmentId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.content || 'No content'}</p>
                </div>
                {contentProps.feedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Feedback</label>
                    <p className="mt-1 text-sm text-gray-900">{contentProps.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBMISSION_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Submission</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => dispatch(closeModal({}))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Handle delete logic here
                  dispatch(closeModal({}));
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBJECT_ASSIGN_TEACHER:
      return (
        <Suspense fallback={fallback}>
          <SubjectAssignTeacherModal extraObject={contentProps} />
        </Suspense>
      );

    // Quiz Management Modals
    case MODAL_BODY_TYPES.QUIZ_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateQuizModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.QUIZ_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditQuizModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.QUIZ_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteQuizModal extraObject={contentProps} />
        </Suspense>
      );
      
    default:
      return <div>No content found for type: {content}</div>;
  }
}; 