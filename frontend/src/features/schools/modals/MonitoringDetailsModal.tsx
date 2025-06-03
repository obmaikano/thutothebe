import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import MonitoringDashboard from '../components/MonitoringDashboard';
import { School } from '../../../api/services/schoolApi';
import { Region } from '../../../api/services/regionApi';
import { SchoolMonitoring } from '../../../api/services/schoolMonitoringApi';
import { RegionMonitoring } from '../../../api/services/regionMonitoringApi';
import { X } from 'lucide-react';

interface MonitoringDetailsModalProps {
  extraObject?: {
    school?: School;
    region?: Region;
    monitoring?: SchoolMonitoring | RegionMonitoring | null;
  };
}

const MonitoringDetailsModal: React.FC<MonitoringDetailsModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (!extraObject) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No monitoring data available.</p>
        <button
          onClick={handleClose}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    );
  }

  const { school, region, monitoring } = extraObject;

  // Handle school monitoring
  if (school && monitoring) {
    return (
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
        <MonitoringDashboard 
          school={school} 
          monitoring={monitoring as SchoolMonitoring} 
        />
      </div>
    );
  }

  // Handle region monitoring
  if (region && monitoring) {
    const regionMonitoringData = monitoring as RegionMonitoring;
    
    return (
      <div className="relative p-6 space-y-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
        
        {/* Regional Monitoring Header */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {region.name} - Regional Monitoring
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {regionMonitoringData.updatedAt ? new Date(regionMonitoringData.updatedAt).toLocaleString() : 'N/A'}
          </p>
        </div>

        {/* Regional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {regionMonitoringData.totalSchools || 0}
            </div>
            <div className="text-sm text-gray-500">Total Schools</div>
            {regionMonitoringData.activeSchools && (
              <div className="text-xs text-gray-400 mt-1">
                {regionMonitoringData.activeSchools} active
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {regionMonitoringData.totalTeachers || 0}
            </div>
            <div className="text-sm text-gray-500">Total Teachers</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {regionMonitoringData.totalStudents || 0}
            </div>
            <div className="text-sm text-gray-500">Total Students</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {regionMonitoringData.averageAttendanceRate ? 
                (regionMonitoringData.averageAttendanceRate * 100).toFixed(1) : 'N/A'}%
            </div>
            <div className="text-sm text-gray-500">Avg Attendance</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Compliance Score</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.averageComplianceScore ? 
                    (regionMonitoringData.averageComplianceScore * 100).toFixed(1) : 'N/A'}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Performing Schools</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.highPerformingSchools || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Performing Schools</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.lowPerformingSchools || 'N/A'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Schools with Low Usage</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.schoolsWithLowUsage || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Schools with Delayed Grading</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.schoolsWithDelayedGrading || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Alerts</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.totalAlerts || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {regionMonitoringData.totalLogins || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Total Logins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {regionMonitoringData.averageGradingTurnaroundHours ? 
                  `${regionMonitoringData.averageGradingTurnaroundHours.toFixed(1)}h` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Avg Grading Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {regionMonitoringData.resourceUtilizationRate ? 
                  `${(regionMonitoringData.resourceUtilizationRate * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Resource Utilization</div>
            </div>
          </div>
        </div>

        {/* Academic Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Assignment Submissions</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.totalAssignmentSubmissions || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Assignments Graded</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.totalAssignmentsGraded || 'N/A'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Curriculum Completion</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.averageCurriculumCompletionRate ? 
                    `${(regionMonitoringData.averageCurriculumCompletionRate * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg System Uptime</span>
                <span className="text-sm font-medium text-gray-900">
                  {regionMonitoringData.averageSystemUptimePercentage ? 
                    `${(regionMonitoringData.averageSystemUptimePercentage * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for no data
  return (
    <div className="p-6 text-center">
      <p className="text-gray-600">No monitoring data available for this item.</p>
      <button
        onClick={handleClose}
        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        Close
      </button>
    </div>
  );
};

export default MonitoringDetailsModal; 