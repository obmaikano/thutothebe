import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchThreadByIdWithComments } from '../../../features/forums/threadsSlice';
import { fetchCommentsByThreadId } from '../../../features/forums/commentsSlice';
import { openModal } from '../../../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import TitleCard from '../../../components/Cards/TitleCard';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  User, 
  Clock, 
  Reply, 
  Edit, 
  ArrowLeft,
  Pin,
  Eye
} from 'lucide-react';

const ThreadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentThread, status: threadStatus } = useAppSelector((state) => state.threads);
  const { comments, status: commentsStatus } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);
  
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const threadLoading = threadStatus === 'loading';
  const commentsLoading = commentsStatus === 'loading';

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadByIdWithComments(parseInt(id)));
      dispatch(fetchCommentsByThreadId(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleAddComment = () => {
    dispatch(openModal({
      title: 'Add Comment',
      bodyType: MODAL_BODY_TYPES.COMMENT_ADD_NEW,
      extraObject: { threadId: parseInt(id!) }
    }));
  };

  const handleReplyToComment = (commentId: number) => {
    dispatch(openModal({
      title: 'Reply to Comment',
      bodyType: MODAL_BODY_TYPES.COMMENT_REPLY,
      extraObject: { 
        threadId: parseInt(id!), 
        parentId: commentId 
      }
    }));
  };

  const handleEditThread = () => {
    if (currentThread) {
      dispatch(openModal({
        title: 'Edit Thread',
        bodyType: MODAL_BODY_TYPES.THREAD_EDIT,
        extraObject: currentThread
      }));
    }
  };

  const handleBackToForum = () => {
    if (currentThread) {
      navigate(`/app/forum-detail/${currentThread.forumId}`);
    } else {
      navigate('/app/forum-list');
    }
  };

  const canEditThread = user && currentThread && (
    user.id === currentThread.authorId || 
    ['TEACHER', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role)
  );

  if (threadLoading || !currentThread) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleBackToForum}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </button>
      </div>

      {/* Thread Header */}
      <div className="bg-base-100 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {currentThread.pinned && (
                <span className="badge badge-warning badge-sm">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </span>
              )}
              <span className={`badge ${currentThread.active ? 'badge-success' : 'badge-error'} badge-sm`}>
                {currentThread.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">{currentThread.title}</h1>
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Author ID: {currentThread.authorId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {currentThread.lastActivityAt 
                    ? formatDistanceToNow(new Date(currentThread.lastActivityAt)) + ' ago'
                    : 'No recent activity'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {canEditThread && (
              <button
                onClick={handleEditThread}
                className="btn btn-outline btn-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={handleAddComment}
              className="btn btn-primary btn-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Add Comment
            </button>
          </div>
        </div>
        
        {/* Thread Content */}
        <div className="prose max-w-none">
          <div className="bg-base-200 rounded-lg p-4">
            <p className="text-base-content whitespace-pre-wrap">{currentThread.content}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <TitleCard title={`Comments (${comments.length})`} topMargin="mt-0">
        {commentsLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
            <button
              onClick={handleAddComment}
              className="btn btn-primary btn-sm mt-4"
            >
              Add First Comment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-base-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">U</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Author ID: {comment.authorId}</div>
                      <div className="text-xs text-base-content/70">
                        {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt))} ago
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge ${comment.active ? 'badge-success' : 'badge-error'} badge-xs`}>
                      {comment.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-base-content whitespace-pre-wrap">{comment.content}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-xs text-base-content/70">
                    {/* Like/dislike functionality would be implemented here */}
                  </div>
                  <button
                    onClick={() => handleReplyToComment(comment.id)}
                    className="btn btn-ghost btn-xs"
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Reply
                  </button>
                </div>
                
                {/* Nested replies would go here if we implement them */}
                {comment.parentId && (
                  <div className="ml-6 mt-3 pl-4 border-l-2 border-base-300">
                    <div className="text-xs text-base-content/50">
                      Reply to comment #{comment.parentId}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </TitleCard>
    </div>
  );
};

export default ThreadDetailPage; 