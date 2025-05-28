# Frontend Implementation Prompt: Grading System

## Overview
Implement a comprehensive frontend interface for the grading system targeting educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    grades: gradesReducer,  // TO BE CREATED
    gradeCategories: gradeCategoriesReducer,  // TO BE CREATED
    gradeStatistics: gradeStatisticsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/grading/
├── pages/
│   ├── GradeListPage.tsx
│   ├── StudentGradesPage.tsx
│   ├── CourseGradesPage.tsx
│   ├── GradeEntryPage.tsx
│   └── GradeAnalyticsPage.tsx
├── components/
│   ├── GradeTable.tsx
│   ├── GradeForm.tsx
│   ├── GradeCard.tsx
│   ├── GradeChart.tsx
│   ├── GradebookView.tsx
│   └── GradeFilters.tsx
├── modals/
│   ├── CreateGradeModal.tsx
│   ├── EditGradeModal.tsx
│   ├── BulkGradeModal.tsx
│   ├── GradeModerationModal.tsx
│   └── GradeDetailsModal.tsx
├── gradesSlice.ts
├── gradeCategoriesSlice.ts
├── gradeStatisticsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/gradeApi.ts
// src/api/services/gradeCategoryApi.ts
// src/api/services/gradeStatisticsApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface GradeResponse {
  status: string;
  message: string;
  data: Grade | Grade[] | null;
  timestamp: string | null;
}

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  assessmentId?: number;
  assignmentId?: number;
  gradeCategoryId?: number;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade?: string;
  gradeType: 'ASSIGNMENT' | 'ASSESSMENT' | 'QUIZ' | 'EXAM' | 'PROJECT' | 'PARTICIPATION' | 'HOMEWORK' | 'LAB' | 'FINAL' | 'MIDTERM';
  term: 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM' | 'FOURTH_TERM' | 'ANNUAL';
  academicYear: number;
  gradedById: number;
  gradedAt: string;
  feedback?: string;
  isModerated: boolean;
  moderatedById?: number;
  moderatedAt?: string;
  moderationNotes?: string;
  originalScore?: number;
  weight: number;
  isExtraCredit: boolean;
  isDropped: boolean;
  droppedReason?: string;
  rubricScores?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GradeCategory {
  id: number;
  name: string;
  description?: string;
  weight: number;
  courseId: number;
  dropLowest?: number;
  isExtraCredit: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GradeStatistics {
  courseId: number;
  studentId?: number;
  averageScore: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  standardDeviation: number;
  gradeDistribution: Array<{
    letterGrade: string;
    count: number;
    percentage: number;
  }>;
  categoryAverages: Array<{
    categoryId: number;
    categoryName: string;
    average: number;
  }>;
  trendData: Array<{
    date: string;
    average: number;
  }>;
}

const gradeApi = {
  getAll: async (): Promise<AxiosResponse<GradeResponse>> => {
    return api.get('/grades');
  },
  getById: async (id: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/${id}`);
  },
  getByStudent: async (studentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/student/${studentId}`);
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/course/${courseId}`);
  },
  getByStudentAndCourse: async (studentId: number, courseId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/student/${studentId}/course/${courseId}`);
  },
  getByType: async (gradeType: string): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/type/${gradeType}`);
  },
  getByTerm: async (term: string): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/term/${term}`);
  },
  getByAssessment: async (assessmentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/assessment/${assessmentId}`);
  },
  getByAssignment: async (assignmentId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/assignment/${assignmentId}`);
  },
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/teacher/${teacherId}`);
  },
  getByCategory: async (gradeCategoryId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/category/${gradeCategoryId}`);
  },
  getByStudentAndCategory: async (studentId: number, gradeCategoryId: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.get(`/grades/student/${studentId}/category/${gradeCategoryId}`);
  },
  getUnmoderated: async (): Promise<AxiosResponse<GradeResponse>> => {
    return api.get('/grades/unmoderated');
  },
  getModerated: async (): Promise<AxiosResponse<GradeResponse>> => {
    return api.get('/grades/moderated');
  },
  getAverageByStudentAndCourse: async (studentId: number, courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/grades/statistics/average/student/${studentId}/course/${courseId}`);
  },
  getAverageByCourse: async (courseId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/grades/statistics/average/course/${courseId}`);
  },
  getAverageByStudent: async (studentId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/grades/statistics/average/student/${studentId}`);
  },
  getAverageByCategory: async (gradeCategoryId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/grades/statistics/average/category/${gradeCategoryId}`);
  },
  create: async (gradeData: CreateGradeRequest): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades', gradeData);
  },
  createForAssessment: async (studentId: number, assessmentId: number, score: number, gradedById: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades/assessment', { studentId, assessmentId, score, gradedById });
  },
  createForAssignment: async (studentId: number, assignmentId: number, score: number, gradedById: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades/assignment', { studentId, assignmentId, score, gradedById });
  },
  createForCategory: async (studentId: number, gradeCategoryId: number, score: number, gradedById: number, feedback?: string): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades/category', { studentId, gradeCategoryId, score, gradedById, feedback });
  },
  createBulk: async (grades: CreateGradeRequest[]): Promise<AxiosResponse<GradeResponse>> => {
    return api.post('/grades/bulk', grades);
  },
  update: async (id: number, gradeData: UpdateGradeRequest): Promise<AxiosResponse<GradeResponse>> => {
    return api.put(`/grades/${id}`, gradeData);
  },
  moderate: async (gradeId: number, moderatorId: number, moderationNotes: string, newScore: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.post(`/grades/moderate/${gradeId}`, { moderatorId, moderationNotes, newScore });
  },
  delete: async (id: number): Promise<AxiosResponse<GradeResponse>> => {
    return api.delete(`/grades/${id}`);
  },
  deactivate: async (gradeId: number): Promise<AxiosResponse<void>> => {
    return api.put(`/grades/${gradeId}/deactivate`);
  },
  reactivate: async (gradeId: number): Promise<AxiosResponse<void>> => {
    return api.put(`/grades/${gradeId}/reactivate`);
  },
  checkExistsForAssessment: async (studentId: number, assessmentId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/grades/exists/student/${studentId}/assessment/${assessmentId}`);
  },
  checkExistsForAssignment: async (studentId: number, assignmentId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/grades/exists/student/${studentId}/assignment/${assignmentId}`);
  },
  checkExistsForCategory: async (studentId: number, gradeCategoryId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/grades/exists/student/${studentId}/category/${gradeCategoryId}`);
  },
};

export default gradeApi;
```

## Core Features to Implement

### 1. Grade Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/grading/gradesSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    clearCurrentGrade: (state) => {
      state.currentGrade = null;
    },
    clearGradesError: (state) => {
      state.error = null;
    },
    setGradeFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateGradeScore: (state, action) => {
      const grade = state.grades.find(g => g.id === action.payload.id);
      if (grade) {
        grade.score = action.payload.score;
        grade.percentage = (action.payload.score / grade.maxScore) * 100;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `GradeListPage.tsx` - View and manage all grades
- `StudentGradesPage.tsx` - View individual student's grades
- `CourseGradesPage.tsx` - Gradebook view for course
- `GradeEntryPage.tsx` - Enter and edit grades
- `GradeAnalyticsPage.tsx` - Grade statistics and analytics

### 2. Gradebook Interface
Comprehensive grade management:
- Interactive gradebook grid
- Bulk grade entry
- Grade calculations
- Grade moderation
- Grade history tracking

### 3. Grade Analytics
Advanced grading insights:
- Grade distribution charts
- Performance trends
- Comparative analytics
- Statistical analysis
- Progress tracking

### 4. Grade Categories
Grade organization system:
- Category management
- Weighted grading
- Drop lowest scores
- Extra credit handling
- Category-based analytics

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canEnterGrades = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canViewGrades = [
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

const canModerateGrades = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  GRADE_ADD_NEW: "GRADE_ADD_NEW",
  GRADE_EDIT: "GRADE_EDIT",
  GRADE_BULK_ENTRY: "GRADE_BULK_ENTRY",
  GRADE_MODERATION: "GRADE_MODERATION",
  GRADE_DETAILS: "GRADE_DETAILS",
  GRADE_CATEGORY_MANAGE: "GRADE_CATEGORY_MANAGE",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleGradeEntry = async (gradeData: CreateGradeData) => {
  try {
    await dispatch(createGrade(gradeData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to enter grade:', error);
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
  data={grades}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Gradebook View Component
```typescript
// src/features/grading/components/GradebookView.tsx
// Interactive gradebook with spreadsheet-like interface
// Follow existing component patterns
```

### 2. Grade Form Component
```typescript
// src/features/grading/components/GradeForm.tsx
// Form for entering and editing grades
// Follow existing form patterns
```

### 3. Grade Chart Component
```typescript
// src/features/grading/components/GradeChart.tsx
// Charts for grade analytics using existing Chart.js
// Follow existing chart patterns
```

### 4. Grade Card Component
```typescript
// src/features/grading/components/GradeCard.tsx
// Display individual grade information
// Follow existing component structure
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include grading routes:
```typescript
// Add to existing navigation items
{
  label: 'Grading',
  icon: GraduationCap,
  submenu: [
    { label: 'Gradebook', path: '/app/grades/gradebook' },
    { label: 'Grade Entry', path: '/app/grades/entry' },
    { label: 'Student Grades', path: '/app/grades/students' },
    { label: 'Analytics', path: '/app/grades/analytics' },
    { label: 'Categories', path: '/app/grades/categories' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/grades" element={<GradeListPage />} />
<Route path="/grades/:id" element={<GradeDetailsPage />} />
<Route path="/grades/gradebook" element={<GradebookPage />} />
<Route path="/grades/entry" element={<GradeEntryPage />} />
<Route path="/grades/students" element={<StudentGradesPage />} />
<Route path="/grades/students/:studentId" element={<StudentGradeDetailsPage />} />
<Route path="/grades/courses/:courseId" element={<CourseGradesPage />} />
<Route path="/grades/analytics" element={<GradeAnalyticsPage />} />
<Route path="/grades/categories" element={<GradeCategoriesPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchGrades = createAsyncThunk(
  'grades/fetchGrades',
  async (params: GradeFetchParams, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const createGrade = createAsyncThunk(
  'grades/createGrade',
  async (gradeData: CreateGradeData, { rejectWithValue }) => {
    try {
      const response = await gradeApi.create(gradeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grade');
    }
  }
);

export const moderateGrade = createAsyncThunk(
  'grades/moderateGrade',
  async (moderationData: ModerateGradeData, { rejectWithValue }) => {
    try {
      const response = await gradeApi.moderate(
        moderationData.gradeId,
        moderationData.moderatorId,
        moderationData.moderationNotes,
        moderationData.newScore
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to moderate grade');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [gradeTypeFilter, setGradeTypeFilter] = useState('ALL');
const [termFilter, setTermFilter] = useState('');
const [courseFilter, setCourseFilter] = useState('');
const [showUnmoderated, setShowUnmoderated] = useState(false);
const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Grade Updates
- Real-time grade entry
- Live gradebook updates
- Instant calculations
- Grade notifications

### 2. Collaborative Grading
- Multi-teacher grading
- Grade moderation workflow
- Real-time collaboration
- Grade approval process

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Grading Security Features
```typescript
// Implement grade access control
const canViewGrade = (grade: Grade, user: User) => {
  // Students can only view their own grades
  if (user.role === 'STUDENT') {
    return grade.studentId === user.id;
  }
  
  // Parents can view their children's grades
  if (user.role === 'PARENT') {
    // Implement parent-child relationship check
    return true; // Placeholder
  }
  
  // Teachers can view grades for their courses
  if (['TEACHER', 'SENIOR_TEACHER'].includes(user.role)) {
    return user.courseIds?.includes(grade.courseId);
  }
  
  // Admins can view all grades in their scope
  const adminRoles = ['SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  return adminRoles.includes(user.role);
};

// Implement grade modification permissions
const canModifyGrade = (grade: Grade, user: User) => {
  // Only teachers and admins can modify grades
  const modifierRoles = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  if (!modifierRoles.includes(user.role)) return false;
  
  // Teachers can only modify grades for their courses
  if (['TEACHER', 'SENIOR_TEACHER'].includes(user.role)) {
    return user.courseIds?.includes(grade.courseId);
  }
  
  return true;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Grading-Specific Optimizations
- Efficient gradebook rendering
- Smart grade calculations
- Optimized bulk operations
- Grade caching strategies

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Grading-Specific Testing
- Test grade calculations
- Test gradebook interactions
- Test grade moderation workflow
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `gradesSlice.ts`, `gradeCategoriesSlice.ts`, `gradeStatisticsSlice.ts`
2. **New API Services**: `gradeApi.ts`, `gradeCategoryApi.ts`, `gradeStatisticsApi.ts`
3. **New Pages**: Grade management, gradebook, and analytics pages
4. **New Components**: Grading-specific reusable components
5. **Enhanced Existing Pages**: Integration with course and student management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Grading-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Grade entry and management functioning properly
- Gradebook interface working correctly
- Grade calculations accurate and real-time
- Analytics and reporting functioning as expected
- Responsive design consistent with existing pages
- Grading security measures properly implemented

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
11. **DO** implement proper grade validation
12. **DO** ensure accurate grade calculations
13. **DO** implement comprehensive grade tracking
14. **DO** optimize for large gradebooks

This implementation should seamlessly integrate with the existing codebase while providing comprehensive grading capabilities for all user roles in the educational system. 