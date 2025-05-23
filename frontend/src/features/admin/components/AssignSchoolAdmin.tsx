import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';

interface AssignSchoolAdminProps {
  schoolId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export const AssignSchoolAdmin: React.FC<AssignSchoolAdminProps> = ({ schoolId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    try {
      // TODO: Implement API call to assign admin
      console.log('Assigning admin:', { schoolId, userId: selectedUserId });
      navigate('/app/schools');
    } catch (error) {
      console.error('Error assigning admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          leftIcon={ArrowLeft}
          onClick={() => navigate('/app/schools')}
        >
          Back to Schools
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign School Administrator</h1>
          <p className="text-gray-600 mt-1">Select a user to assign as school administrator</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              Select Administrator
            </label>
            <select
              id="userId"
              name="userId"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/app/schools')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={UserPlus}
              disabled={loading || !selectedUserId}
            >
              {loading ? 'Assigning...' : 'Assign Administrator'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}; 