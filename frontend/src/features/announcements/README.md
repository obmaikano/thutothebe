# Announcements Feature

This feature provides a comprehensive announcements system for the educational platform, supporting all user roles with appropriate permissions and functionality.

## Overview

The announcements system allows authorized users to create, manage, and distribute announcements to targeted audiences within the educational institution. It includes features like read receipts, acknowledgments, filtering, search, and role-based access control.

## Features

### Core Functionality
- **Create Announcements**: Authorized users can create announcements with various types and priorities
- **View Announcements**: All users can view announcements targeted to them
- **Read Tracking**: System tracks when users read announcements
- **Acknowledgments**: Optional acknowledgment system for important announcements
- **Comments**: Optional commenting system (placeholder for future implementation)
- **Attachments**: Support for file attachments (placeholder for future implementation)

### Filtering & Search
- Filter by announcement type (Academic, Administrative, Event, etc.)
- Filter by priority (Low, Normal, High, Urgent)
- Filter by read status (read/unread)
- Search announcements by content
- Filter by tags

### Role-Based Access
- **Creators**: SUPER_ADMIN, MINISTRY_EXECUTIVE, MINISTRY_STAFF, DIRECTOR, REGIONAL_ADMIN, REGIONAL_OFFICER, SCHOOL_ADMIN, SCHOOL_HEAD, DEPARTMENT_HEAD, SENIOR_TEACHER, TEACHER
- **Viewers**: All roles including STUDENT and PARENT
- **Management**: Creators can manage their own announcements

## File Structure

```
frontend/src/features/announcements/
├── README.md                           # This documentation
├── index.tsx                          # Feature exports
├── announcementsSlice.ts              # Redux state management
└── modals/
    ├── CreateAnnouncementModal.tsx    # Create announcement modal
    └── AnnouncementDetailsModal.tsx   # View announcement details modal
```

## API Integration

The feature integrates with the backend API through:
- `frontend/src/api/services/announcementApi.ts` - API service layer
- Full CRUD operations
- Pagination support
- Search and filtering
- Read receipt tracking
- Acknowledgment management

## Pages

### Announcements Page (`/announcements`)
- Main announcements listing for all users
- Filtering and search functionality
- Read/acknowledge actions
- Role-based create button for authorized users

### My Announcements Page (`/my-announcements`)
- Management interface for created announcements
- Analytics and engagement metrics
- Edit, delete, activate/deactivate actions
- Only accessible to users with creation permissions

## State Management

The feature uses Redux Toolkit for state management with the following structure:

```typescript
interface AnnouncementsState {
  announcements: Announcement[];
  myAnnouncements: Announcement[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: PaginationInfo | null;
  pendingAcknowledgmentsCount: number;
  filter: AnnouncementFilterState;
}
```

### Available Actions
- `fetchAnnouncementsForUser` - Get announcements for a user
- `fetchAnnouncementsByCreator` - Get announcements created by a user
- `createAnnouncement` - Create new announcement
- `updateAnnouncement` - Update existing announcement
- `deleteAnnouncement` - Delete announcement
- `markAnnouncementAsRead` - Mark as read
- `acknowledgeAnnouncement` - Acknowledge announcement
- `toggleAnnouncementStatus` - Activate/deactivate announcement
- `fetchPendingAcknowledgmentsCount` - Get pending acknowledgments count

## Modal System Integration

The feature integrates with the global modal system using:

### Modal Types
- `ANNOUNCEMENT_ADD_NEW` - Create announcement modal
- `ANNOUNCEMENT_VIEW_DETAILS` - View announcement details
- `ANNOUNCEMENT_EDIT` - Edit announcement (placeholder)
- `ANNOUNCEMENT_DELETE_CONFIRMATION` - Delete confirmation
- `ANNOUNCEMENT_ANALYTICS` - Analytics view (placeholder)

### Usage Example
```typescript
import { openModal } from '../../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../../utils/modalConstants';

// Open create modal
dispatch(openModal({
  title: 'Create New Announcement',
  bodyType: MODAL_BODY_TYPES.ANNOUNCEMENT_ADD_NEW,
  size: 'lg'
}));

// Open details modal
dispatch(openModal({
  title: announcement.title,
  bodyType: MODAL_BODY_TYPES.ANNOUNCEMENT_VIEW_DETAILS,
  size: 'lg',
  extraObject: announcement
}));
```

## Navigation Integration

The feature is integrated into the role-based sidebar navigation:

### Menu Items
- **Announcements** - View announcements (all roles)
- **My Announcements** - Manage announcements (creators only)

### Role-Based Visibility
- Students and Parents: View-only access to announcements
- Teachers and Staff: View announcements + create/manage own
- Administrators: Full access to all announcement features

## Styling & UI

The feature uses:
- **DaisyUI** components for consistent styling
- **Tailwind CSS** for custom styling
- **Lucide React** icons for visual elements
- **Responsive design** for mobile and desktop

### Key UI Components
- Announcement cards with priority/type indicators
- Filter and search controls
- Pagination controls
- Action buttons with role-based visibility
- Status indicators (read, acknowledged, expired)

## Future Enhancements

### Planned Features
- **Edit Announcements**: Full edit functionality for created announcements
- **Analytics Dashboard**: Detailed engagement analytics
- **Comment System**: User comments on announcements
- **File Attachments**: Upload and manage announcement attachments
- **Email Notifications**: Email alerts for important announcements
- **Scheduled Publishing**: Schedule announcements for future publication
- **Templates**: Reusable announcement templates
- **Bulk Operations**: Bulk actions for announcement management

### Technical Improvements
- Real-time updates using WebSocket
- Offline support with service workers
- Advanced search with filters
- Export functionality for analytics
- Announcement archiving system

## Testing

The feature includes:
- Component unit tests (to be implemented)
- Integration tests for API calls (to be implemented)
- E2E tests for user workflows (to be implemented)

## Performance Considerations

- Lazy loading of modal components
- Pagination for large announcement lists
- Optimistic updates for read/acknowledge actions
- Efficient state management with Redux Toolkit
- Memoized components to prevent unnecessary re-renders

## Security

- Role-based access control enforced at UI and API levels
- Input validation and sanitization
- XSS protection for announcement content
- CSRF protection for state-changing operations
- Audit trail for announcement actions 