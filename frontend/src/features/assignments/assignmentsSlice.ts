import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assignmentApi, { Assignment, CreateAssignmentRequest, UpdateAssignmentRequest } from '../../api/services/assignmentApi';

export interface AssignmentsState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AssignmentsState = {
  assignments: [],
  currentAssignment: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }
);

export const fetchAssignmentById = createAsyncThunk(
  'assignments/fetchAssignmentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignment');
    }
  }
);

export const fetchAssignmentByCode = createAsyncThunk(
  'assignments/fetchAssignmentByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getByCode(code);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignment');
    }
  }
);

export const fetchAssignmentsByCourse = createAsyncThunk(
  'assignments/fetchAssignmentsByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments by course');
    }
  }
);

export const fetchActiveAssignments = createAsyncThunk(
  'assignments/fetchActiveAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active assignments');
    }
  }
);

export const fetchActiveAssignmentsByCourse = createAsyncThunk(
  'assignments/fetchActiveAssignmentsByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.getActiveByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active assignments by course');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async (assignmentData: CreateAssignmentRequest, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.create(assignmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'assignments/updateAssignment',
  async ({ id, assignmentData }: { id: number; assignmentData: UpdateAssignmentRequest }, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.update(id, assignmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update assignment');
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/deleteAssignment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete assignment');
    }
  }
);

export const publishAssignment = createAsyncThunk(
  'assignments/publishAssignment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.publish(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish assignment');
    }
  }
);

export const closeAssignment = createAsyncThunk(
  'assignments/closeAssignment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.close(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close assignment');
    }
  }
);

export const archiveAssignment = createAsyncThunk(
  'assignments/archiveAssignment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await assignmentApi.archive(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to archive assignment');
    }
  }
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
    clearAssignmentsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch assignments';
      })

      // Fetch assignment by ID
      .addCase(fetchAssignmentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAssignment = action.payload as Assignment;
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch assignment';
      })

      // Fetch assignment by code
      .addCase(fetchAssignmentByCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignmentByCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAssignment = action.payload as Assignment;
      })
      .addCase(fetchAssignmentByCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch assignment';
      })

      // Fetch assignments by course
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch assignments by course';
      })

      // Fetch active assignments
      .addCase(fetchActiveAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active assignments';
      })

      // Fetch active assignments by course
      .addCase(fetchActiveAssignmentsByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveAssignmentsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveAssignmentsByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active assignments by course';
      })

      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments.push(action.payload as Assignment);
        state.currentAssignment = action.payload as Assignment;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create assignment';
      })

      // Update assignment
      .addCase(updateAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedAssignment = action.payload as Assignment;
        const index = state.assignments.findIndex(assignment => assignment.id === updatedAssignment.id);
        if (index !== -1) {
          state.assignments[index] = updatedAssignment;
        }
        state.currentAssignment = updatedAssignment;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update assignment';
      })

      // Delete assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.assignments = state.assignments.filter(assignment => assignment.id !== id);
        if (state.currentAssignment?.id === id) {
          state.currentAssignment = null;
        }
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete assignment';
      })

      // Publish assignment
      .addCase(publishAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(publishAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedAssignment = action.payload as Assignment;
        const index = state.assignments.findIndex(assignment => assignment.id === updatedAssignment.id);
        if (index !== -1) {
          state.assignments[index] = updatedAssignment;
        }
        state.currentAssignment = updatedAssignment;
      })
      .addCase(publishAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to publish assignment';
      })

      // Close assignment
      .addCase(closeAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(closeAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedAssignment = action.payload as Assignment;
        const index = state.assignments.findIndex(assignment => assignment.id === updatedAssignment.id);
        if (index !== -1) {
          state.assignments[index] = updatedAssignment;
        }
        state.currentAssignment = updatedAssignment;
      })
      .addCase(closeAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to close assignment';
      })

      // Archive assignment
      .addCase(archiveAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(archiveAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedAssignment = action.payload as Assignment;
        const index = state.assignments.findIndex(assignment => assignment.id === updatedAssignment.id);
        if (index !== -1) {
          state.assignments[index] = updatedAssignment;
        }
        state.currentAssignment = updatedAssignment;
      })
      .addCase(archiveAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to archive assignment';
      });
  }
});

export const { clearCurrentAssignment, clearAssignmentsError } = assignmentsSlice.actions;
export default assignmentsSlice.reducer; 