import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import scheduleApi, { Schedule, ScheduleHistory, CreateScheduleRequest, UpdateScheduleRequest } from '../../api/services/scheduleApi';

export interface SchedulesState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  scheduleHistory: ScheduleHistory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  conflicts: Schedule[];
  selectedTimeSlot: string | null;
  filter: {
    type: string;
    status: string;
    dayOfWeek: string;
    classId: number | null;
    teacherId: number | null;
  };
}

const initialState: SchedulesState = {
  schedules: [],
  currentSchedule: null,
  scheduleHistory: [],
  status: 'idle',
  error: null,
  conflicts: [],
  selectedTimeSlot: null,
  filter: {
    type: '',
    status: '',
    dayOfWeek: '',
    classId: null,
    teacherId: null
  }
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

export const fetchSchedulesForUser = createAsyncThunk(
  'schedules/fetchSchedulesForUser',
  async (params: { 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
    page?: number; 
    size?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getForUser(
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId, 
        params.page, 
        params.size
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user schedules');
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
  async (params: { 
    schoolId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getBySchool(
        params.schoolId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school schedules');
    }
  }
);

export const fetchSchedulesByClass = createAsyncThunk(
  'schedules/fetchSchedulesByClass',
  async (params: { 
    classId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getByClass(
        params.classId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class schedules');
    }
  }
);

export const fetchSchedulesByTeacher = createAsyncThunk(
  'schedules/fetchSchedulesByTeacher',
  async (params: { 
    teacherId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getByTeacher(
        params.teacherId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher schedules');
    }
  }
);

export const fetchSchedulesByDayOfWeek = createAsyncThunk(
  'schedules/fetchSchedulesByDayOfWeek',
  async (params: { 
    dayOfWeek: string; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getByDayOfWeek(
        params.dayOfWeek, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch day schedules');
    }
  }
);

export const fetchSchedulesForStudent = createAsyncThunk(
  'schedules/fetchSchedulesForStudent',
  async (params: { 
    studentId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getForStudent(
        params.studentId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student schedules');
    }
  }
);

export const fetchNextClassForStudent = createAsyncThunk(
  'schedules/fetchNextClassForStudent',
  async (params: { 
    studentId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getNextClassForStudent(
        params.studentId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch next class');
    }
  }
);

export const fetchSchedulesForParent = createAsyncThunk(
  'schedules/fetchSchedulesForParent',
  async (params: { 
    parentId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getForParent(
        params.parentId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parent schedules');
    }
  }
);

export const fetchActiveSchedulesForDateRange = createAsyncThunk(
  'schedules/fetchActiveSchedulesForDateRange',
  async (params: { 
    startDate: string; 
    endDate: string; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getActiveForDateRange(
        params.startDate, 
        params.endDate, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules for date range');
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/createSchedule',
  async (params: { 
    scheduleData: CreateScheduleRequest; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.create(
        params.scheduleData, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedules/updateSchedule',
  async (params: { 
    id: number; 
    scheduleData: UpdateScheduleRequest; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.update(
        params.id, 
        params.scheduleData, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedules/deleteSchedule',
  async (params: { 
    id: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
    reason?: string; 
  }, { rejectWithValue }) => {
    try {
      await scheduleApi.delete(
        params.id, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId, 
        params.reason
      );
      return { id: params.id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete schedule');
    }
  }
);

export const updateScheduleStatus = createAsyncThunk(
  'schedules/updateScheduleStatus',
  async (params: { 
    id: number; 
    status: string; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
    reason?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.updateStatus(
        params.id, 
        params.status, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId, 
        params.reason
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule status');
    }
  }
);

export const bulkUpdateSchedules = createAsyncThunk(
  'schedules/bulkUpdateSchedules',
  async (params: { 
    scheduleIds: number[]; 
    updateData: any; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
    reason?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.bulkUpdate(
        params.scheduleIds, 
        params.updateData, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId, 
        params.reason
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to bulk update schedules');
    }
  }
);

export const checkTimeConflicts = createAsyncThunk(
  'schedules/checkTimeConflicts',
  async (params: {
    classId?: number;
    teacherId?: number;
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    currentDate?: string;
    excludeId?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.checkConflicts(
        params.classId,
        params.teacherId,
        params.dayOfWeek,
        params.startTime,
        params.endTime,
        params.currentDate,
        params.excludeId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check time conflicts');
    }
  }
);

export const fetchScheduleHistory = createAsyncThunk(
  'schedules/fetchScheduleHistory',
  async (params: { 
    id: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getHistory(
        params.id, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedule history');
    }
  }
);

export const fetchScheduleVersionHistory = createAsyncThunk(
  'schedules/fetchScheduleVersionHistory',
  async (params: { 
    parentId: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.getVersionHistory(
        params.parentId, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch version history');
    }
  }
);

export const rollbackScheduleToVersion = createAsyncThunk(
  'schedules/rollbackScheduleToVersion',
  async (params: { 
    id: number; 
    version: number; 
    userRole: string; 
    userId: number; 
    userRegionId?: number; 
    userSchoolId?: number; 
    reason?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await scheduleApi.rollbackToVersion(
        params.id, 
        params.version, 
        params.userRole, 
        params.userId, 
        params.userRegionId, 
        params.userSchoolId, 
        params.reason
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rollback schedule');
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
    },
    setScheduleFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSelectedTimeSlot: (state, action) => {
      state.selectedTimeSlot = action.payload;
    },
    clearScheduleHistory: (state) => {
      state.scheduleHistory = [];
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

      // Fetch schedules for user
      .addCase(fetchSchedulesForUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesForUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesForUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch user schedules';
      })

      // Fetch schedule by ID
      .addCase(fetchScheduleById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchedule = action.payload;
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

      // Fetch schedules by day of week
      .addCase(fetchSchedulesByDayOfWeek.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesByDayOfWeek.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesByDayOfWeek.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch day schedules';
      })

      // Fetch schedules for student
      .addCase(fetchSchedulesForStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesForStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesForStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch student schedules';
      })

      // Fetch next class for student
      .addCase(fetchNextClassForStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNextClassForStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSchedule = action.payload;
      })
      .addCase(fetchNextClassForStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch next class';
      })

      // Fetch schedules for parent
      .addCase(fetchSchedulesForParent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulesForParent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSchedulesForParent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch parent schedules';
      })

      // Fetch active schedules for date range
      .addCase(fetchActiveSchedulesForDateRange.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveSchedulesForDateRange.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveSchedulesForDateRange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch schedules for date range';
      })

      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.schedules.push(action.payload);
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
          const index = state.schedules.findIndex(s => s.id === action.payload.id);
          if (index !== -1) {
            state.schedules[index] = action.payload;
          }
          if (state.currentSchedule?.id === action.payload.id) {
            state.currentSchedule = action.payload;
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
        state.schedules = state.schedules.filter(s => s.id !== action.payload.id);
        if (state.currentSchedule?.id === action.payload.id) {
          state.currentSchedule = null;
        }
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete schedule';
      })

      // Update schedule status
      .addCase(updateScheduleStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateScheduleStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const index = state.schedules.findIndex(s => s.id === action.payload.id);
          if (index !== -1) {
            state.schedules[index] = action.payload;
          }
          if (state.currentSchedule?.id === action.payload.id) {
            state.currentSchedule = action.payload;
          }
        }
      })
      .addCase(updateScheduleStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update schedule status';
      })

      // Bulk update schedules
      .addCase(bulkUpdateSchedules.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(bulkUpdateSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          action.payload.forEach(updatedSchedule => {
            const index = state.schedules.findIndex(s => s.id === updatedSchedule.id);
            if (index !== -1) {
              state.schedules[index] = updatedSchedule;
            }
          });
        }
      })
      .addCase(bulkUpdateSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to bulk update schedules';
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

      // Fetch schedule history
      .addCase(fetchScheduleHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchScheduleHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.scheduleHistory = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchScheduleHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch schedule history';
      })

      // Fetch schedule version history
      .addCase(fetchScheduleVersionHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchScheduleVersionHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchScheduleVersionHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch version history';
      })

      // Rollback schedule to version
      .addCase(rollbackScheduleToVersion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(rollbackScheduleToVersion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const index = state.schedules.findIndex(s => s.id === action.payload.id);
          if (index !== -1) {
            state.schedules[index] = action.payload;
          }
          if (state.currentSchedule?.id === action.payload.id) {
            state.currentSchedule = action.payload;
          }
        }
      })
      .addCase(rollbackScheduleToVersion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to rollback schedule';
      });
  }
});

export const { 
  clearCurrentSchedule, 
  clearSchedulesError, 
  clearConflicts, 
  setScheduleFilter, 
  setSelectedTimeSlot, 
  clearScheduleHistory 
} = schedulesSlice.actions;

export default schedulesSlice.reducer; 