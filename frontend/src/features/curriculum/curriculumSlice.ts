import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import curriculumApi, { Curriculum, CreateCurriculumRequest, UpdateCurriculumRequest } from '../../api/services/curriculumApi';

export interface CurriculumState {
  curricula: Curriculum[];
  currentCurriculum: Curriculum | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedGradeLevel: string;
  selectedType: string;
  selectedStatus: string;
}

const initialState: CurriculumState = {
  curricula: [],
  currentCurriculum: null,
  status: 'idle',
  error: null,
  selectedGradeLevel: '',
  selectedType: '',
  selectedStatus: ''
};

// Async thunks
export const fetchCurricula = createAsyncThunk(
  'curriculum/fetchCurricula',
  async (_, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula');
    }
  }
);

export const fetchCurriculumById = createAsyncThunk(
  'curriculum/fetchCurriculumById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum');
    }
  }
);

export const fetchActiveCurricula = createAsyncThunk(
  'curriculum/fetchActiveCurricula',
  async (_, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active curricula');
    }
  }
);

export const fetchCurriculaByStatus = createAsyncThunk(
  'curriculum/fetchCurriculaByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula by status');
    }
  }
);

export const fetchCurriculaByType = createAsyncThunk(
  'curriculum/fetchCurriculaByType',
  async (type: string, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getByType(type);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula by type');
    }
  }
);

export const fetchCurriculaByGradeLevel = createAsyncThunk(
  'curriculum/fetchCurriculaByGradeLevel',
  async (gradeLevel: string, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getByGradeLevel(gradeLevel);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula by grade level');
    }
  }
);

export const fetchCurriculaByAcademicYear = createAsyncThunk(
  'curriculum/fetchCurriculaByAcademicYear',
  async (academicYear: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getByAcademicYear(academicYear);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula by academic year');
    }
  }
);

export const fetchCurriculaByRegion = createAsyncThunk(
  'curriculum/fetchCurriculaByRegion',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getByRegion(regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula by region');
    }
  }
);

export const fetchCurriculaBySchool = createAsyncThunk(
  'curriculum/fetchCurriculaBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curricula by school');
    }
  }
);

export const searchCurriculaByTitle = createAsyncThunk(
  'curriculum/searchCurriculaByTitle',
  async (title: string, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.searchByTitle(title);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search curricula');
    }
  }
);

export const createCurriculum = createAsyncThunk(
  'curriculum/createCurriculum',
  async (curriculumData: CreateCurriculumRequest, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.create(curriculumData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create curriculum');
    }
  }
);

export const updateCurriculum = createAsyncThunk(
  'curriculum/updateCurriculum',
  async ({ id, curriculumData }: { id: number; curriculumData: UpdateCurriculumRequest }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.update(id, curriculumData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update curriculum');
    }
  }
);

export const deleteCurriculum = createAsyncThunk(
  'curriculum/deleteCurriculum',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete curriculum');
    }
  }
);

export const approveCurriculum = createAsyncThunk(
  'curriculum/approveCurriculum',
  async ({ id, approvedById }: { id: number; approvedById: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.approve(id, approvedById);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve curriculum');
    }
  }
);

export const activateCurriculum = createAsyncThunk(
  'curriculum/activateCurriculum',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.activate(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate curriculum');
    }
  }
);

export const suspendCurriculum = createAsyncThunk(
  'curriculum/suspendCurriculum',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.suspend(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to suspend curriculum');
    }
  }
);

export const archiveCurriculum = createAsyncThunk(
  'curriculum/archiveCurriculum',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.archive(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to archive curriculum');
    }
  }
);

export const duplicateCurriculum = createAsyncThunk(
  'curriculum/duplicateCurriculum',
  async ({ id, newTitle, newAcademicYear }: { id: number; newTitle: string; newAcademicYear: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.duplicate(id, newTitle, newAcademicYear);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to duplicate curriculum');
    }
  }
);

export const checkCurriculumExists = createAsyncThunk(
  'curriculum/checkCurriculumExists',
  async ({ title, gradeLevel, academicYear }: { title: string; gradeLevel: string; academicYear: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.checkExists(title, gradeLevel, academicYear);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check curriculum existence');
    }
  }
);

