# Frontend Implementation Prompt: Student Performance Analytics System

## Overview
Implement a comprehensive frontend interface for the student performance analytics system targeting educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    studentPerformance: studentPerformanceReducer,  // TO BE CREATED
    progress: progressReducer,  // TO BE CREATED
    analytics: analyticsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/analytics/
├── pages/
│   ├── PerformanceDashboardPage.tsx
│   ├── StudentPerformancePage.tsx
│   ├── CourseAnalyticsPage.tsx
│   ├── ProgressTrackingPage.tsx
│   └── PerformanceReportsPage.tsx
├── components/
│   ├── PerformanceChart.tsx
│   ├── ProgressCard.tsx
│   ├── AnalyticsFilters.tsx
│   ├── PerformanceMetrics.tsx
│   ├── TrendAnalysis.tsx
│   └── ComparisonChart.tsx
├── modals/
│   ├── PerformanceDetailsModal.tsx
│   ├── ProgressUpdateModal.tsx
│   └── AnalyticsExportModal.tsx
├── studentPerformanceSlice.ts
├── progressSlice.ts
├── analyticsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/studentPerformanceApi.ts
// src/api/services/progressApi.ts
// src/api/services/analyticsApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface StudentPerformanceResponse {
  status: string;
  message: string;
  data: StudentPerformance | StudentPerformance[] | null;
  timestamp: string | null;
}

export interface StudentPerformance {
  id: number;
  studentId: number;
  courseId: number;
  academicYear: number;
  term: 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM' | 'FOURTH_TERM' | 'ANNUAL';
  overallGrade: number;
  overallPercentage: number;
  letterGrade: string;
  gpa: number;
  rank?: number;
  totalStudents?: number;
  attendanceRate: number;
  assignmentCompletion: number;
  participationScore: number;
  improvementTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  lastUpdated: string;
  performanceMetrics: {
    assignments: {
      completed: number;
      total: number;
      averageScore: number;
    };
    assessments: {
      completed: number;
      total: number;
      averageScore: number;
    };
    participation: {
      score: number;
      maxScore: number;
    };
    attendance: {
      present: number;
      total: number;
      rate: number;
    };
  };
  trendData: Array<{
    date: string;
    score: number;
    type: string;
  }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: number;
  studentId: number;
  courseId: number;
  completionPercentage: number;
  currentGrade: number;
  targetGrade?: number;
  milestones: Array<{
    id: number;
    name: string;
    description: string;
    targetDate: string;
    completedDate?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
    weight: number;
  }>;
  learningObjectives: Array<{
    id: number;
    objective: string;
    mastery: 'NOT_STARTED' | 'DEVELOPING' | 'PROFICIENT' | 'ADVANCED';
    assessments: number;
    lastAssessed: string;
  }>;
  skillsAssessment: Array<{
    skill: string;
    level: number;
    maxLevel: number;
    evidence: string[];
  }>;
  timeSpent: number;
  estimatedTimeToCompletion: number;
  lastActivity: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  courseId?: number;
  studentId?: number;
  timeframe: 'WEEK' | 'MONTH' | 'TERM' | 'YEAR';
  metrics: {
    averagePerformance: number;
    performanceDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    trendAnalysis: {
      direction: 'UP' | 'DOWN' | 'STABLE';
      percentage: number;
      significance: 'HIGH' | 'MEDIUM' | 'LOW';
    };
    comparativeData: {
      classAverage: number;
      schoolAverage: number;
      nationalAverage?: number;
    };
    predictiveInsights: {
      projectedGrade: number;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      interventionRecommendations: string[];
    };
  };
  charts: {
    performanceTrend: Array<{
      date: string;
      value: number;
      benchmark?: number;
    }>;
    subjectBreakdown: Array<{
      subject: string;
      score: number;
      weight: number;
    }>;
    skillsRadar: Array<{
      skill: string;
      current: number;
      target: number;
    }>;
  };
}

