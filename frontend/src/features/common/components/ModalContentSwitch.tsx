import React, { lazy, Suspense } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

// Subject management modals
const CreateSubjectModal = lazy(() => import('../../subjects/modals/CreateSubjectModal'));
const EditSubjectModal = lazy(() => import('../../subjects/modals/EditSubjectModal'));
const DeleteSubjectModal = lazy(() => import('../../subjects/modals/DeleteSubjectModal'));

// Department management modals
const CreateDepartmentModal = lazy(() => import('../../departments/modals/CreateDepartmentModal'));
const EditDepartmentModal = lazy(() => import('../../departments/modals/EditDepartmentModal'));
const DeleteDepartmentModal = lazy(() => import('../../departments/modals/DeleteDepartmentModal'));
const ViewDepartmentModal = lazy(() => import('../../departments/modals/ViewDepartmentModal'));
const AssignDepartmentHeadModal = lazy(() => import('../../departments/modals/AssignDepartmentHeadModal'));
const AssignTeacherModal = lazy(() => import('../../departments/modals/AssignTeacherModal'));
const AssignSubjectModal = lazy(() => import('../../departments/modals/AssignSubjectModal'));

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

// Curriculum management modals
const CreateCurriculumModal = lazy(() => import('../../curriculum/modals/CreateCurriculumModal'));
const EditCurriculumModal = lazy(() => import('../../curriculum/modals/EditCurriculumModal'));
const DeleteCurriculumModal = lazy(() => import('../../curriculum/modals/DeleteCurriculumModal'));
const ViewCurriculumModal = lazy(() => import('../../curriculum/modals/ViewCurriculumModal'));
const ApproveCurriculumModal = lazy(() => import('../../curriculum/modals/ApproveCurriculumModal'));
const RejectCurriculumModal = lazy(() => import('../../curriculum/modals/RejectCurriculumModal'));
const DuplicateCurriculumModal = lazy(() => import('../../curriculum/modals/DuplicateCurriculumModal'));

// Content management modals
const CreateContentModal = lazy(() => import('../../content/modals/CreateContentModal'));
const EditContentModal = lazy(() => import('../../content/modals/EditContentModal'));
const ViewContentModal = lazy(() => import('../../content/modals/ViewContentModal'));
const DeleteContentModal = lazy(() => import('../../content/modals/DeleteContentModal'));

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

// Announcement management modals
const CreateAnnouncementModal = lazy(() => import('../../announcements/modals/CreateAnnouncementModal'));
const AnnouncementDetailsModal = lazy(() => import('../../announcements/modals/AnnouncementDetailsModal'));
const EditAnnouncementModal = lazy(() => import('../../announcements/modals/EditAnnouncementModal'));
const DeleteAnnouncementModal = lazy(() => import('../../announcements/modals/DeleteAnnouncementModal'));
const AnnouncementAnalyticsModal = lazy(() => import('../../announcements/modals/AnnouncementAnalyticsModal'));

// Teacher management modals
const CreateTeacherModal = lazy(() => import('../../teachers/modals/CreateTeacherModal'));
const EditTeacherModal = lazy(() => import('../../teachers/modals/EditTeacherModal'));
const DeleteTeacherModal = lazy(() => import('../../teachers/modals/DeleteTeacherModal'));
const TeacherViewDetailsModal = lazy(() => import('../../teachers/modals/TeacherViewDetailsModal'));
const AssignCourseModal = lazy(() => import('../../teachers/modals/AssignCourseModal'));
const AssignClassModal = lazy(() => import('../../teachers/modals/AssignClassModal'));

// Schedule management modals
// Removed non-existent schedule modals

// Assessment management modals
// Removed non-existent assessment modals
const AssignmentFormModal = lazy(() => import('../../assignments/modals/AssignmentFormModal'));
// Removed non-existent submission and subject assign teacher modals

// Quiz management modals
const CreateQuizModal = lazy(() => import('../../quizzes/modals/CreateQuizModal'));
const EditQuizModal = lazy(() => import('../../quizzes/modals/EditQuizModal'));
const DeleteQuizModal = lazy(() => import('../../quizzes/modals/DeleteQuizModal'));

// Attendance management modals
const MarkAttendanceModal = lazy(() => import('../../attendance/modals/MarkAttendanceModal'));
const BulkAttendanceModal = lazy(() => import('../../attendance/modals/BulkAttendanceModal'));
const AttendanceDetailsModal = lazy(() => import('../../attendance/modals/AttendanceDetailsModal'));

