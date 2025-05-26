import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import courseApi, { Course, CreateCourseRequest, UpdateCourseRequest } from '../../api/services/courseApi';

export interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await courseApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData: CreateCourseRequest, { rejectWithValue }) => {
    try {
      const response = await courseApi.create(courseData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }: { id: number; courseData: UpdateCourseRequest }, { rejectWithValue }) => {
    try {
      const response = await courseApi.update(id, courseData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await courseApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

export const activateCourse = createAsyncThunk(
  'courses/activateCourse',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await courseApi.activate(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate course');
    }
  }
);

export const deactivateCourse = createAsyncThunk(
  'courses/deactivateCourse',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await courseApi.deactivate(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate course');
    }
  }
);

export const addTeacherToCourse = createAsyncThunk(
  'courses/addTeacher',
  async ({ 
    courseId, 
    teacherId, 
    isPrimary = false 
  }: { 
    courseId: number; 
    teacherId: number; 
    isPrimary?: boolean 
  }, { rejectWithValue }) => {
    try {
      const response = await courseApi.addTeacherToCourse(courseId, teacherId, isPrimary);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add teacher to course');
    }
  }
);

export const removeTeacherFromCourse = createAsyncThunk(
  'courses/removeTeacher',
  async ({ courseId, teacherId }: { courseId: number; teacherId: number }, { rejectWithValue }) => {
    try {
      const response = await courseApi.removeTeacherFromCourse(courseId, teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove teacher from course');
    }
  }
);

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
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch courses';
      })

      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCourse = action.payload as Course;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch course';
      })

      // Create course
      .addCase(createCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses.push(action.payload as Course);
        state.currentCourse = action.payload as Course;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create course';
      })

      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedCourse = action.payload as Course;
        const index = state.courses.findIndex(course => course.id === updatedCourse.id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
        state.currentCourse = updatedCourse;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update course';
      })

      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.courses = state.courses.filter(course => course.id !== id);
        if (state.currentCourse?.id === id) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete course';
      })

      // Activate course
      .addCase(activateCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const courseId = action.meta.arg;
        const index = state.courses.findIndex(course => course.id === courseId);
        if (index !== -1) {
          state.courses[index] = { ...state.courses[index], active: true };
        }
        if (state.currentCourse?.id === courseId) {
          state.currentCourse = { ...state.currentCourse, active: true };
        }
      })
      .addCase(activateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate course';
      })

      // Deactivate course
      .addCase(deactivateCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const courseId = action.meta.arg;
        const index = state.courses.findIndex(course => course.id === courseId);
        if (index !== -1) {
          state.courses[index] = { ...state.courses[index], active: false };
        }
        if (state.currentCourse?.id === courseId) {
          state.currentCourse = { ...state.currentCourse, active: false };
        }
      })
      .addCase(deactivateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate course';
      })

      // Add teacher to course
      .addCase(addTeacherToCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTeacherToCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Backend returns null data, so we just mark the operation as successful
        // The UI should refresh the data separately if needed
      })
      .addCase(addTeacherToCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to add teacher to course';
      })

      // Remove teacher from course
      .addCase(removeTeacherFromCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeTeacherFromCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Backend returns null data, so we just mark the operation as successful
        // The UI should refresh the data separately if needed
      })
      .addCase(removeTeacherFromCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to remove teacher from course';
      });
  }
});

export const { clearCurrentCourse, clearCoursesError } = coursesSlice.actions;
export default coursesSlice.reducer; 