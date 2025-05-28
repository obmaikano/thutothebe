# Frontend Implementation Prompt: Assignments & Submissions UI System

## Overview
Implement comprehensive frontend UI interfaces for the assignments and submissions management system targeting educational roles: **SUPER_ADMIN**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

**IMPORTANT**: The backend controllers (`AssignmentController`, `SubmissionController`, `AssessmentController`) and API services (`assignmentApi.ts`, `submissionApi.ts`, `assessmentApi.ts`) already exist. The Redux slices (`assignmentsSlice.ts`, `assessmentsSlice.ts`) are also implemented. **Only the UI layer (pages, components, modals) is missing.**

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

## Existing Backend & API Layer (ALREADY IMPLEMENTED)

### Backend Controllers Available:
- `AssignmentController` - Full CRUD operations for assignments
- `SubmissionController` - Student submission management
- `AssessmentController` - Assessment and grading functionality

### API Services Available:
- `assignmentApi.ts` - Complete assignment API service
- `submissionApi.ts` - Complete submission API service  
- `assessmentApi.ts` - Complete assessment API service

### Redux Slices Available:
- `assignmentsSlice.ts` - Assignment state management
- `assessmentsSlice.ts` - Assessment state management

## Missing UI Implementation

### 1. Assignment Management Pages (TO BE CREATED)
```
src/features/assignments/pages/
├── AssignmentListPage.tsx          # View all assignments
├── AssignmentDetailsPage.tsx       # Assignment details and submissions
├── CreateAssignmentPage.tsx        # Create new assignment
├── EditAssignmentPage.tsx          # Edit existing assignment
├── AssignmentSubmissionsPage.tsx   # Manage assignment submissions
└── StudentAssignmentPage.tsx       # Student view of assignments
```

### 2. Assignment Components (TO BE CREATED)
```
src/features/assignments/components/
├── AssignmentCard.tsx              # Assignment display card
├── AssignmentForm.tsx              # Assignment creation/edit form
├── AssignmentFilters.tsx           # Search and filter controls
├── AssignmentStats.tsx             # Assignment statistics
├── SubmissionCard.tsx              # Individual submission display
├── SubmissionsList.tsx             # List of submissions
├── GradingInterface.tsx            # Teacher grading interface
├── FileUploader.tsx                # File upload component
├── AssignmentCalendar.tsx          # Calendar view of assignments
└── AssignmentProgress.tsx          # Progress tracking
```

### 3. Assignment Modals (TO BE CREATED)
```
src/features/assignments/modals/
├── CreateAssignmentModal.tsx       # Quick assignment creation
├── EditAssignmentModal.tsx         # Quick assignment editing
├── SubmissionDetailsModal.tsx      # View submission details
├── GradeSubmissionModal.tsx        # Grade individual submission
├── AssignmentSettingsModal.tsx     # Assignment configuration
└── BulkGradingModal.tsx           # Bulk grading interface
```

## Core Features to Implement

### 1. Assignment Management Interface

**Assignment List Page Features:**
- Comprehensive assignment listing with search/filter
- Role-based view (Teacher vs Student vs Admin)
- Assignment status tracking (Draft, Published, Due, Closed)
- Bulk operations (publish, archive, delete)
- Assignment statistics dashboard
- Calendar integration

**Assignment Creation/Editing:**
- Rich text editor for assignment description
- File attachment support
- Due date and time management
- Grading criteria setup
- Submission settings configuration
- Auto-save functionality

### 2. Student Assignment Interface

**Student Assignment View:**
- Available assignments dashboard
- Assignment details with requirements
- Submission interface with file upload
- Progress tracking
- Due date reminders
- Grade viewing

**Submission Management:**
- File upload with validation
- Text submission support
- Draft saving capability
- Submission history
- Resubmission handling

### 3. Teacher Grading Interface