const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState,
  reducers: {
    clearCurrentCurriculum: (state) => {
      state.currentCurriculum = null;
    },
    clearCurriculumError: (state) => {
      state.error = null;
    },
    setSelectedGradeLevel: (state, action) => {
      state.selectedGradeLevel = action.payload;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all curricula
      .addCase(fetchCurricula.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurricula.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curricula = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurricula.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curricula';
      })

      // Fetch curriculum by ID
      .addCase(fetchCurriculumById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculumById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCurriculum = action.payload as Curriculum;
      })
      .addCase(fetchCurriculumById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curriculum';
      })

      // Fetch active curricula
      .addCase(fetchActiveCurricula.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveCurricula.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curricula = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveCurricula.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active curricula';
      })

      // Fetch curricula by status
      .addCase(fetchCurriculaByStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculaByStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curricula = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurriculaByStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curricula by status';
      })

      // Fetch curricula by type
      .addCase(fetchCurriculaByType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculaByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curricula = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurriculaByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curricula by type';
      })

      // Fetch curricula by grade level
      .addCase(fetchCurriculaByGradeLevel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculaByGradeLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curricula = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCurriculaByGradeLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curricula by grade level';
      })

      // Search curricula by title
      .addCase(searchCurriculaByTitle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchCurriculaByTitle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curricula = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchCurriculaByTitle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to search curricula';
      })

      // Create curriculum
      .addCase(createCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.curricula.push(action.payload as Curriculum);
        }
      })
      .addCase(createCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create curriculum';
      })

      // Update curriculum
      .addCase(updateCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedCurriculum = action.payload as Curriculum;
          const index = state.curricula.findIndex(c => c.id === updatedCurriculum.id);
          if (index !== -1) {
            state.curricula[index] = updatedCurriculum;
          }
          if (state.currentCurriculum?.id === updatedCurriculum.id) {
            state.currentCurriculum = updatedCurriculum;
          }
        }
      })
      .addCase(updateCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update curriculum';
      })

      // Delete curriculum
      .addCase(deleteCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const deletedId = action.payload.id;
          state.curricula = state.curricula.filter(c => c.id !== deletedId);
          if (state.currentCurriculum?.id === deletedId) {
            state.currentCurriculum = null;
          }
        }
      })
      .addCase(deleteCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete curriculum';
      })

      // Approve curriculum
      .addCase(approveCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(approveCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const approvedCurriculum = action.payload as Curriculum;
          const index = state.curricula.findIndex(c => c.id === approvedCurriculum.id);
          if (index !== -1) {
            state.curricula[index] = approvedCurriculum;
          }
          if (state.currentCurriculum?.id === approvedCurriculum.id) {
            state.currentCurriculum = approvedCurriculum;
          }
        }
      })
      .addCase(approveCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to approve curriculum';
      })

      // Activate curriculum
      .addCase(activateCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const activatedCurriculum = action.payload as Curriculum;
          const index = state.curricula.findIndex(c => c.id === activatedCurriculum.id);
          if (index !== -1) {
            state.curricula[index] = activatedCurriculum;
          }
          if (state.currentCurriculum?.id === activatedCurriculum.id) {
            state.currentCurriculum = activatedCurriculum;
          }
        }
      })
      .addCase(activateCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate curriculum';
      })

      // Suspend curriculum
      .addCase(suspendCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(suspendCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const suspendedCurriculum = action.payload as Curriculum;
          const index = state.curricula.findIndex(c => c.id === suspendedCurriculum.id);
          if (index !== -1) {
            state.curricula[index] = suspendedCurriculum;
          }
          if (state.currentCurriculum?.id === suspendedCurriculum.id) {
            state.currentCurriculum = suspendedCurriculum;
          }
        }
      })
      .addCase(suspendCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to suspend curriculum';
      })

      // Duplicate curriculum
      .addCase(duplicateCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(duplicateCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.curricula.push(action.payload as Curriculum);
        }
      })
      .addCase(duplicateCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to duplicate curriculum';
      })

      // Check curriculum existence
      .addCase(checkCurriculumExists.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkCurriculumExists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from checkExists
        }
      })
      .addCase(checkCurriculumExists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to check curriculum existence';
      });
  }
});

export const {
  clearCurrentCurriculum,
  clearCurriculumError,
  setSelectedGradeLevel,
  setSelectedType,
  setSelectedStatus
} = curriculumSlice.actions;

export default curriculumSlice.reducer; 