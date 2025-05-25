import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import progressApi, { Progress, CreateProgressRequest, UpdateProgressRequest } from '../../api/services/progressApi';

export interface ProgressState {
  progressRecords: Progress[];
  currentProgress: Progress | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProgressState = {
  progressRecords: [],
  currentProgress: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchAllProgress = createAsyncThunk(
  'progress/fetchAllProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressApi.getAll();
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch progress';
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
  async ({ studentId, courseId }: { studentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await progressApi.getByStudentAndCourse(studentId, courseId);
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active progress';
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch completed progress';
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

export const updateStudentProgress = createAsyncThunk(
  'progress/updateStudentProgress',
  async ({ studentId, courseId, completionPercentage, grade }: {
    studentId: number;
    courseId: number;
    completionPercentage: number;
    grade: number;
  }, { rejectWithValue }) => {
    try {
      const response = await progressApi.updateProgress(studentId, courseId, completionPercentage, grade);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProgress = createAsyncThunk(
  'progress/createProgress',
  async (progressData: CreateProgressRequest, { rejectWithValue }) => {
    try {
      const response = await progressApi.create(progressData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProgress = createAsyncThunk(
  'progress/updateProgress',
  async ({ id, progressData }: { id: number; progressData: UpdateProgressRequest }, { rejectWithValue }) => {
    try {
      const response = await progressApi.update(id, progressData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProgress = createAsyncThunk(
  'progress/deleteProgress',
  async (id: number, { rejectWithValue }) => {
    try {
      await progressApi.delete(id);
      return { id };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete progress';
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
    }
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
        state.error = action.payload as string || 'Failed to fetch progress';
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

      // Create progress
      .addCase(createProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords.push(action.payload as Progress);
        state.currentProgress = action.payload as Progress;
      })
      .addCase(createProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create progress';
      })

      // Update progress
      .addCase(updateProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedProgress = action.payload as Progress;
        const index = state.progressRecords.findIndex(progress => progress.id === updatedProgress.id);
        if (index !== -1) {
          state.progressRecords[index] = updatedProgress;
        }
        state.currentProgress = updatedProgress;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update progress';
      })

      // Update student progress
      .addCase(updateStudentProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateStudentProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedProgress = action.payload as Progress;
        const index = state.progressRecords.findIndex(
          progress => progress.studentId === updatedProgress.studentId && 
                     progress.courseId === updatedProgress.courseId
        );
        if (index !== -1) {
          state.progressRecords[index] = updatedProgress;
        } else {
          state.progressRecords.push(updatedProgress);
        }
        state.currentProgress = updatedProgress;
      })
      .addCase(updateStudentProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update student progress';
      })

      // Delete progress
      .addCase(deleteProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.progressRecords = state.progressRecords.filter(progress => progress.id !== id);
        if (state.currentProgress?.id === id) {
          state.currentProgress = null;
        }
      })
      .addCase(deleteProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete progress';
      });
  }
});

export const { clearCurrentProgress, clearProgressError } = progressSlice.actions;
export default progressSlice.reducer; 