const studentPerformanceApi = {
  getAll: async (): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get('/analytics/student-performance');
  },
  getById: async (id: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/${id}`);
  },
  getStudentPerformance: async (studentId: number, courseId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/student/${studentId}/course/${courseId}`);
  },
  getStudentPerformanceHistory: async (studentId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/student/${studentId}/history`);
  },
  getCoursePerformance: async (courseId: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/course/${courseId}`);
  },
  getPerformanceByDateRange: async (startDate: string, endDate: string): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.get(`/analytics/student-performance/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
  updateStudentPerformance: async (studentId: number, courseId: number): Promise<AxiosResponse<void>> => {
    return api.post(`/analytics/student-performance/student/${studentId}/course/${courseId}/update`);
  },
  create: async (performanceData: CreateStudentPerformanceRequest): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.post('/analytics/student-performance', performanceData);
  },
  update: async (id: number, performanceData: UpdateStudentPerformanceRequest): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.put(`/analytics/student-performance/${id}`, performanceData);
  },
  delete: async (id: number): Promise<AxiosResponse<StudentPerformanceResponse>> => {
    return api.delete(`/analytics/student-performance/${id}`);
  },
};

const progressApi = {
  getAll: async (): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get('/progress');
  },
  getById: async (id: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/${id}`);
  },
  getByStudent: async (studentId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}`);
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/course/${courseId}`);
  },
  getByStudentAndCourse: async (studentId: number, courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}/course/${courseId}`);
  },
  getActiveByStudent: async (studentId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}/active`);
  },
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/course/${courseId}/active`);
  },
  getCompletedByStudent: async (studentId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/student/${studentId}/completed`);
  },
  getCompletedByCourse: async (courseId: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.get(`/progress/course/${courseId}/completed`);
  },
  getAverageGradeByCourse: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/progress/course/${courseId}/average-grade`);
  },
  getAverageCompletionByCourse: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/progress/course/${courseId}/average-completion`);
  },
  updateProgress: async (studentId: number, courseId: number, completionPercentage: number, grade: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.put(`/progress/student/${studentId}/course/${courseId}?completionPercentage=${completionPercentage}&grade=${grade}`);
  },
  create: async (progressData: CreateProgressRequest): Promise<AxiosResponse<ProgressResponse>> => {
    return api.post('/progress', progressData);
  },
  update: async (id: number, progressData: UpdateProgressRequest): Promise<AxiosResponse<ProgressResponse>> => {
    return api.put(`/progress/${id}`, progressData);
  },
  delete: async (id: number): Promise<AxiosResponse<ProgressResponse>> => {
    return api.delete(`/progress/${id}`);
  },
};

