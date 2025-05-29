import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchAnnouncementById, 
  markAnnouncementAsRead, 
  acknowledgeAnnouncement,
  clearAnnouncementsError 
} from '../../features/announcements/announcementsSlice';
import { setPageTitle } from '../../features/common/commonSlice';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  MessageCircle, 
  Activity, 
  BarChart3, 
  CheckCircle, 
  Heart, 
  Reply, 
  Send,
  Eye,
  ThumbsUp,
  Clock,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import announcementCommentApi, { AnnouncementComment, AnnouncementActivity } from '../../api/services/announcementCommentApi';

const AnnouncementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentAnnouncement, status, error } = useAppSelector(state => state.announcements);

  // Comments and activity state
  const [comments, setComments] = useState<AnnouncementComment[]>([]);
  const [activities, setActivities] = useState<AnnouncementActivity[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [acknowledgingAnnouncement, setAcknowledgingAnnouncement] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'activity' | 'analytics'>('comments');

  // Check if current user is the creator
  const isCreator = user?.id === currentAnnouncement?.creatorId;

  // Ensure non-creators can't access restricted tabs
  useEffect(() => {
    if (!isCreator && (activeTab === 'activity' || activeTab === 'analytics')) {
      setActiveTab('comments');
    }
  }, [isCreator, activeTab]);

  useEffect(() => {
    if (id && user?.id) {
      dispatch(fetchAnnouncementById({ id: Number(id), userId: user.id }));
      dispatch(setPageTitle('Announcement Details'));
    }
  }, [dispatch, id, user?.id]);

  useEffect(() => {
    if (currentAnnouncement && user) {
      loadComments();
      loadActivities();
      
      // Mark as read for all users (including creator)
      if (!currentAnnouncement.isRead) {
        dispatch(markAnnouncementAsRead({ announcementId: currentAnnouncement.id, userId: user.id }));
      }
    }
  }, [currentAnnouncement, user]);

  const loadComments = async () => {
    if (!currentAnnouncement?.id) return;
    
    setLoadingComments(true);
    try {
      const response = await announcementCommentApi.getCommentsByAnnouncement(currentAnnouncement.id);
      if (response.data.data && Array.isArray(response.data.data)) {
        setComments(response.data.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadActivities = async () => {
    if (!currentAnnouncement?.id || !isCreator) return;
    
    setLoadingActivities(true);
    try {
      const response = await announcementCommentApi.getActivitiesByAnnouncement(currentAnnouncement.id);
      if (response.data.data && Array.isArray(response.data.data)) {
        setActivities(response.data.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleAcknowledge = async () => {
    if (user?.id && currentAnnouncement) {
      setAcknowledgingAnnouncement(true);
      try {
        await dispatch(acknowledgeAnnouncement({ 
          announcementId: currentAnnouncement.id, 
          userId: user.id 
        })).unwrap();
        
        // Reload activities to show the new acknowledgment
        await loadActivities();
      } catch (error) {
        console.error('Failed to acknowledge announcement:', error);
      } finally {
        setAcknowledgingAnnouncement(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !currentAnnouncement) return;

    try {
      const commentData = {
        content: newComment.trim(),
        authorId: user.id,
        announcementId: currentAnnouncement.id
      };

      await announcementCommentApi.createComment(commentData);
      await loadComments();
      await loadActivities();
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleAddReply = async (parentCommentId: number) => {
    if (!replyContent.trim() || !user || !currentAnnouncement) return;

    try {
      const commentData = {
        content: replyContent.trim(),
        authorId: user.id,
        announcementId: currentAnnouncement.id,
        parentCommentId
      };

      await announcementCommentApi.createComment(commentData);
      await loadComments();
      await loadActivities();
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) return;

    try {
      await announcementCommentApi.toggleLike(commentId, user.id);
      await loadComments();
      await loadActivities();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'READ': return <Eye className="h-4 w-4" />;
      case 'acknowledged': case 'ACKNOWLEDGED': return <CheckCircle className="h-4 w-4" />;
      case 'commented': case 'COMMENTED': return <MessageCircle className="h-4 w-4" />;
      case 'liked': case 'LIKED': return <Heart className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'read': case 'READ': return 'text-blue-600';
      case 'acknowledged': case 'ACKNOWLEDGED': return 'text-green-600';
      case 'commented': case 'COMMENTED': return 'text-purple-600';
      case 'liked': case 'LIKED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !currentAnnouncement) {
    return (
      <div className="p-8">
        <div className="alert alert-error">
          <AlertTriangle className="h-6 w-6" />
          <span>{error || 'Announcement not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/app/announcements')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Announcements
        </button>
      </div>

      {/* Announcement Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentAnnouncement.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{currentAnnouncement.creatorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(currentAnnouncement.createdAt).toLocaleDateString()}</span>
              </div>
              {currentAnnouncement.tags && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{currentAnnouncement.tags}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentAnnouncement.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
              currentAnnouncement.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
              currentAnnouncement.priority === 'NORMAL' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentAnnouncement.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentAnnouncement.type === 'EMERGENCY' ? 'bg-red-100 text-red-800' :
              currentAnnouncement.type === 'ACADEMIC' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentAnnouncement.type}
            </span>
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{currentAnnouncement.content}</p>
        </div>

        {/* Actions */}
        {currentAnnouncement.acknowledgmentRequired && !currentAnnouncement.isAcknowledged && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleAcknowledge}
              disabled={acknowledgingAnnouncement}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {acknowledgingAnnouncement ? 'Acknowledging...' : 'Acknowledge'}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {/* Comments tab - always visible */}
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Comments
            </button>

            {/* Activity tab - only for creator */}
            {isCreator && (
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Activity className="h-4 w-4 inline mr-2" />
                Activity
              </button>
            )}

            {/* Analytics tab - only for creator */}
            {isCreator && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Analytics
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add Comment */}
              {currentAnnouncement.commentsEnabled && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-4 w-4" />
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Table */}
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : !currentAnnouncement.commentsEnabled ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Comments are disabled for this announcement.</p>
                </div>
              ) : comments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Author</th>
                        <th>Comment</th>
                        <th>Likes</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.map((comment) => (
                        <tr key={comment.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {comment.authorName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{comment.authorName}</div>
                                <div className="text-sm text-gray-500">{comment.authorRole}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="max-w-md">
                              <p className="text-gray-700">{comment.content}</p>
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="py-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{reply.authorName}</span>
                                        <span className="text-xs text-gray-500">{formatRelativeTime(reply.createdAt)}</span>
                                      </div>
                                      <p className="text-sm text-gray-700">{reply.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <Heart className={`h-4 w-4 ${comment.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                              <span className="text-sm">{comment.likes}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatRelativeTime(comment.createdAt)}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLikeComment(comment.id)}
                                className="btn btn-ghost btn-sm"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setReplyingTo(comment.id)}
                                className="btn btn-ghost btn-sm"
                              >
                                <Reply className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}

              {/* Reply Modal */}
              {replyingTo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Reply to Comment</h3>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddReply(replyingTo)}
                        disabled={!replyContent.trim()}
                        className="btn btn-primary"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab - Only for creator */}
          {activeTab === 'activity' && isCreator && (
            <div className="space-y-4">
              {loadingActivities ? (
                <div className="flex justify-center py-8">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : activities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Activity</th>
                        <th>Details</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {activity.userName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{activity.userName}</div>
                                <div className="text-sm text-gray-500">{activity.userRole}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className={`flex items-center gap-2 ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                              <span className="capitalize">{activity.type.toLowerCase()}</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm text-gray-600">{activity.details || '-'}</span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatRelativeTime(activity.timestamp)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activity yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab - Only for creator */}
          {activeTab === 'analytics' && isCreator && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Views</p>
                      <p className="text-2xl font-bold text-blue-600">{currentAnnouncement.readCount || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Acknowledged</p>
                      <p className="text-2xl font-bold text-green-600">{currentAnnouncement.acknowledgmentCount || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="text-2xl font-bold text-purple-600">{comments.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {currentAnnouncement.readCount ? 
                          Math.round(((currentAnnouncement.acknowledgmentCount || 0) / currentAnnouncement.readCount) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Read Rate</span>
                    <span className="text-sm font-medium">
                      {currentAnnouncement.readCount || 0} reads
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Acknowledgment Rate</span>
                    <span className="text-sm font-medium">
                      {currentAnnouncement.readCount ? 
                        Math.round(((currentAnnouncement.acknowledgmentCount || 0) / currentAnnouncement.readCount) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Comment Engagement</span>
                    <span className="text-sm font-medium">
                      {comments.length} comments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Access Denied Message for non-creators trying to access restricted tabs */}
          {(activeTab === 'activity' || activeTab === 'analytics') && !isCreator && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Access Restricted</h3>
                <p className="text-yellow-700">
                  Only the announcement creator can view {activeTab} information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails; 