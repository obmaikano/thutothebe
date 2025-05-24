import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import coursesReducer from '../features/courses/coursesSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import schoolsReducer from '../features/schools/schoolsSlice';
import regionsReducer from '../features/regions/regionsSlice';
import usersReducer from '../features/users/usersSlice';
import rightDrawerReducer from '../features/common/rightDrawerSlice';
import modalReducer from '../features/common/modalSlice';
import headerReducer from '../features/common/headerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    courses: coursesReducer,
    subjects: subjectsReducer,
    schools: schoolsReducer,
    regions: regionsReducer,
    users: usersReducer,
    rightDrawer: rightDrawerReducer,
    modal: modalReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 