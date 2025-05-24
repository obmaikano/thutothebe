import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userApi, { User, CreateUserRequest, UpdateUserRequest } from '../../api/services/userApi';

interface UsersState {
  users: User[];
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await userApi.getAll();
    const data = response.data.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number) => {
    const response = await userApi.getById(id);
    return response.data.data as User;
  }
);

export const fetchTeachers = createAsyncThunk(
  'users/fetchTeachers',
  async () => {
    const response = await userApi.getAllTeachers();
    const data = response.data.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  }
);

export const fetchStudents = createAsyncThunk(
  'users/fetchStudents',
  async () => {
    const response = await userApi.getAllStudents();
    const data = response.data.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserRequest) => {
    const response = await userApi.create(userData);
    return response.data.data as User;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: UpdateUserRequest }) => {
    const response = await userApi.update(id, userData);
    return response.data.data as User;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    await userApi.delete(id);
    return id;
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (id: number) => {
    const response = await userApi.update(id, { active: true });
    return response.data.data as User;
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (id: number) => {
    const response = await userApi.update(id, { active: false });
    return response.data.data as User;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      })
      
      // Fetch teachers
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      
      // Fetch students
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create user';
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update user';
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.currentUser && state.currentUser.id === action.payload) {
          state.currentUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete user';
      })
      
      // Activate user
      .addCase(activateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      
      // Deactivate user
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      });
  },
});

export const { clearUsersError, clearCurrentUser, setCurrentUser } = usersSlice.actions;

export default usersSlice.reducer; 