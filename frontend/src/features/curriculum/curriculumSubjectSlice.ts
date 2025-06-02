import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import curriculumSubjectApi, { 
  CurriculumSubjectDTO, 
  Subject, 
  UpdateCurriculumSubjectRequest 
} from '../../api/services/curriculumSubjectApi';

interface CurriculumSubjectState {
  curriculumSubjects: CurriculumSubjectDTO[];
  availableSubjects: Subject[];
  statistics: {
    totalSubjects: number;
    coreSubjects: number;
    electiveSubjects: number;
    totalAllocatedHours: number;
    totalWeightPercentage: number;
  } | null;
  loading: boolean;
  error: string | null;
  operationLoading: boolean;
  notification: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
}

const initialState: CurriculumSubjectState = {
  curriculumSubjects: [],
  availableSubjects: [],
  statistics: null,
  loading: false,
  error: null,
  operationLoading: false,
  notification: null,
};

// Async thunks
export const fetchCurriculumSubjects = createAsyncThunk(
  'curriculumSubject/fetchCurriculumSubjects',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumSubjectApi.getCurriculumSubjects(curriculumId);
      return response.data.data as CurriculumSubjectDTO[];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch curriculum subjects';
      return rejectWithValue(message);
    }
  }
);

export const fetchAvailableSubjects = createAsyncThunk(
  'curriculumSubject/fetchAvailableSubjects',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumSubjectApi.getAvailableSubjects(curriculumId);
      return response.data.data as Subject[];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch available subjects';
      return rejectWithValue(message);
    }
  }
);

export const addSubjectToCurriculum = createAsyncThunk(
  'curriculumSubject/addSubjectToCurriculum',
  async (
    params: {
      curriculumId: number;
      subjectId: number;
      isCore: boolean;
      allocatedHours?: number;
      weightPercentage?: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await curriculumSubjectApi.addSubjectToCurriculum(
        params.curriculumId,
        params.subjectId,
        params.isCore,
        params.allocatedHours,
        params.weightPercentage
      );
      
      // Refresh both lists
      dispatch(fetchCurriculumSubjects(params.curriculumId));
      dispatch(fetchAvailableSubjects(params.curriculumId));
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add subject to curriculum';
      return rejectWithValue(message);
    }
  }
);

export const removeSubjectFromCurriculum = createAsyncThunk(
  'curriculumSubject/removeSubjectFromCurriculum',
  async (
    params: { curriculumId: number; subjectId: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await curriculumSubjectApi.removeSubjectFromCurriculum(
        params.curriculumId,
        params.subjectId
      );
      
      // Refresh both lists
      dispatch(fetchCurriculumSubjects(params.curriculumId));
      dispatch(fetchAvailableSubjects(params.curriculumId));
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove subject from curriculum';
      return rejectWithValue(message);
    }
  }
);

export const updateCurriculumSubject = createAsyncThunk(
  'curriculumSubject/updateCurriculumSubject',
  async (
    params: {
      curriculumId: number;
      subjectId: number;
      updateData: UpdateCurriculumSubjectRequest;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await curriculumSubjectApi.updateCurriculumSubject(
        params.curriculumId,
        params.subjectId,
        params.updateData
      );
      
      // Refresh curriculum subjects list
      dispatch(fetchCurriculumSubjects(params.curriculumId));
      
      return response.data.data as CurriculumSubjectDTO;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update curriculum subject';
      return rejectWithValue(message);
    }
  }
);

export const fetchCurriculumSubjectStatistics = createAsyncThunk(
  'curriculumSubject/fetchCurriculumSubjectStatistics',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumSubjectApi.getCurriculumSubjectStatistics(curriculumId);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch curriculum subject statistics';
      return rejectWithValue(message);
    }
  }
);

const curriculumSubjectSlice = createSlice({
  name: 'curriculumSubject',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    clearCurriculumSubjects: (state) => {
      state.curriculumSubjects = [];
      state.availableSubjects = [];
      state.error = null;
      state.notification = null;
    },
    setNotification: (state, action: PayloadAction<{ type: 'success' | 'error' | 'info'; message: string }>) => {
      state.notification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch curriculum subjects
      .addCase(fetchCurriculumSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculumSubjects = action.payload;
      })
      .addCase(fetchCurriculumSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.notification = {
          type: 'error',
          message: action.payload as string
        };
      })
      
      // Fetch available subjects
      .addCase(fetchAvailableSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSubjects = action.payload;
      })
      .addCase(fetchAvailableSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.notification = {
          type: 'error',
          message: action.payload as string
        };
      })
      
      // Add subject to curriculum
      .addCase(addSubjectToCurriculum.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addSubjectToCurriculum.fulfilled, (state) => {
        state.operationLoading = false;
        state.notification = {
          type: 'success',
          message: 'Subject added to curriculum successfully'
        };
      })
      .addCase(addSubjectToCurriculum.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload as string;
        state.notification = {
          type: 'error',
          message: action.payload as string
        };
      })
      
      // Remove subject from curriculum
      .addCase(removeSubjectFromCurriculum.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(removeSubjectFromCurriculum.fulfilled, (state) => {
        state.operationLoading = false;
        state.notification = {
          type: 'success',
          message: 'Subject removed from curriculum successfully'
        };
      })
      .addCase(removeSubjectFromCurriculum.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload as string;
        state.notification = {
          type: 'error',
          message: action.payload as string
        };
      })
      
      // Update curriculum subject
      .addCase(updateCurriculumSubject.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateCurriculumSubject.fulfilled, (state) => {
        state.operationLoading = false;
        state.notification = {
          type: 'success',
          message: 'Curriculum subject updated successfully'
        };
      })
      .addCase(updateCurriculumSubject.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload as string;
        state.notification = {
          type: 'error',
          message: action.payload as string
        };
      })
      
      // Fetch curriculum subject statistics
      .addCase(fetchCurriculumSubjectStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumSubjectStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchCurriculumSubjectStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.notification = {
          type: 'error',
          message: action.payload as string
        };
      });
  },
});

export const { clearError, clearNotification, clearCurriculumSubjects, setNotification } = curriculumSubjectSlice.actions;
export default curriculumSubjectSlice.reducer; 