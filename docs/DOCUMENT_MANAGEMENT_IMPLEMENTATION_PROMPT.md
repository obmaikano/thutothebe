# Frontend Implementation Prompt: Document Management System

## Overview
Implement a comprehensive frontend interface for the document management system targeting educational roles: **SUPER_ADMIN**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

**IMPORTANT**: The backend controller (`DocumentController`) exists with comprehensive file upload/download functionality, but no frontend API service or UI implementation has been created. This is a complete frontend implementation from API service to UI components.

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
- `DocumentController` - Complete document management with file upload/download, access control, approval workflows, and version control

## Complete Frontend Implementation Required

### 1. API Service Layer (TO BE CREATED)
```typescript
// src/api/services/documentApi.ts
import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface DocumentResponse {
  status: string;
  message: string;
  data: Document | Document[] | null;
  timestamp: string | null;
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentCategory: 'CURRICULUM' | 'POLICY' | 'FORM' | 'RESOURCE' | 'REPORT' | 'ASSIGNMENT' | 'OTHER';
  documentType: 'PDF' | 'DOC' | 'DOCX' | 'XLS' | 'XLSX' | 'PPT' | 'PPTX' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'OTHER';
  accessLevel: 'PUBLIC' | 'SCHOOL' | 'CLASS' | 'TEACHER' | 'ADMIN' | 'PRIVATE';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT';
  version: number;
  isLatestVersion: boolean;
  parentDocumentId?: number;
  uploadedBy: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  approvedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  schoolId?: number;
  regionId?: number;
  classId?: number;
  courseId?: number;
  subjectId?: number;
  tags: string[];
  downloadCount: number;
  viewCount: number;
  isPublic: boolean;
  requiresApproval: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  documentCategory: string;
  accessLevel: string;
  schoolId?: number;
  regionId?: number;
  classId?: number;
  courseId?: number;
  subjectId?: number;
  tags?: string;
  isPublic?: boolean;
  requiresApproval?: boolean;
  expiryDate?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  documentCategory?: string;
  accessLevel?: string;
  tags?: string;
  isPublic?: boolean;
  expiryDate?: string;
}

const documentApi = {
  // Basic CRUD operations
  getAll: async (): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get('/api/documents');
  },
  getById: async (id: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/${id}`);
  },
  update: async (id: number, documentData: UpdateDocumentRequest): Promise<AxiosResponse<DocumentResponse>> => {
    return api.put(`/api/documents/${id}`, documentData);
  },
  delete: async (id: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.delete(`/api/documents/${id}`);
  },

  // File upload operations
  upload: async (file: File, metadata: CreateDocumentRequest): Promise<AxiosResponse<DocumentResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    return api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // File download operations
  download: async (id: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/api/documents/${id}/download`, {
      responseType: 'blob',
    });
  },
  preview: async (id: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/api/documents/${id}/preview`, {
      responseType: 'blob',
    });
  },

  // Query operations
  getByCategory: async (category: string): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/category/${category}`);
  },
  getByAccessLevel: async (accessLevel: string): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/access-level/${accessLevel}`);
  },
  getByUploader: async (uploaderId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/uploader/${uploaderId}`);
  },
  getBySchool: async (schoolId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/school/${schoolId}`);
  },
  getByClass: async (classId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/class/${classId}`);
  },
  getBySubject: async (subjectId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/subject/${subjectId}`);
  },
  getPublic: async (): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get('/api/documents/public');
  },
  getPending: async (): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get('/api/documents/pending');
  },
  getApproved: async (): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get('/api/documents/approved');
  },
  getByTags: async (tags: string[]): Promise<AxiosResponse<DocumentResponse>> => {
    const tagString = tags.join(',');
    return api.get(`/api/documents/tags?tags=${tagString}`);
  },

  // Search operations
  search: async (query: string, filters?: {
    category?: string;
    accessLevel?: string;
    schoolId?: number;
    classId?: number;
    subjectId?: number;
  }): Promise<AxiosResponse<DocumentResponse>> => {
    const params = new URLSearchParams({ query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/api/documents/search?${params}`);
  },

  // Approval operations
  approve: async (id: number, comment?: string): Promise<AxiosResponse<DocumentResponse>> => {
    return api.post(`/api/documents/${id}/approve`, { comment });
  },
  reject: async (id: number, reason: string): Promise<AxiosResponse<DocumentResponse>> => {
    return api.post(`/api/documents/${id}/reject`, { reason });
  },

  // Version control
  getVersions: async (documentId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/api/documents/${documentId}/versions`);
  },
  uploadNewVersion: async (documentId: number, file: File, comment?: string): Promise<AxiosResponse<DocumentResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (comment) formData.append('comment', comment);
    
    return api.post(`/api/documents/${documentId}/versions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Statistics
  getStats: async (): Promise<AxiosResponse<{
    data: {
      totalDocuments: number;
      totalSize: number;
      documentsByCategory: Record<string, number>;
      documentsByType: Record<string, number>;
      recentUploads: number;
      pendingApprovals: number;
    }
  }>> => {
    return api.get('/api/documents/stats');
  },

  // Bulk operations
  bulkDelete: async (documentIds: number[]): Promise<AxiosResponse<void>> => {
    return api.delete('/api/documents/bulk', { data: { documentIds } });
  },
  bulkApprove: async (documentIds: number[]): Promise<AxiosResponse<void>> => {
    return api.post('/api/documents/bulk/approve', { documentIds });
  },
  bulkReject: async (documentIds: number[], reason: string): Promise<AxiosResponse<void>> => {
    return api.post('/api/documents/bulk/reject', { documentIds, reason });
  },
};

export default documentApi;
```

### 2. Redux Slice (TO BE CREATED)
```typescript
// src/features/documents/documentsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentApi, { Document, CreateDocumentRequest, UpdateDocumentRequest } from '../../api/services/documentApi';

export interface DocumentsState {
  documents: Document[];
  currentDocument: Document | null;
  documentVersions: Document[];
  documentStats: {
    totalDocuments: number;
    totalSize: number;
    documentsByCategory: Record<string, number>;
    documentsByType: Record<string, number>;
    recentUploads: number;
    pendingApprovals: number;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed';
  uploadProgress: number;
  error: string | null;
  filters: {
    category?: string;
    accessLevel?: string;
    schoolId?: number;
    classId?: number;
    subjectId?: number;
    tags?: string[];
    searchQuery?: string;
  };
  selectedDocuments: number[];
}

// Async thunks for document operations
export const fetchDocuments = createAsyncThunk(/* ... */);
export const uploadDocument = createAsyncThunk(/* ... */);
export const downloadDocument = createAsyncThunk(/* ... */);
export const searchDocuments = createAsyncThunk(/* ... */);
export const approveDocument = createAsyncThunk(/* ... */);
export const rejectDocument = createAsyncThunk(/* ... */);
// ... other thunks
```

### 3. Feature Directory Structure (TO BE CREATED)
```
src/features/documents/
├── pages/
│   ├── DocumentLibraryPage.tsx         # Main document library
│   ├── DocumentUploadPage.tsx          # Document upload interface
│   ├── DocumentDetailsPage.tsx         # Document details and preview
│   ├── DocumentApprovalPage.tsx        # Document approval workflow
│   ├── MyDocumentsPage.tsx             # User's uploaded documents
│   └── DocumentAnalyticsPage.tsx       # Document usage analytics
├── components/
│   ├── DocumentCard.tsx                # Document display card
│   ├── DocumentUploader.tsx            # File upload component
│   ├── DocumentViewer.tsx              # Document preview component
│   ├── DocumentFilters.tsx             # Search and filter controls
│   ├── DocumentStats.tsx               # Document statistics
│   ├── DocumentList.tsx                # Document list view
│   ├── DocumentGrid.tsx                # Document grid view
│   ├── DocumentVersions.tsx            # Version history
│   ├── DocumentApprovalPanel.tsx       # Approval interface
│   ├── DocumentTags.tsx                # Tag management
│   └── DocumentExporter.tsx            # Export functionality
├── modals/
│   ├── UploadDocumentModal.tsx         # Quick document upload
│   ├── EditDocumentModal.tsx           # Edit document metadata
│   ├── DocumentDetailsModal.tsx        # View document details
│   ├── ApprovalModal.tsx               # Document approval/rejection
│   ├── VersionUploadModal.tsx          # Upload new version
│   ├── ShareDocumentModal.tsx          # Document sharing
│   └── BulkOperationsModal.tsx         # Bulk document operations
├── documentsSlice.ts
├── README.md
└── index.tsx
```

## Core Features to Implement

### 1. Document Library Interface

**Document Browser:**
- Grid and list view options
- Advanced search and filtering
- Category-based organization
- Tag-based filtering
- Access level filtering
- Sort by date, name, size, downloads

**Document Management:**
- Drag-and-drop file upload
- Bulk upload capabilities
- Metadata editing
- Version control
- Access permission management
- Document sharing

### 2. File Upload System

**Upload Interface:**
- Drag-and-drop upload area
- Multiple file selection
- Upload progress tracking
- File type validation
- Size limit enforcement
- Metadata form integration

**Upload Features:**
- Resume interrupted uploads
- Duplicate detection
- Automatic file categorization
- Thumbnail generation
- Virus scanning integration

### 3. Document Viewer

**Preview Capabilities:**
- PDF viewer integration
- Image preview
- Office document preview
- Video/audio player
- Text file viewer
- Download options

**Viewer Features:**
- Full-screen mode
- Zoom controls
- Page navigation
- Print functionality
- Annotation support (future)

### 4. Approval Workflow

**Approval Interface:**
- Pending documents queue
- Approval/rejection actions
- Comment system
- Bulk approval operations
- Approval history tracking

**Workflow Features:**
- Automated approval routing
- Notification system
- Approval deadlines
- Escalation procedures
- Audit trail

### 5. Version Control

**Version Management:**
- Version history display
- Compare versions
- Restore previous versions
- Version comments
- Change tracking

**Version Features:**
- Automatic versioning
- Version branching
- Merge capabilities
- Version approval
- Version analytics

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Role-based permissions
const canUploadDocuments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canApproveDocuments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER'
].includes(userRole);

const canViewAllDocuments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD'
].includes(userRole);

