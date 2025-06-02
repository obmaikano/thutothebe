import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createGrade, updateGrade, clearError } from '../gradesSlice';
import { fetchStudentsByClass } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchGradeCategories } from '../gradeCategoriesSlice';
import { closeModal } from '../../common/modalSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { Grade, CreateGradeRequest, UpdateGradeRequest } from '../../../api/services/gradeApi';
import { Save, X, Eye, Calculator, Search } from 'lucide-react';

const gradeSchema = z.object({
  studentId: z.number().min(1, 'Student is required'),
  courseId: z.number().min(1, 'Course is required'),
  classId: z.number().min(1, 'Class is required'),
  gradeCategoryId: z.number().optional(),
  gradeType: z.enum(['ASSIGNMENT', 'ASSESSMENT', 'QUIZ', 'EXAM', 'PROJECT']),
  score: z.number().min(0, 'Score must be non-negative'),
  maxScore: z.number().min(1, 'Max score must be at least 1').default(100),
  weight: z.number().min(0).max(100, 'Weight must be between 0 and 100').default(1),
  feedback: z.string().optional(),
  isFinal: z.boolean().default(false),
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface GradeFormModalProps {
  extraObject?: Grade;
}

const GradeFormModal: React.FC<GradeFormModalProps> = ({ extraObject: grade }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { status, error } = useAppSelector(state => state.grades);
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const { classes } = useAppSelector(state => state.classes);
  const { gradeCategories } = useAppSelector(state => state.gradeCategories);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  
  // Search states
  const [classSearch, setClassSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const isEditing = !!grade;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: grade?.studentId || 0,
      courseId: grade?.courseId || 0,
      classId: grade?.classId || 0,
      gradeCategoryId: grade?.gradeCategoryId || undefined,
      gradeType: grade?.gradeType || 'ASSIGNMENT',
      score: grade?.score || 0,
      maxScore: grade?.maxScore || 100,
      weight: grade?.weight || 1,
      feedback: grade?.feedback || '',
      isFinal: grade?.isFinal || false,
    }
  });

  const watchedValues = watch();
  const percentage = watchedValues.maxScore > 0 ? ((watchedValues.score / watchedValues.maxScore) * 100).toFixed(1) : '0.0';
  const letterGrade = (() => {
    const perc = parseFloat(percentage);
    if (perc >= 90) return 'A';
    if (perc >= 80) return 'B';
    if (perc >= 70) return 'C';
    if (perc >= 60) return 'D';
    return 'F';
  })();

  // Filter functions for searchable dropdowns
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(classSearch.toLowerCase()) ||
    cls.code?.toLowerCase().includes(classSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.code?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.admissionNumber?.toLowerCase().includes(studentSearch.toLowerCase())
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
      dispatch(fetchGradeCategories(selectedCourse));
    }
  }, [dispatch, selectedCourse]);

  useEffect(() => {
    if (grade?.classId) {
      setSelectedClass(grade.classId);
      const selectedClassObj = classes.find(c => c.id === grade.classId);
      if (selectedClassObj) {
        setClassSearch(selectedClassObj.name);
      }
    }
    if (grade?.courseId) {
      setSelectedCourse(grade.courseId);
      const selectedCourseObj = courses.find(c => c.id === grade.courseId);
      if (selectedCourseObj) {
        setCourseSearch(selectedCourseObj.name);
      }
    }
  }, [grade, classes, courses]);

  const handleClassSelect = (classObj: any) => {
    setSelectedClass(classObj.id);
    setClassSearch(classObj.name);
    setValue('classId', classObj.id);
    setShowClassDropdown(false);
    // Reset student selection when class changes
    setValue('studentId', 0);
    setStudentSearch('');
  };

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course.id);
    setCourseSearch(course.name);
    setValue('courseId', course.id);
    setValue('gradeCategoryId', undefined);
    setShowCourseDropdown(false);
  };

  const handleStudentSelect = (student: any) => {
    setValue('studentId', student.id);
    setStudentSearch(`${student.firstName} ${student.lastName}`);
    setShowStudentDropdown(false);
  };

  const onSubmit = async (data: GradeFormData) => {
    try {
      if (isEditing && grade) {
        const updateData: UpdateGradeRequest = {
          score: data.score,
          maxScore: data.maxScore,
          weight: data.weight,
          feedback: data.feedback,
          isFinal: data.isFinal,
        };
        await dispatch(updateGrade({ id: grade.id, gradeData: updateData })).unwrap();
      } else {
        if (!user?.id) {
          throw new Error('User authentication required to create grades');
        }
        const createData: CreateGradeRequest = {
          ...data,
          gradedById: user.id,
        };
        await dispatch(createGrade(createData)).unwrap();
      }
      dispatch(closeModal());
    } catch (error) {
      console.error('Failed to save grade:', error);
    }
  };

  const getLetterGradeColor = (letter: string) => {
    switch (letter) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Grade' : 'Add New Grade'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing ? 'Update grade information' : 'Enter grade details for student assessment'}
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Eye size={16} />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
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
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Class Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={classSearch}
                  onChange={(e) => {
                    setClassSearch(e.target.value);
                    setShowClassDropdown(true);
                  }}
                  onFocus={() => setShowClassDropdown(true)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search for a class..."
                  disabled={isEditing}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              {showClassDropdown && !isEditing && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map(classObj => (
                      <div
                        key={classObj.id}
                        onClick={() => handleClassSelect(classObj)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{classObj.name}</div>
                        {classObj.code && <div className="text-sm text-gray-500">{classObj.code}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No classes found</div>
                  )}
                </div>
              )}
              {errors.classId && (
                <p className="text-red-500 text-xs mt-1">{errors.classId.message}</p>
              )}
            </div>

            {/* Course Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => {
                    setCourseSearch(e.target.value);
                    setShowCourseDropdown(true);
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search for a course..."
                  disabled={isEditing}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              {showCourseDropdown && !isEditing && (
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
              {errors.courseId && (
                <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p>
              )}
            </div>

            {/* Student Selection - Only show when class is selected */}
            {selectedClass && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setShowStudentDropdown(true);
                    }}
                    onFocus={() => setShowStudentDropdown(true)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search for a student..."
                    disabled={isEditing}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                {showStudentDropdown && !isEditing && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No students found</div>
                    )}
                  </div>
                )}
                {errors.studentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>
                )}
              </div>
            )}

            {/* Grade Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Category
              </label>
              <select
                {...register('gradeCategoryId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedCourse}
              >
                <option value="">No category</option>
                {gradeCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} (Weight: {category.weight}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Type *
              </label>
              <select
                {...register('gradeType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ASSIGNMENT">Assignment</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="QUIZ">Quiz</option>
                <option value="EXAM">Exam</option>
                <option value="PROJECT">Project</option>
              </select>
              {errors.gradeType && (
                <p className="text-red-500 text-xs mt-1">{errors.gradeType.message}</p>
              )}
            </div>

            {/* Score and Max Score */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('score', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.score && (
                  <p className="text-red-500 text-xs mt-1">{errors.score.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Score *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('maxScore', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.maxScore && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxScore.message}</p>
                )}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>
              )}
            </div>

            {/* Final Grade */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isFinal')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Final Grade
              </label>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                {...register('feedback')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional feedback for the student..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || status === 'loading'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={16} />
                )}
                {isEditing ? 'Update Grade' : 'Save Grade'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={16} className="text-gray-600" />
              <h4 className="font-medium text-gray-900">Grade Preview</h4>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {watchedValues.score} / {watchedValues.maxScore}
                  </div>
                  <div className="text-sm text-gray-500">Raw Score</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-500">Percentage</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-center">
                  <span className={`inline-flex px-3 py-1 text-lg font-semibold rounded-full ${getLetterGradeColor(letterGrade)}`}>
                    {letterGrade}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">Letter Grade</div>
                </div>
              </div>

              {watchedValues.isFinal && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="text-center text-blue-800 text-sm font-medium">
                    🏆 Final Grade
                  </div>
                </div>
              )}

              {watchedValues.feedback && (
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Feedback:</div>
                  <div className="text-sm text-gray-600">{watchedValues.feedback}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showClassDropdown || showCourseDropdown || showStudentDropdown) && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setShowClassDropdown(false);
            setShowCourseDropdown(false);
            setShowStudentDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default GradeFormModal; 