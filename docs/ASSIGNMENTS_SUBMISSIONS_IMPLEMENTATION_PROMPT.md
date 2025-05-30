# Frontend Implementation Prompt: Assignments & Submissions System

## Overview
Implement a comprehensive frontend interface for the assignments and submissions system targeting educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    assignments: assignmentsReducer,  // TO BE CREATED
    submissions: submissionsReducer,  // TO BE CREATED
    assessments: assessmentsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/assignments/
├── pages/
│   ├── AssignmentListPage.tsx
│   ├── AssignmentDetailsPage.tsx
│   ├── CreateAssignmentPage.tsx
│   ├── SubmissionListPage.tsx
│   ├── SubmissionDetailsPage.tsx
│   └── AssignmentAnalyticsPage.tsx
├── components/
│   ├── AssignmentCard.tsx
│   ├── AssignmentForm.tsx
│   ├── SubmissionCard.tsx
│   ├── SubmissionForm.tsx
│   ├── AssignmentFilters.tsx
│   └── SubmissionStatus.tsx
├── modals/
│   ├── CreateAssignmentModal.tsx
│   ├── EditAssignmentModal.tsx
│   ├── SubmitAssignmentModal.tsx
│   ├── GradeSubmissionModal.tsx
│   └── AssessmentModal.tsx
├── assignmentsSlice.ts
├── submissionsSlice.ts
├── assessmentsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/assignmentApi.ts
// src/api/services/submissionApi.ts
// src/api/services/assessmentApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface AssignmentResponse {
  status: string;
  message: string;
  data: Assignment | Assignment[] | null;
  timestamp: string | null;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions?: string;
  code: string;
  courseId: number;
  teacherId: number;
  instructorId: number;
  dueDate: string;
  startDate?: string;
  maxScore: number;
  weight: number;
  allowLateSubmissions: boolean;
  latePenalty?: number;
  maxAttempts?: number;
  isGroupAssignment: boolean;
  maxGroupSize?: number;
  submissionType: 'FILE' | 'TEXT' | 'LINK' | 'MIXED';
  allowedFileTypes?: string;
  maxFileSize?: number;
  rubricId?: number;
  gradingType: 'POINTS' | 'PERCENTAGE' | 'LETTER' | 'PASS_FAIL';
  autoGrade: boolean;
  publishGrades: boolean;
  showRubric: boolean;
  plagiarismCheck: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  visibility: 'VISIBLE' | 'HIDDEN' | 'SCHEDULED';
  estimatedDuration?: number;
  tags?: string;
  attachments?: string;
  submissionCount: number;
  gradedCount: number;
  averageScore?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  content?: string;
  attachments?: string;
  submittedAt: string;
  isLate: boolean;
  attemptNumber: number;
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'RETURNED' | 'RESUBMITTED';
  score?: number;
  maxScore: number;
  percentage?: number;
  letterGrade?: string;
  feedback?: string;
  gradedById?: number;
  gradedAt?: string;
  rubricScores?: string;
  plagiarismScore?: number;
  plagiarismReport?: string;
  timeSpent?: number;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: number;
  submissionId: number;
  assessorId: number;
  assessmentType: 'SELF' | 'PEER' | 'INSTRUCTOR';
  score?: number;
  maxScore: number;
  feedback?: string;
  rubricScores?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedAt: string;
  completedAt?: string;
  gradingStrategy: 'AVERAGE' | 'MEDIAN' | 'HIGHEST' | 'LOWEST' | 'INSTRUCTOR_ONLY';
  weight: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const assignmentApi = {
  getAll: async (): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get('/assignments');
  },
  getById: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/${id}`);
  },
  getByCode: async (code: string): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/code/${code}`);
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/course/${courseId}`);
  },
  getActive: async (): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get('/assignments/active');
  },
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/course/${courseId}/active`);
  },
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/teacher/${teacherId}`);
  },
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/teacher/${teacherId}/active`);
  },
  getByInstructor: async (instructorId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/instructor/${instructorId}`);
  },
  getActiveByInstructor: async (instructorId: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.get(`/assignments/instructor/${instructorId}/active`);
  },
  create: async (assignmentData: CreateAssignmentRequest): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.post('/assignments', assignmentData);
  },
  update: async (id: number, assignmentData: UpdateAssignmentRequest): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}`, assignmentData);
  },
  delete: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.delete(`/assignments/${id}`);
  },
  publish: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}/publish`);
  },
  close: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}/close`);
  },
  archive: async (id: number): Promise<AxiosResponse<AssignmentResponse>> => {
    return api.put(`/assignments/${id}/archive`);
  },
};

