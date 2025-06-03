import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import progressApi, { Progress } from '../../api/services/progressApi';

export interface ProgressState {
  progressRecords: Progress[];
  currentProgress: Progress | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  analytics: {
    averageGrade: number | null;
    averageCompletion: number | null;
  };
}

const initialState: ProgressState = {
  progressRecords: [],
  currentProgress: null,
  status: 'idle',
  error: null,
  analytics: {
    averageGrade: null,
    averageCompletion: null,
  }
};

// Async thunks
export const fetchAllProgress = createAsyncThunk(
  'progress/fetchAllProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getAll();
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch progress records';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProgressById = createAsyncThunk(
  'progress/fetchProgressById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getById(id);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProgressByStudent = createAsyncThunk(
  'progress/fetchProgressByStudent',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getByStudent(studentId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProgressByCourse = createAsyncThunk(
  'progress/fetchProgressByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getByCourse(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch course progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProgressByStudentAndCourse = createAsyncThunk(
  'progress/fetchProgressByStudentAndCourse',
  async (params: { studentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await progressApi.getByStudentAndCourse(params.studentId, params.courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchActiveProgressByStudent = createAsyncThunk(
  'progress/fetchActiveProgressByStudent',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getActiveByStudent(studentId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active student progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchActiveProgressByCourse = createAsyncThunk(
  'progress/fetchActiveProgressByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getActiveByCourse(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active course progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCompletedProgressByStudent = createAsyncThunk(
  'progress/fetchCompletedProgressByStudent',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getCompletedByStudent(studentId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch completed student progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCompletedProgressByCourse = createAsyncThunk(
  'progress/fetchCompletedProgressByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getCompletedByCourse(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch completed course progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAverageGradeByCourse = createAsyncThunk(
  'progress/fetchAverageGradeByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getAverageGradeByCourse(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch average grade';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAverageCompletionByCourse = createAsyncThunk(
  'progress/fetchAverageCompletionByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await progressApi.getAverageCompletionByCourse(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch average completion';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProgressData = createAsyncThunk(
  'progress/updateProgressData',
  async (params: { studentId: number; courseId: number; completionPercentage: number; grade: number }, { rejectWithValue }) => {
    try {
      const response = await progressApi.updateProgress(params.studentId, params.courseId, params.completionPercentage, params.grade);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      return rejectWithValue(errorMessage);
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearCurrentProgress: (state) => {
      state.currentProgress = null;
    },
    clearProgressError: (state) => {
      state.error = null;
    },
    clearProgressRecords: (state) => {
      state.progressRecords = [];
    },
    updateProgressLocally: (state, action) => {
      const progress = state.progressRecords.find(p => p.id === action.payload.id);
      if (progress) {
        Object.assign(progress, action.payload.updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all progress
      .addCase(fetchAllProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch progress records';
      })
      
      // Fetch progress by ID
      .addCase(fetchProgressById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProgress = action.payload as Progress;
      })
      .addCase(fetchProgressById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch progress';
      })
      
      // Fetch progress by student
      .addCase(fetchProgressByStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressByStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProgressByStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student progress';
      })
      
      // Fetch progress by course
      .addCase(fetchProgressByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProgressByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch course progress';
      })
      
      // Fetch progress by student and course
      .addCase(fetchProgressByStudentAndCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressByStudentAndCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProgress = action.payload as Progress;
      })
      .addCase(fetchProgressByStudentAndCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch progress';
      })
      
      // Fetch active progress by student
      .addCase(fetchActiveProgressByStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch active progress by course
      .addCase(fetchActiveProgressByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch completed progress by student
      .addCase(fetchCompletedProgressByStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch completed progress by course
      .addCase(fetchCompletedProgressByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch average grade by course
      .addCase(fetchAverageGradeByCourse.fulfilled, (state, action) => {
        state.analytics.averageGrade = action.payload as number;
      })
      
      // Fetch average completion by course
      .addCase(fetchAverageCompletionByCourse.fulfilled, (state, action) => {
        state.analytics.averageCompletion = action.payload as number;
      })
      
      // Update progress data
      .addCase(updateProgressData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProgressData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedProgress = action.payload as Progress;
        const index = state.progressRecords.findIndex(p => p.id === updatedProgress.id);
        if (index !== -1) {
          state.progressRecords[index] = updatedProgress;
        } else {
          state.progressRecords.push(updatedProgress);
        }
        state.currentProgress = updatedProgress;
      })
      .addCase(updateProgressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update progress';
      });
  },
});

export const { 
  clearCurrentProgress, 
  clearProgressError, 
  clearProgressRecords,
  updateProgressLocally
} = progressSlice.actions;

export default progressSlice.reducer; 