import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import attendanceApi, { 
  AttendanceRecord, 
  CreateAttendanceRequest, 
  BulkAttendanceRequest,
  AttendanceFilters,
  AttendanceStats,
  AttendanceSummary
} from '../../api/services/attendanceApi';

// State interface
export interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  currentAttendance: AttendanceRecord | null;
  attendanceStats: AttendanceStats | null;
  attendanceSummary: AttendanceSummary | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: AttendanceFilters;
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

// Initial state
const initialState: AttendanceState = {
  attendanceRecords: [],
  currentAttendance: null,
  attendanceStats: null,
  attendanceSummary: null,
  status: 'idle',
  error: null,
  filters: {
    page: 0,
    size: 20,
    sortBy: 'attendanceDate',
    sortDirection: 'DESC'
  },
  pagination: {
    page: 0,
    size: 20,
    total: 0,
    totalPages: 0
  }
};

// Async thunks
export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchAttendanceRecords',
  async (filters?: AttendanceFilters) => {
    const response = await attendanceApi.getAll(filters);
    return response.data;
  }
);

export const fetchAttendanceById = createAsyncThunk(
  'attendance/fetchAttendanceById',
  async (id: number) => {
    const response = await attendanceApi.getById(id);
    return response.data;
  }
);

export const createAttendanceRecord = createAsyncThunk(
  'attendance/createAttendanceRecord',
  async (attendanceData: CreateAttendanceRequest) => {
    const response = await attendanceApi.create(attendanceData);
    return response.data;
  }
);

export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async ({ id, attendanceData }: { id: number; attendanceData: Partial<CreateAttendanceRequest> }) => {
    const response = await attendanceApi.update(id, attendanceData);
    return response.data;
  }
);

export const deleteAttendanceRecord = createAsyncThunk(
  'attendance/deleteAttendanceRecord',
  async (id: number) => {
    await attendanceApi.delete(id);
    return id;
  }
);

export const createBulkAttendance = createAsyncThunk(
  'attendance/createBulkAttendance',
  async (bulkData: BulkAttendanceRequest) => {
    const response = await attendanceApi.createBulk(bulkData);
    return response.data;
  }
);

export const updateBulkAttendance = createAsyncThunk(
  'attendance/updateBulkAttendance',
  async (bulkData: BulkAttendanceRequest) => {
    const response = await attendanceApi.updateBulk(bulkData);
    return response.data;
  }
);

export const deleteBulkAttendance = createAsyncThunk(
  'attendance/deleteBulkAttendance',
  async (ids: number[]) => {
    await attendanceApi.deleteBulk(ids);
    return ids;
  }
);

export const fetchAttendanceByStudent = createAsyncThunk(
  'attendance/fetchAttendanceByStudent',
  async ({ studentId, filters }: { studentId: number; filters?: Omit<AttendanceFilters, 'studentEntityId'> }) => {
    const response = await attendanceApi.getByStudent(studentId, filters);
    return response.data;
  }
);

export const fetchAttendanceByClass = createAsyncThunk(
  'attendance/fetchAttendanceByClass',
  async ({ classId, filters }: { classId: number; filters?: Omit<AttendanceFilters, 'classId'> }) => {
    const response = await attendanceApi.getByClass(classId, filters);
    return response.data;
  }
);

export const fetchAttendanceByTeacher = createAsyncThunk(
  'attendance/fetchAttendanceByTeacher',
  async ({ teacherId, filters }: { teacherId: number; filters?: AttendanceFilters }) => {
    const response = await attendanceApi.getByTeacher(teacherId, filters);
    return response.data;
  }
);