const submissionApi = {
  getAll: async (): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get('/submissions');
  },
  getById: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/${id}`);
  },
  getByAssignmentAndStudent: async (assignmentId: number, studentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/assignment/${assignmentId}/student/${studentId}`);
  },
  getByAssignment: async (assignmentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/assignment/${assignmentId}`);
  },
  getByStudent: async (studentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/student/${studentId}`);
  },
  getGradedByAssignment: async (assignmentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/assignment/${assignmentId}/graded`);
  },
  getGradedByStudent: async (studentId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/student/${studentId}/graded`);
  },
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}`);
  },
  getPendingByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}/pending`);
  },
  getLateByTeacher: async (teacherId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/teacher/${teacherId}/late`);
  },
  getPendingByCourse: async (courseId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/course/${courseId}/pending`);
  },
  getLateByCourse: async (courseId: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.get(`/submissions/course/${courseId}/late`);
  },
  create: async (submissionData: CreateSubmissionRequest): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.post('/submissions', submissionData);
  },
  update: async (id: number, submissionData: UpdateSubmissionRequest): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.put(`/submissions/${id}`, submissionData);
  },
  submit: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.put(`/submissions/${id}/submit`);
  },
  grade: async (id: number, score: number, feedback?: string): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.post(`/submissions/${id}/grade`, { score, feedback });
  },
  delete: async (id: number): Promise<AxiosResponse<SubmissionResponse>> => {
    return api.delete(`/submissions/${id}`);
  },
};

const assessmentApi = {
  getAll: async (): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get('/assessments');
  },
  getById: async (id: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/${id}`);
  },
  getBySubmission: async (submissionId: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/submission/${submissionId}`);
  },
  getByAssessor: async (assessorId: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/assessor/${assessorId}`);
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/course/${courseId}`);
  },
  getBySubmissionAndStatus: async (submissionId: number, status: string): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.get(`/assessments/submission/${submissionId}/status/${status}`);
  },
  create: async (assessmentData: CreateAssessmentRequest): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.post('/assessments', assessmentData);
  },
  update: async (id: number, assessmentData: UpdateAssessmentRequest): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.put(`/assessments/${id}`, assessmentData);
  },
  submit: async (id: number, score: number, feedback: string, rubricScores?: string): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.post(`/assessments/${id}/submit`, { score, feedback, rubricScores });
  },
  updateStatus: async (id: number, status: string): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.put(`/assessments/${id}/status`, { status });
  },
  assignPeerAssessments: async (submissionId: number, assessorIds: number[], gradingStrategy: string): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.post(`/assessments/submission/${submissionId}/assign`, { assessorIds, gradingStrategy });
  },
  delete: async (id: number): Promise<AxiosResponse<AssessmentResponse>> => {
    return api.delete(`/assessments/${id}`);
  },
};

