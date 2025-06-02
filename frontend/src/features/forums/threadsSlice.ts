import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import threadApi, { Thread, CreateThreadRequest, UpdateThreadRequest } from '../../api/services/threadApi';

export interface ThreadsState {
  threads: Thread[];
  currentThread: Thread | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await threadApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadById = createAsyncThunk(
  'threads/fetchThreadById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await threadApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch thread');
    }
  }
);

export const fetchThreadsByForumId = createAsyncThunk(
  'threads/fetchThreadsByForumId',
  async (forumId: number, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByForumId(forumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadsByForumIdAndActive = createAsyncThunk(
  'threads/fetchThreadsByForumIdAndActive',
  async ({ forumId, active }: { forumId: number; active: boolean }, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByForumIdAndActive(forumId, active);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadsByAuthorId = createAsyncThunk(
  'threads/fetchThreadsByAuthorId',
  async (authorId: number, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByAuthorId(authorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadsByAuthorIdAndActive = createAsyncThunk(
  'threads/fetchThreadsByAuthorIdAndActive',
  async ({ authorId, active }: { authorId: number; active: boolean }, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByAuthorIdAndActive(authorId, active);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadByIdWithComments = createAsyncThunk(
  'threads/fetchThreadByIdWithComments',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByIdWithComments(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch thread with comments');
    }
  }
);

export const fetchThreadsByForumIdWithComments = createAsyncThunk(
  'threads/fetchThreadsByForumIdWithComments',
  async (forumId: number, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByForumIdWithComments(forumId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads with comments');
    }
  }
);

export const fetchThreadsByForumIdOrdered = createAsyncThunk(
  'threads/fetchThreadsByForumIdOrdered',
  async ({ forumId, page, size }: { forumId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await threadApi.getByForumIdOrdered(forumId, page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData: CreateThreadRequest, { rejectWithValue }) => {
    try {
      const response = await threadApi.create(threadData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create thread');
    }
  }
);

export const updateThread = createAsyncThunk(
  'threads/updateThread',
  async ({ id, threadData }: { id: number; threadData: UpdateThreadRequest }, { rejectWithValue }) => {
    try {
      const response = await threadApi.update(id, threadData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update thread');
    }
  }
);

export const deleteThread = createAsyncThunk(
  'threads/deleteThread',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await threadApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete thread');
    }
  }
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    clearCurrentThread: (state) => {
      state.currentThread = null;
    },
    clearThreadsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all threads
      .addCase(fetchThreads.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads';
      })

      // Fetch thread by ID
      .addCase(fetchThreadById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentThread = action.payload as Thread;
      })
      .addCase(fetchThreadById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch thread';
      })

      // Fetch threads by forum ID
      .addCase(fetchThreadsByForumId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsByForumId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchThreadsByForumId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads';
      })

      // Fetch threads by forum ID and active
      .addCase(fetchThreadsByForumIdAndActive.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsByForumIdAndActive.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchThreadsByForumIdAndActive.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads';
      })

      // Fetch threads by author ID
      .addCase(fetchThreadsByAuthorId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsByAuthorId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchThreadsByAuthorId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads';
      })

      // Fetch threads by author ID and active
      .addCase(fetchThreadsByAuthorIdAndActive.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsByAuthorIdAndActive.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchThreadsByAuthorIdAndActive.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads';
      })

      // Fetch thread by ID with comments
      .addCase(fetchThreadByIdWithComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadByIdWithComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentThread = action.payload as Thread;
      })
      .addCase(fetchThreadByIdWithComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch thread with comments';
      })

      // Fetch threads by forum ID with comments
      .addCase(fetchThreadsByForumIdWithComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsByForumIdWithComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchThreadsByForumIdWithComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads with comments';
      })

      // Fetch threads by forum ID ordered
      .addCase(fetchThreadsByForumIdOrdered.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadsByForumIdOrdered.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle paginated response
        if (action.payload && action.payload.content) {
          state.threads = action.payload.content;
        } else {
          state.threads = Array.isArray(action.payload) ? action.payload : [];
        }
      })
      .addCase(fetchThreadsByForumIdOrdered.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch threads';
      })

      // Create thread
      .addCase(createThread.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.threads.push(action.payload as Thread);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create thread';
      })

      // Update thread
      .addCase(updateThread.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedThread = action.payload as Thread;
        const index = state.threads.findIndex(thread => thread.id === updatedThread.id);
        if (index !== -1) {
          state.threads[index] = updatedThread;
        }
        if (state.currentThread && state.currentThread.id === updatedThread.id) {
          state.currentThread = updatedThread;
        }
      })
      .addCase(updateThread.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update thread';
      })

      // Delete thread
      .addCase(deleteThread.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.threads = state.threads.filter(thread => thread.id !== id);
        if (state.currentThread && state.currentThread.id === id) {
          state.currentThread = null;
        }
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete thread';
      });
  }
});

export const { clearCurrentThread, clearThreadsError } = threadsSlice.actions;
export default threadsSlice.reducer; 