import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAppDispatch } from '../../../app/hooks';
import { openModal, showNotification } from '../../common/commonSlice';
import { Search, UserCheck, Eye, Settings, Plus } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  status: string;
  lastUpdated: string;
  updatedBy: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const availablePermissions = [
  'read_users', 'write_users', 'delete_users',
  'read_schools', 'write_schools', 'delete_schools',
  'read_courses', 'write_courses', 'delete_courses',
  'read_reports', 'write_reports',
  'manage_regions', 'manage_roles', 'view_audit_logs'
];

const predefinedRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: availablePermissions,
    userCount: 2
  },
  {
    id: '2',
    name: 'Regional Director',
    description: 'Regional oversight and management',
    permissions: ['read_users', 'read_schools', 'read_courses', 'read_reports', 'write_reports'],
    userCount: 8
  },
  {
    id: '3',
    name: 'School Administrator',
    description: 'School-level administration',
    permissions: ['read_users', 'write_users', 'read_courses', 'write_courses', 'read_reports'],
    userCount: 25
  },
  {
    id: '4',
    name: 'Teacher',
    description: 'Course and student management',
    permissions: ['read_courses', 'write_courses', 'read_reports'],
    userCount: 150
  },
  {
    id: '5',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['read_users', 'read_schools', 'read_courses', 'read_reports'],
    userCount: 45
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@education.gov.bw',
    role: 'Super Admin',
    permissions: availablePermissions,
    status: 'active',
    lastUpdated: '2024-01-15 10:30',
    updatedBy: 'System Admin'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@education.gov.bw',
    role: 'Regional Director',
    permissions: ['read_users', 'read_schools', 'read_courses', 'read_reports', 'write_reports'],
    status: 'active',
    lastUpdated: '2024-01-10 14:20',
    updatedBy: 'John Doe'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@school.edu.bw',
    role: 'School Administrator',
    permissions: ['read_users', 'write_users', 'read_courses', 'write_courses', 'read_reports'],
    status: 'active',
    lastUpdated: '2024-01-08 09:15',
    updatedBy: 'Jane Smith'
  }
];

const PermissionsRoles: React.FC = () => {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(predefinedRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const filteredUsers = users.filter(user =>
    (selectedRole === '' || user.role === selectedRole) &&
    (`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    const role = roles.find(r => r.name === newRole);
    if (!role) return;

    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            role: newRole, 
            permissions: role.permissions,
            lastUpdated: new Date().toLocaleString(),
            updatedBy: 'Current User'
          }
        : user
    ));

    dispatch(showNotification({
      type: 'success',
      message: `Role updated to ${newRole} successfully`
    }));
  };

  const handleAddUser = () => {
    dispatch(openModal({
      title: 'Add New User',
      size: 'lg',
      content: 'AddUserModal' as any,
      contentProps: {
        roles: roles.map(r => r.name),
        onSuccess: () => {
          // TODO: Refresh users list
          dispatch(showNotification({
            type: 'success',
            message: 'User added successfully'
          }));
        }
      }
    }));
  };

  const handleCreateRole = () => {
    dispatch(openModal({
      title: 'Create New Role',
      size: 'lg',
      content: 'CreateRoleModal' as any,
      contentProps: {
        availablePermissions,
        onSuccess: (newRole: Role) => {
          setRoles([...roles, newRole]);
          dispatch(showNotification({
            type: 'success',
            message: 'Role created successfully'
          }));
        }
      }
    }));
  };

  const handleViewPermissions = (user: User) => {
    dispatch(openModal({
      title: `Permissions for ${user.firstName} ${user.lastName}`,
      size: 'md',
      content: 'ViewPermissionsModal' as any,
      contentProps: {
        user,
        availablePermissions
      }
    }));
  };

  const handleEditRole = (role: Role) => {
    dispatch(openModal({
      title: `Edit Role: ${role.name}`,
      size: 'lg',
      content: 'EditRoleModal' as any,
      contentProps: {
        role,
        availablePermissions,
        onSuccess: (updatedRole: Role) => {
          setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
          dispatch(showNotification({
            type: 'success',
            message: 'Role updated successfully'
          }));
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissions & Roles</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleCreateRole} leftIcon={Plus}>
            Create Role
          </Button>
          <Button onClick={handleAddUser} leftIcon={Plus}>
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setSelectedTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Roles ({roles.length})
          </button>
        </nav>
      </div>

      {selectedTab === 'users' && (
        <>
          {/* Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{user.lastUpdated}</div>
                        <div className="text-xs">by {user.updatedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPermissions(user)}
                            leftIcon={Eye}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {selectedTab === 'roles' && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRole(role)}
                    leftIcon={Settings}
                  >
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Users:</span>
                    <span className="font-medium">{role.userCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Permissions:</span>
                    <span className="font-medium">{role.permissions.length}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Key Permissions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map(permission => (
                      <span
                        key={permission}
                        className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{role.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PermissionsRoles; 