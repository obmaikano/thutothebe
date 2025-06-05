import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchUserById, 
  clearCurrentUser, 
  activateUser, 
  deactivateUser,
  updateUser
} from '../usersSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { User, USER_ROLE_OPTIONS } from '../../../api/services/userApi';
import { NATIONALITY_LABELS } from '../../../api/services/enumApi';
import { 
  ArrowLeft,
  Edit,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  School,
  Clock,
  Activity,
  Settings,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, status, error } = useAppSelector(state => state.users);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(parseInt(id)));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    if (currentUser) {
      dispatch(openModal({
        title: 'Edit User',
        bodyType: MODAL_BODY_TYPES.USER_EDIT,
        extraObject: currentUser
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentUser) return;
    
    try {
      if (currentUser.active) {
        await dispatch(deactivateUser(currentUser.id)).unwrap();
      } else {
        await dispatch(activateUser(currentUser.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleOption = USER_ROLE_OPTIONS.find(option => option.value === role);
    return roleOption ? roleOption.label : role;
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

  if (error || !currentUser) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <span>{error || 'User not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-1">Detailed user information and management</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentUser.active 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {currentUser.active ? <ShieldOff size={16} /> : <Shield size={16} />}
            {currentUser.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            Edit User
          </button>
        </div>
      </div>

      {/* User Overview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(currentUser.role)}`}>
                {getRoleDisplayName(currentUser.role)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentUser.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentUser.active ? (
                  <>
                    <CheckCircle size={12} className="mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle size={12} className="mr-1" />
                    Inactive
                  </>
                )}
              </span>
            </div>
            
            <div className="text-gray-600 mb-4">
              <p className="text-lg">{currentUser.surname}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <UserIcon size={16} className="mr-2" />
                <span>ID: {currentUser.id}</span>
              </div>
              {currentUser.schoolId && (
                <div className="flex items-center text-gray-600">
                  <School size={16} className="mr-2" />
                  <span>School ID: {currentUser.schoolId}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>Gender: {currentUser.gender}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900">{NATIONALITY_LABELS[currentUser.nationality] || currentUser.nationality}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Surname</label>
                <p className="text-gray-900">{currentUser.surname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900">{currentUser.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900">{NATIONALITY_LABELS[currentUser.nationality] || currentUser.nationality}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">
                  {currentUser.dateOfBirth 
                    ? new Date(currentUser.dateOfBirth).toLocaleDateString()
                    : 'Not provided'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-gray-900">{currentUser.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900">{getRoleDisplayName(currentUser.role)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900">
                  {currentUser.active ? 'Active' : 'Inactive'}
                </p>
              </div>
              {currentUser.schoolId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">School ID</label>
                  <p className="text-gray-900">{currentUser.schoolId}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">
                  {currentUser.createdAt 
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : 'Not available'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">
                  {currentUser.updatedAt 
                    ? new Date(currentUser.updatedAt).toLocaleDateString()
                    : 'Not available'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Login</label>
                <p className="text-gray-900">
                  {currentUser.lastLoginTime 
                    ? new Date(currentUser.lastLoginTime).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Activity tracking will be implemented in a future update.</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Account Status</h4>
                <p className="text-sm text-gray-500">
                  {currentUser.active ? 'User account is active' : 'User account is inactive'}
                </p>
              </div>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentUser.active 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {currentUser.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Edit Profile</h4>
                <p className="text-sm text-gray-500">Update user information and settings</p>
              </div>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Password Reset</h4>
                <p className="text-sm text-gray-500">Send password reset email to user</p>
              </div>
              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage; 