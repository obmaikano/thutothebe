import { api } from '../index';
import { AxiosResponse } from 'axios';

export interface Document {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentCategory: 'POLICY' | 'PROCEDURE' | 'CURRICULUM' | 'LESSON_PLAN' | 'ASSIGNMENT' | 'ASSESSMENT' | 'STUDENT_RECORD' | 'STAFF_RECORD' | 'COMPLIANCE' | 'ADMINISTRATIVE' | 'ACADEMIC_RESOURCE' | 'ANNOUNCEMENT' | 'FORM' | 'REPORT' | 'CERTIFICATE' | 'TRANSCRIPT' | 'ATTENDANCE_RECORD' | 'GRADE_RECORD' | 'DISCIPLINARY_RECORD' | 'MEDICAL_RECORD' | 'FINANCIAL_RECORD' | 'MEETING_MINUTES' | 'CORRESPONDENCE' | 'TRAINING_MATERIAL' | 'REFERENCE_MATERIAL' | 'OTHER';
  documentType: 'PDF' | 'WORD_DOCUMENT' | 'EXCEL_SPREADSHEET' | 'POWERPOINT_PRESENTATION' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT_FILE' | 'ARCHIVE' | 'OTHER';
  accessLevel: 'PUBLIC' | 'REGIONAL' | 'SCHOOL' | 'CLASS' | 'COURSE' | 'SUBJECT' | 'TEACHER_ONLY' | 'ADMIN_ONLY' | 'PRIVATE';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'REQUIRES_REVISION';
  versionNumber: number;
  parentDocumentId?: number;
  uploadedBy: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  uploadedById: number;
  uploadedByName: string;
  uploadedAt: string;
  approvedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  approvedById?: number;
  approvedByName?: string;
  approvedAt?: string;
  schoolId?: number;
  schoolName?: string;
  regionId?: number;
  regionName?: string;
  classId?: number;
  className?: string;
  courseId?: number;
  courseName?: string;
  subjectId?: number;
  subjectName?: string;
  tags?: string;
  checksum?: string;
  downloadCount: number;
  viewCount: number;
  lastAccessedAt?: string;
  isPublic: boolean;
  requiresApproval: boolean;
  expiryDate?: string;
  isArchived: boolean;
  archivedAt?: string;
  archivedById?: number;
  archivedByName?: string;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
  version: number;
}

export interface DocumentResponse {
  status: string;
  message: string;
  data: Document | Document[] | null;
  timestamp: string | null;
}

export interface DocumentPageResponse {
  status: string;
  message: string;
  data: {
    content: Document[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
  };
  timestamp: string | null;
}

export interface CreateDocumentRequest {
  /** Document title (required) - if empty, filename will be used */
  title: string;
  /** Document description (optional) - empty string if not provided */
  description?: string;
  /** Document category (required) */
  documentCategory: string;
  /** Access level (required) */
  accessLevel: string;
  /** ID of the user uploading the document (required) */
  uploadedById: number;
  /** School ID (optional) */
  schoolId?: number;
  /** Region ID (optional) */
  regionId?: number;
  /** Class ID (optional) */
  classId?: number;
  /** Course ID (optional) */
  courseId?: number;
  /** Subject ID (optional) */
  subjectId?: number;
  /** Tags (optional) - comma-separated string */
  tags?: string;
  /** Whether the document is public (optional, defaults to false) */
  isPublic?: boolean;
  /** Whether the document requires approval (optional, defaults to false) */
  requiresApproval?: boolean;
  /** Expiry date (optional) - ISO date string */
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

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  documentsByCategory: Record<string, number>;
  documentsByType: Record<string, number>;
  recentUploads: number;
  pendingApprovals: number;
}

// Document Category Options for UI
export const DOCUMENT_CATEGORIES = [
  { value: 'POLICY', label: 'Policy' },
  { value: 'PROCEDURE', label: 'Procedure' },
  { value: 'CURRICULUM', label: 'Curriculum' },
  { value: 'LESSON_PLAN', label: 'Lesson Plan' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'STUDENT_RECORD', label: 'Student Record' },
  { value: 'STAFF_RECORD', label: 'Staff Record' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'ADMINISTRATIVE', label: 'Administrative' },
  { value: 'ACADEMIC_RESOURCE', label: 'Academic Resource' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'FORM', label: 'Form' },
  { value: 'REPORT', label: 'Report' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'TRANSCRIPT', label: 'Transcript' },
  { value: 'ATTENDANCE_RECORD', label: 'Attendance Record' },
  { value: 'GRADE_RECORD', label: 'Grade Record' },
  { value: 'DISCIPLINARY_RECORD', label: 'Disciplinary Record' },
  { value: 'MEDICAL_RECORD', label: 'Medical Record' },
  { value: 'FINANCIAL_RECORD', label: 'Financial Record' },
  { value: 'MEETING_MINUTES', label: 'Meeting Minutes' },
  { value: 'CORRESPONDENCE', label: 'Correspondence' },
  { value: 'TRAINING_MATERIAL', label: 'Training Material' },
  { value: 'REFERENCE_MATERIAL', label: 'Reference Material' },
  { value: 'OTHER', label: 'Other' }
] as const;

// Document Access Level Options for UI
export const DOCUMENT_ACCESS_LEVELS = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'REGIONAL', label: 'Regional' },
  { value: 'SCHOOL', label: 'School' },
  { value: 'CLASS', label: 'Class' },
  { value: 'COURSE', label: 'Course' },
  { value: 'SUBJECT', label: 'Subject' },
  { value: 'TEACHER_ONLY', label: 'Teacher Only' },
  { value: 'ADMIN_ONLY', label: 'Admin Only' },
  { value: 'PRIVATE', label: 'Private' }
] as const;

