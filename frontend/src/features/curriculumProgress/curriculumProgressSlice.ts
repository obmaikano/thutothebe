import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import curriculumProgressApi, { CurriculumProgress, CreateCurriculumProgressRequest, UpdateCurriculumProgressRequest } from '../../api/services/curriculumProgressApi';

// ==================== INTERFACES ====================
export interface CurriculumProgressState {
  curriculumProgress: CurriculumProgress[];
  currentCurriculumProgress: CurriculumProgress | null;
  loading: boolean;
  error: string | null;
  analytics: {
    totalProgress: number;
    notStartedProgress: number;
    inProgressProgress: number;
    completedProgress: number;
    pausedProgress: number;
    droppedProgress: number;
    averageProgressPercentage: number;
    averageCompletionTime: number;
    completionRate: number;
  } | null;
}

// ==================== INITIAL STATE ====================
const initialState: CurriculumProgressState = {
  curriculumProgress: [],
  currentCurriculumProgress: null,
  loading: false,
  error: null,
  analytics: null
};

// ==================== ASYNC THUNKS ====================
export const fetchCurriculumProgress = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress');
    }
  }
);

export const fetchCurriculumProgressById = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress');
    }
  }
);

export const createCurriculumProgress = createAsyncThunk(
  'curriculumProgress/createCurriculumProgress',
  async (progressData: CreateCurriculumProgressRequest, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.create(progressData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create curriculum progress');
    }
  }
);

export const updateCurriculumProgress = createAsyncThunk(
  'curriculumProgress/updateCurriculumProgress',
  async ({ id, progressData }: { id: number; progressData: UpdateCurriculumProgressRequest }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.update(id, progressData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update curriculum progress');
    }
  }
);

export const deleteCurriculumProgress = createAsyncThunk(
  'curriculumProgress/deleteCurriculumProgress',
  async (id: number, { rejectWithValue }) => {
    try {
      await curriculumProgressApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete curriculum progress');
    }
  }
);

export const fetchCurriculumProgressByStudentId = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressByStudentId',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getByStudentId(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress by student');
    }
  }
);

export const fetchCurriculumProgressByCourseId = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress by course');
    }
  }
);

export const fetchCurriculumProgressByCurriculumId = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressByCurriculumId',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getByCurriculumId(curriculumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress by curriculum');
    }
  }
);

export const fetchCurriculumProgressByStudentIdAndCourseId = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressByStudentIdAndCourseId',
  async ({ studentId, courseId }: { studentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getByStudentIdAndCourseId(studentId, courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress');
    }
  }
);

export const fetchCurriculumProgressByStatus = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressByStatus',
  async (status: CurriculumProgress['status'], { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress by status');
    }
  }
);

export const fetchCurriculumProgressAnalytics = createAsyncThunk(
  'curriculumProgress/fetchCurriculumProgressAnalytics',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getCurriculumProgressAnalytics(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress analytics');
    }
  }
);

export const startProgress = createAsyncThunk(
  'curriculumProgress/startProgress',
  async ({ studentId, courseId, curriculumId }: { studentId: number; courseId: number; curriculumId: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.startProgress(studentId, courseId, curriculumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start curriculum progress');
    }
  }
);

export const updateProgressPercentage = createAsyncThunk(
  'curriculumProgress/updateProgressPercentage',
  async ({ progressId, progressPercentage }: { progressId: number; progressPercentage: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.updateProgressPercentage(progressId, progressPercentage);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress percentage');
    }
  }
);

export const completeProgress = createAsyncThunk(
  'curriculumProgress/completeProgress',
  async ({ progressId, averageScore }: { progressId: number; averageScore: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.completeProgress(progressId, averageScore);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete curriculum progress');
    }
  }
);

export const pauseProgress = createAsyncThunk(
  'curriculumProgress/pauseProgress',
  async ({ progressId, notes }: { progressId: number; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.pauseProgress(progressId, notes);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to pause curriculum progress');
    }
  }
);

export const resumeProgress = createAsyncThunk(
  'curriculumProgress/resumeProgress',
  async (progressId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.resumeProgress(progressId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resume curriculum progress');
    }
  }
);

export const dropProgress = createAsyncThunk(
  'curriculumProgress/dropProgress',
  async ({ progressId, notes }: { progressId: number; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.dropProgress(progressId, notes);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to drop curriculum progress');
    }
  }
);

// ==================== SLICE ====================
const curriculumProgressSlice = createSlice({
  name: 'curriculumProgress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCurriculumProgress: (state) => {
      state.currentCurriculumProgress = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all curriculum progress
    builder
      .addCase(fetchCurriculumProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress by ID
    builder
      .addCase(fetchCurriculumProgressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCurriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create curriculum progress
    builder
      .addCase(createCurriculumProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCurriculumProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress.push(action.payload);
      })
      .addCase(createCurriculumProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update curriculum progress
    builder
      .addCase(updateCurriculumProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurriculumProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(updateCurriculumProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete curriculum progress
    builder
      .addCase(deleteCurriculumProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCurriculumProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress = state.curriculumProgress.filter(progress => progress.id !== action.payload);
        if (state.currentCurriculumProgress?.id === action.payload) {
          state.currentCurriculumProgress = null;
        }
      })
      .addCase(deleteCurriculumProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress by student ID
    builder
      .addCase(fetchCurriculumProgressByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgressByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress by course ID
    builder
      .addCase(fetchCurriculumProgressByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressByCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgressByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress by curriculum ID
    builder
      .addCase(fetchCurriculumProgressByCurriculumId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressByCurriculumId.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgressByCurriculumId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress by student ID and course ID
    builder
      .addCase(fetchCurriculumProgressByStudentIdAndCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressByStudentIdAndCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCurriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgressByStudentIdAndCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress by status
    builder
      .addCase(fetchCurriculumProgressByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumProgress = action.payload;
      })
      .addCase(fetchCurriculumProgressByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch curriculum progress analytics
    builder
      .addCase(fetchCurriculumProgressAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumProgressAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchCurriculumProgressAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Start progress
    builder
      .addCase(startProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(startProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update progress percentage
    builder
      .addCase(updateProgressPercentage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgressPercentage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(updateProgressPercentage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Complete progress
    builder
      .addCase(completeProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(completeProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Pause progress
    builder
      .addCase(pauseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pauseProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(pauseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Resume progress
    builder
      .addCase(resumeProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resumeProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(resumeProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Drop progress
    builder
      .addCase(dropProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dropProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.curriculumProgress.findIndex(progress => progress.id === action.payload.id);
        if (index !== -1) {
          state.curriculumProgress[index] = action.payload;
        }
        if (state.currentCurriculumProgress?.id === action.payload.id) {
          state.currentCurriculumProgress = action.payload;
        }
      })
      .addCase(dropProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// ==================== EXPORTS ====================
export const { clearError, clearCurrentCurriculumProgress, clearAnalytics } = curriculumProgressSlice.actions;
export default curriculumProgressSlice.reducer; 