import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quizSubmissionApi, { QuizSubmission, CreateQuizSubmissionRequest, UpdateQuizSubmissionRequest } from '../../api/services/quizSubmissionApi';

export interface QuizSubmissionsState {
  submissions: QuizSubmission[];
  currentSubmission: QuizSubmission | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuizSubmissionsState = {
  submissions: [],
  currentSubmission: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchQuizSubmissions = createAsyncThunk(
  'quizSubmissions/fetchQuizSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz submissions');
    }
  }
);

export const fetchQuizSubmissionById = createAsyncThunk(
  'quizSubmissions/fetchQuizSubmissionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz submission');
    }
  }
);

export const fetchQuizSubmissionsByQuizId = createAsyncThunk(
  'quizSubmissions/fetchQuizSubmissionsByQuizId',
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.getByQuizId(quizId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz submissions');
    }
  }
);

export const fetchQuizSubmissionsByStudentId = createAsyncThunk(
  'quizSubmissions/fetchQuizSubmissionsByStudentId',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.getByStudentId(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz submissions');
    }
  }
);

export const fetchQuizSubmissionsByQuizIdAndStudentId = createAsyncThunk(
  'quizSubmissions/fetchQuizSubmissionsByQuizIdAndStudentId',
  async ({ quizId, studentId }: { quizId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.getByQuizIdAndStudentId(quizId, studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz submissions');
    }
  }
);

export const fetchQuizSubmissionsByStatus = createAsyncThunk(
  'quizSubmissions/fetchQuizSubmissionsByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz submissions');
    }
  }
);

export const createQuizSubmission = createAsyncThunk(
  'quizSubmissions/createQuizSubmission',
  async (submissionData: CreateQuizSubmissionRequest, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.create(submissionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create quiz submission');
    }
  }
);

export const updateQuizSubmission = createAsyncThunk(
  'quizSubmissions/updateQuizSubmission',
  async ({ id, submissionData }: { id: number; submissionData: UpdateQuizSubmissionRequest }, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.update(id, submissionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quiz submission');
    }
  }
);

export const startQuiz = createAsyncThunk(
  'quizSubmissions/startQuiz',
  async ({ quizId, studentId }: { quizId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.startQuiz(quizId, studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quizSubmissions/submitQuiz',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.submit(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

export const gradeQuizSubmission = createAsyncThunk(
  'quizSubmissions/gradeQuizSubmission',
  async ({ id, gradeData }: { id: number; gradeData: { score: number; feedback?: string } }, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.grade(id, gradeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to grade quiz submission');
    }
  }
);

export const deleteQuizSubmission = createAsyncThunk(
  'quizSubmissions/deleteQuizSubmission',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete quiz submission');
    }
  }
);

const quizSubmissionsSlice = createSlice({
  name: 'quizSubmissions',
  initialState,
  reducers: {
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
    clearQuizSubmissionsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all quiz submissions
      .addCase(fetchQuizSubmissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz submissions';
      })

      // Fetch quiz submission by ID
      .addCase(fetchQuizSubmissionById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizSubmissionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSubmission = action.payload as QuizSubmission;
      })
      .addCase(fetchQuizSubmissionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz submission';
      })

      // Fetch quiz submissions by quiz ID
      .addCase(fetchQuizSubmissionsByQuizId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizSubmissionsByQuizId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizSubmissionsByQuizId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz submissions';
      })

      // Fetch quiz submissions by student ID
      .addCase(fetchQuizSubmissionsByStudentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizSubmissionsByStudentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizSubmissionsByStudentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz submissions';
      })

      // Fetch quiz submissions by quiz ID and student ID
      .addCase(fetchQuizSubmissionsByQuizIdAndStudentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizSubmissionsByQuizIdAndStudentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizSubmissionsByQuizIdAndStudentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz submissions';
      })

      // Fetch quiz submissions by status
      .addCase(fetchQuizSubmissionsByStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizSubmissionsByStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuizSubmissionsByStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch quiz submissions';
      })

      // Create quiz submission
      .addCase(createQuizSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createQuizSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions.push(action.payload as QuizSubmission);
        state.currentSubmission = action.payload as QuizSubmission;
      })
      .addCase(createQuizSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create quiz submission';
      })

      // Update quiz submission
      .addCase(updateQuizSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateQuizSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSubmission = action.payload as QuizSubmission;
        const index = state.submissions.findIndex(submission => submission.id === updatedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = updatedSubmission;
        }
        state.currentSubmission = updatedSubmission;
      })
      .addCase(updateQuizSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update quiz submission';
      })

      // Start quiz
      .addCase(startQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const startedQuiz = action.payload as QuizSubmission;
        const index = state.submissions.findIndex(submission => submission.id === startedQuiz.id);
        if (index !== -1) {
          state.submissions[index] = startedQuiz;
        }
        state.currentSubmission = startedQuiz;
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to start quiz';
      })

      // Submit quiz
      .addCase(submitQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const submittedQuiz = action.payload as QuizSubmission;
        const index = state.submissions.findIndex(submission => submission.id === submittedQuiz.id);
        if (index !== -1) {
          state.submissions[index] = submittedQuiz;
        }
        state.currentSubmission = submittedQuiz;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to submit quiz';
      })

      // Grade quiz submission
      .addCase(gradeQuizSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(gradeQuizSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const gradedSubmission = action.payload as QuizSubmission;
        const index = state.submissions.findIndex(submission => submission.id === gradedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = gradedSubmission;
        }
        state.currentSubmission = gradedSubmission;
      })
      .addCase(gradeQuizSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to grade quiz submission';
      })

      // Delete quiz submission
      .addCase(deleteQuizSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteQuizSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.submissions = state.submissions.filter(submission => submission.id !== id);
        if (state.currentSubmission?.id === id) {
          state.currentSubmission = null;
        }
      })
      .addCase(deleteQuizSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete quiz submission';
      });
  }
});

export const { clearCurrentSubmission, clearQuizSubmissionsError } = quizSubmissionsSlice.actions;
export default quizSubmissionsSlice.reducer; 