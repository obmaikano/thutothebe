import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teacherApi, { Teacher, CreateTeacherRequest, UpdateTeacherRequest } from '../../api/services/teacherApi';

export interface TeachersState {
  teachers: Teacher[];
  currentTeacher: Teacher | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TeachersState = {
  teachers: [],
  currentTeacher: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teacherApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchTeacherById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await teacherApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher');
    }
  }
);

export const fetchActiveTeachers = createAsyncThunk(
  'teachers/fetchActiveTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teacherApi.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active teachers');
    }
  }
);

export const fetchTeachersBySchool = createAsyncThunk(
  'teachers/fetchTeachersBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await teacherApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers by school');
    }
  }
);

export const createTeacher = createAsyncThunk(
  'teachers/createTeacher',
  async (teacherData: CreateTeacherRequest, { rejectWithValue }) => {
    try {
      const response = await teacherApi.create(teacherData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create teacher');
    }
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ id, teacherData }: { id: number; teacherData: UpdateTeacherRequest }, { rejectWithValue }) => {
    try {
      const response = await teacherApi.update(id, teacherData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update teacher');
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await teacherApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teacher');
    }
  }
);

export const activateTeacher = createAsyncThunk(
  'teachers/activateTeacher',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await teacherApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate teacher');
    }
  }
);

export const deactivateTeacher = createAsyncThunk(
  'teachers/deactivateTeacher',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await teacherApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate teacher');
    }
  }
);

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearCurrentTeacher: (state) => {
      state.currentTeacher = null;
    },
    clearTeachersError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teachers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch teachers';
      })

      // Fetch teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTeacher = action.payload as Teacher;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch teacher';
      })

      // Fetch active teachers
      .addCase(fetchActiveTeachers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teachers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active teachers';
      })

      // Fetch teachers by school
      .addCase(fetchTeachersBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeachersBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teachers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTeachersBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch teachers by school';
      })

      // Create teacher
      .addCase(createTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teachers.push(action.payload as Teacher);
        state.currentTeacher = action.payload as Teacher;
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create teacher';
      })

      // Update teacher
      .addCase(updateTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedTeacher = action.payload as Teacher;
        const index = state.teachers.findIndex(teacher => teacher.id === updatedTeacher.id);
        if (index !== -1) {
          state.teachers[index] = updatedTeacher;
        }
        state.currentTeacher = updatedTeacher;
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update teacher';
      })

      // Delete teacher
      .addCase(deleteTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.teachers = state.teachers.filter(teacher => teacher.id !== id);
        if (state.currentTeacher?.id === id) {
          state.currentTeacher = null;
        }
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete teacher';
      })

      // Activate teacher
      .addCase(activateTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.teachers.findIndex(teacher => teacher.id === id);
        if (index !== -1) {
          state.teachers[index] = { ...state.teachers[index], active: true };
        }
        if (state.currentTeacher?.id === id) {
          state.currentTeacher = { ...state.currentTeacher, active: true };
        }
      })
      .addCase(activateTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate teacher';
      })

      // Deactivate teacher
      .addCase(deactivateTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.teachers.findIndex(teacher => teacher.id === id);
        if (index !== -1) {
          state.teachers[index] = { ...state.teachers[index], active: false };
        }
        if (state.currentTeacher?.id === id) {
          state.currentTeacher = { ...state.currentTeacher, active: false };
        }
      })
      .addCase(deactivateTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate teacher';
      });
  }
});

export const { clearCurrentTeacher, clearTeachersError } = teachersSlice.actions;
export default teachersSlice.reducer; 