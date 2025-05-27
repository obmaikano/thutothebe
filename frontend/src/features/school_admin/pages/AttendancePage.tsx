import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  UserCheck,
  UserX,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  markedBy: string;
  markedAt: string;
}

interface AttendanceSummary {
  studentId: number;
  studentName: string;
  className: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

interface ClassAttendance {
  classId: number;
  className: string;
  date: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  attendanceRate: number;
}

export const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'summary' | 'reports'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'John Smith',
      classId: 1,
      className: 'Grade 10A',
      date: '2024-03-15',
      status: 'PRESENT',
      timeIn: '08:00',
      timeOut: '15:30',
      markedBy: 'Teacher A',
      markedAt: '2024-03-15T08:05:00'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Mary Johnson',
      classId: 1,
      className: 'Grade 10A',
      date: '2024-03-15',
      status: 'LATE',
      timeIn: '08:15',
      timeOut: '15:30',
      notes: 'Traffic delay',
      markedBy: 'Teacher A',
      markedAt: '2024-03-15T08:20:00'
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'David Wilson',
      classId: 1,
      className: 'Grade 10A',
      date: '2024-03-15',
      status: 'ABSENT',
      notes: 'Sick leave',
      markedBy: 'Teacher A',
      markedAt: '2024-03-15T08:10:00'
    },
    {
      id: 4,
      studentId: 4,
      studentName: 'Sarah Brown',
      classId: 2,
      className: 'Grade 11B',
      date: '2024-03-15',
      status: 'PRESENT',
      timeIn: '07:55',
      timeOut: '15:25',
      markedBy: 'Teacher B',
      markedAt: '2024-03-15T08:00:00'
    },
    {
      id: 5,
      studentId: 5,
      studentName: 'Michael Davis',
      classId: 1,
      className: 'Grade 10A',
      date: '2024-03-15',
      status: 'EXCUSED',
      notes: 'Medical appointment',
      markedBy: 'Teacher A',
      markedAt: '2024-03-15T08:00:00'
    }
  ]);

  const [attendanceSummary] = useState<AttendanceSummary[]>([
    {
      studentId: 1,
      studentName: 'John Smith',
      className: 'Grade 10A',
      totalDays: 20,
      presentDays: 18,
      absentDays: 1,
      lateDays: 1,
      excusedDays: 0,
      attendanceRate: 90
    },
    {
      studentId: 2,
      studentName: 'Mary Johnson',
      className: 'Grade 10A',
      totalDays: 20,
      presentDays: 17,
      absentDays: 2,
      lateDays: 1,
      excusedDays: 0,
      attendanceRate: 85
    },
    {
      studentId: 3,
      studentName: 'David Wilson',
      className: 'Grade 10A',
      totalDays: 20,
      presentDays: 15,
      absentDays: 4,
      lateDays: 1,
      excusedDays: 0,
      attendanceRate: 75
    },
    {
      studentId: 4,
      studentName: 'Sarah Brown',
      className: 'Grade 11B',
      totalDays: 20,
      presentDays: 19,
      absentDays: 0,
      lateDays: 1,
      excusedDays: 0,
      attendanceRate: 95
    },
    {
      studentId: 5,
      studentName: 'Michael Davis',
      className: 'Grade 10A',
      totalDays: 20,
      presentDays: 16,
      absentDays: 2,
      lateDays: 0,
      excusedDays: 2,
      attendanceRate: 80
    }
  ]);

  const [classAttendance] = useState<ClassAttendance[]>([
    {
      classId: 1,
      className: 'Grade 10A',
      date: '2024-03-15',
      totalStudents: 25,
      presentStudents: 22,
      absentStudents: 2,
      lateStudents: 1,
      attendanceRate: 88
    },
    {
      classId: 2,
      className: 'Grade 11B',
      date: '2024-03-15',
      totalStudents: 28,
      presentStudents: 26,
      absentStudents: 1,
      lateStudents: 1,
      attendanceRate: 92.9
    },
    {
      classId: 3,
      className: 'Grade 12C',
      date: '2024-03-15',
      totalStudents: 30,
      presentStudents: 27,
      absentStudents: 2,
      lateStudents: 1,
      attendanceRate: 90
    }
  ]);

  const classes = [
    { id: 1, name: 'Grade 10A' },
    { id: 2, name: 'Grade 11B' },
    { id: 3, name: 'Grade 12C' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'LATE': return 'bg-yellow-100 text-yellow-800';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle size={16} className="text-green-600" />;
      case 'ABSENT': return <XCircle size={16} className="text-red-600" />;
      case 'LATE': return <Clock size={16} className="text-yellow-600" />;
      case 'EXCUSED': return <UserCheck size={16} className="text-blue-600" />;
      default: return <Users size={16} className="text-gray-600" />;
    }
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate;
    const matchesClass = !selectedClass || record.classId.toString() === selectedClass;
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesDate && matchesClass && matchesSearch && matchesStatus;
  });

  const filteredAttendanceSummary = attendanceSummary.filter(summary => {
    const matchesClass = !selectedClass || summary.className.includes(selectedClass);
    const matchesSearch = summary.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const filteredClassAttendance = classAttendance.filter(attendance => {
    const matchesDate = attendance.date === selectedDate;
    const matchesClass = !selectedClass || attendance.classId.toString() === selectedClass;
    return matchesDate && matchesClass;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Track and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((filteredAttendanceRecords.filter(r => r.status === 'PRESENT').length / 
                Math.max(filteredAttendanceRecords.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Today's Attendance</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredAttendanceRecords.filter(r => r.status === 'PRESENT').length}
              </div>
              <div className="text-sm text-gray-500">Present Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredAttendanceRecords.filter(r => r.status === 'ABSENT').length}
              </div>
              <div className="text-sm text-gray-500">Absent Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredAttendanceRecords.filter(r => r.status === 'LATE').length}
              </div>
              <div className="text-sm text-gray-500">Late Arrivals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'daily', label: 'Daily Attendance', icon: Calendar },
            { id: 'summary', label: 'Student Summary', icon: Users },
            { id: 'reports', label: 'Class Reports', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {activeTab === 'daily' && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id.toString()}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {activeTab === 'daily' && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'daily' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time In/Out
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(record.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                          <div className="text-xs text-gray-500">
                            Marked by {record.markedBy}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.timeIn && (
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1 text-gray-400" />
                            In: {record.timeIn}
                          </div>
                        )}
                        {record.timeOut && (
                          <div className="flex items-center mt-1">
                            <Clock size={14} className="mr-1 text-gray-400" />
                            Out: {record.timeOut}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {record.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Days
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Absent
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Late
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendanceSummary.map(summary => (
                  <tr key={summary.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{summary.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{summary.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{summary.totalDays}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle size={14} />
                        {summary.presentDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <XCircle size={14} />
                        {summary.absentDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <Clock size={14} />
                        {summary.lateDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`font-medium ${getAttendanceRateColor(summary.attendanceRate)}`}>
                        {summary.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <BarChart3 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Absent
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Late
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClassAttendance.map(attendance => (
                  <tr key={attendance.classId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{attendance.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(attendance.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{attendance.totalStudents}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-green-600">{attendance.presentStudents}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-red-600">{attendance.absentStudents}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-yellow-600">{attendance.lateStudents}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <span className={`text-sm font-medium ${getAttendanceRateColor(attendance.attendanceRate)}`}>
                          {attendance.attendanceRate.toFixed(1)}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${attendance.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {attendance.attendanceRate >= 90 ? (
                        <TrendingUp className="text-green-600 mx-auto" size={20} />
                      ) : (
                        <TrendingDown className="text-red-600 mx-auto" size={20} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 