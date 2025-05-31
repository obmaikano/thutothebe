import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { approveCurriculum } from '../curriculumSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import { CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

interface ApproveCurriculumModalProps {
  extraObject: { curriculum: Curriculum };
}

const ApproveCurriculumModal: React.FC<ApproveCurriculumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const curriculum = extraObject?.curriculum;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleApprove = async () => {
    if (!curriculum?.id || !user?.id) {
      setError('Missing required information for approval');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(approveCurriculum({ 
        id: curriculum.id, 
        approvedById: user.id 
      })).unwrap();
      
      dispatch(closeModal({}));
    } catch (error: any) {
      setError(error.message || 'Failed to approve curriculum');
    } finally {
      setIsLoading(false);
    }
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

  const formatGradeLevel = (gradeLevel: string) => {
    return gradeLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurriculumType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Approve Curriculum</h2>
          <p className="text-sm text-gray-600">Review and approve this curriculum for implementation</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Curriculum Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{curriculum.title}</h3>
            <p className="text-sm text-gray-600">Curriculum for approval</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Type:</span>
              <span className="text-sm font-medium text-gray-900">{formatCurriculumType(curriculum.curriculumType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Grade Level:</span>
              <span className="text-sm font-medium text-gray-900">{formatGradeLevel(curriculum.gradeLevel)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Academic Year:</span>
              <span className="text-sm font-medium text-gray-900">{curriculum.academicYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Status:</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                curriculum.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                curriculum.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {curriculum.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="text-sm font-medium text-gray-900">
                {curriculum.durationWeeks || 'Not set'} weeks
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Hours:</span>
              <span className="text-sm font-medium text-gray-900">
                {curriculum.totalHours || 'Not set'} hours
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Effective Date:</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(curriculum.effectiveDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created By:</span>
              <span className="text-sm font-medium text-gray-900">
                {curriculum.createdByName || `User ${curriculum.createdById}`}
              </span>
            </div>
          </div>
        </div>

        {curriculum.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700">{curriculum.description}</p>
          </div>
        )}

        {curriculum.learningOutcomes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Outcomes</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{curriculum.learningOutcomes}</p>
          </div>
        )}
      </div>

      {/* Approval Comments */}
      <div className="space-y-3">
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          Approval Comments (Optional)
        </label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Add any comments or notes about this approval..."
        />
        <p className="text-xs text-gray-500">
          These comments will be recorded with the approval and may be visible to other administrators.
        </p>
      </div>

      {/* Approval Confirmation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-1">Approval Confirmation</h4>
            <p className="text-sm text-green-700">
              By approving this curriculum, you confirm that:
            </p>
            <ul className="text-sm text-green-700 mt-2 ml-4 list-disc">
              <li>The curriculum content meets educational standards</li>
              <li>Learning outcomes are clearly defined and achievable</li>
              <li>The curriculum is ready for implementation</li>
              <li>All required reviews have been completed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Approver Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Approver Information</h4>
        <div className="text-sm text-blue-700">
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Approval Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Approve Curriculum
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApproveCurriculumModal; 