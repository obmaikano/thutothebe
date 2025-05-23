import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal, showNotification } from '../../common/commonSlice';
import { Button } from '../../../components/ui/button';
import { UserPlus } from 'lucide-react';

interface AddUserModalProps {
  extraObject?: any;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    region: '',
    school: ''
  });

  const roles = ['Teacher', 'School Admin', 'Regional Admin', 'Super Admin'];
  const regions = ['Gaborone', 'Francistown', 'Molepolole', 'Maun', 'Serowe'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual API call
      console.log('Creating user:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(showNotification({
        type: 'success',
        message: 'User created successfully!'
      }));
      
      dispatch(closeModal());
      
      // Trigger refresh of user list if callback provided
      if (extraObject?.onSuccess) {
        extraObject.onSuccess();
      }
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to create user. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            id="role"
            name="role"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            id="region"
            name="region"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.region}
            onChange={handleInputChange}
          >
            <option value="">Select a region</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.role === 'Teacher' || formData.role === 'School Admin' ? (
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
            School
          </label>
          <input
            type="text"
            id="school"
            name="school"
            placeholder="Enter school name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.school}
            onChange={handleInputChange}
          />
        </div>
      ) : null}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          leftIcon={UserPlus}
          isLoading={loading}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}; 