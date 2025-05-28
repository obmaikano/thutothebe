# Frontend Implementation Prompt: Grading System UI

## Overview
Implement comprehensive frontend UI interfaces for the grading system targeting educational roles: **SUPER_ADMIN**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

**IMPORTANT**: The backend controllers (`GradeController`, `GradeCategoryController`) and API services (`gradeApi.ts`, `gradeCategoryApi.ts`) already exist. **Only the UI layer (pages, components, modals) is missing.**

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
- `GradeController` - Complete grade management with moderation and statistics
- `GradeCategoryController` - Grade category management

### API Services Available:
- `gradeApi.ts` - Complete grade API service (352 lines)
- `gradeCategoryApi.ts` - Complete grade category API service (112 lines)

### Redux Slices Available:
- Grade-related state management may exist but needs verification

## Missing UI Implementation

### 1. Grading Management Pages (TO BE CREATED)
```
src/features/grades/pages/
├── GradebookPage.tsx               # Main gradebook interface
├── GradeEntryPage.tsx              # Grade entry and editing
├── GradeAnalyticsPage.tsx          # Grade analytics and reports
├── GradeCategoriesPage.tsx         # Manage grade categories
├── GradeModerationPage.tsx         # Grade moderation workflow
├── StudentGradesPage.tsx           # Student view of grades
├── ParentGradesPage.tsx            # Parent view of child's grades
└── GradeReportsPage.tsx            # Grade reports and exports
```

### 2. Grading Components (TO BE CREATED)
```
src/features/grades/components/
├── GradebookTable.tsx              # Interactive gradebook table
├── GradeEntryForm.tsx              # Grade entry form
├── GradeCard.tsx                   # Individual grade display
├── GradeFilters.tsx                # Search and filter controls
├── GradeStats.tsx                  # Grade statistics
├── GradeDistributionChart.tsx      # Grade distribution visualization
├── GradeTrendChart.tsx             # Grade trend analysis
├── GradeCalculator.tsx             # Grade calculation tools
├── GradeCategoryManager.tsx        # Category management
├── GradeModerationPanel.tsx        # Moderation interface
├── GradeExporter.tsx               # Export functionality
└── GradeImporter.tsx               # Import functionality
```

### 3. Grading Modals (TO BE CREATED)
```
src/features/grades/modals/
├── GradeEntryModal.tsx             # Quick grade entry
├── GradeEditModal.tsx              # Edit existing grade
├── GradeCategoryModal.tsx          # Create/edit grade categories
├── GradeModerationModal.tsx        # Grade moderation
├── BulkGradeModal.tsx              # Bulk grade operations
├── GradeCommentModal.tsx           # Add grade comments
└── GradeHistoryModal.tsx           # View grade history
```

## Core Features to Implement

### 1. Interactive Gradebook Interface

**Gradebook Table Features:**
- Spreadsheet-like interface with students and assignments
- Inline grade editing with validation
- Color-coded grade indicators
- Sorting and filtering capabilities
- Freeze columns for student names
- Auto-save functionality
- Bulk operations support

**Grade Entry Features:**
- Quick grade entry with keyboard shortcuts
- Grade validation and range checking
- Comment attachment to grades
- Grade history tracking
- Undo/redo functionality

### 2. Grade Analytics Dashboard

**Performance Analytics:**
- Class grade distribution charts
- Individual student progress tracking
- Assignment performance analysis
- Grade trend visualization
- Comparative analytics across classes
- Statistical summaries

**Reporting Features:**
- Customizable grade reports
- Export to various formats (PDF, Excel, CSV)
- Progress reports for parents
- Academic performance summaries
- Grade distribution reports

### 3. Grade Category Management

**Category Configuration:**
- Create and manage grade categories
- Weight assignment for categories
- Category-based calculations
- Flexible grading schemes
- Standards-based grading support

**Calculation Engine:**
- Weighted average calculations
- Points-based grading
- Standards-based grading
- Custom calculation formulas
- Grade curve applications

### 4. Grade Moderation System

**Moderation Workflow:**
- Grade review and approval process
- Moderation comments and feedback
- Grade change tracking
- Approval notifications
- Audit trail maintenance

