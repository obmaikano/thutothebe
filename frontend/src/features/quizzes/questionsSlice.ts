import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionApi, { Question, CreateQuestionRequest, UpdateQuestionRequest } from '../../api/services/questionApi';

export interface QuestionsState {
  questions: Question[];
  currentQuestion: Question | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  currentQuestion: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const fetchQuestionById = createAsyncThunk(
  'questions/fetchQuestionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await questionApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch question');
    }
  }
);

export const fetchQuestionsByQuizId = createAsyncThunk(
  'questions/fetchQuestionsByQuizId',
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await questionApi.getByQuizId(quizId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const fetchQuestionsByQuizIdAndType = createAsyncThunk(
  'questions/fetchQuestionsByQuizIdAndType',
  async ({ quizId, type }: { quizId: number; type: string }, { rejectWithValue }) => {
    try {
      const response = await questionApi.getByQuizIdAndType(quizId, type);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'questions/createQuestion',
  async (questionData: CreateQuestionRequest, { rejectWithValue }) => {
    try {
      const response = await questionApi.create(questionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async ({ id, questionData }: { id: number; questionData: UpdateQuestionRequest }, { rejectWithValue }) => {
    try {
      const response = await questionApi.update(id, questionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update question');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/deleteQuestion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await questionApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete question');
    }
  }
);

export const activateQuestion = createAsyncThunk(
  'questions/activateQuestion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await questionApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate question');
    }
  }
);

export const deactivateQuestion = createAsyncThunk(
  'questions/deactivateQuestion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await questionApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate question');
    }
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
    clearQuestionsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all questions
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch questions';
      })

      // Fetch question by ID
      .addCase(fetchQuestionById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuestion = action.payload as Question;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch question';
      })

      // Fetch questions by quiz ID
      .addCase(fetchQuestionsByQuizId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestionsByQuizId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuestionsByQuizId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch questions';
      })

      // Fetch questions by quiz ID and type
      .addCase(fetchQuestionsByQuizIdAndType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestionsByQuizIdAndType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuestionsByQuizIdAndType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch questions';
      })

      // Create question
      .addCase(createQuestion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions.push(action.payload as Question);
        state.currentQuestion = action.payload as Question;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create question';
      })

      // Update question
      .addCase(updateQuestion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedQuestion = action.payload as Question;
        const index = state.questions.findIndex(question => question.id === updatedQuestion.id);
        if (index !== -1) {
          state.questions[index] = updatedQuestion;
        }
        state.currentQuestion = updatedQuestion;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update question';
      })

      // Delete question
      .addCase(deleteQuestion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.questions = state.questions.filter(question => question.id !== id);
        if (state.currentQuestion?.id === id) {
          state.currentQuestion = null;
        }
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete question';
      })

      // Activate question
      .addCase(activateQuestion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.questions.findIndex(question => question.id === id);
        if (index !== -1) {
          state.questions[index] = { ...state.questions[index], active: true };
        }
        if (state.currentQuestion?.id === id) {
          state.currentQuestion = { ...state.currentQuestion, active: true };
        }
      })
      .addCase(activateQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate question';
      })

      // Deactivate question
      .addCase(deactivateQuestion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.questions.findIndex(question => question.id === id);
        if (index !== -1) {
          state.questions[index] = { ...state.questions[index], active: false };
        }
        if (state.currentQuestion?.id === id) {
          state.currentQuestion = { ...state.currentQuestion, active: false };
        }
      })
      .addCase(deactivateQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate question';
      });
  }
});

export const { clearCurrentQuestion, clearQuestionsError } = questionsSlice.actions;
export default questionsSlice.reducer; 