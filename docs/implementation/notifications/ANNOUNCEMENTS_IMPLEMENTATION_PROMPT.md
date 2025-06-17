# Frontend Implementation Prompt: Announcements System

## Overview
Implement a comprehensive frontend interface for the announcements system targeting all educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    announcements: announcementsReducer,  // TO BE CREATED
    announcementReadReceipts: announcementReadReceiptsReducer,  // TO BE CREATED
    announcementAcknowledgments: announcementAcknowledgmentsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/announcements/
├── pages/
│   ├── AnnouncementListPage.tsx
│   ├── AnnouncementDetailsPage.tsx
│   ├── CreateAnnouncementPage.tsx
│   ├── MyAnnouncementsPage.tsx
│   └── AnnouncementAnalyticsPage.tsx
├── components/
│   ├── AnnouncementCard.tsx
│   ├── AnnouncementEditor.tsx
│   ├── AnnouncementFilters.tsx
│   ├── AnnouncementPreview.tsx
│   ├── ReadReceiptsList.tsx
│   └── AcknowledgmentsList.tsx
├── modals/
│   ├── CreateAnnouncementModal.tsx
│   ├── EditAnnouncementModal.tsx
│   ├── AnnouncementDetailsModal.tsx
│   ├── AcknowledgeAnnouncementModal.tsx
│   └── DeleteAnnouncementModal.tsx
├── announcementsSlice.ts
├── announcementReadReceiptsSlice.ts
├── announcementAcknowledgmentsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/announcementApi.ts
// src/api/services/announcementReadReceiptApi.ts
// src/api/services/announcementAcknowledgmentApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface AnnouncementResponse {
  status: string;
  message: string;
  data: Announcement | Announcement[] | null;
  timestamp: string | null;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'GENERAL' | 'URGENT' | 'ACADEMIC' | 'ADMINISTRATIVE' | 'EVENT' | 'POLICY' | 'EMERGENCY';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS' | 'STAFF' | 'ADMINS' | 'CUSTOM';
  visibility: 'PUBLIC' | 'SCHOOL_ONLY' | 'REGION_ONLY' | 'MINISTRY_ONLY' | 'PRIVATE';
  createdById: number;
  schoolId?: number;
  regionId?: number;
  classId?: number;
  courseId?: number;
  departmentId?: number;
  publishedAt?: string;
  expiresAt?: string;
  isPublished: boolean;
  requiresAcknowledgment: boolean;
  allowComments: boolean;
  isPinned: boolean;
  tags?: string;
  attachments?: string;
  viewCount: number;
  readCount: number;
  acknowledgmentCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementReadReceipt {
  id: number;
  announcementId: number;
  userId: number;
  readAt: string;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
}

export interface AnnouncementAcknowledgment {
  id: number;
  announcementId: number;
  userId: number;
  acknowledgedAt: string;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
  active: boolean;
  createdAt: string;
}

const announcementApi = {
  getAll: async (): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get('/announcements');
  },
  getById: async (id: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/${id}`);
  },
  getForUser: async (userId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}?page=${page}&size=${size}`);
  },
  getByType: async (userId: number, type: string, page: number = 0, size: number = 20): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}/type/${type}?page=${page}&size=${size}`);
  },
  getByCreator: async (creatorId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/creator/${creatorId}?page=${page}&size=${size}`);
  },
  getGlobal: async (page: number = 0, size: number = 20): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/global?page=${page}&size=${size}`);
  },
  search: async (userId: number, searchTerm: string, page: number = 0, size: number = 20): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  },
  getByTag: async (userId: number, tag: string, page: number = 0, size: number = 20): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.get(`/announcements/user/${userId}/tag/${tag}?page=${page}&size=${size}`);
  },
  create: async (creatorId: number, announcementData: CreateAnnouncementRequest): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.post(`/announcements/create/${creatorId}`, announcementData);
  },
  update: async (id: number, userId: number, announcementData: UpdateAnnouncementRequest): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.put(`/announcements/${id}/update/${userId}`, announcementData);
  },
  delete: async (id: number, userId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.delete(`/announcements/${id}/delete/${userId}`);
  },
  markAsRead: async (announcementId: number, userId: number): Promise<AxiosResponse<any>> => {
    return api.post(`/announcements/${announcementId}/read/${userId}`);
  },
  acknowledge: async (announcementId: number, userId: number, note?: string): Promise<AxiosResponse<any>> => {
    const params = note ? `?note=${encodeURIComponent(note)}` : '';
    return api.post(`/announcements/${announcementId}/acknowledge/${userId}${params}`);
  },
  getPendingAcknowledgmentsCount: async (userId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/announcements/user/${userId}/pending-acknowledgments/count`);
  },
  getReadReceipts: async (announcementId: number, requesterId: number): Promise<AxiosResponse<any>> => {
    return api.get(`/announcements/${announcementId}/read-receipts/${requesterId}`);
  },
  getAcknowledgments: async (announcementId: number, requesterId: number): Promise<AxiosResponse<any>> => {
    return api.get(`/announcements/${announcementId}/acknowledgments/${requesterId}`);
  },
  toggleStatus: async (id: number, userId: number): Promise<AxiosResponse<AnnouncementResponse>> => {
    return api.put(`/announcements/${id}/toggle-status/${userId}`);
  },
};

