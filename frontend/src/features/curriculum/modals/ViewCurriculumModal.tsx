import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  MapPin, 
  School, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause
} from 'lucide-react';

interface ViewCurriculumModalProps {
  extraObject: { curriculum: Curriculum };
}

const ViewCurriculumModal: React.FC<ViewCurriculumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const curriculum = extraObject?.curriculum;

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!curriculum) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">No Data</h3>
          <p className="text-red-600">No curriculum information available.</p>
          <button 
            onClick={handleClose}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Draft' },
      'UNDER_REVIEW': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Under Review' },
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      'ACTIVE': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Active' },
      'SUSPENDED': { color: 'bg-red-100 text-red-800', icon: Pause, label: 'Suspended' },
      'ARCHIVED': { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Archived' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <IconComponent className="w-4 h-4" />
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
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatGradeLevel = (gradeLevel: string) => {
    return gradeLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const parseLearningStandards = () => {
    try {
      if (curriculum.metadata) {
        const metadata = JSON.parse(curriculum.metadata);
        return metadata.learningStandards || [];
      }
    } catch (error) {
      console.error('Failed to parse metadata:', error);
    }
    return [];
  };

  const parseLearningObjectives = () => {
    try {
      if (curriculum.metadata) {
        const metadata = JSON.parse(curriculum.metadata);
        return metadata.learningObjectives || [];
      }
    } catch (error) {
      console.error('Failed to parse metadata:', error);
    }
    return [];
  };

  const learningStandards = parseLearningStandards();
  const learningObjectives = parseLearningObjectives();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{curriculum.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(curriculum.status)}
              {getTypeBadge(curriculum.curriculumType)}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {curriculum.description && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{curriculum.description}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Grade Level:</span>
              <span className="text-sm font-medium text-gray-900">{formatGradeLevel(curriculum.gradeLevel)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Academic Year:</span>
              <span className="text-sm font-medium text-gray-900">{curriculum.academicYear}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="text-sm font-medium text-gray-900">
                {curriculum.durationWeeks || 'Not set'} weeks ({curriculum.totalHours || 'Not set'} hours)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Version:</span>
              <span className="text-sm font-medium text-gray-900">v{curriculum.curriculumVersion || 1}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Administrative Details</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Effective Date:</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(curriculum.effectiveDate)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Expiry Date:</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(curriculum.expiryDate)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Created By:</span>
              <span className="text-sm font-medium text-gray-900">User {curriculum.createdById}</span>
            </div>
            
            {curriculum.approvedById && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Approved By:</span>
                <span className="text-sm font-medium text-gray-900">User {curriculum.approvedById}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scope Information */}
      {(curriculum.regionId || curriculum.schoolId) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Scope</h3>
          
          <div className="flex flex-wrap gap-4">
            {curriculum.regionId && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Region ID:</span>
                <span className="text-sm font-medium text-gray-900">{curriculum.regionId}</span>
              </div>
            )}
            
            {curriculum.schoolId && (
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">School ID:</span>
                <span className="text-sm font-medium text-gray-900">{curriculum.schoolId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learning Outcomes */}
      {curriculum.learningOutcomes && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Outcomes</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{curriculum.learningOutcomes}</p>
          </div>
        </div>
      )}

      {/* Associated Subjects */}
      {curriculum.subjectIds && curriculum.subjectIds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Associated Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {curriculum.subjectIds.map((subjectId, index) => (
              <span 
                key={subjectId} 
                className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                Subject {subjectId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Learning Standards */}
      {learningStandards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Standards ({learningStandards.length})</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {learningStandards.map((standard: any, index: number) => (
              <div key={standard.id || index} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{standard.title}</div>
                {standard.description && (
                  <div className="text-sm text-gray-600 mt-1">{standard.description}</div>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {standard.category}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    {standard.bloomsLevel}
                  </span>
                  {standard.estimatedHours && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {standard.estimatedHours}h
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Objectives */}
      {learningObjectives.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Objectives ({learningObjectives.length})</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {learningObjectives.map((objective: any, index: number) => (
              <div key={objective.id || index} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{objective.title}</div>
                {objective.description && (
                  <div className="text-sm text-gray-600 mt-1">{objective.description}</div>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                    {objective.type}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    {objective.bloomsLevel}
                  </span>
                  {objective.estimatedTime && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {objective.estimatedTime}min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2 font-medium text-gray-900">{formatDate(curriculum.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 font-medium text-gray-900">{formatDate(curriculum.modifiedAt)}</span>
          </div>
          {curriculum.approvedAt && (
            <div>
              <span className="text-gray-600">Approved:</span>
              <span className="ml-2 font-medium text-gray-900">{formatDate(curriculum.approvedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewCurriculumModal; 