export default { studentPerformanceApi, progressApi };
```

## Core Features to Implement

### 1. Performance Analytics Dashboard

**New Redux Slices to Create:**
```typescript
// src/features/analytics/studentPerformanceSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const studentPerformanceSlice = createSlice({
  name: 'studentPerformance',
  initialState,
  reducers: {
    clearCurrentPerformance: (state) => {
      state.currentPerformance = null;
    },
    clearPerformanceError: (state) => {
      state.error = null;
    },
    setPerformanceFilter: (state, action) => {
      state.filter = action.payload;
    },
    updatePerformanceMetrics: (state, action) => {
      const performance = state.performances.find(p => p.id === action.payload.id);
      if (performance) {
        Object.assign(performance, action.payload.updates);
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `PerformanceDashboardPage.tsx` - Main analytics dashboard
- `StudentPerformancePage.tsx` - Individual student performance
- `CourseAnalyticsPage.tsx` - Course-level analytics
- `ProgressTrackingPage.tsx` - Progress monitoring
- `PerformanceReportsPage.tsx` - Detailed reports and exports

### 2. Performance Visualization
Advanced analytics displays:
- Interactive performance charts
- Trend analysis graphs
- Comparative analytics
- Skills radar charts
- Progress tracking visuals

### 3. Progress Monitoring
Comprehensive progress tracking:
- Learning objective mastery
- Milestone tracking
- Completion percentages
- Time-based progress
- Predictive analytics

### 4. Reporting and Insights
Data-driven insights:
- Performance reports
- Trend analysis
- Risk identification
- Intervention recommendations
- Comparative benchmarking

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canViewAllPerformance = [
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

const canViewOwnPerformance = [
  'STUDENT',
  'PARENT'
].includes(userRole);

const canViewClassPerformance = [
  'TEACHER',
  'SENIOR_TEACHER',
  'DEPARTMENT_HEAD',
  'SCHOOL_HEAD',
  'SCHOOL_ADMIN',
  'REGIONAL_OFFICER',
  'REGIONAL_ADMIN',
  'DIRECTOR',
  'MINISTRY_STAFF',
  'MINISTRY_EXECUTIVE',
  'SUPER_ADMIN'
].includes(userRole);

const canUpdatePerformance = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  PERFORMANCE_DETAILS: "PERFORMANCE_DETAILS",
  PROGRESS_UPDATE: "PROGRESS_UPDATE",
  ANALYTICS_EXPORT: "ANALYTICS_EXPORT",
  PERFORMANCE_COMPARISON: "PERFORMANCE_COMPARISON",
  INTERVENTION_PLAN: "INTERVENTION_PLAN",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handlePerformanceUpdate = async (performanceData: UpdatePerformanceData) => {
  try {
    await dispatch(updateStudentPerformance(performanceData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to update performance:', error);
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

### 1. Performance Chart Component
```typescript
// src/features/analytics/components/PerformanceChart.tsx
// Interactive charts for performance visualization
// Follow existing chart patterns
```

### 2. Progress Card Component
```typescript
// src/features/analytics/components/ProgressCard.tsx
// Display progress information in card format
// Follow existing component patterns
```

### 3. Analytics Filters Component
```typescript
// src/features/analytics/components/AnalyticsFilters.tsx
// Filtering options for analytics data
// Follow existing filter patterns
```

### 4. Performance Metrics Component
```typescript
// src/features/analytics/components/PerformanceMetrics.tsx
// Key performance indicators display
// Follow existing metrics patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include analytics routes:
```typescript
// Add to existing navigation items
{
  label: 'Analytics',
  icon: BarChart3,
  submenu: [
    { label: 'Dashboard', path: '/app/analytics/dashboard' },
    { label: 'Student Performance', path: '/app/analytics/students' },
    { label: 'Course Analytics', path: '/app/analytics/courses' },
    { label: 'Progress Tracking', path: '/app/analytics/progress' },
    { label: 'Reports', path: '/app/analytics/reports' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/analytics/dashboard" element={<PerformanceDashboardPage />} />
<Route path="/analytics/students" element={<StudentPerformancePage />} />
<Route path="/analytics/students/:studentId" element={<StudentPerformanceDetailsPage />} />
<Route path="/analytics/courses" element={<CourseAnalyticsPage />} />
<Route path="/analytics/courses/:courseId" element={<CourseAnalyticsDetailsPage />} />
<Route path="/analytics/progress" element={<ProgressTrackingPage />} />
<Route path="/analytics/reports" element={<PerformanceReportsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchStudentPerformance = createAsyncThunk(
  'studentPerformance/fetchStudentPerformance',
  async (params: PerformanceFetchParams, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getStudentPerformance(params.studentId, params.courseId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student performance');
    }
  }
);

export const fetchProgressData = createAsyncThunk(
  'progress/fetchProgressData',
  async (params: ProgressFetchParams, { rejectWithValue }) => {
    try {
      const response = await progressApi.getByStudentAndCourse(params.studentId, params.courseId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress data');
    }
  }
);

export const updateProgress = createAsyncThunk(
  'progress/updateProgress',
  async (progressData: UpdateProgressData, { rejectWithValue }) => {
    try {
      const response = await progressApi.updateProgress(
        progressData.studentId,
        progressData.courseId,
        progressData.completionPercentage,
        progressData.grade
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [timeframeFilter, setTimeframeFilter] = useState('MONTH');
const [courseFilter, setCourseFilter] = useState('');
const [studentFilter, setStudentFilter] = useState('');
const [metricType, setMetricType] = useState('OVERALL');
const [chartType, setChartType] = useState('LINE');
```

## Real-time Features

### 1. Live Performance Updates
- Real-time performance tracking
- Live progress updates
- Instant metric calculations
- Dynamic chart updates

### 2. Predictive Analytics
- Performance trend prediction
- Risk assessment algorithms
- Early intervention alerts
- Outcome forecasting

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Analytics Security Features
```typescript
// Implement performance data access control
const canViewStudentPerformance = (studentId: number, user: User) => {
  // Students can only view their own performance
  if (user.role === 'STUDENT') {
    return user.id === studentId;
  }
  
  // Parents can view their children's performance
  if (user.role === 'PARENT') {
    return user.childrenIds?.includes(studentId);
  }
  
  // Teachers can view performance for their students
  if (['TEACHER', 'SENIOR_TEACHER'].includes(user.role)) {
    return true; // Implement course enrollment check
  }
  
  // Admins can view performance in their scope
  const adminRoles = ['SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  return adminRoles.includes(user.role);
};

// Implement analytics data filtering based on user scope
const filterAnalyticsDataByUserScope = (data: AnalyticsData[], user: User) => {
  if (['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(user.role)) {
    return data; // Full access
  }
  
  if (user.role === 'REGIONAL_ADMIN') {
    return data.filter(item => item.regionId === user.regionId);
  }
  
  if (['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role)) {
    return data.filter(item => item.schoolId === user.schoolId);
  }
  
  return data.filter(item => item.userId === user.id);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Analytics-Specific Optimizations
- Efficient chart rendering
- Smart data aggregation
- Optimized real-time updates
- Analytics data caching

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Analytics-Specific Testing
- Test chart rendering
- Test data calculations
- Test filtering functionality
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `studentPerformanceSlice.ts`, `progressSlice.ts`, `analyticsSlice.ts`
2. **New API Services**: `studentPerformanceApi.ts`, `progressApi.ts`, `analyticsApi.ts`
3. **New Pages**: Analytics dashboard and reporting pages
4. **New Components**: Analytics-specific reusable components
5. **Enhanced Existing Pages**: Integration with student and course management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Analytics-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Performance analytics functioning properly
- Progress tracking working correctly
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
12. **DO** ensure accurate calculations
13. **DO** implement comprehensive analytics tracking
14. **DO** optimize for large datasets

This implementation should seamlessly integrate with the existing codebase while providing comprehensive student performance analytics capabilities for all user roles in the educational system. 