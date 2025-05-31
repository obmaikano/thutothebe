import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurricula, clearCurriculumError, approveCurriculum } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { Search, CheckCircle, XCircle, Clock, Eye, FileText, User, Calendar } from 'lucide-react';

const CurriculumApprovalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeLevelFilter, setGradeLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('UNDER_REVIEW');

  useEffect(() => {
    dispatch(fetchCurricula());
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch]);

  const handleApprove = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Approve Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_APPROVE,
      extraObject: { curriculum },
      size: 'lg'
    }));
  };

  const handleReject = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Reject Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION, // We'll need to create specific reject modal
      extraObject: { curriculum, action: 'reject' }
    }));
  };

  const handleView = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Review Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_VIEW,
      extraObject: { curriculum },
      size: 'lg'
    }));
  };

  const canApproveCurriculum = user && [
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const canViewApprovalQueue = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  // Filter curricula based on approval status and user permissions
  const approvalCurricula = curricula.filter((curriculum: Curriculum) => {
    // Filter by status
    const matchesStatus = statusFilter === '' || curriculum.status === statusFilter;
    
    // Filter by search term
    const matchesSearch = 
      curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curriculum.description && curriculum.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = 
      typeFilter === '' || curriculum.curriculumType === typeFilter;

    const matchesGradeLevel = 
      gradeLevelFilter === '' || curriculum.gradeLevel === gradeLevelFilter;

    // Check user permissions for viewing
    let hasPermission = false;
    if (user) {
      // Super admin can see all
      if (user.role === 'SUPER_ADMIN') {
        hasPermission = true;
      }
      // Ministry staff can see national curricula
      else if (['MINISTRY_STAFF', 'MINISTRY_EXECUTIVE', 'DIRECTOR'].includes(user.role)) {
        hasPermission = curriculum.curriculumType === 'NATIONAL' || !curriculum.regionId;
      }
      // Regional admin can see regional and school curricula in their region
      else if (user.role === 'REGIONAL_ADMIN') {
        hasPermission = curriculum.regionId === user.regionId || curriculum.curriculumType === 'REGIONAL';
      }
      // School admin can see their school curricula
      else if (user.role === 'SCHOOL_ADMIN') {
        hasPermission = curriculum.schoolId === user.schoolId;
      }
    }

    return matchesStatus && matchesSearch && matchesType && matchesGradeLevel && hasPermission;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800', label: 'Draft', icon: FileText },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review', icon: Clock },
      'APPROVED': { color: 'bg-green-100 text-green-800', label: 'Approved', icon: CheckCircle },
      'ACTIVE': { color: 'bg-blue-100 text-blue-800', label: 'Active', icon: CheckCircle },
      'SUSPENDED': { color: 'bg-red-100 text-red-800', label: 'Suspended', icon: XCircle },
      'ARCHIVED': { color: 'bg-gray-100 text-gray-800', label: 'Archived', icon: FileText }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'NATIONAL': { color: 'bg-purple-100 text-purple-800', label: 'National' },
      'REGIONAL': { color: 'bg-blue-100 text-blue-800', label: 'Regional' },
      'SCHOOL_SPECIFIC': { color: 'bg-green-100 text-green-800', label: 'School-Based' },
      'INTERNATIONAL': { color: 'bg-indigo-100 text-indigo-800', label: 'International' },
      'VOCATIONAL': { color: 'bg-orange-100 text-orange-800', label: 'Vocational' },
      'SPECIAL_NEEDS': { color: 'bg-pink-100 text-pink-800', label: 'Special Needs' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.NATIONAL;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityLevel = (curriculum: Curriculum) => {
    // Determine priority based on type and creation date
    if (curriculum.curriculumType === 'NATIONAL') return 'High';
    if (curriculum.curriculumType === 'REGIONAL') return 'Medium';
    return 'Normal';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'High': { color: 'bg-red-100 text-red-800' },
      'Medium': { color: 'bg-yellow-100 text-yellow-800' },
      'Normal': { color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.Normal;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {priority}
      </span>
    );
  };

  const getApprovalStats = () => {
    const stats = {
      pending: curricula.filter(c => c.status === 'UNDER_REVIEW').length,
      approved: curricula.filter(c => c.status === 'APPROVED').length,
      active: curricula.filter(c => c.status === 'ACTIVE').length,
      total: curricula.length
    };
    
    return stats;
  };

  const stats = getApprovalStats();

  if (!canViewApprovalQueue) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You don't have permission to view the curriculum approval queue.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Approval</h1>
          <p className="text-gray-600 mt-2">Review and approve curriculum submissions</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search curricula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="NATIONAL">National</option>
            <option value="REGIONAL">Regional</option>
            <option value="SCHOOL_SPECIFIC">School-Based</option>
            <option value="INTERNATIONAL">International</option>
            <option value="VOCATIONAL">Vocational</option>
            <option value="SPECIAL_NEEDS">Special Needs</option>
          </select>

          {/* Grade Level Filter */}
          <select
            value={gradeLevelFilter}
            onChange={(e) => setGradeLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Grades</option>
            <option value="PRE_KINDERGARTEN">Pre-Kindergarten</option>
            <option value="KINDERGARTEN">Kindergarten</option>
            <option value="STANDARD_1">Standard 1</option>
            <option value="STANDARD_2">Standard 2</option>
            <option value="STANDARD_3">Standard 3</option>
            <option value="STANDARD_4">Standard 4</option>
            <option value="STANDARD_5">Standard 5</option>
            <option value="STANDARD_6">Standard 6</option>
            <option value="STANDARD_7">Standard 7</option>
            <option value="FORM_1">Form 1</option>
            <option value="FORM_2">Form 2</option>
            <option value="FORM_3">Form 3</option>
            <option value="FORM_4">Form 4</option>
            <option value="FORM_5">Form 5</option>
            <option value="FORM_6">Form 6</option>
          </select>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Approval Queue ({approvalCurricula.length})
          </h2>
        </div>

        {approvalCurricula.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curriculum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvalCurricula.map((curriculum) => (
                  <tr key={curriculum.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{curriculum.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{curriculum.description}</div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          {curriculum.createdByName || `User ${curriculum.createdById}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getTypeBadge(curriculum.curriculumType)}
                        <div className="text-sm text-gray-900">
                          {curriculum.gradeLevel.replace('_', ' ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(curriculum.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(getPriorityLevel(curriculum))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(curriculum.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(curriculum)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Review Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canApproveCurriculum && curriculum.status === 'UNDER_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleApprove(curriculum)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(curriculum)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Curricula Found</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter || gradeLevelFilter || statusFilter
                ? 'No curricula match your current filters.'
                : 'No curricula are available for review.'}
            </p>
            {(searchTerm || typeFilter || gradeLevelFilter || statusFilter) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                  setGradeLevelFilter('');
                  setStatusFilter('');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumApprovalPage; 