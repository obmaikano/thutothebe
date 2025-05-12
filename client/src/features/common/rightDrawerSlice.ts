import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RightDrawerState {
    isOpen: boolean;
    title: string;
    content: React.ReactNode | null;
}

const initialState: RightDrawerState = {
    isOpen: false,
    title: '',
    content: null,
};

export const rightDrawerSlice = createSlice({
    name: 'rightDrawer',
    initialState,
    reducers: {
        openRightDrawer: (state, action: PayloadAction<{ title: string; content: React.ReactNode }>) => {
            state.isOpen = true;
            state.title = action.payload.title;
            state.content = action.payload.content;
        },
        closeRightDrawer: (state) => {
            state.isOpen = false;
            state.title = '';
            state.content = null;
        },
    },
});

export const { openRightDrawer, closeRightDrawer } = rightDrawerSlice.actions;
export default rightDrawerSlice.reducer; 