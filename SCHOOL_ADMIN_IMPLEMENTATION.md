# School Admin Feature Implementation Guide

## 📋 Overview

The School Admin feature provides comprehensive administrative functionality for school-level management within ThutoLMS. This implementation follows SOLID principles, maintains consistency with existing codebase patterns, and provides a modern, responsive user interface.

## 🎯 Core Modules

### 1. Class and Timetable Setup
**File:** `frontend/src/features/school_admin/pages/TimetableManagementPage.tsx`

**Features:**
- Weekly grid view with interactive time slots
- Drag-and-drop schedule creation
- Time conflict detection and resolution
- Class filtering and search functionality
- Week navigation controls
- Statistics dashboard (schedules, classes, teachers, conflicts)
- Export functionality for timetables

**Usage:**
```typescript
// Navigate to: /app/timetable
// Accessible via: School Admin Dashboard → Timetable Management
```

### 2. Subject and Course Allocation
**File:** `frontend/src/features/school_admin/pages/SubjectAllocationPage.tsx`

**Features:**
- Subject-to-teacher allocation management
- Teacher workload overview with progress tracking
- Filtering by subject, status, and class
- Statistics for allocations and average progress
- Bulk allocation functionality
- Teacher workload visualization (light/moderate/heavy indicators)

**Usage:**
```typescript
// Navigate to: /app/subject-allocation
// Accessible via: School Admin Dashboard → Subject Allocation
```

### 3. Assessment Configuration
**File:** `frontend/src/features/school_admin/pages/AssessmentConfigurationPage.tsx`

**Features:**
- Assessment creation and management interface
- Card-based layout with filtering capabilities
- Statistics overview (total, active, draft, completed assessments)
- Quick actions for creating assessments and configuring grading
- Assessment progress tracking with submissions and average scores

**Usage:**
```typescript
// Navigate to: /app/assessments
// Accessible via: School Admin Dashboard → Assessment Configuration
```

### 4. School-Level Reports
**File:** `frontend/src/features/school_admin/pages/ReportsPage.tsx`

**Features:**
- Student performance analytics
- Attendance tracking and reports
- Staff activity monitoring
- Comprehensive report generation

**Usage:**
```typescript
// Navigate to: /app/reports
// Accessible via: School Admin Dashboard → Reports
```

### 5. School Configuration
**File:** `frontend/src/features/school_admin/pages/SchoolSettingsPage.tsx`

**Features:**
- School profile editing
- Academic settings configuration
- Notification preferences
- Security settings management
- Admin delegate assignment

**Usage:**
```typescript
// Navigate to: /app/settings
// Accessible via: School Admin Dashboard → Settings
```

## 🏗️ Technical Architecture

### Redux Store Integration

#### Schedules Slice
**File:** `frontend/src/features/school_admin/schedulesSlice.ts`

```typescript
interface SchedulesState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  conflicts: Schedule[];
}
```

**Async Thunks:**
- `fetchSchedules()` - Get all schedules
- `fetchScheduleById(id)` - Get specific schedule
- `fetchSchedulesBySchool(schoolId)` - Get school schedules
- `fetchSchedulesByClass(classId)` - Get class schedules
- `fetchSchedulesByTeacher(teacherId)` - Get teacher schedules
- `createSchedule(scheduleData)` - Create new schedule
- `updateSchedule({id, scheduleData})` - Update existing schedule
- `deleteSchedule(id)` - Delete schedule
- `checkTimeConflicts(params)` - Check for scheduling conflicts
- `updateScheduleStatus({id, status})` - Update schedule status

#### Store Configuration
**File:** `frontend/src/store/index.ts`

```typescript
export const store = configureStore({
  reducer: {
    // ... existing reducers
    schedules: schedulesReducer,
  },
});
```

### API Services

#### Schedule API
**File:** `frontend/src/api/services/scheduleApi.ts`

**Enhanced Endpoints:**
```typescript
// CRUD Operations
scheduleApi.getAll()
scheduleApi.getById(id)
scheduleApi.getBySchool(schoolId)
scheduleApi.getByClass(classId)
scheduleApi.getByTeacher(teacherId)
scheduleApi.create(scheduleData)
scheduleApi.update(id, scheduleData)
scheduleApi.delete(id)

// Advanced Features
scheduleApi.checkTimeConflicts(params)
scheduleApi.updateStatus(id, status)
scheduleApi.bulkUpdate(scheduleIds, updateData)
scheduleApi.getActiveSchedulesForDateRange(startDate, endDate)
```

