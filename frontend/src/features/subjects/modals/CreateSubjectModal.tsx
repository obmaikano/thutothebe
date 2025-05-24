import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchSubjects } from '../subjectsSlice';
import { Subject } from '../../../api/services/subjectApi';
import SubjectForm from '../components/SubjectForm';
import { BookOpen, Plus } from 'lucide-react';

interface CreateSubjectModalProps {
  extraObject?: any;
}

export const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (subject: Subject) => {
    try {
      setIsSuccess(true);
      
      // Refresh the subjects list instead of reloading the page
      await dispatch(fetchSubjects());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create subject:', error);
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject Created Successfully!</h3>
        <p className="text-gray-600">The new subject has been added to your curriculum.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Subject</h3>
          <p className="text-sm text-gray-600">Add a new academic subject to your curriculum</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <SubjectForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateSubjectModal; 