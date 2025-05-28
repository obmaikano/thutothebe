# Frontend Implementation Prompt: Quiz Management System

## Overview
Implement a comprehensive frontend interface for the quiz management system targeting educational roles: **TEACHER**, **SCHOOL_ADMIN**, **REGIONAL_ADMIN**, **MINISTRY_STAFF**, **SUPER_ADMIN** and **STUDENT** (for taking quizzes).

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
    quizzes: quizzesReducer,  // TO BE CREATED
    questions: questionsReducer,  // TO BE CREATED
    quizSubmissions: quizSubmissionsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/quizzes/
├── pages/
│   ├── QuizListPage.tsx
│   ├── QuizDetailsPage.tsx
│   ├── QuizCreationPage.tsx
│   ├── QuizTakingPage.tsx
│   └── QuizResultsPage.tsx
├── components/
│   ├── QuizCard.tsx
│   ├── QuestionEditor.tsx
│   ├── QuizTimer.tsx
│   ├── QuestionRenderer.tsx
│   └── QuizStatistics.tsx
├── modals/
│   ├── CreateQuizModal.tsx
│   ├── EditQuestionModal.tsx
│   ├── QuizSettingsModal.tsx
│   └── SubmitQuizModal.tsx
├── quizzesSlice.ts
├── questionsSlice.ts
├── quizSubmissionsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/quizApi.ts
// src/api/services/questionApi.ts
// src/api/services/quizSubmissionApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface QuizResponse {
  status: string;
  message: string;
  data: Quiz | Quiz[] | null;
  timestamp: string | null;
}

export interface Quiz {
  id: number;
  code: string;
  title: string;
  description: string;
  courseId: number;
  instructorId: number;
  startDate: string;
  endDate: string;
  timeLimit: number;
  totalPoints: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  active: boolean;
}

const quizApi = {
  getAll: async (): Promise<AxiosResponse<QuizResponse>> => {
    return api.get('/quizzes');
  },
  getById: async (id: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/${id}`);
  },
  getByCode: async (code: string): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/code/${code}`);
  },
  getByCourseId: async (courseId: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/course/${courseId}`);
  },
  getByInstructorId: async (instructorId: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/instructor/${instructorId}`);
  },
  getByStatus: async (status: string): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/status/${status}`);
  },
  getActiveByCourseId: async (courseId: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.get(`/quizzes/course/${courseId}/active`);
  },
  create: async (quizData: CreateQuizRequest): Promise<AxiosResponse<QuizResponse>> => {
    return api.post('/quizzes', quizData);
  },
  update: async (id: number, quizData: UpdateQuizRequest): Promise<AxiosResponse<QuizResponse>> => {
    return api.put(`/quizzes/${id}`, quizData);
  },
  delete: async (id: number): Promise<AxiosResponse<QuizResponse>> => {
    return api.delete(`/quizzes/${id}`);
  },
  existsByCode: async (code: string): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/quizzes/exists/${code}`);
  },
};

