# Frontend Implementation Prompt: Schedule/Timetable Management System

## Overview
Implement a comprehensive frontend interface for the schedule/timetable management system targeting all educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    schedules: schedulesReducer,  // TO BE CREATED
    scheduleHistory: scheduleHistoryReducer,  // TO BE CREATED
    timetables: timetablesReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/schedules/
├── pages/
│   ├── ScheduleListPage.tsx
│   ├── TimetableViewPage.tsx
│   ├── CreateSchedulePage.tsx
│   ├── ScheduleConflictsPage.tsx
│   └── ScheduleHistoryPage.tsx
├── components/
│   ├── TimetableGrid.tsx
│   ├── ScheduleCard.tsx
│   ├── ScheduleForm.tsx
│   ├── ConflictChecker.tsx
│   ├── TimeSlotPicker.tsx
│   └── ScheduleFilters.tsx
├── modals/
│   ├── CreateScheduleModal.tsx
│   ├── EditScheduleModal.tsx
│   ├── ScheduleDetailsModal.tsx
│   ├── ConflictResolutionModal.tsx
│   └── BulkScheduleModal.tsx
├── schedulesSlice.ts
├── scheduleHistorySlice.ts
├── timetablesSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/scheduleApi.ts
// src/api/services/scheduleHistoryApi.ts
// src/api/services/timetableApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface ScheduleResponse {
  status: string;
  message: string;
  data: Schedule | Schedule[] | null;
  timestamp: string | null;
}

