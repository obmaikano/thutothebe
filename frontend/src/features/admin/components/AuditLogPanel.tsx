import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Filter, Download, Calendar, Eye } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  actionType: 'permission_granted' | 'permission_revoked' | 'role_assigned' | 'role_removed' | 'user_created' | 'user_updated' | 'school_assigned';
  targetUserId?: string;
  targetUserEmail?: string;
  previousRole?: string;
  newRole?: string;
  permissions?: string[];
  schoolId?: string;
  schoolName?: string;
  ipAddress: string;
  userAgent: string;
  details: string;
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15 10:30:25',
    userId: 'admin1',
    userEmail: 'admin@education.gov.bw',
    action: 'Granted Super Admin role to John Doe',
    actionType: 'role_assigned',
    targetUserId: 'user1',
    targetUserEmail: 'john.doe@education.gov.bw',
    previousRole: 'Teacher',
    newRole: 'Super Admin',
    permissions: ['read_users', 'write_users', 'delete_users', 'manage_roles', 'view_audit_logs'],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Role assignment due to administrative promotion'
  },
  {
    id: '2',
    timestamp: '2024-01-14 14:20:15',
    userId: 'admin1',
    userEmail: 'admin@education.gov.bw',
    action: 'Revoked write permissions from Jane Smith',
    actionType: 'permission_revoked',
    targetUserId: 'user2',
    targetUserEmail: 'jane.smith@education.gov.bw',
    permissions: ['write_schools', 'delete_schools'],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Permission revocation for security compliance'
  },
  {
    id: '3',
    timestamp: '2024-01-13 09:15:30',
    userId: 'regional1',
    userEmail: 'regional@education.gov.bw',
    action: 'Assigned School Administrator to Gaborone Primary',
    actionType: 'school_assigned',
    targetUserId: 'user3',
    targetUserEmail: 'principal@gaborone.edu.bw',
    schoolId: 'school1',
    schoolName: 'Gaborone Primary School',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    details: 'New school administrator assignment'
  },
  {
    id: '4',
    timestamp: '2024-01-12 16:45:10',
    userId: 'admin1',
    userEmail: 'admin@education.gov.bw',
    action: 'Created new user account for Michael Johnson',
    actionType: 'user_created',
    targetUserId: 'user4',
    targetUserEmail: 'michael.johnson@education.gov.bw',
    newRole: 'Regional Director',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'New regional director account creation'
  },
  {
    id: '5',
    timestamp: '2024-01-11 11:20:45',
    userId: 'admin1',
    userEmail: 'admin@education.gov.bw',
    action: 'Updated permissions for Teacher role',
    actionType: 'permission_granted',
    permissions: ['read_reports', 'write_reports'],
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Added reporting permissions to teacher role'
  }
];

const AuditLogPanel: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const actionTypes = [
    { value: '', label: 'All Actions' },
    { value: 'permission_granted', label: 'Permission Granted' },
    { value: 'permission_revoked', label: 'Permission Revoked' },
    { value: 'role_assigned', label: 'Role Assigned' },
    { value: 'role_removed', label: 'Role Removed' },
    { value: 'user_created', label: 'User Created' },
    { value: 'user_updated', label: 'User Updated' },
    { value: 'school_assigned', label: 'School Assigned' }
  ];

  useEffect(() => {
    let filtered = logs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetUserEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by action type
    if (selectedActionType) {
      filtered = filtered.filter(log => log.actionType === selectedActionType);
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(log => log.timestamp >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(log => log.timestamp <= dateRange.end);
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, selectedActionType, dateRange]);

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting audit logs...');
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'permission_granted':
      case 'role_assigned':
      case 'user_created':
      case 'school_assigned':
        return 'bg-green-100 text-green-800';
      case 'permission_revoked':
      case 'role_removed':
        return 'bg-red-100 text-red-800';
      case 'user_updated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600 mt-1">Track all permission and role changes (Read-only)</p>
        </div>
        <Button onClick={handleExport} leftIcon={Download} variant="outline">
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
            >
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setSelectedActionType('');
              setDateRange({ start: '', end: '' });
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Logs Table */}
  <Card>
        <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
        </tr>
      </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(log.actionType)}`}>
                      {formatActionType(log.actionType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.userEmail}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.targetUserEmail || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                      leftIcon={Eye}
                    >
                      Details
                    </Button>
                  </td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No audit logs found matching your criteria.</div>
          </div>
        )}
  </Card>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedLog(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <div className="text-sm text-gray-900">{selectedLog.timestamp}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action Type</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(selectedLog.actionType)}`}>
                      {formatActionType(selectedLog.actionType)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Performed By</label>
                  <div className="text-sm text-gray-900">{selectedLog.userEmail}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Action Description</label>
                  <div className="text-sm text-gray-900">{selectedLog.action}</div>
                </div>

                {selectedLog.targetUserEmail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target User</label>
                    <div className="text-sm text-gray-900">{selectedLog.targetUserEmail}</div>
                  </div>
                )}

                {selectedLog.previousRole && selectedLog.newRole && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Previous Role</label>
                      <div className="text-sm text-gray-900">{selectedLog.previousRole}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Role</label>
                      <div className="text-sm text-gray-900">{selectedLog.newRole}</div>
                    </div>
                  </div>
                )}

                {selectedLog.schoolName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">School</label>
                    <div className="text-sm text-gray-900">{selectedLog.schoolName}</div>
                  </div>
                )}

                {selectedLog.permissions && selectedLog.permissions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Permissions Affected</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLog.permissions.map(permission => (
                        <span
                          key={permission}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <div className="text-sm text-gray-900">{selectedLog.details}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <div className="text-sm text-gray-900">{selectedLog.ipAddress}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Agent</label>
                    <div className="text-sm text-gray-900 truncate" title={selectedLog.userAgent}>
                      {selectedLog.userAgent}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogPanel; 