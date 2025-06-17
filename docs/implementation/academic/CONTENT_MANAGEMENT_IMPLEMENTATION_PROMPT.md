# Frontend Implementation Prompt: Content Management System

## Overview
Implement a comprehensive frontend interface for the content management system targeting educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

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
    content: contentReducer,  // TO BE CREATED
    contentTypes: contentTypesReducer,  // TO BE CREATED
    contentLibrary: contentLibraryReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/content/
├── pages/
│   ├── ContentLibraryPage.tsx
│   ├── ContentDetailsPage.tsx
│   ├── CreateContentPage.tsx
│   ├── ContentManagementPage.tsx
│   └── ContentAnalyticsPage.tsx
├── components/
│   ├── ContentCard.tsx
│   ├── ContentForm.tsx
│   ├── ContentViewer.tsx
│   ├── ContentFilters.tsx
│   ├── ContentUploader.tsx
│   └── ContentPreview.tsx
├── modals/
│   ├── CreateContentModal.tsx
│   ├── EditContentModal.tsx
│   ├── ContentDetailsModal.tsx
│   ├── ContentShareModal.tsx
│   └── ContentVersionModal.tsx
├── contentSlice.ts
├── contentTypesSlice.ts
├── contentLibrarySlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/contentApi.ts
// src/api/services/contentTypeApi.ts
// src/api/services/contentLibraryApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface ContentResponse {
  status: string;
  message: string;
  data: Content | Content[] | null;
  timestamp: string | null;
}

