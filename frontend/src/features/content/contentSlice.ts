import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentApi, { Content, CreateContentRequest, UpdateContentRequest } from '../../api/services/contentApi';

export interface ContentState {
  contents: Content[];
  currentContent: Content | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: {
    courseId?: number;
    type?: string;
    teacherId?: number;
    activeOnly?: boolean;
  };
}

const initialState: ContentState = {
  contents: [],
  currentContent: null,
  status: 'idle',
  error: null,
  filter: {}
};

// Async thunks
export const fetchContents = createAsyncThunk(
  'content/fetchContents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contents');
    }
  }
);

export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const fetchContentByCourse = createAsyncThunk(
  'content/fetchContentByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course content');
    }
  }
);

export const fetchContentByType = createAsyncThunk(
  'content/fetchContentByType',
  async ({ courseId, type }: { courseId: number; type: string }, { rejectWithValue }) => {
    try {
      const response = await contentApi.getByType(courseId, type);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content by type');
    }
  }
);

export const fetchActiveContentByCourse = createAsyncThunk(
  'content/fetchActiveContentByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getActiveByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active course content');
    }
  }
);

export const fetchActiveContentByType = createAsyncThunk(
  'content/fetchActiveContentByType',
  async ({ courseId, type }: { courseId: number; type: string }, { rejectWithValue }) => {
    try {
      const response = await contentApi.getActiveByType(courseId, type);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active content by type');
    }
  }
);

export const fetchContentByTeacher = createAsyncThunk(
  'content/fetchContentByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher content');
    }
  }
);

export const fetchActiveContentByTeacher = createAsyncThunk(
  'content/fetchActiveContentByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getActiveByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active teacher content');
    }
  }
);

export const fetchContentByTeacherAndType = createAsyncThunk(
  'content/fetchContentByTeacherAndType',
  async ({ teacherId, type }: { teacherId: number; type: string }, { rejectWithValue }) => {
    try {
      const response = await contentApi.getByTeacherAndType(teacherId, type);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher content by type');
    }
  }
);

export const fetchContentByCreator = createAsyncThunk(
  'content/fetchContentByCreator',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getByCreator(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch creator content');
    }
  }
);

export const fetchActiveContentByCreator = createAsyncThunk(
  'content/fetchActiveContentByCreator',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.getActiveByCreator(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active creator content');
    }
  }
);

export const checkContentExists = createAsyncThunk(
  'content/checkContentExists',
  async ({ title, courseId }: { title: string; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await contentApi.checkExists(title, courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check content existence');
    }
  }
);

export const createContent = createAsyncThunk(
  'content/createContent',
  async (contentData: CreateContentRequest, { rejectWithValue }) => {
    try {
      const response = await contentApi.create(contentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create content');
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, contentData }: { id: number; contentData: UpdateContentRequest }, { rejectWithValue }) => {
    try {
      const response = await contentApi.update(id, contentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update content');
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete content');
    }
  }
);

export const activateContent = createAsyncThunk(
  'content/activateContent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate content');
    }
  }
);

export const deactivateContent = createAsyncThunk(
  'content/deactivateContent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await contentApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate content');
    }
  }
);

const contentSlice = createSlice({
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
      state.filter = { ...state.filter, ...action.payload };
    },
    clearContentFilter: (state) => {
      state.filter = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contents
      .addCase(fetchContents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch contents';
      })

      // Fetch content by ID
      .addCase(fetchContentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentContent = action.payload as Content;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch content';
      })

      // Fetch content by course
      .addCase(fetchContentByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContentByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContentByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch course content';
      })

      // Fetch content by type
      .addCase(fetchContentByType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContentByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContentByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch content by type';
      })

      // Fetch active content by course
      .addCase(fetchActiveContentByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveContentByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveContentByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active course content';
      })

      // Fetch active content by type
      .addCase(fetchActiveContentByType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveContentByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveContentByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active content by type';
      })

      // Fetch content by teacher
      .addCase(fetchContentByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContentByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContentByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch teacher content';
      })

      // Fetch active content by teacher
      .addCase(fetchActiveContentByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveContentByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveContentByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active teacher content';
      })

      // Fetch content by teacher and type
      .addCase(fetchContentByTeacherAndType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContentByTeacherAndType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContentByTeacherAndType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch teacher content by type';
      })

      // Fetch content by creator
      .addCase(fetchContentByCreator.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContentByCreator.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContentByCreator.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch creator content';
      })

      // Fetch active content by creator
      .addCase(fetchActiveContentByCreator.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveContentByCreator.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveContentByCreator.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active creator content';
      })

      // Create content
      .addCase(createContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.contents.push(action.payload as Content);
        }
      })
      .addCase(createContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create content';
      })

      // Update content
      .addCase(updateContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedContent = action.payload as Content;
          const index = state.contents.findIndex(content => content.id === updatedContent.id);
          if (index !== -1) {
            state.contents[index] = updatedContent;
          }
          if (state.currentContent && state.currentContent.id === updatedContent.id) {
            state.currentContent = updatedContent;
          }
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update content';
      })

      // Delete content
      .addCase(deleteContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const deletedId = action.payload.id;
          state.contents = state.contents.filter(content => content.id !== deletedId);
          if (state.currentContent && state.currentContent.id === deletedId) {
            state.currentContent = null;
          }
        }
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete content';
      })

      // Activate content
      .addCase(activateContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const activatedId = action.payload.id;
          const content = state.contents.find(content => content.id === activatedId);
          if (content) {
            content.active = true;
          }
          if (state.currentContent && state.currentContent.id === activatedId) {
            state.currentContent.active = true;
          }
        }
      })
      .addCase(activateContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate content';
      })

      // Deactivate content
      .addCase(deactivateContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const deactivatedId = action.payload.id;
          const content = state.contents.find(content => content.id === deactivatedId);
          if (content) {
            content.active = false;
          }
          if (state.currentContent && state.currentContent.id === deactivatedId) {
            state.currentContent.active = false;
          }
        }
      })
      .addCase(deactivateContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate content';
      });
  }
});

export const {
  clearCurrentContent,
  clearContentError,
  setContentFilter,
  clearContentFilter
} = contentSlice.actions;

export default contentSlice.reducer; 