import { configureStore } from '@reduxjs/toolkit';
import headerReducer from '../features/common/headerSlice';
import modalReducer from '../features/common/modalSlice';
import rightDrawerReducer from '../features/common/rightDrawerSlice';

export const store = configureStore({
    reducer: {
        header: headerReducer,
        modal: modalReducer,
        rightDrawer: rightDrawerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 