export default quizApi;
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
const QuizListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quizzes, status, error } = useAppSelector(state => state.quizzes);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchQuizzes());
    return () => {
      dispatch(clearQuizzesError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateQuiz = () => {
    dispatch(openModal({
      title: 'Create New Quiz',
      bodyType: MODAL_BODY_TYPES.QUIZ_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600 mt-2">Create and manage quizzes for your courses</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Quiz Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/quizzes/quizzesSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearQuizzesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/quizApi.ts
// src/api/services/questionApi.ts
// src/api/services/quizSubmissionApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `QuizListPage.tsx` - List all quizzes with filtering and search
- `QuizDetailsPage.tsx` - View quiz details and statistics
- `QuizCreationPage.tsx` - Create and edit quizzes
- `QuizTakingPage.tsx` - Student interface for taking quizzes
- `QuizResultsPage.tsx` - View quiz results and analytics

### 2. Question Management System
Extend quiz functionality with comprehensive question management:
- Multiple choice questions with options
- True/false questions
- Short answer questions
- Essay questions
- Question bank management
- Question reuse across quizzes

### 3. Quiz Taking Experience
Student-focused interface for quiz participation:
- Timer functionality
- Auto-save progress
- Question navigation
- Submit confirmation
- Results display

### 4. Analytics and Reporting
Quiz performance analytics:
- Student performance tracking
- Question difficulty analysis
- Quiz completion rates
- Grade distribution charts using existing Chart.js

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateQuizzes = [
  'TEACHER', 
  'SCHOOL_ADMIN', 
  'REGIONAL_ADMIN',
  'MINISTRY_STAFF',
  'SUPER_ADMIN'
].includes(userRole);

const canTakeQuizzes = userRole === 'STUDENT';
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  QUIZ_ADD_NEW: "QUIZ_ADD_NEW",
  QUIZ_EDIT: "QUIZ_EDIT",
  QUESTION_ADD_NEW: "QUESTION_ADD_NEW",
  QUESTION_EDIT: "QUESTION_EDIT",
  QUIZ_SETTINGS: "QUIZ_SETTINGS",
  SUBMIT_QUIZ_CONFIRMATION: "SUBMIT_QUIZ_CONFIRMATION",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleQuizSubmission = async () => {
  try {
    await dispatch(submitQuiz(submissionData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to submit quiz:', error);
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
  data={quizzes}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Quiz Card Component
```typescript
// src/features/quizzes/components/QuizCard.tsx
// Use existing card styling patterns
// Follow existing component structure
```

### 2. Question Editor Component
```typescript
// src/features/quizzes/components/QuestionEditor.tsx
// Use existing form patterns
// Follow existing validation patterns
```

### 3. Quiz Timer Component
```typescript
// src/features/quizzes/components/QuizTimer.tsx
// Real-time countdown functionality
// Follow existing component patterns
```

### 4. Question Renderer Component
```typescript
// src/features/quizzes/components/QuestionRenderer.tsx
// Dynamic question type rendering
// Follow existing component structure
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include quiz management routes:
```typescript
// Add to existing navigation items for teachers/admins
{
  label: 'Quiz Management',
  icon: FileQuestion,
  submenu: [
    { label: 'My Quizzes', path: '/app/quizzes' },
    { label: 'Create Quiz', path: '/app/quizzes/create' },
    { label: 'Question Bank', path: '/app/questions' },
    { label: 'Quiz Analytics', path: '/app/quizzes/analytics' }
  ]
}

// Add to existing navigation items for students
{
  label: 'Quizzes',
  icon: FileQuestion,
  path: '/app/student-quizzes'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/quizzes" element={<QuizListPage />} />
<Route path="/quizzes/:id" element={<QuizDetailsPage />} />
<Route path="/quizzes/create" element={<QuizCreationPage />} />
<Route path="/quizzes/:id/edit" element={<QuizCreationPage />} />
<Route path="/quizzes/:id/take" element={<QuizTakingPage />} />
<Route path="/quizzes/:id/results" element={<QuizResultsPage />} />
<Route path="/student-quizzes" element={<StudentQuizListPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quizzes/submitQuiz',
  async (submissionData: QuizSubmissionData, { rejectWithValue }) => {
    try {
      const response = await quizSubmissionApi.submit(submissionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [courseFilter, setCourseFilter] = useState('');
const [timeRemaining, setTimeRemaining] = useState(0);
const [currentQuestion, setCurrentQuestion] = useState(0);
```

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Quiz Security Features
```typescript
// Implement quiz access control
const canAccessQuiz = (quiz: Quiz, user: User) => {
  // Check if user is enrolled in course
  // Check if quiz is active
  // Check if user has already submitted
  return hasAccess;
};

// Implement submission validation
const validateSubmission = (submission: QuizSubmission) => {
  // Validate time limits
  // Validate question responses
  // Prevent duplicate submissions
  return isValid;
};
```

## Real-time Features

### 1. Quiz Timer Integration
- Real-time countdown display
- Auto-submit when time expires
- Warning notifications before time runs out

### 2. Auto-save Functionality
- Periodic saving of quiz progress
- Recovery of unsaved work
- Conflict resolution for multiple sessions

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Quiz-Specific Optimizations
- Lazy load questions as needed
- Cache quiz data locally
- Optimize image/media loading in questions

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Quiz-Specific Testing
- Test timer functionality
- Test auto-save mechanisms
- Test submission validation
- Test role-based access control

## Deliverables

1. **New Redux Slices**: `quizzesSlice.ts`, `questionsSlice.ts`, `quizSubmissionsSlice.ts`
2. **New API Services**: `quizApi.ts`, `questionApi.ts`, `quizSubmissionApi.ts`
3. **New Pages**: Quiz management, creation, taking, and results pages
4. **New Components**: Quiz-specific reusable components
5. **Enhanced Existing Pages**: Integration with course and student pages
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Quiz-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time timer functionality working properly
- Auto-save and recovery mechanisms functioning
- Responsive design consistent with existing pages
- Quiz security measures properly implemented

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
11. **DO** implement proper quiz security measures
12. **DO** ensure timer accuracy and reliability
13. **DO** implement comprehensive validation for quiz submissions

This implementation should seamlessly integrate with the existing codebase while providing comprehensive quiz management capabilities for educators and an intuitive quiz-taking experience for students. 