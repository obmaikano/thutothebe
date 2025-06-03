import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import regionMonitoringApi, { RegionMonitoring } from '../../api/services/regionMonitoringApi';

export interface RegionMonitoringState {
  regionMonitoring: RegionMonitoring[];
  currentRegionMonitoring: RegionMonitoring | null;
  nationalStats: {
    averageAttendanceRate?: number;
    averageComplianceScore?: number;
    totalSchools?: number;
    totalTeachers?: number;
    totalStudents?: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
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
      performance?: number;
    };
  };
}

const initialState: RegionMonitoringState = {
  regionMonitoring: [],
  currentRegionMonitoring: null,
  nationalStats: {},
  status: 'idle',
  error: null,
  filters: {}
};

// Async thunks
export const fetchRegionMonitoringByRegion = createAsyncThunk(
  'regionMonitoring/fetchByRegion',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getByRegion(regionId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionMonitoringByRegionAndDate = createAsyncThunk(
  'regionMonitoring/fetchByRegionAndDate',
  async ({ regionId, date }: { regionId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getByRegionAndDate(regionId, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionMonitoringByRegionAndDateRange = createAsyncThunk(
  'regionMonitoring/fetchByRegionAndDateRange',
  async ({ regionId, startDate, endDate }: { regionId: number; startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getByRegionAndDateRange(regionId, startDate, endDate);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionMonitoringByDate = createAsyncThunk(
  'regionMonitoring/fetchByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getByDate(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionMonitoringByDateRange = createAsyncThunk(
  'regionMonitoring/fetchByDateRange',
  async ({ startDate, endDate, page, size }: { startDate: string; endDate: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getByDateRange(startDate, endDate, page, size);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLatestRegionMonitoringForAllRegions = createAsyncThunk(
  'regionMonitoring/fetchLatestForAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getLatestForAllRegions();
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch latest region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionsWithLowAttendance = createAsyncThunk(
  'regionMonitoring/fetchRegionsWithLowAttendance',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getRegionsWithLowAttendance(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regions with low attendance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionsWithLowUsageSchools = createAsyncThunk(
  'regionMonitoring/fetchRegionsWithLowUsageSchools',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getRegionsWithLowUsageSchools(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regions with low usage schools';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionsWithLowCompliance = createAsyncThunk(
  'regionMonitoring/fetchRegionsWithLowCompliance',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getRegionsWithLowCompliance(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regions with low compliance';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRegionsWithHighAlerts = createAsyncThunk(
  'regionMonitoring/fetchRegionsWithHighAlerts',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getRegionsWithHighAlerts(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regions with high alerts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTopPerformingRegions = createAsyncThunk(
  'regionMonitoring/fetchTopPerformingRegions',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getTopPerformingRegions(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch top performing regions';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUnderperformingRegions = createAsyncThunk(
  'regionMonitoring/fetchUnderperformingRegions',
  async ({ threshold, date }: { threshold: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getUnderperformingRegions(threshold, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch underperforming regions';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNationalAverageAttendanceRate = createAsyncThunk(
  'regionMonitoring/fetchNationalAverageAttendanceRate',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getNationalAverageAttendanceRate(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch national average attendance rate';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNationalAverageComplianceScore = createAsyncThunk(
  'regionMonitoring/fetchNationalAverageComplianceScore',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getNationalAverageComplianceScore(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch national average compliance score';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTotalSchoolsNationally = createAsyncThunk(
  'regionMonitoring/fetchTotalSchoolsNationally',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getTotalSchoolsNationally(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch total schools nationally';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTotalTeachersNationally = createAsyncThunk(
  'regionMonitoring/fetchTotalTeachersNationally',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getTotalTeachersNationally(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch total teachers nationally';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTotalStudentsNationally = createAsyncThunk(
  'regionMonitoring/fetchTotalStudentsNationally',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.getTotalStudentsNationally(date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch total students nationally';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateRegionMonitoring = createAsyncThunk(
  'regionMonitoring/updateRegionMonitoring',
  async ({ regionId, date }: { regionId: number; date: string }, { rejectWithValue }) => {
    try {
      await regionMonitoringApi.updateRegionMonitoring(regionId, date);
      return { regionId, date };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const generateRegionMonitoringData = createAsyncThunk(
  'regionMonitoring/generateMonitoringData',
  async ({ regionId, date }: { regionId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await regionMonitoringApi.generateMonitoringData(regionId, date);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate region monitoring data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const generateMonitoringDataForAllRegions = createAsyncThunk(
  'regionMonitoring/generateForAllRegions',
  async (date: string, { rejectWithValue }) => {
    try {
      await regionMonitoringApi.generateForAllRegions(date);
      return { date };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate monitoring data for all regions';
      return rejectWithValue(errorMessage);
    }
  }
);

const regionMonitoringSlice = createSlice({
  name: 'regionMonitoring',
  initialState,
  reducers: {
    clearCurrentRegionMonitoring: (state) => {
      state.currentRegionMonitoring = null;
    },
    clearRegionMonitoringError: (state) => {
      state.error = null;
    },
    setRegionMonitoringFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearRegionMonitoringFilters: (state) => {
      state.filters = {};
    },
    updateRegionMonitoringStatus: (state, action) => {
      const monitoring = state.regionMonitoring.find(m => m.id === action.payload.id);
      if (monitoring) {
        monitoring.active = action.payload.active;
      }
    },
    clearNationalStats: (state) => {
      state.nationalStats = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by region
      .addCase(fetchRegionMonitoringByRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionMonitoringByRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRegionMonitoring = action.payload as RegionMonitoring;
      })
      .addCase(fetchRegionMonitoringByRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region monitoring data';
      })

      // Fetch by region and date
      .addCase(fetchRegionMonitoringByRegionAndDate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionMonitoringByRegionAndDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRegionMonitoring = action.payload as RegionMonitoring;
      })
      .addCase(fetchRegionMonitoringByRegionAndDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region monitoring data';
      })

      // Fetch by region and date range
      .addCase(fetchRegionMonitoringByRegionAndDateRange.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionMonitoringByRegionAndDateRange.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRegionMonitoringByRegionAndDateRange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region monitoring data';
      })

      // Fetch by date
      .addCase(fetchRegionMonitoringByDate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionMonitoringByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRegionMonitoringByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region monitoring data';
      })

      // Fetch by date range
      .addCase(fetchRegionMonitoringByDateRange.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionMonitoringByDateRange.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRegionMonitoringByDateRange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region monitoring data';
      })

      // Fetch latest for all regions
      .addCase(fetchLatestRegionMonitoringForAllRegions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLatestRegionMonitoringForAllRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLatestRegionMonitoringForAllRegions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch latest region monitoring data';
      })

      // Fetch regions with low attendance
      .addCase(fetchRegionsWithLowAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch regions with low usage schools
      .addCase(fetchRegionsWithLowUsageSchools.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch regions with low compliance
      .addCase(fetchRegionsWithLowCompliance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch regions with high alerts
      .addCase(fetchRegionsWithHighAlerts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch top performing regions
      .addCase(fetchTopPerformingRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch underperforming regions
      .addCase(fetchUnderperformingRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regionMonitoring = Array.isArray(action.payload) ? action.payload : [];
      })

      // National stats
      .addCase(fetchNationalAverageAttendanceRate.fulfilled, (state, action) => {
        state.nationalStats.averageAttendanceRate = action.payload;
      })
      .addCase(fetchNationalAverageComplianceScore.fulfilled, (state, action) => {
        state.nationalStats.averageComplianceScore = action.payload;
      })
      .addCase(fetchTotalSchoolsNationally.fulfilled, (state, action) => {
        state.nationalStats.totalSchools = action.payload;
      })
      .addCase(fetchTotalTeachersNationally.fulfilled, (state, action) => {
        state.nationalStats.totalTeachers = action.payload;
      })
      .addCase(fetchTotalStudentsNationally.fulfilled, (state, action) => {
        state.nationalStats.totalStudents = action.payload;
      })

      // Generate monitoring data
      .addCase(generateRegionMonitoringData.fulfilled, (state, action) => {
        const newData = action.payload as RegionMonitoring;
        const existingIndex = state.regionMonitoring.findIndex(m => m.regionId === newData.regionId && m.monitoringDate === newData.monitoringDate);
        if (existingIndex >= 0) {
          state.regionMonitoring[existingIndex] = newData;
        } else {
          state.regionMonitoring.push(newData);
        }
        state.currentRegionMonitoring = newData;
      });
  },
});

export const {
  clearCurrentRegionMonitoring,
  clearRegionMonitoringError,
  setRegionMonitoringFilters,
  clearRegionMonitoringFilters,
  updateRegionMonitoringStatus,
  clearNationalStats,
} = regionMonitoringSlice.actions;

export default regionMonitoringSlice.reducer; 