export default announcementApi;
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
const AnnouncementListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { announcements, status, error } = useAppSelector(state => state.announcements);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchAnnouncements());
    return () => {
      dispatch(clearAnnouncementsError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateAnnouncement = () => {
    dispatch(openModal({
      title: 'Create New Announcement',
      bodyType: MODAL_BODY_TYPES.ANNOUNCEMENT_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Stay informed with important updates and communications</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Announcement Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/announcements/announcementsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearCurrentAnnouncement: (state) => {
      state.currentAnnouncement = null;
    },
    clearAnnouncementsError: (state) => {
      state.error = null;
    },
    setAnnouncementFilter: (state, action) => {
      state.filter = action.payload;
    },
    markAsRead: (state, action) => {
      const announcement = state.announcements.find(a => a.id === action.payload);
      if (announcement) {
        announcement.readCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/announcementApi.ts
// src/api/services/announcementReadReceiptApi.ts
// src/api/services/announcementAcknowledgmentApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `AnnouncementListPage.tsx` - View all announcements with filtering
- `AnnouncementDetailsPage.tsx` - View announcement details and interactions
- `CreateAnnouncementPage.tsx` - Create and edit announcements
- `MyAnnouncementsPage.tsx` - Manage user's created announcements
- `AnnouncementAnalyticsPage.tsx` - View announcement engagement analytics

### 2. Announcement Creation and Management
Comprehensive announcement lifecycle management:
- Rich text announcement editor
- Target audience selection
- Priority and type classification
- Scheduling and expiration
- Attachment support

### 3. Engagement Tracking
Track announcement interaction and engagement:
- Read receipts tracking
- Acknowledgment management
- View count analytics
- Engagement statistics
- Response tracking

### 4. Notification Integration
Seamless notification system integration:
- Real-time announcement notifications
- Push notification support
- Email notification integration
- Mobile app notifications
- Notification preferences

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateAnnouncements = [
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

const canViewAnnouncements = [
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
  ANNOUNCEMENT_ADD_NEW: "ANNOUNCEMENT_ADD_NEW",
  ANNOUNCEMENT_EDIT: "ANNOUNCEMENT_EDIT",
  ANNOUNCEMENT_DETAILS: "ANNOUNCEMENT_DETAILS",
  ANNOUNCEMENT_ACKNOWLEDGE: "ANNOUNCEMENT_ACKNOWLEDGE",
  ANNOUNCEMENT_DELETE_CONFIRMATION: "ANNOUNCEMENT_DELETE_CONFIRMATION",
  ANNOUNCEMENT_SCHEDULE: "ANNOUNCEMENT_SCHEDULE",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleAnnouncementCreation = async (announcementData: CreateAnnouncementData) => {
  try {
    await dispatch(createAnnouncement(announcementData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create announcement:', error);
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
  data={announcements}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Announcement Card Component
```typescript
// src/features/announcements/components/AnnouncementCard.tsx
// Use existing card styling patterns
// Follow existing component structure
```

### 2. Announcement Editor Component
```typescript
// src/features/announcements/components/AnnouncementEditor.tsx
// Rich text editor for announcement creation
// Follow existing form patterns
```

### 3. Announcement Filters Component
```typescript
// src/features/announcements/components/AnnouncementFilters.tsx
// Filter announcements by type, priority, etc.
// Follow existing component patterns
```

### 4. Read Receipts List Component
```typescript
// src/features/announcements/components/ReadReceiptsList.tsx
// Display who has read the announcement
// Follow existing component structure
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include announcement routes:
```typescript
// Add to existing navigation items
{
  label: 'Announcements',
  icon: Megaphone,
  submenu: [
    { label: 'All Announcements', path: '/app/announcements' },
    { label: 'My Announcements', path: '/app/announcements/my' },
    { label: 'Create Announcement', path: '/app/announcements/create' },
    { label: 'Urgent', path: '/app/announcements/urgent' },
    { label: 'Analytics', path: '/app/announcements/analytics' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/announcements" element={<AnnouncementListPage />} />
<Route path="/announcements/:id" element={<AnnouncementDetailsPage />} />
<Route path="/announcements/create" element={<CreateAnnouncementPage />} />
<Route path="/announcements/my" element={<MyAnnouncementsPage />} />
<Route path="/announcements/analytics" element={<AnnouncementAnalyticsPage />} />
<Route path="/announcements/urgent" element={<UrgentAnnouncementsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getForUser(userId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (announcementData: CreateAnnouncementData, { rejectWithValue }) => {
    try {
      const response = await announcementApi.create(announcementData.creatorId, announcementData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create announcement');
    }
  }
);

export const acknowledgeAnnouncement = createAsyncThunk(
  'announcements/acknowledgeAnnouncement',
  async (acknowledgeData: AcknowledgeAnnouncementData, { rejectWithValue }) => {
    try {
      const response = await announcementApi.acknowledge(
        acknowledgeData.announcementId, 
        acknowledgeData.userId, 
        acknowledgeData.note
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to acknowledge announcement');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [typeFilter, setTypeFilter] = useState('ALL');
const [priorityFilter, setPriorityFilter] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [showUnreadOnly, setShowUnreadOnly] = useState(false);
const [selectedAnnouncements, setSelectedAnnouncements] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Announcement Updates
- Real-time announcement notifications
- Live read receipt updates
- Instant acknowledgment tracking
- Push notification integration

### 2. Engagement Analytics
- Real-time view count updates
- Live engagement metrics
- Response rate tracking
- Audience reach analytics

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Announcement Security Features
```typescript
// Implement announcement access control
const canViewAnnouncement = (announcement: Announcement, user: User) => {
  // Check visibility settings
  switch (announcement.visibility) {
    case 'PUBLIC':
      return true;
    case 'SCHOOL_ONLY':
      return user.schoolId === announcement.schoolId;
    case 'REGION_ONLY':
      return user.regionId === announcement.regionId;
    case 'MINISTRY_ONLY':
      return ['MINISTRY_STAFF', 'MINISTRY_EXECUTIVE', 'SUPER_ADMIN'].includes(user.role);
    case 'PRIVATE':
      return announcement.createdById === user.id;
    default:
      return false;
  }
};

// Implement announcement management permissions
const canManageAnnouncement = (announcement: Announcement, user: User) => {
  // Creator can always manage their announcements
  if (announcement.createdById === user.id) return true;
  
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

### 2. Announcement-Specific Optimizations
- Lazy load announcement content
- Cache frequently accessed announcements
- Optimize image and attachment loading
- Implement efficient search and filtering

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Announcement-Specific Testing
- Test announcement creation workflow
- Test read receipt functionality
- Test acknowledgment system
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `announcementsSlice.ts`, `announcementReadReceiptsSlice.ts`, `announcementAcknowledgmentsSlice.ts`
2. **New API Services**: `announcementApi.ts`, `announcementReadReceiptApi.ts`, `announcementAcknowledgmentApi.ts`
3. **New Pages**: Announcement listing, creation, management, and analytics pages
4. **New Components**: Announcement-specific reusable components
5. **Enhanced Existing Pages**: Integration with dashboard and notification systems
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Announcement-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Announcement creation and management functioning properly
- Read receipt and acknowledgment systems working correctly
- Real-time notifications functioning as expected
- Responsive design consistent with existing pages
- Announcement security measures properly implemented

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
11. **DO** implement proper announcement validation
12. **DO** ensure real-time updates work reliably
13. **DO** implement comprehensive engagement tracking
14. **DO** optimize for high-volume announcement scenarios

This implementation should seamlessly integrate with the existing codebase while providing comprehensive announcement management capabilities for all user roles in the educational system. 