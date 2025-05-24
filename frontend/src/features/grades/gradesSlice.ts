import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gradeCategoryApi, { GradeCategory, CreateGradeCategoryRequest, UpdateGradeCategoryRequest } from '../../api/services/gradeCategoryApi';

export interface GradesState {
  gradeCategories: GradeCategory[];
  currentGradeCategory: GradeCategory | null;
  totalWeight: number | null;
  averagePassingGrade: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GradesState = {
  gradeCategories: [],
  currentGradeCategory: null,
  totalWeight: null,
  averagePassingGrade: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchGradeCategories = createAsyncThunk(
  'grades/fetchGradeCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grade categories');
    }
  }
);

export const fetchGradeCategoryById = createAsyncThunk(
  'grades/fetchGradeCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grade category');
    }
  }
);

export const fetchGradeCategoriesByCourse = createAsyncThunk(
  'grades/fetchGradeCategoriesByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grade categories by course');
    }
  }
);

export const fetchActiveGradeCategoriesByCourse = createAsyncThunk(
  'grades/fetchActiveGradeCategoriesByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getActiveByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active grade categories by course');
    }
  }
);

export const fetchTotalWeightByCourse = createAsyncThunk(
  'grades/fetchTotalWeightByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getTotalWeightByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total weight by course');
    }
  }
);

export const fetchAveragePassingGradeByCourse = createAsyncThunk(
  'grades/fetchAveragePassingGradeByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getAveragePassingGradeByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch average passing grade by course');
    }
  }
);

export const createGradeCategory = createAsyncThunk(
  'grades/createGradeCategory',
  async (gradeCategoryData: CreateGradeCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.create(gradeCategoryData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grade category');
    }
  }
);

export const updateGradeCategory = createAsyncThunk(
  'grades/updateGradeCategory',
  async ({ id, gradeCategoryData }: { id: number; gradeCategoryData: UpdateGradeCategoryRequest }, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.update(id, gradeCategoryData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update grade category');
    }
  }
);

export const deleteGradeCategory = createAsyncThunk(
  'grades/deleteGradeCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await gradeCategoryApi.delete(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete grade category');
    }
  }
);

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    clearCurrentGradeCategory: (state) => {
      state.currentGradeCategory = null;
    },
    clearGradesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all grade categories
      .addCase(fetchGradeCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGradeCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.gradeCategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGradeCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch grade categories';
      })

      // Fetch grade category by ID
      .addCase(fetchGradeCategoryById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGradeCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentGradeCategory = action.payload as GradeCategory;
      })
      .addCase(fetchGradeCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch grade category';
      })

      // Fetch grade categories by course
      .addCase(fetchGradeCategoriesByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGradeCategoriesByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.gradeCategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGradeCategoriesByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch grade categories by course';
      })

      // Fetch active grade categories by course
      .addCase(fetchActiveGradeCategoriesByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveGradeCategoriesByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.gradeCategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveGradeCategoriesByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active grade categories by course';
      })

      // Fetch total weight by course
      .addCase(fetchTotalWeightByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalWeightByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalWeight = action.payload as number;
      })
      .addCase(fetchTotalWeightByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch total weight by course';
      })

      // Fetch average passing grade by course
      .addCase(fetchAveragePassingGradeByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAveragePassingGradeByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.averagePassingGrade = action.payload as number;
      })
      .addCase(fetchAveragePassingGradeByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch average passing grade by course';
      })

      // Create grade category
      .addCase(createGradeCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createGradeCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.gradeCategories.push(action.payload as GradeCategory);
        state.currentGradeCategory = action.payload as GradeCategory;
      })
      .addCase(createGradeCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create grade category';
      })

      // Update grade category
      .addCase(updateGradeCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateGradeCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedGradeCategory = action.payload as GradeCategory;
        const index = state.gradeCategories.findIndex(category => category.id === updatedGradeCategory.id);
        if (index !== -1) {
          state.gradeCategories[index] = updatedGradeCategory;
        }
        state.currentGradeCategory = updatedGradeCategory;
      })
      .addCase(updateGradeCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update grade category';
      })

      // Delete grade category
      .addCase(deleteGradeCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteGradeCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.gradeCategories = state.gradeCategories.filter(category => category.id !== id);
        if (state.currentGradeCategory?.id === id) {
          state.currentGradeCategory = null;
        }
      })
      .addCase(deleteGradeCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete grade category';
      });
  }
});

export const { clearCurrentGradeCategory, clearGradesError } = gradesSlice.actions;
export default gradesSlice.reducer; 