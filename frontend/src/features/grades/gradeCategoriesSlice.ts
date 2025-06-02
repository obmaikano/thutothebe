import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gradeCategoryApi, { GradeCategory, CreateGradeCategoryRequest, UpdateGradeCategoryRequest } from '../../api/services/gradeCategoryApi';

export interface GradeCategoriesState {
  gradeCategories: GradeCategory[];
  currentGradeCategory: GradeCategory | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GradeCategoriesState = {
  gradeCategories: [],
  currentGradeCategory: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchGradeCategories = createAsyncThunk(
  'gradeCategories/fetchGradeCategories',
  async (courseId: number | undefined, { rejectWithValue }) => {
    try {
      const response = courseId 
        ? await gradeCategoryApi.getByCourse(courseId)
        : await gradeCategoryApi.getAll();
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch grade categories';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGradeCategoryById = createAsyncThunk(
  'gradeCategories/fetchGradeCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getById(id);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch grade category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchActiveCategoriesByCourse = createAsyncThunk(
  'gradeCategories/fetchActiveCategoriesByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.getActiveByCourse(courseId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active grade categories';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createGradeCategory = createAsyncThunk(
  'gradeCategories/createGradeCategory',
  async (categoryData: CreateGradeCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.create(categoryData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create grade category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateGradeCategory = createAsyncThunk(
  'gradeCategories/updateGradeCategory',
  async ({ id, categoryData }: { id: number; categoryData: UpdateGradeCategoryRequest }, { rejectWithValue }) => {
    try {
      const response = await gradeCategoryApi.update(id, categoryData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update grade category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteGradeCategory = createAsyncThunk(
  'gradeCategories/deleteGradeCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await gradeCategoryApi.delete(id);
      return { id };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete grade category';
      return rejectWithValue(errorMessage);
    }
  }
);

const gradeCategoriesSlice = createSlice({
  name: 'gradeCategories',
  initialState,
  reducers: {
    clearCurrentGradeCategory: (state) => {
      state.currentGradeCategory = null;
    },
    clearGradeCategoriesError: (state) => {
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
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.currentGradeCategory = action.payload as GradeCategory;
        }
      })
      .addCase(fetchGradeCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch grade category';
      })
      
      // Fetch active categories by course
      .addCase(fetchActiveCategoriesByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.gradeCategories = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Create grade category
      .addCase(createGradeCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createGradeCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.gradeCategories.push(action.payload as GradeCategory);
        }
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
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          const updatedCategory = action.payload as GradeCategory;
          const index = state.gradeCategories.findIndex(category => category.id === updatedCategory.id);
          if (index !== -1) {
            state.gradeCategories[index] = updatedCategory;
          }
          if (state.currentGradeCategory?.id === updatedCategory.id) {
            state.currentGradeCategory = updatedCategory;
          }
        }
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
        state.gradeCategories = state.gradeCategories.filter(category => category.id !== action.payload.id);
        if (state.currentGradeCategory?.id === action.payload.id) {
          state.currentGradeCategory = null;
        }
      })
      .addCase(deleteGradeCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete grade category';
      });
  },
});

export const { clearCurrentGradeCategory, clearGradeCategoriesError } = gradeCategoriesSlice.actions;

export default gradeCategoriesSlice.reducer; 