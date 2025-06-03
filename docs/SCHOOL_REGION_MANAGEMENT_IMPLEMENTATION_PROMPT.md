# Frontend Implementation Prompt: School & Region Management System

## Overview
Implement a comprehensive frontend interface for the school and region management system targeting educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    schools: schoolsReducer,  // TO BE CREATED
    regions: regionsReducer,  // TO BE CREATED
    schoolMonitoring: schoolMonitoringReducer,  // TO BE CREATED
    regionMonitoring: regionMonitoringReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/administration/
├── pages/
│   ├── SchoolListPage.tsx
│   ├── SchoolDetailsPage.tsx
│   ├── CreateSchoolPage.tsx
│   ├── RegionListPage.tsx
│   ├── RegionDetailsPage.tsx
│   ├── SchoolMonitoringPage.tsx
│   └── RegionMonitoringPage.tsx
├── components/
│   ├── SchoolCard.tsx
│   ├── SchoolForm.tsx
│   ├── RegionCard.tsx
│   ├── RegionForm.tsx
│   ├── MonitoringDashboard.tsx
│   └── MonitoringFilters.tsx
├── modals/
│   ├── CreateSchoolModal.tsx
│   ├── EditSchoolModal.tsx
│   ├── CreateRegionModal.tsx
│   ├── EditRegionModal.tsx
│   └── MonitoringDetailsModal.tsx
├── schoolsSlice.ts
├── regionsSlice.ts
├── schoolMonitoringSlice.ts
├── regionMonitoringSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/schoolApi.ts
// src/api/services/regionApi.ts
// src/api/services/schoolMonitoringApi.ts
// src/api/services/regionMonitoringApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface SchoolResponse {
  status: string;
  message: string;
  data: School | School[] | null;
  timestamp: string | null;
}

export interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  regionId: number;
  principalId?: number;
  establishedDate?: string;
  schoolType: 'PRIMARY' | 'SECONDARY' | 'COMBINED' | 'SPECIAL' | 'TECHNICAL' | 'VOCATIONAL';
  ownership: 'PUBLIC' | 'PRIVATE' | 'COMMUNITY' | 'RELIGIOUS';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
  capacity: number;
  currentEnrollment: number;
  teacherCount: number;
  classroomCount: number;
  facilities: string[];
  accreditation: {
    isAccredited: boolean;
    accreditationBody?: string;
    accreditationDate?: string;
    expiryDate?: string;
  };
  performance: {
    overallRating: number;
    academicRating: number;
    infrastructureRating: number;
    teacherQualityRating: number;
  };
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  description?: string;
  parentRegionId?: number;
  regionType: 'NATIONAL' | 'PROVINCIAL' | 'DISTRICT' | 'CIRCUIT' | 'WARD';
  administratorId?: number;
  population?: number;
  area?: number;
  schoolCount: number;
  teacherCount: number;
  studentCount: number;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  boundaries?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolMonitoring {
  id: number;
  schoolId: number;
  monitoringDate: string;
  attendanceRate: number;
  teacherPresenceRate: number;
  systemUsageCount: number;
  averageGradingDelay: number;
  complianceScore: number;
  alertCount: number;
  performanceMetrics: {
    academicPerformance: number;
    resourceUtilization: number;
    teacherEffectiveness: number;
    studentEngagement: number;
  };
  issues: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    reportedAt: string;
  }>;
  recommendations: string[];
  lastUpdated: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegionMonitoring {
  id: number;
  regionId: number;
  monitoringDate: string;
  totalSchools: number;
  activeSchools: number;
  totalTeachers: number;
  totalStudents: number;
  averageAttendanceRate: number;
  averageSystemUsage: number;
  averageComplianceScore: number;
  totalAlerts: number;
  performanceMetrics: {
    overallPerformance: number;
    resourceDistribution: number;
    teacherRetention: number;
    studentOutcomes: number;
  };
  trends: {
    enrollmentTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
    performanceTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    resourceTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  };
  challenges: string[];
  achievements: string[];
  lastUpdated: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const schoolApi = {
  getAll: async (): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get('/schools');
  },
  getById: async (id: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/${id}`);
  },
  getByRegion: async (regionId: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/region/${regionId}`);
  },
  getActiveByRegion: async (regionId: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/region/${regionId}/active`);
  },
  getByCode: async (code: string): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get(`/schools/code/${code}`);
  },
  getActive: async (): Promise<AxiosResponse<SchoolResponse>> => {
    return api.get('/schools/active');
  },
  create: async (schoolData: CreateSchoolRequest): Promise<AxiosResponse<SchoolResponse>> => {
    return api.post('/schools', schoolData);
  },
  update: async (id: number, schoolData: UpdateSchoolRequest): Promise<AxiosResponse<SchoolResponse>> => {
    return api.put(`/schools/${id}`, schoolData);
  },
  delete: async (id: number): Promise<AxiosResponse<SchoolResponse>> => {
    return api.delete(`/schools/${id}`);
  },
  deactivate: async (id: number): Promise<AxiosResponse<void>> => {
    return api.post(`/schools/${id}/deactivate`);
  },
  reactivate: async (id: number): Promise<AxiosResponse<void>> => {
    return api.post(`/schools/${id}/reactivate`);
  },
};

const regionApi = {
  getAll: async (): Promise<AxiosResponse<{ data: Region[] }>> => {
    return api.get('/regions');
  },
  getById: async (id: number): Promise<AxiosResponse<{ data: Region }>> => {
    return api.get(`/regions/${id}`);
  },
  getByType: async (type: string): Promise<AxiosResponse<{ data: Region[] }>> => {
    return api.get(`/regions/type/${type}`);
  },
  getByParent: async (parentId: number): Promise<AxiosResponse<{ data: Region[] }>> => {
    return api.get(`/regions/parent/${parentId}`);
  },
  getActive: async (): Promise<AxiosResponse<{ data: Region[] }>> => {
    return api.get('/regions/active');
  },
  create: async (regionData: CreateRegionRequest): Promise<AxiosResponse<{ data: Region }>> => {
    return api.post('/regions', regionData);
  },
  update: async (id: number, regionData: UpdateRegionRequest): Promise<AxiosResponse<{ data: Region }>> => {
    return api.put(`/regions/${id}`, regionData);
  },
  delete: async (id: number): Promise<AxiosResponse<void>> => {
    return api.delete(`/regions/${id}`);
  },
};

const schoolMonitoringApi = {
  getBySchool: async (schoolId: number): Promise<AxiosResponse<{ data: SchoolMonitoring }>> => {
    return api.get(`/monitoring/schools/school/${schoolId}`);
  },
  getBySchoolAndDate: async (schoolId: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring }>> => {
    return api.get(`/monitoring/schools/school/${schoolId}/date/${date}`);
  },
  getBySchoolAndDateRange: async (schoolId: number, startDate: string, endDate: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/school/${schoolId}/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
  getByRegion: async (regionId: number): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/region/${regionId}`);
  },
  getByDate: async (date: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/date/${date}`);
  },
  getLatestForAllSchools: async (): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get('/monitoring/schools/latest/all');
  },
  getSchoolsWithLowAttendance: async (threshold: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/attendance/below-threshold?threshold=${threshold}&date=${date}`);
  },
  getSchoolsWithLowUsage: async (threshold: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/usage/below-threshold?threshold=${threshold}&date=${date}`);
  },
  getSchoolsWithDelayedGrading: async (threshold: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/grading/delayed?threshold=${threshold}&date=${date}`);
  },
  getSchoolsWithLowCompliance: async (threshold: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/compliance/below-threshold?threshold=${threshold}&date=${date}`);
  },
  getSchoolsWithHighAlerts: async (threshold: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring[] }>> => {
    return api.get(`/monitoring/schools/alerts/high?threshold=${threshold}&date=${date}`);
  },
  updateSchoolMonitoring: async (schoolId: number, date: string): Promise<AxiosResponse<void>> => {
    return api.post(`/monitoring/schools/update/school/${schoolId}?date=${date}`);
  },
  generateMonitoringData: async (schoolId: number, date: string): Promise<AxiosResponse<{ data: SchoolMonitoring }>> => {
    return api.post(`/monitoring/schools/generate/school/${schoolId}?date=${date}`);
  },
  generateForAllSchools: async (date: string): Promise<AxiosResponse<void>> => {
    return api.post(`/monitoring/schools/generate/all?date=${date}`);
  },
};

export default { schoolApi, regionApi, schoolMonitoringApi };
```

## Core Features to Implement

### 1. School Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/administration/schoolsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const schoolsSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    clearCurrentSchool: (state) => {
      state.currentSchool = null;
    },
    clearSchoolsError: (state) => {
      state.error = null;
    },
    setSchoolFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateSchoolStatus: (state, action) => {
      const school = state.schools.find(s => s.id === action.payload.id);
      if (school) {
        school.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `SchoolListPage.tsx` - View and manage all schools
- `SchoolDetailsPage.tsx` - View school details and statistics
- `CreateSchoolPage.tsx` - Create and edit schools
- `RegionListPage.tsx` - View and manage regions
- `RegionDetailsPage.tsx` - View region details and schools
- `SchoolMonitoringPage.tsx` - School monitoring dashboard
- `RegionMonitoringPage.tsx` - Regional monitoring overview

### 2. School Administration
Comprehensive school management:
- School registration and setup
- School profile management
- Capacity and enrollment tracking
- Facility management
- Performance monitoring

### 3. Regional Administration
Regional oversight capabilities:
- Region hierarchy management
- Multi-level administration
- Regional statistics
- Cross-regional reporting
- Resource allocation tracking

### 4. Monitoring and Analytics
Advanced monitoring system:
- Real-time school monitoring
- Performance dashboards
- Compliance tracking
- Alert management
- Trend analysis

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canManageSchools = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN'
].includes(userRole);

const canViewSchools = [
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER',
  'STUDENT',
  'PARENT',
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN'
].includes(userRole);

const canManageRegions = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR'
].includes(userRole);

