import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Student } from '../../../api/services/studentApi';
import { ClipboardCheck, Users, Check, X, Calendar, Clock } from 'lucide-react';

interface AttendanceRecord {
  studentId: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

interface TakeAttendanceModalProps {
  extraObject?: {
    classId: number;
    className: string;
    students: Student[];
    date?: string;
  };
}

const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const classId = extraObject?.classId;
  const className = extraObject?.className || 'Class';
  const students = extraObject?.students || [];

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setAttendanceDate(extraObject?.date || today);

    // Initialize attendance records with all students marked as present by default
    const initialRecords: AttendanceRecord[] = students.map(student => ({
      studentId: student.id,
      status: 'present',
      notes: ''
    }));
    setAttendanceRecords(initialRecords);
  }, [students, extraObject?.date]);

  const updateAttendanceStatus = (studentId: number, status: AttendanceRecord['status']) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.studentId === studentId ? { ...record, status } : record
    ));
  };

  const updateStudentNotes = (studentId: number, notes: string) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.studentId === studentId ? { ...record, notes } : record
    ));
  };

  const markAllPresent = () => {
    setAttendanceRecords(prev => prev.map(record => ({ ...record, status: 'present' as const })));
  };

  const markAllAbsent = () => {
    setAttendanceRecords(prev => prev.map(record => ({ ...record, status: 'absent' as const })));
  };

  const handleSubmit = async () => {
    if (!classId || attendanceRecords.length === 0) return;

    try {
      setIsLoading(true);
      
      // Here you would typically call an API to save attendance
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Attendance submitted:', {
        classId,
        date: attendanceDate,
        records: attendanceRecords,
        notes
      });
      
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const getStatusCounts = () => {
    const counts = {
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      late: attendanceRecords.filter(r => r.status === 'late').length,
      excused: attendanceRecords.filter(r => r.status === 'excused').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-green-500 hover:bg-green-600';
      case 'absent': return 'bg-red-500 hover:bg-red-600';
      case 'late': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'excused': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return <Check className="h-4 w-4" />;
      case 'absent': return <X className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      case 'excused': return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  if (!classId) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: No class information provided</div>
        <button onClick={handleClose} className="btn btn-primary">Close</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ClipboardCheck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Take Attendance</h2>
          <p className="text-sm text-gray-600">{className} • {students.length} students</p>
        </div>
      </div>

      {/* Date and Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts.present}</div>
          <div className="text-sm text-green-700">Present</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statusCounts.absent}</div>
          <div className="text-sm text-red-700">Absent</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.late}</div>
          <div className="text-sm text-yellow-700">Late</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.excused}</div>
          <div className="text-sm text-blue-700">Excused</div>
        </div>
      </div>

      {/* Students List */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        <div className="divide-y divide-gray-200">
          {students.map((student) => {
            const record = attendanceRecords.find(r => r.studentId === student.id);
            return (
              <div key={student.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {student.admissionNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateAttendanceStatus(student.id, status)}
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium text-white rounded-full transition-colors ${
                          record?.status === status 
                            ? getStatusColor(status)
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        title={status.charAt(0).toUpperCase() + status.slice(1)}
                      >
                        {getStatusIcon(status)}
                        <span className="ml-1 capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Notes for absent/late/excused students */}
                {record?.status !== 'present' && (
                  <div className="mt-3 ml-13">
                    <input
                      type="text"
                      placeholder="Add notes (optional)"
                      value={record?.notes || ''}
                      onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* General Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          General Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any general notes about today's attendance..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving Attendance...
            </>
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Save Attendance
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TakeAttendanceModal; 