import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentApi, { Student, CreateStudentRequest, UpdateStudentRequest } from '../../api/services/studentApi';

export interface StudentsState {
  students: Student[];
  currentStudent: Student | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  currentStudent: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await studentApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student');
    }
  }
);

export const fetchStudentByAdmissionNumber = createAsyncThunk(
  'students/fetchStudentByAdmissionNumber',
  async (admissionNumber: string, { rejectWithValue }) => {
    try {
      const response = await studentApi.getByAdmissionNumber(admissionNumber);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student');
    }
  }
);

export const fetchActiveStudents = createAsyncThunk(
  'students/fetchActiveStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApi.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active students');
    }
  }
);

export const fetchStudentsByCourse = createAsyncThunk(
  'students/fetchStudentsByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await studentApi.getByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students by course');
    }
  }
);

export const fetchStudentsByClass = createAsyncThunk(
  'students/fetchStudentsByClass',
  async (classId: number, { rejectWithValue }) => {
    try {
      const response = await studentApi.getByClass(classId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students by class');
    }
  }
);

export const fetchStudentsBySchool = createAsyncThunk(
  'students/fetchStudentsBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await studentApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students by school');
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData: CreateStudentRequest, { rejectWithValue }) => {
    try {
      const response = await studentApi.create(studentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create student');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, studentData }: { id: number; studentData: UpdateStudentRequest }, { rejectWithValue }) => {
    try {
      const response = await studentApi.update(id, studentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: number, { rejectWithValue }) => {
    try {
      await studentApi.delete(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete student');
    }
  }
);

export const activateStudent = createAsyncThunk(
  'students/activateStudent',
  async (id: number, { rejectWithValue }) => {
    try {
      await studentApi.activate(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate student');
    }
  }
);

export const deactivateStudent = createAsyncThunk(
  'students/deactivateStudent',
  async (id: number, { rejectWithValue }) => {
    try {
      await studentApi.deactivate(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate student');
    }
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
    clearStudentsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all students
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch students';
      })

      // Fetch student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentStudent = action.payload as Student;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student';
      })

      // Fetch student by admission number
      .addCase(fetchStudentByAdmissionNumber.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentByAdmissionNumber.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentStudent = action.payload as Student;
      })
      .addCase(fetchStudentByAdmissionNumber.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student';
      })

      // Fetch active students
      .addCase(fetchActiveStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active students';
      })

      // Fetch students by course
      .addCase(fetchStudentsByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentsByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch students by course';
      })

      // Fetch students by class
      .addCase(fetchStudentsByClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentsByClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentsByClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch students by class';
      })

      // Fetch students by school
      .addCase(fetchStudentsBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentsBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentsBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch students by school';
      })

      // Create student
      .addCase(createStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students.push(action.payload as Student);
        state.currentStudent = action.payload as Student;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create student';
      })

      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedStudent = action.payload as Student;
        const index = state.students.findIndex(student => student.id === updatedStudent.id);
        if (index !== -1) {
          state.students[index] = updatedStudent;
        }
        state.currentStudent = updatedStudent;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update student';
      })

      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.students = state.students.filter(student => student.id !== id);
        if (state.currentStudent?.id === id) {
          state.currentStudent = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete student';
      })

      // Activate student
      .addCase(activateStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.students.findIndex(student => student.id === id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], active: true };
        }
        if (state.currentStudent?.id === id) {
          state.currentStudent = { ...state.currentStudent, active: true };
        }
      })
      .addCase(activateStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate student';
      })

      // Deactivate student
      .addCase(deactivateStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.students.findIndex(student => student.id === id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], active: false };
        }
        if (state.currentStudent?.id === id) {
          state.currentStudent = { ...state.currentStudent, active: false };
        }
      })
      .addCase(deactivateStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate student';
      });
  }
});

export const { clearCurrentStudent, clearStudentsError } = studentsSlice.actions;
export default studentsSlice.reducer; 