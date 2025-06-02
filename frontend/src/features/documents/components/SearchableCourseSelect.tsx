import React, { useState, useEffect, useRef } from 'react';
import { Course } from '../../../api/services/courseApi';
import { ChevronDown, Search, GraduationCap } from 'lucide-react';
import courseApi from '../../../api/services/courseApi';

interface SearchableCourseSelectProps {
  value: number | string | null;
  onChange: (courseId: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  classId?: number | null;
  subjectId?: number | null;
  showActiveOnly?: boolean;
}

const SearchableCourseSelect: React.FC<SearchableCourseSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a course...',
  disabled = false,
  required = false,
  error,
  classId,
  subjectId,
  showActiveOnly = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch courses when component mounts or dependencies change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let response;
        
        if (classId && subjectId) {
          // If both class and subject are selected, get courses for both
          const classCourses = showActiveOnly 
            ? await courseApi.getActiveByClass(classId)
            : await courseApi.getByClass(classId);
          const subjectCourses = showActiveOnly 
            ? await courseApi.getActiveBySubject(subjectId)
            : await courseApi.getBySubject(subjectId);
          
          // Find intersection of both results
          const classCoursesData = Array.isArray(classCourses.data.data) ? classCourses.data.data : [classCourses.data.data];
          const subjectCoursesData = Array.isArray(subjectCourses.data.data) ? subjectCourses.data.data : [subjectCourses.data.data];
          
          const intersectionCourses = classCoursesData.filter((classCourse): classCourse is Course => 
            classCourse !== null && subjectCoursesData.some(subjectCourse => 
              subjectCourse !== null && subjectCourse.id === classCourse.id
            )
          );
          
          setCourses(intersectionCourses);
          setLoading(false);
          return;
        } else if (classId) {
          response = showActiveOnly 
            ? await courseApi.getActiveByClass(classId)
            : await courseApi.getByClass(classId);
        } else if (subjectId) {
          response = showActiveOnly 
            ? await courseApi.getActiveBySubject(subjectId)
            : await courseApi.getBySubject(subjectId);
        } else {
          response = showActiveOnly 
            ? await courseApi.getActiveCourses()
            : await courseApi.getAll();
        }
        
        if (response && response.data.status === 'success' && response.data.data) {
          const courseData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          setCourses(courseData);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [classId, subjectId, showActiveOnly]);

  // Set selected course when value changes
  useEffect(() => {
    if (value && courses.length > 0) {
      const course = courses.find(c => c.id === Number(value));
      setSelectedCourse(course || null);
    } else {
      setSelectedCourse(null);
    }
  }, [value, courses]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    onChange(course.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    setSelectedCourse(null);
    onChange(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getTermLabel = (term: string) => {
    const termLabels: Record<string, string> = {
      'FIRST': 'Term 1',
      'SECOND': 'Term 2',
      'THIRD': 'Term 3'
    };
    return termLabels[term] || term;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      'CORE': 'Core',
      'ELECTIVE': 'Elective'
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <div
        onClick={handleToggleDropdown}
        className={`
          w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
          ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
        `}
      >
        <div className="flex items-center flex-1 min-w-0">
          <GraduationCap className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          {selectedCourse ? (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {selectedCourse.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                Code: {selectedCourse.code} | {getTermLabel(selectedCourse.term)} {selectedCourse.year}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {getTypeLabel(selectedCourse.type)} Course
              </span>
            </div>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {selectedCourse && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          )}
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search courses..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading courses...</span>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? 'No courses found matching your search' : 
                 classId || subjectId ? 'No courses available for the selected criteria' : 'No courses available'}
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                    ${selectedCourse?.id === course.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{course.name}</span>
                      <span className="text-xs text-gray-500">
                        Code: {course.code} | {getTermLabel(course.term)} {course.year}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.type === 'CORE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {getTypeLabel(course.type)}
                        </span>
                        {course.active && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SearchableCourseSelect; 