const canViewPublicDocuments = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER',
  'STUDENT',
  'PARENT'
].includes(userRole);

const canManageVersions = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  UPLOAD_DOCUMENT: "UPLOAD_DOCUMENT",
  EDIT_DOCUMENT: "EDIT_DOCUMENT",
  DOCUMENT_DETAILS: "DOCUMENT_DETAILS",
  APPROVE_DOCUMENT: "APPROVE_DOCUMENT",
  VERSION_UPLOAD: "VERSION_UPLOAD",
  SHARE_DOCUMENT: "SHARE_DOCUMENT",
  BULK_OPERATIONS: "BULK_OPERATIONS",
};
```

## Specific UI Components to Create

### 1. Document Uploader Component
```typescript
// src/features/documents/components/DocumentUploader.tsx
interface DocumentUploaderProps {
  onUpload: (files: File[], metadata: CreateDocumentRequest) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  showProgress?: boolean;
}

// Features:
// - Drag-and-drop interface
// - File type validation
// - Progress tracking
// - Metadata form
// - Preview thumbnails
// - Error handling
```

### 2. Document Viewer Component
```typescript
// src/features/documents/components/DocumentViewer.tsx
interface DocumentViewerProps {
  document: Document;
  onDownload: (document: Document) => void;
  onClose: () => void;
  showControls?: boolean;
}

