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
│   └── DepartmentFilters.tsx
├── modals/
│   ├── CreateDepartmentModal.tsx
│   ├── EditDepartmentModal.tsx
│   ├── AssignTeacherModal.tsx
│   ├── AssignSubjectModal.tsx
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
  departmentHeadId?: number;
  departmentHead?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  teachers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    specialization?: string;
  }>;
  subjects: Array<{
    id: number;
    name: string;
    code: string;
    description?: string;
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
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
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

## Core Features to Implement

### 1. Department Management Interface

**New Redux Slice to Create:**
```typescript
// src/features/departments/departmentsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearCurrentDepartment: (state) => {
      state.currentDepartment = null;
    },
    clearDepartmentsError: (state) => {
      state.error = null;
    },
    setDepartmentFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateDepartmentStatus: (state, action) => {
      const department = state.departments.find(d => d.id === action.payload.id);
      if (department) {
        department.active = action.payload.active;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `DepartmentListPage.tsx` - View and manage all departments
- `DepartmentDetailsPage.tsx` - View department details and management
- `CreateDepartmentPage.tsx` - Create and edit departments
- `DepartmentManagementPage.tsx` - Advanced department administration

### 2. Department Administration
Comprehensive department management:
- Department creation and setup
- Department profile management
- Teacher assignment and management
- Subject allocation
- Department head assignment

### 3. Academic Organization
Department-based academic structure:
- Subject-department relationships
- Teacher-department assignments
- Department hierarchy
- Resource allocation
- Performance tracking

### 4. Department Analytics
Department performance monitoring:
- Teacher statistics
- Subject coverage
- Student enrollment
- Performance metrics
- Resource utilization

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
  'SCHOOL_ADMIN'
].includes(userRole);

const canViewDepartments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER',
  'STUDENT',
  'PARENT'
].includes(userRole);

const canEditDepartment = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canAssignTeachers = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canAssignSubjects = [
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
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleDepartmentCreation = async (departmentData: CreateDepartmentData) => {
  try {
    await dispatch(createDepartment(departmentData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create department:', error);
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
  data={departments}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Department Card Component
```typescript
// src/features/departments/components/DepartmentCard.tsx
// Display department information in card format
// Follow existing component patterns
```

### 2. Department Form Component
```typescript
// src/features/departments/components/DepartmentForm.tsx
// Form for creating and editing departments
// Follow existing form patterns
```

### 3. Department Teachers Component
```typescript
// src/features/departments/components/DepartmentTeachers.tsx
// Manage teachers assigned to department
// Follow existing component patterns
```

### 4. Department Subjects Component
```typescript
// src/features/departments/components/DepartmentSubjects.tsx
// Manage subjects assigned to department
// Follow existing component patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/routes/roleSidebar.ts` to include department routes:
```typescript
// Add to existing navigation items for appropriate roles
{
  icon: Building,
  label: 'Departments',
  path: '/app/departments',
  description: 'Manage school departments'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/departments" element={<DepartmentListPage />} />
<Route path="/departments/:id" element={<DepartmentDetailsPage />} />
<Route path="/departments/create" element={<CreateDepartmentPage />} />
<Route path="/departments/:id/edit" element={<EditDepartmentPage />} />
<Route path="/departments/management" element={<DepartmentManagementPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (params: DepartmentFetchParams, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData: CreateDepartmentData, { rejectWithValue }) => {
    try {
      const response = await departmentApi.create(departmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

export const assignTeacherToDepartment = createAsyncThunk(
  'departments/assignTeacherToDepartment',
  async (assignmentData: AssignTeacherData, { rejectWithValue }) => {
    try {
      const response = await departmentApi.assignTeacher(
        assignmentData.departmentId,
        assignmentData.teacherId
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign teacher');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [schoolFilter, setSchoolFilter] = useState('');
const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Department Updates
- Real-time department status changes
- Live teacher assignments
- Instant subject allocations
- Department head assignments

### 2. Department Analytics
- Real-time statistics
- Teacher performance metrics
- Subject coverage analysis
- Resource utilization tracking

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Department Security Features
```typescript
// Implement department access control
const canViewDepartment = (department: Department, user: User) => {
  // Super admins and school admins can view all departments
  if (['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user.role)) {
    return true;
  }
  
  // Department heads can view their own department
  if (user.role === 'DEPARTMENT_HEAD' && department.departmentHeadId === user.id) {
    return true;
  }
  
  // Teachers can view departments they belong to
  if (['SENIOR_TEACHER', 'TEACHER'].includes(user.role)) {
    return department.teachers.some(teacher => teacher.id === user.id);
  }
  
  return false;
};

// Implement department management access control
const canManageDepartment = (department: Department, user: User) => {
  // Super admins and school admins can manage all departments
  if (['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user.role)) {
    return true;
  }
  
  // Department heads can manage their own department
  if (user.role === 'DEPARTMENT_HEAD' && department.departmentHeadId === user.id) {
    return true;
  }
  
  return false;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Department-Specific Optimizations
- Efficient department listing
- Smart teacher/subject loading
- Optimized department hierarchy
- Department statistics caching

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Department-Specific Testing
- Test department creation workflow
- Test teacher assignment functionality
- Test subject allocation
- Test access control mechanisms

## Deliverables

1. **New Redux Slice**: `departmentsSlice.ts`
2. **New API Service**: `departmentApi.ts`
3. **New Pages**: Department management pages
4. **New Components**: Department-specific reusable components
5. **Enhanced Existing Pages**: Integration with school management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Department-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Department management functioning properly
- Teacher assignment working correctly
- Subject allocation functioning as expected
- Real-time updates working reliably
- Responsive design consistent with existing pages
- Department security measures properly implemented

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
12. **DO** ensure accurate department management
13. **DO** implement comprehensive teacher/subject tracking
14. **DO** optimize for school-based filtering

This implementation should seamlessly integrate with the existing codebase while providing comprehensive department management capabilities for all user roles in the educational system. 