**Grading Dashboard:**
- Submissions overview
- Grading queue management
- Bulk grading tools
- Grade distribution analytics
- Feedback management

**Individual Grading:**
- Side-by-side view (assignment/submission)
- Rubric-based grading
- Comment and feedback system
- File annotation tools
- Grade calculation

### 4. Assessment Analytics

**Performance Analytics:**
- Assignment completion rates
- Grade distribution charts
- Student performance trends
- Class comparison metrics
- Time-to-completion analysis

## Implementation Requirements

### 1. Use Existing API Services
```typescript
// Use existing API services - DO NOT recreate
import assignmentApi from '../../api/services/assignmentApi';
import submissionApi from '../../api/services/submissionApi';
import assessmentApi from '../../api/services/assessmentApi';

// Use existing Redux slices - DO NOT recreate
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  fetchAssignments, 
  createAssignment, 
  updateAssignment 
} from './assignmentsSlice';
```

### 2. Follow Existing Authentication Pattern
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Role-based permissions
const canCreateAssignments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN', 
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canGradeSubmissions = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD', 
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canSubmitAssignments = [
  'STUDENT'
].includes(userRole);

const canViewAssignments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER', 
  'TEACHER',
  'STUDENT',
  'PARENT'
].includes(userRole);
```

### 3. Follow Existing Modal Pattern
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  ASSIGNMENT_ADD_NEW: "ASSIGNMENT_ADD_NEW",
  ASSIGNMENT_EDIT: "ASSIGNMENT_EDIT",
  ASSIGNMENT_DETAILS: "ASSIGNMENT_DETAILS",
  SUBMISSION_DETAILS: "SUBMISSION_DETAILS",
  GRADE_SUBMISSION: "GRADE_SUBMISSION",
  ASSIGNMENT_SETTINGS: "ASSIGNMENT_SETTINGS",
  BULK_GRADING: "BULK_GRADING",
};
```

## Specific UI Components to Create

### 1. Assignment Card Component
```typescript
// src/features/assignments/components/AssignmentCard.tsx
interface AssignmentCardProps {
  assignment: Assignment;
  userRole: string;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
  onView?: (assignment: Assignment) => void;
  onSubmit?: (assignment: Assignment) => void;
}

// Features:
// - Assignment title, description preview
// - Due date with countdown
// - Submission status indicators
// - Grade display (if available)
// - Action buttons based on role
// - Progress indicators
```

### 2. Assignment Form Component
```typescript
// src/features/assignments/components/AssignmentForm.tsx
interface AssignmentFormProps {
  assignment?: Assignment;
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Features:
// - Rich text editor for description
// - File attachment handling
// - Due date/time picker
// - Grading criteria setup
// - Submission settings
// - Form validation
```

### 3. Grading Interface Component
```typescript
// src/features/assignments/components/GradingInterface.tsx
interface GradingInterfaceProps {
  submission: Submission;
  assignment: Assignment;
  onGradeSubmit: (grade: GradeData) => void;
  onSaveDraft: (grade: Partial<GradeData>) => void;
}

// Features:
// - Split view (assignment/submission)
// - Rubric-based grading
// - Comment system
// - File preview/annotation
// - Grade calculation
// - Save draft functionality
```

### 4. Student Assignment Dashboard
```typescript
// src/features/assignments/components/StudentAssignmentDashboard.tsx
// Features:
// - Upcoming assignments
// - Overdue assignments
// - Completed assignments
// - Grade summary
// - Progress tracking
// - Quick submission access
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/routes/roleSidebar.ts`:
```typescript
// For Teachers
{
  icon: ClipboardList,
  label: 'Assignments',
  path: '/app/assignments',
  description: 'Manage assignments and submissions'
},
{
  icon: FileCheck,
  label: 'Grading',
  path: '/app/grading',
  description: 'Grade student submissions'
},

// For Students  
{
  icon: BookOpen,
  label: 'My Assignments',
  path: '/app/my-assignments',
  description: 'View and submit assignments'
},

// For Admins
{
  icon: BarChart3,
  label: 'Assignment Analytics',
  path: '/app/assignment-analytics', 
  description: 'Assignment performance metrics'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx`:
