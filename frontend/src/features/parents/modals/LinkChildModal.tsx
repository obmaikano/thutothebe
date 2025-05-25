import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { linkChildToParent, fetchParents } from '../parentsSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { closeModal } from '../../common/modalSlice';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { Parent } from '../../../api/services/parentApi';
import { Student } from '../../../api/services/studentApi';
import { UserPlus, Search, Users, X } from 'lucide-react';

interface LinkChildModalProps {
  extraObject?: {
    parent: Parent;
  };
}

const LinkChildModal: React.FC<LinkChildModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { students, status } = useAppSelector(state => state.students);
  
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const parentId = extraObject?.parent?.id;

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(student => {
      if (!searchTerm) return true;
      
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

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
    if (!parentId || selectedStudents.length === 0) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessCount(0);
      
      let successfullyLinked = 0;
      const errors: string[] = [];
      
      // Link students one by one and track results
      for (const studentId of selectedStudents) {
        try {
          await dispatch(linkChildToParent({ parentId, childId: studentId })).unwrap();
          successfullyLinked++;
        } catch (error: any) {
          const student = filteredStudents.find(s => s.id === studentId);
          const studentName = student ? `${student.firstName} ${student.lastName}` : `Student ${studentId}`;
          errors.push(`${studentName}: ${extractErrorMessage(error)}`);
        }
      }
      
      setSuccessCount(successfullyLinked);
      
      if (errors.length > 0) {
        setErrorMessage(`${successfullyLinked} student(s) linked successfully. Errors: ${errors.join('; ')}`);
      } else {
        setIsSuccess(true);
      }
      
      // Refresh the parents list
      await dispatch(fetchParents());
      
      // Only close modal if all students were linked successfully
      if (errors.length === 0) {
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to link students to parent:', error);
      setErrorMessage('An unexpected error occurred while linking students to the parent.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!extraObject?.parent) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <Users className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Parent Data</h3>
        <p className="text-gray-600 mb-4">No parent information was provided for linking children.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Children Linked Successfully!</h3>
        <p className="text-gray-600">{successCount} student(s) have been linked to the parent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Link Children to Parent</h3>
          <p className="text-sm text-gray-600">Select students to link to "{extraObject.parent.firstName} {extraObject.parent.lastName}"</p>
        </div>
      </div>

      {/* Parent Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{extraObject.parent.firstName} {extraObject.parent.lastName}</div>
            <div className="text-sm text-gray-500">{extraObject.parent.email}</div>
            <div className="text-sm text-gray-500">
              ID: {extraObject.parent.identityNumber || 'Not provided'}
            </div>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              extraObject.parent.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {extraObject.parent.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Selection Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students by name, email, or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Selection Summary */}
        {selectedStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedStudents.length} student(s) selected
              </span>
              <button
                onClick={() => setSelectedStudents([])}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students List */}
      <div className="border border-gray-200 rounded-lg">
        <div className="max-h-96 overflow-y-auto">
          {status === 'loading' ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading students...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No students found matching your search.' : 'No students available.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedStudents.includes(student.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleStudentToggle(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                      <div className="text-sm text-gray-500">
                        Admission: {student.admissionNumber}
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        student.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
              Linking...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Link {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LinkChildModal; 