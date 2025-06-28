import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import lessonApi, { Lesson, CreateLessonRequest, UpdateLessonRequest } from '../../api/services/lessonApi';

// ==================== INTERFACES ====================
export interface LessonsState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
  analytics: {
    totalLessons: number;
    plannedLessons: number;
    scheduledLessons: number;
    inProgressLessons: number;
    completedLessons: number;
    cancelledLessons: number;
    completionRate: number;
  } | null;
}

// ==================== INITIAL STATE ====================
const initialState: LessonsState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  analytics: null
};

// ==================== ASYNC THUNKS ====================
export const fetchLessons = createAsyncThunk(
  'lessons/fetchLessons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lessonApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons');
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchLessonById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await lessonApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson');
    }
  }
);

export const createLesson = createAsyncThunk(
  'lessons/createLesson',
  async (lessonData: CreateLessonRequest, { rejectWithValue }) => {
    try {
      const response = await lessonApi.create(lessonData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lesson');
    }
  }
);

export const updateLesson = createAsyncThunk(
  'lessons/updateLesson',
  async ({ id, lessonData }: { id: number; lessonData: UpdateLessonRequest }, { rejectWithValue }) => {
    try {
      const response = await lessonApi.update(id, lessonData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lesson');
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'lessons/deleteLesson',
  async (id: number, { rejectWithValue }) => {
    try {
      await lessonApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lesson');
    }
  }
);

export const fetchLessonsByCourseId = createAsyncThunk(
  'lessons/fetchLessonsByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await lessonApi.getByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons by course');
    }
  }
);

export const fetchLessonsByInstructorId = createAsyncThunk(
  'lessons/fetchLessonsByInstructorId',
  async (instructorId: number, { rejectWithValue }) => {
    try {
      const response = await lessonApi.getByInstructorId(instructorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons by instructor');
    }
  }
);

export const fetchLessonsByStatus = createAsyncThunk(
  'lessons/fetchLessonsByStatus',
  async (status: Lesson['status'], { rejectWithValue }) => {
    try {
      const response = await lessonApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons by status');
    }
  }
);

export const fetchLessonAnalytics = createAsyncThunk(
  'lessons/fetchLessonAnalytics',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await lessonApi.getLessonAnalytics(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson analytics');
    }
  }
);

export const scheduleLesson = createAsyncThunk(
  'lessons/scheduleLesson',
  async ({ lessonId, scheduledDate }: { lessonId: number; scheduledDate: string }, { rejectWithValue }) => {
    try {
      const response = await lessonApi.scheduleLesson(lessonId, scheduledDate);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule lesson');
    }
  }
);

export const startLesson = createAsyncThunk(
  'lessons/startLesson',
  async (lessonId: number, { rejectWithValue }) => {
    try {
      const response = await lessonApi.startLesson(lessonId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start lesson');
    }
  }
);

export const completeLesson = createAsyncThunk(
  'lessons/completeLesson',
  async (lessonId: number, { rejectWithValue }) => {
    try {
      const response = await lessonApi.completeLesson(lessonId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete lesson');
    }
  }
);

export const cancelLesson = createAsyncThunk(
  'lessons/cancelLesson',
  async ({ lessonId, reason }: { lessonId: number; reason: string }, { rejectWithValue }) => {
    try {
      const response = await lessonApi.cancelLesson(lessonId, reason);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel lesson');
    }
  }
);

export const postponeLesson = createAsyncThunk(
  'lessons/postponeLesson',
  async ({ lessonId, newScheduledDate }: { lessonId: number; newScheduledDate: string }, { rejectWithValue }) => {
    try {
      const response = await lessonApi.postponeLesson(lessonId, newScheduledDate);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to postpone lesson');
    }
  }
);

// ==================== SLICE ====================
const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all lessons
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson by ID
    builder
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create lesson
    builder
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons.push(action.payload);
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update lesson
    builder
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        if (state.currentLesson?.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete lesson
    builder
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
        if (state.currentLesson?.id === action.payload) {
          state.currentLesson = null;
        }
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lessons by course ID
    builder
      .addCase(fetchLessonsByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lessons by instructor ID
    builder
      .addCase(fetchLessonsByInstructorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByInstructorId.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByInstructorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lessons by status
    builder
      .addCase(fetchLessonsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson analytics
    builder
      .addCase(fetchLessonAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchLessonAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Schedule lesson
    builder
      .addCase(scheduleLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        if (state.currentLesson?.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(scheduleLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Start lesson
    builder
      .addCase(startLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        if (state.currentLesson?.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(startLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Complete lesson
    builder
      .addCase(completeLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        if (state.currentLesson?.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(completeLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel lesson
    builder
      .addCase(cancelLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        if (state.currentLesson?.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(cancelLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Postpone lesson
    builder
      .addCase(postponeLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postponeLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        if (state.currentLesson?.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(postponeLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// ==================== EXPORTS ====================
export const { clearError, clearCurrentLesson, clearAnalytics } = lessonsSlice.actions;
export default lessonsSlice.reducer; 