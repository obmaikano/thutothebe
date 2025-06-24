import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { assignTeacherToClass, removeTeacherFromClass, fetchClassesWithTeachers } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { Teacher } from '../../../api/services/teacherApi';
import { Users, Plus, X, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface ClassAssignTeacherModalProps {
  extraObject: {
    classId: number;
    className: string;
    gradeLevel: number;
    currentTeacherIds?: number[];
    availableTeachers: Teacher[];
  };
}

const ClassAssignTeacherModal: React.FC<ClassAssignTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.classes);
  const { teachers } = useAppSelector((state) => state.teachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  useEffect(() => {
    if (extraObject.currentTeacherIds) {
      setSelectedTeacherIds(extraObject.currentTeacherIds);
    }
  }, [extraObject.currentTeacherIds]);

  const handleAssignTeacher = async (teacherId: number) => {
    try {
      setLoading(true);
      await dispatch(assignTeacherToClass({
        classId: extraObject.classId,
        teacherId
      })).unwrap();
      
      setSelectedTeacherIds(prev => [...prev, teacherId]);
      dispatch(fetchClassesWithTeachers());
    } catch (err) {
      console.error('Failed to assign teacher:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    try {
      setLoading(true);
      await dispatch(removeTeacherFromClass({
        classId: extraObject.classId,
        teacherId
      })).unwrap();
      
      setSelectedTeacherIds(prev => prev.filter(id => id !== teacherId));
      dispatch(fetchClassesWithTeachers());
    } catch (err) {
      console.error('Failed to remove teacher:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.staffId && teacher.staffId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const availableTeachers = filteredTeachers.filter(teacher => 
    !selectedTeacherIds.includes(teacher.id)
  );

  const assignedTeachers = teachers.filter(teacher => 
    selectedTeacherIds.includes(teacher.id)
  );

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Assign Teachers to Class
        </h2>
        <p className="text-gray-600">
          Class: <span className="font-medium">{extraObject.className}</span> 
          (Grade {extraObject.gradeLevel})
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Teachers */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Assigned Teachers ({assignedTeachers.length})
          </h3>
          
          {assignedTeachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No teachers assigned to this class</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedTeachers.map(teacher => (
                <div key={teacher.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.email}
                      </div>
                      {teacher.staffId && (
                        <div className="text-xs text-gray-400">
                          ID: {teacher.staffId}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveTeacher(teacher.id)}
                    disabled={loading}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Remove teacher"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Teachers */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Teachers
          </h3>
          
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {availableTeachers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                {searchTerm ? 'No teachers found matching your search' : 'No available teachers'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableTeachers.map(teacher => (
                <div key={teacher.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.email}
                      </div>
                      {teacher.staffId && (
                        <div className="text-xs text-gray-400">
                          ID: {teacher.staffId}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {teacher.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssignTeacher(teacher.id)}
                    disabled={loading}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                    title="Assign teacher"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => dispatch(closeModal({}))}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ClassAssignTeacherModal; 