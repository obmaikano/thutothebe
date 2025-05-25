import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import coursesReducer from '../features/courses/coursesSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import classesReducer from '../features/classes/classesSlice';
import schoolsReducer from '../features/schools/schoolsSlice';
import regionsReducer from '../features/regions/regionsSlice';
import usersReducer from '../features/users/usersSlice';
import teachersReducer from '../features/teachers/teachersSlice';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import gradesReducer from '../features/grades/gradesSlice';
import studentsReducer from '../features/students/studentsSlice';
import progressReducer from '../features/progress/progressSlice';
import rightDrawerReducer from '../features/common/rightDrawerSlice';
import modalReducer from '../features/common/modalSlice';
import headerReducer from '../features/common/headerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    courses: coursesReducer,
    subjects: subjectsReducer,
    classes: classesReducer,
    schools: schoolsReducer,
    regions: regionsReducer,
    users: usersReducer,
    teachers: teachersReducer,
    assignments: assignmentsReducer,
    grades: gradesReducer,
    students: studentsReducer,
    progress: progressReducer,
    rightDrawer: rightDrawerReducer,
    modal: modalReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 