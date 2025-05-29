import React, { useState, useEffect } from 'react';
import { Question, CreateQuestionRequest, UpdateQuestionRequest, QuestionOption } from '../../../api/services/questionApi';
import { Plus, Trash2, Move, Eye, AlertCircle } from 'lucide-react';

interface QuestionEditorProps {
  question?: Question | null;
  onSubmit?: (question: CreateQuestionRequest | UpdateQuestionRequest) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  quizId?: number;
}

interface LocalQuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSubmit,
  onCancel,
  mode = 'create',
  quizId
}) => {
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    text: '',
    type: 'MULTIPLE_CHOICE',
    points: 1,
    quizId: quizId || 0,
    options: [],
    active: true
  });

  const [options, setOptions] = useState<LocalQuestionOption[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (question && mode === 'edit') {
      setFormData({
        text: question.text,
        type: question.type,
        points: question.points,
        quizId: question.quizId,
        options: question.options || [],
        correctAnswer: question.correctAnswer,
        active: question.active
      });

      // Load existing options for multiple choice questions
      if (question.type === 'MULTIPLE_CHOICE' && question.options) {
        setOptions(question.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect
        })));
      }
    }
  }, [question, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }

    if (formData.points < 0.1 || formData.points > 100) {
      newErrors.points = 'Points must be between 0.1 and 100';
    }

    if (formData.type === 'MULTIPLE_CHOICE') {
      const validOptions = options.filter(opt => opt.text.trim());
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required for multiple choice questions';
      }

      const correctOptions = validOptions.filter(opt => opt.isCorrect);
      if (correctOptions.length === 0) {
        newErrors.correctAnswer = 'At least one correct answer must be selected';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let parsedValue: any = value;
    
    if (type === 'checkbox') {
      parsedValue = checked;
    } else if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOptionChange = (index: number, field: keyof QuestionOption, value: string | boolean) => {
    setOptions(prev => prev.map((opt, i) => 
      i === index ? { ...opt, [field]: value } : opt
    ));

    // Clear options error when user makes changes
    if (errors.options || errors.correctAnswer) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.options;
        delete newErrors.correctAnswer;
        return newErrors;
      });
    }
  };

  const addOption = () => {
    setOptions(prev => [...prev, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < options.length) {
      setOptions(prev => {
        const newOptions = [...prev];
        [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
        return newOptions;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const questionData: CreateQuestionRequest = {
        ...formData,
        options: formData.type === 'MULTIPLE_CHOICE' 
          ? options.filter(opt => opt.text.trim()).map((opt, index) => ({
              id: opt.id || 0,
              text: opt.text,
              isCorrect: opt.isCorrect,
              questionId: 0 // Will be set by backend
            }))
          : []
      };

      if (onSubmit) {
        onSubmit(questionData);
      }
    } catch (error: any) {
      console.error('Failed to save question:', error);
      setErrors({ submit: error.message || 'Failed to save question' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionPreview = () => {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
        <div className="space-y-4">
          <div className="font-medium">{formData.text || 'Question text will appear here...'}</div>
          
          {formData.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-2">
              {options.filter(opt => opt.text.trim()).map((option, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="preview-option" 
                    className="radio radio-sm" 
                    disabled 
                  />
                  <span className={option.isCorrect ? 'text-green-600 font-medium' : ''}>
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          )}

          {formData.type === 'TRUE_FALSE' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="preview-tf" className="radio radio-sm" disabled />
                <span>True</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="preview-tf" className="radio radio-sm" disabled />
                <span>False</span>
              </label>
            </div>
          )}

          {formData.type === 'SHORT_ANSWER' && (
            <input 
              type="text" 
              placeholder="Student answer will appear here..." 
              className="input input-bordered w-full" 
              disabled 
            />
          )}

          {formData.type === 'ESSAY' && (
            <textarea 
              placeholder="Student essay will appear here..." 
              className="textarea textarea-bordered w-full" 
              rows={4} 
              disabled 
            />
          )}

          <div className="text-sm text-gray-500">
            Points: {formData.points}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Preview Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {mode === 'edit' ? 'Edit Question' : 'Create Question'}
        </h3>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="btn btn-sm btn-outline gap-2"
        >
          <Eye className="h-4 w-4" />
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      {previewMode ? (
        renderQuestionPreview()
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Question Type *</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="select select-bordered"
              disabled={isSubmitting}
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="SHORT_ANSWER">Short Answer</option>
              <option value="ESSAY">Essay</option>
            </select>
          </div>

          {/* Question Text */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Question Text *</span>
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              className={`textarea textarea-bordered ${errors.text ? 'textarea-error' : ''}`}
              placeholder="Enter your question here..."
              rows={3}
              disabled={isSubmitting}
            />
            {errors.text && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.text}</span>
              </label>
            )}
          </div>

          {/* Multiple Choice Options */}
          {formData.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="label-text font-medium">Answer Options *</label>
                <button
                  type="button"
                  onClick={addOption}
                  className="btn btn-sm btn-outline gap-2"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        className="checkbox checkbox-sm"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-600">Correct</span>
                    </div>
                    
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="input input-bordered input-sm flex-1"
                      disabled={isSubmitting}
                    />

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveOption(index, 'up')}
                        className="btn btn-xs btn-ghost"
                        disabled={index === 0 || isSubmitting}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOption(index, 'down')}
                        className="btn btn-xs btn-ghost"
                        disabled={index === options.length - 1 || isSubmitting}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="btn btn-xs btn-ghost text-red-600"
                        disabled={options.length <= 2 || isSubmitting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(errors.options || errors.correctAnswer) && (
                <div className="alert alert-error">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.options || errors.correctAnswer}</span>
                </div>
              )}
            </div>
          )}

          {/* Points */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Points *</span>
            </label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.points ? 'input-error' : ''}`}
              min={0.1}
              max={100}
              step={0.1}
              disabled={isSubmitting}
            />
            {errors.points && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.points}</span>
              </label>
            )}
          </div>

          {/* Active Status */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Active</span>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="checkbox checkbox-primary"
                disabled={isSubmitting}
              />
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="alert alert-error">
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuestionEditor; 