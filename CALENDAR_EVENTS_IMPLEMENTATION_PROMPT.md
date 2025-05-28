# Frontend Implementation Prompt: Calendar Events System

## Overview
Implement a comprehensive frontend interface for the calendar events system targeting all educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    calendarEvents: calendarEventsReducer,  // TO BE CREATED
    eventAttendees: eventAttendeesReducer,  // TO BE CREATED
    eventOrganizers: eventOrganizersReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/calendar/
├── pages/
│   ├── CalendarPage.tsx
│   ├── EventDetailsPage.tsx
│   ├── CreateEventPage.tsx
│   ├── MyEventsPage.tsx
│   └── EventApprovalPage.tsx
├── components/
│   ├── CalendarView.tsx
│   ├── EventCard.tsx
│   ├── EventForm.tsx
│   ├── EventFilters.tsx
│   ├── AttendeesList.tsx
│   └── EventConflictChecker.tsx
├── modals/
│   ├── CreateEventModal.tsx
│   ├── EditEventModal.tsx
│   ├── EventDetailsModal.tsx
│   ├── AddAttendeeModal.tsx
│   └── EventApprovalModal.tsx
├── calendarEventsSlice.ts
├── eventAttendeesSlice.ts
├── eventOrganizersSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/calendarEventApi.ts
// src/api/services/eventAttendeeApi.ts
// src/api/services/eventOrganizerApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface CalendarEventResponse {
  status: string;
  message: string;
  data: CalendarEvent | CalendarEvent[] | null;
  timestamp: string | null;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  eventType: 'ACADEMIC' | 'ADMINISTRATIVE' | 'SOCIAL' | 'SPORTS' | 'CULTURAL' | 'MEETING' | 'EXAM' | 'HOLIDAY' | 'TRAINING' | 'OTHER';
  scope: 'GLOBAL' | 'REGIONAL' | 'SCHOOL' | 'CLASS' | 'COURSE' | 'DEPARTMENT' | 'PRIVATE';
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'PENDING_APPROVAL';
  startTime: string;
  endTime: string;
  location?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrencePattern?: string;
  createdById: number;
  regionId?: number;
  schoolId?: number;
  classId?: number;
  courseId?: number;
  departmentId?: number;
  maxAttendees?: number;
  requiresApproval: boolean;
  approvedById?: number;
  approvedAt?: string;
  approvalNotes?: string;
  rejectionNotes?: string;
  cancellationReason?: string;
  postponementReason?: string;
  tags?: string;
  attachments?: string;
  isPublic: boolean;
  allowRegistration: boolean;
  registrationDeadline?: string;
  attendeeCount: number;
  organizerCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  id: number;
  eventId: number;
  userId: number;
  attendanceStatus: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'ABSENT' | 'CANCELLED';
  registeredAt: string;
  confirmedAt?: string;
  attendedAt?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
}

export interface EventOrganizer {
  id: number;
  eventId: number;
  userId: number;
  role: 'PRIMARY' | 'SECONDARY' | 'COORDINATOR' | 'FACILITATOR';
  responsibilities?: string;
  active: boolean;
  createdAt: string;
}