```typescript
// Assignment routes
<Route path="/assignments" element={<AssignmentListPage />} />
<Route path="/assignments/create" element={<CreateAssignmentPage />} />
<Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
<Route path="/assignments/:id/edit" element={<EditAssignmentPage />} />
<Route path="/assignments/:id/submissions" element={<AssignmentSubmissionsPage />} />

// Student routes
<Route path="/my-assignments" element={<StudentAssignmentPage />} />

// Grading routes
<Route path="/grading" element={<GradingDashboardPage />} />
<Route path="/grading/:submissionId" element={<GradingPage />} />

// Analytics routes
<Route path="/assignment-analytics" element={<AssignmentAnalyticsPage />} />
```

## Real-time Features

### 1. Live Assignment Updates
- Real-time submission notifications
- Live grade updates
- Assignment status changes
- Due date reminders
- Collaboration features

### 2. File Handling
- Drag-and-drop file upload
- File preview capabilities
- Version control for submissions
- File size validation
- Multiple file format support

## Advanced Features

### 1. Rubric-Based Grading
- Custom rubric creation
- Criterion-based scoring
- Weighted grade calculation
- Rubric templates
- Performance analytics

### 2. Plagiarism Detection Integration
- File comparison tools
- Similarity reporting
- Academic integrity tracking
- Alert system

### 3. Collaborative Assignments
- Group assignment support
- Peer review functionality
- Team submission management
- Individual contribution tracking

## Performance Considerations

### 1. File Upload Optimization
- Chunked file uploads
- Progress indicators
- Resume capability
- Compression options

### 2. Large Dataset Handling
- Pagination for assignment lists
- Virtual scrolling for submissions
- Lazy loading of content
- Efficient caching strategies

## Security Implementation

### 1. File Security
- File type validation
- Size restrictions
- Virus scanning integration
- Secure file storage

### 2. Submission Integrity
- Timestamp verification
- Edit history tracking
- Submission locking
- Academic honesty measures

## Testing Strategy

### 1. Component Testing
- Assignment form validation
- File upload functionality
- Grading interface accuracy
- Role-based access control

### 2. Integration Testing
- API integration testing
- File handling workflows
- Grade calculation accuracy
- Notification systems

## Deliverables

1. **Assignment Management Pages**: Complete CRUD interface
2. **Student Assignment Interface**: Submission and tracking system
3. **Teacher Grading Interface**: Comprehensive grading tools
4. **Assignment Analytics**: Performance metrics and reporting
5. **File Management System**: Upload, preview, and management
6. **Notification System**: Real-time updates and reminders
7. **Mobile-Responsive Design**: Cross-device compatibility

## Success Criteria

- Seamless integration with existing backend APIs
- Intuitive user experience for all roles
- Efficient file handling and storage
- Accurate grade calculation and tracking
- Real-time updates and notifications
- Comprehensive analytics and reporting
- Mobile-responsive design
- Robust error handling and validation
- Performance optimization for large datasets
- Security compliance for file handling

## Implementation Notes

1. **DO NOT** recreate existing API services or Redux slices
2. **DO** use existing authentication and authorization patterns
3. **DO** follow existing styling and component patterns
4. **DO** implement comprehensive error handling
5. **DO** ensure mobile responsiveness
6. **DO** optimize for performance with large files
7. **DO** implement proper file security measures
8. **DO** provide intuitive user interfaces for all roles
9. **DO** integrate with existing notification systems
10. **DO** maintain consistency with existing application patterns

This implementation will provide a complete assignments and submissions management system that leverages the existing backend infrastructure while delivering a comprehensive and user-friendly frontend experience. 