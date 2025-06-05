import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userApi, { User, CreateUserRequest, UpdateUserRequest } from '../../api/services/userApi';

// Enhanced interface for user analytics
export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<string, number>;
  recentRegistrations: number;
  lastLoginStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  roleDistribution: Array<{
    role: string;
    count: number;
    percentage: number;
  }>;
}

// Enhanced interface for bulk operations
export interface BulkOperation {
  id: string;
  type: 'activate' | 'deactivate' | 'delete' | 'roleChange' | 'export';
  userIds: number[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: {
    successful: number;
    failed: number;
    errors: string[];
  };
}

// Enhanced interface for user filters
export interface UserFilters {
  search: string;
  role: string;
  status: 'active' | 'inactive' | '';
  schoolId: number | '';
  regionId: number | '';
  dateRange?: {
    start: string;
    end: string;
  };
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  
  // Enhanced state properties
  analytics: UserAnalytics | null;
  analyticsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  
  bulkOperations: BulkOperation[];
  bulkOperationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  
  filters: UserFilters;
  
  // Pagination
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  
  // Export functionality
  exportData: Blob | null;
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  
  // User activity tracking
  userActivity: Array<{
    userId: number;
    action: string;
    timestamp: string;
    details?: string;
  }>;
  activityStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  status: 'idle',
  error: null,
  
  analytics: null,
  analyticsStatus: 'idle',
  
  bulkOperations: [],
  bulkOperationStatus: 'idle',
  
  filters: {
    search: '',
    role: '',
    status: '',
    schoolId: '',
    regionId: '',
  },
  
  pagination: {
    currentPage: 1,
    pageSize: 25,
    totalPages: 0,
    totalItems: 0,
  },
  
  exportData: null,
  exportStatus: 'idle',
  
  userActivity: [],
  activityStatus: 'idle',
};

// Enhanced async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page?: number; pageSize?: number; filters?: Partial<UserFilters> } = {}, { rejectWithValue }) => {
    try {
      const response = await userApi.getAll();
      const data = response.data.data;
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getById(id);
      return response.data.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const fetchUserAnalytics = createAsyncThunk(
  'users/fetchUserAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get users to calculate analytics
      const state = getState() as { users: UsersState };
      const users = state.users.users;
      
      const analytics: UserAnalytics = {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.active).length,
        inactiveUsers: users.filter(user => !user.active).length,
        usersByRole: users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentRegistrations: users.filter(user => {
          const createdAt = new Date(user.createdAt || '');
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          return createdAt > lastWeek;
        }).length,
        lastLoginStats: {
          today: users.filter(user => {
            if (!user.lastLoginTime) return false;
            const loginDate = new Date(user.lastLoginTime);
            const today = new Date();
            return loginDate.toDateString() === today.toDateString();
          }).length,
          thisWeek: users.filter(user => {
            if (!user.lastLoginTime) return false;
            const loginDate = new Date(user.lastLoginTime);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return loginDate > weekAgo;
          }).length,
          thisMonth: users.filter(user => {
            if (!user.lastLoginTime) return false;
            const loginDate = new Date(user.lastLoginTime);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return loginDate > monthAgo;
          }).length,
        },
        roleDistribution: Object.entries(users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)).map(([role, count]) => ({
          role,
          count,
          percentage: Math.round((count / users.length) * 100)
        }))
      };
      
      return analytics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to calculate analytics');
    }
  }
);

export const fetchTeachers = createAsyncThunk(
  'users/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllTeachers();
      const data = response.data.data;
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

export const fetchStudents = createAsyncThunk(
  'users/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllStudents();
      const data = response.data.data;
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await userApi.create(userData);
      return response.data.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await userApi.update(id, userData);
      return response.data.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.update(id, { active: true });
      return response.data.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.update(id, { active: false });
      return response.data.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate user');
    }
  }
);

// New bulk operations thunks
export const bulkActivateUsers = createAsyncThunk(
  'users/bulkActivateUsers',
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const results = await Promise.allSettled(
        userIds.map(id => userApi.update(id, { active: true }))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason.message);
      
      return { successful, failed, errors, userIds };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to bulk activate users');
    }
  }
);

