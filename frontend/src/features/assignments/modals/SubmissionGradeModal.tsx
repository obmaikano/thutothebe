import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { gradeSubmission } from '../submissionsSlice';
import { closeModal } from '../../common/modalSlice';
import { Submission } from '../../../api/services/submissionApi';
import { 
  GraduationCap,
  MessageSquare,
  Save,
  X,
  Star
} from 'lucide-react';

interface SubmissionGradeModalProps {
  submission: Submission;
}

const SubmissionGradeModal: React.FC<SubmissionGradeModalProps> = ({ submission }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.submissions);

  const [gradeData, setGradeData] = useState({
    score: submission.score || 0,
    percentage: submission.percentage || 0,
    letterGrade: submission.letterGrade || '',
    feedback: submission.feedback || '',
    rubricScores: submission.rubricScores || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: unknown) => {
    setGradeData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (gradeData.score < 0 || gradeData.score > (submission.maxScore || 100)) {
      newErrors.score = `Score must be between 0 and ${submission.maxScore || 100}`;
    }

    if (gradeData.percentage < 0 || gradeData.percentage > 100) {
      newErrors.percentage = 'Percentage must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(gradeSubmission({ 
        id: submission.id, 
        gradeData 
      })).unwrap();
      dispatch(closeModal());
    } catch (error) {
      console.error('Failed to grade submission:', error);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Grade Submission</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Submission Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Submission Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Student ID:</span>
              <span className="ml-2 font-medium">{submission.studentId}</span>
            </div>
            <div>
              <span className="text-gray-500">Assignment ID:</span>
              <span className="ml-2 font-medium">{submission.assignmentId}</span>
            </div>
            <div>
              <span className="text-gray-500">Submitted:</span>
              <span className="ml-2 font-medium">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Max Score:</span>
              <span className="ml-2 font-medium">{submission.maxScore || 100} points</span>
            </div>
          </div>
        </div>

        {/* Grading Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score (Points) *
              </label>
              <input
                type="number"
                value={gradeData.score}
                onChange={(e) => handleInputChange('score', e.target.value ? parseFloat(e.target.value) : 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.score ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max={submission.maxScore || 100}
                step="0.5"
              />
              {errors.score && (
                <p className="mt-1 text-sm text-red-600">{errors.score}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage
              </label>
              <input
                type="number"
                value={gradeData.percentage}
                onChange={(e) => handleInputChange('percentage', e.target.value ? parseFloat(e.target.value) : 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.percentage ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max="100"
                step="0.1"
              />
              {errors.percentage && (
                <p className="mt-1 text-sm text-red-600">{errors.percentage}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Letter Grade
            </label>
            <select
              value={gradeData.letterGrade}
              onChange={(e) => handleInputChange('letterGrade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select letter grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D+">D+</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Feedback
            </label>
            <textarea
              value={gradeData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide feedback to the student..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Star className="inline h-4 w-4 mr-1" />
              Rubric Scores (JSON format)
            </label>
            <textarea
              value={gradeData.rubricScores}
              onChange={(e) => handleInputChange('rubricScores', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder='{"criteria1": 8, "criteria2": 9, "criteria3": 7}'
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter rubric scores in JSON format if using a rubric
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Grade
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionGradeModal; 