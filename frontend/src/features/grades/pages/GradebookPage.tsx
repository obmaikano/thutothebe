import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchGradesByCourseId, createGrade, updateGrade, clearError } from '../gradesSlice';
import { fetchStudentsByClass } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchGradeCategories } from '../gradeCategoriesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { useAuth } from '../../../contexts/AuthContext';
import { Grade, CreateGradeRequest, UpdateGradeRequest } from '../../../api/services/gradeApi';
import { Save, Plus, Settings, Download, Upload, BarChart, Filter, Search } from 'lucide-react';

const GradebookPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { grades, status, error } = useAppSelector(state => state.grades);
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const { classes } = useAppSelector(state => state.classes);
  const { gradeCategories } = useAppSelector(state => state.gradeCategories);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingGrade, setEditingGrade] = useState<{ studentId: number; categoryId: number } | null>(null);
  const [gradeValues, setGradeValues] = useState<{ [key: string]: string }>({});
  
  // Search states
  const [classSearch, setClassSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  // Filter functions for searchable dropdowns
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(classSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.code?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchCourses());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchStudentsByClass(selectedClass));
    }
  }, [dispatch, selectedClass]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchGradesByCourseId(selectedCourse));
      dispatch(fetchGradeCategories(selectedCourse));
    }
  }, [dispatch, selectedCourse]);

  const handleClassSelect = (classObj: any) => {
    setSelectedClass(classObj.id);
    setClassSearch(classObj.name);
    setShowClassDropdown(false);
    setGradeValues({});
  };

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course.id);
    setCourseSearch(course.name);
    setSelectedCategory(null);
    setShowCourseDropdown(false);
    setGradeValues({});
  };

  const handleCategoryChange = (categoryId: string) => {
    const id = categoryId ? parseInt(categoryId) : null;
    setSelectedCategory(id);
  };

  const getGradeKey = (studentId: number, categoryId: number) => {
    return `${studentId}-${categoryId}`;
  };

  const getStudentGrade = (studentId: number, categoryId: number) => {
    return grades.find(g => g.studentId === studentId && g.gradeCategoryId === categoryId);
  };

  const handleGradeChange = (studentId: number, categoryId: number, value: string) => {
    const key = getGradeKey(studentId, categoryId);
    setGradeValues(prev => ({ ...prev, [key]: value }));
  };

  const handleGradeSave = async (studentId: number, categoryId: number) => {
    const key = getGradeKey(studentId, categoryId);
    const value = gradeValues[key];
    
    if (!value || !selectedCourse || !user?.id) return;

    const score = parseFloat(value);
    if (isNaN(score)) return;

    const existingGrade = getStudentGrade(studentId, categoryId);
    const category = gradeCategories.find(c => c.id === categoryId);
    
    try {
      if (existingGrade) {
        const updateData: UpdateGradeRequest = {
          score: score,
          maxScore: category?.maxGrade || 100
        };
        await dispatch(updateGrade({ id: existingGrade.id, gradeData: updateData })).unwrap();
      } else {
        const createData: CreateGradeRequest = {
          studentId,
          courseId: selectedCourse,
          gradeCategoryId: categoryId,
          gradeType: 'ASSESSMENT',
          score: score,
          maxScore: category?.maxGrade || 100,
          gradedById: user.id
        };
        await dispatch(createGrade(createData)).unwrap();
      }
      
      setEditingGrade(null);
      setGradeValues(prev => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
    } catch (error) {
      console.error('Failed to save grade:', error);
    }
  };

  const handleGradeEdit = (studentId: number, categoryId: number) => {
    setEditingGrade({ studentId, categoryId });
    const existingGrade = getStudentGrade(studentId, categoryId);
    const key = getGradeKey(studentId, categoryId);
    setGradeValues(prev => ({ 
      ...prev, 
      [key]: existingGrade ? existingGrade.score.toString() : '' 
    }));
  };

  const handleBulkGradeEntry = () => {
    dispatch(openModal({
      title: 'Bulk Grade Entry',
      bodyType: MODAL_BODY_TYPES.GRADE_BULK_UPDATE,
      extraObject: { courseId: selectedCourse, categoryId: selectedCategory, classId: selectedClass },
      size: 'xl'
    }));
  };

  const handleGradeCategoryManagement = () => {
    dispatch(openModal({
      title: 'Manage Grade Categories',
      bodyType: MODAL_BODY_TYPES.GRADE_CATEGORY_MANAGE,
      extraObject: { courseId: selectedCourse },
      size: 'lg'
    }));
  };

  const handleExportGradebook = () => {
    dispatch(openModal({
      title: 'Export Gradebook',
      bodyType: MODAL_BODY_TYPES.GRADE_EXPORT,
      extraObject: { courseId: selectedCourse, classId: selectedClass },
      size: 'md'
    }));
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

  const filteredCategories = selectedCategory 
    ? gradeCategories.filter(c => c.id === selectedCategory)
    : gradeCategories;

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
          <h1 className="text-3xl font-bold text-gray-900">Gradebook</h1>
          <p className="text-gray-600 mt-2">Manage grades for your courses in a spreadsheet-like interface</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGradeCategoryManagement}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={!selectedCourse}
          >
            <Settings size={16} />
            Categories
          </button>
          <button 
            onClick={handleBulkGradeEntry}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={!selectedCourse || !selectedClass}
          >
            <Upload size={16} />
            Bulk Entry
          </button>
          <button 
            onClick={handleExportGradebook}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={!selectedCourse || !selectedClass}
          >
            <Download size={16} />
            Export
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

      {/* Class, Course and Category Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <div className="relative">
              <input
                type="text"
                value={classSearch}
                onChange={(e) => {
                  setClassSearch(e.target.value);
                  setShowClassDropdown(true);
                }}
                onFocus={() => setShowClassDropdown(true)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for a class..."
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {showClassDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map(classObj => (
                    <div
                      key={classObj.id}
                      onClick={() => handleClassSelect(classObj)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium">{classObj.name}</div>
                      {classObj.description && <div className="text-sm text-gray-500">{classObj.description}</div>}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No classes found</div>
                )}
              </div>
            )}
          </div>

          {/* Course Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
            <div className="relative">
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => {
                  setCourseSearch(e.target.value);
                  setShowCourseDropdown(true);
                }}
                onFocus={() => setShowCourseDropdown(true)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for a course..."
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {showCourseDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium">{course.name}</div>
                      {course.code && <div className="text-sm text-gray-500">{course.code}</div>}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No courses found</div>
                )}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Category (Optional)</label>
            <select 
              value={selectedCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!selectedCourse}
            >
              <option value="">All Categories</option>
              {gradeCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      {selectedClass && selectedCourse && students.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Student
                  </th>
                  {filteredCategories.map(category => (
                    <th key={category.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      <div>
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-xs text-gray-400">Max: {category.maxGrade}</div>
                        <div className="text-xs text-gray-400">Weight: {category.weight}%</div>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const studentGrades = grades.filter(g => g.studentId === student.id);
                  const totalWeightedScore = studentGrades.reduce((sum, grade) => {
                    const category = gradeCategories.find(c => c.id === grade.gradeCategoryId);
                    const percentage = (grade.score / grade.maxScore) * 100;
                    const weightedScore = percentage * (category?.weight || 0) / 100;
                    return sum + weightedScore;
                  }, 0);
                  const overallPercentage = totalWeightedScore;
                  const overallLetter = getGradeLetter(overallPercentage);
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.admissionNumber}
                        </div>
                      </td>
                      {filteredCategories.map(category => {
                        const grade = getStudentGrade(student.id, category.id);
                        const key = getGradeKey(student.id, category.id);
                        const isEditing = editingGrade?.studentId === student.id && editingGrade?.categoryId === category.id;
                        const currentValue = gradeValues[key] || (grade ? grade.score.toString() : '');
                        
                        return (
                          <td key={category.id} className="px-6 py-4 whitespace-nowrap text-center">
                            {isEditing ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={currentValue}
                                  onChange={(e) => handleGradeChange(student.id, category.id, e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  min="0"
                                  max={category.maxGrade}
                                  step="0.1"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleGradeSave(student.id, category.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Save"
                                >
                                  <Save size={14} />
                                </button>
                              </div>
                            ) : (
                              <div 
                                className="cursor-pointer hover:bg-blue-50 p-2 rounded"
                                onClick={() => handleGradeEdit(student.id, category.id)}
                              >
                                {grade ? (
                                  <div>
                                    <div className="text-sm font-medium">
                                      {grade.score} / {grade.maxScore}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {getGradePercentage(grade.score, grade.maxScore)}%
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-sm">
                                    Click to add
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>
                          <div className="text-sm font-medium">
                            {overallPercentage.toFixed(1)}%
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            overallLetter === 'A' ? 'bg-green-100 text-green-800' :
                            overallLetter === 'B' ? 'bg-blue-100 text-blue-800' :
                            overallLetter === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            overallLetter === 'D' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {overallLetter}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {!selectedClass && (
        <div className="text-center py-12">
          <BarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a Class</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a class from the dropdown above to view students.
          </p>
        </div>
      )}

      {selectedClass && !selectedCourse && (
        <div className="text-center py-12">
          <BarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a Course</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a course from the dropdown above to manage grades.
          </p>
        </div>
      )}

      {selectedClass && selectedCourse && students.length === 0 && (
        <div className="text-center py-12">
          <BarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Students Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            This class doesn't have any enrolled students yet.
          </p>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showClassDropdown || showCourseDropdown) && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setShowClassDropdown(false);
            setShowCourseDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default GradebookPage; 