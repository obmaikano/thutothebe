# Frontend Implementation Prompt: Monitoring and Alerts System

## Overview
Implement a comprehensive frontend interface for the monitoring and alerts system targeting administrative and educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    monitoringAlerts: monitoringAlertsReducer,  // TO BE CREATED
    systemMetrics: systemMetricsReducer,  // TO BE CREATED
    notifications: notificationsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/monitoring/
├── pages/
│   ├── MonitoringDashboardPage.tsx
│   ├── AlertsManagementPage.tsx
│   ├── SystemMetricsPage.tsx
│   ├── NotificationCenterPage.tsx
│   └── AlertConfigurationPage.tsx
├── components/
│   ├── AlertCard.tsx
│   ├── MetricChart.tsx
│   ├── SystemHealthIndicator.tsx
│   ├── AlertRuleBuilder.tsx
│   ├── NotificationPanel.tsx
│   └── RealTimeMonitor.tsx
├── modals/
│   ├── CreateAlertModal.tsx
│   ├── EditAlertModal.tsx
│   ├── AlertDetailsModal.tsx
│   ├── NotificationSettingsModal.tsx
│   └── SystemMaintenanceModal.tsx
├── monitoringAlertsSlice.ts
├── systemMetricsSlice.ts
├── notificationsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/monitoringAlertApi.ts
// src/api/services/systemMetricApi.ts
// src/api/services/notificationApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface MonitoringAlertResponse {
  status: string;
  message: string;
  data: MonitoringAlert | MonitoringAlert[] | null;
  timestamp: string | null;
}

export interface MonitoringAlert {
  id: number;
  alertType: 'SYSTEM_PERFORMANCE' | 'USER_ACTIVITY' | 'SECURITY' | 'DATA_INTEGRITY' | 'ATTENDANCE' | 'ACADEMIC_PERFORMANCE' | 'INFRASTRUCTURE' | 'CUSTOM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SUPPRESSED';
  title: string;
  description: string;
  source: string;
  targetType: 'SYSTEM' | 'USER' | 'SCHOOL' | 'REGION' | 'MINISTRY';
  targetId?: number;
  threshold?: number;
  currentValue?: number;
  triggerCondition: string;
  alertRule: string;
  isAutomated: boolean;
  escalationLevel: number;
  assignedToId?: number;
  acknowledgedById?: number;
  acknowledgedAt?: string;
  resolvedById?: number;
  resolvedAt?: string;
  suppressedUntil?: string;
  notificationSent: boolean;
  notificationChannels?: string;
  metadata?: string;
  firstTriggeredAt: string;
  lastTriggeredAt: string;
  triggerCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemMetric {
  id: number;
  metricName: string;
  metricType: 'PERFORMANCE' | 'USAGE' | 'AVAILABILITY' | 'SECURITY' | 'BUSINESS';
  category: 'SYSTEM' | 'APPLICATION' | 'DATABASE' | 'NETWORK' | 'USER_ACTIVITY' | 'ACADEMIC';
  value: number;
  unit: string;
  timestamp: string;
  source: string;
  tags?: string;
  metadata?: string;
  schoolId?: number;
  regionId?: number;
  active: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: 'ALERT' | 'REMINDER' | 'ANNOUNCEMENT' | 'SYSTEM' | 'ACADEMIC' | 'ADMINISTRATIVE';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  title: string;
  message: string;
  recipientId: number;
  recipientType: 'USER' | 'ROLE' | 'GROUP' | 'SCHOOL' | 'REGION';
  senderId?: number;
  channel: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
  scheduledFor?: string;
  sentAt?: string;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  metadata?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const monitoringAlertApi = {
  getAll: async (): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get('/api/monitoring-alerts');
  },
  getById: async (id: number): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/${id}`);
  },
  getByType: async (alertType: string): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/type/${alertType}`);
  },
  getBySeverity: async (severity: string): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/severity/${severity}`);
  },
  getByStatus: async (status: string): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/status/${status}`);
  },
  getByTarget: async (targetType: string, targetId: number): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/target/${targetType}/${targetId}`);
  },
  getByAssignee: async (assigneeId: number): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/assignee/${assigneeId}`);
  },
  getActive: async (): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get('/api/monitoring-alerts/active');
  },
  getCritical: async (): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get('/api/monitoring-alerts/critical');
  },
  getUnacknowledged: async (): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get('/api/monitoring-alerts/unacknowledged');
  },
  getByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.get(`/api/monitoring-alerts/range?startDate=${startDate}&endDate=${endDate}`);
  },
  create: async (alertData: CreateMonitoringAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.post('/api/monitoring-alerts', alertData);
  },
  update: async (id: number, alertData: UpdateMonitoringAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.put(`/api/monitoring-alerts/${id}`, alertData);
  },
  acknowledge: async (id: number, acknowledgeData: AcknowledgeAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.put(`/api/monitoring-alerts/${id}/acknowledge`, acknowledgeData);
  },
  resolve: async (id: number, resolveData: ResolveAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.put(`/api/monitoring-alerts/${id}/resolve`, resolveData);
  },
  suppress: async (id: number, suppressData: SuppressAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.put(`/api/monitoring-alerts/${id}/suppress`, suppressData);
  },
  escalate: async (id: number, escalateData: EscalateAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.put(`/api/monitoring-alerts/${id}/escalate`, escalateData);
  },
  assign: async (id: number, assignData: AssignAlertRequest): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.put(`/api/monitoring-alerts/${id}/assign`, assignData);
  },
  delete: async (id: number): Promise<AxiosResponse<MonitoringAlertResponse>> => {
    return api.delete(`/api/monitoring-alerts/${id}`);
  },
  getStatistics: async (timeRange?: string): Promise<AxiosResponse<any>> => {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return api.get(`/api/monitoring-alerts/statistics${params}`);
  },
};

