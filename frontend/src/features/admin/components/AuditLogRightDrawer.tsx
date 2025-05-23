import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/commonSlice';
import { Search, Filter, Calendar, User, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

interface AuditLogRightDrawerProps {
  closeRightDrawer: () => void;
}

export const AuditLogRightDrawer: React.FC<AuditLogRightDrawerProps> = ({ closeRightDrawer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch audit logs from API
    // Mock data for now
    setTimeout(() => {
      setAuditLogs([
        {
          id: '1',
          timestamp: '2024-03-15 14:30:22',
          user: 'David Wilson',
          action: 'CREATE',
          resource: 'User',
          details: 'Created new user: jane.smith@education.gov.bw',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          timestamp: '2024-03-15 14:25:15',
          user: 'Sarah Chen',
          action: 'UPDATE',
          resource: 'School',
          details: 'Updated school information for Gaborone Secondary School',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: '3',
          timestamp: '2024-03-15 14:20:08',
          user: 'Admin System',
          action: 'DELETE',
          resource: 'User',
          details: 'Deleted inactive user account: old.user@education.gov.bw',
          ipAddress: '10.0.0.1',
          userAgent: 'System Process'
        },
        {
          id: '4',
          timestamp: '2024-03-15 14:15:33',
          user: 'Robert Johnson',
          action: 'LOGIN',
          resource: 'System',
          details: 'User logged into the system',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'LOGIN': return '🔐';
      case 'LOGOUT': return '🚪';
      default: return '📝';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
          <p className="text-sm text-gray-600 mt-1">System activity and user actions</p>
        </div>
        <button
          onClick={closeRightDrawer}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
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

        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="all">All Actions</option>
          {actions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Audit Logs List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No audit logs found matching your criteria.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getActionIcon(log.action)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-500">{log.resource}</span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">{log.details}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    <div>IP: {log.ipAddress}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Export Audit Logs
        </button>
      </div>
    </div>
  );
}; 