# Frontend Implementation Prompt: Notifications System

## Overview
Implement a comprehensive frontend interface for the notifications system targeting all educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    notifications: notificationsReducer,  // TO BE CREATED
    notificationSettings: notificationSettingsReducer,  // TO BE CREATED
    notificationHistory: notificationHistoryReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/notifications/
├── pages/
│   ├── NotificationsPage.tsx
│   ├── NotificationDetailsPage.tsx
│   ├── NotificationSettingsPage.tsx
│   └── NotificationHistoryPage.tsx
├── components/
│   ├── NotificationList.tsx
│   ├── NotificationCard.tsx
│   ├── NotificationBell.tsx
│   ├── NotificationDropdown.tsx
│   ├── NotificationFilters.tsx
│   └── NotificationPreferences.tsx
├── modals/
│   ├── NotificationDetailsModal.tsx
│   ├── NotificationSettingsModal.tsx
│   └── MarkAllReadModal.tsx
├── notificationsSlice.ts
├── notificationSettingsSlice.ts
├── notificationHistorySlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/notificationApi.ts
// src/api/services/notificationSettingsApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface NotificationResponse {
  status: string;
  message: string;
  data: Notification | Notification[] | null;
  timestamp: string | null;
}

export interface Notification {
  id: number;
  recipientId: number;
  senderId?: number;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'GRADE' | 'MESSAGE' | 'CALENDAR' | 'SYSTEM' | 'REMINDER' | 'ALERT' | 'APPROVAL' | 'DEADLINE';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category: 'ACADEMIC' | 'ADMINISTRATIVE' | 'SOCIAL' | 'TECHNICAL' | 'PERSONAL';
  entityType?: string;
  entityId?: number;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  metadata?: string;
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  expiresAt?: string;
  scheduledFor?: string;
  deliveryMethod: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH' | 'ALL';
  deliveryStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  deliveredAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  groupId?: string;
  batchId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  id: number;
  userId: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    announcements: boolean;
    assignments: boolean;
    grades: boolean;
    messages: boolean;
    calendar: boolean;
    system: boolean;
    reminders: boolean;
    alerts: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  digestEnabled: boolean;
  digestTime: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const notificationApi = {
  getAll: async (): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get('/notifications');
  },
  getById: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/${id}`);
  },
  getByRecipient: async (recipientId: number, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}?page=${page}&size=${size}`);
  },
  getByRecipientAndActive: async (recipientId: number, active: boolean = true, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/active?active=${active}&page=${page}&size=${size}`);
  },
  getByRecipientAndType: async (recipientId: number, type: string, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/type/${type}?page=${page}&size=${size}`);
  },
  getByRecipientAndTypeAndActive: async (recipientId: number, type: string, active: boolean = true, page: number = 0, size: number = 20): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/type/${type}/active?active=${active}&page=${page}&size=${size}`);
  },
  getUnreadByRecipient: async (recipientId: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.get(`/notifications/recipient/${recipientId}/unread`);
  },
  getUnreadCountByRecipient: async (recipientId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/notifications/recipient/${recipientId}/unread/count`);
  },
  create: async (notificationData: CreateNotificationRequest): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post('/notifications', notificationData);
  },
  update: async (id: number, notificationData: UpdateNotificationRequest): Promise<AxiosResponse<NotificationResponse>> => {
    return api.put(`/notifications/${id}`, notificationData);
  },
  markAsRead: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post(`/notifications/${id}/mark-read`);
  },
  markAllAsRead: async (recipientId: number): Promise<AxiosResponse<void>> => {
    return api.post(`/notifications/recipient/${recipientId}/mark-all-read`);
  },
  archive: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post(`/notifications/${id}/archive`);
  },
  unarchive: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.post(`/notifications/${id}/unarchive`);
  },
  delete: async (id: number): Promise<AxiosResponse<NotificationResponse>> => {
    return api.delete(`/notifications/${id}`);
  },
  bulkMarkAsRead: async (notificationIds: number[]): Promise<AxiosResponse<void>> => {
    return api.post('/notifications/bulk/mark-read', { notificationIds });
  },
  bulkArchive: async (notificationIds: number[]): Promise<AxiosResponse<void>> => {
    return api.post('/notifications/bulk/archive', { notificationIds });
  },
  bulkDelete: async (notificationIds: number[]): Promise<AxiosResponse<void>> => {
    return api.delete('/notifications/bulk', { data: { notificationIds } });
  },
};

const notificationSettingsApi = {
  getByUser: async (userId: number): Promise<AxiosResponse<{ data: NotificationSettings }>> => {
    return api.get(`/notification-settings/user/${userId}`);
  },
  update: async (userId: number, settings: UpdateNotificationSettingsRequest): Promise<AxiosResponse<{ data: NotificationSettings }>> => {
    return api.put(`/notification-settings/user/${userId}`, settings);
  },
  reset: async (userId: number): Promise<AxiosResponse<{ data: NotificationSettings }>> => {
    return api.post(`/notification-settings/user/${userId}/reset`);
  },
};

