import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import curriculumApi, { Curriculum, CreateCurriculumRequest, UpdateCurriculumRequest } from '../../api/services/curriculumApi';

export interface CurriculumUnit {
  id: number;
  curriculumId: number;
  curriculumTitle?: string;
  title: string;
  description?: string;
  unitOrder: number;
  durationWeeks?: number;
  allocatedHours?: number;
  learningObjectives?: string;
  assessmentCriteria?: string;
  topicIds?: number[];
  topicTitles?: string[];
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CurriculumTopic {
  id: number;
  curriculumUnitId: number;
  title: string;
  description?: string;
  topicOrder: number;
  durationHours?: number;
  learningObjectives?: string;
  activities?: string;
  resources?: string;
  assessmentMethods?: string;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CurriculumState {
  curricula: Curriculum[];
  currentCurriculum: Curriculum | null;
  units: CurriculumUnit[];
  topics: Record<number, CurriculumTopic[]>; // unitId -> topics[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedGradeLevel: string;
  selectedType: string;
  selectedStatus: string;
}

const initialState: CurriculumState = {
  curricula: [],
  currentCurriculum: null,
  units: [],
  topics: {},
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

export const submitCurriculumForReview = createAsyncThunk(
  'curriculum/submitCurriculumForReview',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.submitForReview(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit curriculum for review');
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

// Subject management thunks
export const addSubjectToCurriculum = createAsyncThunk(
  'curriculum/addSubjectToCurriculum',
  async ({ curriculumId, subjectId, isCore, allocatedHours, weightPercentage }: { 
    curriculumId: number; 
    subjectId: number; 
    isCore?: boolean; 
    allocatedHours?: number; 
    weightPercentage?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.addSubject(curriculumId, subjectId, isCore, allocatedHours, weightPercentage);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add subject to curriculum');
    }
  }
);

export const removeSubjectFromCurriculum = createAsyncThunk(
  'curriculum/removeSubjectFromCurriculum',
  async ({ curriculumId, subjectId }: { curriculumId: number; subjectId: number }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.removeSubject(curriculumId, subjectId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove subject from curriculum');
    }
  }
);

export const updateCurriculumSubjects = createAsyncThunk(
  'curriculum/updateCurriculumSubjects',
  async ({ curriculumId, subjectIds }: { curriculumId: number; subjectIds: number[] }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.updateSubjects(curriculumId, subjectIds);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update curriculum subjects');
    }
  }
);

// ==================== CURRICULUM UNITS ====================

export const fetchCurriculumUnits = createAsyncThunk(
  'curriculum/fetchCurriculumUnits',
  async (curriculumId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getUnits(curriculumId);
      // The API returns a curriculum with units, we need to extract the units
      const curriculum = response.data.data as Curriculum;
      return { curriculumId, units: [] }; // For now return empty until backend is updated
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum units');
    }
  }
);

export const fetchCurriculumUnitById = createAsyncThunk(
  'curriculum/fetchCurriculumUnitById',
  async (unitId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getUnitById(unitId);
      // For now return a mock unit until backend is updated
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum unit');
    }
  }
);

export const updateCurriculumUnit = createAsyncThunk(
  'curriculum/updateCurriculumUnit',
  async ({ 
    unitId, 
    unitData 
  }: { 
    unitId: number; 
    unitData: {
      title: string;
      description?: string;
      unitOrder?: number;
      durationWeeks?: number;
      allocatedHours?: number;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.updateUnit(unitId, unitData);
      // For now return the unitId until backend is updated
      return { unitId, ...unitData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update curriculum unit');
    }
  }
);

export const deleteCurriculumUnit = createAsyncThunk(
  'curriculum/deleteCurriculumUnit',
  async (unitId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.deleteUnit(unitId);
      return { unitId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete curriculum unit');
    }
  }
);

export const createCurriculumUnit = createAsyncThunk(
  'curriculum/createCurriculumUnit',
  async ({ 
    curriculumId, 
    title, 
    description, 
    unitOrder, 
    durationWeeks, 
    allocatedHours 
  }: { 
    curriculumId: number; 
    title: string; 
    description?: string; 
    unitOrder?: number; 
    durationWeeks?: number; 
    allocatedHours?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.createUnit(curriculumId, title, description, unitOrder, durationWeeks, allocatedHours);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create curriculum unit');
    }
  }
);

// ==================== CURRICULUM TOPICS ====================

export const fetchCurriculumTopics = createAsyncThunk(
  'curriculum/fetchCurriculumTopics',
  async (unitId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getTopics(unitId);
      // For now return empty until backend is updated
      return { unitId, topics: [] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum topics');
    }
  }
);

export const fetchCurriculumTopicById = createAsyncThunk(
  'curriculum/fetchCurriculumTopicById',
  async (topicId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getTopicById(topicId);
      // For now return null until backend is updated
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum topic');
    }
  }
);

export const updateCurriculumTopic = createAsyncThunk(
  'curriculum/updateCurriculumTopic',
  async ({ 
    topicId, 
    topicData 
  }: { 
    topicId: number; 
    topicData: {
      title: string;
      description?: string;
      topicOrder?: number;
      durationHours?: number;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.updateTopic(topicId, topicData);
      // For now return the topicId until backend is updated
      return { topicId, ...topicData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update curriculum topic');
    }
  }
);

export const deleteCurriculumTopic = createAsyncThunk(
  'curriculum/deleteCurriculumTopic',
  async (topicId: number, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.deleteTopic(topicId);
      return { topicId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete curriculum topic');
    }
  }
);

export const createCurriculumTopic = createAsyncThunk(
  'curriculum/createCurriculumTopic',
  async ({ 
    curriculumUnitId, 
    title, 
    description, 
    topicOrder, 
    durationHours 
  }: { 
    curriculumUnitId: number; 
    title: string; 
    description?: string; 
    topicOrder?: number; 
    durationHours?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.createTopic(curriculumUnitId, title, description, topicOrder, durationHours);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create curriculum topic');
    }
  }
);

// ==================== CURRICULUM RECOMMENDATIONS ====================

export const fetchCurriculumRecommendations = createAsyncThunk(
  'curriculum/fetchCurriculumRecommendations',
  async ({ 
    gradeLevel, 
    type, 
    regionId 
  }: { 
    gradeLevel: string; 
    type: string; 
    regionId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getRecommendations(gradeLevel, type, regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch curriculum recommendations');
    }
  }
);

// ==================== CURRICULUM VALIDATION ====================

export const validateCurriculumAlignment = createAsyncThunk(
  'curriculum/validateCurriculumAlignment',
  async ({ 
    curriculumId, 
    regionId 
  }: { 
    curriculumId: number; 
    regionId: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.validateAlignment(curriculumId, regionId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to validate curriculum alignment');
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

      // Submit curriculum for review
      .addCase(submitCurriculumForReview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitCurriculumForReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from submitForReview
        }
      })
      .addCase(submitCurriculumForReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to submit curriculum for review';
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
      })

      // Add subject to curriculum
      .addCase(addSubjectToCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addSubjectToCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from addSubject
        }
      })
      .addCase(addSubjectToCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to add subject to curriculum';
      })

      // Remove subject from curriculum
      .addCase(removeSubjectFromCurriculum.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeSubjectFromCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from removeSubject
        }
      })
      .addCase(removeSubjectFromCurriculum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to remove subject from curriculum';
      })

