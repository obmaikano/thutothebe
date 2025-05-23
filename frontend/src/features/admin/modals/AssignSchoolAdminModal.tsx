import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal, showNotification } from '../../common/commonSlice';
import { Button } from '../../../components/ui/button';
import { UserPlus, Search } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

interface AssignSchoolAdminModalProps {
  extraObject?: {
    schoolId?: string;
    schoolName?: string;
    onSuccess?: () => void;
  };
}

export const AssignSchoolAdminModal: React.FC<AssignSchoolAdminModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { schoolId, schoolName } = extraObject || {};

  useEffect(() => {
    // TODO: Fetch available users from API
    // Mock data for now
    setUsers([
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'Teacher',
        status: 'active'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: 'Teacher',
        status: 'active'
      },
      {
        id: '3',
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@example.com',
        role: 'Teacher',
        status: 'active'
      },
      {
        id: '4',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@example.com',
        role: 'Teacher',
        status: 'active'
      }
    ]);
  }, []);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !schoolId) return;

    setLoading(true);
    try {
      // TODO: Implement actual API call
      console.log('Assigning admin:', { schoolId, userId: selectedUserId });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(showNotification({
        type: 'success',
        message: 'School administrator assigned successfully!'
      }));
      
      dispatch(closeModal());
      
      // Trigger refresh if callback provided
      if (extraObject?.onSuccess) {
        extraObject.onSuccess();
      }
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to assign administrator. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900">School Information</h4>
        <p className="text-sm text-gray-600 mt-1">
          Assigning administrator for: <span className="font-medium">{schoolName || 'Selected School'}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="search"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Administrator *
          </label>
          <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No users found matching your search.
              </div>
            ) : (
              filteredUsers.map(user => (
                <label
                  key={user.id}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedUserId === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedUser"
                    value={user.id}
                    checked={selectedUserId === user.id}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{user.status}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900">Selected Administrator</h4>
            <p className="text-sm text-gray-600 mt-1">
              {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email}) will be assigned as administrator for this school.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
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
            disabled={loading || !selectedUserId}
          >
            {loading ? 'Assigning...' : 'Assign Administrator'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 