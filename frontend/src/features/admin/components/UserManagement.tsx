import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, 
  UserPlus, Shield, Key, UserCheck 
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAppDispatch } from '../../../app/hooks';
import { openModal } from '../../common/commonSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  school?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Mock data - would come from API in real implementation
  const users: User[] = [
    {
      id: '1',
      name: 'David Wilson',
      email: 'david.wilson@education.gov.bw',
      role: 'Regional Admin',
      region: 'Gaborone',
      status: 'active',
      lastLogin: '2024-03-15 09:30',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah.chen@education.gov.bw',
      role: 'School Admin',
      school: 'Gaborone Secondary School',
      status: 'active',
      lastLogin: '2024-03-15 08:45',
    },
    // Add more mock users as needed
  ];

  const roles = [
    'Regional Admin',
    'School Admin',
    'Teacher',
    'Inspector',
  ];

  const regions = [
    'Gaborone',
    'Francistown',
    'Molepolole',
    'Maun',
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesRegion = selectedRegion === 'all' || user.region === selectedRegion;
    return matchesSearch && matchesRole && matchesRegion;
  });

  const handleAddUser = () => {
    dispatch(openModal({
      title: 'Add New User',
      size: 'lg',
      content: MODAL_BODY_TYPES.USER_ADD_NEW,
      contentProps: {
        onSuccess: () => {
          console.log('User added successfully, refreshing list...');
        }
      }
    }));
  };

  const handleDeleteUser = (user: User) => {
    dispatch(openModal({
      title: 'Delete User',
      size: 'md',
      content: MODAL_BODY_TYPES.USER_DELETE_CONFIRMATION,
      contentProps: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        type: 'danger',
        destructive: true,
        confirmText: 'Delete User',
        onConfirm: async () => {
          console.log('Deleting user:', user.id);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <Button
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <Button variant="outline">
            More Filters
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users size={20} className="text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.region || user.school}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Edit2}
                        onClick={() => navigate(`/app/users/${user.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Key}
                        onClick={() => navigate(`/app/users/${user.id}/reset-password`)}
                      >
                        Reset Password
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Trash2}
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}; 