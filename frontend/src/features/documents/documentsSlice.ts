import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentApi, { 
  Document, 
  CreateDocumentRequest, 
  UpdateDocumentRequest,
  DocumentStats,
  DocumentPageResponse
} from '../../api/services/documentApi';

export interface DocumentsState {
  documents: Document[];
  currentDocument: Document | null;
  documentVersions: Document[];
  documentStats: DocumentStats | null;
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
    courseId?: number;
    tags?: string[];
    searchQuery?: string;
    approvalStatus?: string;
  };
  selectedDocuments: number[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

const initialState: DocumentsState = {
  documents: [],
  currentDocument: null,
  documentVersions: [],
  documentStats: null,
  status: 'idle',
  uploadStatus: 'idle',
  uploadProgress: 0,
  error: null,
  filters: {},
  selectedDocuments: [],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  },
};

// Async thunks for document operations
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await documentApi.getAll(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  'documents/fetchDocumentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await documentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch document');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async ({ file, metadata }: { file: File; metadata: CreateDocumentRequest }, { rejectWithValue }) => {
    try {
      const response = await documentApi.upload(file, metadata);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const uploadDocumentVersion = createAsyncThunk(
  'documents/uploadDocumentVersion',
  async ({ 
    parentDocumentId, 
    file, 
    title, 
    description, 
    uploadedById 
  }: { 
    parentDocumentId: number; 
    file: File; 
    title: string; 
    description: string; 
    uploadedById: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.uploadVersion(parentDocumentId, file, title, description, uploadedById);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document version');
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ id, documentData }: { id: number; documentData: UpdateDocumentRequest }, { rejectWithValue }) => {
    try {
      const response = await documentApi.update(id, documentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async ({ id, userId }: { id: number; userId: number }, { rejectWithValue }) => {
    try {
      await documentApi.delete(id, userId);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

export const downloadDocument = createAsyncThunk(
  'documents/downloadDocument',
  async (params: { id: number; userId: number; fileName: string }, { rejectWithValue }) => {
    try {
      // First check if user has download permission
      const permissionResponse = await documentApi.hasDownloadAccess(params.id, params.userId);
      
      if (!permissionResponse.data.data) {
        return rejectWithValue('You do not have permission to download this document');
      }

      const response = await documentApi.download(params.id, params.userId);
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = params.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { id: params.id, fileName: params.fileName };
    } catch (error: any) {
      console.error('Download error:', error);
      
      if (error.response?.status === 403 || error.response?.status === 401) {
        return rejectWithValue('Access denied: You do not have permission to download this document');
      } else if (error.response?.status === 404) {
        return rejectWithValue('Document not found or has been removed');
      } else if (error.response?.status === 400) {
        return rejectWithValue('Invalid download request. Please try again.');
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.message) {
        return rejectWithValue(`Download failed: ${error.message}`);
      } else {
        return rejectWithValue('Failed to download document. Please try again later.');
      }
    }
  }
);

export const searchDocuments = createAsyncThunk(
  'documents/searchDocuments',
  async ({ 
    searchTerm, 
    page = 0, 
    size = 10 
  }: { 
    searchTerm: string; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.search(searchTerm, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search documents');
    }
  }
);

export const fetchDocumentsByCategory = createAsyncThunk(
  'documents/fetchDocumentsByCategory',
  async ({ 
    category, 
    page = 0, 
    size = 10 
  }: { 
    category: string; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.getByCategory(category, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents by category');
    }
  }
);

export const fetchDocumentsBySchool = createAsyncThunk(
  'documents/fetchDocumentsBySchool',
  async ({ 
    schoolId, 
    page = 0, 
    size = 10 
  }: { 
    schoolId: number; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.getBySchool(schoolId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents by school');
    }
  }
);

export const fetchDocumentsByClass = createAsyncThunk(
  'documents/fetchDocumentsByClass',
  async ({ 
    classId, 
    page = 0, 
    size = 10 
  }: { 
    classId: number; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.getByClass(classId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents by class');
    }
  }
);

export const fetchDocumentsBySubject = createAsyncThunk(
  'documents/fetchDocumentsBySubject',
  async ({ 
    subjectId, 
    page = 0, 
    size = 10 
  }: { 
    subjectId: number; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.getBySubject(subjectId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents by subject');
    }
  }
);

export const fetchDocumentsByCourse = createAsyncThunk(
  'documents/fetchDocumentsByCourse',
  async ({ 
    courseId, 
    page = 0, 
    size = 10 
  }: { 
    courseId: number; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.getByCourse(courseId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents by course');
    }
  }
);

export const fetchDocumentsByUploader = createAsyncThunk(
  'documents/fetchDocumentsByUploader',
  async ({ 
    uploaderId, 
    page = 0, 
    size = 10 
  }: { 
    uploaderId: number; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await documentApi.getByUploader(uploaderId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents by uploader');
    }
  }
);

export const fetchPublicDocuments = createAsyncThunk(
  'documents/fetchPublicDocuments',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await documentApi.getPublic(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public documents');
    }
  }
);

export const fetchPendingDocuments = createAsyncThunk(
  'documents/fetchPendingDocuments',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await documentApi.getPending(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending documents');
    }
  }
);

export const fetchDocumentVersions = createAsyncThunk(
  'documents/fetchDocumentVersions',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const response = await documentApi.getVersions(documentId);
      return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch document versions');
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
    clearDocumentsError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedDocuments: (state, action) => {
      state.selectedDocuments = action.payload;
    },
    toggleDocumentSelection: (state, action) => {
      const documentId = action.payload;
      const index = state.selectedDocuments.indexOf(documentId);
      if (index > -1) {
        state.selectedDocuments.splice(index, 1);
      } else {
        state.selectedDocuments.push(documentId);
      }
    },
    clearSelectedDocuments: (state) => {
      state.selectedDocuments = [];
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUploadStatus: (state) => {
      state.uploadStatus = 'idle';
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch documents';
      })

      // Fetch document by ID
      .addCase(fetchDocumentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentDocument = action.payload as Document;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch document';
      })

      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.uploadStatus = 'uploading';
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.documents.unshift(action.payload as Document);
        state.currentDocument = action.payload as Document;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload as string || 'Failed to upload document';
      })

      // Upload document version
      .addCase(uploadDocumentVersion.pending, (state) => {
        state.uploadStatus = 'uploading';
        state.error = null;
      })
      .addCase(uploadDocumentVersion.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.documentVersions.unshift(action.payload as Document);
      })
      .addCase(uploadDocumentVersion.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload as string || 'Failed to upload document version';
      })

      // Update document
      .addCase(updateDocument.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedDocument = action.payload as Document;
        const index = state.documents.findIndex(doc => doc.id === updatedDocument.id);
        if (index !== -1) {
          state.documents[index] = updatedDocument;
        }
        state.currentDocument = updatedDocument;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update document';
      })

      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const documentId = action.payload as number;
        state.documents = state.documents.filter(doc => doc.id !== documentId);
        if (state.currentDocument?.id === documentId) {
          state.currentDocument = null;
        }
        // Remove from selected documents if present
        state.selectedDocuments = state.selectedDocuments.filter(id => id !== documentId);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete document';
      })

      // Download document
      .addCase(downloadDocument.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(downloadDocument.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(downloadDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to download document';
      })

      // Search documents
      .addCase(searchDocuments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to search documents';
      })

      // Fetch documents by category
      .addCase(fetchDocumentsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch documents by school
      .addCase(fetchDocumentsBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch documents by class
      .addCase(fetchDocumentsByClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch documents by subject
      .addCase(fetchDocumentsBySubject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch documents by course
      .addCase(fetchDocumentsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch documents by uploader
      .addCase(fetchDocumentsByUploader.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch public documents
      .addCase(fetchPublicDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch pending documents
      .addCase(fetchPendingDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.data.content;
        state.pagination = {
          page: action.payload.data.number,
          size: action.payload.data.size,
          totalElements: action.payload.data.totalElements,
          totalPages: action.payload.data.totalPages,
          first: action.payload.data.first,
          last: action.payload.data.last,
        };
      })

      // Fetch document versions
      .addCase(fetchDocumentVersions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDocumentVersions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documentVersions = action.payload as Document[];
      })
      .addCase(fetchDocumentVersions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch document versions';
      });
  },
});

export const {
  clearCurrentDocument,
  clearDocumentsError,
  setFilters,
  clearFilters,
  setSelectedDocuments,
  toggleDocumentSelection,
  clearSelectedDocuments,
  setUploadProgress,
  resetUploadStatus
} = documentsSlice.actions;

export default documentsSlice.reducer; 