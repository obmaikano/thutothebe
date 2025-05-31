import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import curriculumAdvancedApi, {
  CurriculumVersionDTO,
  CurriculumComparisonDTO,
  CurriculumResourceDTO,
  CurriculumAnalyticsDTO,
  CurriculumAssessmentDTO,
  CurriculumIntegrationDTO
} from '../../api/services/curriculumAdvancedApi';

// ==================== STATE INTERFACES ====================

export interface CurriculumAdvancedState {
  // Version Control
  versions: CurriculumVersionDTO[];
  currentComparison: CurriculumComparisonDTO | null;
  
  // Resources
  resources: CurriculumResourceDTO[];
  currentResource: CurriculumResourceDTO | null;
  
  // Analytics
  analytics: CurriculumAnalyticsDTO[];
  dashboardData: Record<string, any> | null;
  realTimeData: Record<string, any> | null;
  trendData: Record<string, any>[] | null;
  
  // Assessments
  linkedAssessments: CurriculumAssessmentDTO[];
  
  // Integrations
  integrations: CurriculumIntegrationDTO[];
  syncResults: Record<string, any> | null;
  
  // Loading states
  versionsLoading: boolean;
  resourcesLoading: boolean;
  analyticsLoading: boolean;
  assessmentsLoading: boolean;
  integrationsLoading: boolean;
  
  // Error states
  error: string | null;
  versionError: string | null;
  resourceError: string | null;
  analyticsError: string | null;
  assessmentError: string | null;
  integrationError: string | null;
}

const initialState: CurriculumAdvancedState = {
  versions: [],
  currentComparison: null,
  resources: [],
  currentResource: null,
  analytics: [],
  dashboardData: null,
  realTimeData: null,
  trendData: null,
  linkedAssessments: [],
  integrations: [],
  syncResults: null,
  versionsLoading: false,
  resourcesLoading: false,
  analyticsLoading: false,
  assessmentsLoading: false,
  integrationsLoading: false,
  error: null,
  versionError: null,
  resourceError: null,
  analyticsError: null,
  assessmentError: null,
  integrationError: null
};

// ==================== VERSION CONTROL THUNKS ====================

export const createCurriculumVersion = createAsyncThunk(
  'curriculumAdvanced/createVersion',
  async (params: {
    curriculumId: number;
    versionName: string;
    description?: string;
    isMajorVersion?: boolean;
    createdById?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.createVersion(
        params.curriculumId,
        params.versionName,
        params.description,
        params.isMajorVersion,
        params.createdById
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create version');
    }
  }
);

export const fetchCurriculumVersions = createAsyncThunk(
  'curriculumAdvanced/fetchVersions',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getVersions(curriculumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch versions');
    }
  }
);

