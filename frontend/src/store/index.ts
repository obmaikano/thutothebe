import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import headerReducer from '../features/common/headerSlice';
import coursesReducer from '../features/courses/coursesSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import schoolsReducer from '../features/schools/schoolsSlice';
import regionsReducer from '../features/regions/regionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    header: headerReducer,
    courses: coursesReducer,
    subjects: subjectsReducer,
    schools: schoolsReducer,
    regions: regionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 