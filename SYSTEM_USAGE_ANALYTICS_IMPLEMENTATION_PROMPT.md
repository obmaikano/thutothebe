# Frontend Implementation Prompt: System Usage Analytics

## Overview
Implement a comprehensive frontend interface for the system usage analytics targeting administrative and monitoring roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, and **DEPARTMENT_HEAD**.

**IMPORTANT**: Follow the established code architecture and patterns in the existing frontend project. Stick strictly to the already established design patterns and conventions. Do not invent or hallucinate new functions, services, or modules that aren't present in the existing codebase. Ensure compatibility and consistency with the existing structure.

## Existing Technology Stack (DO NOT CHANGE)
- **Framework**: React 18+ with TypeScript and Vite
- **State Management**: Redux Toolkit (already configured)
- **UI Library**: DaisyUI with Tailwind CSS (already configured)
- **Routing**: React Router v6+ (already configured)
- **HTTP Client**: Axios with interceptors (already configured)
- **Form Management**: React Hook Form with Zod validation (already available)
- **Data Tables**: React Data Table Component (already available)
- **Charts**: Chart.js with react-chartjs-2 (already configured)
- **Authentication**: JWT token management (already implemented)
- **Icons**: Lucide React (already available)

## Existing Architecture Patterns to Follow

### 1. Redux Store Structure (EXISTING)
The application already uses Redux Toolkit with the following structure:
```typescript
// Existing store structure in src/app/store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    // ... other existing reducers
    // ADD NEW REDUCERS HERE:
    systemUsage: systemUsageReducer,  // TO BE CREATED
    userActivityLogs: userActivityLogsReducer,  // TO BE CREATED
    usageAnalytics: usageAnalyticsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/analytics/
├── pages/
│   ├── SystemUsagePage.tsx
│   ├── UserActivityPage.tsx
│   ├── UsageAnalyticsPage.tsx
│   ├── ActivityLogsPage.tsx
│   └── UsageReportsPage.tsx
├── components/
│   ├── UsageChart.tsx
│   ├── ActivityTimeline.tsx
│   ├── UsageMetrics.tsx
│   ├── ActivityFilters.tsx
│   ├── UsageHeatmap.tsx
│   └── ActivitySummary.tsx
├── modals/
│   ├── ActivityDetailsModal.tsx
│   ├── UsageReportModal.tsx
│   ├── ExportDataModal.tsx
│   └── FilterOptionsModal.tsx
├── systemUsageSlice.ts
├── userActivityLogsSlice.ts
├── usageAnalyticsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/systemUsageApi.ts
// src/api/services/userActivityLogApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface SystemUsageResponse {
  status: string;
  message: string;
  data: SystemUsage | SystemUsage[] | null;
  timestamp: string | null;
}

export interface SystemUsage {
  id: number;
  date: string;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  pageViews: number;
  uniquePageViews: number;
  bounceRate: number;
  peakConcurrentUsers: number;
  systemLoad: number;
  responseTime: number;
  errorRate: number;
  featureUsage: {
    [featureName: string]: {
      users: number;
      sessions: number;
      interactions: number;
    };
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserBreakdown: {
    [browserName: string]: number;
  };
  geographicData: {
    [region: string]: number;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserActivityLog {
  id: number;
  userId: number;
  userName?: string;
  userRole?: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: number;
  description: string;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  duration?: number;
  success: boolean;
  errorMessage?: string;
  metadata?: {
    [key: string]: any;
  };
  timestamp: string;
  schoolId?: number;
  regionId?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsageAnalytics {
  timeframe: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  startDate: string;
  endDate: string;
  totalMetrics: {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    totalActions: number;
    averageSessionDuration: number;
    bounceRate: number;
  };
  trends: {
    userGrowth: number;
    sessionGrowth: number;
    engagementGrowth: number;
  };
  topFeatures: Array<{
    feature: string;
    usage: number;
    growth: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  userSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: {
    averageLoadTime: number;
    errorRate: number;
    uptime: number;
  };
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
  };
}

const systemUsageApi = {
  getAll: async (): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.get('/analytics/system-usage');
  },
  getById: async (id: number): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.get(`/analytics/system-usage/${id}`);
  },
  getByDate: async (date: string): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.get(`/analytics/system-usage/date/${date}`);
  },
  getByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.get(`/analytics/system-usage/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
  getLatest: async (): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.get('/analytics/system-usage/latest');
  },
  getDashboardMetrics: async (): Promise<AxiosResponse<{ data: UsageAnalytics }>> => {
    return api.get('/analytics/system-usage/dashboard');
  },
  getFeatureUsage: async (feature: string, startDate: string, endDate: string): Promise<AxiosResponse<{ data: any }>> => {
    return api.get(`/analytics/system-usage/feature/${feature}?startDate=${startDate}&endDate=${endDate}`);
  },
  getUserGrowth: async (period: string): Promise<AxiosResponse<{ data: any }>> => {
    return api.get(`/analytics/system-usage/user-growth?period=${period}`);
  },
  getSessionAnalytics: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: any }>> => {
    return api.get(`/analytics/system-usage/sessions?startDate=${startDate}&endDate=${endDate}`);
  },
  create: async (usageData: CreateSystemUsageRequest): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.post('/analytics/system-usage', usageData);
  },
  update: async (id: number, usageData: UpdateSystemUsageRequest): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.put(`/analytics/system-usage/${id}`, usageData);
  },
  delete: async (id: number): Promise<AxiosResponse<SystemUsageResponse>> => {
    return api.delete(`/analytics/system-usage/${id}`);
  },
};

