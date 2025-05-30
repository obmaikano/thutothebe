import React from 'react';
import { 
  Users, 
  CheckSquare, 
  X, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { AttendanceOverviewCard } from './AttendanceOverviewCard';

interface AttendanceDashboardData {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
  weeklyTrend?: number;
  monthlyTrend?: number;
  classesWithLowAttendance?: number;
  perfectAttendanceStudents?: number;
}

interface AttendanceDashboardProps {
  data: AttendanceDashboardData;
  loading?: boolean;
  onCardClick?: (cardType: string) => void;
  showTrends?: boolean;
  className?: string;
}

export const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({
  data,
  loading = false,
  onCardClick,
  showTrends = true,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-center">
              <div className="p-2 bg-gray-200 rounded-lg mr-3 w-12 h-12"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const attendanceRateColor = data.attendanceRate >= 95 ? 'green' : 
                             data.attendanceRate >= 85 ? 'yellow' : 'red';

  const getAttendanceRateStatus = () => {
    if (data.attendanceRate >= 95) return 'Excellent';
    if (data.attendanceRate >= 85) return 'Good';
    if (data.attendanceRate >= 75) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AttendanceOverviewCard
          title="Total Students"
          value={data.totalStudents.toLocaleString()}
          subtitle="Enrolled students"
          icon="users"
          color="blue"
          onClick={() => onCardClick?.('total-students')}
        />

        <AttendanceOverviewCard
          title="Present Today"
          value={data.presentToday.toLocaleString()}
          subtitle={`${((data.presentToday / data.totalStudents) * 100).toFixed(1)}% of total`}
          icon="present"
          color="green"
          trend={showTrends && data.weeklyTrend ? {
            value: data.weeklyTrend,
            direction: data.weeklyTrend > 0 ? 'up' : data.weeklyTrend < 0 ? 'down' : 'neutral',
            period: 'last week'
          } : undefined}
          onClick={() => onCardClick?.('present-today')}
        />

        <AttendanceOverviewCard
          title="Absent Today"
          value={data.absentToday.toLocaleString()}
          subtitle={`${((data.absentToday / data.totalStudents) * 100).toFixed(1)}% of total`}
          icon="absent"
          color="red"
          onClick={() => onCardClick?.('absent-today')}
        />

        <AttendanceOverviewCard
          title="Late Arrivals"
          value={data.lateToday.toLocaleString()}
          subtitle={`${((data.lateToday / data.totalStudents) * 100).toFixed(1)}% of total`}
          icon="late"
          color="orange"
          onClick={() => onCardClick?.('late-today')}
        />
      </div>

      {/* Attendance Rate Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-${attendanceRateColor}-100 rounded-lg`}>
              <Target className={`w-6 h-6 text-${attendanceRateColor}-600`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">School Attendance Rate</h3>
              <p className="text-sm text-gray-600">Overall attendance performance</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{data.attendanceRate}%</div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full bg-${attendanceRateColor}-100 text-${attendanceRateColor}-800`}>
              {getAttendanceRateStatus()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`bg-${attendanceRateColor}-500 h-4 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${data.attendanceRate}%` }}
          ></div>
        </div>

        {/* Attendance Rate Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {Math.round((data.presentToday / data.totalStudents) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Present</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {Math.round((data.absentToday / data.totalStudents) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Absent</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">
              {Math.round((data.lateToday / data.totalStudents) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Late</div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      {(data.classesWithLowAttendance !== undefined || data.perfectAttendanceStudents !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.classesWithLowAttendance !== undefined && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Classes Needing Attention</div>
                    <div className="text-2xl font-bold text-gray-900">{data.classesWithLowAttendance}</div>
                  </div>
                </div>
                <button 
                  onClick={() => onCardClick?.('low-attendance-classes')}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Classes with &lt;85% attendance rate
              </div>
            </div>
          )}

          {data.perfectAttendanceStudents !== undefined && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Perfect Attendance</div>
                    <div className="text-2xl font-bold text-gray-900">{data.perfectAttendanceStudents}</div>
                  </div>
                </div>
                <button 
                  onClick={() => onCardClick?.('perfect-attendance')}
                  className="text-green-600 hover:text-green-800 transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Students with 100% attendance this term
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trends Section */}
      {showTrends && (data.weeklyTrend !== undefined || data.monthlyTrend !== undefined) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
              <p className="text-sm text-gray-600">Performance over time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.weeklyTrend !== undefined && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  data.weeklyTrend > 0 ? 'text-green-600' : 
                  data.weeklyTrend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {data.weeklyTrend > 0 ? '+' : ''}{data.weeklyTrend.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">vs last week</div>
              </div>
            )}

            {data.monthlyTrend !== undefined && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  data.monthlyTrend > 0 ? 'text-green-600' : 
                  data.monthlyTrend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {data.monthlyTrend > 0 ? '+' : ''}{data.monthlyTrend.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">vs last month</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard; 