export interface Content {
  id: number;
  title: string;
  description?: string;
  content: string;
  contentType: 'LESSON' | 'ASSIGNMENT' | 'QUIZ' | 'VIDEO' | 'DOCUMENT' | 'PRESENTATION' | 'INTERACTIVE' | 'RESOURCE' | 'ASSESSMENT' | 'ACTIVITY';
  format: 'TEXT' | 'HTML' | 'MARKDOWN' | 'PDF' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'INTERACTIVE' | 'SCORM' | 'H5P';
  courseId: number;
  teacherId: number;
  createdById: number;
  lastModifiedById?: number;
  version: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED' | 'DEPRECATED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED' | 'COURSE_ONLY';
  tags: string[];
  keywords: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedDuration?: number;
  prerequisites: string[];
  learningObjectives: string[];
  metadata: {
    fileSize?: number;
    fileType?: string;
    duration?: number;
    language: string;
    accessibility: {
      hasSubtitles: boolean;
      hasTranscript: boolean;
      isScreenReaderFriendly: boolean;
    };
    technicalRequirements: string[];
  };
  attachments: Array<{
    id: number;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  interactions: {
    views: number;
    downloads: number;
    likes: number;
    shares: number;
    comments: number;
    rating: number;
    ratingCount: number;
  };
  permissions: {
    canView: string[];
    canEdit: string[];
    canShare: string[];
    canDownload: string[];
  };
  publishedAt?: string;
  expiresAt?: string;
  lastAccessedAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentType {
  id: number;
  name: string;
  description?: string;
  icon: string;
  category: 'EDUCATIONAL' | 'ADMINISTRATIVE' | 'ASSESSMENT' | 'MULTIMEDIA' | 'INTERACTIVE' | 'REFERENCE';
  allowedFormats: string[];
  defaultTemplate?: string;
  validationRules: {
    maxSize?: number;
    allowedExtensions?: string[];
    requiredFields: string[];
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentLibrary {
  id: number;
  name: string;
  description?: string;
  type: 'PERSONAL' | 'COURSE' | 'DEPARTMENT' | 'SCHOOL' | 'REGIONAL' | 'NATIONAL';
  ownerId: number;
  ownerType: 'USER' | 'COURSE' | 'DEPARTMENT' | 'SCHOOL' | 'REGION';
  isPublic: boolean;
  contentCount: number;
  totalSize: number;
  lastUpdated: string;
  permissions: {
    canView: string[];
    canContribute: string[];
    canManage: string[];
  };
  categories: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const contentApi = {
  getAll: async (): Promise<AxiosResponse<ContentResponse>> => {
    return api.get('/content');
  },
  getById: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/${id}`);
  },
  getByCourse: async (courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}`);
  },
  getByType: async (courseId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/type/${type}`);
  },
  getActiveByCourse: async (courseId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/active`);
  },
  getActiveByType: async (courseId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/course/${courseId}/type/${type}/active`);
  },
  getByTeacher: async (teacherId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}`);
  },
  getActiveByTeacher: async (teacherId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}/active`);
  },
  getByTeacherAndType: async (teacherId: number, type: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/teacher/${teacherId}/type/${type}`);
  },
  getByCreator: async (userId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/created-by/${userId}`);
  },
  getActiveByCreator: async (userId: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.get(`/content/created-by/${userId}/active`);
  },
  checkExists: async (title: string, courseId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/content/exists?title=${encodeURIComponent(title)}&courseId=${courseId}`);
  },
  search: async (query: string, filters?: ContentSearchFilters): Promise<AxiosResponse<ContentResponse>> => {
    const params = new URLSearchParams({ query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/content/search?${params.toString()}`);
  },
  create: async (contentData: CreateContentRequest): Promise<AxiosResponse<ContentResponse>> => {
    return api.post('/content', contentData);
  },
  update: async (id: number, contentData: UpdateContentRequest): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}`, contentData);
  },
  publish: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}/publish`);
  },
  unpublish: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}/unpublish`);
  },
  archive: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.put(`/content/${id}/archive`);
  },
  duplicate: async (id: number, newTitle?: string): Promise<AxiosResponse<ContentResponse>> => {
    return api.post(`/content/${id}/duplicate`, { newTitle });
  },
  share: async (id: number, shareData: ShareContentRequest): Promise<AxiosResponse<void>> => {
    return api.post(`/content/${id}/share`, shareData);
  },
  rate: async (id: number, rating: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.post(`/content/${id}/rate`, { rating });
  },
  like: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.post(`/content/${id}/like`);
  },
  unlike: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.delete(`/content/${id}/like`);
  },
  view: async (id: number): Promise<AxiosResponse<void>> => {
    return api.post(`/content/${id}/view`);
  },
  download: async (id: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/content/${id}/download`, { responseType: 'blob' });
  },
  delete: async (id: number): Promise<AxiosResponse<ContentResponse>> => {
    return api.delete(`/content/${id}`);
  },
  bulkDelete: async (contentIds: number[]): Promise<AxiosResponse<void>> => {
    return api.delete('/content/bulk', { data: { contentIds } });
  },
  bulkPublish: async (contentIds: number[]): Promise<AxiosResponse<void>> => {
    return api.put('/content/bulk/publish', { contentIds });
  },
  bulkArchive: async (contentIds: number[]): Promise<AxiosResponse<void>> => {
    return api.put('/content/bulk/archive', { contentIds });
  },
};

const contentTypeApi = {
  getAll: async (): Promise<AxiosResponse<{ data: ContentType[] }>> => {
    return api.get('/content-types');
  },
  getById: async (id: number): Promise<AxiosResponse<{ data: ContentType }>> => {
    return api.get(`/content-types/${id}`);
  },
  getByCategory: async (category: string): Promise<AxiosResponse<{ data: ContentType[] }>> => {
    return api.get(`/content-types/category/${category}`);
  },
  create: async (typeData: CreateContentTypeRequest): Promise<AxiosResponse<{ data: ContentType }>> => {
    return api.post('/content-types', typeData);
  },
  update: async (id: number, typeData: UpdateContentTypeRequest): Promise<AxiosResponse<{ data: ContentType }>> => {
    return api.put(`/content-types/${id}`, typeData);
  },
  delete: async (id: number): Promise<AxiosResponse<void>> => {
    return api.delete(`/content-types/${id}`);
  },
};

export default { contentApi, contentTypeApi };
```

## Core Features to Implement

### 1. Content Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/content/contentSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearCurrentContent: (state) => {
      state.currentContent = null;
    },
    clearContentError: (state) => {
      state.error = null;
    },
    setContentFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateContentStatus: (state, action) => {
      const content = state.contents.find(c => c.id === action.payload.id);
      if (content) {
        content.status = action.payload.status;
      }
    },
    incrementViews: (state, action) => {
      const content = state.contents.find(c => c.id === action.payload);
      if (content) {
        content.interactions.views += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `ContentLibraryPage.tsx` - Browse and manage content library
- `ContentDetailsPage.tsx` - View content details and interactions
- `CreateContentPage.tsx` - Create and edit content
- `ContentManagementPage.tsx` - Manage content lifecycle
- `ContentAnalyticsPage.tsx` - Content usage analytics

### 2. Content Creation and Editing
Rich content authoring:
- WYSIWYG content editor
- Multi-format support
- Template system
- Version control
- Collaborative editing

### 3. Content Library and Organization
Comprehensive content management:
- Content categorization
- Tagging system
- Search and filtering
- Content collections
- Sharing and permissions

### 4. Content Analytics and Insights
Usage tracking and analytics:
- View and download statistics
- User engagement metrics
- Content performance analysis
- Usage patterns
- Recommendation engine

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateContent = [
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

const canViewContent = [
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

const canManageContent = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canPublishContent = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  CONTENT_ADD_NEW: "CONTENT_ADD_NEW",
  CONTENT_EDIT: "CONTENT_EDIT",
  CONTENT_DETAILS: "CONTENT_DETAILS",
  CONTENT_SHARE: "CONTENT_SHARE",
  CONTENT_VERSION: "CONTENT_VERSION",
  CONTENT_PREVIEW: "CONTENT_PREVIEW",
  CONTENT_UPLOAD: "CONTENT_UPLOAD",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleContentCreation = async (contentData: CreateContentData) => {
  try {
    await dispatch(createContent(contentData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to create content:', error);
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
  data={contents}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Content Card Component
```typescript
// src/features/content/components/ContentCard.tsx
// Display content information in card format
// Follow existing component patterns
```

### 2. Content Form Component
```typescript
// src/features/content/components/ContentForm.tsx
// Rich form for creating and editing content
// Follow existing form patterns
```

### 3. Content Viewer Component
```typescript
// src/features/content/components/ContentViewer.tsx
// Display content in various formats
// Follow existing component patterns
```

### 4. Content Uploader Component
```typescript
// src/features/content/components/ContentUploader.tsx
// File upload interface for content
// Follow existing upload patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include content routes:
```typescript
// Add to existing navigation items
{
  label: 'Content',
  icon: FileText,
  submenu: [
    { label: 'Library', path: '/app/content/library' },
    { label: 'Create Content', path: '/app/content/create' },
    { label: 'My Content', path: '/app/content/my-content' },
    { label: 'Shared Content', path: '/app/content/shared' },
    { label: 'Analytics', path: '/app/content/analytics' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/content/library" element={<ContentLibraryPage />} />
<Route path="/content/:id" element={<ContentDetailsPage />} />
<Route path="/content/create" element={<CreateContentPage />} />
<Route path="/content/:id/edit" element={<EditContentPage />} />
<Route path="/content/my-content" element={<MyContentPage />} />
<Route path="/content/shared" element={<SharedContentPage />} />
<Route path="/content/analytics" element={<ContentAnalyticsPage />} />
<Route path="/content/course/:courseId" element={<CourseContentPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: ContentFetchParams, { rejectWithValue }) => {
    try {
      const response = await contentApi.getByCourse(params.courseId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const createContent = createAsyncThunk(
  'content/createContent',
  async (contentData: CreateContentData, { rejectWithValue }) => {
    try {
      const response = await contentApi.create(contentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create content');
    }
  }
);

export const publishContent = createAsyncThunk(
  'content/publishContent',
  async (contentId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.publish(contentId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish content');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [contentTypeFilter, setContentTypeFilter] = useState('ALL');
const [statusFilter, setStatusFilter] = useState('');
const [courseFilter, setCourseFilter] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [selectedContents, setSelectedContents] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Content Updates
- Real-time content collaboration
- Live editing sessions
- Instant content publishing
- Content status changes

### 2. Content Interaction Tracking
- Real-time view tracking
- Live engagement metrics
- Instant feedback collection
- Usage analytics

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Content Security Features
```typescript
// Implement content access control
const canViewContent = (content: Content, user: User) => {
  // Check content visibility
  if (content.visibility === 'PUBLIC') return true;
  
  // Check if user is enrolled in the course
  if (content.visibility === 'COURSE_ONLY') {
    return user.courseIds?.includes(content.courseId);
  }
  
  // Check specific permissions
  if (content.visibility === 'RESTRICTED') {
    return content.permissions.canView.includes(user.role) || 
           content.permissions.canView.includes(user.id.toString());
  }
  
  // Private content - only creator and admins
  if (content.visibility === 'PRIVATE') {
    return content.createdById === user.id || 
           ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(user.role);
  }
  
  return false;
};

// Implement content modification permissions
const canEditContent = (content: Content, user: User) => {
  // Content creator can edit
  if (content.createdById === user.id) return true;
  
  // Check edit permissions
  if (content.permissions.canEdit.includes(user.role) || 
      content.permissions.canEdit.includes(user.id.toString())) {
    return true;
  }
  
  // Admins can edit content in their scope
  const adminRoles = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'SCHOOL_ADMIN'];
  return adminRoles.includes(user.role);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Content-Specific Optimizations
- Efficient content loading
- Smart content caching
- Optimized search functionality
- Content streaming for large files

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Content-Specific Testing
- Test content creation workflow
- Test content viewing and interaction
- Test search and filtering
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `contentSlice.ts`, `contentTypesSlice.ts`, `contentLibrarySlice.ts`
2. **New API Services**: `contentApi.ts`, `contentTypeApi.ts`, `contentLibraryApi.ts`
3. **New Pages**: Content management and library pages
4. **New Components**: Content-specific reusable components
5. **Enhanced Existing Pages**: Integration with course management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Content-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Content creation and management functioning properly
- Content library and search working correctly
- Content viewing and interaction functioning as expected
- File upload and handling working reliably
- Responsive design consistent with existing pages
- Content security measures properly implemented

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
11. **DO** implement proper content validation
12. **DO** ensure secure content handling
13. **DO** implement comprehensive content tracking
14. **DO** optimize for large content files

This implementation should seamlessly integrate with the existing codebase while providing comprehensive content management capabilities for all user roles in the educational system. 