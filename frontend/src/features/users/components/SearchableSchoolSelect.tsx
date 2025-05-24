import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSchools } from '../../schools/schoolsSlice';
import { School } from '../../../api/services/schoolApi';
import { ChevronDown, Search, Building } from 'lucide-react';

interface SearchableSchoolSelectProps {
  value: number | string;
  onChange: (schoolId: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const SearchableSchoolSelect: React.FC<SearchableSchoolSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a school...',
  disabled = false,
  required = false,
  error
}) => {
  const dispatch = useAppDispatch();
  const { schools, status } = useAppSelector(state => state.schools);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch schools on component mount
  useEffect(() => {
    if (schools.length === 0) {
      dispatch(fetchSchools());
    }
  }, [dispatch, schools.length]);

  // Set selected school when value changes
  useEffect(() => {
    if (value && schools.length > 0) {
      const school = schools.find(s => s.id === Number(value));
      setSelectedSchool(school || null);
    } else {
      setSelectedSchool(null);
    }
  }, [value, schools]);

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

  const filteredSchools = schools.filter(school =>
    school.active && (
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school);
    onChange(school.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    setSelectedSchool(null);
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
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
          ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
        `}
      >
        <div className="flex items-center flex-1 min-w-0">
          <Building className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          {selectedSchool ? (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {selectedSchool.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                Code: {selectedSchool.code}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {selectedSchool && !disabled && (
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
                placeholder="Search schools..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {status === 'loading' ? (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading schools...</span>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? 'No schools found matching your search' : 'No schools available'}
              </div>
            ) : (
              filteredSchools.map((school) => (
                <div
                  key={school.id}
                  onClick={() => handleSelectSchool(school)}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                    ${selectedSchool?.id === school.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{school.name}</span>
                      <span className="text-xs text-gray-500">Code: {school.code}</span>
                      {school.description && (
                        <span className="text-xs text-gray-400 mt-1">{school.description}</span>
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

export default SearchableSchoolSelect; 