const userActivityLogApi = {
  getAll: async (): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get('/user-activity-logs');
  },
  getById: async (id: number): Promise<AxiosResponse<{ data: UserActivityLog }>> => {
    return api.get(`/user-activity-logs/${id}`);
  },
  getByUser: async (userId: number): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/user/${userId}`);
  },
  getByUserAndDateRange: async (userId: number, startDate: string, endDate: string): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
  getByAction: async (action: string): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/action/${action}`);
  },
  getByModule: async (module: string): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/module/${module}`);
  },
  getByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
  getBySchool: async (schoolId: number): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/school/${schoolId}`);
  },
  getByRegion: async (regionId: number): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/region/${regionId}`);
  },
  getSecurityEvents: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/security-events?startDate=${startDate}&endDate=${endDate}`);
  },
  getFailedLogins: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.get(`/user-activity-logs/failed-logins?startDate=${startDate}&endDate=${endDate}`);
  },
  getLoginStatistics: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: any }>> => {
    return api.get(`/user-activity-logs/login-statistics?startDate=${startDate}&endDate=${endDate}`);
  },
  getModuleUsageStatistics: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: { [module: string]: number } }>> => {
    return api.get(`/user-activity-logs/module-usage?startDate=${startDate}&endDate=${endDate}`);
  },
  getModuleUsageBySchool: async (schoolId: number, startDate: string, endDate: string): Promise<AxiosResponse<{ data: { [module: string]: number } }>> => {
    return api.get(`/user-activity-logs/module-usage/school/${schoolId}?startDate=${startDate}&endDate=${endDate}`);
  },
  getUserActivitySummary: async (userId: number, startDate: string, endDate: string): Promise<AxiosResponse<{ data: any }>> => {
    return api.get(`/user-activity-logs/user/${userId}/summary?startDate=${startDate}&endDate=${endDate}`);
  },
  create: async (activityData: CreateUserActivityLogRequest): Promise<AxiosResponse<{ data: UserActivityLog }>> => {
    return api.post('/user-activity-logs', activityData);
  },
  bulkCreate: async (activities: CreateUserActivityLogRequest[]): Promise<AxiosResponse<{ data: UserActivityLog[] }>> => {
    return api.post('/user-activity-logs/bulk', activities);
  },
  delete: async (id: number): Promise<AxiosResponse<void>> => {
    return api.delete(`/user-activity-logs/${id}`);
  },
  deleteByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/user-activity-logs/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
};