      // Update curriculum subjects
      .addCase(updateCurriculumSubjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCurriculumSubjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from updateSubjects
        }
      })
      .addCase(updateCurriculumSubjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update curriculum subjects';
      })

      // Create curriculum unit
      .addCase(createCurriculumUnit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCurriculumUnit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from createUnit
        }
      })
      .addCase(createCurriculumUnit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create curriculum unit';
      })

      // Create curriculum topic
      .addCase(createCurriculumTopic.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCurriculumTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from createTopic
        }
      })
      .addCase(createCurriculumTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create curriculum topic';
      })

      // Fetch curriculum recommendations
      .addCase(fetchCurriculumRecommendations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculumRecommendations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from getRecommendations
        }
      })
      .addCase(fetchCurriculumRecommendations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curriculum recommendations';
      })

      // Validate curriculum alignment
      .addCase(validateCurriculumAlignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(validateCurriculumAlignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          // Handle the response from validateAlignment
        }
      })
      .addCase(validateCurriculumAlignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to validate curriculum alignment';
      })

      // Fetch curriculum units
      .addCase(fetchCurriculumUnits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculumUnits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.units = action.payload.units;
        }
      })
      .addCase(fetchCurriculumUnits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curriculum units';
      })

      // Fetch curriculum unit by ID
      .addCase(fetchCurriculumUnitById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculumUnitById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle null response for now
      })
      .addCase(fetchCurriculumUnitById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curriculum unit';
      })

      // Update curriculum unit
      .addCase(updateCurriculumUnit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCurriculumUnit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle update response - for now just mark as succeeded
      })
      .addCase(updateCurriculumUnit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update curriculum unit';
      })

      // Delete curriculum unit
      .addCase(deleteCurriculumUnit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCurriculumUnit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const deletedUnitId = action.payload.unitId;
          state.units = state.units.filter(u => u.id !== deletedUnitId);
          // Also remove topics for this unit
          delete state.topics[deletedUnitId];
        }
      })
      .addCase(deleteCurriculumUnit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete curriculum unit';
      })

      // Fetch curriculum topics
      .addCase(fetchCurriculumTopics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculumTopics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const { unitId, topics } = action.payload;
          state.topics[unitId] = topics;
        }
      })
      .addCase(fetchCurriculumTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curriculum topics';
      })

      // Fetch curriculum topic by ID
      .addCase(fetchCurriculumTopicById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurriculumTopicById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle null response for now
      })
      .addCase(fetchCurriculumTopicById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch curriculum topic';
      })

      // Update curriculum topic
      .addCase(updateCurriculumTopic.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCurriculumTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle update response - for now just mark as succeeded
      })
      .addCase(updateCurriculumTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update curriculum topic';
      })

      // Delete curriculum topic
      .addCase(deleteCurriculumTopic.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCurriculumTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const deletedTopicId = action.payload.topicId;
          // Find the unit this topic belongs to and remove it
          Object.keys(state.topics).forEach(unitId => {
            const unitTopics = state.topics[parseInt(unitId)];
            const index = unitTopics.findIndex(t => t.id === deletedTopicId);
            if (index !== -1) {
              unitTopics.splice(index, 1);
            }
          });
        }
      })
      .addCase(deleteCurriculumTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete curriculum topic';
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