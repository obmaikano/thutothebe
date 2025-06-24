import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classApi, { Class, CreateClassRequest, UpdateClassRequest } from '../../api/services/classApi';

export interface ClassesState {
  classes: Class[];
  currentClass: Class | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  currentClass: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class');
    }
  }
);

export const fetchClassesBySchoolId = createAsyncThunk(
  'classes/fetchClassesBySchoolId',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

export const fetchActiveClasses = createAsyncThunk(
  'classes/fetchActiveClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getActiveClasses();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active classes');
    }
  }
);

export const fetchClassWithStudents = createAsyncThunk(
  'classes/fetchClassWithStudents',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getByIdWithStudents(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class with students');
    }
  }
);

export const fetchEnrolledStudents = createAsyncThunk(
  'classes/fetchEnrolledStudents',
  async (classId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getEnrolledStudents(classId);
      return { classId, students: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrolled students');
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData: CreateClassRequest, { rejectWithValue }) => {
    try {
      const response = await classApi.create(classData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create class');
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, classData }: { id: number; classData: UpdateClassRequest }, { rejectWithValue }) => {
    try {
      const response = await classApi.update(id, classData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update class');
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await classApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete class');
    }
  }
);

export const activateClass = createAsyncThunk(
  'classes/activateClass',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await classApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate class');
    }
  }
);

export const deactivateClass = createAsyncThunk(
  'classes/deactivateClass',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await classApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate class');
    }
  }
);

export const addStudentToClass = createAsyncThunk(
  'classes/addStudent',
  async ({ classId, studentId }: { classId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await classApi.addStudentToClass(classId, studentId);
      return response.data.data;
    } catch (error: any) {
      // Handle specific database constraint errors
      if (error.response?.data?.message?.includes('duplicate key value violates unique constraint')) {
        return rejectWithValue('Student is already enrolled in this class');
      }
      if (error.response?.data?.message?.includes('class_students_pkey')) {
        return rejectWithValue('Student is already enrolled in this class');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to add student to class');
    }
  }
);

export const removeStudentFromClass = createAsyncThunk(
  'classes/removeStudent',
  async ({ classId, studentId }: { classId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await classApi.removeStudentFromClass(classId, studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove student from class');
    }
  }
);

export const assignTeacherToClass = createAsyncThunk(
  'classes/assignTeacher',
  async ({ classId, teacherId }: { classId: number; teacherId: number }, { rejectWithValue }) => {
    try {
      const response = await classApi.assignTeacherToClass(classId, teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign teacher to class');
    }
  }
);

export const removeTeacherFromClass = createAsyncThunk(
  'classes/removeTeacher',
  async ({ classId, teacherId }: { classId: number; teacherId: number }, { rejectWithValue }) => {
    try {
      const response = await classApi.removeTeacherFromClass(classId, teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove teacher from class');
    }
  }
);

export const fetchClassesWithTeachers = createAsyncThunk(
  'classes/fetchClassesWithTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getAllWithTeachers();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes with teachers');
    }
  }
);

// Teacher-related async thunks
export const fetchClassesByTeacherId = createAsyncThunk(
  'classes/fetchClassesByTeacherId',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes by teacher');
    }
  }
);

export const fetchActiveClassesByTeacherId = createAsyncThunk(
  'classes/fetchActiveClassesByTeacherId',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getActiveByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active classes by teacher');
    }
  }
);

export const fetchAllClassesByTeacherId = createAsyncThunk(
  'classes/fetchAllClassesByTeacherId',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getAllByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all classes by teacher');
    }
  }
);

// Additional async thunks for other endpoints
export const fetchClassesByStudentId = createAsyncThunk(
  'classes/fetchClassesByStudentId',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getByStudent(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes by student');
    }
  }
);

export const fetchClassesByMinCapacity = createAsyncThunk(
  'classes/fetchClassesByMinCapacity',
  async (minCapacity: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getByMinCapacity(minCapacity);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes by minimum capacity');
    }
  }
);

export const fetchAvailableClasses = createAsyncThunk(
  'classes/fetchAvailableClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getAvailableClasses();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available classes');
    }
  }
);

export const fetchClassesByOverCapacity = createAsyncThunk(
  'classes/fetchClassesByOverCapacity',
  async (overCapacity: boolean, { rejectWithValue }) => {
    try {
      const response = await classApi.getByOverCapacity(overCapacity);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes by over capacity');
    }
  }
);

export const searchClassesByName = createAsyncThunk(
  'classes/searchClassesByName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await classApi.searchByName(name);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search classes by name');
    }
  }
);

export const fetchClassesByRegionId = createAsyncThunk(
  'classes/fetchClassesByRegionId',
  async (regionId: number, { rejectWithValue }) => {
    try {
      const response = await classApi.getByRegion(regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes by region');
    }
  }
);

export const fetchClassesByGradeLevel = createAsyncThunk(
  'classes/fetchClassesByGradeLevel',
  async (gradeLevel: string, { rejectWithValue }) => {
    try {
      const response = await classApi.getByGradeLevel(gradeLevel);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes by grade level');
    }
  }
);

export const fetchClassCount = createAsyncThunk(
  'classes/fetchClassCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getClassCount();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class count');
    }
  }
);

export const fetchTotalEnrollment = createAsyncThunk(
  'classes/fetchTotalEnrollment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getTotalEnrollment();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total enrollment');
    }
  }
);

