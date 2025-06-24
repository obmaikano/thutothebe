import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Edit, Trash2, Eye, UserCheck, UserX, Filter, Download } from 'lucide-react';
import { staffApi, Staff } from '../../../api/services/staffApi';

const AllStaffManagementPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Mock school ID - in real app, this would come from context or props
  const schoolId = 1;

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm, roleFilter, statusFilter]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffApi.getActiveStaffBySchoolId(schoolId);
      setStaff(response.data.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = staff;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(staffMember =>
        staffMember.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staffMember.staffId && staffMember.staffId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(staffMember => staffMember.active === isActive);
    }

    setFilteredStaff(filtered);
  };

  const handleToggleStatus = async (staffId: number, currentStatus: boolean) => {
    try {
      await staffApi.toggleStaffStatus(staffId, !currentStatus);
      // Show success message
      fetchStaff(); // Refresh the list
    } catch (error) {
      console.error('Error toggling staff status:', error);
      // Show error message
    }
  };

  const handleViewDetails = (staffMember: Staff) => {
    if (staffMember.isTeacher) {
      navigate(`/app/staff-management/teachers/${staffMember.id}`);
    } else {
      navigate(`/app/staff-management/staff/${staffMember.id}`);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'TEACHER':
        return 'bg-blue-100 text-blue-800';
      case 'SENIOR_TEACHER':
        return 'bg-purple-100 text-purple-800';
      case 'DEPARTMENT_HEAD':
        return 'bg-green-100 text-green-800';
      case 'SCHOOL_HEAD':
        return 'bg-orange-100 text-orange-800';
      case 'SCHOOL_ADMIN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'TEACHER':
        return 'Teacher';
      case 'SENIOR_TEACHER':
        return 'Senior Teacher';
      case 'DEPARTMENT_HEAD':
        return 'Department Head';
      case 'SCHOOL_HEAD':
        return 'School Head';
      case 'SCHOOL_ADMIN':
        return 'School Admin';
      default:
        return role.replace('_', ' ');
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">All Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage all school staff including teachers and administrators</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/school-admin/teachers/onboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add New Staff
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search staff by name, email, or staff ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="TEACHER">Teachers</option>
            <option value="SENIOR_TEACHER">Senior Teachers</option>
            <option value="DEPARTMENT_HEAD">Department Heads</option>
            <option value="SCHOOL_HEAD">School Heads</option>
            <option value="SCHOOL_ADMIN">School Admins</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No staff found</p>
                    <p className="text-sm">Try adjusting your search criteria or add a new staff member.</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staffMember) => (
                  <tr key={staffMember.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {staffMember.firstName.charAt(0)}{staffMember.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {staffMember.firstName} {staffMember.lastName}
                          </div>
                          {staffMember.qualification && (
                            <div className="text-sm text-gray-500">{staffMember.qualification}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(staffMember.role)}`}>
                        {getRoleDisplayName(staffMember.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffMember.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffMember.staffId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        staffMember.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {staffMember.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        staffMember.isTeacher ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staffMember.isTeacher ? 'Teacher' : 'Staff'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(staffMember)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleToggleStatus(staffMember.id, staffMember.active)}
                          className={`flex items-center gap-1 ${
                            staffMember.active 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {staffMember.active ? <UserX size={14} /> : <UserCheck size={14} />}
                          {staffMember.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredStaff.length} of {staff.length} staff members
      </div>
    </div>
  );
};

export default AllStaffManagementPage; 