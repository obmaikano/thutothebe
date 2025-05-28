# Frontend Implementation Prompt: User Activity Logs System

## Overview
Implement a comprehensive frontend interface for the user activity logs system targeting administrative and monitoring roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, and **DEPARTMENT_HEAD**.

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
    userActivityLogs: userActivityLogsReducer,  // TO BE CREATED
    activityAnalytics: activityAnalyticsReducer,  // TO BE CREATED
    auditTrail: auditTrailReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/activity-logs/
├── pages/
│   ├── ActivityLogsPage.tsx
│   ├── UserActivityPage.tsx
│   ├── ActivityAnalyticsPage.tsx
│   ├── AuditTrailPage.tsx
│   └── SecurityLogsPage.tsx
├── components/
│   ├── ActivityLogTable.tsx
│   ├── ActivityChart.tsx
│   ├── ActivityFilters.tsx
│   ├── UserActivitySummary.tsx
│   ├── SecurityEventCard.tsx
│   └── ActivityTimeline.tsx
├── modals/
│   ├── ActivityDetailsModal.tsx
│   ├── ExportLogsModal.tsx
│   ├── FilterLogsModal.tsx
│   └── SecurityAlertModal.tsx
├── userActivityLogsSlice.ts
├── activityAnalyticsSlice.ts
├── auditTrailSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/userActivityLogApi.ts
// src/api/services/activityAnalyticsApi.ts
// src/api/services/auditTrailApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface UserActivityLogResponse {
  status: string;
  message: string;
  data: UserActivityLog | UserActivityLog[] | null;
  timestamp: string | null;
}

export interface UserActivityLog {
  id: number;
  userId: number;
  sessionId?: string;
  activityType: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'SEARCH' | 'EXPORT' | 'IMPORT' | 'DOWNLOAD' | 'UPLOAD' | 'PRINT' | 'EMAIL' | 'SHARE' | 'APPROVE' | 'REJECT' | 'SUBMIT' | 'CANCEL' | 'ERROR' | 'WARNING' | 'INFO';
  entityType?: string;
  entityId?: number;
  action: string;
  description: string;
  details?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  deviceInfo?: string;
  browserInfo?: string;
  osInfo?: string;
  referrer?: string;
  duration?: number;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flagged: boolean;
  flaggedReason?: string;
  reviewedById?: number;
  reviewedAt?: string;
  reviewNotes?: string;
  metadata?: string;
  schoolId?: number;
  regionId?: number;
  active: boolean;
  createdAt: string;
}

export interface ActivityAnalytics {
  totalActivities: number;
  uniqueUsers: number;
  topActivities: Array<{
    activityType: string;
    count: number;
    percentage: number;
  }>;
  activityTrends: Array<{
    date: string;
    count: number;
    uniqueUsers: number;
  }>;
  userEngagement: Array<{
    userId: number;
    userName: string;
    activityCount: number;
    lastActivity: string;
  }>;
  securityEvents: Array<{
    eventType: string;
    count: number;
    severity: string;
  }>;
  deviceBreakdown: Array<{
    deviceType: string;
    count: number;
    percentage: number;
  }>;
  locationBreakdown: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  timeRange: {
    startDate: string;
    endDate: string;
  };
}

export interface AuditTrail {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  oldValues?: string;
  newValues?: string;
  changeReason?: string;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  requestId?: string;
  correlationId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'DATA_CHANGE' | 'PERMISSION_CHANGE' | 'SYSTEM_CONFIG' | 'USER_MANAGEMENT' | 'SECURITY_EVENT' | 'COMPLIANCE' | 'BUSINESS_PROCESS';
  complianceRelevant: boolean;
  retentionPeriod?: number;
  archived: boolean;
  archivedAt?: string;
  active: boolean;
  createdAt: string;
}

