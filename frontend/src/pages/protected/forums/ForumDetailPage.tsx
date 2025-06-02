import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchForumById } from '../../../features/forums/forumsSlice';
import { fetchThreadsByForumIdOrdered } from '../../../features/forums/threadsSlice';
import { openModal } from '../../../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import TitleCard from '../../../components/Cards/TitleCard';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Users, Clock, Plus, Search, Filter } from 'lucide-react';

const ForumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentForum, status: forumStatus } = useAppSelector((state) => state.forums);
  const { threads, status: threadsStatus } = useAppSelector((state) => state.threads);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'most_replies'>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const forumLoading = forumStatus === 'loading';
  const threadsLoading = threadsStatus === 'loading';

  useEffect(() => {
    if (id) {
      dispatch(fetchForumById(parseInt(id)));
      dispatch(fetchThreadsByForumIdOrdered({ 
        forumId: parseInt(id), 
        page: currentPage - 1, 
        size: 10
      }));
    }
  }, [dispatch, id, currentPage]);

  const handleCreateThread = () => {
    dispatch(openModal({
      title: 'Create New Thread',
      bodyType: MODAL_BODY_TYPES.THREAD_ADD_NEW,
      extraObject: { forumId: parseInt(id!) }
    }));
  };

  const handleEditThread = (thread: any) => {
    dispatch(openModal({
      title: 'Edit Thread',
      bodyType: MODAL_BODY_TYPES.THREAD_EDIT,
      extraObject: thread
    }));
  };

  const handleViewThread = (threadId: number) => {
    navigate(`/app/thread-detail/${threadId}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    if (id) {
      dispatch(fetchThreadsByForumIdOrdered({ 
        forumId: parseInt(id), 
        page: 0, 
        size: 10
      }));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (forumLoading || !currentForum) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Forum Header */}
      <div className="bg-base-100 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">{currentForum.title}</h1>
            <p className="text-base-content/70 mt-2">{currentForum.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateThread}
              className="btn btn-primary btn-sm"
            >
              <Plus className="w-4 h-4" />
              New Thread
            </button>
          </div>
        </div>
        
        <div className="flex gap-6 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{threads.length} threads</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Course ID: {currentForum.courseId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Status: {currentForum.active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <TitleCard title="Threads" topMargin="mt-0">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search threads..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn btn-outline"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline">
                <Filter className="w-4 h-4" />
                Sort: {sortBy === 'latest' ? 'Latest' : sortBy === 'oldest' ? 'Oldest' : 'Most Replies'}
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setSortBy('latest')}>Latest</a></li>
                <li><a onClick={() => setSortBy('oldest')}>Oldest</a></li>
                <li><a onClick={() => setSortBy('most_replies')}>Most Replies</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Threads Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Thread</th>
                <th>Author</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {threadsLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </td>
                </tr>
              ) : threads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/50">
                    No threads found
                  </td>
                </tr>
              ) : (
                threads.map((thread) => (
                  <tr key={thread.id} className="hover">
                    <td>
                      <div>
                        <div 
                          className="font-semibold text-primary cursor-pointer hover:underline"
                          onClick={() => handleViewThread(thread.id)}
                        >
                          {thread.pinned && <span className="badge badge-warning badge-xs mr-2">Pinned</span>}
                          {thread.title}
                        </div>
                        {thread.content && (
                          <div className="text-sm text-base-content/70 mt-1 line-clamp-2">
                            {thread.content.substring(0, 100)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span className="text-xs">U</span>
                          </div>
                        </div>
                        <span className="text-sm">Author ID: {thread.authorId}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${thread.active ? 'badge-success' : 'badge-error'}`}>
                        {thread.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-base-content/70">
                        {thread.lastActivityAt 
                          ? formatDistanceToNow(new Date(thread.lastActivityAt)) + ' ago'
                          : 'No activity'
                        }
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewThread(thread.id)}
                          className="btn btn-ghost btn-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditThread(thread)}
                          className="btn btn-ghost btn-xs"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple pagination placeholder */}
        {threads.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                «
              </button>
              
              <button className="join-item btn btn-sm btn-active">
                {currentPage}
              </button>
              
              <button
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                »
              </button>
            </div>
          </div>
        )}
      </TitleCard>
    </div>
  );
};

export default ForumDetailPage; 