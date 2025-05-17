import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import commonReducer from '../features/common/commonSlice';
import coursesReducer from '../features/courses/coursesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    courses: coursesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 