import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentApi, { Comment, CreateCommentRequest, UpdateCommentRequest } from '../../api/services/commentApi';

export interface CommentsState {
  comments: Comment[];
  currentComment: Comment | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  currentComment: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await commentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentById = createAsyncThunk(
  'comments/fetchCommentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comment');
    }
  }
);

export const fetchCommentsByThreadId = createAsyncThunk(
  'comments/fetchCommentsByThreadId',
  async (threadId: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByThreadId(threadId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentsByThreadIdAndActive = createAsyncThunk(
  'comments/fetchCommentsByThreadIdAndActive',
  async ({ threadId, active }: { threadId: number; active: boolean }, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByThreadIdAndActive(threadId, active);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentsByAuthorId = createAsyncThunk(
  'comments/fetchCommentsByAuthorId',
  async (authorId: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByAuthorId(authorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentsByAuthorIdAndActive = createAsyncThunk(
  'comments/fetchCommentsByAuthorIdAndActive',
  async ({ authorId, active }: { authorId: number; active: boolean }, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByAuthorIdAndActive(authorId, active);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentsByParentId = createAsyncThunk(
  'comments/fetchCommentsByParentId',
  async (parentId: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByParentId(parentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentsByParentIdAndActive = createAsyncThunk(
  'comments/fetchCommentsByParentIdAndActive',
  async ({ parentId, active }: { parentId: number; active: boolean }, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByParentIdAndActive(parentId, active);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const fetchCommentByIdWithReplies = createAsyncThunk(
  'comments/fetchCommentByIdWithReplies',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getByIdWithReplies(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comment with replies');
    }
  }
);

export const fetchTopLevelCommentsByThreadId = createAsyncThunk(
  'comments/fetchTopLevelCommentsByThreadId',
  async (threadId: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getTopLevelCommentsByThreadId(threadId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top-level comments');
    }
  }
);

export const fetchRepliesByParentId = createAsyncThunk(
  'comments/fetchRepliesByParentId',
  async (parentId: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.getRepliesByParentId(parentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch replies');
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData: CreateCommentRequest, { rejectWithValue }) => {
    try {
      const response = await commentApi.create(commentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, commentData }: { id: number; commentData: UpdateCommentRequest }, { rejectWithValue }) => {
    try {
      const response = await commentApi.update(id, commentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await commentApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCurrentComment: (state) => {
      state.currentComment = null;
    },
    clearCommentsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all comments
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comment by ID
      .addCase(fetchCommentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentComment = action.payload as Comment;
      })
      .addCase(fetchCommentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comment';
      })

      // Fetch comments by thread ID
      .addCase(fetchCommentsByThreadId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentsByThreadId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommentsByThreadId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comments by thread ID and active
      .addCase(fetchCommentsByThreadIdAndActive.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentsByThreadIdAndActive.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommentsByThreadIdAndActive.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comments by author ID
      .addCase(fetchCommentsByAuthorId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentsByAuthorId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommentsByAuthorId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comments by author ID and active
      .addCase(fetchCommentsByAuthorIdAndActive.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentsByAuthorIdAndActive.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommentsByAuthorIdAndActive.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comments by parent ID
      .addCase(fetchCommentsByParentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentsByParentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommentsByParentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comments by parent ID and active
      .addCase(fetchCommentsByParentIdAndActive.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentsByParentIdAndActive.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommentsByParentIdAndActive.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comments';
      })

      // Fetch comment by ID with replies
      .addCase(fetchCommentByIdWithReplies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommentByIdWithReplies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentComment = action.payload as Comment;
      })
      .addCase(fetchCommentByIdWithReplies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch comment with replies';
      })

      // Fetch top-level comments by thread ID
      .addCase(fetchTopLevelCommentsByThreadId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTopLevelCommentsByThreadId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTopLevelCommentsByThreadId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch top-level comments';
      })

      // Fetch replies by parent ID
      .addCase(fetchRepliesByParentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRepliesByParentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRepliesByParentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch replies';
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments.push(action.payload as Comment);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create comment';
      })

      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedComment = action.payload as Comment;
        const index = state.comments.findIndex(comment => comment.id === updatedComment.id);
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
        if (state.currentComment && state.currentComment.id === updatedComment.id) {
          state.currentComment = updatedComment;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update comment';
      })

      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.comments = state.comments.filter(comment => comment.id !== id);
        if (state.currentComment && state.currentComment.id === id) {
          state.currentComment = null;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete comment';
      });
  }
});

export const { clearCurrentComment, clearCommentsError } = commentsSlice.actions;
export default commentsSlice.reducer; 