export const compareCurriculumVersions = createAsyncThunk(
  'curriculumAdvanced/compareVersions',
  async (params: {
    sourceVersionId: number;
    targetVersionId: number;
    comparedById: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.compareVersions(
        params.sourceVersionId,
        params.targetVersionId,
        params.comparedById
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to compare versions');
    }
  }
);

// ==================== RESOURCE MANAGEMENT THUNKS ====================

export const uploadCurriculumResource = createAsyncThunk(
  'curriculumAdvanced/uploadResource',
  async (params: {
    curriculumId: number;
    file: File | null;
    resourceData: Omit<CurriculumResourceDTO, 'id' | 'uploadedAt' | 'accessCount'>;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.uploadResource(
        params.curriculumId,
        params.file,
        params.resourceData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resource');
    }
  }
);

export const fetchCurriculumResources = createAsyncThunk(
  'curriculumAdvanced/fetchResources',
  async (params: {
    curriculumId: number;
    resourceType?: string;
    unitId?: number;
    topicId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getResources(
        params.curriculumId,
        params.resourceType,
        params.unitId,
        params.topicId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resources');
    }
  }
);

export const trackResourceAccess = createAsyncThunk(
  'curriculumAdvanced/trackResourceAccess',
  async (params: {
    resourceId: number;
    accessedById: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.trackResourceAccess(
        params.resourceId,
        params.accessedById
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to track resource access');
    }
  }
);

// ==================== ANALYTICS THUNKS ====================

export const generateCurriculumAnalytics = createAsyncThunk(
  'curriculumAdvanced/generateAnalytics',
  async (params: {
    curriculumId: number;
    analyticsType: CurriculumAnalyticsDTO['analyticsType'];
    aggregationLevel: CurriculumAnalyticsDTO['aggregationLevel'];
    schoolId?: number;
    regionId?: number;
    generatedById?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.generateAnalytics(
        params.curriculumId,
        params.analyticsType,
        params.aggregationLevel,
        params.schoolId,
        params.regionId,
        params.generatedById
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate analytics');
    }
  }
);

export const fetchDashboardAnalytics = createAsyncThunk(
  'curriculumAdvanced/fetchDashboardAnalytics',
  async (params: {
    curriculumId: number;
    level: CurriculumAnalyticsDTO['aggregationLevel'];
    schoolId?: number;
    teacherId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getDashboardAnalytics(
        params.curriculumId,
        params.level,
        params.schoolId,
        params.teacherId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard analytics');
    }
  }
);

export const fetchRealTimeAnalytics = createAsyncThunk(
  'curriculumAdvanced/fetchRealTimeAnalytics',
  async (params: {
    curriculumId: number;
    schoolId?: number;
    regionId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getRealTimeAnalytics(
        params.curriculumId,
        params.schoolId,
        params.regionId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch real-time analytics');
    }
  }
);

export const fetchTrendAnalytics = createAsyncThunk(
  'curriculumAdvanced/fetchTrendAnalytics',
  async (params: {
    curriculumId: number;
    startDate: string;
    endDate: string;
    metric: string;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getTrendAnalytics(
        params.curriculumId,
        params.startDate,
        params.endDate,
        params.metric
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trend analytics');
    }
  }
);

// ==================== ASSESSMENT THUNKS ====================

export const linkCurriculumAssessment = createAsyncThunk(
  'curriculumAdvanced/linkAssessment',
  async (params: {
    curriculumId: number;
    assessmentData: Omit<CurriculumAssessmentDTO, 'id' | 'linkedAt'>;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.linkAssessment(
        params.curriculumId,
        params.assessmentData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to link assessment');
    }
  }
);

export const fetchLinkedAssessments = createAsyncThunk(
  'curriculumAdvanced/fetchLinkedAssessments',
  async (params: {
    curriculumId: number;
    unitId?: number;
    topicId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getLinkedAssessments(
        params.curriculumId,
        params.unitId,
        params.topicId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch linked assessments');
    }
  }
);

// ==================== INTEGRATION THUNKS ====================

export const configureCurriculumIntegration = createAsyncThunk(
  'curriculumAdvanced/configureIntegration',
  async (params: {
    curriculumId: number;
    integrationData: Omit<CurriculumIntegrationDTO, 'id' | 'configuredAt' | 'lastSyncAt' | 'nextSyncAt' | 'errorCount' | 'successCount'>;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.configureIntegration(
        params.curriculumId,
        params.integrationData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to configure integration');
    }
  }
);

export const triggerIntegrationSync = createAsyncThunk(
  'curriculumAdvanced/triggerSync',
  async (params: {
    integrationId: number;
    triggeredById: number;
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.triggerSync(
        params.integrationId,
        params.triggeredById
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to trigger sync');
    }
  }
);

export const fetchCurriculumIntegrations = createAsyncThunk(
  'curriculumAdvanced/fetchIntegrations',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumAdvancedApi.getIntegrations(curriculumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch integrations');
    }
  }
);

// ==================== SLICE ====================

const curriculumAdvancedSlice = createSlice({
  name: 'curriculumAdvanced',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.versionError = null;
      state.resourceError = null;
      state.analyticsError = null;
      state.assessmentError = null;
      state.integrationError = null;
    },
    clearCurrentComparison: (state) => {
      state.currentComparison = null;
    },
    clearCurrentResource: (state) => {
      state.currentResource = null;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
    },
    clearRealTimeData: (state) => {
      state.realTimeData = null;
    },
    clearTrendData: (state) => {
      state.trendData = null;
    },
    clearSyncResults: (state) => {
      state.syncResults = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ==================== VERSION CONTROL ====================
      .addCase(createCurriculumVersion.pending, (state) => {
        state.versionsLoading = true;
        state.versionError = null;
      })
      .addCase(createCurriculumVersion.fulfilled, (state, action) => {
        state.versionsLoading = false;
        if (action.payload) {
          state.versions.push(action.payload);
        }
      })
      .addCase(createCurriculumVersion.rejected, (state, action) => {
        state.versionsLoading = false;
        state.versionError = action.payload as string;
      })

      .addCase(fetchCurriculumVersions.pending, (state) => {
        state.versionsLoading = true;
        state.versionError = null;
      })
      .addCase(fetchCurriculumVersions.fulfilled, (state, action) => {
        state.versionsLoading = false;
        state.versions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurriculumVersions.rejected, (state, action) => {
        state.versionsLoading = false;
        state.versionError = action.payload as string;
      })

      .addCase(compareCurriculumVersions.pending, (state) => {
        state.versionsLoading = true;
        state.versionError = null;
      })
      .addCase(compareCurriculumVersions.fulfilled, (state, action) => {
        state.versionsLoading = false;
        state.currentComparison = action.payload;
      })
      .addCase(compareCurriculumVersions.rejected, (state, action) => {
        state.versionsLoading = false;
        state.versionError = action.payload as string;
      })

      // ==================== RESOURCES ====================
      .addCase(uploadCurriculumResource.pending, (state) => {
        state.resourcesLoading = true;
        state.resourceError = null;
      })
      .addCase(uploadCurriculumResource.fulfilled, (state, action) => {
        state.resourcesLoading = false;
        if (action.payload) {
          state.resources.push(action.payload);
        }
      })
      .addCase(uploadCurriculumResource.rejected, (state, action) => {
        state.resourcesLoading = false;
        state.resourceError = action.payload as string;
      })

      .addCase(fetchCurriculumResources.pending, (state) => {
        state.resourcesLoading = true;
        state.resourceError = null;
      })
      .addCase(fetchCurriculumResources.fulfilled, (state, action) => {
        state.resourcesLoading = false;
        state.resources = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurriculumResources.rejected, (state, action) => {
        state.resourcesLoading = false;
        state.resourceError = action.payload as string;
      })

      // ==================== ANALYTICS ====================
      .addCase(generateCurriculumAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(generateCurriculumAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        if (action.payload) {
          state.analytics.push(action.payload);
        }
      })
      .addCase(generateCurriculumAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload as string;
      })

      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload as string;
      })

      .addCase(fetchRealTimeAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchRealTimeAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.realTimeData = action.payload;
      })
      .addCase(fetchRealTimeAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload as string;
      })

      .addCase(fetchTrendAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchTrendAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.trendData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTrendAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload as string;
      })

      // ==================== ASSESSMENTS ====================
      .addCase(linkCurriculumAssessment.pending, (state) => {
        state.assessmentsLoading = true;
        state.assessmentError = null;
      })
      .addCase(linkCurriculumAssessment.fulfilled, (state, action) => {
        state.assessmentsLoading = false;
        if (action.payload) {
          state.linkedAssessments.push(action.payload);
        }
      })
      .addCase(linkCurriculumAssessment.rejected, (state, action) => {
        state.assessmentsLoading = false;
        state.assessmentError = action.payload as string;
      })

      .addCase(fetchLinkedAssessments.pending, (state) => {
        state.assessmentsLoading = true;
        state.assessmentError = null;
      })
      .addCase(fetchLinkedAssessments.fulfilled, (state, action) => {
        state.assessmentsLoading = false;
        state.linkedAssessments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLinkedAssessments.rejected, (state, action) => {
        state.assessmentsLoading = false;
        state.assessmentError = action.payload as string;
      })

      // ==================== INTEGRATIONS ====================
      .addCase(configureCurriculumIntegration.pending, (state) => {
        state.integrationsLoading = true;
        state.integrationError = null;
      })
      .addCase(configureCurriculumIntegration.fulfilled, (state, action) => {
        state.integrationsLoading = false;
        if (action.payload) {
          state.integrations.push(action.payload);
        }
      })
      .addCase(configureCurriculumIntegration.rejected, (state, action) => {
        state.integrationsLoading = false;
        state.integrationError = action.payload as string;
      })

      .addCase(triggerIntegrationSync.pending, (state) => {
        state.integrationsLoading = true;
        state.integrationError = null;
      })
      .addCase(triggerIntegrationSync.fulfilled, (state, action) => {
        state.integrationsLoading = false;
        state.syncResults = action.payload;
      })
      .addCase(triggerIntegrationSync.rejected, (state, action) => {
        state.integrationsLoading = false;
        state.integrationError = action.payload as string;
      })

      .addCase(fetchCurriculumIntegrations.pending, (state) => {
        state.integrationsLoading = true;
        state.integrationError = null;
      })
      .addCase(fetchCurriculumIntegrations.fulfilled, (state, action) => {
        state.integrationsLoading = false;
        state.integrations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurriculumIntegrations.rejected, (state, action) => {
        state.integrationsLoading = false;
        state.integrationError = action.payload as string;
      });
  }
});

export const {
  clearErrors,
  clearCurrentComparison,
  clearCurrentResource,
  clearDashboardData,
  clearRealTimeData,
  clearTrendData,
  clearSyncResults
} = curriculumAdvancedSlice.actions;

export default curriculumAdvancedSlice.reducer; 