**Quality Assurance:**
- Grade consistency checking
- Outlier detection
- Moderation statistics
- Quality metrics tracking

## Implementation Requirements

### 1. Use Existing API Services
```typescript
// Use existing API services - DO NOT recreate
import gradeApi from '../../api/services/gradeApi';
import gradeCategoryApi from '../../api/services/gradeCategoryApi';

// Use existing Redux patterns
import { useAppDispatch, useAppSelector } from '../../app/hooks';
```

### 2. Follow Existing Authentication Pattern
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Role-based permissions
const canEnterGrades = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canModerateGrades = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER'
].includes(userRole);

const canViewAllGrades = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canViewOwnGrades = [
  'STUDENT'
].includes(userRole);

const canViewChildGrades = [
  'PARENT'
].includes(userRole);
```

### 3. Follow Existing Modal Pattern
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  GRADE_ENTRY: "GRADE_ENTRY",
  GRADE_EDIT: "GRADE_EDIT",
  GRADE_CATEGORY: "GRADE_CATEGORY",
  GRADE_MODERATION: "GRADE_MODERATION",
  BULK_GRADE: "BULK_GRADE",
  GRADE_COMMENT: "GRADE_COMMENT",
  GRADE_HISTORY: "GRADE_HISTORY",
};
```

## Specific UI Components to Create

### 1. Gradebook Table Component
```typescript
// src/features/grades/components/GradebookTable.tsx
interface GradebookTableProps {
  students: Student[];
  assignments: Assignment[];
  grades: Grade[];
  onGradeChange: (studentId: number, assignmentId: number, grade: number) => void;
  onGradeComment: (gradeId: number, comment: string) => void;
  userRole: string;
  isEditable?: boolean;
}

// Features:
// - Spreadsheet-like interface
// - Inline editing capabilities
// - Color-coded grade indicators
// - Sorting and filtering
// - Freeze columns
// - Keyboard navigation
// - Auto-save functionality
```

### 2. Grade Entry Form Component
```typescript
// src/features/grades/components/GradeEntryForm.tsx
interface GradeEntryFormProps {
  assignment: Assignment;
  students: Student[];
  existingGrades?: Grade[];
  onSubmit: (grades: GradeData[]) => void;
  onSaveDraft: (grades: Partial<GradeData>[]) => void;
}

// Features:
// - Bulk grade entry
// - Individual grade entry
// - Grade validation
// - Comment attachment
// - Save draft functionality
// - Keyboard shortcuts
```

### 3. Grade Analytics Component
```typescript
// src/features/grades/components/GradeAnalytics.tsx
interface GradeAnalyticsProps {
  grades: Grade[];
  students: Student[];
  assignments: Assignment[];
  timeRange?: DateRange;
}

// Features:
// - Grade distribution charts
// - Performance trend analysis
// - Statistical summaries
// - Comparative analytics
// - Export capabilities
```

### 4. Grade Moderation Panel
```typescript
// src/features/grades/components/GradeModerationPanel.tsx
interface GradeModerationPanelProps {
  pendingGrades: Grade[];
  onApprove: (gradeId: number, comment?: string) => void;
  onReject: (gradeId: number, reason: string) => void;
  onRequestChanges: (gradeId: number, feedback: string) => void;
}

// Features:
// - Pending grades queue
// - Moderation actions
// - Comment system
// - Approval workflow
// - Audit trail
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/routes/roleSidebar.ts`:
```typescript
// For Teachers
{
  icon: BarChart,
  label: 'Gradebook',
  path: '/app/gradebook',
  description: 'Manage student grades'
},
{
  icon: TrendingUp,
  label: 'Grade Analytics',
  path: '/app/grade-analytics',
  description: 'Grade performance analysis'
},

// For Students
{
  icon: Award,
  label: 'My Grades',
  path: '/app/my-grades',
  description: 'View your academic grades'
},

// For Parents
{
  icon: FileText,
  label: 'Child Grades',
  path: '/app/child-grades',
  description: 'View your child\'s grades'
},

// For Admins
{
  icon: Settings,
  label: 'Grade Settings',
  path: '/app/grade-settings',
  description: 'Configure grading system'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx`:
