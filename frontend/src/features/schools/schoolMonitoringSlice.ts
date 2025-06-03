import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import schoolMonitoringApi, { SchoolMonitoring } from '../../api/services/schoolMonitoringApi';

export interface SchoolMonitoringState {
  schoolMonitoring: SchoolMonitoring[];
  currentSchoolMonitoring: SchoolMonitoring | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    schoolId?: number;
    regionId?: number;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
    thresholds?: {
      attendance?: number;
      usage?: number;
      compliance?: number;
      alerts?: number;
    };
  };
}

const initialState: SchoolMonitoringState = {
  schoolMonitoring: [],
  currentSchoolMonitoring: null,
  status: 'idle',
  error: null,
  filters: {}
};

// Async thunks
export const fetchSchoolMonitoringBySchool = createAsyncThunk(
  'schoolMonitoring/fetchBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolMonitoringBySchoolAndDate = createAsyncThunk(
  'schoolMonitoring/fetchBySchoolAndDate',
  async ({ schoolId, date }: { schoolId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getBySchoolAndDate(schoolId, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolMonitoringBySchoolAndDateRange = createAsyncThunk(
  'schoolMonitoring/fetchBySchoolAndDateRange',
  async ({ schoolId, startDate, endDate }: { schoolId: number; startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getBySchoolAndDateRange(schoolId, startDate, endDate);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolMonitoringByRegion = createAsyncThunk(
  'schoolMonitoring/fetchByRegion',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getByRegion(regionId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regional school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolMonitoringByRegionAndDate = createAsyncThunk(
  'schoolMonitoring/fetchByRegionAndDate',
  async ({ regionId, date }: { regionId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getByRegionAndDate(regionId, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regional school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolMonitoringByDate = createAsyncThunk(
  'schoolMonitoring/fetchByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getByDate(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLatestSchoolMonitoringForAllSchools = createAsyncThunk(
  'schoolMonitoring/fetchLatestForAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getLatestForAllSchools();
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch latest school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolsWithLowAttendance = createAsyncThunk(
  'schoolMonitoring/fetchSchoolsWithLowAttendance',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getSchoolsWithLowAttendance(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schools with low attendance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolsWithLowUsage = createAsyncThunk(
  'schoolMonitoring/fetchSchoolsWithLowUsage',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getSchoolsWithLowUsage(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schools with low usage';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolsWithDelayedGrading = createAsyncThunk(
  'schoolMonitoring/fetchSchoolsWithDelayedGrading',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getSchoolsWithDelayedGrading(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schools with delayed grading';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolsWithLowCompliance = createAsyncThunk(
  'schoolMonitoring/fetchSchoolsWithLowCompliance',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getSchoolsWithLowCompliance(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schools with low compliance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolsWithHighAlerts = createAsyncThunk(
  'schoolMonitoring/fetchSchoolsWithHighAlerts',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getSchoolsWithHighAlerts(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schools with high alerts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const calculateComplianceScore = createAsyncThunk(
  'schoolMonitoring/calculateComplianceScore',
  async ({ schoolId, date }: { schoolId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.calculateComplianceScore(schoolId, date);
      return { schoolId, complianceScore: response.data.data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate compliance score';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSchoolMonitoring = createAsyncThunk(
  'schoolMonitoring/updateSchoolMonitoring',
  async ({ schoolId, date }: { schoolId: number; date: string }, { rejectWithValue }) => {
    try {
      await schoolMonitoringApi.updateSchoolMonitoring(schoolId, date);
      return { schoolId, date };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update school monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const generateMonitoringData = createAsyncThunk(
  'schoolMonitoring/generateMonitoringData',
  async ({ schoolId, date }: { schoolId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.generateMonitoringData(schoolId, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const generateMonitoringDataForAllSchools = createAsyncThunk(
  'schoolMonitoring/generateForAllSchools',
  async (date: string, { rejectWithValue }) => {
    try {
      await schoolMonitoringApi.generateForAllSchools(date);
      return { date };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate monitoring data for all schools';
      return rejectWithValue(errorMessage);
    }
  }
);

const schoolMonitoringSlice = createSlice({
  name: 'schoolMonitoring',
  initialState,
  reducers: {
    clearCurrentSchoolMonitoring: (state) => {
      state.currentSchoolMonitoring = null;
    },
    clearSchoolMonitoringError: (state) => {
      state.error = null;
    },
    setSchoolMonitoringFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSchoolMonitoringFilters: (state) => {
      state.filters = {};
    },
    updateSchoolMonitoringStatus: (state, action) => {
      const monitoring = state.schoolMonitoring.find(m => m.id === action.payload.id);
      if (monitoring) {
        monitoring.active = action.payload.active;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by school
      .addCase(fetchSchoolMonitoringBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolMonitoringBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchoolMonitoring = action.payload as SchoolMonitoring;
      })
      .addCase(fetchSchoolMonitoringBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school monitoring data';
      })

      // Fetch by school and date
      .addCase(fetchSchoolMonitoringBySchoolAndDate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolMonitoringBySchoolAndDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchoolMonitoring = action.payload as SchoolMonitoring;
      })
      .addCase(fetchSchoolMonitoringBySchoolAndDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school monitoring data';
      })

      // Fetch by school and date range
      .addCase(fetchSchoolMonitoringBySchoolAndDateRange.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolMonitoringBySchoolAndDateRange.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchoolMonitoringBySchoolAndDateRange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school monitoring data';
      })

      // Fetch by region
      .addCase(fetchSchoolMonitoringByRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolMonitoringByRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchoolMonitoringByRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch regional school monitoring data';
      })

      // Fetch by region and date
      .addCase(fetchSchoolMonitoringByRegionAndDate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolMonitoringByRegionAndDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchoolMonitoringByRegionAndDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch regional school monitoring data';
      })

      // Fetch by date
      .addCase(fetchSchoolMonitoringByDate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolMonitoringByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchoolMonitoringByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school monitoring data';
      })

      // Fetch latest for all schools
      .addCase(fetchLatestSchoolMonitoringForAllSchools.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLatestSchoolMonitoringForAllSchools.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLatestSchoolMonitoringForAllSchools.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch latest school monitoring data';
      })

      // Fetch schools with low attendance
      .addCase(fetchSchoolsWithLowAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch schools with low usage
      .addCase(fetchSchoolsWithLowUsage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch schools with delayed grading
      .addCase(fetchSchoolsWithDelayedGrading.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch schools with low compliance
      .addCase(fetchSchoolsWithLowCompliance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch schools with high alerts
      .addCase(fetchSchoolsWithHighAlerts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Calculate compliance score
      .addCase(calculateComplianceScore.fulfilled, (state, action) => {
        const { schoolId, complianceScore } = action.payload;
        const monitoring = state.schoolMonitoring.find(m => m.schoolId === schoolId);
        if (monitoring) {
          monitoring.complianceScore = complianceScore;
        }
        if (state.currentSchoolMonitoring && state.currentSchoolMonitoring.schoolId === schoolId) {
          state.currentSchoolMonitoring.complianceScore = complianceScore;
        }
      })

      // Generate monitoring data
      .addCase(generateMonitoringData.fulfilled, (state, action) => {
        const newData = action.payload as SchoolMonitoring;
        const existingIndex = state.schoolMonitoring.findIndex(m => m.schoolId === newData.schoolId && m.monitoringDate === newData.monitoringDate);
        if (existingIndex >= 0) {
          state.schoolMonitoring[existingIndex] = newData;
        } else {
          state.schoolMonitoring.push(newData);
        }
        state.currentSchoolMonitoring = newData;
      });
  },
});

export const {
  clearCurrentSchoolMonitoring,
  clearSchoolMonitoringError,
  setSchoolMonitoringFilters,
  clearSchoolMonitoringFilters,
  updateSchoolMonitoringStatus,
} = schoolMonitoringSlice.actions;

export default schoolMonitoringSlice.reducer; 