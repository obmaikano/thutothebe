import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchGrades } from '../gradesSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { Grade } from '../../../api/services/gradeApi';
import { Download, X, FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';

const exportSchema = z.object({
  courseId: z.number().optional(),
  studentId: z.number().optional(),
  gradeType: z.enum(['ASSIGNMENT', 'ASSESSMENT', 'QUIZ', 'EXAM', 'PROJECT', 'ALL']).default('ALL'),
  dateRange: z.enum(['ALL', 'CURRENT_TERM', 'CURRENT_YEAR', 'CUSTOM']).default('ALL'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  format: z.enum(['CSV', 'EXCEL', 'PDF']).default('CSV'),
  includeStatistics: z.boolean().default(true),
  includeComments: z.boolean().default(true),
  groupBy: z.enum(['STUDENT', 'COURSE', 'TYPE', 'DATE']).default('STUDENT'),
});

type ExportFormData = z.infer<typeof exportSchema>;

interface GradeExportModalProps {
  extraObject?: {
    courseId?: number;
    studentId?: number;
    selectedGrades?: Grade[];
  };
}

const GradeExportModal: React.FC<GradeExportModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { grades } = useAppSelector(state => state.grades);
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ExportFormData>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      courseId: extraObject?.courseId || undefined,
      studentId: extraObject?.studentId || undefined,
      gradeType: 'ALL',
      dateRange: 'ALL',
      format: 'CSV',
      includeStatistics: true,
      includeComments: true,
      groupBy: 'STUDENT',
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    dispatch(fetchGrades());
  }, [dispatch]);

  useEffect(() => {
    // Filter grades based on form values
    let filtered = extraObject?.selectedGrades || grades;

    if (watchedValues.courseId) {
      filtered = filtered.filter(grade => grade.courseId === watchedValues.courseId);
    }

    if (watchedValues.studentId) {
      filtered = filtered.filter(grade => grade.studentId === watchedValues.studentId);
    }

    if (watchedValues.gradeType && watchedValues.gradeType !== 'ALL') {
      filtered = filtered.filter(grade => grade.gradeType === watchedValues.gradeType);
    }

    if (watchedValues.dateRange !== 'ALL') {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      switch (watchedValues.dateRange) {
        case 'CURRENT_TERM':
          // Filter by current term (simplified logic)
          filtered = filtered.filter(grade => {
            const gradeDate = new Date(grade.gradedAt);
            return gradeDate.getFullYear() === currentYear;
          });
          break;
        case 'CURRENT_YEAR':
          filtered = filtered.filter(grade => {
            const gradeDate = new Date(grade.gradedAt);
            return gradeDate.getFullYear() === currentYear;
          });
          break;
        case 'CUSTOM':
          if (watchedValues.startDate && watchedValues.endDate) {
            const startDate = new Date(watchedValues.startDate);
            const endDate = new Date(watchedValues.endDate);
            filtered = filtered.filter(grade => {
              const gradeDate = new Date(grade.gradedAt);
              return gradeDate >= startDate && gradeDate <= endDate;
            });
          }
          break;
      }
    }

    setFilteredGrades(filtered);
  }, [watchedValues, grades, extraObject]);

  const generateCSV = (grades: Grade[]) => {
    const headers = [
      'Student ID',
      'Student Name',
      'Course',
      'Grade Type',
      'Score',
      'Max Score',
      'Percentage',
      'Weight',
      'Graded Date',
      ...(watchedValues.includeComments ? ['Feedback'] : []),
    ];

    const rows = grades.map(grade => {
      const student = students.find(s => s.id === grade.studentId);
      const course = courses.find(c => c.id === grade.courseId);
      const studentName = student ? `${student.firstName} ${student.lastName}` : `Student ${grade.studentId}`;
      const courseName = course ? course.name : `Course ${grade.courseId}`;
      const percentage = grade.maxScore > 0 ? ((grade.score / grade.maxScore) * 100).toFixed(1) : '0';

      const row = [
        grade.studentId.toString(),
        studentName,
        courseName,
        grade.gradeType,
        grade.score.toString(),
        grade.maxScore.toString(),
        percentage,
        grade.weight.toString(),
        new Date(grade.gradedAt).toLocaleDateString(),
        ...(watchedValues.includeComments ? [grade.feedback || ''] : []),
      ];

      return row;
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  };

  const generateStatistics = (grades: Grade[]) => {
    if (!watchedValues.includeStatistics || grades.length === 0) return '';

    const totalGrades = grades.length;
    const averageScore = grades.reduce((sum, grade) => {
      const percentage = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0;
      return sum + percentage;
    }, 0) / totalGrades;

    const scores = grades.map(grade => 
      grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
    ).sort((a, b) => a - b);

    const median = scores.length % 2 === 0
      ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
      : scores[Math.floor(scores.length / 2)];

    const gradeDistribution = {
      A: scores.filter(s => s >= 90).length,
      B: scores.filter(s => s >= 80 && s < 90).length,
      C: scores.filter(s => s >= 70 && s < 80).length,
      D: scores.filter(s => s >= 60 && s < 70).length,
      F: scores.filter(s => s < 60).length,
    };

    return `\n\nSTATISTICS\n` +
           `Total Grades: ${totalGrades}\n` +
           `Average Score: ${averageScore.toFixed(1)}%\n` +
           `Median Score: ${median.toFixed(1)}%\n` +
           `Highest Score: ${Math.max(...scores).toFixed(1)}%\n` +
           `Lowest Score: ${Math.min(...scores).toFixed(1)}%\n` +
           `\nGrade Distribution:\n` +
           `A (90-100%): ${gradeDistribution.A}\n` +
           `B (80-89%): ${gradeDistribution.B}\n` +
           `C (70-79%): ${gradeDistribution.C}\n` +
           `D (60-69%): ${gradeDistribution.D}\n` +
           `F (0-59%): ${gradeDistribution.F}\n`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onSubmit = async (data: ExportFormData) => {
    if (filteredGrades.length === 0) {
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Group grades if needed
      let groupedGrades = filteredGrades;
      if (data.groupBy !== 'STUDENT') {
        // Implement grouping logic here if needed
        // For now, we'll just sort by the grouping criteria
        switch (data.groupBy) {
          case 'COURSE':
            groupedGrades = [...filteredGrades].sort((a, b) => a.courseId - b.courseId);
            break;
          case 'TYPE':
            groupedGrades = [...filteredGrades].sort((a, b) => a.gradeType.localeCompare(b.gradeType));
            break;
          case 'DATE':
            groupedGrades = [...filteredGrades].sort((a, b) => 
              new Date(a.gradedAt).getTime() - new Date(b.gradedAt).getTime()
            );
            break;
          default:
            groupedGrades = [...filteredGrades].sort((a, b) => a.studentId - b.studentId);
        }
      }

      // Generate export content
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (data.format) {
        case 'CSV':
          content = generateCSV(groupedGrades);
          if (data.includeStatistics) {
            content += generateStatistics(groupedGrades);
          }
          filename = `grades_export_${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'EXCEL':
          // For now, export as CSV with .xlsx extension
          // In a real implementation, you'd use a library like xlsx
          content = generateCSV(groupedGrades);
          if (data.includeStatistics) {
            content += generateStatistics(groupedGrades);
          }
          filename = `grades_export_${new Date().toISOString().split('T')[0]}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'PDF':
          // For now, export as text with .pdf extension
          // In a real implementation, you'd use a library like jsPDF
          content = generateCSV(groupedGrades);
          if (data.includeStatistics) {
            content += generateStatistics(groupedGrades);
          }
          filename = `grades_export_${new Date().toISOString().split('T')[0]}.pdf`;
          mimeType = 'application/pdf';
          break;
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      // Download the file
      setTimeout(() => {
        downloadFile(content, filename, mimeType);
        setIsExporting(false);
        setExportProgress(0);
        dispatch(closeModal());
      }, 500);

    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student ${studentId}`;
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course ${courseId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Grades</h3>
          <p className="text-sm text-gray-600 mt-1">
            Export grade data in various formats for analysis and reporting
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredGrades.length} grade(s) to export
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Download size={16} className="text-blue-600" />
            <span className="font-medium text-blue-900">Exporting Grades...</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <div className="text-sm text-blue-700 mt-1">
            {exportProgress}% complete
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-gray-600" />
                <h4 className="font-medium text-gray-900">Filters</h4>
              </div>

              {/* Course Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  {...register('courseId', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!!extraObject?.courseId}
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  {...register('studentId', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!!extraObject?.studentId}
                >
                  <option value="">All Students</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Type Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Type
                </label>
                <select
                  {...register('gradeType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Types</option>
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="EXAM">Exam</option>
                  <option value="PROJECT">Project</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  {...register('dateRange')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Time</option>
                  <option value="CURRENT_TERM">Current Term</option>
                  <option value="CURRENT_YEAR">Current Year</option>
                  <option value="CUSTOM">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {watchedValues.dateRange === 'CUSTOM' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      {...register('startDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      {...register('endDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Export Options</h4>

              {/* Format */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      {...register('format')}
                      value="CSV"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FileText size={16} className="ml-2 mr-1 text-gray-600" />
                    <span className="text-sm">CSV</span>
                  </label>
                  <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      {...register('format')}
                      value="EXCEL"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FileSpreadsheet size={16} className="ml-2 mr-1 text-gray-600" />
                    <span className="text-sm">Excel</span>
                  </label>
                  <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100">
                    <input
                      type="radio"
                      {...register('format')}
                      value="PDF"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <FileText size={16} className="ml-2 mr-1 text-gray-600" />
                    <span className="text-sm">PDF</span>
                  </label>
                </div>
              </div>

              {/* Group By */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group By
                </label>
                <select
                  {...register('groupBy')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="STUDENT">Student</option>
                  <option value="COURSE">Course</option>
                  <option value="TYPE">Grade Type</option>
                  <option value="DATE">Date</option>
                </select>
              </div>

              {/* Include Options */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('includeStatistics')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Statistics</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('includeComments')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Comments/Feedback</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || filteredGrades.length === 0 || isExporting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download size={16} />
                )}
                Export {filteredGrades.length} Grade(s)
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Export Preview</h4>
          
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border">
              <div className="text-sm font-medium text-gray-700">Total Grades:</div>
              <div className="text-lg font-bold text-blue-600">{filteredGrades.length}</div>
            </div>

            {watchedValues.courseId && (
              <div className="bg-white p-3 rounded border">
                <div className="text-sm font-medium text-gray-700">Course:</div>
                <div className="text-sm text-gray-900">{getCourseName(watchedValues.courseId)}</div>
              </div>
            )}

            {watchedValues.studentId && (
              <div className="bg-white p-3 rounded border">
                <div className="text-sm font-medium text-gray-700">Student:</div>
                <div className="text-sm text-gray-900">{getStudentName(watchedValues.studentId)}</div>
              </div>
            )}

            <div className="bg-white p-3 rounded border">
              <div className="text-sm font-medium text-gray-700">Format:</div>
              <div className="text-sm text-gray-900 capitalize">{watchedValues.format}</div>
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="text-sm font-medium text-gray-700">Includes:</div>
              <div className="text-sm text-gray-900">
                <ul className="list-disc list-inside">
                  <li>Grade data</li>
                  {watchedValues.includeStatistics && <li>Statistics</li>}
                  {watchedValues.includeComments && <li>Comments/Feedback</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeExportModal; 