```typescript
// Gradebook routes
<Route path="/gradebook" element={<GradebookPage />} />
<Route path="/gradebook/:classId" element={<GradebookPage />} />
<Route path="/grade-entry/:assignmentId" element={<GradeEntryPage />} />

// Analytics routes
<Route path="/grade-analytics" element={<GradeAnalyticsPage />} />
<Route path="/grade-reports" element={<GradeReportsPage />} />

// Student/Parent routes
<Route path="/my-grades" element={<StudentGradesPage />} />
<Route path="/child-grades" element={<ParentGradesPage />} />

// Admin routes
<Route path="/grade-categories" element={<GradeCategoriesPage />} />
<Route path="/grade-moderation" element={<GradeModerationPage />} />
<Route path="/grade-settings" element={<GradeSettingsPage />} />
```

## Advanced Features

### 1. Standards-Based Grading
- Proficiency level tracking
- Standards alignment
- Mastery-based assessment
- Progress monitoring
- Competency mapping

### 2. Grade Calculation Engine
- Weighted categories
- Drop lowest scores
- Extra credit handling
- Curve applications
- Custom formulas

### 3. Grade Communication
- Automated grade notifications
- Parent communication tools
- Progress alerts
- Grade change notifications
- Conference scheduling

## Real-time Features

### 1. Live Grade Updates
- Real-time grade synchronization
- Collaborative grading
- Live moderation updates
- Instant notifications
- Auto-save functionality

### 2. Grade Collaboration
- Teacher collaboration tools
- Moderation workflows
- Peer review systems
- Grade discussions
- Approval processes

## Performance Considerations

### 1. Large Dataset Handling
- Virtual scrolling for large gradebooks
- Pagination for grade lists
- Lazy loading of grade data
- Efficient caching strategies
- Optimized calculations

### 2. Calculation Optimization
- Client-side grade calculations
- Cached calculation results
- Incremental updates
- Background processing
- Performance monitoring

## Security Implementation

### 1. Grade Security
- Role-based access control
- Grade encryption
- Audit trail logging
- Change tracking
- Data integrity checks

### 2. Privacy Protection
- Student privacy compliance
- Parent access controls
- Data anonymization
- Secure communications
- FERPA compliance

## Testing Strategy

### 1. Component Testing
- Gradebook functionality
- Calculation accuracy
- Form validation
- Role-based access
- Data integrity

### 2. Integration Testing
- API integration
- Calculation engine
- Notification systems
- Export functionality
- Security measures

## Deliverables

1. **Interactive Gradebook**: Spreadsheet-like grading interface
2. **Grade Analytics Dashboard**: Performance analysis and reporting
3. **Grade Entry System**: Efficient grade input and management
4. **Moderation Workflow**: Grade review and approval system
5. **Student/Parent Views**: Grade viewing interfaces
6. **Category Management**: Grade category configuration
7. **Export/Import Tools**: Data exchange capabilities
8. **Mobile Interface**: Responsive grading tools

## Success Criteria

- Intuitive gradebook interface for teachers
- Accurate grade calculations and analytics
- Efficient grade entry and editing workflows
- Comprehensive moderation and approval system
- Clear grade viewing for students and parents
- Robust export and reporting capabilities
- Mobile-responsive design
- High performance with large datasets
- Secure grade handling and privacy protection
- Seamless integration with existing systems

## Implementation Notes

1. **DO NOT** recreate existing API services
2. **DO** use existing authentication and authorization patterns
3. **DO** follow existing styling and component patterns
4. **DO** implement comprehensive grade validation
5. **DO** ensure accurate calculation engines
6. **DO** optimize for performance with large gradebooks
7. **DO** implement proper security measures
8. **DO** provide intuitive interfaces for all user roles
9. **DO** maintain data integrity and audit trails
10. **DO** ensure mobile responsiveness and accessibility

This implementation will provide a complete grading system that leverages existing backend infrastructure while delivering an intuitive and powerful frontend experience for all educational stakeholders. 