export const fetchAttendanceByDateRange = createAsyncThunk(
  'attendance/fetchAttendanceByDateRange',
  async ({ startDate, endDate, filters }: { 
    startDate: string; 
    endDate: string; 
    filters?: Omit<AttendanceFilters, 'startDate' | 'endDate'> 
  }) => {
    const response = await attendanceApi.getByDateRange(startDate, endDate, filters);
    return response.data;
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchAttendanceStats',
  async (filters?: AttendanceFilters) => {
    const response = await attendanceApi.getAttendanceStats(filters);
    return response.data;
  }
);

export const fetchAttendanceSummary = createAsyncThunk(
  'attendance/fetchAttendanceSummary',
  async (filters: AttendanceFilters) => {
    const response = await attendanceApi.getAttendanceSummary(filters);
    return response.data;
  }
);

export const modifyAttendanceRecord = createAsyncThunk(
  'attendance/modifyAttendanceRecord',
  async ({ 
    attendanceId, 
    updatedRecord, 
    reason, 
    modifiedById 
  }: { 
    attendanceId: number; 
    updatedRecord: Partial<CreateAttendanceRequest>; 
    reason: string; 
    modifiedById: number 
  }) => {
    const response = await attendanceApi.modifyAttendance(attendanceId, updatedRecord, reason, modifiedById);
    return response.data;
  }
);

export const quickMarkAllPresent = createAsyncThunk(
  'attendance/quickMarkAllPresent',
  async ({ 
    classId, 
    date, 
    type, 
    periodNumber, 
    markedById 
  }: { 
    classId: number; 
    date: string; 
    type: 'DAILY' | 'PERIOD' | 'EVENT'; 
    periodNumber?: number; 
    markedById?: number 
  }) => {
    const response = await attendanceApi.quickMarkAllPresent(classId, date, type, periodNumber, markedById);
    return response.data;
  }
);

export const quickMarkAllAbsent = createAsyncThunk(
  'attendance/quickMarkAllAbsent',
  async ({ 
    classId, 
    date, 
    type, 
    periodNumber, 
    markedById, 
    absentType 
  }: { 
    classId: number; 
    date: string; 
    type: 'DAILY' | 'PERIOD' | 'EVENT'; 
    periodNumber?: number; 
    markedById?: number; 
    absentType?: 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' 
  }) => {
    const response = await attendanceApi.quickMarkAllAbsent(classId, date, type, periodNumber, markedById, absentType);
    return response.data;
  }
);

export const exportAttendance = createAsyncThunk(
  'attendance/exportAttendance',
  async ({ filters, format }: { filters: AttendanceFilters; format: 'CSV' | 'PDF' | 'EXCEL' }) => {
    const response = await attendanceApi.exportAttendance(filters, format);
    return response.data;
  }
);

export const notifyParents = createAsyncThunk(
  'attendance/notifyParents',
  async (attendanceIds: number[]) => {
    const response = await attendanceApi.notifyParents(attendanceIds);
    return response.data;
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AttendanceFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 0,
        size: 20,
        sortBy: 'attendanceDate',
        sortDirection: 'DESC'
      };
    },
    setCurrentAttendance: (state, action: PayloadAction<AttendanceRecord | null>) => {
      state.currentAttendance = action.payload;
    },
    clearCurrentAttendance: (state) => {
      state.currentAttendance = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action: PayloadAction<Partial<AttendanceState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance records
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch attendance records';
      })

      // Fetch attendance by ID
      .addCase(fetchAttendanceById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAttendance = action.payload.data;
      })
      .addCase(fetchAttendanceById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch attendance record';
      })

      // Create attendance record
      .addCase(createAttendanceRecord.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAttendanceRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords.unshift(action.payload.data);
      })
      .addCase(createAttendanceRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create attendance record';
      })

      // Update attendance record
      .addCase(updateAttendanceRecord.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.attendanceRecords.findIndex(record => record.id === action.payload.data.id);
        if (index !== -1) {
          state.attendanceRecords[index] = action.payload.data;
        }
        if (state.currentAttendance?.id === action.payload.data.id) {
          state.currentAttendance = action.payload.data;
        }
      })
      .addCase(updateAttendanceRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update attendance record';
      })

      // Delete attendance record
      .addCase(deleteAttendanceRecord.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAttendanceRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = state.attendanceRecords.filter(record => record.id !== action.payload);
        if (state.currentAttendance?.id === action.payload) {
          state.currentAttendance = null;
        }
      })
      .addCase(deleteAttendanceRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete attendance record';
      })

      // Create bulk attendance
      .addCase(createBulkAttendance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createBulkAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.attendanceRecords = [...newRecords, ...state.attendanceRecords];
      })
      .addCase(createBulkAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create bulk attendance';
      })

      // Update bulk attendance
      .addCase(updateBulkAttendance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateBulkAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
        updatedRecords.forEach(updatedRecord => {
          const index = state.attendanceRecords.findIndex(record => record.id === updatedRecord.id);
          if (index !== -1) {
            state.attendanceRecords[index] = updatedRecord;
          }
        });
      })
      .addCase(updateBulkAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update bulk attendance';
      })

      // Delete bulk attendance
      .addCase(deleteBulkAttendance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBulkAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = state.attendanceRecords.filter(
          record => !action.payload.includes(record.id)
        );
      })
      .addCase(deleteBulkAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete bulk attendance';
      })

      // Fetch attendance by student
      .addCase(fetchAttendanceByStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
      })

      // Fetch attendance by class
      .addCase(fetchAttendanceByClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
      })

      // Fetch attendance by teacher
      .addCase(fetchAttendanceByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
      })

      // Fetch attendance by date range
      .addCase(fetchAttendanceByDateRange.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendanceRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
      })

      // Fetch attendance stats
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.attendanceStats = action.payload.data;
      })

      // Fetch attendance summary
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.attendanceSummary = action.payload.data;
      })

      // Modify attendance record
      .addCase(modifyAttendanceRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.attendanceRecords.findIndex(record => record.id === action.payload.data.id);
        if (index !== -1) {
          state.attendanceRecords[index] = action.payload.data;
        }
        if (state.currentAttendance?.id === action.payload.data.id) {
          state.currentAttendance = action.payload.data;
        }
      })

      // Quick mark all present
      .addCase(quickMarkAllPresent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.attendanceRecords = [...newRecords, ...state.attendanceRecords];
      })

      // Quick mark all absent
      .addCase(quickMarkAllAbsent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newRecords = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.attendanceRecords = [...newRecords, ...state.attendanceRecords];
      })

      // Export attendance
      .addCase(exportAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(exportAttendance.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(exportAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to export attendance';
      })

      // Notify parents
      .addCase(notifyParents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(notifyParents.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(notifyParents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to notify parents';
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setCurrentAttendance,
  clearCurrentAttendance,
  clearError,
  setPagination
} = attendanceSlice.actions;

export default attendanceSlice.reducer; 