export default { systemUsageApi, userActivityLogApi };
```

## Core Features to Implement

### 1. System Usage Analytics Interface

**New Redux Slices to Create:**
```typescript
// src/features/analytics/systemUsageSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const systemUsageSlice = createSlice({
  name: 'systemUsage',
  initialState,
  reducers: {
    clearCurrentUsage: (state) => {
      state.currentUsage = null;
    },
    clearUsageError: (state) => {
      state.error = null;
    },
    setUsageFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateUsageMetrics: (state, action) => {
      state.metrics = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `SystemUsagePage.tsx` - Main system usage dashboard
- `UserActivityPage.tsx` - User activity monitoring
- `UsageAnalyticsPage.tsx` - Advanced usage analytics
- `ActivityLogsPage.tsx` - Detailed activity logs
- `UsageReportsPage.tsx` - Usage reports and exports

### 2. Usage Analytics Dashboard
Comprehensive usage monitoring:
- Real-time usage metrics
- User activity tracking
- Feature usage analytics
- Performance monitoring
- Geographic usage data

### 3. Activity Logging System
Detailed activity tracking:
- User action logging
- Module usage tracking
- Security event monitoring
- Session analytics
- Error tracking

### 4. Reporting and Insights
Advanced analytics capabilities:
- Usage trend analysis
- User behavior insights
- Performance analytics
- Custom report generation
- Data export functionality

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canViewSystemUsage = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN'
].includes(userRole);

const canViewUserActivity = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD'
].includes(userRole);

const canViewAnalytics = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN'
].includes(userRole);

