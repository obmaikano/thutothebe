import React from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface RealTimeDataStatusProps {
  showDetails?: boolean;
  className?: string;
}

const RealTimeDataStatus: React.FC<RealTimeDataStatusProps> = ({ 
  showDetails = true, 
  className = '' 
}) => {
  const {
    isConnected,
    lastUpdate,
    error,
    refreshCount,
    isWebSocketEnabled,
    isAutoRefreshEnabled,
    refreshInterval,
    refreshData
  } = useRealTimeData({
    enableWebSocket: true,
    refreshInterval: 30000,
    autoRefresh: true
  });

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isConnected) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (error) return '🔴';
    if (isConnected) return '🟢';
    return '🟡';
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isConnected) return 'Connected';
    return 'Connecting...';
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Real-Time Data</h3>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <button
          onClick={refreshData}
          disabled={!!error}
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span className="font-medium">{formatTime(lastUpdate)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Refresh Count:</span>
            <span className="font-medium">{refreshCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span>WebSocket:</span>
            <span className={`font-medium ${isWebSocketEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              {isWebSocketEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Auto Refresh:</span>
            <span className={`font-medium ${isAutoRefreshEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              {isAutoRefreshEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          {isAutoRefreshEnabled && (
            <div className="flex justify-between">
              <span>Refresh Interval:</span>
              <span className="font-medium">{refreshInterval / 1000}s</span>
            </div>
          )}
          
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimeDataStatus; 