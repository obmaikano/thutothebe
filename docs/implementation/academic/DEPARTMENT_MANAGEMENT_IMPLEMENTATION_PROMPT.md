# Frontend Implementation Prompt: Department Management System

## Overview
Implement a comprehensive frontend interface for the department management system targeting educational roles: **SUPER_ADMIN**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    departments: departmentsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/departments/
├── pages/
│   ├── DepartmentListPage.tsx
│   ├── DepartmentDetailsPage.tsx
│   ├── CreateDepartmentPage.tsx
│   └── DepartmentManagementPage.tsx
├── components/
│   ├── DepartmentCard.tsx
│   ├── DepartmentForm.tsx
│   ├── DepartmentTeachers.tsx
│   ├── DepartmentSubjects.tsx
│   ├── DepartmentFilters.tsx
│   ├── DepartmentStats.tsx
│   └── DepartmentHierarchy.tsx
├── modals/
│   ├── CreateDepartmentModal.tsx
│   ├── EditDepartmentModal.tsx
│   ├── AssignTeacherModal.tsx
│   ├── AssignSubjectModal.tsx
│   ├── AssignDepartmentHeadModal.tsx
│   └── DepartmentDetailsModal.tsx
├── departmentsSlice.ts
├── README.md
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new file following existing pattern:
// src/api/services/departmentApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface DepartmentResponse {
  status: string;
  message: string;
  data: Department | Department[] | null;
  timestamp: string | null;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  schoolId: number;
  schoolName: string;
  departmentHeadId?: number;
  departmentHeadName?: string;
  departmentHead?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    specialization?: string;
  };
  teachers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    specialization?: string;
    yearsOfExperience?: number;
  }>;
  subjects: Array<{
    id: number;
    name: string;
    code: string;
    description?: string;
    credits?: number;
  }>;
  budget?: number;
  location?: string;
  establishedDate?: string;
  goals?: string[];
  achievements?: string[];
  statistics: {
    totalTeachers: number;
    totalSubjects: number;
    totalStudents: number;
    averageClassSize: number;
    performanceRating?: number;
  };
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  schoolId: number;
  departmentHeadId?: number;
  budget?: number;
  location?: string;
  goals?: string[];
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  departmentHeadId?: number;
  budget?: number;
  location?: string;
  goals?: string[];
}