const canViewMonitoring = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  SCHOOL_ADD_NEW: "SCHOOL_ADD_NEW",
  SCHOOL_EDIT: "SCHOOL_EDIT",
  SCHOOL_DETAILS: "SCHOOL_DETAILS",
  REGION_ADD_NEW: "REGION_ADD_NEW",
  REGION_EDIT: "REGION_EDIT",
  REGION_DETAILS: "REGION_DETAILS",
  MONITORING_DETAILS: "MONITORING_DETAILS",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleSchoolCreation = async (schoolData: CreateSchoolData) => {
  try {
    await dispatch(createSchool(schoolData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create school:', error);
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
  data={schools}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. School Card Component
```typescript
// src/features/administration/components/SchoolCard.tsx
// Display school information in card format
// Follow existing component patterns
```

### 2. School Form Component
```typescript
// src/features/administration/components/SchoolForm.tsx
// Form for creating and editing schools
// Follow existing form patterns
```

### 3. Monitoring Dashboard Component
```typescript
// src/features/administration/components/MonitoringDashboard.tsx
// Real-time monitoring dashboard
// Follow existing dashboard patterns
```

### 4. Region Tree Component
```typescript
// src/features/administration/components/RegionTree.tsx
// Hierarchical region display
// Follow existing tree patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include administration routes:
```typescript
// Add to existing navigation items
{
  label: 'Administration',
  icon: Building,
  submenu: [
    { label: 'Schools', path: '/app/administration/schools' },
    { label: 'Regions', path: '/app/administration/regions' },
    { label: 'School Monitoring', path: '/app/administration/monitoring/schools' },
    { label: 'Regional Monitoring', path: '/app/administration/monitoring/regions' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/administration/schools" element={<SchoolListPage />} />
<Route path="/administration/schools/:id" element={<SchoolDetailsPage />} />
<Route path="/administration/schools/create" element={<CreateSchoolPage />} />
<Route path="/administration/schools/:id/edit" element={<EditSchoolPage />} />
<Route path="/administration/regions" element={<RegionListPage />} />
<Route path="/administration/regions/:id" element={<RegionDetailsPage />} />
<Route path="/administration/monitoring/schools" element={<SchoolMonitoringPage />} />
<Route path="/administration/monitoring/regions" element={<RegionMonitoringPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchSchools = createAsyncThunk(
  'schools/fetchSchools',
  async (params: SchoolFetchParams, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schools');
    }
  }
);

export const createSchool = createAsyncThunk(
  'schools/createSchool',
  async (schoolData: CreateSchoolData, { rejectWithValue }) => {
    try {
      const response = await schoolApi.create(schoolData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create school');
    }
  }
);

export const fetchSchoolMonitoring = createAsyncThunk(
  'schoolMonitoring/fetchSchoolMonitoring',
  async (params: MonitoringFetchParams, { rejectWithValue }) => {
    try {
      const response = await schoolMonitoringApi.getBySchool(params.schoolId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monitoring data');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [schoolTypeFilter, setSchoolTypeFilter] = useState('ALL');
const [regionFilter, setRegionFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [monitoringDateRange, setMonitoringDateRange] = useState({ start: '', end: '' });
const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Monitoring Updates
- Real-time school status updates
- Live monitoring dashboards
- Instant alert notifications
- Performance metric updates

### 2. Geographic Visualization
- Interactive maps
- School location tracking
- Regional boundaries
- Performance heat maps

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Administrative Security Features
```typescript
// Implement school access control
const canViewSchool = (school: School, user: User) => {
  // Super admins can view all schools
  if (['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(user.role)) {
    return true;
  }
  
  // Regional admins can view schools in their region
  if (user.role === 'REGIONAL_ADMIN' && school.regionId === user.regionId) {
    return true;
  }
  
  // School admins can view their own school
  if (['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role) && school.id === user.schoolId) {
    return true;
  }
  
  return false;
};

// Implement monitoring access control
const canViewMonitoring = (schoolId: number, user: User) => {
  // System admins can view all monitoring data
  const systemAdmins = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF'];
  if (systemAdmins.includes(user.role)) return true;
  
  // Regional admins can view monitoring for schools in their region
  if (user.role === 'REGIONAL_ADMIN') {
    return true; // Implement region check
  }
  
  // School admins can view their own school's monitoring
  if (['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role)) {
    return user.schoolId === schoolId;
  }
  
  return false;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Administration-Specific Optimizations
- Efficient school listing
- Smart monitoring data loading
- Optimized map rendering
- Regional data caching

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Administration-Specific Testing
- Test school management workflow
- Test monitoring data accuracy
- Test regional hierarchy
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `schoolsSlice.ts`, `regionsSlice.ts`, `schoolMonitoringSlice.ts`, `regionMonitoringSlice.ts`
2. **New API Services**: `schoolApi.ts`, `regionApi.ts`, `schoolMonitoringApi.ts`, `regionMonitoringApi.ts`
3. **New Pages**: School and region management pages
4. **New Components**: Administration-specific reusable components
5. **Enhanced Existing Pages**: Integration with user management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Administration-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- School management functioning properly
- Region administration working correctly
- Monitoring dashboards functioning as expected
- Real-time updates working reliably
- Responsive design consistent with existing pages
- Administrative security measures properly implemented

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
12. **DO** ensure accurate monitoring calculations
13. **DO** implement comprehensive administrative tracking
14. **DO** optimize for large datasets

This implementation should seamlessly integrate with the existing codebase while providing comprehensive school and region management capabilities for all user roles in the educational system. 