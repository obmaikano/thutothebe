import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import headerReducer from '../features/common/headerSlice';
import coursesReducer from '../features/courses/coursesSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import schoolsReducer from '../features/schools/schoolsSlice';
import regionsReducer from '../features/regions/regionsSlice';
import usersReducer from '../features/users/usersSlice';
import teachersReducer from '../features/teachers/teachersSlice';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import submissionsReducer from '../features/assignments/submissionsSlice';
import gradesReducer from '../features/grades/gradesSlice';
import studentsReducer from '../features/students/studentsSlice';
import parentsReducer from '../features/parents/parentsSlice';
import classesReducer from '../features/classes/classesSlice';
import schedulesReducer from '../features/school_admin/schedulesSlice';
import quizzesReducer from '../features/quizzes/quizzesSlice';
import questionsReducer from '../features/quizzes/questionsSlice';
import quizSubmissionsReducer from '../features/quizzes/quizSubmissionsSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    header: headerReducer,
    courses: coursesReducer,
    subjects: subjectsReducer,
    schools: schoolsReducer,
    regions: regionsReducer,
    users: usersReducer,
    teachers: teachersReducer,
    assignments: assignmentsReducer,
    submissions: submissionsReducer,
    grades: gradesReducer,
    students: studentsReducer,
    parents: parentsReducer,
    classes: classesReducer,
    schedules: schedulesReducer,
    quizzes: quizzesReducer,
    questions: questionsReducer,
    quizSubmissions: quizSubmissionsReducer,
    announcements: announcementsReducer,
    attendance: attendanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 