const departmentApi = {
  getAll: async (): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get('/api/departments');
  },
  getById: async (id: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/${id}`);
  },
  getBySchool: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/school/${schoolId}`);
  },
  getActiveBySchool: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/school/${schoolId}/active`);
  },
  getActive: async (): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get('/api/departments/active');
  },
  getByNameAndSchool: async (name: string, schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/search?name=${name}&schoolId=${schoolId}`);
  },
  getByDepartmentHead: async (departmentHeadId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/head/${departmentHeadId}`);
  },
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/teacher/${teacherId}`);
  },
  getBySubject: async (subjectId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/subject/${subjectId}`);
  },
  getDepartmentsWithoutHead: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/school/${schoolId}/without-head`);
  },
  getDepartmentsWithSubjects: async (schoolId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.get(`/api/departments/school/${schoolId}/with-subjects`);
  },
  countActiveBySchool: async (schoolId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/api/departments/school/${schoolId}/count`);
  },
  existsByNameAndSchool: async (name: string, schoolId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/api/departments/exists?name=${name}&schoolId=${schoolId}`);
  },
  create: async (departmentData: CreateDepartmentRequest): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post('/api/departments', departmentData);
  },
  update: async (id: number, departmentData: UpdateDepartmentRequest): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.put(`/api/departments/${id}`, departmentData);
  },
  delete: async (id: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/api/departments/${id}`);
  },
  activate: async (id: number): Promise<AxiosResponse<void>> => {
    return api.put(`/api/departments/${id}/activate`);
  },
  deactivate: async (id: number): Promise<AxiosResponse<void>> => {
    return api.put(`/api/departments/${id}/deactivate`);
  },
  assignDepartmentHead: async (departmentId: number, userId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post(`/api/departments/${departmentId}/head/${userId}`);
  },
  removeDepartmentHead: async (departmentId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/api/departments/${departmentId}/head`);
  },
  assignTeacher: async (departmentId: number, teacherId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post(`/api/departments/${departmentId}/teachers/${teacherId}`);
  },
  removeTeacher: async (departmentId: number, teacherId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/api/departments/${departmentId}/teachers/${teacherId}`);
  },
  assignSubject: async (departmentId: number, subjectId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.post(`/api/departments/${departmentId}/subjects/${subjectId}`);
  },
  removeSubject: async (departmentId: number, subjectId: number): Promise<AxiosResponse<DepartmentResponse>> => {
    return api.delete(`/api/departments/${departmentId}/subjects/${subjectId}`);
  },
};

export default departmentApi;
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
const DepartmentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { departments, status, error } = useAppSelector(state => state.departments);
  const { user } = useAuth();
  
  // Follow existing useEffect pattern
  useEffect(() => {
    if (user?.schoolId) {
      dispatch(fetchDepartmentsBySchool(user.schoolId));
    } else {
      dispatch(fetchAllDepartments());
    }
    return () => {
      dispatch(clearDepartmentsError());
    };
  }, [dispatch, user?.schoolId]);

  // Follow existing modal opening pattern
  const handleCreateDepartment = () => {
    dispatch(openModal({
      title: 'Create New Department',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-2">Manage academic departments and their resources</p>
        </div>
        {/* Follow existing button pattern */}
        {canCreateDepartment && (
          <button 
            onClick={handleCreateDepartment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create Department
          </button>
        )}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Role-Based Dashboard Enhancement
Extend existing dashboard functionality for educational roles:

**Add to existing dashboard features:**
- Department overview widgets
- Teacher distribution charts using existing Chart.js setup
- Subject allocation monitoring
- Department performance indicators
- Budget utilization tracking

### 2. Department Management Interface

**New Redux Slice to Create:**
```typescript
// src/features/departments/departmentsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    currentDepartment: null,
    status: 'idle',
    error: null,
    filters: {
      search: '',
      school: '',
      active: true,
      hasHead: null,
    },
    statistics: {
      totalDepartments: 0,
      activeDepartments: 0,
      departmentsWithoutHead: 0,
      averageTeachersPerDepartment: 0,
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDepartment: (state, action) => {
      state.currentDepartment = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});
```

**New API Service to Create:**
```typescript
// src/api/services/departmentApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `DepartmentListPage.tsx` - Main department listing with filters
- `DepartmentDetailsPage.tsx` - Detailed department view
- `CreateDepartmentPage.tsx` - Department creation form
- `DepartmentManagementPage.tsx` - Comprehensive management interface

### 3. Department-Specific Components

**Core Components:**
- `DepartmentCard.tsx` - Department overview card
- `DepartmentForm.tsx` - Create/edit department form
- `DepartmentTeachers.tsx` - Teacher management within department
- `DepartmentSubjects.tsx` - Subject assignment and management
- `DepartmentStats.tsx` - Department statistics and metrics
- `DepartmentHierarchy.tsx` - Organizational structure visualization

### 4. Teacher and Subject Assignment
Extend existing teacher and subject management with department context:
- Add department-based teacher filtering
- Add subject assignment to departments
- Add department head assignment functionality
- Add bulk assignment capabilities

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canManageDepartments = [
  'SUPER_ADMIN', 
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD'
].includes(userRole);

const canViewDepartments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN', 
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canAssignTeachers = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  DEPARTMENT_ADD_NEW: "DEPARTMENT_ADD_NEW",
  DEPARTMENT_EDIT: "DEPARTMENT_EDIT",
  DEPARTMENT_DETAILS: "DEPARTMENT_DETAILS",
  ASSIGN_TEACHER: "ASSIGN_TEACHER",
  ASSIGN_SUBJECT: "ASSIGN_SUBJECT",
  ASSIGN_DEPARTMENT_HEAD: "ASSIGN_DEPARTMENT_HEAD",
  DEPARTMENT_STATS: "DEPARTMENT_STATS",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleDepartmentUpdate = async () => {
  try {
    await dispatch(updateDepartment(departmentData)).unwrap();
    dispatch(showNotification({
      message: 'Department updated successfully',
      status: 'success'
    }));
  } catch (error) {
    console.error('Failed to update department:', error);
    dispatch(showNotification({
      message: error.message || 'Failed to update department',
      status: 'error'
    }));
  }
};
```

### 4. Follow Existing Styling Patterns
Use existing DaisyUI classes and patterns:
```typescript
// Follow existing button patterns
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">

// Follow existing card patterns
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

// Follow existing table patterns using existing Table component
<Table 
  data={departments}
  columns={columns}
  searchable={true}
  filterable={true}
  // ... other props following existing pattern
/>

// Follow existing form patterns
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="form-control">
    <label className="label">
      <span className="label-text">Department Name</span>
    </label>
    <input 
      type="text" 
      className="input input-bordered w-full" 
      {...register('name')}
    />
  </div>
</div>
```

## Specific Components to Create

### 1. Department Card Component
```typescript
// src/features/departments/components/DepartmentCard.tsx
interface DepartmentCardProps {
  department: Department;
  onEdit?: (department: Department) => void;
  onDelete?: (departmentId: number) => void;
  onViewDetails?: (department: Department) => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  // Follow existing card component patterns
  // Use existing styling and interaction patterns
};
```

### 2. Department Form Component
```typescript
// src/features/departments/components/DepartmentForm.tsx
interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: CreateDepartmentRequest | UpdateDepartmentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  onCancel,
  isLoading
}) => {
  // Follow existing form patterns with React Hook Form
  // Use existing validation patterns with Zod
};
```

### 3. Department Teachers Component
```typescript
// src/features/departments/components/DepartmentTeachers.tsx
interface DepartmentTeachersProps {
  departmentId: number;
  teachers: Teacher[];
  onAssignTeacher: (teacherId: number) => void;
  onRemoveTeacher: (teacherId: number) => void;
  canManageTeachers: boolean;
}

