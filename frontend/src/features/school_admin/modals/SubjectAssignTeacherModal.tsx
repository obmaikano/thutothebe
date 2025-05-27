import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Users, BookOpen, Check, Search, X, UserPlus } from 'lucide-react';

interface SubjectAssignTeacherModalProps {
  extraObject?: {
    subject?: any;
    teachers?: any[];
    classes?: any[];
    assignedTeachers?: any[];
  };
}

// Mock interface for teacher assignment - would come from API
interface TeacherAssignment {
  teacherId: number;
  subjectId: number;
  classIds: number[];
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
  workload: number; // percentage
}

export const SubjectAssignTeacherModal: React.FC<SubjectAssignTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<Record<number, TeacherAssignment>>({});

  const subject = extraObject?.subject;
  const teachers = extraObject?.teachers || [];
  const classes = extraObject?.classes || [];
  const assignedTeachers = extraObject?.assignedTeachers || [];

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const filteredTeachers = teachers.filter(teacher => {
    if (!searchTerm) return true;
    
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleTeacherToggle = (teacherId: number) => {
    if (selectedTeachers.includes(teacherId)) {
      setSelectedTeachers(prev => prev.filter(id => id !== teacherId));
      setTeacherAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[teacherId];
        return newAssignments;
      });
    } else {
      setSelectedTeachers(prev => [...prev, teacherId]);
      setTeacherAssignments(prev => ({
        ...prev,
        [teacherId]: {
          teacherId,
          subjectId: subject?.id || 0,
          classIds: [],
          isPrimary: selectedTeachers.length === 0, // First teacher is primary
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          workload: 100
        }
      }));
    }
    setError(null);
  };

  const updateTeacherAssignment = (teacherId: number, field: keyof TeacherAssignment, value: any) => {
    setTeacherAssignments(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (selectedTeachers.length === 0) {
      setError('Please select at least one teacher');
      return;
    }

    // Validate assignments
    const errors: string[] = [];
    selectedTeachers.forEach(teacherId => {
      const assignment = teacherAssignments[teacherId];
      if (!assignment.startDate) {
        const teacher = teachers.find(t => t.id === teacherId);
        errors.push(`Start date is required for ${teacher?.firstName} ${teacher?.lastName}`);
      }
      if (assignment.workload <= 0 || assignment.workload > 100) {
        const teacher = teachers.find(t => t.id === teacherId);
        errors.push(`Workload must be between 1-100% for ${teacher?.firstName} ${teacher?.lastName}`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('; '));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - would be replaced with actual API
      console.log('Assigning teachers to subject:', {
        subjectId: subject?.id,
        assignments: Object.values(teacherAssignments)
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign teachers';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!subject) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: No subject data provided</div>
        <button
          onClick={handleClose}
          className="btn btn-primary"
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
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teachers Assigned Successfully!</h3>
        <p className="text-gray-600">The selected teachers have been assigned to {subject.name}.</p>
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
          <h2 className="text-lg font-semibold text-gray-900">Assign Teachers to Subject</h2>
          <p className="text-sm text-gray-600">
            Assign teachers to teach <span className="font-medium">{subject.name}</span>
          </p>
        </div>
      </div>

      {/* Subject Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">{subject.name}</h3>
            <p className="text-sm text-blue-700">Code: {subject.code}</p>
            {subject.description && (
              <p className="text-xs text-blue-600 mt-1">{subject.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search teachers by name, email, or staff ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Teachers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredTeachers.length} available teacher{filteredTeachers.length !== 1 ? 's' : ''}
          </span>
          {selectedTeachers.length > 0 && (
            <span className="text-sm text-blue-600">
              {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No teachers found matching your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTeachers.map((teacher) => {
              const isSelected = selectedTeachers.includes(teacher.id);
              const assignment = teacherAssignments[teacher.id];
              const isAlreadyAssigned = assignedTeachers.some(at => at.id === teacher.id);

              return (
                <div key={teacher.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTeacherToggle(teacher.id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={isAlreadyAssigned}
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
                              {teacher.firstName} {teacher.lastName}
                              {isAlreadyAssigned && (
                                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Already Assigned
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {teacher.email} • Staff ID: {teacher.staffId}
                            </div>
                            <div className="text-xs text-gray-400">
                              {teacher.qualification} • {teacher.experience} years experience
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Assignment Details */}
                  {isSelected && assignment && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Assignment Details</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={assignment.startDate}
                            onChange={(e) => updateTeacherAssignment(teacher.id, 'startDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            End Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={assignment.endDate || ''}
                            onChange={(e) => updateTeacherAssignment(teacher.id, 'endDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Workload (%) *
                          </label>
                          <input
                            type="number"
                            value={assignment.workload}
                            onChange={(e) => updateTeacherAssignment(teacher.id, 'workload', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="100"
                            step="1"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Classes (Optional)
                          </label>
                          <select
                            multiple
                            value={assignment.classIds.map(String)}
                            onChange={(e) => {
                              const classIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                              updateTeacherAssignment(teacher.id, 'classIds', classIds);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            size={3}
                          >
                            {classes.map(cls => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={assignment.isPrimary}
                            onChange={(e) => updateTeacherAssignment(teacher.id, 'isPrimary', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-xs text-gray-700">Primary Teacher for this Subject</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Teachers Summary */}
      {selectedTeachers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected for assignment
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTeachers.map(teacherId => {
              const teacher = teachers.find(t => t.id === teacherId);
              const assignment = teacherAssignments[teacherId];
              return teacher ? (
                <span
                  key={teacherId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                >
                  {teacher.firstName} {teacher.lastName}
                  {assignment?.isPrimary && <span className="text-blue-600">★</span>}
                  <button
                    onClick={() => handleTeacherToggle(teacherId)}
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

      {/* Actions */}
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
          disabled={isLoading || selectedTeachers.length === 0}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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

export default SubjectAssignTeacherModal; 