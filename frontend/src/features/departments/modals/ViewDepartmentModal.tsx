import React from 'react';
import { useAppDispatch } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { Department } from '../../../api/services/departmentApi';
import { Building2, Users, BookOpen, UserCheck, Calendar } from 'lucide-react';

interface ViewDepartmentModalProps {
  extraObject?: Department;
}

export const ViewDepartmentModal: React.FC<ViewDepartmentModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const department = extraObject;

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!department) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">No Data</h3>
          <p className="text-red-600">No department information available.</p>
          <button 
            onClick={handleClose}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
          <p className="text-sm text-gray-600">{department.schoolName}</p>
        </div>
        <div className="ml-auto">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            department.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {department.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <p className="text-sm text-gray-900">{department.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-sm text-gray-900">{department.description || 'No description provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <p className="text-sm text-gray-900">{department.schoolName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-900">
                {department.departmentHeadName || 'Not assigned'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
            <p className="text-sm text-gray-900">{department.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School ID</label>
            <p className="text-sm text-gray-900">{department.schoolId}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Department Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900">{department.teacherIds.length}</div>
            <div className="text-xs text-gray-500">Teachers</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900">{department.subjectIds.length}</div>
            <div className="text-xs text-gray-500">Subjects</div>
          </div>
        </div>
      </div>

      {/* Teachers and Subjects Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teachers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-green-600" />
            <h4 className="font-medium text-gray-900">Teachers ({department.teacherNames.length})</h4>
          </div>
          {department.teacherNames.length > 0 ? (
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {department.teacherNames.map((teacher, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  {teacher}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No teachers assigned</p>
          )}
        </div>

        {/* Subjects */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-orange-600" />
            <h4 className="font-medium text-gray-900">Subjects ({department.subjectNames.length})</h4>
          </div>
          {department.subjectNames.length > 0 ? (
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {department.subjectNames.map((subject, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  {subject}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No subjects assigned</p>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Record Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Created:</span>
            <p className="font-medium">
              {new Date(department.createdAt).toLocaleDateString()} at{' '}
              {new Date(department.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Last Modified:</span>
            <p className="font-medium">
              {new Date(department.modifiedAt).toLocaleDateString()} at{' '}
              {new Date(department.modifiedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-ghost"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewDepartmentModal; 