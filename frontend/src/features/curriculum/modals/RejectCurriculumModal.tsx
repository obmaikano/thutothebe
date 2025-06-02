import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { updateCurriculum } from '../curriculumSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import { XCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface RejectCurriculumModalProps {
  extraObject: { curriculum: Curriculum };
}

const RejectCurriculumModal: React.FC<RejectCurriculumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const curriculum = extraObject?.curriculum;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('CONTENT_ISSUES');

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleReject = async () => {
    if (!curriculum?.id || !user?.id) {
      setError('Missing required information for rejection');
      return;
    }

    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Update curriculum status to rejected with rejection details
      await dispatch(updateCurriculum({ 
        id: curriculum.id, 
        curriculumData: {
          status: 'DRAFT', // Set back to draft for revision
          metadata: JSON.stringify({
            ...curriculum.metadata ? JSON.parse(curriculum.metadata) : {},
            rejectionHistory: [
              ...(curriculum.metadata ? JSON.parse(curriculum.metadata).rejectionHistory || [] : []),
              {
                rejectedAt: new Date().toISOString(),
                rejectedById: user.id,
                rejectedByName: `${user.firstName} ${user.lastName}`,
                reason: rejectionReason,
                category: rejectionCategory
              }
            ]
          })
        }
      })).unwrap();
      
      dispatch(closeModal({}));
    } catch (error: any) {
      setError(error.message || 'Failed to reject curriculum');
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

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Curriculum Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{curriculum.title}</h3>
            <p className="text-sm text-gray-600">Curriculum for rejection</p>
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
              <span className="text-sm text-gray-600">Created By:</span>
              <span className="text-sm font-medium text-gray-900">{curriculum.createdByName || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created:</span>
              <span className="text-sm font-medium text-gray-900">{new Date(curriculum.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated:</span>
              <span className="text-sm font-medium text-gray-900">{new Date(curriculum.modifiedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Category */}
      <div className="space-y-3">
        <label htmlFor="rejectionCategory" className="block text-sm font-medium text-gray-700">
          Rejection Category
        </label>
        <select
          id="rejectionCategory"
          value={rejectionCategory}
          onChange={(e) => setRejectionCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="CONTENT_ISSUES">Content Issues</option>
          <option value="FORMATTING_PROBLEMS">Formatting Problems</option>
          <option value="INCOMPLETE_INFORMATION">Incomplete Information</option>
          <option value="STANDARDS_COMPLIANCE">Standards Compliance</option>
          <option value="QUALITY_CONCERNS">Quality Concerns</option>
          <option value="POLICY_VIOLATION">Policy Violation</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Rejection Reason */}
      <div className="space-y-3">
        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
          Rejection Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          id="rejectionReason"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          placeholder="Please provide detailed feedback on why this curriculum is being rejected..."
          required
        />
        <p className="text-xs text-gray-500">
          This feedback will be sent to the curriculum creator to help them improve the submission.
        </p>
      </div>

      {/* Rejection Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800 mb-1">Rejection Confirmation</h4>
            <p className="text-sm text-red-700">
              By rejecting this curriculum, you confirm that:
            </p>
            <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
              <li>The curriculum does not meet the required standards</li>
              <li>Specific feedback has been provided for improvement</li>
              <li>The curriculum will be returned to draft status</li>
              <li>The creator will be notified of the rejection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviewer Information */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-red-800 mb-2">Reviewer Information</h4>
        <div className="text-sm text-red-700">
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Rejection Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          Cancel
        </button>
        <button
          onClick={handleReject}
          disabled={isLoading || !rejectionReason.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Rejecting...
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              Reject Curriculum
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RejectCurriculumModal; 