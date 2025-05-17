import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 