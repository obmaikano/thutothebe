import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Subjects = lazy(() => import('../pages/protected/Subjects'));
const SubjectDetail = lazy(() => import('../pages/protected/SubjectDetail'));
const Departments = lazy(() => import('../pages/protected/Departments'));
const DepartmentDetail = lazy(() => import('../pages/protected/DepartmentDetail'));
const Regions = lazy(() => import('../pages/protected/Regions'));
const RegionDetail = lazy(() => import('../pages/protected/RegionDetail'));
const Schools = lazy(() => import('../pages/protected/Schools'));
const Users = lazy(() => import('../pages/protected/Users'));
const Courses = lazy(() => import('../pages/protected/Courses'));
const CourseDetail = lazy(() => import('../pages/protected/CourseDetail'));
const Classes = lazy(() => import('../pages/protected/Classes'));
const ClassDetail = lazy(() => import('../pages/protected/ClassDetail'));
const Students = lazy(() => import('../pages/protected/Students'));
const StudentDetail = lazy(() => import('../pages/protected/StudentDetail'));
const Parents = lazy(() => import('../pages/protected/Parents'));
const ParentDetailsPage = lazy(() => import('../features/parents/pages/ParentDetailsPage'));
const TeacherStudents = lazy(() => import('../pages/protected/TeacherStudents'));
const TeacherCourses = lazy(() => import('../pages/protected/TeacherCourses'));
const TeacherClasses = lazy(() => import('../pages/protected/TeacherClasses'));
const TeacherAssignments = lazy(() => import('../pages/protected/TeacherAssignments'));
const TeacherResources = lazy(() => import('../pages/protected/TeacherResources'));
const TeacherSubmissions = lazy(() => import('../pages/protected/TeacherSubmissions'));

// Grade Management pages
const Grades = lazy(() => import('../pages/protected/Grades'));
const Gradebook = lazy(() => import('../pages/protected/Gradebook'));

// Content Management pages
const Content = lazy(() => import('../pages/protected/Content'));
const ContentDetail = lazy(() => import('../pages/protected/ContentDetail'));

// Curriculum Management pages
const Curriculum = lazy(() => import('../pages/protected/Curriculum'));
const CurriculumDetail = lazy(() => import('../pages/protected/CurriculumDetail'));
const CurriculumBuilder = lazy(() => import('../pages/protected/CurriculumBuilder'));
const CurriculumSubjectManagement = lazy(() => import('../pages/protected/CurriculumSubjectManagement'));
const StandardsManagement = lazy(() => import('../pages/protected/StandardsManagement'));
const LearningObjectives = lazy(() => import('../pages/protected/LearningObjectives'));
const CurriculumTemplates = lazy(() => import('../pages/protected/CurriculumTemplates'));
const CurriculumApproval = lazy(() => import('../pages/protected/CurriculumApproval'));
const CurriculumAnalytics = lazy(() => import('../pages/protected/CurriculumAnalytics'));
const CurriculumResources = lazy(() => import('../pages/protected/CurriculumResources'));
const CurriculumProgress = lazy(() => import('../pages/protected/CurriculumProgress'));

// Announcement pages
const Announcements = lazy(() => import('../pages/protected/Announcements'));
const MyAnnouncements = lazy(() => import('../pages/protected/MyAnnouncements'));
const AnnouncementDetails = lazy(() => import('../pages/protected/AnnouncementDetails'));

// Quiz Management pages
const Quizzes = lazy(() => import('../pages/protected/Quizzes'));
const QuizCreation = lazy(() => import('../pages/protected/QuizCreation'));
const QuizAnalytics = lazy(() => import('../pages/protected/QuizAnalytics'));
const QuizTakingPage = lazy(() => import('../features/quizzes/pages/QuizTakingPage'));
const QuizResultsPage = lazy(() => import('../features/quizzes/pages/QuizResultsPage'));

// Attendance pages
const AttendanceMarking = lazy(() => import('../pages/protected/AttendanceMarking'));
const AttendanceReports = lazy(() => import('../pages/protected/AttendanceReports'));
const AttendanceCalendar = lazy(() => import('../pages/protected/AttendanceCalendar'));
const MyAttendance = lazy(() => import('../pages/protected/MyAttendance'));
const ChildAttendance = lazy(() => import('../pages/protected/ChildAttendance'));

