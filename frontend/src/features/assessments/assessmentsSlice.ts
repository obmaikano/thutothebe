import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assessmentApi, { 
  Assessment, 
  CreateAssessmentRequest, 
  UpdateAssessmentRequest,
  SubmitAssessmentRequest,
  AssignPeerAssessmentsRequest
} from '../../api/services/assessmentApi';

export interface AssessmentsState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AssessmentsState = {
  assessments: [],
  currentAssessment: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchAssessments = createAsyncThunk(
  'assessments/fetchAssessments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assessments');
    }
  }
);

export const fetchAssessmentById = createAsyncThunk(
  'assessments/fetchAssessmentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assessment');
    }
  }
);

export const fetchAssessmentsBySubmissionId = createAsyncThunk(
  'assessments/fetchAssessmentsBySubmissionId',
  async (submissionId: number, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getBySubmissionId(submissionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assessments');
    }
  }
);

export const fetchAssessmentsByAssessorId = createAsyncThunk(
  'assessments/fetchAssessmentsByAssessorId',
  async (assessorId: number, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getByAssessorId(assessorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assessments');
    }
  }
);

export const fetchAssessmentsByCourseId = createAsyncThunk(
  'assessments/fetchAssessmentsByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assessments');
    }
  }
);

export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (assessmentData: CreateAssessmentRequest, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.create(assessmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create assessment');
    }
  }
);

export const updateAssessment = createAsyncThunk(
  'assessments/updateAssessment',
  async ({ id, assessmentData }: { id: number; assessmentData: UpdateAssessmentRequest }, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.update(id, assessmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update assessment');
    }
  }
);

export const deleteAssessment = createAsyncThunk(
  'assessments/deleteAssessment',
  async (id: number, { rejectWithValue }) => {
    try {
      await assessmentApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete assessment');
    }
  }
);

export const submitAssessment = createAsyncThunk(
  'assessments/submitAssessment',
  async ({ id, submitData }: { id: number; submitData: SubmitAssessmentRequest }, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.submit(id, submitData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit assessment');
    }
  }
);

export const updateAssessmentStatus = createAsyncThunk(
  'assessments/updateAssessmentStatus',
  async ({ id, status }: { id: number; status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' }, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.updateStatus(id, status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update assessment status');
    }
  }
);

export const assignPeerAssessments = createAsyncThunk(
  'assessments/assignPeerAssessments',
  async ({ submissionId, assignData }: { submissionId: number; assignData: AssignPeerAssessmentsRequest }, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.assignPeerAssessments(submissionId, assignData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign peer assessments');
    }
  }
);

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    clearCurrentAssessment: (state) => {
      state.currentAssessment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assessments
      .addCase(fetchAssessments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments = action.payload;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch assessment by ID
      .addCase(fetchAssessmentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssessmentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAssessment = action.payload;
      })
      .addCase(fetchAssessmentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch assessments by submission ID
      .addCase(fetchAssessmentsBySubmissionId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments = action.payload;
      })
      
      // Fetch assessments by assessor ID
      .addCase(fetchAssessmentsByAssessorId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments = action.payload;
      })
      
      // Fetch assessments by course ID
      .addCase(fetchAssessmentsByCourseId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments = action.payload;
      })
      
      // Create assessment
      .addCase(createAssessment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments.push(action.payload);
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update assessment
      .addCase(updateAssessment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.assessments.findIndex(assessment => assessment.id === action.payload.id);
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        if (state.currentAssessment?.id === action.payload.id) {
          state.currentAssessment = action.payload;
        }
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete assessment
      .addCase(deleteAssessment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments = state.assessments.filter(assessment => assessment.id !== action.payload);
        if (state.currentAssessment?.id === action.payload) {
          state.currentAssessment = null;
        }
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Submit assessment
      .addCase(submitAssessment.fulfilled, (state, action) => {
        const index = state.assessments.findIndex(assessment => assessment.id === action.payload.id);
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        if (state.currentAssessment?.id === action.payload.id) {
          state.currentAssessment = action.payload;
        }
      })
      
      // Update assessment status
      .addCase(updateAssessmentStatus.fulfilled, (state, action) => {
        const index = state.assessments.findIndex(assessment => assessment.id === action.payload.id);
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        if (state.currentAssessment?.id === action.payload.id) {
          state.currentAssessment = action.payload;
        }
      })
      
      // Assign peer assessments
      .addCase(assignPeerAssessments.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.assessments.push(...action.payload);
        }
      });
  },
});

export const { clearCurrentAssessment, clearError } = assessmentsSlice.actions;

export default assessmentsSlice.reducer; 