import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { Class } from '../../../api/services/classApi';
import { School, Users, Calendar, BookOpen } from 'lucide-react';

interface ClassViewModalProps {
  extraObject?: Class;
}

const ClassViewModal: React.FC<ClassViewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { schools } = useAppSelector(state => state.schools);

  // Fetch schools on component mount
  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  // Helper function to get school name from ID
  const getSchoolName = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? `${school.name}` : `School ID: ${schoolId}`;
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <School className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Class Data</h3>
        <p className="text-gray-600 mb-4">No class information was provided for viewing.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <School className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Class Details</h3>
          <p className="text-sm text-gray-600">View information for "{extraObject.name}"</p>
        </div>
      </div>

      {/* Class Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <School className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{extraObject.name}</div>
            <div className="text-sm text-gray-500">Grade: {extraObject.grade}</div>
            <div className="text-sm text-gray-500">
              {extraObject.currentEnrollment || 0} / {extraObject.capacity || 'N/A'} students
            </div>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              extraObject.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {extraObject.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden px-6 py-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="font-medium text-gray-900 mb-1">Class Name</div>
            <div className="text-gray-700">{extraObject.name}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Grade Level</div>
            <div className="text-gray-700">Grade {extraObject.grade}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">School</div>
            <div className="text-gray-700">{getSchoolName(extraObject.schoolId)}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Capacity</div>
            <div className="text-gray-700">{extraObject.capacity || 'Not set'} students</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Current Enrollment</div>
            <div className="text-gray-700">{extraObject.currentEnrollment || 0} students</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Status</div>
            <div className="text-gray-700">{extraObject.active ? 'Active' : 'Inactive'}</div>
          </div>
        </div>

        {/* Description */}
        {extraObject.description && (
          <div className="border-t border-gray-200 pt-6">
            <div className="font-medium text-gray-900 mb-2">Description</div>
            <div className="text-gray-700">{extraObject.description}</div>
          </div>
        )}

        {/* Enrollment Statistics */}
        <div className="border-t border-gray-200 pt-6">
          <div className="font-medium text-gray-900 mb-4">Enrollment Statistics</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-900">
                    {extraObject.currentEnrollment || 0}
                  </div>
                  <div className="text-sm text-blue-700">Current Students</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-green-900">
                    {extraObject.capacity || 0}
                  </div>
                  <div className="text-sm text-green-700">Max Capacity</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-900">
                    {extraObject.capacity ? 
                      Math.max(0, extraObject.capacity - (extraObject.currentEnrollment || 0)) : 
                      'N/A'
                    }
                  </div>
                  <div className="text-sm text-purple-700">Available Spots</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ClassViewModal; 