import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { exportUsers } from '../usersSlice';
import { USER_ROLE_OPTIONS } from '../../../api/services/userApi';
import { 
  Download, 
  FileText, 
  Filter,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';

interface ExportUsersModalProps {
  extraObject?: {
    selectedUsers?: number[];
  };
}

export const ExportUsersModal: React.FC<ExportUsersModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { users, exportStatus } = useAppSelector(state => state.users);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [exportConfig, setExportConfig] = useState({
    format: 'csv' as 'csv' | 'excel',
    includeInactive: false,
    selectedRoles: [] as string[],
    dateRange: {
      start: '',
      end: ''
    },
    fields: {
      basicInfo: true,
      contactInfo: true,
      systemInfo: true,
      schoolInfo: true,
      personalInfo: false
    }
  });

  const { selectedUsers = [] } = extraObject || {};

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleConfigChange = (key: string, value: any) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setError(null);
  };

  const handleFieldChange = (field: string, checked: boolean) => {
    setExportConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: checked
      }
    }));
  };

  const handleRoleToggle = (role: string) => {
    setExportConfig(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role]
    }));
  };

  const getFilteredUsersCount = () => {
    if (selectedUsers.length > 0) {
      return selectedUsers.length;
    }

    return users.filter(user => {
      // Filter by active status
      if (!exportConfig.includeInactive && !user.active) {
        return false;
      }

      // Filter by roles
      if (exportConfig.selectedRoles.length > 0 && !exportConfig.selectedRoles.includes(user.role)) {
        return false;
      }

      // Filter by date range
      if (exportConfig.dateRange.start && user.createdAt) {
        const userDate = new Date(user.createdAt);
        const startDate = new Date(exportConfig.dateRange.start);
        if (userDate < startDate) {
          return false;
        }
      }

      if (exportConfig.dateRange.end && user.createdAt) {
        const userDate = new Date(user.createdAt);
        const endDate = new Date(exportConfig.dateRange.end);
        if (userDate > endDate) {
          return false;
        }
      }

      return true;
    }).length;
  };

  const handleExport = async () => {
    try {
      setError(null);
      await dispatch(exportUsers(exportConfig.format)).unwrap();
      setIsSuccess(true);
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Export failed');
    }
  };

  const selectedFieldsCount = Object.values(exportConfig.fields).filter(Boolean).length;

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Started!</h3>
        <p className="text-gray-600">Your file download should begin shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Download className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Users</h3>
          <p className="text-sm text-gray-600">Configure and download user data</p>
        </div>
      </div>

      {/* Export Format */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Export Format</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleConfigChange('format', 'csv')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              exportConfig.format === 'csv'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <FileText className="h-5 w-5 mb-2" />
            <div className="font-medium">CSV</div>
            <div className="text-xs text-gray-500">Comma-separated values</div>
          </button>
          <button
            type="button"
            onClick={() => handleConfigChange('format', 'excel')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              exportConfig.format === 'excel'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <FileText className="h-5 w-5 mb-2" />
            <div className="font-medium">Excel</div>
            <div className="text-xs text-gray-500">Microsoft Excel format</div>
          </button>
        </div>
      </div>

      {/* Data Fields */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Include Data Fields</label>
        <div className="space-y-2">
          {[
            { key: 'basicInfo', label: 'Basic Information', description: 'Name, email, role' },
            { key: 'contactInfo', label: 'Contact Information', description: 'Email, phone, address' },
            { key: 'systemInfo', label: 'System Information', description: 'ID, status, dates' },
            { key: 'schoolInfo', label: 'School Information', description: 'School assignment, region' },
            { key: 'personalInfo', label: 'Personal Information', description: 'DOB, nationality, ID numbers' }
          ].map((field) => (
            <label key={field.key} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={exportConfig.fields[field.key as keyof typeof exportConfig.fields]}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{field.label}</div>
                <div className="text-xs text-gray-500">{field.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Filters (only show if not exporting selected users) */}
      {selectedUsers.length === 0 && (
        <>
          {/* User Status Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">User Status</label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportConfig.includeInactive}
                onChange={(e) => handleConfigChange('includeInactive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-900">Include inactive users</span>
            </label>
          </div>

          {/* Role Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Filter by Roles</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {USER_ROLE_OPTIONS.map((role) => (
                <label key={role.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.selectedRoles.includes(role.value)}
                    onChange={() => handleRoleToggle(role.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Registration Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={exportConfig.dateRange.start}
                  onChange={(e) => handleConfigChange('dateRange', { ...exportConfig.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={exportConfig.dateRange.end}
                  onChange={(e) => handleConfigChange('dateRange', { ...exportConfig.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Export Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Export Summary</span>
          <Users className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Users to export:</span>
            <span className="font-medium">{getFilteredUsersCount()}</span>
          </div>
          <div className="flex justify-between">
            <span>Data fields:</span>
            <span className="font-medium">{selectedFieldsCount} selected</span>
          </div>
          <div className="flex justify-between">
            <span>Format:</span>
            <span className="font-medium uppercase">{exportConfig.format}</span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={exportStatus === 'loading' || selectedFieldsCount === 0 || getFilteredUsersCount() === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportStatus === 'loading' ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting...
            </div>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2 inline" />
              Export {getFilteredUsersCount()} Users
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportUsersModal; 