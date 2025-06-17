# Frontend Implementation Prompt: Forum and Discussion System

## Overview
Implement a comprehensive frontend interface for the forum and discussion system targeting all educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    forums: forumsReducer,  // TO BE CREATED
    threads: threadsReducer,  // TO BE CREATED
    comments: commentsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/forums/
├── pages/
│   ├── ForumListPage.tsx
│   ├── ForumDetailsPage.tsx
│   ├── ThreadDetailsPage.tsx
│   ├── CreateThreadPage.tsx
│   └── ForumModerationPage.tsx
├── components/
│   ├── ForumCard.tsx
│   ├── ThreadCard.tsx
│   ├── CommentCard.tsx
│   ├── ThreadEditor.tsx
│   ├── CommentEditor.tsx
│   ├── ForumSearch.tsx
│   └── ForumStatistics.tsx
├── modals/
│   ├── CreateForumModal.tsx
│   ├── EditForumModal.tsx
│   ├── CreateThreadModal.tsx
│   ├── EditThreadModal.tsx
│   ├── DeleteConfirmationModal.tsx
│   └── ReportContentModal.tsx
├── forumsSlice.ts
├── threadsSlice.ts
├── commentsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/forumApi.ts
// src/api/services/threadApi.ts
// src/api/services/commentApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface ForumResponse {
  status: string;
  message: string;
  data: Forum | Forum[] | null;
  timestamp: string | null;
}

export interface Forum {
  id: number;
  title: string;
  description: string;
  category: 'GENERAL' | 'ACADEMIC' | 'ANNOUNCEMENTS' | 'SUPPORT' | 'SOCIAL' | 'TECHNICAL';
  visibility: 'PUBLIC' | 'SCHOOL_ONLY' | 'REGION_ONLY' | 'MINISTRY_ONLY' | 'PRIVATE';
  createdById: number;
  schoolId?: number;
  regionId?: number;
  courseId?: number;
  classId?: number;
  threadCount: number;
  postCount: number;
  lastActivityAt?: string;
  isModerated: boolean;
  allowAnonymous: boolean;
  requiresApproval: boolean;
  isArchived: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: number;
  title: string;
  content: string;
  forumId: number;
  authorId: number;
  isPinned: boolean;
  isLocked: boolean;
  isAnnouncement: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt?: string;
  lastReplyById?: number;
  tags?: string;
  isApproved: boolean;
  moderatedById?: number;
  moderatedAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  threadId: number;
  authorId: number;
  parentCommentId?: number;
  isApproved: boolean;
  moderatedById?: number;
  moderatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  isEdited: boolean;
  editedAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const forumApi = {
  getAll: async (): Promise<AxiosResponse<ForumResponse>> => {
    return api.get('/api/forums');
  },
  getById: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/${id}`);
  },
  getByCategory: async (category: string): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/category/${category}`);
  },
  getBySchool: async (schoolId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/school/${schoolId}`);
  },
  getByRegion: async (regionId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/region/${regionId}`);
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/course/${courseId}`);
  },
  getByClass: async (classId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/class/${classId}`);
  },
  getPublic: async (): Promise<AxiosResponse<ForumResponse>> => {
    return api.get('/api/forums/public');
  },
  getAccessibleByUser: async (userId: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.get(`/api/forums/user/${userId}/accessible`);
  },
  create: async (forumData: CreateForumRequest): Promise<AxiosResponse<ForumResponse>> => {
    return api.post('/api/forums', forumData);
  },
  update: async (id: number, forumData: UpdateForumRequest): Promise<AxiosResponse<ForumResponse>> => {
    return api.put(`/api/forums/${id}`, forumData);
  },
  delete: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.delete(`/api/forums/${id}`);
  },
  archive: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.put(`/api/forums/${id}/archive`);
  },
  unarchive: async (id: number): Promise<AxiosResponse<ForumResponse>> => {
    return api.put(`/api/forums/${id}/unarchive`);
  },
};