// Calendar Event management modals
const CreateEventModal = lazy(() => import('../../calendar/modals/CreateEventModal'));
const EditEventModal = lazy(() => import('../../calendar/modals/EditEventModal'));
const EventDetailsModal = lazy(() => import('../../calendar/modals/EventDetailsModal'));
const DeleteEventModal = lazy(() => import('../../calendar/modals/DeleteEventModal'));
const AddAttendeeModal = lazy(() => import('../../calendar/modals/AddAttendeeModal'));

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

    // Department Management Modals
    case MODAL_BODY_TYPES.DEPARTMENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateDepartmentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.DEPARTMENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditDepartmentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.DEPARTMENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteDepartmentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.DEPARTMENT_VIEW:
      return (
        <Suspense fallback={fallback}>
          <ViewDepartmentModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_HEAD:
      return (
        <Suspense fallback={fallback}>
          <AssignDepartmentHeadModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_TEACHER:
      return (
        <Suspense fallback={fallback}>
          <AssignTeacherModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_SUBJECT:
      return (
        <Suspense fallback={fallback}>
          <AssignSubjectModal extraObject={contentProps} />
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

    case MODAL_BODY_TYPES.CLASS_ASSIGN_STUDENT:
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

    case MODAL_BODY_TYPES.PARENT_ASSIGN_CHILD:
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

    case MODAL_BODY_TYPES.ANNOUNCEMENT_VIEW:
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

    case MODAL_BODY_TYPES.TEACHER_VIEW_PROFILE:
      return (
        <Suspense fallback={fallback}>
          <TeacherViewDetailsModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS:
      return (
        <Suspense fallback={fallback}>
          <AssignClassModal extraObject={contentProps} />
        </Suspense>
      );

    // Assignment Management Modals
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

    case MODAL_BODY_TYPES.ASSIGNMENT_VIEW:
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

    case MODAL_BODY_TYPES.SUBMISSION_GRADE:
      return (
        <Suspense fallback={fallback}>
          <div className="max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Submission</h3>
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
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <p className="mt-1 text-sm text-gray-900">{contentProps.content || 'No content'}</p>
                </div>
              </div>
            )}
          </div>
        </Suspense>
      );

    case MODAL_BODY_TYPES.SUBMISSION_VIEW:
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

    case MODAL_BODY_TYPES.SUBJECT_ASSIGN_TEACHER:
      return (
        <Suspense fallback={fallback}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Teacher to Subject</h3>
            <p className="text-sm text-gray-500 mb-6">
              This feature is not yet implemented.
            </p>
            <button
              type="button"
              onClick={() => dispatch(closeModal({}))}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
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

    // Attendance Management Modals
    case MODAL_BODY_TYPES.ATTENDANCE_MARK:
      return (
        <Suspense fallback={fallback}>
          <MarkAttendanceModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ATTENDANCE_EDIT:
      return (
        <Suspense fallback={fallback}>
          <MarkAttendanceModal extraObject={{ ...contentProps, mode: 'edit' }} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ATTENDANCE_BULK_MARK:
      return (
        <Suspense fallback={fallback}>
          <BulkAttendanceModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ATTENDANCE_BULK_UPDATE:
      return (
        <Suspense fallback={fallback}>
          <BulkAttendanceModal extraObject={{ ...contentProps, mode: 'update' }} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ATTENDANCE_VIEW_DETAILS:
      return (
        <Suspense fallback={fallback}>
          <AttendanceDetailsModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.ATTENDANCE_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Attendance Record</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this attendance record? This action cannot be undone.
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
      
    // Calendar Event Management Modals
    case MODAL_BODY_TYPES.CALENDAR_EVENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateEventModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CALENDAR_EVENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditEventModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CALENDAR_EVENT_VIEW:
      return (
        <Suspense fallback={fallback}>
          <EventDetailsModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CALENDAR_EVENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteEventModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CALENDAR_EVENT_ADD_ATTENDEE:
      return (
        <Suspense fallback={fallback}>
          <AddAttendeeModal extraObject={contentProps} />
        </Suspense>
      );
      
    // Content Management Modals
    case MODAL_BODY_TYPES.CONTENT_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateContentModal />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CONTENT_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditContentModal content={contentProps?.content} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CONTENT_VIEW:
      return (
        <Suspense fallback={fallback}>
          <ViewContentModal content={contentProps?.content} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CONTENT_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteContentModal content={contentProps?.content} />
        </Suspense>
      );
      
    // Curriculum Management Modals
    case MODAL_BODY_TYPES.CURRICULUM_ADD_NEW:
      return (
        <Suspense fallback={fallback}>
          <CreateCurriculumModal />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CURRICULUM_EDIT:
      return (
        <Suspense fallback={fallback}>
          <EditCurriculumModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION:
      return (
        <Suspense fallback={fallback}>
          <DeleteCurriculumModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CURRICULUM_VIEW:
      return (
        <Suspense fallback={fallback}>
          <ViewCurriculumModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CURRICULUM_APPROVE:
      return (
        <Suspense fallback={fallback}>
          <ApproveCurriculumModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CURRICULUM_REJECT:
      return (
        <Suspense fallback={fallback}>
          <RejectCurriculumModal extraObject={contentProps} />
        </Suspense>
      );

    case MODAL_BODY_TYPES.CURRICULUM_DUPLICATE:
      return (
        <Suspense fallback={fallback}>
          <DuplicateCurriculumModal extraObject={contentProps} />
        </Suspense>
      );
      
    default:
      return <div>No content found for type: {content}</div>;
  }
}; 