// File upload constants
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed'
];

/**
 * Validate file before upload
 * @param file File to validate
 * @returns Validation result with success flag and error message
 */
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds the maximum limit of ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload PDF, Word, Excel, PowerPoint, Image, Video, Audio, Text, or Archive files.'
    };
  }

  return { isValid: true };
};

/**
 * API service for interacting with document endpoints
 */
const documentApi = {
  /**
   * Get all active documents with pagination
   * @returns Response with paginated documents
   */
  getAll: async (page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/active?page=${page}&size=${size}`);
  },

  /**
   * Get document by ID
   * @param id Document ID
   * @returns Response with document details
   */
  getById: async (id: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/documents/${id}`);
  },

  /**
   * Update an existing document
   * @param id Document ID
   * @param documentData Updated document data
   * @returns Response with updated document details
   */
  update: async (id: number, documentData: UpdateDocumentRequest): Promise<AxiosResponse<DocumentResponse>> => {
    return api.put(`/documents/${id}`, documentData);
  },

  /**
   * Delete a document
   * @param id Document ID
   * @param userId User ID performing the deletion
   * @returns Response indicating success/failure
   */
  delete: async (id: number, userId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.delete(`/documents/${id}/user/${userId}`);
  },

  /**
   * Upload a new document
   * @param file File to upload
   * @param metadata Document metadata
   * @returns Response with uploaded document details
   */
  upload: async (file: File, metadata: CreateDocumentRequest): Promise<AxiosResponse<DocumentResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Ensure required fields have proper values
    formData.append('title', metadata.title || file.name.split('.')[0]);
    formData.append('description', metadata.description || '');
    formData.append('documentCategory', metadata.documentCategory);
    formData.append('accessLevel', metadata.accessLevel);
    formData.append('uploadedById', metadata.uploadedById.toString());
    
    // Optional fields - only append if they have values
    if (metadata.schoolId !== undefined && metadata.schoolId !== null) {
      formData.append('schoolId', metadata.schoolId.toString());
    }
    if (metadata.regionId !== undefined && metadata.regionId !== null) {
      formData.append('regionId', metadata.regionId.toString());
    }
    if (metadata.classId !== undefined && metadata.classId !== null) {
      formData.append('classId', metadata.classId.toString());
    }
    if (metadata.courseId !== undefined && metadata.courseId !== null) {
      formData.append('courseId', metadata.courseId.toString());
    }
    if (metadata.subjectId !== undefined && metadata.subjectId !== null) {
      formData.append('subjectId', metadata.subjectId.toString());
    }
    if (metadata.tags && metadata.tags.trim()) {
      formData.append('tags', metadata.tags.trim());
    }
    if (metadata.isPublic !== undefined) {
      formData.append('isPublic', metadata.isPublic.toString());
    }
    if (metadata.requiresApproval !== undefined) {
      formData.append('requiresApproval', metadata.requiresApproval.toString());
    }
    if (metadata.expiryDate && metadata.expiryDate.trim()) {
      formData.append('expiryDate', metadata.expiryDate.trim());
    }
    
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Upload a new version of an existing document
   * @param parentDocumentId Parent document ID
   * @param file File to upload
   * @param title Version title
   * @param description Version description
   * @param uploadedById User ID uploading the version
   * @returns Response with uploaded version details
   */
  uploadVersion: async (
    parentDocumentId: number, 
    file: File, 
    title: string, 
    description: string, 
    uploadedById: number
  ): Promise<AxiosResponse<DocumentResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('uploadedById', uploadedById.toString());
    
    return api.post(`/documents/${parentDocumentId}/upload-version`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Download a document
   * @param id Document ID
   * @param userId User ID requesting download
   * @returns Response with file blob
   */
  download: async (id: number, userId: number): Promise<AxiosResponse<Blob>> => {
    return api.get(`/documents/${id}/download?userId=${userId}`, {
      responseType: 'blob',
    });
  },

  /**
   * Get documents by category
   * @param category Document category
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getByCategory: async (category: string, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/category/${category}?page=${page}&size=${size}`);
  },

  /**
   * Get documents by access level
   * @param accessLevel Access level
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getByAccessLevel: async (accessLevel: string, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/access-level/${accessLevel}?page=${page}&size=${size}`);
  },

  /**
   * Get documents by uploader
   * @param uploaderId Uploader user ID
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getByUploader: async (uploaderId: number, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/user/${uploaderId}?page=${page}&size=${size}`);
  },

  /**
   * Get documents by school
   * @param schoolId School ID
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getBySchool: async (schoolId: number, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/school/${schoolId}?page=${page}&size=${size}`);
  },

  /**
   * Get documents by class
   * @param classId Class ID
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getByClass: async (classId: number, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/class/${classId}?page=${page}&size=${size}`);
  },

  /**
   * Get documents by subject
   * @param subjectId Subject ID
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getBySubject: async (subjectId: number, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/subject/${subjectId}?page=${page}&size=${size}`);
  },

  /**
   * Get documents by course
   * @param courseId Course ID
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getByCourse: async (courseId: number, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/course/${courseId}?page=${page}&size=${size}`);
  },

  /**
   * Get public documents
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated public documents
   */
  getPublic: async (page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/public?page=${page}&size=${size}`);
  },

  /**
   * Get documents by approval status
   * @param status Approval status
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated documents
   */
  getByApprovalStatus: async (status: string, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/approval-status/${status}?page=${page}&size=${size}`);
  },

  /**
   * Get pending documents
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated pending documents
   */
  getPending: async (page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/approval-status/PENDING?page=${page}&size=${size}`);
  },

  /**
   * Get approved documents
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated approved documents
   */
  getApproved: async (page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/approval-status/APPROVED?page=${page}&size=${size}`);
  },

  /**
   * Search documents
   * @param searchTerm Search term
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated search results
   */
  search: async (searchTerm: string, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  },

  /**
   * Search documents for a specific user
   * @param userId User ID
   * @param searchTerm Search term
   * @param page Page number
   * @param size Page size
   * @returns Response with paginated search results
   */
  searchByUser: async (userId: number, searchTerm: string, page = 0, size = 10): Promise<AxiosResponse<DocumentPageResponse>> => {
    return api.get(`/documents/search/user/${userId}?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  },

  /**
   * Get document versions
   * @param documentId Document ID
   * @returns Response with document versions
   */
  getVersions: async (documentId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/documents/${documentId}/versions`);
  },

  /**
   * Get latest version of a document
   * @param documentId Document ID
   * @returns Response with latest version
   */
  getLatestVersion: async (documentId: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/documents/${documentId}/latest-version`);
  },

  /**
   * Check if user has read access to document
   * @param documentId Document ID
   * @param userId User ID
   * @returns Response with access status
   */
  hasReadAccess: async (documentId: number, userId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/documents/${documentId}/access/read/${userId}`);
  },

  /**
   * Check if user has download access to document
   * @param documentId Document ID
   * @param userId User ID
   * @returns Response with access status
   */
  hasDownloadAccess: async (documentId: number, userId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/documents/${documentId}/access/download/${userId}`);
  },

  /**
   * Check if user has edit access to document
   * @param documentId Document ID
   * @param userId User ID
   * @returns Response with access status
   */
  hasEditAccess: async (documentId: number, userId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/documents/${documentId}/access/edit/${userId}`);
  },

  /**
   * Check if user has delete access to document
   * @param documentId Document ID
   * @param userId User ID
   * @returns Response with access status
   */
  hasDeleteAccess: async (documentId: number, userId: number): Promise<AxiosResponse<{ data: boolean }>> => {
    return api.get(`/documents/${documentId}/access/delete/${userId}`);
  },

  /**
   * Get document count by school
   * @param schoolId School ID
   * @returns Response with document count
   */
  getDocumentCountBySchool: async (schoolId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/documents/statistics/school/${schoolId}/count`);
  },

  /**
   * Get document count by user
   * @param userId User ID
   * @returns Response with document count
   */
  getDocumentCountByUser: async (userId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/documents/statistics/user/${userId}/count`);
  },

  /**
   * Get total file size by school
   * @param schoolId School ID
   * @returns Response with total file size
   */
  getTotalFileSizeBySchool: async (schoolId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/documents/statistics/school/${schoolId}/total-size`);
  },

  /**
   * Get expired documents
   * @returns Response with expired documents
   */
  getExpiredDocuments: async (): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get('/documents/expired');
  },

  /**
   * Get documents expiring within a certain number of days
   * @param days Number of days
   * @returns Response with documents expiring within the specified number of days
   */
  getDocumentsExpiringWithin: async (days: number): Promise<AxiosResponse<DocumentResponse>> => {
    return api.get(`/documents/expiring-within/${days}`);
  },
};

export default documentApi; 