import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import lessonCompletionApi, { LessonCompletion, CreateLessonCompletionRequest, UpdateLessonCompletionRequest } from '../../api/services/lessonCompletionApi';

// ==================== INTERFACES ====================
export interface LessonCompletionsState {
  lessonCompletions: LessonCompletion[];
  currentLessonCompletion: LessonCompletion | null;
  loading: boolean;
  error: string | null;
  analytics: {
    totalCompletions: number;
    completedCompletions: number;
    inProgressCompletions: number;
    failedCompletions: number;
    pendingReviewCompletions: number;
    averageScore: number;
    averageCompletionTime: number;
    completionRate: number;
  } | null;
}

// ==================== INITIAL STATE ====================
const initialState: LessonCompletionsState = {
  lessonCompletions: [],
  currentLessonCompletion: null,
  loading: false,
  error: null,
  analytics: null
};

// ==================== ASYNC THUNKS ====================
export const fetchLessonCompletions = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completions');
    }
  }
);

export const fetchLessonCompletionById = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completion');
    }
  }
);

export const createLessonCompletion = createAsyncThunk(
  'lessonCompletions/createLessonCompletion',
  async (completionData: CreateLessonCompletionRequest, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.create(completionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lesson completion');
    }
  }
);

export const updateLessonCompletion = createAsyncThunk(
  'lessonCompletions/updateLessonCompletion',
  async ({ id, completionData }: { id: number; completionData: UpdateLessonCompletionRequest }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.update(id, completionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lesson completion');
    }
  }
);

export const deleteLessonCompletion = createAsyncThunk(
  'lessonCompletions/deleteLessonCompletion',
  async (id: number, { rejectWithValue }) => {
    try {
      await lessonCompletionApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lesson completion');
    }
  }
);

export const fetchLessonCompletionsByLessonId = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletionsByLessonId',
  async (lessonId: number, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getByLessonId(lessonId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completions by lesson');
    }
  }
);

export const fetchLessonCompletionsByStudentId = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletionsByStudentId',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getByStudentId(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completions by student');
    }
  }
);

export const fetchLessonCompletionByLessonIdAndStudentId = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletionByLessonIdAndStudentId',
  async ({ lessonId, studentId }: { lessonId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getByLessonIdAndStudentId(lessonId, studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completion');
    }
  }
);

export const fetchLessonCompletionsByStatus = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletionsByStatus',
  async (status: LessonCompletion['status'], { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completions by status');
    }
  }
);

export const fetchLessonCompletionAnalytics = createAsyncThunk(
  'lessonCompletions/fetchLessonCompletionAnalytics',
  async (lessonId: number, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.getLessonCompletionAnalytics(lessonId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson completion analytics');
    }
  }
);

export const startCompletion = createAsyncThunk(
  'lessonCompletions/startCompletion',
  async ({ lessonId, studentId }: { lessonId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.startCompletion(lessonId, studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start lesson completion');
    }
  }
);

export const completeCompletion = createAsyncThunk(
  'lessonCompletions/completeCompletion',
  async ({ completionId, score, maxScore, feedback }: { completionId: number; score: number; maxScore: number; feedback?: string }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.completeCompletion(completionId, score, maxScore, feedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete lesson completion');
    }
  }
);

export const failCompletion = createAsyncThunk(
  'lessonCompletions/failCompletion',
  async ({ completionId, feedback }: { completionId: number; feedback?: string }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.failCompletion(completionId, feedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fail lesson completion');
    }
  }
);

export const markForReview = createAsyncThunk(
  'lessonCompletions/markForReview',
  async ({ completionId, feedback }: { completionId: number; feedback?: string }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.markForReview(completionId, feedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark lesson completion for review');
    }
  }
);

export const updateInstructorFeedback = createAsyncThunk(
  'lessonCompletions/updateInstructorFeedback',
  async ({ completionId, instructorFeedback }: { completionId: number; instructorFeedback: string }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.updateInstructorFeedback(completionId, instructorFeedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update instructor feedback');
    }
  }
);

export const updateStudentFeedback = createAsyncThunk(
  'lessonCompletions/updateStudentFeedback',
  async ({ completionId, studentFeedback }: { completionId: number; studentFeedback: string }, { rejectWithValue }) => {
    try {
      const response = await lessonCompletionApi.updateStudentFeedback(completionId, studentFeedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update student feedback');
    }
  }
);

// ==================== SLICE ====================
const lessonCompletionsSlice = createSlice({
  name: 'lessonCompletions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLessonCompletion: (state) => {
      state.currentLessonCompletion = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all lesson completions
    builder
      .addCase(fetchLessonCompletions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletions.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonCompletions = action.payload;
      })
      .addCase(fetchLessonCompletions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson completion by ID
    builder
      .addCase(fetchLessonCompletionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLessonCompletion = action.payload;
      })
      .addCase(fetchLessonCompletionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create lesson completion
    builder
      .addCase(createLessonCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLessonCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonCompletions.push(action.payload);
      })
      .addCase(createLessonCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update lesson completion
    builder
      .addCase(updateLessonCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonCompletion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(updateLessonCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete lesson completion
    builder
      .addCase(deleteLessonCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLessonCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonCompletions = state.lessonCompletions.filter(completion => completion.id !== action.payload);
        if (state.currentLessonCompletion?.id === action.payload) {
          state.currentLessonCompletion = null;
        }
      })
      .addCase(deleteLessonCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson completions by lesson ID
    builder
      .addCase(fetchLessonCompletionsByLessonId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletionsByLessonId.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonCompletions = action.payload;
      })
      .addCase(fetchLessonCompletionsByLessonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson completions by student ID
    builder
      .addCase(fetchLessonCompletionsByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletionsByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonCompletions = action.payload;
      })
      .addCase(fetchLessonCompletionsByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson completion by lesson ID and student ID
    builder
      .addCase(fetchLessonCompletionByLessonIdAndStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletionByLessonIdAndStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLessonCompletion = action.payload;
      })
      .addCase(fetchLessonCompletionByLessonIdAndStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson completions by status
    builder
      .addCase(fetchLessonCompletionsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletionsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonCompletions = action.payload;
      })
      .addCase(fetchLessonCompletionsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson completion analytics
    builder
      .addCase(fetchLessonCompletionAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCompletionAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchLessonCompletionAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Start completion
    builder
      .addCase(startCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startCompletion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(startCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Complete completion
    builder
      .addCase(completeCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeCompletion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(completeCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fail completion
    builder
      .addCase(failCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(failCompletion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(failCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark for review
    builder
      .addCase(markForReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markForReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(markForReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update instructor feedback
    builder
      .addCase(updateInstructorFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstructorFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(updateInstructorFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update student feedback
    builder
      .addCase(updateStudentFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessonCompletions.findIndex(completion => completion.id === action.payload.id);
        if (index !== -1) {
          state.lessonCompletions[index] = action.payload;
        }
        if (state.currentLessonCompletion?.id === action.payload.id) {
          state.currentLessonCompletion = action.payload;
        }
      })
      .addCase(updateStudentFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// ==================== EXPORTS ====================
export const { clearError, clearCurrentLessonCompletion, clearAnalytics } = lessonCompletionsSlice.actions;
export default lessonCompletionsSlice.reducer; 