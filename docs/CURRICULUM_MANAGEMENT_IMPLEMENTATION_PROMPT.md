# Frontend Implementation Prompt: Curriculum Management System

## Overview
Implement a comprehensive frontend interface for the curriculum management system targeting educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **SCHOOL_ADMIN**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    curriculum: curriculumReducer,  // TO BE CREATED
    curriculumStandards: curriculumStandardsReducer,  // TO BE CREATED
    learningObjectives: learningObjectivesReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/curriculum/
├── pages/
│   ├── CurriculumListPage.tsx
│   ├── CurriculumDetailsPage.tsx
│   ├── CurriculumBuilderPage.tsx
│   ├── StandardsManagementPage.tsx
│   └── LearningObjectivesPage.tsx
├── components/
│   ├── CurriculumCard.tsx
│   ├── CurriculumBuilder.tsx
│   ├── StandardsTree.tsx
│   ├── ObjectiveEditor.tsx
│   ├── CurriculumMapping.tsx
│   └── ProgressTracker.tsx
├── modals/
│   ├── CreateCurriculumModal.tsx
│   ├── EditCurriculumModal.tsx
│   ├── AddStandardModal.tsx
│   ├── EditObjectiveModal.tsx
│   └── CurriculumImportModal.tsx
├── curriculumSlice.ts
├── curriculumStandardsSlice.ts
├── learningObjectivesSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/curriculumApi.ts
// src/api/services/curriculumStandardApi.ts
// src/api/services/learningObjectiveApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface CurriculumResponse {
  status: string;
  message: string;
  data: Curriculum | Curriculum[] | null;
  timestamp: string | null;
}

