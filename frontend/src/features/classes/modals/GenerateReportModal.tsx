import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { BarChart3, Download, Calendar, FileText, Users, TrendingUp, ClipboardCheck } from 'lucide-react';

interface GenerateReportModalProps {
  extraObject?: {
    classId: number;
    className: string;
    studentCount: number;
  };
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  
  const [reportType, setReportType] = useState<string>('attendance');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'semester' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeGraphs, setIncludeGraphs] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  const classId = extraObject?.classId;
  const className = extraObject?.className || 'Class';
  const studentCount = extraObject?.studentCount || 0;

  const reportTypes = [
    {
      id: 'attendance',
      name: 'Attendance Report',
      description: 'Daily attendance records and statistics',
      icon: ClipboardCheck,
      color: 'text-blue-600'
    },
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'Academic performance and grades analysis',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      id: 'student-list',
      name: 'Student List Report',
      description: 'Complete student roster with details',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'summary',
      name: 'Class Summary Report',
      description: 'Comprehensive overview of class activities',
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case 'semester': return 'Current semester';
      case 'custom': return 'Custom date range';
      default: return '';
    }
  };

  const handleGenerateReport = async () => {
    if (!classId) return;

    try {
      setIsLoading(true);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        classId,
        reportType,
        dateRange: dateRange === 'custom' ? { startDate, endDate } : dateRange,
        format,
        includeGraphs,
        timestamp: new Date().toISOString()
      };
      
      console.log('Report generated:', reportData);
      
      // Simulate file download
      const blob = new Blob(['Report content would be here'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${className}-${reportType}-report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const selectedReportType = reportTypes.find(type => type.id === reportType);

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
        <div className="p-2 bg-purple-100 rounded-lg">
          <BarChart3 className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Generate Report</h2>
          <p className="text-sm text-gray-600">{className} • {studentCount} students</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Report Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className={`relative rounded-lg border-2 cursor-pointer p-4 transition-colors ${
                  reportType === type.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setReportType(type.id)}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className={`h-6 w-6 mt-1 ${type.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="reportType"
                        value={type.id}
                        checked={reportType === type.id}
                        onChange={() => setReportType(type.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Range Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Date Range
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {(['week', 'month', 'semester', 'custom'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                dateRange === range
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range === 'week' && 'Last Week'}
              {range === 'month' && 'Last Month'}
              {range === 'semester' && 'Semester'}
              {range === 'custom' && 'Custom'}
            </button>
          ))}
        </div>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Format and Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="space-y-2">
            {([
              { id: 'pdf', name: 'PDF Document', description: 'Best for printing and sharing' },
              { id: 'excel', name: 'Excel Spreadsheet', description: 'Best for data analysis' },
              { id: 'csv', name: 'CSV File', description: 'Best for importing to other systems' }
            ] as const).map((formatOption) => (
              <div key={formatOption.id} className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value={formatOption.id}
                  checked={format === formatOption.id}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-900">
                    {formatOption.name}
                  </label>
                  <p className="text-xs text-gray-500">{formatOption.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Options
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={includeGraphs}
                onChange={(e) => setIncludeGraphs(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-900">
                Include charts and graphs
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {selectedReportType && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Report Preview</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Type:</strong> {selectedReportType.name}</p>
            <p><strong>Class:</strong> {className}</p>
            <p><strong>Period:</strong> {getDateRangeText()}</p>
            <p><strong>Format:</strong> {format.toUpperCase()}</p>
            <p><strong>Includes:</strong> {includeGraphs ? 'Charts and data' : 'Data only'}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleGenerateReport}
          disabled={isLoading || (dateRange === 'custom' && (!startDate || !endDate))}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate & Download
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerateReportModal; 