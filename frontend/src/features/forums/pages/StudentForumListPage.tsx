import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchForums, clearForumsError } from '../forumsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Forum } from '../../../api/services/forumApi';
import { MessageSquare, Search, Users, Calendar, BookOpen, Eye, MessageCircle } from 'lucide-react';

const StudentForumListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { forums, status, error } = useAppSelector(state => state.forums);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    dispatch(fetchForums());
    return () => {
      dispatch(clearForumsError());
    };
  }, [dispatch]);

  const handleViewForum = (forum: Forum) => {
    window.location.href = `/app/forums/${forum.id}`;
  };

  // Filter forums to show only those accessible to the student
  const filteredForums = forums.filter((forum: Forum) => {
    const matchesSearch = 
      forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (forum.description && forum.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCourse = 
      courseFilter === '' || forum.courseId?.toString() === courseFilter;

    // Only show active forums
    return matchesSearch && matchesCourse && forum.active;
  });

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
          <p className="text-gray-600 mt-2">Participate in course discussions and connect with classmates</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearForumsError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search forums by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {/* Course options would be populated from student's enrolled courses */}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {filteredForums.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <MessageSquare size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredForums.length}</div>
                <div className="text-sm text-gray-500">Available Forums</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredForums.filter(forum => forum.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Forums</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forums List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredForums.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Forums Available</h3>
            <p className="text-gray-500">
              {searchTerm || courseFilter 
                ? "No forums match your current filters. Try adjusting your search criteria."
                : "There are no discussion forums available for your courses yet."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredForums.map((forum: Forum) => (
                  <tr key={forum.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <MessageSquare size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{forum.title}</div>
                          {forum.description && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {forum.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Course {forum.courseId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        forum.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {forum.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewForum(forum)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="View Forum"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentForumListPage; 