import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { Announcement } from '../../../api/services/announcementApi';
import announcementApi from '../../../api/services/announcementApi';
import { 
  BarChart3, 
  Eye, 
  CheckCircle, 
  Users, 
  Calendar, 
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnnouncementAnalyticsModalProps {
  extraObject?: Announcement;
}

interface AnalyticsData {
  readReceipts: any[];
  acknowledgments: any[];
  totalViews: number;
  totalAcknowledgments: number;
  readRate: number;
  acknowledgmentRate: number;
  engagementTrend: any[];
}

const AnnouncementAnalyticsModal: React.FC<AnnouncementAnalyticsModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (extraObject?.id && user?.id) {
      fetchAnalyticsData();
    }
  }, [extraObject?.id, user?.id]);

  const fetchAnalyticsData = async () => {
    if (!extraObject?.id || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const [readReceiptsResponse, acknowledgementsResponse] = await Promise.all([
        announcementApi.getReadReceipts(extraObject.id, user.id),
        announcementApi.getAcknowledgments(extraObject.id, user.id)
      ]);

      const readReceipts = Array.isArray(readReceiptsResponse.data.data) 
        ? readReceiptsResponse.data.data 
        : readReceiptsResponse.data.data ? [readReceiptsResponse.data.data] : [];
      
      const acknowledgments = Array.isArray(acknowledgementsResponse.data.data) 
        ? acknowledgementsResponse.data.data 
        : acknowledgementsResponse.data.data ? [acknowledgementsResponse.data.data] : [];

      const totalViews = extraObject.readCount || 0;
      const totalAcknowledgments = extraObject.acknowledgmentCount || 0;
      const targetUserCount = extraObject.targetUserCount || 1;

      setAnalyticsData({
        readReceipts,
        acknowledgments,
        totalViews,
        totalAcknowledgments,
        readRate: (totalViews / targetUserCount) * 100,
        acknowledgmentRate: extraObject.acknowledgmentRequired 
          ? (totalAcknowledgments / targetUserCount) * 100 
          : 0,
        engagementTrend: [] // This would come from a separate API endpoint
      });
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = () => {
    if (!analyticsData || !extraObject) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Announcement Title', extraObject.title],
      ['Total Views', analyticsData.totalViews.toString()],
      ['Total Acknowledgments', analyticsData.totalAcknowledgments.toString()],
      ['Read Rate', `${analyticsData.readRate.toFixed(1)}%`],
      ['Acknowledgment Rate', `${analyticsData.acknowledgmentRate.toFixed(1)}%`],
      ['Created Date', formatDate(extraObject.createdAt)],
      ['Type', extraObject.type],
      ['Priority', extraObject.priority]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `announcement-analytics-${extraObject.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!extraObject) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No announcement data provided.</p>
        <button
          onClick={() => dispatch(closeModal({}))}
          className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Announcement Analytics
          </h2>
          <p className="text-sm text-gray-600 mt-1">{extraObject.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalyticsData}
            disabled={loading}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportData}
            disabled={loading || !analyticsData}
            className="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : analyticsData ? (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Eye size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{analyticsData.totalViews}</div>
                  <div className="text-sm text-blue-600">Total Views</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-900">{analyticsData.totalAcknowledgments}</div>
                  <div className="text-sm text-green-600">Acknowledgments</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-900">{analyticsData.readRate.toFixed(1)}%</div>
                  <div className="text-sm text-purple-600">Read Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <Users size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-900">
                    {extraObject.acknowledgmentRequired ? `${analyticsData.acknowledgmentRate.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-orange-600">Ack. Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Announcement Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">{extraObject.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Priority:</span>
                <span className="ml-2 text-gray-600">{extraObject.priority}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">{formatDate(extraObject.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  extraObject.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {extraObject.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {extraObject.targetRole && (
                <div>
                  <span className="font-medium text-gray-700">Target Role:</span>
                  <span className="ml-2 text-gray-600">{extraObject.targetRole}</span>
                </div>
              )}
              {extraObject.targetDepartment && (
                <div>
                  <span className="font-medium text-gray-700">Target Department:</span>
                  <span className="ml-2 text-gray-600">{extraObject.targetDepartment}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Read Receipts */}
          {analyticsData.readReceipts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Recent Read Receipts
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Read At</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.readReceipts.slice(0, 10).map((receipt, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{receipt.userId}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatDate(receipt.readAt)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{receipt.ipAddress || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analyticsData.readReceipts.length > 10 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    Showing 10 of {analyticsData.readReceipts.length} read receipts
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Acknowledgments */}
          {analyticsData.acknowledgments.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recent Acknowledgments
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acknowledged At</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.acknowledgments.slice(0, 10).map((ack, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{ack.userId}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatDate(ack.acknowledgedAt)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{ack.note || 'No note'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analyticsData.acknowledgments.length > 10 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    Showing 10 of {analyticsData.acknowledgments.length} acknowledgments
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Data Message */}
          {analyticsData.readReceipts.length === 0 && analyticsData.acknowledgments.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Engagement Data</h3>
              <p className="text-gray-600">This announcement hasn't received any views or acknowledgments yet.</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => dispatch(closeModal({}))}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AnnouncementAnalyticsModal; 