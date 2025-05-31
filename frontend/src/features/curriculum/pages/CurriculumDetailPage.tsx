import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurriculumById, clearCurriculumError, activateCurriculum, suspendCurriculum, deleteCurriculum, approveCurriculum } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  User, 
  MapPin, 
  School, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Archive
} from 'lucide-react';

const CurriculumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCurriculum, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchCurriculumById(parseInt(id)));
    }
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    if (currentCurriculum) {
      dispatch(openModal({
        title: 'Edit Curriculum',
        bodyType: MODAL_BODY_TYPES.CURRICULUM_EDIT,
        extraObject: { curriculum: currentCurriculum },
        size: 'lg'
      }));
    }
  };

  const handleDelete = () => {
    if (currentCurriculum) {
      dispatch(openModal({
        title: 'Delete Curriculum',
        bodyType: MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION,
        extraObject: { curriculum: currentCurriculum }
      }));
    }
  };

  const handleApprove = () => {
    if (currentCurriculum) {
      dispatch(openModal({
        title: 'Approve Curriculum',
        bodyType: MODAL_BODY_TYPES.CURRICULUM_APPROVE,
        extraObject: { curriculum: currentCurriculum }
      }));
    }
  };

  const handleDuplicate = () => {
    if (currentCurriculum) {
      dispatch(openModal({
        title: 'Duplicate Curriculum',
        bodyType: MODAL_BODY_TYPES.CURRICULUM_DUPLICATE,
        extraObject: { curriculum: currentCurriculum }
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentCurriculum) return;
    
    try {
      if (currentCurriculum.active) {
        await dispatch(suspendCurriculum(currentCurriculum.id)).unwrap();
      } else {
        await dispatch(activateCurriculum(currentCurriculum.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle curriculum status:', error);
    }
  };

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

  const canApproveCurriculum = user && [
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800', label: 'Draft', icon: FileText },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review', icon: AlertCircle },
      'APPROVED': { color: 'bg-green-100 text-green-800', label: 'Approved', icon: CheckCircle },
      'PUBLISHED': { color: 'bg-blue-100 text-blue-800', label: 'Published', icon: CheckCircle },
      'ARCHIVED': { color: 'bg-red-100 text-red-800', label: 'Archived', icon: Archive },
      'SUSPENDED': { color: 'bg-orange-100 text-orange-800', label: 'Suspended', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <IconComponent size={16} className="mr-1" />
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
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
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

  if (error) {
    return (
      <div className="p-8">
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
      </div>
    );
  }

  if (!currentCurriculum) {
    return (
      <div className="p-8">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Curriculum not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The curriculum you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/app/curriculum')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
              Back to Curricula
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app/curriculum')}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Curriculum Details</h1>
            <p className="text-gray-600 mt-1">View and manage curriculum information</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {canEditCurriculum(currentCurriculum) && (
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit size={16} />
              Edit
            </button>
          )}
          
          {canApproveCurriculum && currentCurriculum.status === 'UNDER_REVIEW' && (
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
          )}
          
          <button
            onClick={handleDuplicate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Copy size={16} />
            Duplicate
          </button>
          
          {canEditCurriculum(currentCurriculum) && (
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentCurriculum.active 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {currentCurriculum.active ? <Pause size={16} /> : <Play size={16} />}
              {currentCurriculum.active ? 'Suspend' : 'Activate'}
            </button>
          )}
          
          {canEditCurriculum(currentCurriculum) && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{currentCurriculum.title}</h1>
                <p className="text-gray-600 mt-2">{currentCurriculum.description || 'No description available'}</p>
                <div className="flex items-center space-x-4 mt-4">
                  {getStatusBadge(currentCurriculum.status)}
                  {getTypeBadge(currentCurriculum.curriculumType)}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          {currentCurriculum.learningOutcomes && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Outcomes</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700">{currentCurriculum.learningOutcomes}</p>
              </div>
            </div>
          )}

          {/* Subjects */}
          {currentCurriculum.subjectNames && currentCurriculum.subjectNames.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Associated Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(currentCurriculum.subjectNames).map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {currentCurriculum.metadata && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{currentCurriculum.metadata}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Grade Level</div>
                  <div className="text-sm text-gray-600">{currentCurriculum.gradeLevel.replace('GRADE_', 'Grade ')}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Academic Year</div>
                  <div className="text-sm text-gray-600">{currentCurriculum.academicYear}</div>
                </div>
              </div>
              {currentCurriculum.durationWeeks && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Duration</div>
                    <div className="text-sm text-gray-600">{currentCurriculum.durationWeeks} weeks</div>
                  </div>
                </div>
              )}
              {currentCurriculum.totalHours && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Total Hours</div>
                    <div className="text-sm text-gray-600">{currentCurriculum.totalHours} hours</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Administrative Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Created By</div>
                  <div className="text-sm text-gray-600">{currentCurriculum.createdByName || 'Unknown'}</div>
                </div>
              </div>
              {currentCurriculum.approvedByName && (
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Approved By</div>
                    <div className="text-sm text-gray-600">{currentCurriculum.approvedByName}</div>
                  </div>
                </div>
              )}
              {currentCurriculum.regionName && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Region</div>
                    <div className="text-sm text-gray-600">{currentCurriculum.regionName}</div>
                  </div>
                </div>
              )}
              {currentCurriculum.schoolName && (
                <div className="flex items-center">
                  <School className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">School</div>
                    <div className="text-sm text-gray-600">{currentCurriculum.schoolName}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
            <div className="space-y-4">
              {currentCurriculum.effectiveDate && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Effective Date</div>
                  <div className="text-sm text-gray-600">{new Date(currentCurriculum.effectiveDate).toLocaleDateString()}</div>
                </div>
              )}
              {currentCurriculum.expiryDate && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Expiry Date</div>
                  <div className="text-sm text-gray-600">{new Date(currentCurriculum.expiryDate).toLocaleDateString()}</div>
                </div>
              )}
              {currentCurriculum.approvedAt && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Approved At</div>
                  <div className="text-sm text-gray-600">{new Date(currentCurriculum.approvedAt).toLocaleDateString()}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">Created At</div>
                <div className="text-sm text-gray-600">{new Date(currentCurriculum.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetailPage; 