### Route Configuration

#### Protected Routes
**File:** `frontend/src/routes/index.tsx`

```typescript
// School Admin Routes
{
  path: 'timetable',
  element: TimetableManagement
},
{
  path: 'assessments',
  element: AssessmentConfiguration
},
{
  path: 'subject-allocation',
  element: SubjectAllocation
},
// ... additional routes
```

#### Sidebar Navigation
**File:** `frontend/src/routes/roleSidebar.ts`

```typescript
export const schoolAdminMenuItems: MenuItem[] = [
  {
    icon: Clock,
    label: 'Timetable Management',
    path: '/app/timetable',
    description: 'Create and manage class schedules'
  },
  // ... additional menu items
];
```

### Modal System Integration

#### Modal Constants
**File:** `frontend/src/utils/modalConstants.ts`

```typescript
export const MODAL_BODY_TYPES = {
  // Schedule Management Modals
  SCHEDULE_ADD_NEW: "SCHEDULE_ADD_NEW",
  SCHEDULE_EDIT: "SCHEDULE_EDIT",
  SCHEDULE_DELETE_CONFIRMATION: "SCHEDULE_DELETE_CONFIRMATION",
  SCHEDULE_VIEW: "SCHEDULE_VIEW",
  // ... existing modals
};
```

## 🎨 UI/UX Implementation

### Design System

#### Card Component Pattern
```typescript
const Card: React.FC<{ children: React.ReactNode, className?: string }> = 
  ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
```

#### Responsive Design
- **Mobile-first approach** using Tailwind CSS
- **Breakpoints:** `sm:`, `md:`, `lg:`, `xl:`
- **Grid layouts** that adapt to screen size
- **Flexible navigation** for mobile devices

#### Interactive Elements
- **Hover effects** on buttons and cards
- **Loading states** for async operations
- **Smooth transitions** using CSS transitions
- **Focus states** for accessibility

### Component Patterns

#### Statistics Cards
```typescript
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick?: () => void;
}> = ({ title, value, icon, iconColor, onClick }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${iconColor}`}>
        {icon}
      </div>
    </div>
  </Card>
);
```

#### Filter Controls
```typescript
const FilterControls: React.FC = () => (
  <Card>
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {/* Filter Dropdowns */}
      {/* ... */}
    </div>
  </Card>
);
```

## 📱 Usage Guide

### For School Administrators

#### Accessing School Admin Features
1. **Login** with school admin credentials
2. **Navigate** to School Admin Dashboard
3. **Select** desired module from sidebar navigation

#### Timetable Management
1. **View Timetable:**
   - Navigate to `/app/timetable`
   - Use week navigation to view different weeks
   - Toggle between grid and list views

2. **Create Schedule Entry:**
   - Click "Add Schedule" button
   - Fill in schedule details (time, class, teacher, subject)
   - System automatically checks for conflicts
   - Save to create the entry

3. **Edit Schedule:**
   - Click on existing schedule entry
   - Modify details as needed
   - Conflict detection runs automatically
   - Save changes

4. **Manage Conflicts:**
   - Click "Check Conflicts" to scan for issues
   - Review conflict alerts
   - Resolve by adjusting times or reassigning resources

#### Assessment Configuration
1. **Create Assessment:**
   - Navigate to `/app/assessments`
   - Click "Create Assessment"
   - Configure type (exam, quiz, assignment)
   - Set grading scheme and due dates

2. **Monitor Progress:**
   - View assessment cards for overview
   - Track submission rates
   - Monitor average scores
   - Generate reports

#### Subject Allocation
1. **Allocate Subjects:**
   - Navigate to `/app/subject-allocation`
   - Click "Allocate Subject"
   - Select teacher, subject, and class
   - Monitor workload distribution

2. **Track Progress:**
   - View teacher workload overview
   - Monitor curriculum delivery progress
   - Identify overloaded teachers
   - Redistribute as needed

### For Developers

#### Adding New Features

1. **Create Feature Page:**
```typescript
// frontend/src/features/school_admin/pages/NewFeaturePage.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

