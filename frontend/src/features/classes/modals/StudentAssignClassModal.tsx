import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addStudentToClass, fetchClassById, fetchClassWithStudents } from '../classesSlice';
import { fetchStudentsByClass, fetchStudents } from '../../students/studentsSlice';
import { closeModal } from '../../common/modalSlice';
import { Student } from '../../../api/services/studentApi';
import { UserPlus, Search, Users, X, School } from 'lucide-react';

interface StudentAssignClassModalProps {
  extraObject?: {
    classId: number;
    availableStudents: Student[];
    classInfo?: {
      name?: string;
      gradeLevel?: string;
      capacity?: number;
    };
  };
}

const StudentAssignClassModal: React.FC<StudentAssignClassModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.classes);
  
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const classId = extraObject?.classId;
  const availableStudents = extraObject?.availableStudents || [];

  // Use useMemo to compute filtered students
  const filteredStudents = useMemo(() => {
    return availableStudents.filter(student => {
      if (!searchTerm) return true;
      
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
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
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <Users className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Class Selected</h3>
        <p className="text-gray-600 mb-4">No class was selected for student assignment.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (successCount > 0 && !errorMessage) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Student(s) Added Successfully!</h3>
        <p className="text-gray-600">{successCount} student{successCount !== 1 ? 's' : ''} have been added to the class.</p>
      </div>
    );
  }

  // Placeholder class info for summary card (could be passed in extraObject if needed)
  const classInfo = extraObject?.classInfo || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Students to Class</h3>
          <p className="text-sm text-gray-600">Select students to add to this class</p>
        </div>
      </div>

      {/* Class Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <School className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{classInfo.name || 'Class'}</div>
            <div className="text-sm text-gray-500">
              {classInfo.gradeLevel ? classInfo.gradeLevel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''}
              {classInfo.capacity ? ` • Capacity: ${classInfo.capacity}` : ''}
            </div>
          </div>
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
                          {student.academicYear} • {student.gender}
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
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || selectedStudents.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Adding...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Add Student{selectedStudents.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentAssignClassModal; 