const DepartmentTeachers: React.FC<DepartmentTeachersProps> = ({
  departmentId,
  teachers,
  onAssignTeacher,
  onRemoveTeacher,
  canManageTeachers
}) => {
  // Follow existing list/table patterns
  // Use existing modal patterns for assignment
};
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include department management routes:
```typescript
// Add to existing navigation items
{
  label: 'Department Management',
  icon: Building2,
  submenu: [
    { label: 'All Departments', path: '/app/departments' },
    { label: 'Create Department', path: '/app/departments/create' },
    { label: 'Department Analytics', path: '/app/departments/analytics' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/departments" element={<DepartmentListPage />} />
<Route path="/departments/create" element={<CreateDepartmentPage />} />
<Route path="/departments/:id" element={<DepartmentDetailsPage />} />
<Route path="/departments/management" element={<DepartmentManagementPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (schoolId?: number, { rejectWithValue }) => {
    try {
      const response = schoolId 
        ? await departmentApi.getBySchool(schoolId)
        : await departmentApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData: CreateDepartmentRequest, { rejectWithValue }) => {
    try {
      const response = await departmentApi.create(departmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

export const assignTeacherToDepartment = createAsyncThunk(
  'departments/assignTeacher',
  async ({ departmentId, teacherId }: { departmentId: number; teacherId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.assignTeacher(departmentId, teacherId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign teacher');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from UserListPage
const [searchTerm, setSearchTerm] = useState('');
const [schoolFilter, setSchoolFilter] = useState('');
const [activeFilter, setActiveFilter] = useState(true);
const [hasHeadFilter, setHasHeadFilter] = useState<boolean | null>(null);
const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
```

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Follow Existing Permission Checking
```typescript
// Use existing role checking patterns
const canAccessFeature = (requiredRoles: string[]) => {
  return requiredRoles.includes(user?.role);
};

// Department-specific permission checks
const canManageDepartment = (department: Department) => {
  if (['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role)) {
    return true;
  }
  if (user?.role === 'DEPARTMENT_HEAD' && department.departmentHeadId === user?.id) {
    return true;
  }
  return false;
};
```

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure (if any)
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Integration with Existing Features
- Ensure compatibility with existing user management
- Test integration with existing authentication
- Verify compatibility with existing modal system
- Test integration with existing teacher and subject management

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Leverage Existing Infrastructure
- Use existing WebSocket service for real-time updates
- Use existing caching patterns
- Follow existing error boundary patterns

## Deliverables

1. **New Redux Slice**: `departmentsSlice.ts`
2. **New API Service**: `departmentApi.ts`
3. **New Pages**: Department list, details, creation, and management pages
4. **New Components**: Department-specific reusable components
5. **New Modals**: Department creation, editing, and assignment modals
6. **Enhanced Existing Pages**: Extended teacher and subject management with department context
7. **Updated Navigation**: Extended sidebar and routes
8. **New Modal Types**: Department-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time updates using existing WebSocket infrastructure
- Responsive design consistent with existing pages
- Proper integration with existing teacher and subject management
- Efficient department hierarchy visualization
- Comprehensive department analytics and reporting

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
11. **DO** integrate with existing teacher and subject management systems
12. **DO** respect existing school-based data scoping
13. **DO** follow existing permission checking patterns for educational roles

This implementation should seamlessly integrate with the existing codebase while providing comprehensive department management capabilities for educational institutions. The system should support the full department lifecycle from creation to management, with proper role-based access control and integration with existing teacher and subject management systems. 