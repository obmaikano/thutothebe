import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import headerReducer from '../features/common/headerSlice';
import coursesReducer from '../features/courses/coursesSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import departmentsReducer from '../features/departments/departmentsSlice';
import schoolsReducer from '../features/schools/schoolsSlice';
import regionsReducer from '../features/regions/regionsSlice';
import usersReducer from '../features/users/usersSlice';
import teachersReducer from '../features/teachers/teachersSlice';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import submissionsReducer from '../features/assignments/submissionsSlice';
import gradesReducer from '../features/grades/gradesSlice';
import gradeCategoriesReducer from '../features/grades/gradeCategoriesSlice';
import studentsReducer from '../features/students/studentsSlice';
import parentsReducer from '../features/parents/parentsSlice';
import classesReducer from '../features/classes/classesSlice';
import schedulesReducer from '../features/school_admin/schedulesSlice';
import quizzesReducer from '../features/quizzes/quizzesSlice';
import questionsReducer from '../features/quizzes/questionsSlice';
import quizSubmissionsReducer from '../features/quizzes/quizSubmissionsSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import calendarEventsReducer from '../features/calendar/calendarEventsSlice';
import contentReducer from '../features/content/contentSlice';
import curriculumReducer from '../features/curriculum/curriculumSlice';
import curriculumAdvancedReducer from '../features/curriculum/curriculumAdvancedSlice';
import curriculumProgressReducer from '../features/curriculum/curriculumProgressSlice';
import curriculumSubjectReducer from '../features/curriculum/curriculumSubjectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    header: headerReducer,
    courses: coursesReducer,
    subjects: subjectsReducer,
    departments: departmentsReducer,
    schools: schoolsReducer,
    regions: regionsReducer,
    users: usersReducer,
    teachers: teachersReducer,
    assignments: assignmentsReducer,
    submissions: submissionsReducer,
    grades: gradesReducer,
    gradeCategories: gradeCategoriesReducer,
    students: studentsReducer,
    parents: parentsReducer,
    classes: classesReducer,
    schedules: schedulesReducer,
    quizzes: quizzesReducer,
    questions: questionsReducer,
    quizSubmissions: quizSubmissionsReducer,
    announcements: announcementsReducer,
    attendance: attendanceReducer,
    calendarEvents: calendarEventsReducer,
    content: contentReducer,
    curriculum: curriculumReducer,
    curriculumAdvanced: curriculumAdvancedReducer,
    curriculumProgress: curriculumProgressReducer,
    curriculumSubject: curriculumSubjectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 