const calendarEventApi = {
  getAll: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events');
  },
  getById: async (id: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/${id}`);
  },
  getDateRange: async (startTime: string, endTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/date-range?startTime=${startTime}&endTime=${endTime}`);
  },
  getByScope: async (scope: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/scope/${scope}`);
  },
  getGlobal: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/global');
  },
  getByRegion: async (regionId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/region/${regionId}`);
  },
  getBySchool: async (regionId: number, schoolId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/school/${regionId}/${schoolId}`);
  },
  getByClass: async (regionId: number, schoolId: number, classId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/class/${regionId}/${schoolId}/${classId}`);
  },
  getUserEvents: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}`);
  },
  getCreatedByUser: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}/created`);
  },
  getAttendingEvents: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}/attending`);
  },
  getOrganizingEvents: async (userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/user/${userId}/organizing`);
  },
  getByType: async (eventType: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/type/${eventType}`);
  },
  getByStatus: async (status: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/status/${status}`);
  },
  getUpcoming: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/upcoming');
  },
  getToday: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/today');
  },
  getThisWeek: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/this-week');
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/course/${courseId}`);
  },
  search: async (searchTerm: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  },
  create: async (eventData: CreateCalendarEventRequest): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post('/calendar-events', eventData);
  },
  update: async (id: number, eventData: UpdateCalendarEventRequest): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${id}`, eventData);
  },
  delete: async (id: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete(`/calendar-events/${id}`);
  },
  addAttendee: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post(`/calendar-events/${eventId}/attendees/${userId}`);
  },
  removeAttendee: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete(`/calendar-events/${eventId}/attendees/${userId}`);
  },
  addOrganizer: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post(`/calendar-events/${eventId}/organizers/${userId}`);
  },
  removeOrganizer: async (eventId: number, userId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete(`/calendar-events/${eventId}/organizers/${userId}`);
  },
  markAsOngoing: async (eventId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/status/ongoing`);
  },
  markAsCompleted: async (eventId: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/status/completed`);
  },
  cancel: async (eventId: number, reason: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/cancel?reason=${encodeURIComponent(reason)}`);
  },
  postpone: async (eventId: number, newStartTime: string, newEndTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/postpone?newStartTime=${newStartTime}&newEndTime=${newEndTime}`);
  },
  reschedule: async (eventId: number, newStartTime: string, newEndTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.put(`/calendar-events/${eventId}/reschedule?newStartTime=${newStartTime}&newEndTime=${newEndTime}`);
  },
  getPendingApproval: async (): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get('/calendar-events/pending-approval');
  },
  approve: async (eventId: number, approverId: number, approvalNotes?: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    const params = approvalNotes ? `&approvalNotes=${encodeURIComponent(approvalNotes)}` : '';
    return api.put(`/calendar-events/${eventId}/approve?approverId=${approverId}${params}`);
  },
  reject: async (eventId: number, approverId: number, rejectionNotes?: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    const params = rejectionNotes ? `&rejectionNotes=${encodeURIComponent(rejectionNotes)}` : '';
    return api.put(`/calendar-events/${eventId}/reject?approverId=${approverId}${params}`);
  },
  getCalendarView: async (userId: number, startDate: string, endDate: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/calendar-view/${userId}?startDate=${startDate}&endDate=${endDate}`);
  },
  getMonthEvents: async (userId: number, year: number, month: number): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/month/${userId}/${year}/${month}`);
  },
  findConflicts: async (eventId: number, location: string, startTime: string, endTime: string): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.get(`/calendar-events/${eventId}/conflicts?location=${encodeURIComponent(location)}&startTime=${startTime}&endTime=${endTime}`);
  },
  hasConflicts: async (eventId: number, location: string, startTime: string, endTime: string): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/calendar-events/${eventId}/has-conflicts?location=${encodeURIComponent(location)}&startTime=${startTime}&endTime=${endTime}`);
  },
  createBulk: async (events: CreateCalendarEventRequest[]): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.post('/calendar-events/bulk', events);
  },
  deleteBulk: async (eventIds: number[]): Promise<AxiosResponse<CalendarEventResponse>> => {
    return api.delete('/calendar-events/bulk', { data: eventIds });
  },
  exportCalendar: async (eventIds: number[]): Promise<AxiosResponse<{ data: string }>> => {
    return api.get(`/calendar-events/export?eventIds=${eventIds.join(',')}`);
  },
  exportUserCalendar: async (userId: number, startDate: string, endDate: string): Promise<AxiosResponse<{ data: string }>> => {
    return api.get(`/calendar-events/export/user/${userId}?startDate=${startDate}&endDate=${endDate}`);
  },
};

export default calendarEventApi;
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
const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, status, error } = useAppSelector(state => state.calendarEvents);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchCalendarEvents());
    return () => {
      dispatch(clearCalendarError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateEvent = () => {
    dispatch(openModal({
      title: 'Create New Event',
      bodyType: MODAL_BODY_TYPES.EVENT_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Events</h1>
          <p className="text-gray-600 mt-2">Manage and view school calendar events and activities</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Calendar Event Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/calendar/calendarEventsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const calendarEventsSlice = createSlice({
  name: 'calendarEvents',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearCalendarError: (state) => {
      state.error = null;
    },
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/calendarEventApi.ts
// src/api/services/eventAttendeeApi.ts
// src/api/services/eventOrganizerApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `CalendarPage.tsx` - Main calendar view with month/week/day views
- `EventDetailsPage.tsx` - View event details and manage attendees
- `CreateEventPage.tsx` - Create and edit calendar events
- `MyEventsPage.tsx` - Manage user's created and attending events
- `EventApprovalPage.tsx` - Approve/reject pending events

### 2. Calendar Views and Navigation
Multiple calendar view options:
- Monthly calendar grid view
- Weekly schedule view
- Daily agenda view
- List view with filtering
- Timeline view for events

### 3. Event Management System
Comprehensive event lifecycle management:
- Event creation with rich details
- Attendee and organizer management
- Event approval workflows
- Conflict detection and resolution
- Recurring event support

### 4. Event Participation
User engagement with events:
- Event registration and attendance
- RSVP functionality
- Attendance tracking
- Event reminders and notifications
- Calendar export capabilities

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateEvents = [
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

const canApproveEvents = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD'
].includes(userRole);

const canViewEvents = [
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
  EVENT_ADD_NEW: "EVENT_ADD_NEW",
  EVENT_EDIT: "EVENT_EDIT",
  EVENT_DETAILS: "EVENT_DETAILS",
  EVENT_ADD_ATTENDEE: "EVENT_ADD_ATTENDEE",
  EVENT_APPROVAL: "EVENT_APPROVAL",
  EVENT_CONFLICT_RESOLUTION: "EVENT_CONFLICT_RESOLUTION",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleEventCreation = async (eventData: CreateEventData) => {
  try {
    await dispatch(createCalendarEvent(eventData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create event:', error);
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
  data={events}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Calendar View Component
```typescript
// src/features/calendar/components/CalendarView.tsx
// Interactive calendar grid with event display
// Follow existing component patterns
```

### 2. Event Card Component
```typescript
// src/features/calendar/components/EventCard.tsx
// Display event information in card format
// Follow existing component structure
```

### 3. Event Form Component
```typescript
// src/features/calendar/components/EventForm.tsx
// Form for creating and editing events
// Follow existing form patterns
```

### 4. Event Conflict Checker Component
```typescript
// src/features/calendar/components/EventConflictChecker.tsx
// Check for scheduling conflicts
// Follow existing component patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include calendar routes:
```typescript
// Add to existing navigation items
{
  label: 'Calendar',
  icon: Calendar,
  submenu: [
    { label: 'Calendar View', path: '/app/calendar' },
    { label: 'My Events', path: '/app/calendar/my-events' },
    { label: 'Create Event', path: '/app/calendar/create' },
    { label: 'Upcoming Events', path: '/app/calendar/upcoming' },
    { label: 'Event Approval', path: '/app/calendar/approval' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/calendar" element={<CalendarPage />} />
<Route path="/calendar/events/:id" element={<EventDetailsPage />} />
<Route path="/calendar/create" element={<CreateEventPage />} />
<Route path="/calendar/my-events" element={<MyEventsPage />} />
<Route path="/calendar/approval" element={<EventApprovalPage />} />
<Route path="/calendar/upcoming" element={<UpcomingEventsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchCalendarEvents = createAsyncThunk(
  'calendarEvents/fetchCalendarEvents',
  async (params: CalendarEventFetchParams, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getDateRange(params.startTime, params.endTime);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar events');
    }
  }
);

export const createCalendarEvent = createAsyncThunk(
  'calendarEvents/createCalendarEvent',
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.create(eventData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const approveEvent = createAsyncThunk(
  'calendarEvents/approveEvent',
  async (approvalData: ApproveEventData, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.approve(
        approvalData.eventId, 
        approvalData.approverId, 
        approvalData.approvalNotes
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve event');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'list'>('month');
const [selectedDate, setSelectedDate] = useState(new Date());
const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
const [scopeFilter, setScopeFilter] = useState('');
const [showMyEventsOnly, setShowMyEventsOnly] = useState(false);
```

