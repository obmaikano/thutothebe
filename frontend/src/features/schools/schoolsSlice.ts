import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import schoolApi, { School, CreateSchoolRequest, UpdateSchoolRequest } from '../../api/services/schoolApi';

export interface SchoolsState {
  schools: School[];
  currentSchool: School | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SchoolsState = {
  schools: [],
  currentSchool: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchSchools = createAsyncThunk(
  'schools/fetchSchools',
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schools');
    }
  }
);

export const fetchSchoolById = createAsyncThunk(
  'schools/fetchSchoolById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school');
    }
  }
);

export const fetchSchoolByCode = createAsyncThunk(
  'schools/fetchSchoolByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getByCode(code);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school');
    }
  }
);

export const fetchSchoolsByRegionId = createAsyncThunk(
  'schools/fetchSchoolsByRegionId',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getByRegionId(regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schools by region');
    }
  }
);

export const fetchActiveSchoolsByRegionId = createAsyncThunk(
  'schools/fetchActiveSchoolsByRegionId',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getActiveByRegionId(regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active schools by region');
    }
  }
);

export const createSchool = createAsyncThunk(
  'schools/createSchool',
  async (schoolData: CreateSchoolRequest, { rejectWithValue }) => {
    try {
      const response = await schoolApi.create(schoolData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create school');
    }
  }
);

export const updateSchool = createAsyncThunk(
  'schools/updateSchool',
  async ({ id, schoolData }: { id: number; schoolData: UpdateSchoolRequest }, { rejectWithValue }) => {
    try {
      const response = await schoolApi.update(id, schoolData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update school');
    }
  }
);

export const deleteSchool = createAsyncThunk(
  'schools/deleteSchool',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await schoolApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete school');
    }
  }
);

export const activateSchool = createAsyncThunk(
  'schools/activateSchool',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await schoolApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate school');
    }
  }
);

export const deactivateSchool = createAsyncThunk(
  'schools/deactivateSchool',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await schoolApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate school');
    }
  }
);

const schoolsSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    clearCurrentSchool: (state) => {
      state.currentSchool = null;
    },
    clearSchoolsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all schools
      .addCase(fetchSchools.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch schools';
      })

      // Fetch school by ID
      .addCase(fetchSchoolById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchool = action.payload as School;
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school';
      })

      // Fetch school by code
      .addCase(fetchSchoolByCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolByCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchool = action.payload as School;
      })
      .addCase(fetchSchoolByCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school';
      })

      // Fetch schools by region ID
      .addCase(fetchSchoolsByRegionId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolsByRegionId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchoolsByRegionId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch schools by region';
      })

      // Fetch active schools by region ID
      .addCase(fetchActiveSchoolsByRegionId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveSchoolsByRegionId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveSchoolsByRegionId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active schools by region';
      })

      // Create school
      .addCase(createSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools.push(action.payload as School);
        state.currentSchool = action.payload as School;
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create school';
      })

      // Update school
      .addCase(updateSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSchool = action.payload as School;
        const index = state.schools.findIndex(school => school.id === updatedSchool.id);
        if (index !== -1) {
          state.schools[index] = updatedSchool;
        }
        state.currentSchool = updatedSchool;
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update school';
      })

      // Delete school
      .addCase(deleteSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.schools = state.schools.filter(school => school.id !== id);
        if (state.currentSchool?.id === id) {
          state.currentSchool = null;
        }
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete school';
      })

      // Activate school
      .addCase(activateSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.schools.findIndex(school => school.id === id);
        if (index !== -1) {
          state.schools[index] = { ...state.schools[index], active: true };
        }
        if (state.currentSchool?.id === id) {
          state.currentSchool = { ...state.currentSchool, active: true };
        }
      })
      .addCase(activateSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate school';
      })

      // Deactivate school
      .addCase(deactivateSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.schools.findIndex(school => school.id === id);
        if (index !== -1) {
          state.schools[index] = { ...state.schools[index], active: false };
        }
        if (state.currentSchool?.id === id) {
          state.currentSchool = { ...state.currentSchool, active: false };
        }
      })
      .addCase(deactivateSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate school';
      });
  }
});

export const { clearCurrentSchool, clearSchoolsError } = schoolsSlice.actions;
export default schoolsSlice.reducer; 