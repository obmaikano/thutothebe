import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAttendanceByClass, fetchAttendanceStats, exportAttendance } from '../attendanceSlice';
import { closeModal } from '../../common/modalSlice';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  FileText, 
  Users, 
  CheckCircle, 
  UserX, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';

interface AttendanceReportModalProps {
  extraObject?: {
    classId: number;
    className: string;
    students: any[];
    mode?: 'view' | 'export';
  };
}

const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { attendanceRecords, attendanceStats, status, error } = useAppSelector(state => state.attendance);

  // Filter state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [attendanceType, setAttendanceType] = useState<'ALL' | 'DAILY' | 'PERIOD' | 'EVENT'>('ALL');
  const [attendanceStatus, setAttendanceStatus] = useState<'ALL' | 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE'>('ALL');
  
  // View state
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'trends'>('summary');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load data when component mounts
  useEffect(() => {
    if (extraObject?.classId) {
      loadAttendanceData();
    }
  }, [extraObject?.classId, dateRange, attendanceType, attendanceStatus]);

  const loadAttendanceData = async () => {
    if (!extraObject?.classId) return;

    setIsLoading(true);
    try {
      const filters = {
        classId: extraObject.classId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        attendanceType: attendanceType === 'ALL' ? undefined : attendanceType,
        attendanceStatus: attendanceStatus === 'ALL' ? undefined : attendanceStatus,
        page: 0,
        size: 100
      };

      await Promise.all([
        dispatch(fetchAttendanceByClass({ classId: extraObject.classId, filters })),
        dispatch(fetchAttendanceStats(filters))
      ]);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'CSV' | 'PDF' | 'EXCEL') => {
    if (!extraObject?.classId) return;

    try {
      const filters = {
        classId: extraObject.classId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        attendanceType: attendanceType === 'ALL' ? undefined : attendanceType,
        attendanceStatus: attendanceStatus === 'ALL' ? undefined : attendanceStatus
      };

      const response = await dispatch(exportAttendance({ filters, format })).unwrap();
      
      // Create download link
      const blob = new Blob([response.data], { 
        type: format === 'PDF' ? 'application/pdf' : 'text/csv' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${extraObject.className}_${dateRange.startDate}_to_${dateRange.endDate}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export attendance:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ABSENT_EXCUSED':
      case 'ABSENT_UNEXCUSED':
        return <UserX className="w-4 h-4 text-red-600" />;
      case 'LATE':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'EARLY_DEPARTURE':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'badge-success';
      case 'ABSENT_EXCUSED':
        return 'badge-warning';
      case 'ABSENT_UNEXCUSED':
        return 'badge-error';
      case 'LATE':
        return 'badge-info';
      case 'EARLY_DEPARTURE':
        return 'badge-secondary';
      default:
        return 'badge-neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAttendanceTrends = () => {
    // Group attendance records by date
    const dailyStats = attendanceRecords.reduce((acc, record) => {
      const date = record.attendanceDate;
      if (!acc[date]) {
        acc[date] = { present: 0, absent: 0, late: 0, total: 0 };
      }
      
      acc[date].total++;
      if (record.attendanceStatus === 'PRESENT') {
        acc[date].present++;
      } else if (record.attendanceStatus.includes('ABSENT')) {
        acc[date].absent++;
      } else if (record.attendanceStatus === 'LATE') {
        acc[date].late++;
      }
      
      return acc;
    }, {} as Record<string, { present: number; absent: number; late: number; total: number }>);

    return Object.entries(dailyStats)
      .map(([date, stats]) => ({
        date,
        ...stats,
        attendanceRate: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const trends = getAttendanceTrends();

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Attendance Report</h3>
          <p className="text-sm text-gray-600">
            {extraObject?.className} • {extraObject?.students?.length || 0} students
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-lg border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Filters</h4>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost btn-sm"
          >
            {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Start Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">End Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Attendance Type</span>
              </label>
              <select
                className="select select-bordered"
                value={attendanceType}
                onChange={(e) => setAttendanceType(e.target.value as any)}
              >
                <option value="ALL">All Types</option>
                <option value="DAILY">Daily</option>
                <option value="PERIOD">Period</option>
                <option value="EVENT">Event</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value as any)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT_EXCUSED">Absent (Excused)</option>
                <option value="ABSENT_UNEXCUSED">Absent (Unexcused)</option>
                <option value="LATE">Late</option>
                <option value="EARLY_DEPARTURE">Early Departure</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={loadAttendanceData}
            disabled={isLoading}
            className="btn btn-primary btn-sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Apply Filters
              </>
            )}
          </button>

          <button
            onClick={() => handleExport('CSV')}
            className="btn btn-outline btn-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => handleExport('PDF')}
            className="btn btn-outline btn-sm"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${viewMode === 'summary' ? 'tab-active' : ''}`}
          onClick={() => setViewMode('summary')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Summary
        </button>
        <button
          className={`tab ${viewMode === 'detailed' ? 'tab-active' : ''}`}
          onClick={() => setViewMode('detailed')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Detailed
        </button>
        <button
          className={`tab ${viewMode === 'trends' ? 'tab-active' : ''}`}
          onClick={() => setViewMode('trends')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Trends
        </button>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'summary' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          {attendanceStats && (
            <div className="stats stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Records</div>
                <div className="stat-value text-primary">{attendanceStats.totalRecords}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-success">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Present</div>
                <div className="stat-value text-success">{attendanceStats.presentCount}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-error">
                  <UserX className="w-8 h-8" />
                </div>
                <div className="stat-title">Absent</div>
                <div className="stat-value text-error">
                  {attendanceStats.absentExcusedCount + attendanceStats.absentUnexcusedCount}
                </div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-info">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="stat-title">Late</div>
                <div className="stat-value text-info">{attendanceStats.lateCount}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="stat-title">Attendance Rate</div>
                <div className="stat-value text-secondary">{attendanceStats.attendanceRate}%</div>
              </div>
            </div>
          )}

          {/* Recent Records */}
          <div className="bg-base-100 p-4 rounded-lg border">
            <h4 className="font-medium mb-4">Recent Attendance Records</h4>
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No attendance records found for the selected criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.slice(0, 10).map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.attendanceDate)}</td>
                        <td>{record.studentName}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.attendanceStatus)}
                            <span className={`badge ${getStatusBadgeClass(record.attendanceStatus)}`}>
                              {record.attendanceStatus.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td>
                          {record.arrivalTime && formatTime(record.arrivalTime)}
                        </td>
                        <td>{record.attendanceType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'detailed' && (
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-4">Detailed Attendance Records</h4>
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No attendance records found for the selected criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Arrival Time</th>
                    <th>Departure Time</th>
                    <th>Type</th>
                    <th>Period</th>
                    <th>Remarks</th>
                    <th>Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{formatDate(record.attendanceDate)}</td>
                      <td>{record.studentName}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.attendanceStatus)}
                          <span className={`badge ${getStatusBadgeClass(record.attendanceStatus)}`}>
                            {record.attendanceStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td>
                        {record.arrivalTime ? formatTime(record.arrivalTime) : '-'}
                      </td>
                      <td>
                        {record.departureTime ? formatTime(record.departureTime) : '-'}
                      </td>
                      <td>{record.attendanceType}</td>
                      <td>
                        {record.attendanceType === 'PERIOD' && record.periodNumber 
                          ? `P${record.periodNumber}` 
                          : '-'
                        }
                      </td>
                      <td>
                        {record.remarks || '-'}
                      </td>
                      <td>
                        <div>
                          <div className="text-sm">{record.markedByName}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(record.markedAt)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === 'trends' && (
        <div className="space-y-6">
          {/* Attendance Rate Trend */}
          <div className="bg-base-100 p-4 rounded-lg border">
            <h4 className="font-medium mb-4">Attendance Rate Trend</h4>
            {trends.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No trend data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trends.map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{formatDate(trend.date)}</div>
                      <div className="text-sm text-gray-600">
                        {trend.present} present, {trend.absent} absent, {trend.late} late
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold">{trend.attendanceRate}%</div>
                      {trend.attendanceRate >= 90 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : trend.attendanceRate < 80 ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-error mt-6">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => dispatch(closeModal({}))}
          className="btn btn-ghost"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AttendanceReportModal; 