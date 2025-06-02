import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { Class } from '../../../api/services/classApi';
import { ChevronDown, Search, Users } from 'lucide-react';
import classApi from '../../../api/services/classApi';

interface SearchableClassSelectProps {
  value: number | string | null;
  onChange: (classId: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  schoolId?: number | null;
  showActiveOnly?: boolean;
}

const SearchableClassSelect: React.FC<SearchableClassSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a class...',
  disabled = false,
  required = false,
  error,
  schoolId,
  showActiveOnly = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch classes when component mounts or schoolId changes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId) {
        setClasses([]);
        return;
      }

      setLoading(true);
      try {
        const response = showActiveOnly 
          ? await classApi.getActiveBySchool(schoolId)
          : await classApi.getBySchool(schoolId);
        
        if (response.data.status === 'success' && response.data.data) {
          const classData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          setClasses(classData);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [schoolId, showActiveOnly]);

  // Set selected class when value changes
  useEffect(() => {
    if (value && classes.length > 0) {
      const classItem = classes.find(c => c.id === Number(value));
      setSelectedClass(classItem || null);
    } else {
      setSelectedClass(null);
    }
  }, [value, classes]);

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

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (classItem.description && classItem.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleDropdown = () => {
    if (!disabled && schoolId) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelectClass = (classItem: Class) => {
    setSelectedClass(classItem);
    onChange(classItem.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    setSelectedClass(null);
    onChange(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <div
        onClick={handleToggleDropdown}
        className={`
          w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between
          ${disabled || !schoolId ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
          ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
        `}
      >
        <div className="flex items-center flex-1 min-w-0">
          <Users className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          {selectedClass ? (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {selectedClass.name}
              </span>
              {selectedClass.description && (
                <span className="text-xs text-gray-500 truncate">
                  {selectedClass.description}
                </span>
              )}
              {selectedClass.currentEnrollment !== undefined && selectedClass.capacity && (
                <span className="text-xs text-gray-400">
                  {selectedClass.currentEnrollment}/{selectedClass.capacity} students
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 truncate">
              {!schoolId ? 'Select a school first' : placeholder}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {selectedClass && !disabled && (
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
      {isOpen && schoolId && (
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
                placeholder="Search classes..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading classes...</span>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? 'No classes found matching your search' : 'No classes available for this school'}
              </div>
            ) : (
              filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  onClick={() => handleSelectClass(classItem)}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                    ${selectedClass?.id === classItem.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{classItem.name}</span>
                      {classItem.description && (
                        <span className="text-xs text-gray-500">{classItem.description}</span>
                      )}
                      {classItem.currentEnrollment !== undefined && classItem.capacity && (
                        <span className="text-xs text-gray-400 mt-1">
                          {classItem.currentEnrollment}/{classItem.capacity} students enrolled
                        </span>
                      )}
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

export default SearchableClassSelect; 