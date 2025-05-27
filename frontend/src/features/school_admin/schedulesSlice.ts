import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import scheduleApi, { Schedule, CreateScheduleRequest, UpdateScheduleRequest } from '../../api/services/scheduleApi';

export interface SchedulesState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  conflicts: Schedule[];
}

const initialState: SchedulesState = {
  schedules: [],
  currentSchedule: null,
  status: 'idle',
  error: null,
  conflicts: []
};

// Async thunks
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules');
    }
  }
);

export const fetchScheduleById = createAsyncThunk(
  'schedules/fetchScheduleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedule');
    }
  }
);

export const fetchSchedulesBySchool = createAsyncThunk(
  'schedules/fetchSchedulesBySchool',
  async (schoolId: number, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getBySchool(schoolId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school schedules');
    }
  }
);

export const fetchSchedulesByClass = createAsyncThunk(
  'schedules/fetchSchedulesByClass',
  async (classId: number, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getByClass(classId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class schedules');
    }
  }
);

export const fetchSchedulesByTeacher = createAsyncThunk(
  'schedules/fetchSchedulesByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher schedules');
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/createSchedule',
  async (scheduleData: CreateScheduleRequest, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.create(scheduleData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedules/updateSchedule',
  async ({ id, scheduleData }: { id: number; scheduleData: UpdateScheduleRequest }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.update(id, scheduleData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedules/deleteSchedule',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete schedule');
    }
  }
);

export const checkTimeConflicts = createAsyncThunk(
  'schedules/checkTimeConflicts',
  async (params: {
    classId?: number;
    teacherId?: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    currentDate: string;
    excludeId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.checkTimeConflicts(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check time conflicts');
    }
  }
);

export const updateScheduleStatus = createAsyncThunk(
  'schedules/updateScheduleStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.updateStatus(id, status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule status');
    }
  }
);

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    clearCurrentSchedule: (state) => {
      state.currentSchedule = null;
    },
    clearSchedulesError: (state) => {
      state.error = null;
    },
    clearConflicts: (state) => {
      state.conflicts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch schedules';
      })

      // Fetch schedule by ID
      .addCase(fetchScheduleById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchedule = action.payload as Schedule;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch schedule';
      })

      // Fetch schedules by school
      .addCase(fetchSchedulesBySchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesBySchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesBySchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch school schedules';
      })

      // Fetch schedules by class
      .addCase(fetchSchedulesByClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesByClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesByClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch class schedules';
      })

      // Fetch schedules by teacher
      .addCase(fetchSchedulesByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch teacher schedules';
      })

      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.schedules.push(action.payload as Schedule);
        }
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create schedule';
      })

      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedSchedule = action.payload as Schedule;
          const index = state.schedules.findIndex(s => s.id === updatedSchedule.id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule;
          }
          if (state.currentSchedule?.id === updatedSchedule.id) {
            state.currentSchedule = updatedSchedule;
          }
        }
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update schedule';
      })

      // Delete schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload;
        state.schedules = state.schedules.filter(s => s.id !== id);
        if (state.currentSchedule?.id === id) {
          state.currentSchedule = null;
        }
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete schedule';
      })

      // Check time conflicts
      .addCase(checkTimeConflicts.pending, (state) => {
        state.error = null;
      })
      .addCase(checkTimeConflicts.fulfilled, (state, action) => {
        state.conflicts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(checkTimeConflicts.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to check time conflicts';
        state.conflicts = [];
      })

      // Update schedule status
      .addCase(updateScheduleStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateScheduleStatus.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedSchedule = action.payload as Schedule;
          const index = state.schedules.findIndex(s => s.id === updatedSchedule.id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule;
          }
          if (state.currentSchedule?.id === updatedSchedule.id) {
            state.currentSchedule = updatedSchedule;
          }
        }
      })
      .addCase(updateScheduleStatus.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update schedule status';
      });
  }
});

export const { clearCurrentSchedule, clearSchedulesError, clearConflicts } = schedulesSlice.actions;
export default schedulesSlice.reducer; 