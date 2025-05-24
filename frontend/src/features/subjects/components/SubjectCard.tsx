import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Subject } from '../../../api/services/subjectApi';
import { activateSubject, deactivateSubject } from '../subjectsSlice';

interface SubjectCardProps {
  subject: Subject;
  onEdit?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  onViewDetails?: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const dispatch = useAppDispatch();

  const handleActivate = async () => {
    try {
      await dispatch(activateSubject(subject.id)).unwrap();
    } catch (error) {
      console.error('Failed to activate subject:', error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await dispatch(deactivateSubject(subject.id)).unwrap();
    } catch (error) {
      console.error('Failed to deactivate subject:', error);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(subject);
    } else {
      dispatch(openModal({
        title: 'Edit Subject',
        bodyType: MODAL_BODY_TYPES.SUBJECT_EDIT,
        extraObject: subject
      }));
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(subject);
    } else {
      dispatch(openModal({
        title: 'Delete Subject',
        bodyType: MODAL_BODY_TYPES.SUBJECT_DELETE_CONFIRMATION,
        extraObject: subject
      }));
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(subject);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        {/* Header with status badge */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="card-title text-lg font-bold">{subject.name}</h3>
          </div>
          <div className="flex gap-2">
            <div className={`badge ${subject.active ? 'badge-success' : 'badge-warning'}`}>
              {subject.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Subject code */}
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-600">Code: </span>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{subject.code}</span>
        </div>

        {/* Description */}
        {subject.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">{subject.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-end mt-4">
          <div className="flex flex-wrap gap-2">
            {onViewDetails && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            )}
            
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleEdit}
            >
              Edit
            </button>

            {subject.active ? (
              <button 
                className="btn btn-warning btn-sm"
                onClick={handleDeactivate}
              >
                Deactivate
              </button>
            ) : (
              <button 
                className="btn btn-success btn-sm"
                onClick={handleActivate}
              >
                Activate
              </button>
            )}

            <button 
              className="btn btn-error btn-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard; 