import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import curriculumProgressApi, { CurriculumProgressDTO } from '../../api/services/curriculumProgressApi';

// ==================== STATE INTERFACE ====================

export interface CurriculumProgressState {
  progressRecords: CurriculumProgressDTO[];
  currentProgress: CurriculumProgressDTO | null;
  overdueProgress: CurriculumProgressDTO[];
  progressSummary: {
    totalSchools: number;
    completedSchools: number;
    inProgressSchools: number;
    notStartedSchools: number;
    overdueSchools: number;
    averageProgress: number;
  } | null;
  progressStatistics: {
    totalImplementations: number;
    completedImplementations: number;
    inProgressImplementations: number;
    overdueImplementations: number;
    averageCompletionTime: number;
    successRate: number;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedCurriculumId: number | null;
  selectedSchoolId: number | null;
  selectedRegionId: number | null;
}

const initialState: CurriculumProgressState = {
  progressRecords: [],
  currentProgress: null,
  overdueProgress: [],
  progressSummary: null,
  progressStatistics: null,
  status: 'idle',
  error: null,
  selectedCurriculumId: null,
  selectedSchoolId: null,
  selectedRegionId: null
};

// ==================== ASYNC THUNKS ====================

type CreateProgressData = Omit<CurriculumProgressDTO, 'id' | 'createdAt' | 'updatedAt' | 'isOverdue' | 'daysOverdue' | 'curriculumTitle' | 'schoolName' | 'regionName' | 'assignedTeacherName' | 'supervisorName' | 'lastUpdatedByName'>;

export const fetchAllProgress = createAsyncThunk(
  'curriculumProgress/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress records');
    }
  }
);

export const fetchProgressById = createAsyncThunk(
  'curriculumProgress/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress record');
    }
  }
);

export const createProgress = createAsyncThunk(
  'curriculumProgress/create',
  async (progressData: CreateProgressData, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.create(progressData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create progress record');
    }
  }
);

export const updateProgress = createAsyncThunk(
  'curriculumProgress/update',
  async ({ id, progressData }: { id: number; progressData: Partial<CurriculumProgressDTO> }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.update(id, progressData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress record');
    }
  }
);

export const deleteProgress = createAsyncThunk(
  'curriculumProgress/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await curriculumProgressApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete progress record');
    }
  }
);

export const fetchProgressByCurriculum = createAsyncThunk(
  'curriculumProgress/fetchByCurriculum',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getByCurriculumId(curriculumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum progress');
    }
  }
);

export const fetchProgressBySchool = createAsyncThunk(
  'curriculumProgress/fetchBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getBySchoolId(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school progress');
    }
  }
);

export const fetchOverdueProgress = createAsyncThunk(
  'curriculumProgress/fetchOverdue',
  async (date: string | undefined, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getOverdueProgress(date);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue progress');
    }
  }
);

export const updateImplementationStatus = createAsyncThunk(
  'curriculumProgress/updateStatus',
  async (params: {
    progressId: number;
    status: CurriculumProgressDTO['implementationStatus'];
    progressPercentage?: number;
    updatedById?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.updateImplementationStatus(
        params.progressId,
        params.status,
        params.progressPercentage,
        params.updatedById
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update implementation status');
    }
  }
);

export const fetchProgressSummary = createAsyncThunk(
  'curriculumProgress/fetchSummary',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const summary = await curriculumProgressApi.getProgressSummary(curriculumId);
      return summary;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress summary');
    }
  }
);

export const fetchProgressByRegion = createAsyncThunk(
  'curriculumProgress/fetchByRegion',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumProgressApi.getProgressByRegion(regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch region progress');
    }
  }
);

export const fetchProgressStatistics = createAsyncThunk(
  'curriculumProgress/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const statistics = await curriculumProgressApi.getProgressStatistics();
      return statistics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress statistics');
    }
  }
);

// ==================== SLICE ====================

const curriculumProgressSlice = createSlice({
  name: 'curriculumProgress',
  initialState,
  reducers: {
    clearCurrentProgress: (state) => {
      state.currentProgress = null;
    },
    clearProgressError: (state) => {
      state.error = null;
    },
    setSelectedCurriculumId: (state, action) => {
      state.selectedCurriculumId = action.payload;
    },
    setSelectedSchoolId: (state, action) => {
      state.selectedSchoolId = action.payload;
    },
    setSelectedRegionId: (state, action) => {
      state.selectedRegionId = action.payload;
    },
    clearProgressSummary: (state) => {
      state.progressSummary = null;
    },
    clearProgressStatistics: (state) => {
      state.progressStatistics = null;
    },
    clearOverdueProgress: (state) => {
      state.overdueProgress = [];
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
        state.error = action.payload as string;
      })

      // Fetch progress by ID
      .addCase(fetchProgressById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProgress = action.payload;
      })
      .addCase(fetchProgressById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Create progress
      .addCase(createProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.progressRecords.push(action.payload);
        }
      })
      .addCase(createProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Update progress
      .addCase(updateProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const index = state.progressRecords.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.progressRecords[index] = action.payload;
          }
          if (state.currentProgress?.id === action.payload.id) {
            state.currentProgress = action.payload;
          }
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Delete progress
      .addCase(deleteProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = state.progressRecords.filter(p => p.id !== action.payload);
        if (state.currentProgress?.id === action.payload) {
          state.currentProgress = null;
        }
      })
      .addCase(deleteProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch progress by curriculum
      .addCase(fetchProgressByCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressByCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProgressByCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch progress by school
      .addCase(fetchProgressBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProgressBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch overdue progress
      .addCase(fetchOverdueProgress.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOverdueProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overdueProgress = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOverdueProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Update implementation status
      .addCase(updateImplementationStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateImplementationStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const index = state.progressRecords.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.progressRecords[index] = action.payload;
          }
          if (state.currentProgress?.id === action.payload.id) {
            state.currentProgress = action.payload;
          }
        }
      })
      .addCase(updateImplementationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch progress summary
      .addCase(fetchProgressSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressSummary = action.payload;
      })
      .addCase(fetchProgressSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch progress by region
      .addCase(fetchProgressByRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressByRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProgressByRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch progress statistics
      .addCase(fetchProgressStatistics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressStatistics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progressStatistics = action.payload;
      })
      .addCase(fetchProgressStatistics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const {
  clearCurrentProgress,
  clearProgressError,
  setSelectedCurriculumId,
  setSelectedSchoolId,
  setSelectedRegionId,
  clearProgressSummary,
  clearProgressStatistics,
  clearOverdueProgress
} = curriculumProgressSlice.actions;

export default curriculumProgressSlice.reducer; 