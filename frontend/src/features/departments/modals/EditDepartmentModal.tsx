import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { updateDepartment, fetchDepartmentsBySchool, fetchDepartments } from '../departmentsSlice';
import { UpdateDepartmentRequest, Department } from '../../../api/services/departmentApi';
import { Building2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface EditDepartmentModalProps {
  extraObject?: Department;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const department = extraObject;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<UpdateDepartmentRequest>();

  useEffect(() => {
    if (department) {
      setValue('name', department.name);
      setValue('description', department.description || '');
    }
  }, [department, setValue]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const onSubmit = async (data: UpdateDepartmentRequest) => {
    if (!department) return;

    try {
      setIsLoading(true);

      await dispatch(updateDepartment({ 
        id: department.id, 
        departmentData: data 
      })).unwrap();
      
      setIsSuccess(true);
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Failed to update department:', error);
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Updated Successfully!</h3>
        <p className="text-gray-600">The department information has been updated.</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No department data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Edit className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Department</h3>
          <p className="text-sm text-gray-600">Update department information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Department Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Department Name *</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter department name"
              {...register('name', { 
                required: 'Department name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter department description (optional)"
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Current Info Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">School:</span>
                <p className="font-medium">{department.schoolName}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className={`font-medium ${department.active ? 'text-green-600' : 'text-red-600'}`}>
                  {department.active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Department Head:</span>
                <p className="font-medium">{department.departmentHeadName || 'Not assigned'}</p>
              </div>
              <div>
                <span className="text-gray-600">Teachers:</span>
                <p className="font-medium">{department.teacherIds.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </>
            ) : (
              <>
                <Edit size={16} />
                Update Department
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartmentModal; 