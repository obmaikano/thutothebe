import React from 'react';
import { Search, Filter, Calendar, BookOpen } from 'lucide-react';

interface AssignmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  courseFilter: string;
  onCourseFilterChange: (value: string) => void;
  dueDateFilter: string;
  onDueDateFilterChange: (value: string) => void;
  courses?: Array<{ id: number; name: string; }>;
  showCourseFilter?: boolean;
}

const AssignmentFilters: React.FC<AssignmentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  courseFilter,
  onCourseFilterChange,
  dueDateFilter,
  onDueDateFilterChange,
  courses = [],
  showCourseFilter = true
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Course Filter */}
        {showCourseFilter && (
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={courseFilter}
              onChange={(e) => onCourseFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Due Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={dueDateFilter}
            onChange={(e) => onDueDateFilterChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Due Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="this_week">Due This Week</option>
            <option value="next_week">Due Next Week</option>
            <option value="this_month">Due This Month</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || statusFilter || courseFilter || dueDateFilter) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Status: {statusFilter}
                <button
                  onClick={() => onStatusFilterChange('')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {courseFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                Course: {courses.find(c => c.id.toString() === courseFilter)?.name || courseFilter}
                <button
                  onClick={() => onCourseFilterChange('')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {dueDateFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Due: {dueDateFilter.replace('_', ' ')}
                <button
                  onClick={() => onDueDateFilterChange('')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentFilters; 