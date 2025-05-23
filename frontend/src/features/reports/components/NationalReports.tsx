import React, { useState } from 'react';
import { 
  School, Users, TrendingUp, TrendingDown, BookOpen, 
  Download, Filter, Calendar, BarChart3, FileText,
  Target, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { StatCard } from '../../../components/ui/stat-card';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';

export const NationalReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock data for national statistics
  const nationalStats = {
    totalSchools: 1250,
    totalStudents: 485000,
    totalTeachers: 28500,
    averagePerformance: 73.2,
    completionRate: 89.5,
    dropoutRate: 5.8
  };

  // Mock data for regional performance
  const regionalPerformance = [
    { region: 'Gaborone', schools: 285, students: 125000, avgPerformance: 78.5, completionRate: 92.1, dropoutRate: 4.2 },
    { region: 'Francistown', schools: 195, students: 95000, avgPerformance: 75.8, completionRate: 90.5, dropoutRate: 5.1 },
    { region: 'Molepolole', schools: 168, students: 82000, avgPerformance: 71.4, completionRate: 88.7, dropoutRate: 6.3 },
    { region: 'Maun', schools: 142, students: 68000, avgPerformance: 69.2, completionRate: 86.9, dropoutRate: 7.2 },
    { region: 'Kanye', schools: 125, students: 55000, avgPerformance: 70.8, completionRate: 87.8, dropoutRate: 6.8 },
    { region: 'Serowe', schools: 98, students: 42000, avgPerformance: 68.5, completionRate: 85.4, dropoutRate: 8.1 },
    { region: 'Palapye', schools: 87, students: 38000, avgPerformance: 67.9, completionRate: 84.6, dropoutRate: 8.5 },
    { region: 'Lobatse', schools: 75, students: 32000, avgPerformance: 69.7, completionRate: 86.2, dropoutRate: 7.8 },
    { region: 'Kasane', schools: 45, students: 18000, avgPerformance: 66.3, completionRate: 83.1, dropoutRate: 9.2 },
    { region: 'Ghanzi', schools: 30, students: 12000, avgPerformance: 64.8, completionRate: 81.5, dropoutRate: 10.1 }
  ];

  // Mock data for subject performance
  const subjectPerformance = [
    { subject: 'Mathematics', avgScore: 68.5, passRate: 72.3, trend: 2.1 },
    { subject: 'English', avgScore: 75.2, passRate: 84.6, trend: 1.8 },
    { subject: 'Setswana', avgScore: 79.1, passRate: 89.2, trend: 0.5 },
    { subject: 'Science', avgScore: 71.8, passRate: 78.1, trend: 3.2 },
    { subject: 'Social Studies', avgScore: 73.6, passRate: 81.4, trend: 1.4 },
    { subject: 'Biology', avgScore: 69.2, passRate: 74.5, trend: -0.8 },
    { subject: 'Chemistry', avgScore: 66.8, passRate: 71.2, trend: -1.2 },
    { subject: 'Physics', avgScore: 64.3, passRate: 68.7, trend: -0.5 }
  ];

  // Mock data for learner progression trends
  const progressionTrends = [
    { grade: 'Grade 8', enrollment: 62000, promoted: 58500, repeated: 2800, dropped: 700 },
    { grade: 'Grade 9', enrollment: 58500, promoted: 55200, repeated: 2600, dropped: 700 },
    { grade: 'Grade 10', enrollment: 55200, promoted: 51800, repeated: 2500, dropped: 900 },
    { grade: 'Grade 11', enrollment: 51800, promoted: 48200, repeated: 2400, dropped: 1200 },
    { grade: 'Grade 12', enrollment: 48200, promoted: 44500, repeated: 2800, dropped: 900 }
  ];

  const exportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    // Implementation for export functionality would go here
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">National Education Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive overview of national education performance and trends</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            {regionalPerformance.map(region => (
              <option key={region.region} value={region.region}>{region.region}</option>
            ))}
          </select>
          <Button onClick={() => exportReport('national')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Report Navigation */}
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Detailed Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/app/reports/school-performance" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <School size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">School Performance</p>
                <p className="text-sm text-gray-500">Detailed school analytics</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/reports/learner-progression" 
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Learner Progression</p>
                <p className="text-sm text-gray-500">Progression & dropout analysis</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/reports/subject-analytics" 
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Subject Analytics</p>
                <p className="text-sm text-gray-500">Subject performance data</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/reports/assignment-tracking" 
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <FileText size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Assignment Tracking</p>
                <p className="text-sm text-gray-500">Assignment submission data</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* National Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Schools"
          value={nationalStats.totalSchools.toLocaleString()}
          icon={School}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Students"
          value={nationalStats.totalStudents.toLocaleString()}
          icon={Users}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Teachers"
          value={nationalStats.totalTeachers.toLocaleString()}
          icon={Users}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Avg Performance"
          value={`${nationalStats.averagePerformance}%`}
          icon={Target}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${nationalStats.completionRate}%`}
          icon={CheckCircle}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Dropout Rate"
          value={`${nationalStats.dropoutRate}%`}
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance Summary */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Regional Performance Summary</h2>
            <Button 
              onClick={() => exportReport('regional')} 
              variant="outline" 
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schools
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionalPerformance.slice(0, 8).map((region) => (
                  <tr key={region.region} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.schools}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.students.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`mr-2 ${
                          region.avgPerformance >= 75 ? 'text-green-600' :
                          region.avgPerformance >= 65 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {region.avgPerformance}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              region.avgPerformance >= 75 ? 'bg-green-500' :
                              region.avgPerformance >= 65 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${region.avgPerformance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.completionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Subject Performance Analytics */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Subject Performance Analytics</h2>
            <Button 
              onClick={() => exportReport('subject')} 
              variant="outline" 
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{subject.subject}</h3>
                    <div className="flex items-center">
                      {subject.trend > 0 ? (
                        <TrendingUp size={16} className="text-green-500 mr-1" />
                      ) : subject.trend < 0 ? (
                        <TrendingDown size={16} className="text-red-500 mr-1" />
                      ) : null}
                      <span className={`text-xs font-medium ${
                        subject.trend > 0 ? 'text-green-600' : 
                        subject.trend < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {subject.trend > 0 ? '+' : ''}{subject.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Avg Score: {subject.avgScore}%</span>
                    <span>Pass Rate: {subject.passRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        subject.avgScore >= 75 ? 'bg-green-500' :
                        subject.avgScore >= 65 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${subject.avgScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Learner Progression Trends */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Learner Progression & Dropout Trends</h2>
          <Button 
            onClick={() => exportReport('progression')} 
            variant="outline" 
            size="sm"
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Enrollment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promoted/Graduated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repeated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dropped Out
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dropout Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {progressionTrends.map((grade) => {
                const promoted = grade.promoted;
                const successRate = ((promoted / grade.enrollment) * 100).toFixed(1);
                const dropoutRate = ((grade.dropped / grade.enrollment) * 100).toFixed(1);
                
                return (
                  <tr key={grade.grade} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {grade.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.enrollment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoted.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.repeated.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.dropped.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(successRate) >= 90 ? 'bg-green-100 text-green-800' :
                        parseFloat(successRate) >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(dropoutRate) <= 2 ? 'bg-green-100 text-green-800' :
                        parseFloat(dropoutRate) <= 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {dropoutRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}; 