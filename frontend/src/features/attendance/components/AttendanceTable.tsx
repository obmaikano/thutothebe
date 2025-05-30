import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckSquare, 
  X, 
  Clock, 
  Users,
  Calendar
} from 'lucide-react';

interface AttendanceRecord {
  id: number;
  studentName: string;
  studentEntityId: number;
  className: string;
  classId: number;
  attendanceDate: string;
  attendanceStatus: string;
  arrivalTime?: string;
  departureTime?: string;
  markedByName: string;
  notes?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onView?: (record: AttendanceRecord) => void;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (record: AttendanceRecord) => void;
  onExcuse?: (record: AttendanceRecord) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canExcuse?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  onView,
  onEdit,
  onDelete,
  onExcuse,
  canEdit = false,
  canDelete = false,
  canExcuse = false,
  loading = false,
  emptyMessage = 'No attendance records found'
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT_EXCUSED': return 'bg-yellow-100 text-yellow-800';
      case 'ABSENT_UNEXCUSED': return 'bg-red-100 text-red-800';
      case 'LATE': return 'bg-orange-100 text-orange-800';
      case 'EARLY_DEPARTURE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckSquare size={16} className="text-green-600" />;
      case 'ABSENT_EXCUSED': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'ABSENT_UNEXCUSED': return <X size={16} className="text-red-600" />;
      case 'LATE': return <Clock size={16} className="text-orange-600" />;
      case 'EARLY_DEPARTURE': return <Clock size={16} className="text-purple-600" />;
      default: return <Users size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marked By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.studentName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {record.studentEntityId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {record.className}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.attendanceDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.attendanceStatus)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(record.attendanceStatus)}`}>
                      {formatStatus(record.attendanceStatus)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>Arrival: {record.arrivalTime || '-'}</div>
                    <div className="text-xs text-gray-500">
                      Departure: {record.departureTime || '-'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.markedByName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(record)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {canEdit && onEdit && (
                      <button
                        onClick={() => onEdit(record)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                        title="Edit Record"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {canExcuse && onExcuse && record.attendanceStatus.includes('ABSENT') && (
                      <button
                        onClick={() => onExcuse(record)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors"
                        title="Excuse Absence"
                      >
                        <AlertTriangle size={16} />
                      </button>
                    )}
                    {canDelete && onDelete && (
                      <button
                        onClick={() => onDelete(record)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Notes section for records with notes */}
      {records.some(record => record.notes) && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="text-xs text-gray-600">
            <strong>Notes:</strong> Some records contain additional notes. View details to see full information.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable; 