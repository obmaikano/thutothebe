import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { fetchQuizzes } from '../quizzesSlice';
import { Quiz } from '../../../api/services/quizApi';
import QuizForm from '../components/QuizForm';
import { FileQuestion, Plus } from 'lucide-react';

interface CreateQuizModalProps {
  extraObject?: any;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = async (quiz: Quiz) => {
    try {
      setIsSuccess(true);
      
      // Refresh the quizzes list instead of reloading the page
      await dispatch(fetchQuizzes());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create quiz:', error);
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <FileQuestion className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Created Successfully!</h3>
        <p className="text-gray-600">The new quiz has been added and is ready for questions.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Create New Quiz</h3>
          <p className="text-sm text-gray-600">Set up a new quiz for your course</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <QuizForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateQuizModal; 