// Calendar pages
const Calendar = lazy(() => import('../pages/protected/Calendar'));

// Student role pages
const StudentDashboard = lazy(() => import('../pages/protected/StudentDashboard'));
const StudentCourses = lazy(() => import('../pages/protected/StudentCourses'));
const StudentAssignments = lazy(() => import('../pages/protected/StudentAssignments'));
const StudentGrades = lazy(() => import('../pages/protected/StudentGrades'));
const StudentMessages = lazy(() => import('../pages/protected/StudentMessages'));
const StudentSchedule = lazy(() => import('../pages/protected/StudentSchedule'));
const StudentHelp = lazy(() => import('../pages/protected/StudentHelp'));

// School Admin role pages
const SchoolAdminDashboard = lazy(() => import('../pages/protected/SchoolAdminDashboard'));
const StaffManagement = lazy(() => import('../pages/protected/StaffManagement'));
const StaffDetail = lazy(() => import('../pages/protected/StaffDetail'));
const StudentRecords = lazy(() => import('../pages/protected/StudentRecords'));
const ClassManagement = lazy(() => import('../pages/protected/ClassManagement'));
const SchoolReports = lazy(() => import('../pages/protected/SchoolReports'));
const SchoolSettings = lazy(() => import('../pages/protected/SchoolSettings'));
const SchoolAdminHelp = lazy(() => import('../pages/protected/SchoolAdminHelp'));

// Additional School Admin pages
const TimetableManagement = lazy(() => import('../pages/protected/TimetableManagement'));
const AssessmentConfiguration = lazy(() => import('../pages/protected/AssessmentConfiguration'));
const SubjectAllocation = lazy(() => import('../pages/protected/SubjectAllocation'));
const Facilities = lazy(() => import('../pages/protected/Facilities'));
const SchoolCalendar = lazy(() => import('../pages/protected/SchoolCalendar'));
const Documents = lazy(() => import('../pages/protected/Documents'));
const Monitoring = lazy(() => import('../pages/protected/Monitoring'));

const NotFoundPage = lazy(() => import('../pages/protected/404'));

