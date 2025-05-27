import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gradeApi, { 
  Grade, 
  CreateGradeRequest, 
  UpdateGradeRequest,
  ModerateGradeRequest,
  CreateGradeForAssessmentRequest,
  CreateGradeForAssignmentRequest
} from '../../api/services/gradeApi';

export interface GradesState {
  grades: Grade[];
  currentGrade: Grade | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  statistics: {
    studentAverage?: number;
    courseAverage?: number;
    categoryAverage?: number;
  };
}

const initialState: GradesState = {
  grades: [],
  currentGrade: null,
  status: 'idle',
  error: null,
  statistics: {},
};

// Async thunks
export const fetchGrades = createAsyncThunk(
  'grades/fetchGrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const fetchGradeById = createAsyncThunk(
  'grades/fetchGradeById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grade');
    }
  }
);

export const fetchGradesByStudentId = createAsyncThunk(
  'grades/fetchGradesByStudentId',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getByStudentId(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const fetchGradesByCourseId = createAsyncThunk(
  'grades/fetchGradesByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getByCourseId(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const fetchGradesByStudentAndCourse = createAsyncThunk(
  'grades/fetchGradesByStudentAndCourse',
  async ({ studentId, courseId }: { studentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getByStudentAndCourse(studentId, courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const fetchGradesByAssessmentId = createAsyncThunk(
  'grades/fetchGradesByAssessmentId',
  async (assessmentId: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getByAssessmentId(assessmentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const fetchGradesByAssignmentId = createAsyncThunk(
  'grades/fetchGradesByAssignmentId',
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getByAssignmentId(assignmentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
    }
  }
);

export const fetchStudentAverage = createAsyncThunk(
  'grades/fetchStudentAverage',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getStudentAverage(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student average');
    }
  }
);

export const fetchCourseAverage = createAsyncThunk(
  'grades/fetchCourseAverage',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await gradeApi.getCourseAverage(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course average');
    }
  }
);

export const createGrade = createAsyncThunk(
  'grades/createGrade',
  async (gradeData: CreateGradeRequest, { rejectWithValue }) => {
    try {
      const response = await gradeApi.create(gradeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grade');
    }
  }
);

export const createGradeForAssessment = createAsyncThunk(
  'grades/createGradeForAssessment',
  async (gradeData: CreateGradeForAssessmentRequest, { rejectWithValue }) => {
    try {
      const response = await gradeApi.createForAssessment(gradeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grade for assessment');
    }
  }
);

export const createGradeForAssignment = createAsyncThunk(
  'grades/createGradeForAssignment',
  async (gradeData: CreateGradeForAssignmentRequest, { rejectWithValue }) => {
    try {
      const response = await gradeApi.createForAssignment(gradeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grade for assignment');
    }
  }
);

export const updateGrade = createAsyncThunk(
  'grades/updateGrade',
  async ({ id, gradeData }: { id: number; gradeData: UpdateGradeRequest }, { rejectWithValue }) => {
    try {
      const response = await gradeApi.update(id, gradeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update grade');
    }
  }
);

export const deleteGrade = createAsyncThunk(
  'grades/deleteGrade',
  async (id: number, { rejectWithValue }) => {
    try {
      await gradeApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete grade');
    }
  }
);

export const moderateGrade = createAsyncThunk(
  'grades/moderateGrade',
  async ({ id, moderationData }: { id: number; moderationData: ModerateGradeRequest }, { rejectWithValue }) => {
    try {
      const response = await gradeApi.moderate(id, moderationData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to moderate grade');
    }
  }
);

export const bulkCreateGrades = createAsyncThunk(
  'grades/bulkCreateGrades',
  async (grades: CreateGradeRequest[], { rejectWithValue }) => {
    try {
      const response = await gradeApi.bulkCreate(grades);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grades');
    }
  }
);

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    clearCurrentGrade: (state) => {
      state.currentGrade = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStatistics: (state) => {
      state.statistics = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch grades
      .addCase(fetchGrades.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch grade by ID
      .addCase(fetchGradeById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGradeById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.currentGrade = action.payload as Grade;
        }
      })
      .addCase(fetchGradeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch grades by student ID
      .addCase(fetchGradesByStudentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch grades by course ID
      .addCase(fetchGradesByCourseId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch grades by student and course
      .addCase(fetchGradesByStudentAndCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch grades by assessment ID
      .addCase(fetchGradesByAssessmentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch grades by assignment ID
      .addCase(fetchGradesByAssignmentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // Fetch student average
      .addCase(fetchStudentAverage.fulfilled, (state, action) => {
        state.statistics.studentAverage = typeof action.payload === 'number' ? action.payload : undefined;
      })
      
      // Fetch course average
      .addCase(fetchCourseAverage.fulfilled, (state, action) => {
        state.statistics.courseAverage = typeof action.payload === 'number' ? action.payload : undefined;
      })
      
      // Create grade
      .addCase(createGrade.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.grades.push(action.payload as Grade);
        }
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create grade for assessment
      .addCase(createGradeForAssessment.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.grades.push(action.payload as Grade);
        }
      })
      
      // Create grade for assignment
      .addCase(createGradeForAssignment.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.grades.push(action.payload as Grade);
        }
      })
      
      // Update grade
      .addCase(updateGrade.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          const updatedGrade = action.payload as Grade;
          const index = state.grades.findIndex(grade => grade.id === updatedGrade.id);
          if (index !== -1) {
            state.grades[index] = updatedGrade;
          }
          if (state.currentGrade?.id === updatedGrade.id) {
            state.currentGrade = updatedGrade;
          }
        }
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete grade
      .addCase(deleteGrade.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = state.grades.filter(grade => grade.id !== action.payload);
        if (state.currentGrade?.id === action.payload) {
          state.currentGrade = null;
        }
      })
      .addCase(deleteGrade.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Moderate grade
      .addCase(moderateGrade.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          const moderatedGrade = action.payload as Grade;
          const index = state.grades.findIndex(grade => grade.id === moderatedGrade.id);
          if (index !== -1) {
            state.grades[index] = moderatedGrade;
          }
          if (state.currentGrade?.id === moderatedGrade.id) {
            state.currentGrade = moderatedGrade;
          }
        }
      })
      
      // Bulk create grades
      .addCase(bulkCreateGrades.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.grades.push(...action.payload);
        }
      });
  },
});

export const { clearCurrentGrade, clearError, clearStatistics } = gradesSlice.actions;

export default gradesSlice.reducer; 