export interface Schedule {
  id: number;
  title: string;
  description?: string;
  subjectId: number;
  teacherId: number;
  classId: number;
  schoolId: number;
  regionId: number;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  location?: string;
  scheduleType: 'REGULAR' | 'EXAM' | 'ASSEMBLY' | 'BREAK' | 'LUNCH' | 'STUDY_HALL' | 'EXTRACURRICULAR' | 'MEETING';
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'RESCHEDULED' | 'PENDING' | 'DRAFT';
  isRecurring: boolean;
  recurrencePattern?: string;
  effectiveDate: string;
  expiryDate?: string;
  maxStudents?: number;
  currentStudents: number;
  requiresApproval: boolean;
  approvedById?: number;
  approvedAt?: string;
  version: number;
  parentScheduleId?: number;
  changeReason?: string;
  metadata?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleHistory {
  id: number;
  scheduleId: number;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'RESCHEDULED';
  changedById: number;
  changeReason?: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
}

export interface Timetable {
  id: number;
  name: string;
  description?: string;
  academicYear: number;
  term: string;
  schoolId: number;
  regionId: number;
  classId?: number;
  teacherId?: number;
  isTemplate: boolean;
  isPublished: boolean;
  publishedAt?: string;
  effectiveDate: string;
  expiryDate?: string;
  scheduleCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const scheduleApi = {
  getAll: async (): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get('/schedules');
  },
  getById: async (id: number): Promise<AxiosResponse<ScheduleResponse>> => {
    return api.get(`/schedules/${id}`);
  },
  getForUser: async (userRole: string, userId: number, userRegionId?: number, userSchoolId?: number, page: number = 0, size: number = 20): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString(),
      page: page.toString(),
      size: size.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/user?${params}`);
  },
  getBySchool: async (schoolId: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/school/${schoolId}?${params}`);
  },
  getByClass: async (classId: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/class/${classId}?${params}`);
  },
  getByTeacher: async (teacherId: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/teacher/${teacherId}?${params}`);
  },
  getByDayOfWeek: async (dayOfWeek: string, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/day/${dayOfWeek}?${params}`);
  },
  getForStudent: async (studentId: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/student/${studentId}?${params}`);
  },
  getForParent: async (parentId: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/parent/${parentId}?${params}`);
  },
  getActiveForDateRange: async (startDate: string, endDate: string, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/date-range?${params}`);
  },
  checkConflicts: async (classId?: number, teacherId?: number, dayOfWeek?: string, startTime?: string, endTime?: string, currentDate?: string, excludeId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId.toString());
    if (teacherId) params.append('teacherId', teacherId.toString());
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek);
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (currentDate) params.append('currentDate', currentDate);
    if (excludeId) params.append('excludeId', excludeId.toString());
    return api.get(`/schedules/conflicts/check?${params}`);
  },
  create: async (scheduleData: CreateScheduleRequest, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.post(`/schedules/create?${params}`, scheduleData);
  },
  update: async (id: number, scheduleData: UpdateScheduleRequest, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.put(`/schedules/${id}/update?${params}`, scheduleData);
  },
  delete: async (id: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number, reason?: string): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.delete(`/schedules/${id}/delete?${params}`);
  },
  updateStatus: async (id: number, status: string, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number, reason?: string): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      status,
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.put(`/schedules/${id}/status?${params}`);
  },
  bulkUpdate: async (scheduleIds: number[], updateData: any, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number, reason?: string): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      scheduleIds: scheduleIds.join(','),
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.put(`/schedules/bulk-update?${params}`, updateData);
  },
  getHistory: async (id: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<any>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/${id}/history?${params}`);
  },
  getVersionHistory: async (parentId: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    return api.get(`/schedules/${parentId}/versions?${params}`);
  },
  rollbackToVersion: async (id: number, version: number, userRole: string, userId: number, userRegionId?: number, userSchoolId?: number, reason?: string): Promise<AxiosResponse<ScheduleResponse>> => {
    const params = new URLSearchParams({
      userRole,
      userId: userId.toString()
    });
    if (userRegionId) params.append('userRegionId', userRegionId.toString());
    if (userSchoolId) params.append('userSchoolId', userSchoolId.toString());
    if (reason) params.append('reason', reason);
    return api.post(`/schedules/${id}/rollback/${version}?${params}`);
  },
};

export default scheduleApi;
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
const ScheduleListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schedules, status, error } = useAppSelector(state => state.schedules);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchSchedules());
    return () => {
      dispatch(clearScheduleError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateSchedule = () => {
    dispatch(openModal({
      title: 'Create New Schedule',
      bodyType: MODAL_BODY_TYPES.SCHEDULE_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">Manage class schedules and timetables</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Schedule Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/schedules/schedulesSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    clearCurrentSchedule: (state) => {
      state.currentSchedule = null;
    },
    clearScheduleError: (state) => {
      state.error = null;
    },
    setScheduleFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSelectedTimeSlot: (state, action) => {
      state.selectedTimeSlot = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/scheduleApi.ts
// src/api/services/scheduleHistoryApi.ts
// src/api/services/timetableApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `ScheduleListPage.tsx` - View and manage all schedules
- `TimetableViewPage.tsx` - Visual timetable grid view
- `CreateSchedulePage.tsx` - Create and edit schedules
- `ScheduleConflictsPage.tsx` - Resolve scheduling conflicts
- `ScheduleHistoryPage.tsx` - View schedule change history

### 2. Timetable Visualization
Interactive timetable displays:
- Weekly grid view
- Daily schedule view
- Teacher schedule view
- Class schedule view
- Room/resource scheduling

### 3. Conflict Detection and Resolution
Smart scheduling conflict management:
- Real-time conflict detection
- Automatic conflict resolution suggestions
- Resource availability checking
- Time slot optimization
- Bulk schedule validation

### 4. Schedule History and Versioning
Comprehensive change tracking:
- Schedule version control
- Change history tracking
- Rollback capabilities
- Audit trail maintenance
- Approval workflows

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateSchedules = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER'
].includes(userRole);

const canViewSchedules = [
  'STUDENT',
  'PARENT',
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

const canManageSchedules = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
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
  SCHEDULE_ADD_NEW: "SCHEDULE_ADD_NEW",
  SCHEDULE_EDIT: "SCHEDULE_EDIT",
  SCHEDULE_DETAILS: "SCHEDULE_DETAILS",
  SCHEDULE_CONFLICT_RESOLUTION: "SCHEDULE_CONFLICT_RESOLUTION",
  SCHEDULE_BULK_UPDATE: "SCHEDULE_BULK_UPDATE",
  SCHEDULE_VERSION_HISTORY: "SCHEDULE_VERSION_HISTORY",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleScheduleCreation = async (scheduleData: CreateScheduleData) => {
  try {
    await dispatch(createSchedule(scheduleData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create schedule:', error);
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
  data={schedules}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Timetable Grid Component
```typescript
// src/features/schedules/components/TimetableGrid.tsx
// Interactive weekly timetable grid
// Follow existing component patterns
```

### 2. Schedule Card Component
```typescript
// src/features/schedules/components/ScheduleCard.tsx
// Display schedule information in card format
// Follow existing component structure
```

### 3. Schedule Form Component
```typescript
// src/features/schedules/components/ScheduleForm.tsx
// Form for creating and editing schedules
// Follow existing form patterns
```

### 4. Conflict Checker Component
```typescript
// src/features/schedules/components/ConflictChecker.tsx
// Real-time conflict detection and resolution
// Follow existing component patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include schedule routes:
```typescript
// Add to existing navigation items
{
  label: 'Schedules',
  icon: Calendar,
  submenu: [
    { label: 'All Schedules', path: '/app/schedules' },
    { label: 'Timetable View', path: '/app/schedules/timetable' },
    { label: 'Create Schedule', path: '/app/schedules/create' },
    { label: 'Conflicts', path: '/app/schedules/conflicts' },
    { label: 'History', path: '/app/schedules/history' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/schedules" element={<ScheduleListPage />} />
<Route path="/schedules/:id" element={<ScheduleDetailsPage />} />
<Route path="/schedules/timetable" element={<TimetableViewPage />} />
<Route path="/schedules/create" element={<CreateSchedulePage />} />
<Route path="/schedules/conflicts" element={<ScheduleConflictsPage />} />
<Route path="/schedules/history" element={<ScheduleHistoryPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (params: ScheduleFetchParams, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getForUser(
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules');
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/createSchedule',
  async (scheduleData: CreateScheduleData, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.create(
        scheduleData.schedule,
        scheduleData.userRole,
        scheduleData.userId,
        scheduleData.userRegionId,
        scheduleData.userSchoolId
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
    }
  }
);

export const checkConflicts = createAsyncThunk(
  'schedules/checkConflicts',
  async (conflictData: ConflictCheckData, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.checkConflicts(
        conflictData.classId,
        conflictData.teacherId,
        conflictData.dayOfWeek,
        conflictData.startTime,
        conflictData.endTime,
        conflictData.currentDate,
        conflictData.excludeId
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check conflicts');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [selectedDay, setSelectedDay] = useState<string>('MONDAY');
const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
const [scheduleTypeFilter, setScheduleTypeFilter] = useState('ALL');
const [statusFilter, setStatusFilter] = useState('');
const [showConflictsOnly, setShowConflictsOnly] = useState(false);
```

## Real-time Features

### 1. Live Schedule Updates
- Real-time schedule notifications
- Live conflict detection
- Instant status updates
- Schedule synchronization

### 2. Conflict Resolution
- Real-time conflict checking
- Automatic resolution suggestions
- Resource availability tracking
- Schedule optimization

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Schedule Security Features
```typescript
// Implement schedule access control
const canViewSchedule = (schedule: Schedule, user: User) => {
  // Check user's access level
  switch (user.role) {
    case 'STUDENT':
      return schedule.classId === user.classId;
    case 'PARENT':
      // Parents can view their children's schedules
      return true; // Implement parent-child relationship check
    case 'TEACHER':
    case 'SENIOR_TEACHER':
      return schedule.teacherId === user.id || schedule.schoolId === user.schoolId;
    case 'SCHOOL_ADMIN':
    case 'SCHOOL_HEAD':
      return schedule.schoolId === user.schoolId;
    case 'REGIONAL_ADMIN':
    case 'REGIONAL_OFFICER':
      return schedule.regionId === user.regionId;
    default:
      return ['MINISTRY_STAFF', 'MINISTRY_EXECUTIVE', 'SUPER_ADMIN'].includes(user.role);
  }
};

// Implement schedule management permissions
const canManageSchedule = (schedule: Schedule, user: User) => {
  const managerRoles = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN'];
  if (managerRoles.includes(user.role)) return true;
  
  // Teachers can manage their own schedules
  return schedule.teacherId === user.id;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Schedule-Specific Optimizations
- Efficient timetable rendering
- Smart conflict detection algorithms
- Optimized schedule queries
- Calendar view caching

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Schedule-Specific Testing
- Test schedule creation workflow
- Test conflict detection algorithms
- Test timetable rendering
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `schedulesSlice.ts`, `scheduleHistorySlice.ts`, `timetablesSlice.ts`
2. **New API Services**: `scheduleApi.ts`, `scheduleHistoryApi.ts`, `timetableApi.ts`
3. **New Pages**: Schedule management, timetable views, and conflict resolution pages
4. **New Components**: Schedule-specific reusable components
5. **Enhanced Existing Pages**: Integration with calendar and dashboard
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Schedule-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Schedule creation and management functioning properly
- Conflict detection working correctly
- Timetable views rendering accurately
- Version control and history tracking working
- Responsive design consistent with existing pages
- Schedule security measures properly implemented

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
11. **DO** implement proper schedule validation
12. **DO** ensure conflict detection is accurate and fast
13. **DO** implement comprehensive version control
14. **DO** optimize for complex scheduling scenarios

This implementation should seamlessly integrate with the existing codebase while providing comprehensive schedule and timetable management capabilities for all user roles in the educational system. 