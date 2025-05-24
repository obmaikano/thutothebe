import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchUsers, clearUsersError, activateUser, deactivateUser, deleteUser } from '../usersSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { User, USER_ROLE_OPTIONS } from '../../../api/services/userApi';
import { Plus, Search, Users, Edit, Trash2, Eye, Shield, ShieldOff } from 'lucide-react';

const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, status, error } = useAppSelector(state => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(clearUsersError());
    };
  }, [dispatch]);

  const handleCreateUser = () => {
    dispatch(openModal({
      title: 'Create New User',
      bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEdit = (user: User) => {
    dispatch(openModal({
      title: 'Edit User',
      bodyType: MODAL_BODY_TYPES.USER_EDIT,
      extraObject: user
    }));
  };

  const handleDelete = (user: User) => {
    dispatch(openModal({
      title: 'Delete User',
      bodyType: MODAL_BODY_TYPES.USER_DELETE_CONFIRMATION,
      extraObject: user
    }));
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.active) {
        await dispatch(deactivateUser(user.id)).unwrap();
      } else {
        await dispatch(activateUser(user.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleViewDetails = (user: User) => {
    // For now, we'll handle this as opening an edit modal
    // Later you can implement a dedicated user detail page
    handleEdit(user);
  };

  const getRoleDisplayName = (role: string) => {
    const roleOption = USER_ROLE_OPTIONS.find(option => option.value === role);
    return roleOption ? roleOption.label : role;
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleDisplayName(user.role).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && user.active) ||
      (statusFilter === 'inactive' && !user.active);

    const matchesRole = 
      roleFilter === '' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (active: boolean) => {
    return active 
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-800',
      'MINISTRY_EXECUTIVE': 'bg-indigo-100 text-indigo-800',
      'MINISTRY_STAFF': 'bg-blue-100 text-blue-800',
      'DIRECTOR': 'bg-violet-100 text-violet-800',
      'REGIONAL_ADMIN': 'bg-cyan-100 text-cyan-800',
      'REGIONAL_OFFICER': 'bg-teal-100 text-teal-800',
      'SCHOOL_ADMIN': 'bg-orange-100 text-orange-800',
      'SCHOOL_HEAD': 'bg-amber-100 text-amber-800',
      'DEPARTMENT_HEAD': 'bg-yellow-100 text-yellow-800',
      'SENIOR_TEACHER': 'bg-lime-100 text-lime-800',
      'TEACHER': 'bg-emerald-100 text-emerald-800',
      'STUDENT': 'bg-sky-100 text-sky-800',
      'PARENT': 'bg-pink-100 text-pink-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>
        <button 
          onClick={handleCreateUser} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add New User
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearUsersError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            {USER_ROLE_OPTIONS.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Shield size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {users.filter((u: User) => u.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <ShieldOff size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {users.filter((u: User) => !u.active).length}
                </div>
                <div className="text-sm text-gray-500">Inactive Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(users.map(u => u.role)).size}
                </div>
                <div className="text-sm text-gray-500">Different Roles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.surname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLoginTime 
                        ? new Date(user.lastLoginTime).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1 rounded ${user.active 
                            ? 'text-orange-600 hover:text-orange-900' 
                            : 'text-green-600 hover:text-green-900'
                          }`}
                          title={user.active ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.active ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination could be added here if needed */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> users
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage; 