## Real-time Features

### 1. Live Calendar Updates
- Real-time event notifications
- Live attendance updates
- Instant event status changes
- Calendar synchronization

### 2. Conflict Detection
- Real-time conflict checking
- Automatic conflict resolution suggestions
- Resource availability tracking
- Schedule optimization

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Calendar Security Features
```typescript
// Implement event access control
const canViewEvent = (event: CalendarEvent, user: User) => {
  // Check event scope and visibility
  switch (event.scope) {
    case 'GLOBAL':
      return true;
    case 'REGIONAL':
      return user.regionId === event.regionId;
    case 'SCHOOL':
      return user.schoolId === event.schoolId;
    case 'CLASS':
      return user.classId === event.classId;
    case 'COURSE':
      return user.courseId === event.courseId;
    case 'PRIVATE':
      return event.createdById === user.id || event.attendees?.includes(user.id);
    default:
      return false;
  }
};

// Implement event management permissions
const canManageEvent = (event: CalendarEvent, user: User) => {
  // Creator can always manage their events
  if (event.createdById === user.id) return true;
  
  // Role-based management permissions
  const managerRoles = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN'];
  return managerRoles.includes(user.role);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Calendar-Specific Optimizations
- Efficient calendar rendering
- Smart event loading by date range
- Optimized conflict detection
- Calendar view caching

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Calendar-Specific Testing
- Test calendar view rendering
- Test event creation workflow
- Test conflict detection
- Test approval workflows

## Deliverables

1. **New Redux Slices**: `calendarEventsSlice.ts`, `eventAttendeesSlice.ts`, `eventOrganizersSlice.ts`
2. **New API Services**: `calendarEventApi.ts`, `eventAttendeeApi.ts`, `eventOrganizerApi.ts`
3. **New Pages**: Calendar views, event management, and approval pages
4. **New Components**: Calendar-specific reusable components
5. **Enhanced Existing Pages**: Integration with dashboard and scheduling
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Calendar event-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Calendar views rendering correctly
- Event creation and management functioning properly
- Approval workflows working as expected
- Conflict detection functioning correctly
- Responsive design consistent with existing pages
- Calendar security measures properly implemented

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
11. **DO** implement proper event validation
12. **DO** ensure calendar performance is optimized
13. **DO** implement comprehensive conflict detection
14. **DO** optimize for large numbers of events

This implementation should seamlessly integrate with the existing codebase while providing comprehensive calendar event management capabilities for all user roles in the educational system. 