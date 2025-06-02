import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import coursesReducer from '../features/courses/coursesSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import departmentsReducer from '../features/departments/departmentsSlice';
import classesReducer from '../features/classes/classesSlice';
import schoolsReducer from '../features/schools/schoolsSlice';
import regionsReducer from '../features/regions/regionsSlice';
import usersReducer from '../features/users/usersSlice';
import teachersReducer from '../features/teachers/teachersSlice';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import submissionsReducer from '../features/assignments/submissionsSlice';
import assessmentsReducer from '../features/assessments/assessmentsSlice';
import gradesReducer from '../features/grades/gradesSlice';
import studentsReducer from '../features/students/studentsSlice';
import progressReducer from '../features/progress/progressSlice';
import rightDrawerReducer from '../features/common/rightDrawerSlice';
import modalReducer from '../features/common/modalSlice';
import headerReducer from '../features/common/headerSlice';
import parentsReducer from '../features/parents/parentsSlice';
import schedulesReducer from '../features/school_admin/schedulesSlice';
import quizzesReducer from '../features/quizzes/quizzesSlice';
import questionsReducer from '../features/quizzes/questionsSlice';
import quizSubmissionsReducer from '../features/quizzes/quizSubmissionsSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import calendarEventsReducer from '../features/calendar/calendarEventsSlice';
import contentReducer from '../features/content/contentSlice';
import curriculumReducer from '../features/curriculum/curriculumSlice';
import curriculumSubjectReducer from '../features/curriculum/curriculumSubjectSlice';
import documentsReducer from '../features/documents/documentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    courses: coursesReducer,
    subjects: subjectsReducer,
    departments: departmentsReducer,
    classes: classesReducer,
    schools: schoolsReducer,
    regions: regionsReducer,
    users: usersReducer,
    teachers: teachersReducer,
    assignments: assignmentsReducer,
    submissions: submissionsReducer,
    assessments: assessmentsReducer,
    grades: gradesReducer,
    students: studentsReducer,
    progress: progressReducer,
    rightDrawer: rightDrawerReducer,
    modal: modalReducer,
    header: headerReducer,
    parents: parentsReducer,
    schedules: schedulesReducer,
    quizzes: quizzesReducer,
    questions: questionsReducer,
    quizSubmissions: quizSubmissionsReducer,
    announcements: announcementsReducer,
    attendance: attendanceReducer,
    calendarEvents: calendarEventsReducer,
    content: contentReducer,
    curriculum: curriculumReducer,
    curriculumSubject: curriculumSubjectReducer,
    documents: documentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 