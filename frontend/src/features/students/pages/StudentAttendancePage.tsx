import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../features/common/headerSlice';
import studentApi from '../../../api/services/studentApi';
import attendanceApi, { AttendanceRecord } from '../../../api/services/attendanceApi';
import { 
    Calendar, 
    BarChart3, 
    CheckSquare, 
    X, 
    Clock, 
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Filter,
    Download,
    Search,
    Eye,
    FileText,
    User,
    Award
} from 'lucide-react';

interface AttendanceStats {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendanceRate: number;
    excusedAbsences: number;
    unexcusedAbsences: number;
}

const StudentAttendancePage = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<any>(null);
    const [noStudentRecord, setNoStudentRecord] = useState(false);
    const [creatingStudent, setCreatingStudent] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [startDate, setStartDate] = useState<string>(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'stats'>('list');

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Attendance" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchStudentAttendance = async () => {
            if (!isAuthenticated || !user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setNoStudentRecord(false);
                
                console.log('Fetching student record for user ID:', user.id);

                // Get student record first using user ID
                const studentResponse = await studentApi.getByUserId(user.id);
                console.log('Student API response:', studentResponse.data);
                
                if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
                    console.error('Failed to get student record. Response:', studentResponse.data);
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet.');
                    setLoading(false);
                    return;
                }

                const student = Array.isArray(studentResponse.data.data) 
                    ? studentResponse.data.data[0] 
                    : studentResponse.data.data;

                if (!student) {
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet.');
                    setLoading(false);
                    return;
                }

                setStudentData(student);
                console.log('Student data:', student);

                // Fetch attendance records for the student
                const attendanceResponse = await attendanceApi.getByDateRange(startDate, endDate, {
                    studentEntityId: student.id,
                    academicYear: new Date().getFullYear()
                });
                console.log('Attendance API response:', attendanceResponse.data);
                
                if (attendanceResponse.data.status === 'SUCCESS') {
                    const attendanceData = (attendanceResponse.data.data as AttendanceRecord[]) || [];
                    console.log('Fetched attendance records:', attendanceData);
                    setAttendanceRecords(attendanceData);
                } else {
                    console.error('Failed to fetch attendance:', attendanceResponse.data.message);
                    setAttendanceRecords([]);
                }
            } catch (err: any) {
                console.error('Error fetching student attendance:', err);
                if (err.response?.status === 404) {
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet. Please contact your administrator to complete your student profile setup.');
                } else if (err.response?.status === 401) {
                    setError('Authentication failed. Please log in again.');
                    navigate('/login');
                } else if (err.response?.status === 403) {
                    setError('You do not have permission to access this resource.');
                } else {
                    setError(err.response?.data?.message || err.message || 'Failed to fetch attendance records');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentAttendance();
    }, [user?.id, isAuthenticated, navigate, startDate, endDate]);

    const createStudentRecord = async () => {
        if (!user?.id) return;
        
        try {
            setCreatingStudent(true);
            console.log('Creating student record for user ID:', user.id);
            
            const response = await studentApi.createForUser(user.id);
            console.log('Create student response:', response.data);
            
            if (response.data.status === 'SUCCESS') {
                setNoStudentRecord(false);
                setError(null);
                window.location.reload();
            } else {
                setError('Failed to create student record: ' + response.data.message);
            }
        } catch (err: any) {
            console.error('Error creating student record:', err);
            if (err.response?.status === 400 && err.response?.data?.message?.includes('school')) {
                setError('Cannot create student record: You must be assigned to a school first. Please contact your administrator.');
            } else {
                setError('Failed to create student record: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setCreatingStudent(false);
        }
    };

    // Calculate attendance statistics
    const calculateStats = (): AttendanceStats => {
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(r => r.attendanceStatus === 'PRESENT').length;
        const lateDays = attendanceRecords.filter(r => r.attendanceStatus === 'LATE').length;
        const excusedAbsences = attendanceRecords.filter(r => r.attendanceStatus === 'ABSENT_EXCUSED').length;
        const unexcusedAbsences = attendanceRecords.filter(r => r.attendanceStatus === 'ABSENT_UNEXCUSED').length;
        const absentDays = excusedAbsences + unexcusedAbsences;
        const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;

        return {
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            attendanceRate,
            excusedAbsences,
            unexcusedAbsences
        };
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ABSENT_EXCUSED':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ABSENT_UNEXCUSED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'LATE':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'EARLY_DEPARTURE':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return <CheckSquare className="w-4 h-4" />;
            case 'ABSENT_EXCUSED':
            case 'ABSENT_UNEXCUSED':
                return <X className="w-4 h-4" />;
            case 'LATE':
                return <Clock className="w-4 h-4" />;
            case 'EARLY_DEPARTURE':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    // Filter records based on search and filters
    const filteredRecords = attendanceRecords.filter((record: AttendanceRecord) => {
        const matchesSearch = 
            record.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (record.subjectName && record.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (record.remarks && record.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = 
            statusFilter === '' || record.attendanceStatus === statusFilter;

        const matchesType = 
            typeFilter === '' || record.attendanceType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Get unique statuses and types for filters
    const uniqueStatuses = [...new Set(attendanceRecords.map(r => r.attendanceStatus))];
    const uniqueTypes = [...new Set(attendanceRecords.map(r => r.attendanceType))];

    // Export attendance data
    const exportAttendance = () => {
        const csvContent = [
            ['Date', 'Status', 'Type', 'Class', 'Subject', 'Arrival Time', 'Remarks'].join(','),
            ...filteredRecords.map(record => [
                record.attendanceDate,
                record.attendanceStatus,
                record.attendanceType,
                record.className,
                record.subjectName || 'N/A',
                record.arrivalTime || 'N/A',
                record.remarks || 'N/A'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my_attendance_${startDate}_to_${endDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    if (noStudentRecord) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-800">Student Profile Not Found</h3>
                            <p className="text-yellow-700">Your account is not yet linked to a student profile.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-yellow-700">
                            To access your attendance records, you need a student profile. This usually happens automatically when your account is created, 
                            but sometimes requires manual setup.
                        </p>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={createStudentRecord}
                                disabled={creatingStudent}
                                className="btn btn-primary"
                            >
                                {creatingStudent ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating Profile...
                                    </>
                                ) : (
                                    <>
                                        <User className="w-4 h-4" />
                                        Create Student Profile
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={() => navigate('/app/help')}
                                className="btn btn-outline"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                Get Help
                            </button>
                        </div>
                    </div>
                </div>
                
                {error && (
                    <div className="alert alert-error mt-4">
                        <AlertTriangle className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }

    if (error && !noStudentRecord) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="alert alert-error">
                    <AlertTriangle className="w-6 h-6" />
                    <span>{error}</span>
                    <button 
                        onClick={() => window.location.reload()}
                        className="btn btn-sm btn-ghost"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
                    <p className="text-gray-600 mt-1">
                        Track your attendance records and statistics
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={exportAttendance}
                        className="btn btn-outline btn-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Student Info */}
            {studentData && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">
                                {studentData.firstName} {studentData.lastName}
                            </h3>
                            <p className="text-gray-600">
                                {studentData.admissionNumber} • Academic Year {studentData.academicYear}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* View Mode Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { key: 'list', label: 'List View', icon: FileText },
                            { key: 'calendar', label: 'Calendar View', icon: Calendar },
                            { key: 'stats', label: 'Statistics', icon: BarChart3 }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    viewMode === key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-10"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Types</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input input-bordered w-full"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                {/* Content based on view mode */}
                <div className="p-6">
                    {viewMode === 'stats' && (
                        <div className="space-y-6">
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-600 text-sm font-medium">Attendance Rate</p>
                                            <p className="text-3xl font-bold text-green-900">
                                                {stats.attendanceRate.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-600 text-sm font-medium">Present Days</p>
                                            <p className="text-3xl font-bold text-blue-900">{stats.presentDays}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CheckSquare className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-red-600 text-sm font-medium">Absent Days</p>
                                            <p className="text-3xl font-bold text-red-900">{stats.absentDays}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <X className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-600 text-sm font-medium">Late Days</p>
                                            <p className="text-3xl font-bold text-orange-900">{stats.lateDays}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="font-semibold text-lg mb-4">Absence Breakdown</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Excused Absences:</span>
                                            <span className="font-medium">{stats.excusedAbsences}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Unexcused Absences:</span>
                                            <span className="font-medium">{stats.unexcusedAbsences}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="text-gray-600">Total Absences:</span>
                                            <span className="font-medium">{stats.absentDays}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="font-semibold text-lg mb-4">Period Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Days:</span>
                                            <span className="font-medium">{stats.totalDays}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date Range:</span>
                                            <span className="font-medium text-sm">{startDate} to {endDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="font-semibold text-lg mb-4">Performance</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Attendance Grade:</span>
                                            <span className={`font-medium ${
                                                stats.attendanceRate >= 95 ? 'text-green-600' :
                                                stats.attendanceRate >= 85 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                                {stats.attendanceRate >= 95 ? 'Excellent' :
                                                 stats.attendanceRate >= 85 ? 'Good' :
                                                 stats.attendanceRate >= 75 ? 'Fair' : 'Poor'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'list' && (
                        <div className="space-y-4">
                            {filteredRecords.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records</h3>
                                    <p className="text-gray-500">
                                        {attendanceRecords.length === 0 
                                            ? "No attendance records found for the selected period."
                                            : "No records match your current filters."
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Type</th>
                                                <th>Class</th>
                                                <th>Subject</th>
                                                <th>Time</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRecords.map((record) => (
                                                <tr key={record.id}>
                                                    <td className="font-medium">
                                                        {new Date(record.attendanceDate).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.attendanceStatus)}`}>
                                                            {getStatusIcon(record.attendanceStatus)}
                                                            <span>{record.attendanceStatus.replace('_', ' ')}</span>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge badge-outline">
                                                            {record.attendanceType}
                                                        </span>
                                                    </td>
                                                    <td>{record.className}</td>
                                                    <td>{record.subjectName || 'N/A'}</td>
                                                    <td>
                                                        {record.arrivalTime && (
                                                            <span className="text-sm text-gray-600">
                                                                {record.arrivalTime}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {record.remarks && (
                                                            <span className="text-sm text-gray-600">
                                                                {record.remarks}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === 'calendar' && (
                        <div className="space-y-4">
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                                <p className="text-gray-500">
                                    Calendar view will be implemented in a future update.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendancePage; 