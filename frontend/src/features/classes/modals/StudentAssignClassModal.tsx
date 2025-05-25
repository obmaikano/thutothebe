import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addStudentToClass, fetchClassById, fetchClassWithStudents } from '../classesSlice';
import { fetchStudentsByClass, fetchStudents } from '../../students/studentsSlice';
import { closeModal } from '../../common/modalSlice';
import { Student } from '../../../api/services/studentApi';
import { UserPlus, Search, Users, X } from 'lucide-react';

interface StudentAssignClassModalProps {
  extraObject?: {
    classId: number;
    availableStudents: Student[];
  };
}

const StudentAssignClassModal: React.FC<StudentAssignClassModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.classes);
  
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const classId = extraObject?.classId;
  const availableStudents = extraObject?.availableStudents || [];

  useEffect(() => {
    // Filter students who match search term (students are already pre-filtered for availability)
    const filtered = availableStudents.filter(student => {
      if (!searchTerm) return true; // Show all if no search term
      
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    setFilteredStudents(filtered);
  }, [searchTerm, availableStudents]);

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
    // Clear error when user makes changes
    setErrorMessage(null);
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
    // Clear error when user makes changes
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (!classId || selectedStudents.length === 0) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessCount(0);
      
      let successfullyAdded = 0;
      const errors: string[] = [];
      
      // Add students one by one and track results
      for (const studentId of selectedStudents) {
        try {
          await dispatch(addStudentToClass({ classId, studentId })).unwrap();
          successfullyAdded++;
        } catch (error: any) {
          const student = filteredStudents.find(s => s.id === studentId);
          const studentName = student ? `${student.firstName} ${student.lastName}` : `Student ${studentId}`;
          errors.push(`${studentName}: ${error}`);
        }
      }
      
      setSuccessCount(successfullyAdded);
      
      if (errors.length > 0) {
        setErrorMessage(`${successfullyAdded} student(s) added successfully. Errors: ${errors.join('; ')}`);
      }
      
      // Refetch all necessary data to update the UI
      await Promise.all([
        dispatch(fetchClassWithStudents(classId)),
        dispatch(fetchStudentsByClass(classId)),
        dispatch(fetchStudents()) // Refresh the general students list for the parent component
      ]);
      
      // Only close modal if all students were added successfully
      if (errors.length === 0) {
        dispatch(closeModal({}));
      }
    } catch (error) {
      console.error('Failed to add students to class:', error);
      setErrorMessage('An unexpected error occurred while adding students to the class.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!classId) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: No class ID provided</div>
        <button
          onClick={handleClose}
          className="btn btn-primary"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlus className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Add Students to Class</h2>
          <p className="text-sm text-gray-600">
            Select students to add to this class
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name, email, or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredStudents.length} available student{filteredStudents.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}
      </div>

      {/* Students List */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No available students</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'No students match your search criteria.' 
                : 'All students are already assigned to classes or inactive.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4 hover:bg-gray-50">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentToggle(student.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email} • Admission: {student.admissionNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          Grade {student.academicYear} • {student.gender}
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Students Summary */}
      {selectedStudents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedStudents.map(studentId => {
              const student = filteredStudents.find(s => s.id === studentId);
              return student ? (
                <span
                  key={studentId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                >
                  {student.firstName} {student.lastName}
                  <button
                    onClick={() => handleStudentToggle(studentId)}
                    className="hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {successCount > 0 ? 'Partial Success' : 'Error'}
              </h3>
              <div className="mt-1 text-sm text-red-700">
                {errorMessage}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setErrorMessage(null)}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successCount > 0 && !errorMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Successfully added {successCount} student{successCount !== 1 ? 's' : ''} to the class!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || selectedStudents.length === 0}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Students...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Add {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentAssignClassModal; 