const userActivityLogApi = {
  getAll: async (page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs?page=${page}&size=${size}`);
  },
  getById: async (id: number): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/${id}`);
  },
  getByUser: async (userId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/user/${userId}?page=${page}&size=${size}`);
  },
  getByActivityType: async (activityType: string, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/activity-type/${activityType}?page=${page}&size=${size}`);
  },
  getByDateRange: async (startDate: string, endDate: string, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
  },
  getByIpAddress: async (ipAddress: string, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/ip/${encodeURIComponent(ipAddress)}?page=${page}&size=${size}`);
  },
  getByRiskLevel: async (riskLevel: string, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/risk-level/${riskLevel}?page=${page}&size=${size}`);
  },
  getFlagged: async (page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/flagged?page=${page}&size=${size}`);
  },
  getBySchool: async (schoolId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/school/${schoolId}?page=${page}&size=${size}`);
  },
  getByRegion: async (regionId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/region/${regionId}?page=${page}&size=${size}`);
  },
  getSecurityEvents: async (page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/security-events?page=${page}&size=${size}`);
  },
  getFailedLogins: async (page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/failed-logins?page=${page}&size=${size}`);
  },
  getSuspiciousActivities: async (page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/suspicious?page=${page}&size=${size}`);
  },
  search: async (searchTerm: string, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.get(`/user-activity-logs/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  },
  advancedSearch: async (searchParams: any, page: number = 0, size: number = 20): Promise<AxiosResponse<UserActivityLogResponse>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...searchParams
    });
    return api.get(`/user-activity-logs/advanced-search?${params}`);
  },
  create: async (logData: CreateUserActivityLogRequest): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.post('/user-activity-logs', logData);
  },
  update: async (id: number, logData: UpdateUserActivityLogRequest): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.put(`/user-activity-logs/${id}`, logData);
  },
  flag: async (id: number, flagData: FlagActivityLogRequest): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.put(`/user-activity-logs/${id}/flag`, flagData);
  },
  unflag: async (id: number): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.put(`/user-activity-logs/${id}/unflag`);
  },
  review: async (id: number, reviewData: ReviewActivityLogRequest): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.put(`/user-activity-logs/${id}/review`, reviewData);
  },
  delete: async (id: number): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.delete(`/user-activity-logs/${id}`);
  },
  bulkDelete: async (ids: number[]): Promise<AxiosResponse<UserActivityLogResponse>> => {
    return api.delete('/user-activity-logs/bulk', { data: { ids } });
  },
  export: async (exportParams: ExportLogsRequest): Promise<AxiosResponse<any>> => {
    return api.post('/user-activity-logs/export', exportParams, {
      responseType: 'blob'
    });
  },
  getStatistics: async (timeRange?: string): Promise<AxiosResponse<any>> => {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return api.get(`/user-activity-logs/statistics${params}`);
  },
  getAnalytics: async (startDate: string, endDate: string): Promise<AxiosResponse<{ data: ActivityAnalytics }>> => {
    return api.get(`/user-activity-logs/analytics?startDate=${startDate}&endDate=${endDate}`);
  },
  getUserSummary: async (userId: number, timeRange?: string): Promise<AxiosResponse<any>> => {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return api.get(`/user-activity-logs/user/${userId}/summary${params}`);
  },
  getAuditTrail: async (entityType: string, entityId: number): Promise<AxiosResponse<any>> => {
    return api.get(`/user-activity-logs/audit-trail/${entityType}/${entityId}`);
  },
};

export default userActivityLogApi;
```

### 4. Component Patterns (EXISTING)
Follow existing component patterns from `src/components/common/`:
- Use existing `Button.tsx`, `Modal.tsx`, `Input.tsx`, `Select.tsx` components
- Follow existing styling with DaisyUI classes
- Use existing `Table.tsx` component for data display
- Follow existing form patterns with React Hook Form

### 5. Page Structure Pattern (EXISTING)
Follow the existing pattern from `src/features/users/pages/UserListPage.tsx`:
```typescript
const ActivityLogsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activityLogs, status, error } = useAppSelector(state => state.userActivityLogs);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchActivityLogs());
    return () => {
      dispatch(clearActivityLogsError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleViewDetails = (logId: number) => {
    dispatch(openModal({
      title: 'Activity Log Details',
      bodyType: MODAL_BODY_TYPES.ACTIVITY_LOG_DETAILS,
      extraObject: { logId },
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Activity Logs</h1>
          <p className="text-gray-600 mt-2">Monitor and analyze user activities across the system</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Activity Logs Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/activity-logs/userActivityLogsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const userActivityLogsSlice = createSlice({
  name: 'userActivityLogs',
  initialState,
  reducers: {
    clearCurrentLog: (state) => {
      state.currentLog = null;
    },
    clearActivityLogsError: (state) => {
      state.error = null;
    },
    setActivityFilter: (state, action) => {
      state.filter = action.payload;
    },
    flagActivity: (state, action) => {
      const log = state.activityLogs.find(l => l.id === action.payload.id);
      if (log) {
        log.flagged = true;
        log.flaggedReason = action.payload.reason;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/userActivityLogApi.ts
// src/api/services/activityAnalyticsApi.ts
// src/api/services/auditTrailApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `ActivityLogsPage.tsx` - View and manage all user activity logs
- `UserActivityPage.tsx` - View specific user's activity history
- `ActivityAnalyticsPage.tsx` - Analytics and insights dashboard
- `AuditTrailPage.tsx` - Compliance and audit trail management
- `SecurityLogsPage.tsx` - Security events and suspicious activities

### 2. Activity Analytics and Insights
Comprehensive activity analysis:
- User engagement metrics
- Activity trend analysis
- Security event monitoring
- Performance insights
- Compliance reporting

### 3. Security Monitoring
Advanced security event tracking:
- Failed login attempts
- Suspicious activity detection
- Risk level assessment
- Security alert management
- Threat analysis

### 4. Audit Trail Management
Compliance and audit capabilities:
- Change tracking
- Data modification logs
- Compliance reporting
- Retention management
- Export capabilities

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canViewActivityLogs = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canManageActivityLogs = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR'
].includes(userRole);

const canViewSecurityLogs = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  ACTIVITY_LOG_DETAILS: "ACTIVITY_LOG_DETAILS",
  ACTIVITY_LOG_EXPORT: "ACTIVITY_LOG_EXPORT",
  ACTIVITY_LOG_FILTER: "ACTIVITY_LOG_FILTER",
  SECURITY_ALERT_DETAILS: "SECURITY_ALERT_DETAILS",
  AUDIT_TRAIL_DETAILS: "AUDIT_TRAIL_DETAILS",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleActivityLogFlag = async (logId: number, flagData: FlagActivityData) => {
  try {
    await dispatch(flagActivityLog({ logId, ...flagData })).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to flag activity log:', error);
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

// Follow existing table patterns using existing Table component
<Table 
  data={activityLogs}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Activity Log Table Component
```typescript
// src/features/activity-logs/components/ActivityLogTable.tsx
// Advanced table with filtering and sorting
// Follow existing component patterns
```

### 2. Activity Chart Component
```typescript
// src/features/activity-logs/components/ActivityChart.tsx
// Charts for activity analytics using existing Chart.js
// Follow existing chart patterns
```

### 3. Activity Filters Component
```typescript
// src/features/activity-logs/components/ActivityFilters.tsx
// Advanced filtering interface
// Follow existing component patterns
```

### 4. Security Event Card Component
```typescript
// src/features/activity-logs/components/SecurityEventCard.tsx
// Display security events and alerts
// Follow existing component structure
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include activity logs routes:
```typescript
// Add to existing navigation items for administrators
{
  label: 'Activity Logs',
  icon: Activity,
  submenu: [
    { label: 'All Activities', path: '/app/activity-logs' },
    { label: 'User Activity', path: '/app/activity-logs/users' },
    { label: 'Analytics', path: '/app/activity-logs/analytics' },
    { label: 'Security Events', path: '/app/activity-logs/security' },
    { label: 'Audit Trail', path: '/app/activity-logs/audit' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/activity-logs" element={<ActivityLogsPage />} />
<Route path="/activity-logs/:id" element={<ActivityLogDetailsPage />} />
<Route path="/activity-logs/users" element={<UserActivityPage />} />
<Route path="/activity-logs/users/:userId" element={<UserActivityDetailsPage />} />
<Route path="/activity-logs/analytics" element={<ActivityAnalyticsPage />} />
<Route path="/activity-logs/security" element={<SecurityLogsPage />} />
<Route path="/activity-logs/audit" element={<AuditTrailPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchActivityLogs = createAsyncThunk(
  'userActivityLogs/fetchActivityLogs',
  async (params: ActivityLogFetchParams, { rejectWithValue }) => {
    try {
      const response = await userActivityLogApi.getAll(params.page, params.size);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }
);

export const flagActivityLog = createAsyncThunk(
  'userActivityLogs/flagActivityLog',
  async (flagData: FlagActivityLogData, { rejectWithValue }) => {
    try {
      const response = await userActivityLogApi.flag(flagData.logId, flagData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to flag activity log');
    }
  }
);

export const fetchActivityAnalytics = createAsyncThunk(
  'activityAnalytics/fetchActivityAnalytics',
  async (params: AnalyticsParams, { rejectWithValue }) => {
    try {
      const response = await userActivityLogApi.getAnalytics(params.startDate, params.endDate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity analytics');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [activityTypeFilter, setActivityTypeFilter] = useState('ALL');
const [riskLevelFilter, setRiskLevelFilter] = useState('');
const [dateRange, setDateRange] = useState({ start: '', end: '' });
const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Activity Monitoring
- Real-time activity log updates
- Live security event notifications
- Instant risk level alerts
- Activity stream updates

### 2. Security Monitoring
- Real-time threat detection
- Suspicious activity alerts
- Failed login monitoring
- Security event notifications

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Activity Logs Security Features
```typescript
// Implement activity log access control
const canViewActivityLog = (log: UserActivityLog, user: User) => {
  // System administrators can view all logs
  const systemAdmins = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF'];
  if (systemAdmins.includes(user.role)) return true;
  
  // Regional admins can view regional logs
  if (user.role === 'REGIONAL_ADMIN' && log.regionId === user.regionId) {
    return true;
  }
  
  // School admins can view school logs
  if (['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role) && log.schoolId === user.schoolId) {
    return true;
  }
  
  return false;
};

// Implement sensitive data protection
const sanitizeLogData = (log: UserActivityLog, user: User) => {
  const sensitiveFields = ['ipAddress', 'userAgent', 'deviceInfo'];
  const canViewSensitive = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(user.role);
  
  if (!canViewSensitive) {
    sensitiveFields.forEach(field => {
      if (log[field]) {
        log[field] = '[REDACTED]';
      }
    });
  }
  
  return log;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Activity Logs-Specific Optimizations
- Efficient log pagination
- Smart filtering and search
- Optimized analytics queries
- Data aggregation for large datasets

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Activity Logs-Specific Testing
- Test log filtering and search
- Test security event detection
- Test analytics calculations
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `userActivityLogsSlice.ts`, `activityAnalyticsSlice.ts`, `auditTrailSlice.ts`
2. **New API Services**: `userActivityLogApi.ts`, `activityAnalyticsApi.ts`, `auditTrailApi.ts`
3. **New Pages**: Activity logs management, analytics, and security monitoring pages
4. **New Components**: Activity logs-specific reusable components
5. **Enhanced Existing Pages**: Integration with monitoring systems
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Activity logs-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Activity log viewing and filtering functioning properly
- Security monitoring working correctly
- Analytics and insights displaying accurately
- Audit trail functionality working as expected
- Responsive design consistent with existing pages
- Activity logs security measures properly implemented

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
11. **DO** implement proper data sanitization
12. **DO** ensure efficient handling of large datasets
13. **DO** implement comprehensive security monitoring
14. **DO** optimize for high-volume log processing

This implementation should seamlessly integrate with the existing codebase while providing comprehensive user activity monitoring and analysis capabilities for administrative roles in the educational system. 