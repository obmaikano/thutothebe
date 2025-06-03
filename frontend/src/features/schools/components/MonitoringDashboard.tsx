import React from 'react';
import { SchoolMonitoring } from '../../../api/services/schoolMonitoringApi';
import { School } from '../../../api/services/schoolApi';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  BookOpen
} from 'lucide-react';

interface MonitoringDashboardProps {
  school: School;
  monitoring: SchoolMonitoring | null;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ school, monitoring }) => {
  if (!monitoring) {
    return (
      <div className="p-6 text-center">
        <Activity size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Monitoring Data Available</h3>
        <p className="text-gray-600">
          Monitoring data for {school.name} is not available at this time.
        </p>
      </div>
    );
  }

  const getPerformanceStatus = (score: number | undefined) => {
    if (!score) return { status: 'unknown', color: 'bg-gray-100 text-gray-800', label: 'Unknown' };
    if (score >= 0.8) return { status: 'excellent', color: 'bg-green-100 text-green-800', label: 'Excellent' };
    if (score >= 0.6) return { status: 'good', color: 'bg-blue-100 text-blue-800', label: 'Good' };
    if (score >= 0.4) return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', label: 'Warning' };
    return { status: 'critical', color: 'bg-red-100 text-red-800', label: 'Critical' };
  };

  const complianceStatus = getPerformanceStatus(monitoring.complianceScore);
  const attendanceStatus = getPerformanceStatus(monitoring.attendanceRate);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="text-blue-600" size={24} />
          {school.name} - Monitoring Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Last updated: {monitoring.updatedAt ? new Date(monitoring.updatedAt).toLocaleString() : 'N/A'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {monitoring.attendanceRate ? (monitoring.attendanceRate * 100).toFixed(1) : 'N/A'}%
              </div>
              <div className="text-sm text-gray-500">Attendance Rate</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
          {monitoring.attendanceRate && (
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${attendanceStatus.color}`}>
                {attendanceStatus.label}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {monitoring.complianceScore ? (monitoring.complianceScore * 100).toFixed(1) : 'N/A'}%
              </div>
              <div className="text-sm text-gray-500">Compliance Score</div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 size={20} className="text-green-600" />
            </div>
          </div>
          {monitoring.complianceScore && (
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${complianceStatus.color}`}>
                {complianceStatus.label}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {monitoring.totalLogins || 0}
              </div>
              <div className="text-sm text-gray-500">Total Logins</div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {monitoring.alertCount || 0}
              </div>
              <div className="text-sm text-gray-500">Active Alerts</div>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
          {(monitoring.alertCount || 0) > 0 && (
            <div className="mt-2">
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Needs Attention
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Usage */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            System Usage
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Teachers</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.totalActiveTeachers || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Students</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.totalActiveStudents || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Teacher Logins</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.teacherLogins || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Student Logins</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.studentLogins || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Session Duration</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.averageSessionDuration ? `${monitoring.averageSessionDuration.toFixed(1)} min` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} />
            Academic Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Assignment Submissions</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.assignmentSubmissions || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Assignments Graded</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.assignmentsGraded || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quiz Submissions</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.quizSubmissions || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Forum Posts</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.forumPosts || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Curriculum Completion</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.curriculumCompletionRate ? `${(monitoring.curriculumCompletionRate * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={18} />
          Performance Indicators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {monitoring.systemUptimePercentage ? `${(monitoring.systemUptimePercentage * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">System Uptime</div>
            {monitoring.systemUptimePercentage && monitoring.systemUptimePercentage >= 0.95 ? (
              <CheckCircle size={16} className="text-green-500 mx-auto mt-1" />
            ) : (
              <XCircle size={16} className="text-red-500 mx-auto mt-1" />
            )}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {monitoring.averageGradingTurnaroundHours ? `${monitoring.averageGradingTurnaroundHours.toFixed(1)}h` : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Avg Grading Time</div>
            {monitoring.averageGradingTurnaroundHours && monitoring.averageGradingTurnaroundHours <= 48 ? (
              <CheckCircle size={16} className="text-green-500 mx-auto mt-1" />
            ) : (
              <Clock size={16} className="text-yellow-500 mx-auto mt-1" />
            )}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {monitoring.uniqueActiveUsers || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Unique Active Users</div>
            <Activity size={16} className="text-blue-500 mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* Communication & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} />
            Communication
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Announcements</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.totalAnnouncements || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Announcements Acknowledged</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.announcementsAcknowledged || 'N/A'}
              </span>
            </div>
            {monitoring.totalAnnouncements && monitoring.announcementsAcknowledged && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Acknowledgment Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {((monitoring.announcementsAcknowledged / monitoring.totalAnnouncements) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} />
            Content Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Document Uploads</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.documentUploads || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Document Downloads</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.documentDownloads || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak Usage Hour</span>
              <span className="text-sm font-medium text-gray-900">
                {monitoring.peakUsageHour ? `${monitoring.peakUsageHour}:00` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Activity */}
      {monitoring.lastActivityTimestamp && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Last Activity</h3>
              <p className="text-sm text-gray-600">
                {new Date(monitoring.lastActivityTimestamp).toLocaleString()}
              </p>
            </div>
            <Activity size={20} className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard; 