export const NewFeaturePage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  return (
    <div className="p-8 space-y-6">
      {/* Feature implementation */}
    </div>
  );
};
```

2. **Create Protected Route Wrapper:**
```typescript
// frontend/src/pages/protected/NewFeature.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { NewFeaturePage } from '../../features/school_admin/pages/NewFeaturePage';

const NewFeature = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "New Feature" }));
  }, [dispatch]);

  return (
    <div className="new-feature-container">
      <NewFeaturePage />
    </div>
  );
};

export default NewFeature;
```

3. **Add Route Configuration:**
```typescript
// frontend/src/routes/index.tsx
const NewFeature = lazy(() => import('../pages/protected/NewFeature'));

// Add to appRoutes array
{
  path: 'new-feature',
  element: NewFeature
}
```

4. **Update Sidebar Navigation:**
```typescript
// frontend/src/routes/roleSidebar.ts
{
  icon: IconName,
  label: 'New Feature',
  path: '/app/new-feature',
  description: 'Description of new feature'
}
```

#### State Management Pattern

1. **Create Slice:**
```typescript
// frontend/src/features/school_admin/newFeatureSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNewFeatureData = createAsyncThunk(
  'newFeature/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newFeatureApi.getData();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
    }
  }
);

const newFeatureSlice = createSlice({
  name: 'newFeature',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewFeatureData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNewFeatureData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchNewFeatureData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default newFeatureSlice.reducer;
```

2. **Add to Store:**
```typescript
// frontend/src/store/index.ts
import newFeatureReducer from '../features/school_admin/newFeatureSlice';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    newFeature: newFeatureReducer,
  },
});
```

## 🔒 Security Considerations

### Authentication & Authorization
- **Role-based access control** integrated with existing auth system
- **Route protection** ensures only school admins can access features
- **API endpoint security** with proper permission checks

### Input Validation
- **Client-side validation** using TypeScript interfaces
- **Server-side validation** for all API endpoints
- **Sanitization** of user inputs to prevent XSS attacks

### Error Handling
- **Graceful error handling** with user-friendly messages
- **Error logging** for debugging and monitoring
- **Fallback states** for failed operations

## 🧪 Testing

### Component Testing
```typescript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TimetableManagementPage } from './TimetableManagementPage';

describe('TimetableManagementPage', () => {
  it('renders timetable grid', () => {
    render(
      <Provider store={mockStore}>
        <TimetableManagementPage />
      </Provider>
    );
    
    expect(screen.getByText('Timetable Management')).toBeInTheDocument();
  });
});
```

### Integration Testing
- **API integration tests** for schedule management
- **Redux state management tests** for async thunks
- **Route navigation tests** for proper page rendering

## 🚀 Deployment

### Build Process
```bash
# Frontend build
cd frontend
npm run build

# Verify build success
npm run preview
```

### Environment Configuration
- **Development:** Local API endpoints
- **Staging:** Staging API endpoints with test data
- **Production:** Production API endpoints with SSL

## 📊 Performance Considerations

### Optimization Strategies
- **Lazy loading** for route components
- **Memoization** for expensive calculations
- **Virtual scrolling** for large data sets
- **Image optimization** for better loading times

### Bundle Size Management
- **Code splitting** by route
- **Tree shaking** to remove unused code
- **Dynamic imports** for heavy components

## 🔄 Future Enhancements

### Planned Features
1. **Real-time Updates** using WebSocket connections
2. **Advanced Analytics** with charts and graphs
3. **Mobile App** for on-the-go management
4. **Offline Support** for critical functions
5. **Integration APIs** for third-party systems

### Placeholder Pages Ready for Development
- **Facilities Management** (`/app/facilities`)
- **School Calendar** (`/app/school-calendar`)
- **Attendance Tracking** (`/app/attendance`)
- **Documents Management** (`/app/documents`)
- **School Monitoring** (`/app/monitoring`)

## 📞 Support

### Documentation
- **API Documentation:** Available in backend documentation
- **Component Library:** Storybook documentation (if available)
- **User Guides:** Available in help sections

### Troubleshooting
- **Common Issues:** Check browser console for errors
- **Performance Issues:** Monitor network requests
- **State Issues:** Use Redux DevTools for debugging

### Contact
- **Development Team:** Internal development team
- **Bug Reports:** Use issue tracking system
- **Feature Requests:** Submit through proper channels 