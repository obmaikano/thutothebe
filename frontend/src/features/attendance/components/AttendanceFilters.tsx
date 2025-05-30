import React from 'react';
import { Search, Filter, Calendar, Users, BookOpen, X } from 'lucide-react';

interface AttendanceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedClass?: number | null;
  onClassChange: (classId: number | null) => void;
  selectedStatus?: string;
  onStatusChange: (status: string) => void;
  selectedType?: string;
  onTypeChange: (type: string) => void;
  startDate?: string;
  onStartDateChange: (date: string) => void;
  endDate?: string;
  onEndDateChange: (date: string) => void;
  classes?: Array<{ id: number; name: string }>;
  subjects?: Array<{ id: number; name: string }>;
  selectedSubject?: number | null;
  onSubjectChange?: (subjectId: number | null) => void;
  onClearFilters: () => void;
  className?: string;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  classes = [],
  subjects = [],
  selectedSubject,
  onSubjectChange,
  onClearFilters,
  className = ""
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PRESENT', label: 'Present' },
    { value: 'ABSENT_EXCUSED', label: 'Absent (Excused)' },
    { value: 'ABSENT_UNEXCUSED', label: 'Absent (Unexcused)' },
    { value: 'LATE', label: 'Late' },
    { value: 'EARLY_DEPARTURE', label: 'Early Departure' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'PERIOD', label: 'Period' },
    { value: 'EVENT', label: 'Event' }
  ];

  const hasActiveFilters = selectedClass || selectedStatus || selectedType || selectedSubject || startDate || endDate || searchTerm;

  return (
    <div className={`card bg-base-100 shadow-sm ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search Students</span>
            </label>
            <div className="input-group">
              <span>
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                className="input input-bordered flex-1"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Class Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Class</span>
            </label>
            <div className="input-group">
              <span>
                <Users className="w-4 h-4" />
              </span>
              <select
                className="select select-bordered flex-1"
                value={selectedClass || ''}
                onChange={(e) => onClassChange(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Filter */}
          {onSubjectChange && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <div className="input-group">
                <span>
                  <BookOpen className="w-4 h-4" />
                </span>
                <select
                  className="select select-bordered flex-1"
                  value={selectedSubject || ''}
                  onChange={(e) => onSubjectChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedStatus || ''}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Type Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedType || ''}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <div className="input-group">
              <span>
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                className="input input-bordered flex-1"
                value={startDate || ''}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <div className="input-group">
              <span>
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                className="input input-bordered flex-1"
                value={endDate || ''}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="badge badge-outline gap-2">
                  Search: {searchTerm}
                  <button
                    onClick={() => onSearchChange('')}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedClass && (
                <div className="badge badge-outline gap-2">
                  Class: {classes.find(c => c.id === selectedClass)?.name}
                  <button
                    onClick={() => onClassChange(null)}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedSubject && onSubjectChange && (
                <div className="badge badge-outline gap-2">
                  Subject: {subjects.find(s => s.id === selectedSubject)?.name}
                  <button
                    onClick={() => onSubjectChange(null)}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedStatus && (
                <div className="badge badge-outline gap-2">
                  Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
                  <button
                    onClick={() => onStatusChange('')}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedType && (
                <div className="badge badge-outline gap-2">
                  Type: {typeOptions.find(t => t.value === selectedType)?.label}
                  <button
                    onClick={() => onTypeChange('')}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {startDate && (
                <div className="badge badge-outline gap-2">
                  From: {new Date(startDate).toLocaleDateString()}
                  <button
                    onClick={() => onStartDateChange('')}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {endDate && (
                <div className="badge badge-outline gap-2">
                  To: {new Date(endDate).toLocaleDateString()}
                  <button
                    onClick={() => onEndDateChange('')}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 