export default forumApi;
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
const ForumListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { forums, status, error } = useAppSelector(state => state.forums);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchForums());
    return () => {
      dispatch(clearForumsError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateForum = () => {
    dispatch(openModal({
      title: 'Create New Forum',
      bodyType: MODAL_BODY_TYPES.FORUM_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
          <p className="text-gray-600 mt-2">Engage in educational discussions and community conversations</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Forum Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/forums/forumsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const forumsSlice = createSlice({
  name: 'forums',
  initialState,
  reducers: {
    clearCurrentForum: (state) => {
      state.currentForum = null;
    },
    clearForumsError: (state) => {
      state.error = null;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/forumApi.ts
// src/api/services/threadApi.ts
// src/api/services/commentApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `ForumListPage.tsx` - List all accessible forums with categories
- `ForumDetailsPage.tsx` - View forum details and threads
- `ThreadDetailsPage.tsx` - View thread with comments and replies
- `CreateThreadPage.tsx` - Create new discussion threads
- `ForumModerationPage.tsx` - Moderation tools for administrators

### 2. Thread and Discussion Management
Comprehensive discussion thread functionality:
- Thread creation with rich text editor
- Thread categorization and tagging
- Pinned and announcement threads
- Thread locking and moderation
- View count tracking

### 3. Comment and Reply System
Nested comment functionality:
- Threaded comment replies
- Comment editing and deletion
- Like/dislike voting system
- Comment moderation
- Real-time comment updates

### 4. Forum Moderation Tools
Administrative controls for content management:
- Content approval workflows
- User reporting system
- Bulk moderation actions
- Content filtering
- User ban/suspension management

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateForums = [
  'SCHOOL_ADMIN', 
  'REGIONAL_ADMIN',
  'MINISTRY_STAFF',
  'SUPER_ADMIN'
].includes(userRole);

const canModerateForums = [
  'TEACHER',
  'SCHOOL_ADMIN', 
  'REGIONAL_ADMIN',
  'MINISTRY_STAFF',
  'SUPER_ADMIN'
].includes(userRole);

const canParticipateInForums = [
  'STUDENT',
  'PARENT',
  'TEACHER',
  'SCHOOL_ADMIN', 
  'REGIONAL_ADMIN',
  'MINISTRY_STAFF',
  'SUPER_ADMIN'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  FORUM_ADD_NEW: "FORUM_ADD_NEW",
  FORUM_EDIT: "FORUM_EDIT",
  THREAD_ADD_NEW: "THREAD_ADD_NEW",
  THREAD_EDIT: "THREAD_EDIT",
  COMMENT_EDIT: "COMMENT_EDIT",
  DELETE_CONFIRMATION: "DELETE_CONFIRMATION",
  REPORT_CONTENT: "REPORT_CONTENT",
  MODERATE_CONTENT: "MODERATE_CONTENT",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleThreadCreation = async (threadData: CreateThreadData) => {
  try {
    await dispatch(createThread(threadData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create thread:', error);
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
  data={forums}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Forum Card Component
```typescript
// src/features/forums/components/ForumCard.tsx
// Use existing card styling patterns
// Follow existing component structure
```

### 2. Thread Card Component
```typescript
// src/features/forums/components/ThreadCard.tsx
// Display thread information and metadata
// Follow existing component patterns
```

### 3. Comment Card Component
```typescript
// src/features/forums/components/CommentCard.tsx
// Nested comment display with replies
// Follow existing component structure
```

### 4. Thread Editor Component
```typescript
// src/features/forums/components/ThreadEditor.tsx
// Rich text editor for thread creation
// Follow existing form patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include forum routes:
```typescript
// Add to existing navigation items
{
  label: 'Forums',
  icon: MessageSquare,
  submenu: [
    { label: 'All Forums', path: '/app/forums' },
    { label: 'My Discussions', path: '/app/forums/my-discussions' },
    { label: 'Announcements', path: '/app/forums/announcements' },
    { label: 'Academic Discussions', path: '/app/forums/academic' },
    { label: 'General Discussion', path: '/app/forums/general' }
  ]
}

// Add moderation menu for eligible roles
{
  label: 'Forum Moderation',
  icon: Shield,
  submenu: [
    { label: 'Pending Approval', path: '/app/forums/moderation/pending' },
    { label: 'Reported Content', path: '/app/forums/moderation/reports' },
    { label: 'User Management', path: '/app/forums/moderation/users' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/forums" element={<ForumListPage />} />
<Route path="/forums/:id" element={<ForumDetailsPage />} />
<Route path="/forums/:forumId/threads/:threadId" element={<ThreadDetailsPage />} />
<Route path="/forums/:id/create-thread" element={<CreateThreadPage />} />
<Route path="/forums/moderation" element={<ForumModerationPage />} />
<Route path="/forums/my-discussions" element={<MyDiscussionsPage />} />
<Route path="/forums/announcements" element={<AnnouncementsPage />} />
<Route path="/forums/academic" element={<AcademicForumsPage />} />
<Route path="/forums/general" element={<GeneralForumsPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchForums = createAsyncThunk(
  'forums/fetchForums',
  async (_, { rejectWithValue }) => {
    try {
      const response = await forumApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forums');
    }
  }
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData: CreateThreadData, { rejectWithValue }) => {
    try {
      const response = await threadApi.create(threadData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create thread');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData: CreateCommentData, { rejectWithValue }) => {
    try {
      const response = await commentApi.create(commentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [searchTerm, setSearchTerm] = useState('');
const [categoryFilter, setCategoryFilter] = useState('');
const [sortBy, setSortBy] = useState('lastActivity');
const [showPinnedOnly, setShowPinnedOnly] = useState(false);
const [replyingToComment, setReplyingToComment] = useState<number | null>(null);
```

## Real-time Features

### 1. Live Discussion Updates
- Real-time comment notifications
- Live thread activity indicators
- Online user presence
- Typing indicators

### 2. Notification System
- New reply notifications
- Mention notifications
- Forum activity alerts
- Moderation notifications

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Forum Security Features
```typescript
// Implement forum access control
const canAccessForum = (forum: Forum, user: User) => {
  switch (forum.visibility) {
    case 'PUBLIC':
      return true;
    case 'SCHOOL_ONLY':
      return user.schoolId === forum.schoolId;
    case 'REGION_ONLY':
      return user.regionId === forum.regionId;
    case 'MINISTRY_ONLY':
      return ['MINISTRY_STAFF', 'MINISTRY_EXECUTIVE', 'SUPER_ADMIN'].includes(user.role);
    case 'PRIVATE':
      return false; // Implement specific access logic
    default:
      return false;
  }
};

// Implement content moderation
const canModerateContent = (user: User, content: Thread | Comment) => {
  const moderatorRoles = ['TEACHER', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  return moderatorRoles.includes(user.role) || content.authorId === user.id;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Forum-Specific Optimizations
- Lazy load thread comments
- Implement infinite scrolling for long discussions
- Cache frequently accessed forums
- Optimize real-time updates

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Forum-Specific Testing
- Test comment threading functionality
- Test moderation workflows
- Test real-time updates
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `forumsSlice.ts`, `threadsSlice.ts`, `commentsSlice.ts`
2. **New API Services**: `forumApi.ts`, `threadApi.ts`, `commentApi.ts`
3. **New Pages**: Forum listing, thread viewing, creation, and moderation pages
4. **New Components**: Forum-specific reusable components
5. **Enhanced Existing Pages**: Integration with course and class pages
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Forum-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time discussion updates functioning properly
- Comment threading and replies working correctly
- Moderation tools functioning as expected
- Responsive design consistent with existing pages
- Forum security measures properly implemented

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
11. **DO** implement proper content moderation features
12. **DO** ensure real-time updates work reliably
13. **DO** implement comprehensive access control
14. **DO** optimize for large discussion threads

This implementation should seamlessly integrate with the existing codebase while providing comprehensive forum and discussion capabilities for all user roles in the educational system. 