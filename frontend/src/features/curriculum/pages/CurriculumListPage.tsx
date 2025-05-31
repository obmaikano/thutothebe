import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurricula, clearCurriculumError, activateCurriculum, suspendCurriculum, deleteCurriculum, approveCurriculum } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { Plus, Search, BookOpen, Edit, Trash2, Eye, CheckCircle, XCircle, Archive, Copy, Play, Pause } from 'lucide-react';

const CurriculumListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [gradeLevelFilter, setGradeLevelFilter] = useState('');

  useEffect(() => {
    dispatch(fetchCurricula());
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch]);

  const handleCreateCurriculum = () => {
    dispatch(openModal({
      title: 'Create New Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEdit = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Edit Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_EDIT,
      extraObject: { curriculum },
      size: 'lg'
    }));
  };

  const handleView = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'View Curriculum Details',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_VIEW,
      extraObject: { curriculum },
      size: 'lg'
    }));
  };

  const handleDelete = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Delete Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION,
      extraObject: { curriculum }
    }));
  };

  const handleApprove = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Approve Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_APPROVE,
      extraObject: { curriculum }
    }));
  };

  const handleDuplicate = (curriculum: Curriculum) => {
    dispatch(openModal({
      title: 'Duplicate Curriculum',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DUPLICATE,
      extraObject: { curriculum }
    }));
  };

  const handleToggleStatus = async (curriculum: Curriculum) => {
    try {
      if (curriculum.active) {
        await dispatch(suspendCurriculum(curriculum.id)).unwrap();
      } else {
        await dispatch(activateCurriculum(curriculum.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle curriculum status:', error);
    }
  };

  const handleRowClick = (curriculum: Curriculum, event: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/app/curriculum/${curriculum.id}`);
  };

  const canCreateCurriculum = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const canApproveCurriculum = user && [
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const canEditCurriculum = (curriculum: Curriculum) => {
    if (!user) return false;
    
    // Check if user is the creator
    if (curriculum.createdById === user.id) return true;
    
    // Check role-based permissions
    const editorRoles = ['MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'];
    if (!editorRoles.includes(user.role)) return false;
    
    // Check scope permissions
    if (curriculum.curriculumType === 'NATIONAL' && !['MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role)) return false;
    if (curriculum.regionId && user.regionId !== curriculum.regionId) return false;
    if (curriculum.schoolId && user.schoolId !== curriculum.schoolId) return false;
    
    return true;
  };

  const filteredCurricula = curricula.filter((curriculum: Curriculum) => {
    const matchesSearch = 
      curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curriculum.description && curriculum.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      curriculum.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curriculum.curriculumType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === '' || curriculum.status === statusFilter;

    const matchesType = 
      typeFilter === '' || curriculum.curriculumType === typeFilter;

    const matchesGradeLevel = 
      gradeLevelFilter === '' || curriculum.gradeLevel === gradeLevelFilter;

    return matchesSearch && matchesStatus && matchesType && matchesGradeLevel;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'APPROVED': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'ACTIVE': { color: 'bg-blue-100 text-blue-800', label: 'Active' },
      'SUSPENDED': { color: 'bg-orange-100 text-orange-800', label: 'Suspended' },
      'ARCHIVED': { color: 'bg-red-100 text-red-800', label: 'Archived' },
      'DEPRECATED': { color: 'bg-gray-100 text-gray-800', label: 'Deprecated' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'NATIONAL': { color: 'bg-purple-100 text-purple-800', label: 'National' },
      'REGIONAL': { color: 'bg-blue-100 text-blue-800', label: 'Regional' },
      'SCHOOL_BASED': { color: 'bg-green-100 text-green-800', label: 'School-Based' },
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

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (status === 'failed' && error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error Loading Curricula</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => dispatch(fetchCurricula())}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-600 mt-2">Design and manage educational curricula and learning standards</p>
        </div>
        {canCreateCurriculum && (
          <button 
            onClick={handleCreateCurriculum} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create New Curriculum
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearCurriculumError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search curricula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="ARCHIVED">Archived</option>
            <option value="DEPRECATED">Deprecated</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="NATIONAL">National</option>
            <option value="REGIONAL">Regional</option>
            <option value="SCHOOL_BASED">School-Based</option>
            <option value="INTERNATIONAL">International</option>
            <option value="VOCATIONAL">Vocational</option>
            <option value="SPECIAL_NEEDS">Special Needs</option>
          </select>
          <select 
            value={gradeLevelFilter}
            onChange={(e) => setGradeLevelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grade Levels</option>
            <option value="GRADE_1">Grade 1</option>
            <option value="GRADE_2">Grade 2</option>
            <option value="GRADE_3">Grade 3</option>
            <option value="GRADE_4">Grade 4</option>
            <option value="GRADE_5">Grade 5</option>
            <option value="GRADE_6">Grade 6</option>
            <option value="GRADE_7">Grade 7</option>
            <option value="GRADE_8">Grade 8</option>
            <option value="GRADE_9">Grade 9</option>
            <option value="GRADE_10">Grade 10</option>
            <option value="GRADE_11">Grade 11</option>
            <option value="GRADE_12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {curricula.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{curricula.length}</div>
                <div className="text-sm text-gray-500">Total Curricula</div>
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
                  {curricula.filter((c: Curriculum) => c.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {curricula.filter((c: Curriculum) => c.status === 'UNDER_REVIEW').length}
                </div>
                <div className="text-sm text-gray-500">Under Review</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {curricula.filter((c: Curriculum) => c.status === 'ACTIVE').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {curricula.filter((c: Curriculum) => c.status === 'SUSPENDED').length}
                </div>
                <div className="text-sm text-gray-500">Suspended</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curricula Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curriculum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCurricula.map((curriculum: Curriculum) => (
                <tr 
                  key={curriculum.id} 
                  className="hover:bg-blue-50 hover:shadow-sm cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                  onClick={(event) => handleRowClick(curriculum, event)}
                  title="Click to view curriculum details"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {curriculum.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {curriculum.description ? curriculum.description.substring(0, 50) + '...' : 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(curriculum.curriculumType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {curriculum.gradeLevel.replace('GRADE_', 'Grade ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {curriculum.academicYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(curriculum.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {curriculum.createdByName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleView(curriculum);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {canEditCurriculum(curriculum) && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(curriculum);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {canApproveCurriculum && curriculum.status === 'UNDER_REVIEW' && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleApprove(curriculum);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDuplicate(curriculum);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      {canEditCurriculum(curriculum) && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleToggleStatus(curriculum);
                          }}
                          className={curriculum.active ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                          title={curriculum.active ? "Suspend" : "Activate"}
                        >
                          {curriculum.active ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      )}
                      {canEditCurriculum(curriculum) && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(curriculum);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCurricula.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No curricula found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter || typeFilter || gradeLevelFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating a new curriculum.'}
              </p>
              {canCreateCurriculum && !searchTerm && !statusFilter && !typeFilter && !gradeLevelFilter && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateCurriculum}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create New Curriculum
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumListPage; 