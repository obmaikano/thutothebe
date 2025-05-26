import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addTeacherToCourse } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { Teacher } from '../../../api/services/teacherApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import { BookOpen, Search, X, Plus } from 'lucide-react';

interface AssignCourseModalProps {
  extraObject?: Teacher;
}

const AssignCourseModal: React.FC<AssignCourseModalProps> = ({ extraObject: teacher }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.courses);
  
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<{ courseId: number; isPrimary: boolean }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      if (!teacher) return;

      try {
        setFetchingCourses(true);
        setError(null);

        // Get all active courses
        const allCoursesResponse = await courseApi.getActiveCourses();
        const allCourses = Array.isArray(allCoursesResponse.data.data) 
          ? allCoursesResponse.data.data 
          : [];

        // Get courses already assigned to this teacher
        const teacherCoursesResponse = await courseApi.getByTeacher(teacher.id);
        const teacherCourses = Array.isArray(teacherCoursesResponse.data.data) 
          ? teacherCoursesResponse.data.data 
          : [];

        // Filter out courses already assigned to the teacher
        const assignedCourseIds = teacherCourses.map((course: Course) => course.id);
        const available = allCourses.filter((course: Course) => !assignedCourseIds.includes(course.id));

        setAvailableCourses(available);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load available courses');
      } finally {
        setFetchingCourses(false);
      }
    };

    fetchAvailableCourses();
  }, [teacher]);

  useEffect(() => {
    // Filter courses based on search term
    const filtered = availableCourses.filter(course => {
      const matchesSearch = 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch && course.active;
    });
    
    setFilteredCourses(filtered);
  }, [searchTerm, availableCourses]);

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev => {
      const existing = prev.find(item => item.courseId === courseId);
      if (existing) {
        return prev.filter(item => item.courseId !== courseId);
      } else {
        return [...prev, { courseId, isPrimary: false }];
      }
    });
  };

  const handlePrimaryToggle = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.map(item => 
        item.courseId === courseId 
          ? { ...item, isPrimary: !item.isPrimary }
          : item
      )
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => ({ courseId: course.id, isPrimary: false })));
    }
  };

  const handleSubmit = async () => {
    if (!teacher || selectedCourses.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Assign teacher to courses one by one
      for (const { courseId, isPrimary } of selectedCourses) {
        await dispatch(addTeacherToCourse({ courseId, teacherId: teacher.id, isPrimary })).unwrap();
      }
      
      dispatch(closeModal({}));
    } catch (error: any) {
      console.error('Failed to assign courses to teacher:', error);
      setError(error || 'Failed to assign courses to teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!teacher) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: No teacher data provided</div>
        <button
          onClick={handleClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assign Courses</h3>
          <p className="text-sm text-gray-600">
            Assign courses to {teacher.firstName} {teacher.lastName}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {fetchingCourses ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      ) : (
        <>
          {/* Search and Select All */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {filteredCourses.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedCourses.length === filteredCourses.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}
          </div>

          {/* Courses List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">
                  {availableCourses.length === 0 
                    ? 'No courses available for assignment' 
                    : 'No courses match your search'
                  }
                </p>
                {availableCourses.length === 0 && (
                  <p className="text-sm text-gray-500">
                    All active courses may already be assigned to this teacher.
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCourses.map((course) => {
                  const isSelected = selectedCourses.some(item => item.courseId === course.id);
                  const selectedItem = selectedCourses.find(item => item.courseId === course.id);
                  
                  return (
                    <div key={course.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCourseToggle(course.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{course.name}</h4>
                              <p className="text-sm text-gray-600">Code: {course.code}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {course.term} {course.year}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                course.type === 'CORE' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {course.type}
                              </span>
                            </div>
                          </div>
                          
                          {/* Primary Instructor Option */}
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedItem?.isPrimary || false}
                                  onChange={() => handlePrimaryToggle(course.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Set as primary instructor</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Courses Summary */}
          {selectedCourses.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Selected Courses ({selectedCourses.length})
              </h4>
              <div className="space-y-1">
                {selectedCourses.map(({ courseId, isPrimary }) => {
                  const course = filteredCourses.find(c => c.id === courseId);
                  if (!course) return null;
                  
                  return (
                    <div key={courseId} className="flex items-center justify-between text-sm">
                      <span className="text-blue-800">{course.name} ({course.code})</span>
                      {isPrimary && (
                        <span className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedCourses.length === 0}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning Courses...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Assign {selectedCourses.length} Course{selectedCourses.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignCourseModal; 