export default { notificationApi, notificationSettingsApi };
```

## Core Features to Implement

### 1. Notification Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/notifications/notificationsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotification: (state) => {
      state.currentNotification = null;
    },
    clearNotificationsError: (state) => {
      state.error = null;
    },
    setNotificationFilter: (state, action) => {
      state.filter = action.payload;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `NotificationsPage.tsx` - View and manage all notifications
- `NotificationDetailsPage.tsx` - View notification details
- `NotificationSettingsPage.tsx` - Manage notification preferences
- `NotificationHistoryPage.tsx` - View notification history

### 2. Real-time Notification System
Live notification delivery:
- Real-time notification updates
- Push notification support
- In-app notification bell
- Notification dropdown
- Sound and visual alerts

### 3. Notification Management
Comprehensive notification handling:
- Mark as read/unread
- Archive notifications
- Bulk operations
- Notification filtering
- Search functionality

### 4. Notification Settings
User preference management:
- Notification type preferences
- Delivery method settings
- Quiet hours configuration
- Digest settings
- Frequency controls

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canSendNotifications = [
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

const canReceiveNotifications = [
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

const canManageNotifications = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  NOTIFICATION_DETAILS: "NOTIFICATION_DETAILS",
  NOTIFICATION_SETTINGS: "NOTIFICATION_SETTINGS",
  NOTIFICATION_MARK_ALL_READ: "NOTIFICATION_MARK_ALL_READ",
  NOTIFICATION_BULK_ACTION: "NOTIFICATION_BULK_ACTION",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleMarkAsRead = async (notificationId: number) => {
  try {
    await dispatch(markNotificationAsRead(notificationId)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
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
  data={notifications}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Notification Bell Component
```typescript
// src/features/notifications/components/NotificationBell.tsx
// Bell icon with unread count badge
// Follow existing component patterns
```

### 2. Notification Dropdown Component
```typescript
// src/features/notifications/components/NotificationDropdown.tsx
// Dropdown showing recent notifications
// Follow existing component patterns
```

### 3. Notification Card Component
```typescript
// src/features/notifications/components/NotificationCard.tsx
// Individual notification display
// Follow existing component structure
```

### 4. Notification Preferences Component
```typescript
// src/features/notifications/components/NotificationPreferences.tsx
// Settings for notification preferences
// Follow existing form patterns
```

## Navigation Integration

### 1. Extend Existing Header
Update header component to include notification bell:
```typescript
// Add notification bell to existing header
<NotificationBell />
```

### 2. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include notification routes:
```typescript
// Add to existing navigation items
{
  label: 'Notifications',
  icon: Bell,
  submenu: [
    { label: 'All Notifications', path: '/app/notifications' },
    { label: 'Unread', path: '/app/notifications/unread' },
    { label: 'Settings', path: '/app/notifications/settings' },
    { label: 'History', path: '/app/notifications/history' }
  ]
}
```

### 3. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/notifications" element={<NotificationsPage />} />
<Route path="/notifications/:id" element={<NotificationDetailsPage />} />
<Route path="/notifications/unread" element={<UnreadNotificationsPage />} />
<Route path="/notifications/settings" element={<NotificationSettingsPage />} />
<Route path="/notifications/history" element={<NotificationHistoryPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: NotificationFetchParams, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getByRecipient(params.recipientId, params.page, params.size);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCountByRecipient(recipientId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [notificationTypeFilter, setNotificationTypeFilter] = useState('ALL');
const [priorityFilter, setPriorityFilter] = useState('');
const [showUnreadOnly, setShowUnreadOnly] = useState(false);
const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
```

## Real-time Features

### 1. Live Notification Updates
- WebSocket connection for real-time notifications
- Instant notification delivery
- Real-time unread count updates
- Live notification status changes

### 2. Push Notifications
- Browser push notification support
- Service worker integration
- Notification permission handling
- Background notification processing

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Notification Security Features
```typescript
// Implement notification access control
const canViewNotification = (notification: Notification, user: User) => {
  // Users can only view their own notifications
  return notification.recipientId === user.id;
};

// Implement notification sending permissions
const canSendNotificationToUser = (targetUser: User, currentUser: User) => {
  // System admins can send to anyone
  const systemAdmins = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'];
  if (systemAdmins.includes(currentUser.role)) return true;
  
  // Regional admins can send to users in their region
  if (currentUser.role === 'REGIONAL_ADMIN' && targetUser.regionId === currentUser.regionId) {
    return true;
  }
  
  // School admins can send to users in their school
  if (['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(currentUser.role) && targetUser.schoolId === currentUser.schoolId) {
    return true;
  }
  
  // Teachers can send to their students
  if (['TEACHER', 'SENIOR_TEACHER'].includes(currentUser.role) && targetUser.role === 'STUDENT') {
    return true; // Implement course enrollment check
  }
  
  return false;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Notification-Specific Optimizations
- Efficient notification polling
- Smart notification caching
- Optimized real-time updates
- Notification pagination

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Notification-Specific Testing
- Test real-time notification delivery
- Test notification preferences
- Test bulk operations
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `notificationsSlice.ts`, `notificationSettingsSlice.ts`, `notificationHistorySlice.ts`
2. **New API Services**: `notificationApi.ts`, `notificationSettingsApi.ts`
3. **New Pages**: Notification management and settings pages
4. **New Components**: Notification-specific reusable components
5. **Enhanced Existing Pages**: Integration with header and navigation
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Notification-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time notifications functioning properly
- Notification preferences working correctly
- Bulk operations functioning as expected
- Push notifications working reliably
- Responsive design consistent with existing pages
- Notification security measures properly implemented

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
11. **DO** implement proper notification validation
12. **DO** ensure real-time updates work reliably
13. **DO** implement comprehensive notification tracking
14. **DO** optimize for high-volume notifications

This implementation should seamlessly integrate with the existing codebase while providing comprehensive notification management capabilities for all user roles in the educational system. 