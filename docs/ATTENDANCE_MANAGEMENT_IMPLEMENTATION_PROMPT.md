# Frontend Implementation Prompt: Attendance Management System

## Overview
Implement a comprehensive frontend interface for the attendance management system targeting educational roles: **SUPER_ADMIN**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

**IMPORTANT**: The backend controller (`AttendanceController`) exists but no frontend API service or UI implementation has been created. This is a complete frontend implementation from API service to UI components.

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

## Backend Controller Available
- `AttendanceController` - Complete attendance management functionality

## Complete Frontend Implementation Required

### 1. API Service Layer (TO BE CREATED)
```typescript
// src/api/services/attendanceApi.ts
import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface AttendanceResponse {
  status: string;
  message: string;
  data: Attendance | Attendance[] | null;
  timestamp: string | null;
}

export interface Attendance {
  id: number;
  studentId: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    classId: number;
    className?: string;
  };
  classId: number;
  subjectId?: number;
  teacherId: number;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
  };
  date: string;
  timeSlot: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'SICK';
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
  markedBy: number;
  markedAt: string;
  parentNotified: boolean;
  excuseReason?: string;
  excuseDocument?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceRequest {
  studentId: number;
  classId: number;
  subjectId?: number;
  date: string;
  timeSlot: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'SICK';
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
  excuseReason?: string;
}

export interface BulkAttendanceRequest {
  classId: number;
  subjectId?: number;
  date: string;
  timeSlot: string;
  attendanceRecords: Array<{
    studentId: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'SICK';
    arrivalTime?: string;
    notes?: string;
  }>;
}

const attendanceApi = {
  // Basic CRUD operations
  getAll: async (): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.get('/api/attendance');
  },
  getById: async (id: number): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.get(`/api/attendance/${id}`);
  },
  create: async (attendanceData: CreateAttendanceRequest): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.post('/api/attendance', attendanceData);
  },
  update: async (id: number, attendanceData: Partial<CreateAttendanceRequest>): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.put(`/api/attendance/${id}`, attendanceData);
  },
  delete: async (id: number): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.delete(`/api/attendance/${id}`);
  },

  // Bulk operations
  createBulk: async (bulkData: BulkAttendanceRequest): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.post('/api/attendance/bulk', bulkData);
  },
  updateBulk: async (bulkData: BulkAttendanceRequest): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.put('/api/attendance/bulk', bulkData);
  },

  // Query operations
  getByStudent: async (studentId: number, startDate?: string, endDate?: string): Promise<AxiosResponse<AttendanceResponse>> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/api/attendance/student/${studentId}?${params}`);
  },
  getByClass: async (classId: number, date?: string): Promise<AxiosResponse<AttendanceResponse>> => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/api/attendance/class/${classId}${params}`);
  },
  getByTeacher: async (teacherId: number, date?: string): Promise<AxiosResponse<AttendanceResponse>> => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/api/attendance/teacher/${teacherId}${params}`);
  },
  getByDateRange: async (startDate: string, endDate: string, classId?: number): Promise<AxiosResponse<AttendanceResponse>> => {
    const params = new URLSearchParams({ startDate, endDate });
    if (classId) params.append('classId', classId.toString());
    return api.get(`/api/attendance/range?${params}`);
  },

  // Statistics and reports
  getAttendanceStats: async (classId?: number, studentId?: number, startDate?: string, endDate?: string): Promise<AxiosResponse<{
    data: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      excusedDays: number;
      attendanceRate: number;
    }
  }>> => {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId.toString());
    if (studentId) params.append('studentId', studentId.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/api/attendance/stats?${params}`);
  },
  getAttendanceReport: async (classId: number, startDate: string, endDate: string): Promise<AxiosResponse<AttendanceResponse>> => {
    return api.get(`/api/attendance/report?classId=${classId}&startDate=${startDate}&endDate=${endDate}`);
  },

  // Parent notifications
  notifyParents: async (attendanceIds: number[]): Promise<AxiosResponse<void>> => {
    return api.post('/api/attendance/notify-parents', { attendanceIds });
  },
};

export default attendanceApi;
```

### 2. Redux Slice (TO BE CREATED)
```typescript
// src/features/attendance/attendanceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceApi, { Attendance, CreateAttendanceRequest, BulkAttendanceRequest } from '../../api/services/attendanceApi';

export interface AttendanceState {
  attendanceRecords: Attendance[];
  currentAttendance: Attendance | null;
  attendanceStats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    classId?: number;
    studentId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  };
}

// Async thunks for attendance operations
export const fetchAttendanceRecords = createAsyncThunk(/* ... */);
export const createAttendanceRecord = createAsyncThunk(/* ... */);
export const createBulkAttendance = createAsyncThunk(/* ... */);
export const fetchAttendanceStats = createAsyncThunk(/* ... */);
// ... other thunks
```

### 3. Feature Directory Structure (TO BE CREATED)
```
src/features/attendance/
├── pages/
│   ├── AttendanceListPage.tsx          # View all attendance records
│   ├── AttendanceMarkingPage.tsx       # Mark attendance for class
│   ├── AttendanceReportsPage.tsx       # Attendance reports and analytics
│   ├── StudentAttendancePage.tsx       # Student attendance view
│   ├── ParentAttendancePage.tsx        # Parent view of child's attendance
│   └── AttendanceCalendarPage.tsx      # Calendar view of attendance
├── components/
│   ├── AttendanceCard.tsx              # Individual attendance record
│   ├── AttendanceForm.tsx              # Single attendance entry form
│   ├── BulkAttendanceForm.tsx          # Bulk attendance marking
│   ├── AttendanceFilters.tsx           # Search and filter controls
│   ├── AttendanceStats.tsx             # Attendance statistics
│   ├── AttendanceCalendar.tsx          # Calendar component
│   ├── AttendanceChart.tsx             # Attendance visualization
│   ├── StudentAttendanceCard.tsx       # Student-specific attendance
│   └── AttendanceExporter.tsx          # Export functionality
├── modals/
│   ├── MarkAttendanceModal.tsx         # Quick attendance marking
│   ├── EditAttendanceModal.tsx         # Edit attendance record
│   ├── ExcuseAttendanceModal.tsx       # Mark as excused with reason
│   ├── BulkAttendanceModal.tsx         # Bulk attendance operations
│   └── AttendanceDetailsModal.tsx      # View attendance details
├── attendanceSlice.ts
├── README.md
└── index.tsx
```

## Core Features to Implement

### 1. Attendance Marking Interface

**Daily Attendance Marking:**
- Class roster with student list
- Quick mark all present/absent
- Individual status selection (Present, Absent, Late, Excused, Sick)
- Time tracking for arrivals and departures
- Notes and comments for each record
- Bulk operations for efficiency

**Real-time Attendance:**
- Live attendance tracking
- Automatic time stamping
- Late arrival notifications
- Parent notification triggers

### 2. Attendance Analytics Dashboard

**Statistical Overview:**
- Attendance rate calculations
- Trend analysis over time
- Class comparison metrics
- Individual student tracking
- Absence pattern identification

**Visual Analytics:**
- Attendance charts and graphs
- Calendar heat maps
- Trend line visualizations
- Comparative analytics
- Export capabilities

### 3. Student/Parent Attendance Views

**Student Dashboard:**
- Personal attendance summary
- Attendance calendar view
- Absence notifications
- Attendance goals and tracking

**Parent Portal:**
- Child's attendance overview
- Real-time absence notifications
- Attendance reports
- Communication with school

### 4. Attendance Reporting

**Comprehensive Reports:**
- Daily attendance reports
- Weekly/monthly summaries
- Student attendance profiles
- Class attendance analytics
- Truancy identification

**Export Functionality:**
- PDF report generation
- Excel/CSV exports
- Email report delivery
- Scheduled report automation

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Role-based permissions
const canMarkAttendance = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canViewAllAttendance = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canViewClassAttendance = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canViewOwnAttendance = [
  'STUDENT'
].includes(userRole);

const canViewChildAttendance = [
  'PARENT'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  MARK_ATTENDANCE: "MARK_ATTENDANCE",
  EDIT_ATTENDANCE: "EDIT_ATTENDANCE",
  EXCUSE_ATTENDANCE: "EXCUSE_ATTENDANCE",
  BULK_ATTENDANCE: "BULK_ATTENDANCE",
  ATTENDANCE_DETAILS: "ATTENDANCE_DETAILS",
};
```

## Specific UI Components to Create

### 1. Bulk Attendance Form Component
```typescript
// src/features/attendance/components/BulkAttendanceForm.tsx
interface BulkAttendanceFormProps {
  students: Student[];
  classId: number;
  date: string;
  timeSlot: string;
  onSubmit: (attendanceData: BulkAttendanceRequest) => void;
  existingAttendance?: Attendance[];
}

// Features:
// - Student roster display
// - Quick mark all buttons
// - Individual status toggles
// - Time entry for late arrivals
// - Notes for each student
// - Save draft functionality
```

### 2. Attendance Calendar Component
```typescript
// src/features/attendance/components/AttendanceCalendar.tsx
interface AttendanceCalendarProps {
  attendanceData: Attendance[];
  studentId?: number;
  classId?: number;
  onDateSelect: (date: string) => void;
  viewMode: 'month' | 'week' | 'day';
}

// Features:
// - Calendar view with attendance status
// - Color-coded attendance indicators
// - Click to view daily details
// - Navigation between months
// - Legend for status colors
```

### 3. Attendance Statistics Component
```typescript
// src/features/attendance/components/AttendanceStats.tsx
interface AttendanceStatsProps {
  stats: AttendanceStats;
  timeRange: DateRange;
  comparisonData?: AttendanceStats[];
}

// Features:
// - Attendance rate display
// - Visual progress indicators
// - Trend analysis
// - Comparison metrics
// - Export functionality
```

### 4. Student Attendance Card Component
```typescript
// src/features/attendance/components/StudentAttendanceCard.tsx
interface StudentAttendanceCardProps {
  student: Student;
  attendanceData: Attendance[];
  onMarkAttendance: (studentId: number, status: AttendanceStatus) => void;
  onViewDetails: (studentId: number) => void;
  isEditable?: boolean;
}

// Features:
// - Student information display
// - Current attendance status
// - Quick status change buttons
// - Attendance rate indicator
// - Recent attendance history
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/routes/roleSidebar.ts`:
```typescript
// For Teachers
{
  icon: CheckSquare,
  label: 'Attendance',
  path: '/app/attendance',
  description: 'Mark and manage student attendance'
},
{
  icon: BarChart3,
  label: 'Attendance Reports',
  path: '/app/attendance-reports',
  description: 'View attendance analytics and reports'
},

// For Students
{
  icon: Calendar,
  label: 'My Attendance',
  path: '/app/my-attendance',
  description: 'View your attendance record'
},

// For Parents
{
  icon: Eye,
  label: 'Child Attendance',
  path: '/app/child-attendance',
  description: 'Monitor your child\'s attendance'
},

// For Admins
{
  icon: Users,
  label: 'School Attendance',
  path: '/app/school-attendance',
  description: 'School-wide attendance management'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx`:
```typescript
// Attendance routes
<Route path="/attendance" element={<AttendanceMarkingPage />} />
<Route path="/attendance/list" element={<AttendanceListPage />} />
<Route path="/attendance/calendar" element={<AttendanceCalendarPage />} />
<Route path="/attendance/reports" element={<AttendanceReportsPage />} />

// Student/Parent routes
<Route path="/my-attendance" element={<StudentAttendancePage />} />
<Route path="/child-attendance" element={<ParentAttendancePage />} />

// Admin routes
<Route path="/school-attendance" element={<SchoolAttendancePage />} />
<Route path="/attendance-analytics" element={<AttendanceAnalyticsPage />} />
```

## Advanced Features

### 1. Automated Attendance
- QR code scanning for check-in
- RFID card integration
- Biometric attendance options
- Mobile app integration
- Geofencing for location verification

### 2. Smart Notifications
- Real-time absence alerts
- Parent notification system
- Truancy warnings
- Attendance goal reminders
- Automated report delivery

### 3. Integration Features
- SMS/Email notifications
- Parent portal integration
- Student information system sync
- Academic performance correlation
- Behavioral tracking integration

## Real-time Features

### 1. Live Attendance Updates
- Real-time attendance marking
- Live dashboard updates
- Instant parent notifications
- Collaborative attendance marking
- Automatic synchronization

### 2. Mobile Responsiveness
- Touch-friendly interfaces
- Mobile attendance marking
- Offline capability
- Progressive web app features
- Cross-device synchronization

## Performance Considerations

### 1. Large Dataset Handling
- Efficient data pagination
- Virtual scrolling for large lists
- Optimized calendar rendering
- Cached attendance data
- Background data loading

### 2. Real-time Optimization
- WebSocket connections for live updates
- Optimistic UI updates
- Efficient state management
- Minimal re-renders
- Performance monitoring

## Security Implementation

### 1. Data Security
- Role-based access control
- Attendance data encryption
- Audit trail logging
- Secure API communications
- Privacy compliance (FERPA)

### 2. Integrity Measures
- Attendance record validation
- Timestamp verification
- Change tracking
- Duplicate prevention
- Data backup systems

## Testing Strategy

### 1. Component Testing
- Attendance marking functionality
- Calendar component accuracy
- Statistics calculations
- Form validation
- Role-based access

### 2. Integration Testing
- API integration
- Real-time updates
- Notification systems
- Export functionality
- Mobile responsiveness

## Deliverables

1. **Complete API Service**: `attendanceApi.ts`
2. **Redux State Management**: `attendanceSlice.ts`
3. **Attendance Marking Interface**: Bulk and individual marking
4. **Analytics Dashboard**: Statistics and reporting
5. **Calendar Views**: Visual attendance tracking
6. **Student/Parent Portals**: Attendance viewing interfaces
7. **Export/Reporting Tools**: Comprehensive reporting system
8. **Mobile-Responsive Design**: Cross-device compatibility

## Success Criteria

- Efficient daily attendance marking workflow
- Accurate attendance tracking and calculations
- Comprehensive analytics and reporting
- Real-time notifications and updates
- Intuitive user interfaces for all roles
- Mobile-responsive design
- High performance with large datasets
- Secure data handling and privacy protection
- Seamless integration with existing systems
- Automated notification systems

## Implementation Notes

1. **DO** create complete API service following existing patterns
2. **DO** implement comprehensive Redux state management
3. **DO** follow existing authentication and authorization patterns
4. **DO** use existing styling and component patterns
5. **DO** implement real-time features where appropriate
6. **DO** ensure mobile responsiveness
7. **DO** optimize for performance with large datasets
8. **DO** implement proper security measures
9. **DO** provide intuitive interfaces for all user roles
10. **DO** integrate with existing notification systems

This implementation will provide a complete attendance management system from API to UI, delivering efficient attendance tracking and comprehensive analytics for educational institutions. 