export interface Curriculum {
  id: number;
  name: string;
  description: string;
  version: string;
  subjectId: number;
  gradeLevel: string;
  academicYear: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedById?: number;
  approvedAt?: string;
  publishedAt?: string;
  effectiveDate: string;
  expiryDate?: string;
  createdById: number;
  schoolId?: number;
  regionId?: number;
  isNational: boolean;
  isTemplate: boolean;
  parentCurriculumId?: number;
  tags?: string;
  metadata?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumStandard {
  id: number;
  code: string;
  title: string;
  description: string;
  curriculumId: number;
  parentStandardId?: number;
  level: number;
  orderIndex: number;
  category: 'KNOWLEDGE' | 'SKILLS' | 'UNDERSTANDING' | 'APPLICATION' | 'ANALYSIS' | 'SYNTHESIS' | 'EVALUATION';
  bloomsTaxonomyLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedHours: number;
  prerequisites?: string;
  assessmentCriteria?: string;
  resources?: string;
  isCore: boolean;
  isOptional: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningObjective {
  id: number;
  code: string;
  title: string;
  description: string;
  standardId: number;
  objectiveType: 'COGNITIVE' | 'AFFECTIVE' | 'PSYCHOMOTOR';
  bloomsTaxonomyLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedTime: number;
  assessmentMethod: 'FORMATIVE' | 'SUMMATIVE' | 'DIAGNOSTIC' | 'PEER' | 'SELF';
  successCriteria: string;
  resources?: string;
  prerequisites?: string;
  orderIndex: number;
  isCore: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const curriculumApi = {
  getAll: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/api/curriculum');
  },
  getById: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/${id}`);
  },
  getBySubject: async (subjectId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/subject/${subjectId}`);
  },
  getByGradeLevel: async (gradeLevel: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/grade/${gradeLevel}`);
  },
  getByAcademicYear: async (academicYear: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/year/${academicYear}`);
  },
  getByStatus: async (status: string): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/status/${status}`);
  },
  getBySchool: async (schoolId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/school/${schoolId}`);
  },
  getByRegion: async (regionId: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get(`/api/curriculum/region/${regionId}`);
  },
  getNational: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/api/curriculum/national');
  },
  getTemplates: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/api/curriculum/templates');
  },
  getPublished: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/api/curriculum/published');
  },
  getApproved: async (): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.get('/api/curriculum/approved');
  },
  create: async (curriculumData: CreateCurriculumRequest): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post('/api/curriculum', curriculumData);
  },
  update: async (id: number, curriculumData: UpdateCurriculumRequest): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/api/curriculum/${id}`, curriculumData);
  },
  delete: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.delete(`/api/curriculum/${id}`);
  },
  approve: async (id: number, approvalData: ApproveCurriculumRequest): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/api/curriculum/${id}/approve`, approvalData);
  },
  publish: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/api/curriculum/${id}/publish`);
  },
  archive: async (id: number): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.put(`/api/curriculum/${id}/archive`);
  },
  clone: async (id: number, cloneData: CloneCurriculumRequest): Promise<AxiosResponse<CurriculumResponse>> => {
    return api.post(`/api/curriculum/${id}/clone`, cloneData);
  },
  export: async (id: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/api/curriculum/${id}/export`, {
      responseType: 'blob',
    });
  },
  import: async (file: File): Promise<AxiosResponse<CurriculumResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/curriculum/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default curriculumApi;
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
const CurriculumListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchCurricula());
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateCurriculum = () => {
    dispatch(openModal({
      title: 'Create New Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-600 mt-2">Design and manage educational curricula and learning standards</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Curriculum Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/curriculum/curriculumSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState,
  reducers: {
    clearCurrentCurriculum: (state) => {
      state.currentCurriculum = null;
    },
    clearCurriculumError: (state) => {
      state.error = null;
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    setSelectedGradeLevel: (state, action) => {
      state.selectedGradeLevel = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/curriculumApi.ts
// src/api/services/curriculumStandardApi.ts
// src/api/services/learningObjectiveApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `CurriculumListPage.tsx` - List all curricula with filtering and search
- `CurriculumDetailsPage.tsx` - View curriculum details and structure
- `CurriculumBuilderPage.tsx` - Create and edit curricula with drag-drop
- `StandardsManagementPage.tsx` - Manage curriculum standards hierarchy
- `LearningObjectivesPage.tsx` - Define and manage learning objectives

### 2. Curriculum Builder System
Visual curriculum design interface:
- Drag-and-drop curriculum builder
- Hierarchical standards organization
- Learning objective mapping
- Prerequisite relationship management
- Timeline and pacing guides

### 3. Standards and Objectives Management
Comprehensive learning standards framework:
- Bloom's taxonomy integration
- Difficulty level classification
- Assessment criteria definition
- Resource linking
- Progress tracking alignment

### 4. Curriculum Approval Workflow
Administrative approval process:
- Multi-level approval workflow
- Version control and history
- Collaborative review process
- Publishing and distribution
- Archive management

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateCurriculum = [
  'MINISTRY_STAFF',
  'MINISTRY_EXECUTIVE',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN',
  'SUPER_ADMIN'
].includes(userRole);

const canApproveCurriculum = [
  'MINISTRY_EXECUTIVE',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SUPER_ADMIN'
].includes(userRole);

const canViewCurriculum = [
  'STUDENT',
  'PARENT',
  'TEACHER',
  'SCHOOL_ADMIN',
  'REGIONAL_ADMIN',
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
  CURRICULUM_ADD_NEW: "CURRICULUM_ADD_NEW",
  CURRICULUM_EDIT: "CURRICULUM_EDIT",
  CURRICULUM_CLONE: "CURRICULUM_CLONE",
  CURRICULUM_IMPORT: "CURRICULUM_IMPORT",
  STANDARD_ADD_NEW: "STANDARD_ADD_NEW",
  STANDARD_EDIT: "STANDARD_EDIT",
  OBJECTIVE_ADD_NEW: "OBJECTIVE_ADD_NEW",
  OBJECTIVE_EDIT: "OBJECTIVE_EDIT",
  CURRICULUM_APPROVAL: "CURRICULUM_APPROVAL",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleCurriculumCreation = async (curriculumData: CreateCurriculumData) => {
  try {
    await dispatch(createCurriculum(curriculumData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create curriculum:', error);
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
  data={curricula}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Curriculum Card Component
```typescript
// src/features/curriculum/components/CurriculumCard.tsx
// Use existing card styling patterns
// Follow existing component structure
```

### 2. Curriculum Builder Component
```typescript
// src/features/curriculum/components/CurriculumBuilder.tsx
// Drag-and-drop interface for curriculum design
// Follow existing component patterns
```

### 3. Standards Tree Component
```typescript
// src/features/curriculum/components/StandardsTree.tsx
// Hierarchical tree view of curriculum standards
// Follow existing component structure
```

### 4. Objective Editor Component
```typescript
// src/features/curriculum/components/ObjectiveEditor.tsx
// Rich editor for learning objectives
// Follow existing form patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include curriculum routes:
```typescript
// Add to existing navigation items
{
  label: 'Curriculum',
  icon: BookOpen,
  submenu: [
    { label: 'All Curricula', path: '/app/curriculum' },
    { label: 'Curriculum Builder', path: '/app/curriculum/builder' },
    { label: 'Standards', path: '/app/curriculum/standards' },
    { label: 'Learning Objectives', path: '/app/curriculum/objectives' },
    { label: 'Templates', path: '/app/curriculum/templates' }
  ]
}

// Add approval workflow for eligible roles
{
  label: 'Curriculum Approval',
  icon: CheckCircle,
  submenu: [
    { label: 'Pending Approval', path: '/app/curriculum/approval/pending' },
    { label: 'Review Queue', path: '/app/curriculum/approval/review' },
    { label: 'Approved', path: '/app/curriculum/approval/approved' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/curriculum" element={<CurriculumListPage />} />
<Route path="/curriculum/:id" element={<CurriculumDetailsPage />} />
<Route path="/curriculum/builder" element={<CurriculumBuilderPage />} />
<Route path="/curriculum/:id/edit" element={<CurriculumBuilderPage />} />
<Route path="/curriculum/standards" element={<StandardsManagementPage />} />
<Route path="/curriculum/objectives" element={<LearningObjectivesPage />} />
<Route path="/curriculum/templates" element={<CurriculumTemplatesPage />} />
<Route path="/curriculum/approval/pending" element={<CurriculumApprovalPage />} />
<Route path="/curriculum/approval/review" element={<CurriculumReviewPage />} />
<Route path="/curriculum/approval/approved" element={<ApprovedCurriculaPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchCurricula = createAsyncThunk(
  'curriculum/fetchCurricula',
  async (params: CurriculumFetchParams, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula');
    }
  }
);

export const createCurriculum = createAsyncThunk(
  'curriculum/createCurriculum',
  async (curriculumData: CreateCurriculumData, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.create(curriculumData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create curriculum');
    }
  }
);

export const approveCurriculum = createAsyncThunk(
  'curriculum/approveCurriculum',
  async (approvalData: ApproveCurriculumData, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.approve(approvalData.id, approvalData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve curriculum');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
const [statusFilter, setStatusFilter] = useState('ALL');
const [searchTerm, setSearchTerm] = useState('');
const [builderMode, setBuilderMode] = useState<'view' | 'edit'>('view');
```

## Advanced Features

### 1. Curriculum Mapping and Alignment
- Cross-curriculum alignment tools
- Standards mapping visualization
- Gap analysis reporting
- Progression tracking

### 2. Collaborative Development
- Multi-user curriculum editing
- Comment and review system
- Version comparison tools
- Change tracking and history

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Curriculum Security Features
```typescript
// Implement curriculum access control
const canEditCurriculum = (curriculum: Curriculum, user: User) => {
  // Check ownership and permissions
  if (curriculum.createdById === user.id) return true;
  
  // Check role-based permissions
  const editorRoles = ['MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'];
  if (!editorRoles.includes(user.role)) return false;
  
  // Check scope permissions
  if (curriculum.isNational && !['MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role)) return false;
  if (curriculum.regionId && user.regionId !== curriculum.regionId) return false;
  if (curriculum.schoolId && user.schoolId !== curriculum.schoolId) return false;
  
  return true;
};

// Implement approval workflow validation
const canApproveCurriculumAtLevel = (curriculum: Curriculum, user: User) => {
  const approverRoles = ['MINISTRY_EXECUTIVE', 'DIRECTOR', 'REGIONAL_ADMIN', 'SUPER_ADMIN'];
  return approverRoles.includes(user.role);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Curriculum-Specific Optimizations
- Lazy load curriculum standards tree
- Cache frequently accessed curricula
- Optimize drag-and-drop performance
- Implement efficient search and filtering

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Curriculum-Specific Testing
- Test curriculum builder functionality
- Test approval workflow
- Test import/export features
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `curriculumSlice.ts`, `curriculumStandardsSlice.ts`, `learningObjectivesSlice.ts`
2. **New API Services**: `curriculumApi.ts`, `curriculumStandardApi.ts`, `learningObjectiveApi.ts`
3. **New Pages**: Curriculum management, builder, standards, and approval pages
4. **New Components**: Curriculum-specific reusable components
5. **Enhanced Existing Pages**: Integration with subject and course pages
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Curriculum-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Curriculum builder functioning properly
- Approval workflow working as expected
- Import/export functionality working correctly
- Standards hierarchy displaying properly
- Responsive design consistent with existing pages
- Curriculum security measures properly implemented

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
11. **DO** implement proper curriculum validation
12. **DO** ensure data integrity in hierarchical structures
13. **DO** implement comprehensive approval workflows
14. **DO** optimize for complex curriculum structures

This implementation should seamlessly integrate with the existing codebase while providing comprehensive curriculum management capabilities for all user roles in the educational system.