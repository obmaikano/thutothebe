import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subjectApi, { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../../api/services/subjectApi';

export interface SubjectsState {
  subjects: Subject[];
  currentSubject: Subject | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SubjectsState = {
  subjects: [],
  currentSubject: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subjectApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subjects');
    }
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchSubjectById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await subjectApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject');
    }
  }
);

export const fetchSubjectByCode = createAsyncThunk(
  'subjects/fetchSubjectByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await subjectApi.getByCode(code);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject');
    }
  }
);

export const fetchActiveSubjects = createAsyncThunk(
  'subjects/fetchActiveSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subjectApi.getActiveSubjects();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active subjects');
    }
  }
);

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData: CreateSubjectRequest, { rejectWithValue }) => {
    try {
      const response = await subjectApi.create(subjectData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subject');
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, subjectData }: { id: number; subjectData: UpdateSubjectRequest }, { rejectWithValue }) => {
    try {
      const response = await subjectApi.update(id, subjectData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subject');
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await subjectApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subject');
    }
  }
);

export const activateSubject = createAsyncThunk(
  'subjects/activateSubject',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await subjectApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate subject');
    }
  }
);

export const deactivateSubject = createAsyncThunk(
  'subjects/deactivateSubject',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await subjectApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate subject');
    }
  }
);

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    },
    clearSubjectsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subjects = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch subjects';
      })

      // Fetch subject by ID
      .addCase(fetchSubjectById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSubject = action.payload as Subject;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch subject';
      })

      // Fetch subject by code
      .addCase(fetchSubjectByCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubjectByCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSubject = action.payload as Subject;
      })
      .addCase(fetchSubjectByCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch subject';
      })

      // Fetch active subjects
      .addCase(fetchActiveSubjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveSubjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subjects = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveSubjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active subjects';
      })

      // Create subject
      .addCase(createSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subjects.push(action.payload as Subject);
        state.currentSubject = action.payload as Subject;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create subject';
      })

      // Update subject
      .addCase(updateSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSubject = action.payload as Subject;
        const index = state.subjects.findIndex(subject => subject.id === updatedSubject.id);
        if (index !== -1) {
          state.subjects[index] = updatedSubject;
        }
        state.currentSubject = updatedSubject;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update subject';
      })

      // Delete subject
      .addCase(deleteSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.subjects = state.subjects.filter(subject => subject.id !== id);
        if (state.currentSubject?.id === id) {
          state.currentSubject = null;
        }
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete subject';
      })

      // Activate subject
      .addCase(activateSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateSubject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.subjects.findIndex(subject => subject.id === id);
        if (index !== -1) {
          state.subjects[index] = { ...state.subjects[index], active: true };
        }
        if (state.currentSubject?.id === id) {
          state.currentSubject = { ...state.currentSubject, active: true };
        }
      })
      .addCase(activateSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate subject';
      })

      // Deactivate subject
      .addCase(deactivateSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateSubject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.subjects.findIndex(subject => subject.id === id);
        if (index !== -1) {
          state.subjects[index] = { ...state.subjects[index], active: false };
        }
        if (state.currentSubject?.id === id) {
          state.currentSubject = { ...state.currentSubject, active: false };
        }
      })
      .addCase(deactivateSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate subject';
      });
  }
});

export const { clearCurrentSubject, clearSubjectsError } = subjectsSlice.actions;
export default subjectsSlice.reducer; 