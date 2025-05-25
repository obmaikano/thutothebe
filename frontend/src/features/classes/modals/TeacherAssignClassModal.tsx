import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { assignTeacherToClass, fetchClassById } from '../classesSlice';
import { closeModal } from '../../common/modalSlice';
import { Teacher } from '../../../api/services/teacherApi';
import { UserPlus, Search, GraduationCap, X } from 'lucide-react';

interface TeacherAssignClassModalProps {
  extraObject?: {
    classId: number;
    availableTeachers: Teacher[];
  };
}

const TeacherAssignClassModal: React.FC<TeacherAssignClassModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.classes);
  
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const classId = extraObject?.classId;
  const availableTeachers = extraObject?.availableTeachers || [];

  useEffect(() => {
    // Filter teachers based on search term
    const filtered = availableTeachers.filter(teacher => {
      const matchesSearch = 
        teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.qualification && teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Only show active teachers
      return matchesSearch && teacher.active;
    });
    
    setFilteredTeachers(filtered);
  }, [searchTerm, availableTeachers]);

  const handleTeacherToggle = (teacherId: number) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(teacher => teacher.id));
    }
  };

  const handleSubmit = async () => {
    if (!classId || selectedTeachers.length === 0) return;

    try {
      setIsLoading(true);
      
      // Assign teachers one by one
      for (const teacherId of selectedTeachers) {
        await dispatch(assignTeacherToClass({ classId, teacherId })).unwrap();
      }
      
      // Refetch the class data to get updated teacher assignments
      await dispatch(fetchClassById(classId));
      
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to assign teachers to class:', error);
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
        <div className="p-2 bg-green-100 rounded-lg">
          <UserPlus className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Assign Teachers to Class</h2>
          <p className="text-sm text-gray-600">
            Select teachers to assign to this class
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search teachers by name, email, staff ID, or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {filteredTeachers.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredTeachers.length} available teacher{filteredTeachers.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-green-600 hover:text-green-800"
            >
              {selectedTeachers.length === filteredTeachers.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}
      </div>

      {/* Teachers List */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No available teachers</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'No teachers match your search criteria.' 
                : 'All teachers are inactive or unavailable.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="p-4 hover:bg-gray-50">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher.id)}
                    onChange={() => handleTeacherToggle(teacher.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {teacher.email} • Staff ID: {teacher.staffId}
                        </div>
                        <div className="text-xs text-gray-400">
                          {teacher.qualification || 'No qualification specified'}
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

      {/* Selected Teachers Summary */}
      {selectedTeachers.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTeachers.map(teacherId => {
              const teacher = filteredTeachers.find(t => t.id === teacherId);
              return teacher ? (
                <span
                  key={teacherId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded"
                >
                  {teacher.firstName} {teacher.lastName}
                  <button
                    onClick={() => handleTeacherToggle(teacherId)}
                    className="hover:text-green-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || selectedTeachers.length === 0}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Assigning Teachers...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign {selectedTeachers.length} Teacher{selectedTeachers.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TeacherAssignClassModal; 