// Features:
// - Multi-format support
// - Zoom controls
// - Full-screen mode
// - Download button
// - Navigation controls
// - Loading states
```

### 3. Document Card Component
```typescript
// src/features/documents/components/DocumentCard.tsx
interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onDownload: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  showActions?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (document: Document, selected: boolean) => void;
}

// Features:
// - Document thumbnail
// - Metadata display
// - Action buttons
// - Selection checkbox
// - Status indicators
// - Access level badges
```

### 4. Document Approval Panel Component
```typescript
// src/features/documents/components/DocumentApprovalPanel.tsx
interface DocumentApprovalPanelProps {
  pendingDocuments: Document[];
  onApprove: (documentId: number, comment?: string) => void;
  onReject: (documentId: number, reason: string) => void;
  onBulkApprove: (documentIds: number[]) => void;
  onBulkReject: (documentIds: number[], reason: string) => void;
}

// Features:
// - Pending documents queue
// - Quick approval actions
// - Bulk operations
// - Comment system
// - Preview integration
// - Approval history
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/routes/roleSidebar.ts`:
```typescript
// For Teachers and Admins
{
  icon: FileText,
  label: 'Documents',
  path: '/app/documents',
  description: 'Document library and management'
},
{
  icon: Upload,
  label: 'Upload Documents',
  path: '/app/documents/upload',
  description: 'Upload and share documents'
},

