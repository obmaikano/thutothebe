import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { 
  BarChart3, FileText, Download, Calendar, 
  Users, BookOpen, TrendingUp, PieChart,
  Target, Activity, Award, Clock,
  Filter, Search, Eye
} from 'lucide-react';

// Card component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Report Card component
const ReportCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  lastGenerated?: string;
  onGenerate: () => void;
  onView?: () => void;
}> = ({ title, description, icon, iconColor, lastGenerated, onGenerate, onView }) => (
  <Card>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {lastGenerated && (
            <p className="text-xs text-gray-500 mt-1">Last generated: {lastGenerated}</p>
          )}
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onGenerate}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Download size={16} />
        Generate
      </button>
      {onView && (
        <button
          onClick={onView}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Eye size={16} />
          View
        </button>
      )}
    </div>
  </Card>
);

export const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students } = useAppSelector(state => state.students);
  const { teachers } = useAppSelector(state => state.teachers);
  const { classes } = useAppSelector(state => state.classes);
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');
  const [selectedReportType, setSelectedReportType] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudents()),
          dispatch(fetchTeachers()),
          dispatch(fetchClasses())
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const handleGenerateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report for ${selectedPeriod}`);
    // Implementation would go here
  };

  const handleViewReport = (reportType: string) => {
    console.log(`Viewing ${reportType} report`);
    // Implementation would go here
  };

  // Calculate some basic statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.active && s.status === 'ACTIVE').length;
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.active).length;
  const totalClasses = classes.length;
  const attendanceRate = 92; // Mock data

  const academicReports = [
    {
      id: 'student-performance',
      title: 'Student Performance Report',
      description: 'Comprehensive analysis of student academic performance across all subjects',
      icon: <TrendingUp size={20} />,
      iconColor: 'bg-blue-100 text-blue-600',
      lastGenerated: '2025-01-15'
    },
    {
      id: 'class-performance',
      title: 'Class Performance Analysis',
      description: 'Performance comparison across different classes and grade levels',
      icon: <BarChart3 size={20} />,
      iconColor: 'bg-green-100 text-green-600',
      lastGenerated: '2025-01-14'
    },
    {
      id: 'subject-analysis',
      title: 'Subject Performance Analysis',
      description: 'Detailed breakdown of performance by subject areas',
      icon: <BookOpen size={20} />,
      iconColor: 'bg-purple-100 text-purple-600',
      lastGenerated: '2025-01-13'
    },
    {
      id: 'attendance-report',
      title: 'Attendance Report',
      description: 'Student and staff attendance patterns and trends',
      icon: <Clock size={20} />,
      iconColor: 'bg-orange-100 text-orange-600',
      lastGenerated: '2025-01-15'
    }
  ];

  const administrativeReports = [
    {
      id: 'enrollment-report',
      title: 'Enrollment Report',
      description: 'Student enrollment statistics and demographic breakdown',
      icon: <Users size={20} />,
      iconColor: 'bg-indigo-100 text-indigo-600',
      lastGenerated: '2025-01-10'
    },
    {
      id: 'staff-report',
      title: 'Staff Report',
      description: 'Teaching staff allocation, qualifications, and performance metrics',
      icon: <Award size={20} />,
      iconColor: 'bg-pink-100 text-pink-600',
      lastGenerated: '2025-01-12'
    },
    {
      id: 'resource-utilization',
      title: 'Resource Utilization',
      description: 'Classroom and facility usage statistics',
      icon: <Activity size={20} />,
      iconColor: 'bg-yellow-100 text-yellow-600',
      lastGenerated: '2025-01-11'
    },
    {
      id: 'financial-summary',
      title: 'Financial Summary',
      description: 'Budget allocation and expenditure summary',
      icon: <PieChart size={20} />,
      iconColor: 'bg-red-100 text-red-600',
      lastGenerated: '2025-01-09'
    }
  ];

  const filteredAcademicReports = selectedReportType === 'all' || selectedReportType === 'academic' 
    ? academicReports : [];
  const filteredAdministrativeReports = selectedReportType === 'all' || selectedReportType === 'administrative' 
    ? administrativeReports : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate and view comprehensive school reports</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Calendar size={16} />
            Schedule Reports
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FileText size={16} />
            Custom Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="current-term">Current Term</option>
            <option value="previous-term">Previous Term</option>
            <option value="academic-year">Academic Year</option>
            <option value="custom">Custom Period</option>
          </select>
          <select 
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reports</option>
            <option value="academic">Academic Reports</option>
            <option value="administrative">Administrative Reports</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeStudents}</div>
              <div className="text-sm text-gray-500">Active Students</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Award size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeTeachers}</div>
              <div className="text-sm text-gray-500">Active Teachers</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalClasses}</div>
              <div className="text-sm text-gray-500">Total Classes</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{attendanceRate}%</div>
              <div className="text-sm text-gray-500">Attendance Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Academic Reports */}
      {filteredAcademicReports.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAcademicReports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                iconColor={report.iconColor}
                lastGenerated={report.lastGenerated}
                onGenerate={() => handleGenerateReport(report.id)}
                onView={() => handleViewReport(report.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Administrative Reports */}
      {filteredAdministrativeReports.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Administrative Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdministrativeReports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                iconColor={report.iconColor}
                lastGenerated={report.lastGenerated}
                onGenerate={() => handleGenerateReport(report.id)}
                onView={() => handleViewReport(report.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Student Performance Report - Term 1', date: '2025-01-15', type: 'Academic', status: 'Completed' },
            { name: 'Attendance Summary - January', date: '2025-01-14', type: 'Administrative', status: 'Completed' },
            { name: 'Class Performance Analysis', date: '2025-01-13', type: 'Academic', status: 'Completed' },
            { name: 'Staff Allocation Report', date: '2025-01-12', type: 'Administrative', status: 'Processing' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.type} • {report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                {report.status === 'Completed' && (
                  <button className="text-blue-600 hover:text-blue-800 p-1">
                    <Download size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}; 