const canExportData = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  ACTIVITY_DETAILS: "ACTIVITY_DETAILS",
  USAGE_REPORT: "USAGE_REPORT",
  EXPORT_DATA: "EXPORT_DATA",
  FILTER_OPTIONS: "FILTER_OPTIONS",
  USAGE_ANALYTICS: "USAGE_ANALYTICS",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleUsageDataFetch = async (params: UsageFetchParams) => {
  try {
    await dispatch(fetchSystemUsage(params)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to fetch usage data:', error);
    // Error handling following existing pattern
  }
};
```

### 4. Follow Existing Styling Patterns
Use existing DaisyUI classes and patterns:
```typescript
// Follow existing button patterns
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">

// Follow existing card patterns
<div className="bg-white border border-gray-200 rounded-lg p-6">

// Follow existing chart patterns using existing Chart.js
<Chart 
  type="line"
  data={chartData}
  options={chartOptions}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Usage Chart Component
```typescript
// src/features/analytics/components/UsageChart.tsx
// Interactive charts for usage visualization
// Follow existing chart patterns
```

### 2. Activity Timeline Component
```typescript
// src/features/analytics/components/ActivityTimeline.tsx
// Timeline view of user activities
// Follow existing component patterns
```

### 3. Usage Metrics Component
```typescript
// src/features/analytics/components/UsageMetrics.tsx
// Key performance indicators display
// Follow existing metrics patterns
```

### 4. Usage Heatmap Component
```typescript
// src/features/analytics/components/UsageHeatmap.tsx
// Geographic and temporal usage visualization
// Follow existing visualization patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include analytics routes:
```typescript
// Add to existing navigation items
{
  label: 'System Analytics',
  icon: BarChart3,
  submenu: [
    { label: 'Usage Dashboard', path: '/app/analytics/usage' },
    { label: 'User Activity', path: '/app/analytics/activity' },
    { label: 'Activity Logs', path: '/app/analytics/logs' },
    { label: 'Usage Reports', path: '/app/analytics/reports' },
    { label: 'Advanced Analytics', path: '/app/analytics/advanced' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/analytics/usage" element={<SystemUsagePage />} />
<Route path="/analytics/activity" element={<UserActivityPage />} />
<Route path="/analytics/logs" element={<ActivityLogsPage />} />
<Route path="/analytics/reports" element={<UsageReportsPage />} />
<Route path="/analytics/advanced" element={<UsageAnalyticsPage />} />
<Route path="/analytics/user/:userId" element={<UserActivityDetailsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchSystemUsage = createAsyncThunk(
  'systemUsage/fetchSystemUsage',
  async (params: UsageFetchParams, { rejectWithValue }) => {
    try {
      const response = await systemUsageApi.getByDateRange(params.startDate, params.endDate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system usage');
    }
  }
);

export const fetchUserActivityLogs = createAsyncThunk(
  'userActivityLogs/fetchUserActivityLogs',
  async (params: ActivityLogFetchParams, { rejectWithValue }) => {
    try {
      const response = await userActivityLogApi.getByDateRange(params.startDate, params.endDate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }
);

export const fetchUsageAnalytics = createAsyncThunk(
  'usageAnalytics/fetchUsageAnalytics',
  async (params: AnalyticsFetchParams, { rejectWithValue }) => {
    try {
      const response = await systemUsageApi.getDashboardMetrics();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch usage analytics');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [timeframeFilter, setTimeframeFilter] = useState('WEEK');
const [moduleFilter, setModuleFilter] = useState('ALL');
const [userFilter, setUserFilter] = useState('');
const [dateRange, setDateRange] = useState({ start: '', end: '' });
const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
```

## Real-time Features

### 1. Live Usage Monitoring
- Real-time usage metrics
- Live user activity tracking
- Instant performance monitoring
- Real-time alert notifications

### 2. Dynamic Analytics
- Live chart updates
- Real-time data aggregation
- Dynamic filtering
- Instant report generation

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Analytics Security Features
```typescript
// Implement usage data access control
const canViewUsageData = (dataScope: string, user: User) => {
  // Super admins can view all usage data
  if (['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(user.role)) {
    return true;
  }
  
  // Regional admins can view regional data
  if (user.role === 'REGIONAL_ADMIN' && dataScope === 'REGIONAL') {
    return true;
  }
  
  // School admins can view school data
  if (['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role) && dataScope === 'SCHOOL') {
    return true;
  }
  
  return false;
};

// Implement activity log access control
const canViewActivityLogs = (userId: number, user: User) => {
  // System admins can view all activity logs
  const systemAdmins = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF'];
  if (systemAdmins.includes(user.role)) return true;
  
  // Users can view their own activity logs
  if (user.id === userId) return true;
  
  // Admins can view logs for users in their scope
  const adminRoles = ['REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD'];
  if (adminRoles.includes(user.role)) {
    return true; // Implement scope check
  }
  
  return false;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Analytics-Specific Optimizations
- Efficient data aggregation
- Smart chart rendering
- Optimized real-time updates
- Data caching strategies

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Analytics-Specific Testing
- Test usage data accuracy
- Test activity log functionality
- Test chart rendering
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `systemUsageSlice.ts`, `userActivityLogsSlice.ts`, `usageAnalyticsSlice.ts`
2. **New API Services**: `systemUsageApi.ts`, `userActivityLogApi.ts`
3. **New Pages**: Usage analytics and monitoring pages
4. **New Components**: Analytics-specific reusable components
5. **Enhanced Existing Pages**: Integration with dashboard
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Analytics-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Usage analytics functioning properly
- Activity logging working correctly
- Charts and visualizations rendering properly
- Real-time updates functioning as expected
- Responsive design consistent with existing pages
- Analytics security measures properly implemented

## Implementation Notes

1. **DO NOT** create new authentication systems - use existing `AuthContext`
2. **DO NOT** create new HTTP clients - use existing `api` from `src/api/index.ts`
3. **DO NOT** create new styling systems - use existing DaisyUI + Tailwind
4. **DO NOT** create new modal systems - extend existing `modalSlice`
5. **DO NOT** create new routing systems - extend existing React Router setup
6. **DO** follow existing file naming conventions
7. **DO** follow existing component structure patterns
8. **DO** follow existing Redux patterns and naming
9. **DO** use existing utility functions and helpers
10. **DO** maintain consistency with existing error handling patterns
11. **DO** implement proper data validation
12. **DO** ensure accurate analytics calculations
13. **DO** implement comprehensive usage tracking
14. **DO** optimize for large datasets

This implementation should seamlessly integrate with the existing codebase while providing comprehensive system usage analytics capabilities for administrative and monitoring roles in the educational system. 