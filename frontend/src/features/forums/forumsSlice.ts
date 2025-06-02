import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import forumApi, { Forum, CreateForumRequest, UpdateForumRequest } from '../../api/services/forumApi';

export interface ForumsState {
  forums: Forum[];
  currentForum: Forum | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ForumsState = {
  forums: [],
  currentForum: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchForums = createAsyncThunk(
  'forums/fetchForums',
  async (_, { rejectWithValue }) => {
    try {
      const response = await forumApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forums');
    }
  }
);

export const fetchForumById = createAsyncThunk(
  'forums/fetchForumById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await forumApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forum');
    }
  }
);

export const fetchForumByCourseId = createAsyncThunk(
  'forums/fetchForumByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await forumApi.getByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forum');
    }
  }
);

export const fetchForumByCourseIdAndActive = createAsyncThunk(
  'forums/fetchForumByCourseIdAndActive',
  async ({ courseId, active }: { courseId: number; active: boolean }, { rejectWithValue }) => {
    try {
      const response = await forumApi.getByCourseIdAndActive(courseId, active);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forum');
    }
  }
);

export const fetchForumByIdWithThreads = createAsyncThunk(
  'forums/fetchForumByIdWithThreads',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await forumApi.getByIdWithThreads(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forum with threads');
    }
  }
);

export const fetchForumByCourseIdWithThreads = createAsyncThunk(
  'forums/fetchForumByCourseIdWithThreads',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await forumApi.getByCourseIdWithThreads(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forum with threads');
    }
  }
);

export const createForum = createAsyncThunk(
  'forums/createForum',
  async (forumData: CreateForumRequest, { rejectWithValue }) => {
    try {
      const response = await forumApi.create(forumData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create forum');
    }
  }
);

export const updateForum = createAsyncThunk(
  'forums/updateForum',
  async ({ id, forumData }: { id: number; forumData: UpdateForumRequest }, { rejectWithValue }) => {
    try {
      const response = await forumApi.update(id, forumData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update forum');
    }
  }
);

export const deleteForum = createAsyncThunk(
  'forums/deleteForum',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await forumApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete forum');
    }
  }
);

const forumsSlice = createSlice({
  name: 'forums',
  initialState,
  reducers: {
    clearCurrentForum: (state) => {
      state.currentForum = null;
    },
    clearForumsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all forums
      .addCase(fetchForums.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forums = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchForums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch forums';
      })

      // Fetch forum by ID
      .addCase(fetchForumById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForumById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForum = action.payload as Forum;
      })
      .addCase(fetchForumById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch forum';
      })

      // Fetch forum by course ID
      .addCase(fetchForumByCourseId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForumByCourseId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForum = action.payload as Forum;
      })
      .addCase(fetchForumByCourseId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch forum';
      })

      // Fetch forum by course ID and active
      .addCase(fetchForumByCourseIdAndActive.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForumByCourseIdAndActive.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForum = action.payload as Forum;
      })
      .addCase(fetchForumByCourseIdAndActive.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch forum';
      })

      // Fetch forum by ID with threads
      .addCase(fetchForumByIdWithThreads.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForumByIdWithThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForum = action.payload as Forum;
      })
      .addCase(fetchForumByIdWithThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch forum with threads';
      })

      // Fetch forum by course ID with threads
      .addCase(fetchForumByCourseIdWithThreads.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForumByCourseIdWithThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForum = action.payload as Forum;
      })
      .addCase(fetchForumByCourseIdWithThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch forum with threads';
      })

      // Create forum
      .addCase(createForum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createForum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forums.push(action.payload as Forum);
      })
      .addCase(createForum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create forum';
      })

      // Update forum
      .addCase(updateForum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateForum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedForum = action.payload as Forum;
        const index = state.forums.findIndex(forum => forum.id === updatedForum.id);
        if (index !== -1) {
          state.forums[index] = updatedForum;
        }
        if (state.currentForum && state.currentForum.id === updatedForum.id) {
          state.currentForum = updatedForum;
        }
      })
      .addCase(updateForum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update forum';
      })

      // Delete forum
      .addCase(deleteForum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteForum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.forums = state.forums.filter(forum => forum.id !== id);
        if (state.currentForum && state.currentForum.id === id) {
          state.currentForum = null;
        }
      })
      .addCase(deleteForum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete forum';
      });
  }
});

export const { clearCurrentForum, clearForumsError } = forumsSlice.actions;
export default forumsSlice.reducer; 