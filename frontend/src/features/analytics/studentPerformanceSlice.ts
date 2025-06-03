import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentPerformanceApi, { StudentPerformance } from '../../api/services/studentPerformanceApi';

export interface StudentPerformanceState {
  performances: StudentPerformance[];
  currentPerformance: StudentPerformance | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: {
    courseId?: number;
    studentId?: number;
    startDate?: string;
    endDate?: string;
  };
}

const initialState: StudentPerformanceState = {
  performances: [],
  currentPerformance: null,
  status: 'idle',
  error: null,
  filter: {}
};

// Async thunks
export const fetchStudentPerformances = createAsyncThunk(
  'studentPerformance/fetchStudentPerformances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getAll();
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student performances';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudentPerformanceById = createAsyncThunk(
  'studentPerformance/fetchStudentPerformanceById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getById(id);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student performance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudentPerformance = createAsyncThunk(
  'studentPerformance/fetchStudentPerformance',
  async (params: { studentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getStudentPerformance(params.studentId, params.courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student performance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudentPerformanceHistory = createAsyncThunk(
  'studentPerformance/fetchStudentPerformanceHistory',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getStudentPerformanceHistory(studentId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student performance history';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCoursePerformance = createAsyncThunk(
  'studentPerformance/fetchCoursePerformance',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getCoursePerformance(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch course performance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPerformanceByDateRange = createAsyncThunk(
  'studentPerformance/fetchPerformanceByDateRange',
  async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getPerformanceByDateRange(params.startDate, params.endDate);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch performance by date range';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateStudentPerformance = createAsyncThunk(
  'studentPerformance/updateStudentPerformance',
  async (params: { studentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      await studentPerformanceApi.updateStudentPerformance(params.studentId, params.courseId);
      return params;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update student performance';
      return rejectWithValue(errorMessage);
    }
  }
);

const studentPerformanceSlice = createSlice({
  name: 'studentPerformance',
  initialState,
  reducers: {
    clearCurrentPerformance: (state) => {
      state.currentPerformance = null;
    },
    clearPerformanceError: (state) => {
      state.error = null;
    },
    setPerformanceFilter: (state, action) => {
      state.filter = action.payload;
    },
    updatePerformanceMetrics: (state, action) => {
      const performance = state.performances.find(p => p.id === action.payload.id);
      if (performance) {
        Object.assign(performance, action.payload.updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all student performances
      .addCase(fetchStudentPerformances.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentPerformances.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.performances = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentPerformances.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student performances';
      })
      
      // Fetch student performance by ID
      .addCase(fetchStudentPerformanceById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentPerformanceById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPerformance = action.payload as StudentPerformance;
      })
      .addCase(fetchStudentPerformanceById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student performance';
      })
      
      // Fetch student performance
      .addCase(fetchStudentPerformance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentPerformance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPerformance = action.payload as StudentPerformance;
      })
      .addCase(fetchStudentPerformance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student performance';
      })
      
      // Fetch student performance history
      .addCase(fetchStudentPerformanceHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentPerformanceHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.performances = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentPerformanceHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student performance history';
      })
      
      // Fetch course performance
      .addCase(fetchCoursePerformance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCoursePerformance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.performances = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCoursePerformance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch course performance';
      })
      
      // Fetch performance by date range
      .addCase(fetchPerformanceByDateRange.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPerformanceByDateRange.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.performances = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPerformanceByDateRange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch performance by date range';
      })
      
      // Update student performance
      .addCase(updateStudentPerformance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateStudentPerformance.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateStudentPerformance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update student performance';
      });
  },
});

export const { 
  clearCurrentPerformance, 
  clearPerformanceError, 
  setPerformanceFilter,
  updatePerformanceMetrics
} = studentPerformanceSlice.actions;

export default studentPerformanceSlice.reducer; 