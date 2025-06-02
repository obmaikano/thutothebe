import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurriculumById, clearCurriculumError, activateCurriculum, suspendCurriculum, deleteCurriculum, approveCurriculum } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import curriculumApi from '../../../api/services/curriculumApi';
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
  Archive,
  BarChart3,
  TrendingUp,
  FolderOpen,
  Target,
  Users,
  Award,
  Download,
  Share2,
  Settings,
  Eye,
  Globe,
  Building,
  GraduationCap,
  BookMarked,
  Activity,
  Star
} from 'lucide-react';

// Tab components
import CurriculumAnalyticsTab from '../components/CurriculumAnalyticsTab';
import CurriculumProgressTab from '../components/CurriculumProgressTab';
import CurriculumResourcesTab from '../components/CurriculumResourcesTab';
import CurriculumSubjectsTab from '../components/CurriculumSubjectsTab';
import CurriculumUnitsTab from '../components/CurriculumUnitsTab';
import CurriculumRecommendationsTab from '../components/CurriculumRecommendationsTab';
import CurriculumWorkflowControls from '../components/CurriculumWorkflowControls';
import CurriculumWorkflowStatus from '../components/CurriculumWorkflowStatus';

const CurriculumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCurriculum, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

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
        extraObject: currentCurriculum,
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

  const handleExport = async () => {
    if (!currentCurriculum) return;
    
    try {
      // Try to use the backend export endpoint first
      try {
        const response = await curriculumApi.export(currentCurriculum.id);
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `curriculum-${currentCurriculum.title}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('Curriculum exported successfully');
        return;
      } catch (exportError: any) {
        // If backend export fails, fall back to client-side export
        console.warn('Backend export failed, using client-side export:', exportError);
      }
      
      // Fallback: Client-side export
      const exportData = {
        curriculum: currentCurriculum,
        exportedAt: new Date().toISOString(),
        exportedBy: user?.name || 'Unknown User',
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `curriculum-${currentCurriculum.title}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      console.log('Curriculum exported successfully (client-side)');
    } catch (error) {
      console.error('Failed to export curriculum:', error);
      alert('Failed to export curriculum. Please try again.');
    }
  };

  const handleShare = () => {
    if (!currentCurriculum) return;
    
    const shareData = {
      title: currentCurriculum.title,
      text: `Check out this curriculum: ${currentCurriculum.title}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Curriculum link copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  };

  const canEditCurriculum = (curriculum: Curriculum) => {
    if (!user) return false;
    
    if (curriculum.createdById === user.id) return true;
    
    const editorRoles = ['MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'];
    if (!editorRoles.includes(user.role)) return false;
    
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

  const canViewAnalytics = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Draft', icon: FileText },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Under Review', icon: AlertCircle },
      'APPROVED': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Approved', icon: CheckCircle },
      'ACTIVE': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Active', icon: Activity },
      'SUSPENDED': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Suspended', icon: Pause },
      'ARCHIVED': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Archived', icon: Archive },
      'DEPRECATED': { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Deprecated', icon: Archive }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        <IconComponent size={14} className="mr-1.5" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'NATIONAL': { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'National', icon: Globe },
      'REGIONAL': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Regional', icon: MapPin },
      'SCHOOL_BASED': { color: 'bg-green-100 text-green-800 border-green-200', label: 'School-Based', icon: School },
      'INTERNATIONAL': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'International', icon: Globe },
      'VOCATIONAL': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Vocational', icon: Building },
      'SPECIAL_NEEDS': { color: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Special Needs', icon: Users }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.NATIONAL;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        <IconComponent size={14} className="mr-1.5" />
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, requiresPermission: canViewAnalytics },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'units', label: 'Units', icon: BookMarked },
    { id: 'recommendations', label: 'Recommendations', icon: Star },
    { id: 'standards', label: 'Standards', icon: Target },
    { id: 'objectives', label: 'Objectives', icon: Award },
    { id: 'subjects', label: 'Subjects', icon: Users }
  ].filter(tab => !tab.requiresPermission || tab.requiresPermission);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading curriculum details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Curriculum</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => dispatch(clearCurriculumError())}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Dismiss
              </button>
              <button
                onClick={() => id && dispatch(fetchCurriculumById(parseInt(id)))}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCurriculum) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Curriculum Not Found</h3>
            <p className="text-gray-600 mb-6">
              The curriculum you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/app/curriculum')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Curricula
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <CurriculumAnalyticsTab curriculumId={currentCurriculum.id} />;
      case 'progress':
        return <CurriculumProgressTab curriculumId={currentCurriculum.id} />;
      case 'resources':
        return <CurriculumResourcesTab curriculumId={currentCurriculum.id} />;
      case 'units':
        return <CurriculumUnitsTab curriculumId={currentCurriculum.id} />;
      case 'recommendations':
        return <CurriculumRecommendationsTab curriculumId={currentCurriculum.id} />;
      case 'standards':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Management</h3>
            <p className="text-gray-600 mb-6">Curriculum standards management coming soon.</p>
            <button
              onClick={() => navigate(`/app/curriculum/${currentCurriculum.id}/standards`)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Go to Standards Page
            </button>
          </div>
        );
      case 'objectives':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Objectives</h3>
            <p className="text-gray-600 mb-6">Learning objectives management coming soon.</p>
            <button
              onClick={() => navigate(`/app/curriculum/${currentCurriculum.id}/objectives`)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Go to Objectives Page
            </button>
          </div>
        );
      case 'subjects':
        return (
          <CurriculumSubjectsTab 
            curriculumId={currentCurriculum.id}
            currentSubjectIds={currentCurriculum.subjectIds || []}
            currentSubjectNames={currentCurriculum.subjectNames ? Array.from(currentCurriculum.subjectNames) : []}
            onSubjectsUpdate={(subjectIds) => {
              // Update the current curriculum state when subjects change
              if (currentCurriculum) {
                // This would ideally trigger a refresh of the curriculum data
                dispatch(fetchCurriculumById(currentCurriculum.id));
              }
            }}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Header with Workflow Status and Controls */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BookMarked className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentCurriculum.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {currentCurriculum.gradeLevel.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Academic Year {currentCurriculum.academicYear}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {getTypeBadge(currentCurriculum.curriculumType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Status */}
                  <CurriculumWorkflowStatus 
                    curriculum={currentCurriculum} 
                    variant="compact"
                    showNextActions={true}
                  />
                </div>

                {/* Workflow Controls */}
                <div className="flex flex-col gap-4">
                  <CurriculumWorkflowControls
                    curriculum={currentCurriculum}
                    variant="expanded"
                    showLabels={true}
                    onAction={(action, curriculum) => {
                      console.log(`Action ${action} performed on curriculum ${curriculum.id}`);
                    }}
                  />
                  
                  {/* Additional Quick Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/app/curriculum-builder/${currentCurriculum.id}`)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Open in Builder
                    </button>
                    <button
                      onClick={() => navigate(`/app/curriculum/${currentCurriculum.id}/subjects`)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <BookMarked className="h-4 w-4" />
                      Manage Subjects
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentCurriculum.durationWeeks || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Weeks Duration</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <BookMarked className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentCurriculum.totalHours || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Total Hours</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentCurriculum.subjectNames?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Subjects</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      v{currentCurriculum.curriculumVersion || 1}
                    </div>
                    <div className="text-sm text-gray-500">Version</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {currentCurriculum.learningOutcomes && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 text-blue-600 mr-2" />
                      Learning Outcomes
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{currentCurriculum.learningOutcomes}</p>
                    </div>
                  </div>
                )}

                {currentCurriculum.subjectNames && currentCurriculum.subjectNames.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BookMarked className="h-5 w-5 text-blue-600 mr-2" />
                      Associated Subjects ({currentCurriculum.subjectNames.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Array.from(currentCurriculum.subjectNames).map((subject, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <BookMarked className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-blue-800 truncate" title={subject}>
                            {subject}
                          </span>
                        </div>
                      ))}
                    </div>
                    {currentCurriculum.subjectIds && currentCurriculum.subjectIds.length > 0 && (
                      <div className="mt-4 text-sm text-gray-600">
                        <strong>Subject IDs:</strong> {currentCurriculum.subjectIds.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {currentCurriculum.metadata && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Settings className="h-5 w-5 text-blue-600 mr-2" />
                      Additional Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{currentCurriculum.metadata}</pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Details</h3>
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

                <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                    <div>
                      <div className="text-sm font-medium text-gray-900">Last Updated</div>
                      <div className="text-sm text-gray-600">{new Date(currentCurriculum.modifiedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Curriculum
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Curriculum
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/curriculum')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Curriculum Details</h1>
                <p className="text-gray-600">Comprehensive curriculum management and insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {canEditCurriculum(currentCurriculum) && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
              )}
              
              {canApproveCurriculum && currentCurriculum.status === 'UNDER_REVIEW' && (
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </button>
              )}
              
              <button
                onClick={handleDuplicate}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy size={16} className="mr-2" />
                Duplicate
              </button>
              
              {canEditCurriculum(currentCurriculum) && (
                <button
                  onClick={handleToggleStatus}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentCurriculum.active 
                      ? 'text-white bg-orange-600 hover:bg-orange-700' 
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentCurriculum.active ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                  {currentCurriculum.active ? 'Suspend' : 'Activate'}
                </button>
              )}
              
              {canEditCurriculum(currentCurriculum) && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CurriculumDetailPage; 