import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { deleteCurriculum } from '../curriculumSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteCurriculumModalProps {
  extraObject: { curriculum: Curriculum };
}

const DeleteCurriculumModal: React.FC<DeleteCurriculumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const curriculum = extraObject?.curriculum;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!curriculum?.id) {
      setError('Curriculum ID is missing');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(deleteCurriculum(curriculum.id)).unwrap();
      dispatch(closeModal({}));
    } catch (error: any) {
      setError(error.message || 'Failed to delete curriculum');
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
      {/* Warning Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Delete Curriculum</h2>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Curriculum Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Curriculum to be deleted:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Title:</span>
            <span className="text-sm font-medium text-gray-900">{curriculum.title}</span>
          </div>
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
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`text-sm font-medium ${
              curriculum.status === 'ACTIVE' ? 'text-green-600' : 
              curriculum.status === 'DRAFT' ? 'text-gray-600' : 
              curriculum.status === 'APPROVED' ? 'text-blue-600' : 
              'text-red-600'
            }`}>
              {curriculum.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800 mb-1">Warning</h4>
            <p className="text-sm text-red-700">
              Deleting this curriculum will permanently remove all associated data including:
            </p>
            <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
              <li>Learning standards and objectives</li>
              <li>Subject associations</li>
              <li>Metadata and custom configurations</li>
              <li>Historical records and approvals</li>
            </ul>
            <p className="text-sm text-red-700 mt-2 font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Input */}
      <div className="space-y-3">
        <p className="text-sm text-gray-700">
          To confirm deletion, please type the curriculum title exactly as shown:
        </p>
        <div className="bg-gray-100 rounded-lg p-3">
          <code className="text-sm font-mono text-gray-900">{curriculum.title}</code>
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
          onClick={handleDelete}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete Curriculum
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteCurriculumModal; 