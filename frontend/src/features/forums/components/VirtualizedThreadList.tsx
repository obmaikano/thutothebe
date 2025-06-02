import React, { useMemo, useCallback } from 'react';
import { Thread } from '../../../api/services/threadApi';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Pin, Lock, Eye, User, Clock } from 'lucide-react';

interface OptimizedThreadListProps {
  threads: Thread[];
  onThreadClick: (threadId: number) => void;
  onThreadEdit?: (thread: Thread) => void;
  onThreadDelete?: (thread: Thread) => void;
  onThreadPin?: (thread: Thread) => void;
  loading?: boolean;
  currentUserId?: number;
  canModerate?: boolean;
  maxHeight?: number;
}

interface ThreadItemProps {
  thread: Thread;
  onThreadClick: (threadId: number) => void;
  onThreadEdit?: (thread: Thread) => void;
  onThreadDelete?: (thread: Thread) => void;
  onThreadPin?: (thread: Thread) => void;
  currentUserId?: number;
  canModerate?: boolean;
}

const ThreadItem: React.FC<ThreadItemProps> = React.memo(({
  thread,
  onThreadClick,
  onThreadEdit,
  onThreadDelete,
  onThreadPin,
  currentUserId,
  canModerate
}) => {
  const isOwner = currentUserId === thread.authorId;
  const canEdit = isOwner || canModerate;
  const canDelete = isOwner || canModerate;
  const canPin = canModerate;

  const handleClick = useCallback(() => {
    onThreadClick(thread.id);
  }, [thread.id, onThreadClick]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onThreadEdit?.(thread);
  }, [thread, onThreadEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onThreadDelete?.(thread);
  }, [thread, onThreadDelete]);

  const handlePin = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onThreadPin?.(thread);
  }, [thread, onThreadPin]);

  return (
    <div
      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        thread.pinned ? 'bg-yellow-50 border-yellow-200' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {thread.pinned && (
              <Pin className="w-4 h-4 text-yellow-600" />
            )}
            {!thread.active && (
              <Lock className="w-4 h-4 text-gray-500" />
            )}
            <h3 className={`text-lg font-semibold truncate ${
              thread.pinned ? 'text-yellow-800' : 'text-gray-900'
            }`}>
              {thread.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author ID: {thread.authorId}</span>
            </div>
            {thread.lastActivityAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(thread.lastActivityAt))} ago</span>
              </div>
            )}
          </div>

          {thread.content && (
            <p className="text-gray-700 text-sm line-clamp-2 mb-2">
              {thread.content.substring(0, 150)}
              {thread.content.length > 150 ? '...' : ''}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>0 replies</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>0 views</span>
            </div>
            <span className={`px-2 py-1 rounded-full ${
              thread.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {thread.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {canPin && (
            <button
              onClick={handlePin}
              className={`btn btn-xs ${
                thread.pinned ? 'btn-warning' : 'btn-ghost'
              }`}
              title={thread.pinned ? 'Unpin thread' : 'Pin thread'}
            >
              <Pin className="w-3 h-3" />
            </button>
          )}
          
          {canEdit && (
            <button
              onClick={handleEdit}
              className="btn btn-xs btn-ghost"
              title="Edit thread"
            >
              Edit
            </button>
          )}
          
          {canDelete && (
            <button
              onClick={handleDelete}
              className="btn btn-xs btn-ghost text-red-600 hover:bg-red-50"
              title="Delete thread"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ThreadItem.displayName = 'ThreadItem';

const OptimizedThreadList: React.FC<OptimizedThreadListProps> = ({
  threads,
  onThreadClick,
  onThreadEdit,
  onThreadDelete,
  onThreadPin,
  loading = false,
  currentUserId,
  canModerate = false,
  maxHeight = 600
}) => {
  const memoizedThreads = useMemo(() => threads, [threads]);

  if (loading) {
    return (
      <div className="space-y-4" style={{ maxHeight }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (memoizedThreads.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center text-gray-500 py-12"
        style={{ minHeight: Math.min(maxHeight, 300) }}
      >
        <MessageSquare className="w-12 h-12 mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No threads found</h3>
        <p className="text-sm text-center">
          Be the first to start a discussion in this forum!
        </p>
      </div>
    );
  }

  return (
    <div 
      className="border border-gray-200 rounded-lg overflow-hidden overflow-y-auto"
      style={{ maxHeight }}
    >
      {memoizedThreads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          onThreadClick={onThreadClick}
          onThreadEdit={onThreadEdit}
          onThreadDelete={onThreadDelete}
          onThreadPin={onThreadPin}
          currentUserId={currentUserId}
          canModerate={canModerate}
        />
      ))}
    </div>
  );
};

export default OptimizedThreadList; 