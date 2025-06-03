import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsApi, { AnalyticsData } from '../../api/services/analyticsApi';

export interface AnalyticsState {
  dashboardData: AnalyticsData | null;
  studentAnalytics: AnalyticsData | null;
  courseAnalytics: AnalyticsData | null;
  classAnalytics: AnalyticsData | null;
  schoolAnalytics: AnalyticsData | null;
  comparativeData: AnalyticsData[] | null;
  trendData: AnalyticsData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    timeframe: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
    courseId?: number;
    studentId?: number;
    classId?: number;
    schoolId?: number;
    regionId?: number;
  };
}

const initialState: AnalyticsState = {
  dashboardData: null,
  studentAnalytics: null,
  courseAnalytics: null,
  classAnalytics: null,
  schoolAnalytics: null,
  comparativeData: null,
  trendData: null,
  status: 'idle',
  error: null,
  filters: {
    timeframe: 'MONTH'
  }
};

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'analytics/fetchDashboardData',
  async (params: {
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
    schoolId?: number;
    regionId?: number;
    courseId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getDashboardData(params);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStudentAnalytics = createAsyncThunk(
  'analytics/fetchStudentAnalytics',
  async (params: {
    studentId: number;
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
    courseId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getStudentAnalytics(params.studentId, {
        timeframe: params.timeframe,
        courseId: params.courseId
      });
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCourseAnalytics = createAsyncThunk(
  'analytics/fetchCourseAnalytics',
  async (params: {
    courseId: number;
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getCourseAnalytics(params.courseId, {
        timeframe: params.timeframe
      });
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch course analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchClassAnalytics = createAsyncThunk(
  'analytics/fetchClassAnalytics',
  async (params: {
    classId: number;
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getClassAnalytics(params.classId, {
        timeframe: params.timeframe
      });
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch class analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSchoolAnalytics = createAsyncThunk(
  'analytics/fetchSchoolAnalytics',
  async (params: {
    schoolId: number;
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getSchoolAnalytics(params.schoolId, {
        timeframe: params.timeframe
      });
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch school analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchComparativeAnalytics = createAsyncThunk(
  'analytics/fetchComparativeAnalytics',
  async (params: {
    type: 'STUDENT' | 'COURSE' | 'CLASS' | 'SCHOOL';
    ids: number[];
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getComparativeAnalytics(params);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch comparative analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTrendAnalytics = createAsyncThunk(
  'analytics/fetchTrendAnalytics',
  async (params: {
    type: 'STUDENT' | 'COURSE' | 'CLASS' | 'SCHOOL';
    id: number;
    startDate: string;
    endDate: string;
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getTrendAnalytics(params);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trend analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const exportAnalytics = createAsyncThunk(
  'analytics/exportAnalytics',
  async (params: {
    type: 'STUDENT' | 'COURSE' | 'CLASS' | 'SCHOOL';
    id: number;
    format: 'PDF' | 'EXCEL' | 'CSV';
    timeframe?: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.exportAnalytics(params);
      return response.data.downloadUrl;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export analytics';
      return rejectWithValue(errorMessage);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsData: (state) => {
      state.dashboardData = null;
      state.studentAnalytics = null;
      state.courseAnalytics = null;
      state.classAnalytics = null;
      state.schoolAnalytics = null;
      state.comparativeData = null;
      state.trendData = null;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    setAnalyticsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetAnalyticsFilters: (state) => {
      state.filters = {
        timeframe: 'MONTH'
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboardData = action.payload as AnalyticsData;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch dashboard data';
      })
      
      // Fetch student analytics
      .addCase(fetchStudentAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.studentAnalytics = action.payload as AnalyticsData;
      })
      .addCase(fetchStudentAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student analytics';
      })
      
      // Fetch course analytics
      .addCase(fetchCourseAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourseAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courseAnalytics = action.payload as AnalyticsData;
      })
      .addCase(fetchCourseAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch course analytics';
      })
      
      // Fetch class analytics
      .addCase(fetchClassAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classAnalytics = action.payload as AnalyticsData;
      })
      .addCase(fetchClassAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch class analytics';
      })
      
      // Fetch school analytics
      .addCase(fetchSchoolAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolAnalytics = action.payload as AnalyticsData;
      })
      .addCase(fetchSchoolAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school analytics';
      })
      
      // Fetch comparative analytics
      .addCase(fetchComparativeAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchComparativeAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comparativeData = Array.isArray(action.payload) ? action.payload : [action.payload as AnalyticsData];
      })
      .addCase(fetchComparativeAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comparative analytics';
      })
      
      // Fetch trend analytics
      .addCase(fetchTrendAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrendAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trendData = action.payload as AnalyticsData;
      })
      .addCase(fetchTrendAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch trend analytics';
      })
      
      // Export analytics
      .addCase(exportAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(exportAnalytics.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(exportAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to export analytics';
      });
  },
});

export const { 
  clearAnalyticsData, 
  clearAnalyticsError, 
  setAnalyticsFilters,
  resetAnalyticsFilters
} = analyticsSlice.actions;

export default analyticsSlice.reducer; 