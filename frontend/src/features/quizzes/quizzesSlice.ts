import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quizApi, { Quiz, CreateQuizRequest, UpdateQuizRequest } from '../../api/services/quizApi';

export interface QuizzesState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quizzes/fetchQuizById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const fetchQuizByCode = createAsyncThunk(
  'quizzes/fetchQuizByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await quizApi.getByCode(code);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const fetchQuizzesByCourseId = createAsyncThunk(
  'quizzes/fetchQuizzesByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.getByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizzesByInstructorId = createAsyncThunk(
  'quizzes/fetchQuizzesByInstructorId',
  async (instructorId: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.getByInstructorId(instructorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizzesByStatus = createAsyncThunk(
  'quizzes/fetchQuizzesByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await quizApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchActiveQuizzesByCourseId = createAsyncThunk(
  'quizzes/fetchActiveQuizzesByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.getActiveByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active quizzes');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async (quizData: CreateQuizRequest, { rejectWithValue }) => {
    try {
      const response = await quizApi.create(quizData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create quiz');
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quizzes/updateQuiz',
  async ({ id, quizData }: { id: number; quizData: UpdateQuizRequest }, { rejectWithValue }) => {
    try {
      const response = await quizApi.update(id, quizData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete quiz');
    }
  }
);

export const activateQuiz = createAsyncThunk(
  'quizzes/activateQuiz',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate quiz');
    }
  }
);

export const deactivateQuiz = createAsyncThunk(
  'quizzes/deactivateQuiz',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate quiz');
    }
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearQuizzesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quizzes';
      })

      // Fetch quiz by ID
      .addCase(fetchQuizById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuiz = action.payload as Quiz;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz';
      })

      // Fetch quiz by code
      .addCase(fetchQuizByCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizByCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuiz = action.payload as Quiz;
      })
      .addCase(fetchQuizByCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz';
      })

      // Fetch quizzes by course ID
      .addCase(fetchQuizzesByCourseId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzesByCourseId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizzesByCourseId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quizzes';
      })

      // Fetch quizzes by instructor ID
      .addCase(fetchQuizzesByInstructorId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzesByInstructorId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizzesByInstructorId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quizzes';
      })

      // Fetch quizzes by status
      .addCase(fetchQuizzesByStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzesByStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizzesByStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quizzes';
      })

      // Fetch active quizzes by course ID
      .addCase(fetchActiveQuizzesByCourseId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveQuizzesByCourseId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveQuizzesByCourseId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active quizzes';
      })

      // Create quiz
      .addCase(createQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes.push(action.payload as Quiz);
        state.currentQuiz = action.payload as Quiz;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create quiz';
      })

      // Update quiz
      .addCase(updateQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedQuiz = action.payload as Quiz;
        const index = state.quizzes.findIndex(quiz => quiz.id === updatedQuiz.id);
        if (index !== -1) {
          state.quizzes[index] = updatedQuiz;
        }
        state.currentQuiz = updatedQuiz;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update quiz';
      })

      // Delete quiz
      .addCase(deleteQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.quizzes = state.quizzes.filter(quiz => quiz.id !== id);
        if (state.currentQuiz?.id === id) {
          state.currentQuiz = null;
        }
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete quiz';
      })

      // Activate quiz
      .addCase(activateQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.quizzes.findIndex(quiz => quiz.id === id);
        if (index !== -1) {
          state.quizzes[index] = { ...state.quizzes[index], active: true };
        }
        if (state.currentQuiz?.id === id) {
          state.currentQuiz = { ...state.currentQuiz, active: true };
        }
      })
      .addCase(activateQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate quiz';
      })

      // Deactivate quiz
      .addCase(deactivateQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.quizzes.findIndex(quiz => quiz.id === id);
        if (index !== -1) {
          state.quizzes[index] = { ...state.quizzes[index], active: false };
        }
        if (state.currentQuiz?.id === id) {
          state.currentQuiz = { ...state.currentQuiz, active: false };
        }
      })
      .addCase(deactivateQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate quiz';
      });
  }
});

export const { clearCurrentQuiz, clearQuizzesError } = quizzesSlice.actions;
export default quizzesSlice.reducer; 