import React, { useState, useEffect, useRef } from 'react';
import { Subject } from '../../../api/services/subjectApi';
import { ChevronDown, Search, BookOpen } from 'lucide-react';
import subjectApi from '../../../api/services/subjectApi';

interface SearchableSubjectSelectProps {
  value: number | string | null;
  onChange: (subjectId: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  showActiveOnly?: boolean;
}

const SearchableSubjectSelect: React.FC<SearchableSubjectSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a subject...',
  disabled = false,
  required = false,
  error,
  showActiveOnly = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = showActiveOnly 
          ? await subjectApi.getActiveSubjects()
          : await subjectApi.getAll();
        
        if (response.data.status === 'success' && response.data.data) {
          const subjectData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          setSubjects(subjectData);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [showActiveOnly]);

  // Set selected subject when value changes
  useEffect(() => {
    if (value && subjects.length > 0) {
      const subject = subjects.find(s => s.id === Number(value));
      setSelectedSubject(subject || null);
    } else {
      setSelectedSubject(null);
    }
  }, [value, subjects]);

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

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    onChange(subject.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    setSelectedSubject(null);
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
          <BookOpen className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          {selectedSubject ? (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {selectedSubject.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                Code: {selectedSubject.code}
              </span>
              {selectedSubject.description && (
                <span className="text-xs text-gray-400 truncate">
                  {selectedSubject.description}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {selectedSubject && !disabled && (
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
                placeholder="Search subjects..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading subjects...</span>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? 'No subjects found matching your search' : 'No subjects available'}
              </div>
            ) : (
              filteredSubjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => handleSelectSubject(subject)}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                    ${selectedSubject?.id === subject.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <span className="text-xs text-gray-500">Code: {subject.code}</span>
                      {subject.description && (
                        <span className="text-xs text-gray-400 mt-1">{subject.description}</span>
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

export default SearchableSubjectSelect; 