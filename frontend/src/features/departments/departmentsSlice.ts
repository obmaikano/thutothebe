import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentApi, { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../../api/services/departmentApi';

export interface DepartmentsState {
  departments: Department[];
  currentDepartment: Department | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepartmentsState = {
  departments: [],
  currentDepartment: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const fetchDepartmentById = createAsyncThunk(
  'departments/fetchDepartmentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department');
    }
  }
);

export const fetchDepartmentsBySchool = createAsyncThunk(
  'departments/fetchDepartmentsBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const fetchActiveDepartmentsBySchool = createAsyncThunk(
  'departments/fetchActiveDepartmentsBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getActiveBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active departments');
    }
  }
);

export const fetchActiveDepartments = createAsyncThunk(
  'departments/fetchActiveDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active departments');
    }
  }
);

export const fetchDepartmentByNameAndSchool = createAsyncThunk(
  'departments/fetchDepartmentByNameAndSchool',
  async ({ name, schoolId }: { name: string; schoolId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getByNameAndSchool(name, schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department');
    }
  }
);

export const fetchDepartmentByDepartmentHead = createAsyncThunk(
  'departments/fetchDepartmentByDepartmentHead',
  async (departmentHeadId: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getByDepartmentHead(departmentHeadId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department');
    }
  }
);

export const fetchDepartmentsByTeacher = createAsyncThunk(
  'departments/fetchDepartmentsByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const fetchDepartmentBySubject = createAsyncThunk(
  'departments/fetchDepartmentBySubject',
  async (subjectId: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getBySubject(subjectId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData: CreateDepartmentRequest, { rejectWithValue }) => {
    try {
      const response = await departmentApi.create(departmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, departmentData }: { id: number; departmentData: UpdateDepartmentRequest }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.update(id, departmentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
    }
  }
);

export const activateDepartment = createAsyncThunk(
  'departments/activateDepartment',
  async (id: number, { rejectWithValue }) => {
    try {
      await departmentApi.activate(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate department');
    }
  }
);

export const deactivateDepartment = createAsyncThunk(
  'departments/deactivateDepartment',
  async (id: number, { rejectWithValue }) => {
    try {
      await departmentApi.deactivate(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate department');
    }
  }
);

export const assignDepartmentHead = createAsyncThunk(
  'departments/assignDepartmentHead',
  async ({ departmentId, userId }: { departmentId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.assignDepartmentHead(departmentId, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign department head');
    }
  }
);

export const removeDepartmentHead = createAsyncThunk(
  'departments/removeDepartmentHead',
  async (departmentId: number, { rejectWithValue }) => {
    try {
      const response = await departmentApi.removeDepartmentHead(departmentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove department head');
    }
  }
);

export const assignTeacherToDepartment = createAsyncThunk(
  'departments/assignTeacher',
  async ({ departmentId, teacherId }: { departmentId: number; teacherId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.assignTeacher(departmentId, teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign teacher');
    }
  }
);

export const removeTeacherFromDepartment = createAsyncThunk(
  'departments/removeTeacher',
  async ({ departmentId, teacherId }: { departmentId: number; teacherId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.removeTeacher(departmentId, teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove teacher');
    }
  }
);

export const assignSubjectToDepartment = createAsyncThunk(
  'departments/assignSubject',
  async ({ departmentId, subjectId }: { departmentId: number; subjectId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.assignSubject(departmentId, subjectId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign subject');
    }
  }
);

export const removeSubjectFromDepartment = createAsyncThunk(
  'departments/removeSubject',
  async ({ departmentId, subjectId }: { departmentId: number; subjectId: number }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.removeSubject(departmentId, subjectId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove subject');
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearCurrentDepartment: (state) => {
      state.currentDepartment = null;
    },
    clearDepartmentsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all departments
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch departments';
      })

      // Fetch department by ID
      .addCase(fetchDepartmentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentDepartment = action.payload as Department;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch department';
      })

      // Fetch departments by school
      .addCase(fetchDepartmentsBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDepartmentsBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDepartmentsBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch departments';
      })

      // Fetch active departments by school
      .addCase(fetchActiveDepartmentsBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveDepartmentsBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveDepartmentsBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active departments';
      })

      // Fetch active departments
      .addCase(fetchActiveDepartments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active departments';
      })

      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.departments.push(action.payload as Department);
        }
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create department';
      })

      // Update department
      .addCase(updateDepartment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update department';
      })

      // Delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const departmentId = action.payload.id;
        state.departments = state.departments.filter(dept => dept.id !== departmentId);
        if (state.currentDepartment && state.currentDepartment.id === departmentId) {
          state.currentDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete department';
      })

      // Activate department
      .addCase(activateDepartment.pending, (state) => {
        state.error = null;
      })
      .addCase(activateDepartment.fulfilled, (state, action) => {
        const departmentId = action.payload.id;
        const index = state.departments.findIndex(dept => dept.id === departmentId);
        if (index !== -1) {
          state.departments[index].active = true;
        }
        if (state.currentDepartment && state.currentDepartment.id === departmentId) {
          state.currentDepartment.active = true;
        }
      })
      .addCase(activateDepartment.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to activate department';
      })

      // Deactivate department
      .addCase(deactivateDepartment.pending, (state) => {
        state.error = null;
      })
      .addCase(deactivateDepartment.fulfilled, (state, action) => {
        const departmentId = action.payload.id;
        const index = state.departments.findIndex(dept => dept.id === departmentId);
        if (index !== -1) {
          state.departments[index].active = false;
        }
        if (state.currentDepartment && state.currentDepartment.id === departmentId) {
          state.currentDepartment.active = false;
        }
      })
      .addCase(deactivateDepartment.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to deactivate department';
      })

      // Assign department head
      .addCase(assignDepartmentHead.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(assignDepartmentHead.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to assign department head';
      })

      // Remove department head
      .addCase(removeDepartmentHead.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(removeDepartmentHead.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to remove department head';
      })

      // Assign teacher
      .addCase(assignTeacherToDepartment.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(assignTeacherToDepartment.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to assign teacher';
      })

      // Remove teacher
      .addCase(removeTeacherFromDepartment.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(removeTeacherFromDepartment.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to remove teacher';
      })

      // Assign subject
      .addCase(assignSubjectToDepartment.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(assignSubjectToDepartment.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to assign subject';
      })

      // Remove subject
      .addCase(removeSubjectFromDepartment.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedDepartment = action.payload as Department;
          const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          }
          if (state.currentDepartment && state.currentDepartment.id === updatedDepartment.id) {
            state.currentDepartment = updatedDepartment;
          }
        }
      })
      .addCase(removeSubjectFromDepartment.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to remove subject';
      });
  }
});

export const { clearCurrentDepartment, clearDepartmentsError } = departmentsSlice.actions;

export default departmentsSlice.reducer; 