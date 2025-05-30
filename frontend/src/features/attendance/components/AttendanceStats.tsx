import React from 'react';
import { CheckSquare, X, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { AttendanceStats as AttendanceStatsType } from '../../../api/services/attendanceApi';

interface AttendanceStatsProps {
  stats: AttendanceStatsType | null;
  title?: string;
  showPercentage?: boolean;
  className?: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  stats,
  title = "Attendance Statistics",
  showPercentage = true,
  className = ""
}) => {
  if (!stats) {
    return (
      <div className={`card bg-base-100 shadow-sm ${className}`}>
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No attendance data available</p>
          </div>
        </div>
      </div>
    );
  }

  const total = Object.values(stats).reduce((sum, count) => sum + (count || 0), 0);
  const present = (stats.PRESENT || 0) + (stats.LATE || 0);
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const getStatColor = (type: string) => {
    switch (type) {
      case 'PRESENT': return 'text-green-600 bg-green-100';
      case 'ABSENT_EXCUSED': return 'text-yellow-600 bg-yellow-100';
      case 'ABSENT_UNEXCUSED': return 'text-red-600 bg-red-100';
      case 'LATE': return 'text-orange-600 bg-orange-100';
      case 'EARLY_DEPARTURE': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'PRESENT': return <CheckSquare className="w-5 h-5" />;
      case 'ABSENT_EXCUSED': return <AlertTriangle className="w-5 h-5" />;
      case 'ABSENT_UNEXCUSED': return <X className="w-5 h-5" />;
      case 'LATE': return <Clock className="w-5 h-5" />;
      case 'EARLY_DEPARTURE': return <Clock className="w-5 h-5" />;
      default: return <CheckSquare className="w-5 h-5" />;
    }
  };

  const getStatLabel = (type: string) => {
    switch (type) {
      case 'PRESENT': return 'Present';
      case 'ABSENT_EXCUSED': return 'Excused Absent';
      case 'ABSENT_UNEXCUSED': return 'Unexcused Absent';
      case 'LATE': return 'Late';
      case 'EARLY_DEPARTURE': return 'Early Departure';
      default: return type;
    }
  };

  return (
    <div className={`card bg-base-100 shadow-sm ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">{title}</h3>
          {showPercentage && (
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${attendanceRate >= 90 ? 'bg-green-100' : attendanceRate >= 75 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {attendanceRate >= 90 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <span className={`text-lg font-bold ${attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                {attendanceRate}%
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats).map(([type, count]) => (
            <div key={type} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getStatColor(type)}`}>
                {getStatIcon(type)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{count || 0}</div>
              <div className="text-sm text-gray-600">{getStatLabel(type)}</div>
            </div>
          ))}
        </div>

        {showPercentage && total > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Attendance Rate</span>
              <span>{present} of {total} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${attendanceRate >= 90 ? 'bg-green-500' : attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(attendanceRate, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 