// App routes - nested under /app path
export const appRoutes = [
  {
    path: 'dashboard',
    element: Dashboard
  },
  {
    path: 'subjects',
    element: Subjects
  },
  {
    path: 'subjects/:id',
    element: SubjectDetail
  },
  {
    path: 'departments',
    element: Departments
  },
  {
    path: 'departments/:id',
    element: DepartmentDetail
  },
  {
    path: 'regions',
    element: Regions
  },
  {
    path: 'regions/:id',
    element: RegionDetail
  },
  {
    path: 'schools',
    element: Schools
  },
  {
    path: 'users',
    element: Users
  },
  {
    path: 'courses',
    element: Courses
  },
  {
    path: 'courses/:id',
    element: CourseDetail
  },
  {
    path: 'classes',
    element: Classes
  },
  {
    path: 'classes/:id',
    element: ClassDetail
  },
  {
    path: 'students',
    element: Students
  },
  {
    path: 'students/:id',
    element: StudentDetail
  },
  {
    path: 'parents',
    element: Parents
  },
  {
    path: 'parents/:id',
    element: ParentDetailsPage
  },
  {
    path: 'teacher-students',
    element: TeacherStudents
  },
  {
    path: 'teacher-courses',
    element: TeacherCourses
  },
  {
    path: 'teacher-classes',
    element: TeacherClasses
  },
  {
    path: 'teacher-assignments',
    element: TeacherAssignments
  },
  {
    path: 'teacher-resources',
    element: TeacherResources
  },
  {
    path: 'teacher-submissions',
    element: TeacherSubmissions
  },
  // Grade Management routes
  {
    path: 'grades',
    element: Grades
  },
  {
    path: 'gradebook',
    element: Gradebook
  },
  // Content Management routes
  {
    path: 'content',
    element: Content
  },
  {
    path: 'content/:id',
    element: ContentDetail
  },
  // Curriculum Management routes
  {
    path: 'curriculum',
    element: Curriculum
  },
  {
    path: 'curriculum/:id',
    element: CurriculumDetail
  },
  {
    path: 'curriculum-builder',
    element: CurriculumBuilder
  },
  {
    path: 'curriculum-builder/:id',
    element: CurriculumBuilder
  },
  {
    path: 'curriculum/:curriculumId/subjects',
    element: CurriculumSubjectManagement
  },
  {
    path: 'standards-management',
    element: StandardsManagement
  },
  {
    path: 'learning-objectives',
    element: LearningObjectives
  },
  {
    path: 'curriculum-templates',
    element: CurriculumTemplates
  },
  {
    path: 'curriculum-approval',
    element: CurriculumApproval
  },
  {
    path: 'curriculum-analytics/:curriculumId',
    element: CurriculumAnalytics
  },
  {
    path: 'curriculum-resources/:curriculumId',
    element: CurriculumResources
  },
  {
    path: 'curriculum-progress/:curriculumId',
    element: CurriculumProgress
  },
  // Announcement routes
  {
    path: 'announcements',
    element: Announcements
  },
  {
    path: 'my-announcements',
    element: MyAnnouncements
  },
  {
    path: 'announcement-details/:id',
    element: AnnouncementDetails
  },
  // Quiz Management routes
  {
    path: 'quizzes',
    element: Quizzes
  },
  {
    path: 'quiz-creation',
    element: QuizCreation
  },
  {
    path: 'quiz-creation/:id',
    element: QuizCreation
  },
  {
    path: 'quiz-analytics',
    element: QuizAnalytics
  },
  {
    path: 'quiz-take/:id',
    element: QuizTakingPage
  },
  {
    path: 'quiz-results/:id',
    element: QuizResultsPage
  },
  // Attendance routes
  {
    path: 'attendance',
    element: AttendanceMarking
  },
  {
    path: 'attendance/mark',
    element: AttendanceMarking
  },
  {
    path: 'attendance/reports',
    element: AttendanceReports
  },
  {
    path: 'attendance/calendar',
    element: AttendanceCalendar
  },
  {
    path: 'my-attendance',
    element: MyAttendance
  },
  {
    path: 'child-attendance',
    element: ChildAttendance
  },
  // Calendar routes
  {
    path: 'calendar',
    element: Calendar
  },
  // Student role routes
  {
    path: 'student-dashboard',
    element: StudentDashboard
  },
  {
    path: 'student-courses',
    element: StudentCourses
  },
  {
    path: 'student-assignments',
    element: StudentAssignments
  },
  {
    path: 'student-grades',
    element: StudentGrades
  },
  {
    path: 'student-messages',
    element: StudentMessages
  },
  {
    path: 'student-schedule',
    element: StudentSchedule
  },
  {
    path: 'student-help',
    element: StudentHelp
  },
  // School Admin role routes
  {
    path: 'school-admin-dashboard',
    element: SchoolAdminDashboard
  },
  {
    path: 'staff-management',
    element: StaffManagement
  },
  {
    path: 'staff/:id',
    element: StaffDetail
  },
  {
    path: 'student-records',
    element: StudentRecords
  },
  {
    path: 'class-management',
    element: ClassManagement
  },
  {
    path: 'school-reports',
    element: SchoolReports
  },
  {
    path: 'school-settings',
    element: SchoolSettings
  },
  {
    path: 'school-admin-help',
    element: SchoolAdminHelp
  },
  // Additional School Admin routes
  {
    path: 'timetable-management',
    element: TimetableManagement
  },
  {
    path: 'assessment-configuration',
    element: AssessmentConfiguration
  },
  {
    path: 'subject-allocation',
    element: SubjectAllocation
  },
  {
    path: 'facilities',
    element: Facilities
  },
  {
    path: 'school-calendar',
    element: SchoolCalendar
  },
  {
    path: 'documents',
    element: Documents
  },
  {
    path: 'documents/upload',
    element: lazy(() => import('../features/documents/pages/DocumentUploadPage'))
  },
  {
    path: 'my-documents',
    element: lazy(() => import('../features/documents/pages/MyDocumentsPage'))
  },
  {
    path: 'monitoring',
    element: Monitoring
  },
  // Catch all route
  {
    path: '*',
    element: NotFoundPage
  }
];

export default appRoutes;