export default monitoringAlertApi;
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
const MonitoringDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts, metrics, status, error } = useAppSelector(state => state.monitoringAlerts);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchActiveAlerts());
    dispatch(fetchSystemMetrics());
    return () => {
      dispatch(clearMonitoringError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateAlert = () => {
    dispatch(openModal({
      title: 'Create New Alert',
      bodyType: MODAL_BODY_TYPES.ALERT_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-2">Monitor system health and manage alerts</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Monitoring Dashboard Interface

**New Redux Slices to Create:**
```typescript
// src/features/monitoring/monitoringAlertsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const monitoringAlertsSlice = createSlice({
  name: 'monitoringAlerts',
  initialState,
  reducers: {
    clearCurrentAlert: (state) => {
      state.currentAlert = null;
    },
    clearMonitoringError: (state) => {
      state.error = null;
    },
    setAlertFilter: (state, action) => {
      state.alertFilter = action.payload;
    },
    updateAlertStatus: (state, action) => {
      const { alertId, status } = action.payload;
      const alert = state.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.status = status;
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
// src/api/services/monitoringAlertApi.ts
// src/api/services/systemMetricApi.ts
// src/api/services/notificationApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `MonitoringDashboardPage.tsx` - Real-time system monitoring overview
- `AlertsManagementPage.tsx` - Manage and respond to alerts
- `SystemMetricsPage.tsx` - View detailed system metrics and trends
- `NotificationCenterPage.tsx` - Manage notifications and communication
- `AlertConfigurationPage.tsx` - Configure alert rules and thresholds

### 2. Real-time Alert Management
Comprehensive alert handling system:
- Real-time alert notifications
- Alert acknowledgment and resolution
- Escalation workflows
- Alert suppression and filtering
- Bulk alert operations

### 3. System Metrics and Analytics
Performance monitoring and insights:
- Real-time system metrics
- Historical trend analysis
- Performance dashboards
- Capacity planning insights
- Custom metric tracking

### 4. Notification Management
Multi-channel notification system:
- In-app notifications
- Email and SMS alerts
- Push notifications
- Notification preferences
- Delivery tracking

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canManageAlerts = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN'
].includes(userRole);

const canViewSystemMetrics = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN'
].includes(userRole);

const canReceiveNotifications = [
  'STUDENT',
  'PARENT',
  'TEACHER',
  'SCHOOL_ADMIN',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'MINISTRY_STAFF',
  'MINISTRY_EXECUTIVE',
  'DIRECTOR',
  'SUPER_ADMIN'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  ALERT_ADD_NEW: "ALERT_ADD_NEW",
  ALERT_EDIT: "ALERT_EDIT",
  ALERT_DETAILS: "ALERT_DETAILS",
  ALERT_ACKNOWLEDGE: "ALERT_ACKNOWLEDGE",
  ALERT_RESOLVE: "ALERT_RESOLVE",
  NOTIFICATION_SETTINGS: "NOTIFICATION_SETTINGS",
  SYSTEM_MAINTENANCE: "SYSTEM_MAINTENANCE",
  METRIC_CONFIGURATION: "METRIC_CONFIGURATION",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleAlertAcknowledgment = async (alertId: number, acknowledgmentData: AcknowledgeAlertData) => {
  try {
    await dispatch(acknowledgeAlert({ alertId, ...acknowledgmentData })).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
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
  data={alerts}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Alert Card Component
```typescript
// src/features/monitoring/components/AlertCard.tsx
// Use existing card styling patterns
// Follow existing component structure
```

### 2. Metric Chart Component
```typescript
// src/features/monitoring/components/MetricChart.tsx
// Real-time charts using existing Chart.js
// Follow existing chart patterns
```

### 3. System Health Indicator Component
```typescript
// src/features/monitoring/components/SystemHealthIndicator.tsx
// Visual health status indicators
// Follow existing component patterns
```

### 4. Real-time Monitor Component
```typescript
// src/features/monitoring/components/RealTimeMonitor.tsx
// Live data updates and monitoring
// Follow existing component structure
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include monitoring routes:
```typescript
// Add to existing navigation items for administrators
{
  label: 'Monitoring',
  icon: Activity,
  submenu: [
    { label: 'Dashboard', path: '/app/monitoring/dashboard' },
    { label: 'Alerts', path: '/app/monitoring/alerts' },
    { label: 'System Metrics', path: '/app/monitoring/metrics' },
    { label: 'Notifications', path: '/app/monitoring/notifications' },
    { label: 'Configuration', path: '/app/monitoring/config' }
  ]
}

// Add notification center for all users
{
  label: 'Notifications',
  icon: Bell,
  path: '/app/notifications'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/monitoring/dashboard" element={<MonitoringDashboardPage />} />
<Route path="/monitoring/alerts" element={<AlertsManagementPage />} />
<Route path="/monitoring/metrics" element={<SystemMetricsPage />} />
<Route path="/monitoring/notifications" element={<NotificationCenterPage />} />
<Route path="/monitoring/config" element={<AlertConfigurationPage />} />
<Route path="/notifications" element={<UserNotificationsPage />} />
<Route path="/alerts/:id" element={<AlertDetailsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchActiveAlerts = createAsyncThunk(
  'monitoringAlerts/fetchActiveAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await monitoringAlertApi.getActive();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'monitoringAlerts/acknowledgeAlert',
  async (acknowledgeData: AcknowledgeAlertData, { rejectWithValue }) => {
    try {
      const response = await monitoringAlertApi.acknowledge(acknowledgeData.alertId, acknowledgeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to acknowledge alert');
    }
  }
);

export const fetchSystemMetrics = createAsyncThunk(
  'systemMetrics/fetchSystemMetrics',
  async (params: MetricFetchParams, { rejectWithValue }) => {
    try {
      const response = await systemMetricApi.getMetrics(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch metrics');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [alertFilter, setAlertFilter] = useState('ALL');
const [severityFilter, setSeverityFilter] = useState('');
const [timeRange, setTimeRange] = useState('24h');
const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
const [refreshInterval, setRefreshInterval] = useState(30000);
```

## Real-time Features

### 1. Live Monitoring Updates
- Real-time alert notifications
- Live metric updates
- System health monitoring
- Auto-refresh capabilities

### 2. WebSocket Integration
- Real-time data streaming
- Live alert notifications
- System status updates
- Performance metrics streaming

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Monitoring Security Features
```typescript
// Implement monitoring access control
const canViewAlert = (alert: MonitoringAlert, user: User) => {
  // System administrators can view all alerts
  const systemAdmins = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF'];
  if (systemAdmins.includes(user.role)) return true;
  
  // Regional admins can view regional alerts
  if (user.role === 'REGIONAL_ADMIN' && alert.targetType === 'REGION' && alert.targetId === user.regionId) {
    return true;
  }
  
  // School admins can view school alerts
  if (user.role === 'SCHOOL_ADMIN' && alert.targetType === 'SCHOOL' && alert.targetId === user.schoolId) {
    return true;
  }
  
  return false;
};

// Implement alert management permissions
const canManageAlert = (alert: MonitoringAlert, user: User) => {
  const managerRoles = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN'];
  return managerRoles.includes(user.role) && canViewAlert(alert, user);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Monitoring-Specific Optimizations
- Efficient real-time data updates
- Optimized chart rendering
- Smart polling intervals
- Data aggregation for large datasets

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Monitoring-Specific Testing
- Test real-time updates
- Test alert workflows
- Test notification delivery
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `monitoringAlertsSlice.ts`, `systemMetricsSlice.ts`, `notificationsSlice.ts`
2. **New API Services**: `monitoringAlertApi.ts`, `systemMetricApi.ts`, `notificationApi.ts`
3. **New Pages**: Monitoring dashboard, alerts management, metrics, and notification pages
4. **New Components**: Monitoring-specific reusable components
5. **Enhanced Existing Pages**: Integration with system health indicators
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Monitoring-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time monitoring functioning properly
- Alert management workflows working correctly
- Notification system functioning as expected
- System metrics displaying accurately
- Responsive design consistent with existing pages
- Monitoring security measures properly implemented

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
11. **DO** implement proper real-time data handling
12. **DO** ensure efficient performance monitoring
13. **DO** implement comprehensive alert management
14. **DO** optimize for high-frequency data updates

This implementation should seamlessly integrate with the existing codebase while providing comprehensive monitoring and alerting capabilities for all user roles in the educational system. 