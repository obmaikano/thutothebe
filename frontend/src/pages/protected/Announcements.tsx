import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchAnnouncementsForUser, 
  clearAnnouncementsError,
  setAnnouncementFilter,
  markAnnouncementAsRead,
  acknowledgeAnnouncement,
  fetchPendingAcknowledgmentsCount
} from '../../features/announcements/announcementsSlice';
import { openModal } from '../../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../../utils/modalConstants';
import { useAuth } from '../../contexts/AuthContext';
import { Megaphone, Plus, Search, Filter, Bell, CheckCircle, Eye, Calendar, Tag, User, AlertTriangle } from 'lucide-react';
import { Announcement } from '../../api/services/announcementApi';
import { Link, useNavigate } from 'react-router-dom';

const Announcements: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    announcements, 
    status, 
    error, 
    pagination, 
    pendingAcknowledgmentsCount,
    filter 
  } = useAppSelector(state => state.announcements);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAnnouncementsForUser({ userId: user.id }));
      dispatch(fetchPendingAcknowledgmentsCount(user.id));
    }
    return () => {
      dispatch(clearAnnouncementsError());
    };
  }, [dispatch, user?.id]);

  const canCreateAnnouncements = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE', 
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD',
    'SENIOR_TEACHER',
    'TEACHER'
  ].includes(user.role);

  const handleCreateAnnouncement = () => {
    dispatch(openModal({
      title: 'Create New Announcement',
      bodyType: MODAL_BODY_TYPES.ANNOUNCEMENT_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    if (user?.id && !announcement.isRead) {
      dispatch(markAnnouncementAsRead({ announcementId: announcement.id, userId: user.id }));
    }
    
    navigate(`/app/announcement-details/${announcement.id}`);
  };

  const handleAcknowledge = (announcement: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.id) {
      dispatch(acknowledgeAnnouncement({ 
        announcementId: announcement.id, 
        userId: user.id 
      }));
    }
  };

  const handleSearch = () => {
    if (user?.id && searchTerm.trim()) {
      dispatch(setAnnouncementFilter({ searchTerm: searchTerm.trim() }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'NORMAL': return 'text-blue-600 bg-blue-100';
      case 'LOW': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'text-red-600 bg-red-100';
      case 'URGENT': return 'text-orange-600 bg-orange-100';
      case 'ACADEMIC': return 'text-blue-600 bg-blue-100';
      case 'ADMINISTRATIVE': return 'text-purple-600 bg-purple-100';
      case 'EVENT': return 'text-green-600 bg-green-100';
      case 'HOLIDAY': return 'text-yellow-600 bg-yellow-100';
      case 'EXAM': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const filteredAnnouncements = announcements.filter(announcement => {
    if (showUnreadOnly && announcement.isRead) return false;
    if (typeFilter && announcement.type !== typeFilter) return false;
    if (priorityFilter && announcement.priority !== priorityFilter) return false;
    return true;
  });

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-blue-600" />
            Announcements
          </h1>
          <p className="text-gray-600 mt-2">Stay informed with important updates and communications</p>
          {pendingAcknowledgmentsCount > 0 && (
            <div className="mt-2 flex items-center gap-2 text-orange-600">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">
                {pendingAcknowledgmentsCount} announcement{pendingAcknowledgmentsCount !== 1 ? 's' : ''} require acknowledgment
              </span>
            </div>
          )}
        </div>
        {canCreateAnnouncements && (
          <button
            onClick={handleCreateAnnouncement}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Announcement
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {announcements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Megaphone size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
                <div className="text-sm text-gray-500">Total Announcements</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Bell size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => !a.isRead).length}
                </div>
                <div className="text-sm text-gray-500">Unread</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.priority === 'URGENT' || a.priority === 'HIGH').length}
                </div>
                <div className="text-sm text-gray-500">High Priority</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {announcements.filter(a => a.acknowledgmentRequired && !a.isAcknowledged).length}
                </div>
                <div className="text-sm text-gray-500">Need Acknowledgment</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="URGENT">Urgent</option>
            <option value="ACADEMIC">Academic</option>
            <option value="ADMINISTRATIVE">Administrative</option>
            <option value="EVENT">Event</option>
            <option value="HOLIDAY">Holiday</option>
            <option value="EXAM">Exam</option>
            <option value="GENERAL">General</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>

          {/* Unread Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm"
            />
            <span className="text-sm text-gray-700">Unread only</span>
          </label>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Announcement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                    <p className="text-gray-600">
                      {showUnreadOnly ? 'No unread announcements at the moment.' : 'There are no announcements to display.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <tr 
                    key={announcement.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${!announcement.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleAnnouncementClick(announcement)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!announcement.isRead ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Megaphone className={`h-5 w-5 ${!announcement.isRead ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className={`text-sm font-medium ${!announcement.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                            <Link 
                              to={`/app/announcement-details/${announcement.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {announcement.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {announcement.content.length > 100 
                              ? `${announcement.content.substring(0, 100)}...` 
                              : announcement.content
                            }
                          </div>
                          {announcement.tags && announcement.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {announcement.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                              {announcement.tags.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{announcement.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{announcement.creatorName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(announcement.createdAt)}</div>
                      {announcement.endDate && new Date(announcement.endDate) > new Date() && (
                        <div className="text-xs text-gray-500">
                          Expires: {formatDate(announcement.endDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {announcement.acknowledgmentRequired && !announcement.isAcknowledged && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Needs Acknowledgment
                          </span>
                        )}
                        {announcement.isAcknowledged && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </span>
                        )}
                        {announcement.readCount !== undefined && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {announcement.readCount} read
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {announcement.acknowledgmentRequired && !announcement.isAcknowledged && (
                          <button
                            onClick={(e) => handleAcknowledge(announcement, e)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded"
                            title="Acknowledge"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnnouncementClick(announcement);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button 
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={pagination.first}
                onClick={() => {
                  if (user?.id) {
                    dispatch(fetchAnnouncementsForUser({ 
                      userId: user.id, 
                      page: pagination.number - 1 
                    }));
                  }
                }}
              >
                Previous
              </button>
              <button 
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={pagination.last}
                onClick={() => {
                  if (user?.id) {
                    dispatch(fetchAnnouncementsForUser({ 
                      userId: user.id, 
                      page: pagination.number + 1 
                    }));
                  }
                }}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.number + 1}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => {
                      if (user?.id) {
                        dispatch(fetchAnnouncementsForUser({ 
                          userId: user.id, 
                          page: pagination.number - 1 
                        }));
                      }
                    }}
                    disabled={pagination.first}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                    {pagination.number + 1}
                  </span>
                  <button
                    onClick={() => {
                      if (user?.id) {
                        dispatch(fetchAnnouncementsForUser({ 
                          userId: user.id, 
                          page: pagination.number + 1 
                        }));
                      }
                    }}
                    disabled={pagination.last}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements; 