import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { fetchQuizzes } from '../quizzesSlice';
import { Quiz } from '../../../api/services/quizApi';
import QuizForm from '../components/QuizForm';
import { FileQuestion, Edit } from 'lucide-react';

interface EditQuizModalProps {
  extraObject?: Quiz;
}

export const EditQuizModal: React.FC<EditQuizModalProps> = ({ extraObject }) => {
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
      console.error('Failed to update quiz:', error);
      setIsSuccess(false);
    }
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <FileQuestion className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Data</h3>
        <p className="text-gray-600 mb-4">No quiz information was provided for editing.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <FileQuestion className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Updated Successfully!</h3>
        <p className="text-gray-600">The quiz information has been saved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Edit className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Quiz</h3>
          <p className="text-sm text-gray-600">Update the information for "{extraObject.title}"</p>
        </div>
      </div>

      {/* Quiz Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileQuestion className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{extraObject.title}</div>
            <div className="text-sm text-gray-500">Code: {extraObject.code}</div>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              extraObject.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {extraObject.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
        <QuizForm
          mode="edit"
          quiz={extraObject}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default EditQuizModal; 