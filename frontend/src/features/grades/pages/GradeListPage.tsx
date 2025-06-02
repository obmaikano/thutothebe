import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchGrades, clearError, deleteGrade } from '../gradesSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Grade } from '../../../api/services/gradeApi';
import { Plus, Search, BarChart, Edit, Trash2, Eye, Filter, Download } from 'lucide-react';

const GradeListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { grades, status, error } = useAppSelector(state => state.grades);
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeTypeFilter, setGradeTypeFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  useEffect(() => {
    dispatch(fetchGrades());
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCreateGrade = () => {
    dispatch(openModal({
      title: 'Add New Grade',
      bodyType: MODAL_BODY_TYPES.GRADE_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEdit = (grade: Grade) => {
    dispatch(openModal({
      title: 'Edit Grade',
      bodyType: MODAL_BODY_TYPES.GRADE_EDIT,
      extraObject: grade
    }));
  };

  const handleDelete = (grade: Grade) => {
    dispatch(openModal({
      title: 'Delete Grade',
      bodyType: MODAL_BODY_TYPES.GRADE_DELETE_CONFIRMATION,
      extraObject: grade
    }));
  };

  const handleViewDetails = (grade: Grade) => {
    dispatch(openModal({
      title: 'Grade Details',
      bodyType: MODAL_BODY_TYPES.GRADE_VIEW_DETAILS,
      extraObject: grade
    }));
  };

  const handleBulkGrade = () => {
    dispatch(openModal({
      title: 'Bulk Grade Entry',
      bodyType: MODAL_BODY_TYPES.GRADE_BULK_UPDATE,
      size: 'xl'
    }));
  };

  const handleExportGrades = () => {
    dispatch(openModal({
      title: 'Export Grades',
      bodyType: MODAL_BODY_TYPES.GRADE_EXPORT,
      size: 'md'
    }));
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const filteredGrades = grades.filter((grade: Grade) => {
    const studentName = getStudentName(grade.studentId);
    const courseName = getCourseName(grade.courseId);
    
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.gradeType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGradeType = 
      gradeTypeFilter === '' || grade.gradeType === gradeTypeFilter;

    const matchesCourse = 
      courseFilter === '' || grade.courseId.toString() === courseFilter;

    const matchesStudent = 
      studentFilter === '' || grade.studentId.toString() === studentFilter;

    return matchesSearch && matchesGradeType && matchesCourse && matchesStudent;
  });

  const getGradeTypeColor = (gradeType: string) => {
    switch (gradeType) {
      case 'ASSIGNMENT': return 'bg-blue-100 text-blue-800';
      case 'ASSESSMENT': return 'bg-green-100 text-green-800';
      case 'QUIZ': return 'bg-yellow-100 text-yellow-800';
      case 'EXAM': return 'bg-red-100 text-red-800';
      case 'PROJECT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradePercentage = (score: number, maxScore: number) => {
    return ((score / maxScore) * 100).toFixed(1);
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900">Grade Management</h1>
          <p className="text-gray-600 mt-2">Manage student grades, assessments, and academic performance</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleBulkGrade} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart size={16} />
            Bulk Grade
          </button>
          <button 
            onClick={handleExportGrades} 
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={handleCreateGrade} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Grade
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search grades by student, course, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={gradeTypeFilter}
            onChange={(e) => setGradeTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="ASSESSMENT">Assessment</option>
            <option value="QUIZ">Quiz</option>
            <option value="EXAM">Exam</option>
            <option value="PROJECT">Project</option>
          </select>
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <select 
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {grades.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BarChart size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{grades.length}</div>
                <div className="text-sm text-gray-500">Total Grades</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(grades.reduce((sum, grade) => sum + ((grade.score / grade.maxScore) * 100), 0) / grades.length).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Average Grade</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <BarChart size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {grades.filter(g => g.isModerated).length}
                </div>
                <div className="text-sm text-gray-500">Moderated Grades</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <BarChart size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {grades.filter(g => g.isFinal).length}
                </div>
                <div className="text-sm text-gray-500">Final Grades</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grades Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letter Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => {
                const percentage = parseFloat(getGradePercentage(grade.score, grade.maxScore));
                const letterGrade = getGradeLetter(percentage);
                
                return (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getStudentName(grade.studentId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCourseName(grade.courseId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeTypeColor(grade.gradeType)}`}>
                        {grade.gradeType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {grade.score} / {grade.maxScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                        letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                        letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        letterGrade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {grade.isFinal && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Final
                          </span>
                        )}
                        {grade.isModerated && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Moderated
                          </span>
                        )}
                        {!grade.active && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(grade)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(grade)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Grade"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(grade)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Grade"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredGrades.length === 0 && (
          <div className="text-center py-12">
            <BarChart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No grades found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || gradeTypeFilter || courseFilter || studentFilter
                ? 'Try adjusting your search criteria.'
                : 'Get started by adding your first grade.'}
            </p>
            {!searchTerm && !gradeTypeFilter && !courseFilter && !studentFilter && (
              <div className="mt-6">
                <button
                  onClick={handleCreateGrade}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add Grade
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeListPage; 