import { api } from '../index';
import { AxiosResponse } from 'axios';

// Response wrapper interface
export interface AttendanceResponse<T = any> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// Core attendance record interface
export interface AttendanceRecord {
  id: number;
  studentEntityId: number;
  studentName: string;
  classId: number;
  className: string;
  courseId?: number;
  courseName?: string;
  subjectId?: number;
  subjectName?: string;
  attendanceDate: string;
  attendanceType: 'DAILY' | 'PERIOD' | 'EVENT';
  attendanceStatus: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';
  periodNumber?: number;
  periodStartTime?: string;
  periodEndTime?: string;
  arrivalTime?: string;
  departureTime?: string;
  academicYear: number;
  term: 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM';
  remarks?: string;
  markedById: number;
  markedByName: string;
  markedAt: string;
  modifiedById?: number;
  modifiedByName?: string;
  modifiedAt?: string;
  modificationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CreateAttendanceRequest {
  // Required fields (matching @NotNull annotations)
  studentEntityId: number;  // @NotNull
  classId: number;  // @NotNull
  markedById: number;  // @NotNull
  attendanceDate: string;  // @NotNull, @PastOrPresent
  attendanceStatus: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';  // @NotNull
  attendanceType: 'DAILY' | 'PERIOD' | 'EVENT';  // @NotNull
  academicYear: number;  // @NotNull, must be 2000-2100
  
  // Optional fields
  studentUserId?: number;  // Optional - for students with user accounts
  courseId?: number;
  subjectId?: number;
  periodNumber?: number;  // Required if attendanceType is PERIOD
  periodStartTime?: string;
  periodEndTime?: string;
  arrivalTime?: string;
  departureTime?: string;
  term?: 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM';
  remarks?: string;
  modifiedById?: number;
}

export interface BulkAttendanceRequest {
  // Required fields (matching @NotNull annotations)
  classId: number;  // @NotNull
  attendanceDate: string;  // @NotNull, cannot be in future
  attendanceType: 'DAILY' | 'PERIOD' | 'EVENT';  // @NotNull
  academicYear: number;  // @NotNull, must be 2000-2100
  markedById: number;  // @NotNull
  studentAttendances: Array<{  // @NotEmpty
    studentId: number;  // @NotNull
    attendanceStatus: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';  // @NotNull
    arrivalTime?: string;
    departureTime?: string;
    remarks?: string;
  }>;
  
  // Optional fields
  courseId?: number;
  subjectId?: number;
  periodNumber?: number;  // Required if attendanceType is PERIOD
  periodStartTime?: string;
  periodEndTime?: string;
  term?: 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM';
}

// Filter interface
export interface AttendanceFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  studentEntityId?: number;
  classId?: number;
  courseId?: number;
  subjectId?: number;
  attendanceDate?: string;
  startDate?: string;
  endDate?: string;
  attendanceType?: 'DAILY' | 'PERIOD' | 'EVENT';
  attendanceStatus?: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';
  periodNumber?: number;
  academicYear?: number;
  term?: 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM';
  markedById?: number;
}

