import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HeaderState {
    pageTitle: string;
}

const initialState: HeaderState = {
    pageTitle: 'Dashboard',
};

export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setPageTitle: (state, action: PayloadAction<string>) => {
            state.pageTitle = action.payload;
        },
    },
});

export const { setPageTitle } = headerSlice.actions;
export default headerSlice.reducer; 