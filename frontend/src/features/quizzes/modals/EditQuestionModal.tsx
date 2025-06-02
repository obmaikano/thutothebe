import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store';
import { updateQuestion, fetchQuestionsByQuizId } from '../questionsSlice';
import { closeModal } from '../../common/modalSlice';
import { Question, UpdateQuestionRequest } from '../../../api/services/questionApi';
import { Plus, Trash2 } from 'lucide-react';

interface EditQuestionModalProps {
  extraObject?: Question;
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [questionData, setQuestionData] = useState<Partial<UpdateQuestionRequest>>({
    text: '',
    type: 'MULTIPLE_CHOICE',
    points: 1,
    options: [],
    correctAnswer: '',
    active: true
  });

  const [options, setOptions] = useState<QuestionOption[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);

  useEffect(() => {
    if (extraObject) {
      setQuestionData({
        text: extraObject.text,
        type: extraObject.type,
        points: extraObject.points,
        correctAnswer: extraObject.correctAnswer || '',
        active: extraObject.active
      });

      if (extraObject.type === 'MULTIPLE_CHOICE' && extraObject.options) {
        setOptions(extraObject.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect
        })));
      }
    }
  }, [extraObject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraObject?.id) {
      setError('Question ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const questionToUpdate: UpdateQuestionRequest = {
        ...questionData,
        options: questionData.type === 'MULTIPLE_CHOICE' ? options.map((opt, index) => ({
          id: extraObject.options?.[index]?.id || 0,
          text: opt.text,
          isCorrect: opt.isCorrect,
          questionId: extraObject.id
        })) : []
      } as UpdateQuestionRequest;

      await dispatch(updateQuestion({ id: extraObject.id, questionData: questionToUpdate })).unwrap();
      
      // Refresh the questions list
      await dispatch(fetchQuestionsByQuizId(extraObject.quizId));
      
      setSuccess(true);
      setTimeout(() => {
        dispatch(closeModal({}));
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateQuestionRequest, value: any) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, field: keyof QuestionOption, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    // If setting this option as correct, unset others for single-correct questions
    if (field === 'isCorrect' && value) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  if (!extraObject) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Question Selected</h3>
        <p className="text-gray-600 mb-4">No question information was provided for editing.</p>
        <button
          onClick={() => dispatch(closeModal({}))}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Question Updated Successfully!</h3>
        <p className="text-gray-600">The question has been updated.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Edit Question</h3>
        <p className="text-sm text-gray-600">Update the question details</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Type *
          </label>
          <select
            value={questionData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="ESSAY">Essay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            value={questionData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your question here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points *
          </label>
          <input
            type="number"
            value={questionData.points}
            onChange={(e) => handleInputChange('points', Number(e.target.value))}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {questionData.type === 'MULTIPLE_CHOICE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus size={16} />
                Add Option
              </button>
            </div>
          </div>
        )}

        {questionData.type === 'TRUE_FALSE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <select
              value={questionData.correctAnswer}
              onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select correct answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )}

        {(questionData.type === 'SHORT_ANSWER' || questionData.type === 'ESSAY') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Answer / Explanation
            </label>
            <textarea
              value={questionData.correctAnswer}
              onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide a sample answer or explanation for grading reference..."
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={questionData.active}
            onChange={(e) => handleInputChange('active', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
            Question is active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestionModal; 