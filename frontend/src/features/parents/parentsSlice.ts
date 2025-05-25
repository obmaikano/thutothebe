import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import parentApi, { Parent, CreateParentRequest, UpdateParentRequest } from '../../api/services/parentApi';
import { User } from '../../api/services/userApi';

export interface ParentsState {
  parents: Parent[];
  currentParent: Parent | null;
  children: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ParentsState = {
  parents: [],
  currentParent: null,
  children: [],
  status: 'idle',
  error: null
};

// Async thunks
export const fetchParents = createAsyncThunk(
  'parents/fetchParents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await parentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parents');
    }
  }
);

export const fetchParentById = createAsyncThunk(
  'parents/fetchParentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await parentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parent');
    }
  }
);

export const fetchActiveParents = createAsyncThunk(
  'parents/fetchActiveParents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await parentApi.getActiveParents();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active parents');
    }
  }
);

export const fetchParentsBySchoolId = createAsyncThunk(
  'parents/fetchParentsBySchoolId',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await parentApi.getParentsBySchoolId(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parents for school');
    }
  }
);

export const fetchChildrenByParentId = createAsyncThunk(
  'parents/fetchChildrenByParentId',
  async (parentId: number, { rejectWithValue }) => {
    try {
      const response = await parentApi.getChildrenByParentId(parentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch children');
    }
  }
);

export const createParent = createAsyncThunk(
  'parents/createParent',
  async (parentData: CreateParentRequest, { rejectWithValue }) => {
    try {
      const response = await parentApi.create(parentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create parent');
    }
  }
);

export const updateParent = createAsyncThunk(
  'parents/updateParent',
  async ({ id, parentData }: { id: number; parentData: UpdateParentRequest }, { rejectWithValue }) => {
    try {
      const response = await parentApi.update(id, parentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update parent');
    }
  }
);

export const updateParentProfile = createAsyncThunk(
  'parents/updateParentProfile',
  async ({ id, parentData }: { id: number; parentData: UpdateParentRequest }, { rejectWithValue }) => {
    try {
      const response = await parentApi.updateProfile(id, parentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update parent profile');
    }
  }
);

export const deleteParent = createAsyncThunk(
  'parents/deleteParent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await parentApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete parent');
    }
  }
);

export const activateParent = createAsyncThunk(
  'parents/activateParent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await parentApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate parent');
    }
  }
);

export const deactivateParent = createAsyncThunk(
  'parents/deactivateParent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await parentApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate parent');
    }
  }
);

export const linkChildToParent = createAsyncThunk(
  'parents/linkChildToParent',
  async ({ parentId, childId }: { parentId: number; childId: number }, { rejectWithValue }) => {
    try {
      const response = await parentApi.linkChildToParent(parentId, childId);
      return { parentId, childId, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to link child to parent');
    }
  }
);

export const unlinkChildFromParent = createAsyncThunk(
  'parents/unlinkChildFromParent',
  async ({ parentId, childId }: { parentId: number; childId: number }, { rejectWithValue }) => {
    try {
      const response = await parentApi.unlinkChildFromParent(parentId, childId);
      return { parentId, childId, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlink child from parent');
    }
  }
);

const parentsSlice = createSlice({
  name: 'parents',
  initialState,
  reducers: {
    clearCurrentParent: (state) => {
      state.currentParent = null;
    },
    clearParentsError: (state) => {
      state.error = null;
    },
    clearChildren: (state) => {
      state.children = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all parents
      .addCase(fetchParents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch parents';
      })

      // Fetch parent by ID
      .addCase(fetchParentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchParentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentParent = action.payload as Parent;
      })
      .addCase(fetchParentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch parent';
      })

      // Fetch active parents
      .addCase(fetchActiveParents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveParents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveParents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active parents';
      })

      // Fetch parents by school ID
      .addCase(fetchParentsBySchoolId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchParentsBySchoolId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchParentsBySchoolId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch parents for school';
      })

      // Fetch children by parent ID
      .addCase(fetchChildrenByParentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChildrenByParentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.children = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchChildrenByParentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch children';
      })

      // Create parent
      .addCase(createParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.parents.push(action.payload as Parent);
        }
      })
      .addCase(createParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create parent';
      })

      // Update parent
      .addCase(updateParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedParent = action.payload as Parent;
          const index = state.parents.findIndex(p => p.id === updatedParent.id);
          if (index !== -1) {
            state.parents[index] = updatedParent;
          }
          if (state.currentParent?.id === updatedParent.id) {
            state.currentParent = updatedParent;
          }
        }
      })
      .addCase(updateParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update parent';
      })

      // Update parent profile
      .addCase(updateParentProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateParentProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedParent = action.payload as Parent;
          const index = state.parents.findIndex(p => p.id === updatedParent.id);
          if (index !== -1) {
            state.parents[index] = updatedParent;
          }
          if (state.currentParent?.id === updatedParent.id) {
            state.currentParent = updatedParent;
          }
        }
      })
      .addCase(updateParentProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update parent profile';
      })

      // Delete parent
      .addCase(deleteParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload;
        state.parents = state.parents.filter(p => p.id !== id);
        if (state.currentParent?.id === id) {
          state.currentParent = null;
        }
      })
      .addCase(deleteParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete parent';
      })

      // Activate parent
      .addCase(activateParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload;
        const parent = state.parents.find(p => p.id === id);
        if (parent) {
          parent.active = true;
        }
        if (state.currentParent?.id === id) {
          state.currentParent.active = true;
        }
      })
      .addCase(activateParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate parent';
      })

      // Deactivate parent
      .addCase(deactivateParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload;
        const parent = state.parents.find(p => p.id === id);
        if (parent) {
          parent.active = false;
        }
        if (state.currentParent?.id === id) {
          state.currentParent.active = false;
        }
      })
      .addCase(deactivateParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate parent';
      })

      // Link child to parent
      .addCase(linkChildToParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(linkChildToParent.fulfilled, (state) => {
        state.status = 'succeeded';
        // Optionally refresh children list
      })
      .addCase(linkChildToParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to link child to parent';
      })

      // Unlink child from parent
      .addCase(unlinkChildFromParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(unlinkChildFromParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { childId } = action.payload;
        state.children = state.children.filter(child => child.id !== childId);
      })
      .addCase(unlinkChildFromParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to unlink child from parent';
      });
  }
});

export const { clearCurrentParent, clearParentsError, clearChildren } = parentsSlice.actions;

export default parentsSlice.reducer; 