export const fetchTotalCapacity = createAsyncThunk(
  'classes/fetchTotalCapacity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classApi.getTotalCapacity();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total capacity');
    }
  }
);

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
    clearClassesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all classes
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes';
      })

      // Fetch class by ID
      .addCase(fetchClassById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentClass = action.payload as Class;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch class';
      })

      // Fetch classes by school ID
      .addCase(fetchClassesBySchoolId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesBySchoolId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesBySchoolId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes';
      })

      // Fetch active classes
      .addCase(fetchActiveClasses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active classes';
      })

      // Fetch class with students
      .addCase(fetchClassWithStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassWithStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentClass = action.payload as Class;
      })
      .addCase(fetchClassWithStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch class with students';
      })

      // Fetch enrolled students
      .addCase(fetchEnrolledStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEnrolledStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The API returns void, so we don't update the class object here
        // The UI should refetch the class data if needed
      })
      .addCase(fetchEnrolledStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch enrolled students';
      })

      // Create class
      .addCase(createClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes.push(action.payload as Class);
        state.currentClass = action.payload as Class;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create class';
      })

      // Update class
      .addCase(updateClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedClass = action.payload as Class;
        const index = state.classes.findIndex(cls => cls.id === updatedClass.id);
        if (index !== -1) {
          state.classes[index] = updatedClass;
        }
        state.currentClass = updatedClass;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update class';
      })

      // Delete class
      .addCase(deleteClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.classes = state.classes.filter(cls => cls.id !== id);
        if (state.currentClass?.id === id) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete class';
      })

      // Activate class
      .addCase(activateClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.classes.findIndex(cls => cls.id === id);
        if (index !== -1) {
          state.classes[index] = { ...state.classes[index], active: true };
        }
        if (state.currentClass?.id === id) {
          state.currentClass = { ...state.currentClass, active: true };
        }
      })
      .addCase(activateClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate class';
      })

      // Deactivate class
      .addCase(deactivateClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.classes.findIndex(cls => cls.id === id);
        if (index !== -1) {
          state.classes[index] = { ...state.classes[index], active: false };
        }
        if (state.currentClass?.id === id) {
          state.currentClass = { ...state.currentClass, active: false };
        }
      })
      .addCase(deactivateClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate class';
      })

      // Add student to class
      .addCase(addStudentToClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addStudentToClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The API returns void, so we don't update the class object here
        // The UI should refetch the class data if needed
      })
      .addCase(addStudentToClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to add student to class';
      })

      // Remove student from class
      .addCase(removeStudentFromClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The API returns void, so we don't update the class object here
        // The UI should refetch the class data if needed
      })
      .addCase(removeStudentFromClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to remove student from class';
      })

      // Assign teacher to class
      .addCase(assignTeacherToClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(assignTeacherToClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Since the API returns void, we need to refetch the classes to get updated data
        // The UI should dispatch fetchClasses after this action completes
      })
      .addCase(assignTeacherToClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to assign teacher to class';
      })

      // Remove teacher from class
      .addCase(removeTeacherFromClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeTeacherFromClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Since the API returns void, we need to refetch the classes to get updated data
        // The UI should dispatch fetchClasses after this action completes
      })
      .addCase(removeTeacherFromClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to remove teacher from class';
      })

      // Fetch classes with teachers
      .addCase(fetchClassesWithTeachers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesWithTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesWithTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes with teachers';
      })

      // Fetch classes by teacher ID
      .addCase(fetchClassesByTeacherId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesByTeacherId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesByTeacherId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes by teacher';
      })

      // Fetch active classes by teacher ID
      .addCase(fetchActiveClassesByTeacherId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveClassesByTeacherId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveClassesByTeacherId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active classes by teacher';
      })

      // Fetch all classes by teacher ID
      .addCase(fetchAllClassesByTeacherId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllClassesByTeacherId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllClassesByTeacherId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch all classes by teacher';
      })

      // Fetch classes by student ID
      .addCase(fetchClassesByStudentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesByStudentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesByStudentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes by student';
      })

      // Fetch classes by minimum capacity
      .addCase(fetchClassesByMinCapacity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesByMinCapacity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesByMinCapacity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes by minimum capacity';
      })

      // Fetch available classes
      .addCase(fetchAvailableClasses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAvailableClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAvailableClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch available classes';
      })

      // Fetch classes by over capacity
      .addCase(fetchClassesByOverCapacity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesByOverCapacity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesByOverCapacity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes by over capacity';
      })

      // Search classes by name
      .addCase(searchClassesByName.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchClassesByName.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchClassesByName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to search classes by name';
      })

      // Fetch classes by region ID
      .addCase(fetchClassesByRegionId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesByRegionId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesByRegionId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes by region';
      })

      // Fetch classes by grade level
      .addCase(fetchClassesByGradeLevel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassesByGradeLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClassesByGradeLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch classes by grade level';
      })

      // Fetch class count
      .addCase(fetchClassCount.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClassCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The API returns void, so we don't update the class object here
        // The UI should refetch the class data if needed
      })
      .addCase(fetchClassCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch class count';
      })

      // Fetch total enrollment
      .addCase(fetchTotalEnrollment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalEnrollment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The API returns void, so we don't update the class object here
        // The UI should refetch the class data if needed
      })
      .addCase(fetchTotalEnrollment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch total enrollment';
      })

      // Fetch total capacity
      .addCase(fetchTotalCapacity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalCapacity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The API returns void, so we don't update the class object here
        // The UI should refetch the class data if needed
      })
      .addCase(fetchTotalCapacity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch total capacity';
      });
  }
});

export const { clearCurrentClass, clearClassesError } = classesSlice.actions;
export default classesSlice.reducer; 