export default { assignmentApi, submissionApi, assessmentApi };
```

## Core Features to Implement

### 1. Assignment Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/assignments/assignmentsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
    clearAssignmentsError: (state) => {
      state.error = null;
    },
    setAssignmentFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateAssignmentStatus: (state, action) => {
      const assignment = state.assignments.find(a => a.id === action.payload.id);
      if (assignment) {
        assignment.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `AssignmentListPage.tsx` - View and manage all assignments
- `AssignmentDetailsPage.tsx` - View assignment details and submissions
- `CreateAssignmentPage.tsx` - Create and edit assignments
- `SubmissionListPage.tsx` - View and manage submissions
- `SubmissionDetailsPage.tsx` - View submission details and grade
- `AssignmentAnalyticsPage.tsx` - Assignment performance analytics

### 2. Assignment Creation and Management
Comprehensive assignment lifecycle:
- Rich assignment editor
- Due date and scheduling
- Rubric integration
- File upload settings
- Plagiarism detection
- Group assignment support

### 3. Submission Management
Student submission workflow:
- File upload interface
- Text submission editor
- Draft saving
- Submission history
- Late submission handling
- Resubmission support

### 4. Grading and Assessment
Advanced grading capabilities:
- Rubric-based grading
- Peer assessment
- Self-assessment
- Bulk grading
- Feedback management
- Grade analytics

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateAssignments = [
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

const canSubmitAssignments = [
  'STUDENT'
].includes(userRole);

const canGradeAssignments = [
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

const canViewAssignments = [
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
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  ASSIGNMENT_ADD_NEW: "ASSIGNMENT_ADD_NEW",
  ASSIGNMENT_EDIT: "ASSIGNMENT_EDIT",
  ASSIGNMENT_DETAILS: "ASSIGNMENT_DETAILS",
  SUBMISSION_SUBMIT: "SUBMISSION_SUBMIT",
  SUBMISSION_GRADE: "SUBMISSION_GRADE",
  ASSESSMENT_PEER: "ASSESSMENT_PEER",
  ASSIGNMENT_RUBRIC: "ASSIGNMENT_RUBRIC",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleAssignmentCreation = async (assignmentData: CreateAssignmentData) => {
  try {
    await dispatch(createAssignment(assignmentData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create assignment:', error);
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
  data={assignments}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Assignment Card Component
```typescript
// src/features/assignments/components/AssignmentCard.tsx
// Display assignment information in card format
// Follow existing component patterns
```

### 2. Assignment Form Component
```typescript
// src/features/assignments/components/AssignmentForm.tsx
// Rich form for creating and editing assignments
// Follow existing form patterns
```

### 3. Submission Form Component
```typescript
// src/features/assignments/components/SubmissionForm.tsx
// File upload and text submission interface
// Follow existing form patterns
```

### 4. Grading Interface Component
```typescript
// src/features/assignments/components/GradingInterface.tsx
// Rubric-based grading interface
// Follow existing component patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include assignment routes:
```typescript
// Add to existing navigation items
{
  label: 'Assignments',
  icon: FileText,
  submenu: [
    { label: 'All Assignments', path: '/app/assignments' },
    { label: 'Create Assignment', path: '/app/assignments/create' },
    { label: 'Submissions', path: '/app/assignments/submissions' },
    { label: 'Grading', path: '/app/assignments/grading' },
    { label: 'Analytics', path: '/app/assignments/analytics' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/assignments" element={<AssignmentListPage />} />
<Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
<Route path="/assignments/create" element={<CreateAssignmentPage />} />
<Route path="/assignments/:id/edit" element={<EditAssignmentPage />} />
<Route path="/assignments/submissions" element={<SubmissionListPage />} />
<Route path="/assignments/submissions/:id" element={<SubmissionDetailsPage />} />
<Route path="/assignments/grading" element={<GradingPage />} />
<Route path="/assignments/analytics" element={<AssignmentAnalyticsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (params: AssignmentFetchParams, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async (assignmentData: CreateAssignmentData, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.create(assignmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'submissions/submitAssignment',
  async (submissionData: SubmitAssignmentData, { rejectWithValue }) => {
    try {
      const response = await submissionApi.create(submissionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit assignment');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [assignmentTypeFilter, setAssignmentTypeFilter] = useState('ALL');
const [statusFilter, setStatusFilter] = useState('');
const [courseFilter, setCourseFilter] = useState('');
const [showOverdue, setShowOverdue] = useState(false);
const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Assignment Updates
- Real-time assignment notifications
- Live submission tracking
- Instant grade updates
- Assignment status changes

### 2. Collaborative Features
- Peer assessment workflow
- Real-time collaboration
- Group assignment coordination
- Live feedback delivery

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Assignment Security Features
```typescript
// Implement assignment access control
const canViewAssignment = (assignment: Assignment, user: User) => {
  // Students can view assignments for their courses
  if (user.role === 'STUDENT') {
    return user.courseIds?.includes(assignment.courseId);
  }
  
  // Teachers can view assignments they created or for their courses
  if (['TEACHER', 'SENIOR_TEACHER'].includes(user.role)) {
    return assignment.teacherId === user.id || user.courseIds?.includes(assignment.courseId);
  }
  
  // Admins can view assignments in their scope
  const adminRoles = ['SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  return adminRoles.includes(user.role);
};

// Implement submission access control
const canViewSubmission = (submission: Submission, user: User) => {
  // Students can only view their own submissions
  if (user.role === 'STUDENT') {
    return submission.studentId === user.id;
  }
  
  // Teachers can view submissions for their assignments
  if (['TEACHER', 'SENIOR_TEACHER'].includes(user.role)) {
    // Check if assignment belongs to teacher
    return true; // Implement assignment ownership check
  }
  
  return ['SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Assignment-Specific Optimizations
- Efficient file upload handling
- Smart assignment loading
- Optimized submission tracking
- Assignment caching strategies

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Assignment-Specific Testing
- Test assignment creation workflow
- Test submission process
- Test grading functionality
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `assignmentsSlice.ts`, `submissionsSlice.ts`, `assessmentsSlice.ts`
2. **New API Services**: `assignmentApi.ts`, `submissionApi.ts`, `assessmentApi.ts`
3. **New Pages**: Assignment management, submission, and grading pages
4. **New Components**: Assignment-specific reusable components
5. **Enhanced Existing Pages**: Integration with course management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Assignment-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Assignment creation and management functioning properly
- Submission workflow working correctly
- Grading interface functioning as expected
- File upload and handling working reliably
- Responsive design consistent with existing pages
- Assignment security measures properly implemented

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
11. **DO** implement proper file upload validation
12. **DO** ensure secure submission handling
13. **DO** implement comprehensive assignment tracking
14. **DO** optimize for large file uploads

This implementation should seamlessly integrate with the existing codebase while providing comprehensive assignment and submission management capabilities for all user roles in the educational system. 