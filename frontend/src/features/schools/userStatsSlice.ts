import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi, { User } from '../../api/services/userApi';
import studentApi, { Student } from '../../api/services/studentApi';
import teacherApi, { Teacher } from '../../api/services/teacherApi';

interface UserStatsState {
  schoolUsers: User[];
  schoolStudents: Student[];
  schoolTeachers: Teacher[];
  schoolStaff: User[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: UserStatsState = {
  schoolUsers: [],
  schoolStudents: [],
  schoolTeachers: [],
  schoolStaff: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchSchoolUsers = createAsyncThunk(
  'userStats/fetchSchoolUsers',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getBySchoolId(schoolId);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school users');
    }
  }
);

export const fetchSchoolStudents = createAsyncThunk(
  'userStats/fetchSchoolStudents',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await studentApi.getBySchool(schoolId);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school students');
    }
  }
);

export const fetchSchoolTeachers = createAsyncThunk(
  'userStats/fetchSchoolTeachers',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await teacherApi.getBySchool(schoolId);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school teachers');
    }
  }
);

export const fetchSchoolStaff = createAsyncThunk(
  'userStats/fetchSchoolStaff',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getStaffBySchoolId(schoolId);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school staff');
    }
  }
);

export const fetchAllSchoolStats = createAsyncThunk(
  'userStats/fetchAllSchoolStats',
  async (schoolId: number, { dispatch }) => {
    try {
      await Promise.all([
        dispatch(fetchSchoolUsers(schoolId)),
        dispatch(fetchSchoolStudents(schoolId)),
        dispatch(fetchSchoolTeachers(schoolId)),
        dispatch(fetchSchoolStaff(schoolId)),
      ]);
      return schoolId;
    } catch (error) {
      throw error;
    }
  }
);

const userStatsSlice = createSlice({
  name: 'userStats',
  initialState,
  reducers: {
    clearUserStats: (state) => {
      state.schoolUsers = [];
      state.schoolStudents = [];
      state.schoolTeachers = [];
      state.schoolStaff = [];
      state.error = null;
      state.lastFetched = null;
    },
    clearUserStatsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch school users
      .addCase(fetchSchoolUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolUsers = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchSchoolUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch school students
      .addCase(fetchSchoolStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolStudents = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchSchoolStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch school teachers
      .addCase(fetchSchoolTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolTeachers = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchSchoolTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch school staff
      .addCase(fetchSchoolStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolStaff = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchSchoolStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch all school stats
      .addCase(fetchAllSchoolStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSchoolStats.fulfilled, (state) => {
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAllSchoolStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch school statistics';
      });
  },
});

export const { clearUserStats, clearUserStatsError } = userStatsSlice.actions;
export default userStatsSlice.reducer; 