// Statistics interfaces
export interface AttendanceStats {
  totalRecords: number;
  presentCount: number;
  absentExcusedCount: number;
  absentUnexcusedCount: number;
  lateCount: number;
  earlyDepartureCount: number;
  attendanceRate: number;
  absenteeismRate: number;
  punctualityRate: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface AttendanceSummary {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
  trends: Array<{
    date: string;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    totalCount: number;
  }>;
}

// API service implementation
const attendanceApi = {
  // Basic CRUD operations
  getAll: async (filters?: AttendanceFilters): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/attendance?${params}`);
  },

  getById: async (id: number): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord>>> => {
    return api.get(`/attendance/${id}`);
  },

  create: async (attendanceData: CreateAttendanceRequest): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord>>> => {
    return api.post('/attendance', attendanceData);
  },

  update: async (id: number, attendanceData: Partial<CreateAttendanceRequest>): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord>>> => {
    return api.put(`/attendance/${id}`, attendanceData);
  },

  delete: async (id: number): Promise<AxiosResponse<AttendanceResponse<void>>> => {
    return api.delete(`/attendance/${id}`);
  },

  // Bulk operations
  createBulk: async (bulkData: BulkAttendanceRequest): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    return api.post('/attendance/bulk/mark', bulkData);
  },

  updateBulk: async (bulkData: BulkAttendanceRequest): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    return api.put('/attendance/bulk/update', bulkData);
  },

  deleteBulk: async (ids: number[]): Promise<AxiosResponse<AttendanceResponse<void>>> => {
    return api.delete('/attendance/bulk', { data: { ids } });
  },

  // Query operations
  getByStudent: async (studentId: number, filters?: Omit<AttendanceFilters, 'studentEntityId'>): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/attendance/student/${studentId}?${params}`);
  },

  getByClass: async (classId: number, filters?: Omit<AttendanceFilters, 'classId'>): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/attendance/class/${classId}?${params}`);
  },

  getByTeacher: async (teacherId: number, filters?: AttendanceFilters): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/attendance/teacher/${teacherId}?${params}`);
  },

  getByDateRange: async (startDate: string, endDate: string, filters?: Omit<AttendanceFilters, 'startDate' | 'endDate'>): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    // If studentEntityId is provided in filters, use the student-specific endpoint
    if (filters?.studentEntityId) {
      const params = new URLSearchParams({ startDate, endDate });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '' && key !== 'studentEntityId') {
            params.append(key, value.toString());
          }
        });
      }
      return api.get(`/attendance/student/${filters.studentEntityId}/date-range?${params}`);
    }
    
    // Otherwise use the general range endpoint
    const params = new URLSearchParams({ startDate, endDate });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/attendance/range?${params}`);
  },

  // Statistics and analytics
  getAttendanceStats: async (filters?: AttendanceFilters): Promise<AxiosResponse<AttendanceResponse<AttendanceStats>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/attendance/stats?${params}`);
  },

  getAttendanceSummary: async (filters: AttendanceFilters): Promise<AxiosResponse<AttendanceResponse<AttendanceSummary>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    return api.get(`/attendance/summary?${params}`);
  },

  // Modification tracking
  modifyAttendance: async (
    attendanceId: number, 
    updatedRecord: Partial<CreateAttendanceRequest>, 
    reason: string, 
    modifiedById: number
  ): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord>>> => {
    return api.put(`/attendance/${attendanceId}/modify`, {
      ...updatedRecord,
      modificationReason: reason,
      modifiedById
    });
  },

  getModificationHistory: async (attendanceId: number): Promise<AxiosResponse<AttendanceResponse<any[]>>> => {
    return api.get(`/attendance/${attendanceId}/history`);
  },

  // Quick actions
  quickMarkAllPresent: async (
    classId: number, 
    date: string, 
    type: 'DAILY' | 'PERIOD' | 'EVENT', 
    periodNumber?: number, 
    markedById?: number
  ): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    return api.post('/attendance/quick/mark-all-present', {
      classId,
      date,
      type,
      periodNumber,
      markedById
    });
  },

  quickMarkAllAbsent: async (
    classId: number, 
    date: string, 
    type: 'DAILY' | 'PERIOD' | 'EVENT', 
    periodNumber?: number, 
    markedById?: number, 
    absentType: 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' = 'ABSENT_UNEXCUSED'
  ): Promise<AxiosResponse<AttendanceResponse<AttendanceRecord[]>>> => {
    return api.post('/attendance/quick/mark-all-absent', {
      classId,
      date,
      type,
      periodNumber,
      markedById,
      absentType
    });
  },

  // Export functionality
  exportAttendance: async (
    filters: AttendanceFilters, 
    format: 'CSV' | 'PDF' | 'EXCEL'
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    params.append('format', format);
    
    return api.get(`/attendance/export?${params}`, {
      responseType: 'blob'
    });
  },

  // Parent notifications
  notifyParents: async (attendanceIds: number[]): Promise<AxiosResponse<AttendanceResponse<void>>> => {
    return api.post('/attendance/notify-parents', { attendanceIds });
  },

  // Dashboard data
  getTeacherDashboard: async (
    teacherId: number, 
    startDate: string, 
    endDate: string
  ): Promise<AxiosResponse<AttendanceResponse<any>>> => {
    return api.get(`/attendance/dashboard/teacher/${teacherId}?startDate=${startDate}&endDate=${endDate}`);
  },

  getSchoolDashboard: async (
    schoolId: number, 
    startDate: string, 
    endDate: string
  ): Promise<AxiosResponse<AttendanceResponse<any>>> => {
    return api.get(`/attendance/dashboard/school/${schoolId}?startDate=${startDate}&endDate=${endDate}`);
  },

  // Validation
  validateAttendanceData: async (attendanceData: CreateAttendanceRequest): Promise<AxiosResponse<AttendanceResponse<{ valid: boolean; errors?: string[] }>>> => {
    return api.post('/attendance/validate', attendanceData);
  },

  // Attendance patterns and analytics
  getAttendancePatterns: async (
    studentId: number, 
    academicYear: number
  ): Promise<AxiosResponse<AttendanceResponse<any>>> => {
    return api.get(`/attendance/patterns/student/${studentId}?academicYear=${academicYear}`);
  },

  getClassAttendanceTrends: async (
    classId: number, 
    startDate: string, 
    endDate: string
  ): Promise<AxiosResponse<AttendanceResponse<any>>> => {
    return api.get(`/attendance/trends/class/${classId}?startDate=${startDate}&endDate=${endDate}`);
  }
};

export default attendanceApi; 