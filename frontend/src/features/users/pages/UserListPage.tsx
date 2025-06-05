import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchUsers, 
  clearUsersError, 
  activateUser, 
  deactivateUser, 
  deleteUser,
  fetchUserAnalytics,
  bulkActivateUsers,
  bulkDeactivateUsers,
  bulkDeleteUsers,
  exportUsers,
  setFilters,
  clearFilters,
  clearExportData
} from '../usersSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { User, USER_ROLE_OPTIONS } from '../../../api/services/userApi';
import { 
  Plus, 
  Search, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  ShieldOff, 
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  UserCheck,
  UserX,
  Settings,
  BarChart3,
  Calendar,
  CheckSquare
} from 'lucide-react';

const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    users, 
    status, 
    error, 
    analytics, 
    analyticsStatus,
    filters,
    exportData,
    exportStatus,
    bulkOperationStatus
  } = useAppSelector(state => state.users);
  
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchUserAnalytics());
    return () => {
      dispatch(clearUsersError());
    };
  }, [dispatch]);

  // Handle export file download
  useEffect(() => {
    if (exportData) {
      const url = URL.createObjectURL(exportData);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      dispatch(clearExportData());
    }
  }, [exportData, dispatch]);

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
      // Refresh the users list and analytics after status change
      await dispatch(fetchUsers({}));
      await dispatch(fetchUserAnalytics());
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleViewDetails = (user: User) => {
    dispatch(openModal({
      title: 'User Details',
      bodyType: MODAL_BODY_TYPES.USER_EDIT,
      extraObject: user
    }));
  };

  const handleBulkOperation = async (operation: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return;

    try {
      switch (operation) {
        case 'activate':
          await dispatch(bulkActivateUsers(selectedUsers)).unwrap();
          break;
        case 'deactivate':
          await dispatch(bulkDeactivateUsers(selectedUsers)).unwrap();
          break;
        case 'delete':
          await dispatch(bulkDeleteUsers(selectedUsers)).unwrap();
          break;
      }
      setSelectedUsers([]);
      setShowBulkActions(false);
      
      // Refresh the users list and analytics after bulk operation
      await dispatch(fetchUsers({}));
      await dispatch(fetchUserAnalytics());
    } catch (error) {
      console.error(`Failed to ${operation} users:`, error);
    }
  };

  const handleExport = () => {
    dispatch(exportUsers('csv'));
  };

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleOption = USER_ROLE_OPTIONS.find(option => option.value === role);
    return roleOption ? roleOption.label : role;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch = 
        filters.search === '' ||
        user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.surname.toLowerCase().includes(filters.search.toLowerCase()) ||
        getRoleDisplayName(user.role).toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = 
        filters.status === '' ||
        (filters.status === 'active' && user.active) ||
        (filters.status === 'inactive' && !user.active);

      const matchesRole = 
        filters.role === '' || user.role === filters.role;

      const matchesSchool = 
        filters.schoolId === '' || user.schoolId === filters.schoolId;

      return matchesSearch && matchesStatus && matchesRole && matchesSchool;
    });
  }, [users, filters]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

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
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={exportStatus === 'loading'}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            {exportStatus === 'loading' ? 'Exporting...' : 'Export'}
          </button>
          <button 
            onClick={handleCreateUser} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add New User
          </button>
        </div>
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

      {/* Analytics Dashboard */}
      {analytics && analyticsStatus === 'succeeded' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <UserCheck size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <UserX size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.inactiveUsers}</div>
                <div className="text-sm text-gray-500">Inactive Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.recentRegistrations}</div>
                <div className="text-sm text-gray-500">New This Week</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select 
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              {USER_ROLE_OPTIONS.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="School ID"
              value={filters.schoolId}
              onChange={(e) => handleFilterChange('schoolId', e.target.value ? parseInt(e.target.value) : '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkOperation('activate')}
                disabled={bulkOperationStatus === 'loading'}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkOperation('deactivate')}
                disabled={bulkOperationStatus === 'loading'}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkOperation('delete')}
                disabled={bulkOperationStatus === 'loading'}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('firstName')}
                >
                  Name
                  {sortConfig?.key === 'firstName' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  Email
                  {sortConfig?.key === 'email' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('role')}
                >
                  Role
                  {sortConfig?.key === 'role' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                  {sortConfig?.key === 'createdAt' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.schoolId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={user.active ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}
                        title={user.active ? "Deactivate User" : "Activate User"}
                      >
                        {user.active ? <ShieldOff size={16} /> : <Shield size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.role || filters.status ? 
                'Try adjusting your search or filter criteria.' : 
                'Get started by creating a new user.'
              }
            </p>
            {!filters.search && !filters.role && !filters.status && (
              <div className="mt-6">
                <button
                  onClick={handleCreateUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add User
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {sortedUsers.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {sortedUsers.length} of {users.length} users
          {(filters.search || filters.role || filters.status) && (
            <span> (filtered)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserListPage; 