export const bulkDeactivateUsers = createAsyncThunk(
  'users/bulkDeactivateUsers',
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const results = await Promise.allSettled(
        userIds.map(id => userApi.update(id, { active: false }))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason.message);
      
      return { successful, failed, errors, userIds };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to bulk deactivate users');
    }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  'users/bulkDeleteUsers',
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const results = await Promise.allSettled(
        userIds.map(id => userApi.delete(id))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason.message);
      
      return { successful, failed, errors, userIds };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to bulk delete users');
    }
  }
);

// Export functionality
export const exportUsers = createAsyncThunk(
  'users/exportUsers',
  async (format: 'csv' | 'excel' = 'csv', { getState, rejectWithValue }) => {
    try {
      const state = getState() as { users: UsersState };
      const users = state.users.users;
      
      // Create CSV content
      const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Active', 'School ID', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...users.map(user => [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.role,
          user.active ? 'Yes' : 'No',
          user.schoolId || 'N/A',
          user.createdAt || 'N/A'
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      return blob;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to export users');
    }
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
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        role: '',
        status: '',
        schoolId: '',
        regionId: '',
      };
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    addBulkOperation: (state, action: PayloadAction<BulkOperation>) => {
      state.bulkOperations.push(action.payload);
    },
    updateBulkOperation: (state, action: PayloadAction<{ id: string; updates: Partial<BulkOperation> }>) => {
      const index = state.bulkOperations.findIndex(op => op.id === action.payload.id);
      if (index !== -1) {
        state.bulkOperations[index] = { ...state.bulkOperations[index], ...action.payload.updates };
      }
    },
    removeBulkOperation: (state, action: PayloadAction<string>) => {
      state.bulkOperations = state.bulkOperations.filter(op => op.id !== action.payload);
    },
    clearExportData: (state) => {
      state.exportData = null;
      state.exportStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch users';
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
        state.error = action.payload as string || 'Failed to fetch user';
      })
      
      // Fetch analytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.analyticsStatus = 'loading';
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.analyticsStatus = 'failed';
        state.error = action.payload as string || 'Failed to fetch analytics';
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
        state.error = action.payload as string || 'Failed to create user';
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
        state.error = action.payload as string || 'Failed to update user';
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
        state.error = action.payload as string || 'Failed to delete user';
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
      })
      
      // Bulk operations
      .addCase(bulkActivateUsers.pending, (state) => {
        state.bulkOperationStatus = 'loading';
      })
      .addCase(bulkActivateUsers.fulfilled, (state, action) => {
        state.bulkOperationStatus = 'succeeded';
        // Update users status
        action.payload.userIds.forEach(userId => {
          const index = state.users.findIndex(user => user.id === userId);
          if (index !== -1) {
            state.users[index].active = true;
          }
        });
      })
      .addCase(bulkActivateUsers.rejected, (state, action) => {
        state.bulkOperationStatus = 'failed';
        state.error = action.payload as string || 'Failed to bulk activate users';
      })
      
      .addCase(bulkDeactivateUsers.fulfilled, (state, action) => {
        action.payload.userIds.forEach(userId => {
          const index = state.users.findIndex(user => user.id === userId);
          if (index !== -1) {
            state.users[index].active = false;
          }
        });
      })
      
      .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
        state.users = state.users.filter(user => !action.payload.userIds.includes(user.id));
      })
      
      // Export
      .addCase(exportUsers.pending, (state) => {
        state.exportStatus = 'loading';
      })
      .addCase(exportUsers.fulfilled, (state, action) => {
        state.exportStatus = 'succeeded';
        state.exportData = action.payload;
      })
      .addCase(exportUsers.rejected, (state, action) => {
        state.exportStatus = 'failed';
        state.error = action.payload as string || 'Failed to export users';
      });
  },
});

export const {
  clearUsersError,
  clearCurrentUser,
  setCurrentUser,
  setFilters,
  clearFilters,
  setPagination,
  addBulkOperation,
  updateBulkOperation,
  removeBulkOperation,
  clearExportData,
} = usersSlice.actions;

export default usersSlice.reducer; 