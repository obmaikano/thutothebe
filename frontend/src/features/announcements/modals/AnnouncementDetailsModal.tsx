import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { markAnnouncementAsRead, acknowledgeAnnouncement } from '../announcementsSlice';
import { closeModal } from '../../common/modalSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Calendar, 
  User, 
  Eye, 
  CheckCircle, 
  Tag, 
  Clock,
  AlertTriangle,
  MessageSquare,
  Paperclip,
  Send,
  Reply,
  Heart,
  MoreVertical
} from 'lucide-react';
import { Announcement } from '../../../api/services/announcementApi';

interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorRole: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface AnnouncementDetailsModalProps {
  extraObject?: Announcement;
}

const AnnouncementDetailsModal: React.FC<AnnouncementDetailsModalProps> = ({ extraObject: announcement }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { status } = useAppSelector(state => state.announcements);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    // Mark as read when modal opens
    if (user?.id && announcement && !announcement.isRead) {
      dispatch(markAnnouncementAsRead({ announcementId: announcement.id, userId: user.id }));
    }

    // Load comments if comments are enabled
    if (announcement?.commentsEnabled) {
      loadComments();
    }
  }, [dispatch, user?.id, announcement?.id, announcement?.isRead, announcement?.commentsEnabled]);

  const loadComments = async () => {
    if (!announcement?.id) return;
    
    setLoadingComments(true);
    try {
      // This would be an API call to fetch comments
      // For now, using mock data
      const mockComments: Comment[] = [
        {
          id: 1,
          content: "Thank you for this important announcement. This will help us prepare better for the upcoming changes.",
          authorId: 101,
          authorName: "John Smith",
          authorRole: "TEACHER",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: 2,
              content: "I agree! This is very helpful information.",
              authorId: 102,
              authorName: "Mary Johnson",
              authorRole: "TEACHER",
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              likes: 1,
              isLiked: true
            }
          ]
        },
        {
          id: 3,
          content: "Could you provide more details about the implementation timeline?",
          authorId: 103,
          authorName: "David Wilson",
          authorRole: "DEPARTMENT_HEAD",
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          likes: 2,
          isLiked: false
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAcknowledge = () => {
    if (user?.id && announcement) {
      dispatch(acknowledgeAnnouncement({ 
        announcementId: announcement.id, 
        userId: user.id 
      }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !announcement) return;

    const comment: Comment = {
      id: Date.now(),
      content: newComment.trim(),
      authorId: user.id,
      authorName: user.firstName + ' ' + user.lastName,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleAddReply = async (parentId: number) => {
    if (!replyContent.trim() || !user) return;

    const reply: Comment = {
      id: Date.now(),
      content: replyContent.trim(),
      authorId: user.id,
      authorName: user.firstName + ' ' + user.lastName,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId: number, isReply: boolean = false, parentId?: number) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies?.map(reply => 
                reply.id === commentId
                  ? { 
                      ...reply, 
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      isLiked: !reply.isLiked 
                    }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(prev => prev.map(comment => 
        comment.id === commentId
          ? { 
              ...comment, 
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked 
            }
          : comment
      ));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'NORMAL': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'LOW': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'text-red-600 bg-red-100 border-red-200';
      case 'URGENT': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'ACADEMIC': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'ADMINISTRATIVE': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'EVENT': return 'text-green-600 bg-green-100 border-green-200';
      case 'HOLIDAY': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'EXAM': return 'text-indigo-600 bg-indigo-100 border-indigo-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRoleDisplayName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (!announcement) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcement Data</h3>
        <p className="text-gray-600 mb-4">No announcement information was provided.</p>
        <button
          onClick={() => dispatch(closeModal({}))}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{announcement.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{announcement.creatorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
              {announcement.readCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{announcement.readCount} reads</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(announcement.priority)}`}>
              {announcement.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(announcement.type)}`}>
              {announcement.type}
            </span>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-4 mb-4">
          {announcement.isRead && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <Eye className="h-4 w-4" />
              Read
            </span>
          )}
          {announcement.isAcknowledged && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              Acknowledged
            </span>
          )}
          {announcement.acknowledgmentRequired && !announcement.isAcknowledged && (
            <span className="flex items-center gap-1 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Acknowledgment Required
            </span>
          )}
        </div>

        {/* Expiration warning */}
        {announcement.endDate && new Date(announcement.endDate) > new Date() && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                This announcement expires on {formatDate(announcement.endDate)}
              </span>
            </div>
          </div>
        )}

        {announcement.endDate && new Date(announcement.endDate) <= new Date() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                This announcement expired on {formatDate(announcement.endDate)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {announcement.content}
          </div>
        </div>
      </div>

      {/* Tags */}
      {announcement.tags && announcement.tags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {announcement.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {announcement.attachmentUrls && announcement.attachmentUrls.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Attachments</span>
          </div>
          <div className="space-y-2">
            {announcement.attachmentUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Paperclip className="h-3 w-3" />
                Attachment {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      {(announcement.readCount !== undefined || announcement.acknowledgmentCount !== undefined) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {announcement.readCount !== undefined && (
              <div>
                <span className="text-gray-600">Total Reads:</span>
                <span className="ml-2 font-medium">{announcement.readCount}</span>
              </div>
            )}
            {announcement.acknowledgmentRequired && announcement.acknowledgmentCount !== undefined && (
              <div>
                <span className="text-gray-600">Acknowledged:</span>
                <span className="ml-2 font-medium">{announcement.acknowledgmentCount}</span>
              </div>
            )}
            {announcement.targetUserCount !== undefined && (
              <div>
                <span className="text-gray-600">Target Audience:</span>
                <span className="ml-2 font-medium">{announcement.targetUserCount}</span>
              </div>
            )}
            {announcement.commentsEnabled && (
              <div>
                <span className="text-gray-600">Comments:</span>
                <span className="ml-2 font-medium">{comments.length}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments section */}
      {announcement.commentsEnabled && (
        <div className="mb-6 border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-medium text-gray-700">
                Comments ({comments.length})
              </span>
            </div>

            {/* Add new comment */}
            <div className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments list */}
          <div className="max-h-96 overflow-y-auto">
            {loadingComments ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <span className="text-sm text-gray-600 mt-2">Loading comments...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4">
                    {/* Comment header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{comment.authorName}</span>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                              {getRoleDisplayName(comment.authorRole)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Comment content */}
                    <div className="ml-10 mb-3">
                      <p className="text-gray-700">{comment.content}</p>
                    </div>

                    {/* Comment actions */}
                    <div className="ml-10 flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-sm ${
                          comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </button>
                    </div>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="ml-10 mt-3 space-y-2">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            disabled={!replyContent.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                            className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-10 mt-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <User className="h-3 w-3 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 text-sm">{reply.authorName}</span>
                                    <span className="text-xs text-gray-500 px-1 py-0.5 bg-gray-100 rounded">
                                      {getRoleDisplayName(reply.authorRole)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">{formatRelativeTime(reply.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-8 mb-2">
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                            </div>
                            <div className="ml-8 flex items-center gap-4">
                              <button
                                onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                className={`flex items-center gap-1 text-xs ${
                                  reply.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                                }`}
                              >
                                <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                {reply.likes > 0 && <span>{reply.likes}</span>}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          {announcement.acknowledgmentRequired && !announcement.isAcknowledged && (
            <button
              onClick={handleAcknowledge}
              disabled={status === 'loading'}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {status === 'loading' ? 'Acknowledging...' : 'Acknowledge'}
            </button>
          )}
        </div>
        
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

export default AnnouncementDetailsModal; 