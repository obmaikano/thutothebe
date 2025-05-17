import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { api } from '../../api';

export type CourseStatus = 'active' | 'inactive' | 'upcoming' | 'completed' | 'cancelled';

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  credits: number;
  instructor: string;
  department: string;
  status: CourseStatus;
  enrollmentCount: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null
};

interface CoursesQueryParams {
  searchTerm?: string;
  department?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params: CoursesQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }: { id: string; courseData: Partial<Course> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

// Slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearCoursesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCourses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchCourseById
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.currentCourse = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createCourse
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.courses.push(action.payload);
        state.currentCourse = action.payload;
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateCourse
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        state.currentCourse = action.payload;
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // deleteCourse
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
        state.loading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Actions
export const { clearCurrentCourse, clearCoursesError } = coursesSlice.actions;

// Selectors
export const selectAllCourses = (state: RootState) => state.courses.courses;
export const selectCurrentCourse = (state: RootState) => state.courses.currentCourse;
export const selectCoursesLoading = (state: RootState) => state.courses.loading;
export const selectCoursesError = (state: RootState) => state.courses.error;

export default coursesSlice.reducer; 