// For Admins
{
  icon: CheckCircle,
  label: 'Document Approval',
  path: '/app/documents/approval',
  description: 'Review and approve documents'
},

// For All Users
{
  icon: Library,
  label: 'Resource Library',
  path: '/app/resources',
  description: 'Access educational resources'
},

// For Users
{
  icon: User,
  label: 'My Documents',
  path: '/app/my-documents',
  description: 'Your uploaded documents'
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx`:
```typescript
// Document routes
<Route path="/documents" element={<DocumentLibraryPage />} />
<Route path="/documents/upload" element={<DocumentUploadPage />} />
<Route path="/documents/:id" element={<DocumentDetailsPage />} />
<Route path="/documents/approval" element={<DocumentApprovalPage />} />
<Route path="/documents/analytics" element={<DocumentAnalyticsPage />} />

// User-specific routes
<Route path="/my-documents" element={<MyDocumentsPage />} />
<Route path="/resources" element={<ResourceLibraryPage />} />

// Admin routes
<Route path="/document-management" element={<DocumentManagementPage />} />
```

## Advanced Features

### 1. Smart Document Organization
- Automatic categorization using AI
- Content-based tagging
- Duplicate detection
- Smart folder suggestions
- Related document recommendations

### 2. Collaboration Features
- Document sharing with permissions
- Collaborative editing (future)
- Comment and annotation system
- Review and approval workflows
- Team document spaces

### 3. Integration Features
- Learning Management System integration
- Email attachment processing
- Cloud storage synchronization
- External document import
- API for third-party integrations

## Real-time Features

### 1. Live Document Updates
- Real-time upload progress
- Live approval notifications
- Document availability updates
- Collaborative editing indicators
- Version change notifications

### 2. Smart Notifications
- Upload completion alerts
- Approval request notifications
- Document expiry warnings
- Access permission changes
- Version update notifications

## Performance Considerations

### 1. File Handling Optimization
- Chunked file uploads
- Progressive loading
- Thumbnail caching
- Lazy loading for large libraries
- CDN integration for downloads

### 2. Search and Filter Optimization
- Indexed search capabilities
- Faceted search interface
- Search result caching
- Autocomplete suggestions
- Advanced query building

## Security Implementation

### 1. File Security
- File type validation
- Virus scanning integration
- Size limit enforcement
- Access control validation
- Secure file storage

### 2. Access Control
- Role-based permissions
- Document-level access control
- Time-based access restrictions
- IP-based access control
- Audit trail logging

## Testing Strategy

### 1. Component Testing
- File upload functionality
- Document viewer accuracy
- Search and filter operations
- Permission validation
- Version control features

### 2. Integration Testing
- API integration
- File handling workflows
- Approval processes
- Notification systems
- Security measures

## Deliverables

1. **Complete API Service**: `documentApi.ts`
2. **Redux State Management**: `documentsSlice.ts`
3. **Document Library Interface**: Browse and search documents
4. **Upload System**: File upload with metadata
5. **Document Viewer**: Multi-format document preview
6. **Approval Workflow**: Document review and approval
7. **Version Control**: Document versioning system
8. **Analytics Dashboard**: Usage statistics and reporting
9. **Mobile-Responsive Design**: Cross-device compatibility

## Success Criteria

- Efficient document upload and management workflow
- Comprehensive document library with search capabilities
- Secure file handling and access control
- Intuitive document viewer for multiple formats
- Streamlined approval workflow
- Robust version control system
- Real-time notifications and updates
- Mobile-responsive design
- High performance with large file libraries
- Integration with existing educational workflows

## Implementation Notes

1. **DO** create complete API service following existing patterns
2. **DO** implement comprehensive Redux state management
3. **DO** follow existing authentication and authorization patterns
4. **DO** use existing styling and component patterns
5. **DO** implement secure file handling
6. **DO** ensure mobile responsiveness
7. **DO** optimize for performance with large files
8. **DO** implement proper security measures
9. **DO** provide intuitive interfaces for all user roles
10. **DO** integrate with existing notification systems

This implementation will provide a complete document management system from API to UI, delivering secure file handling, comprehensive organization, and efficient collaboration tools for educational institutions. 