import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createQuiz, updateQuiz, fetchQuizById, clearCurrentQuiz } from '../quizzesSlice';
import { fetchQuestionsByQuizId } from '../questionsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { CreateQuizRequest, UpdateQuizRequest } from '../../../api/services/quizApi';
import { Question } from '../../../api/services/questionApi';
import { Save, Plus, Edit, Trash2, Eye, FileQuestion, Clock, Users, BarChart3, ArrowLeft } from 'lucide-react';
import SearchableCourseSelect from '../components/SearchableCourseSelect';

const QuizCreationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { currentQuiz, status, error } = useAppSelector(state => state.quizzes);
  const { questions, status: questionsStatus } = useAppSelector(state => state.questions);
  const { user } = useAppSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState<'details' | 'questions' | 'settings'>('details');
  const [quizData, setQuizData] = useState<Partial<CreateQuizRequest>>({
    code: '',
    title: '',
    description: '',
    courseId: 0,
    instructorId: user?.id || 0,
    startDate: '',
    endDate: '',
    timeLimit: 60,
    totalPoints: 0,
    status: 'DRAFT',
    gradingType: 'AUTO',
    autoGradeImmediately: true,
    showResultsImmediately: false,
    maxAttempts: 1,
    active: false
  });

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchQuizById(Number(id)));
      dispatch(fetchQuestionsByQuizId(Number(id)));
    }
    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentQuiz) {
      setQuizData({
        code: currentQuiz.code,
        title: currentQuiz.title,
        description: currentQuiz.description,
        courseId: currentQuiz.courseId,
        instructorId: currentQuiz.instructorId,
        startDate: currentQuiz.startDate.split('T')[0],
        endDate: currentQuiz.endDate.split('T')[0],
        timeLimit: currentQuiz.timeLimit,
        totalPoints: currentQuiz.totalPoints,
        status: currentQuiz.status,
        gradingType: currentQuiz.gradingType,
        autoGradeImmediately: currentQuiz.autoGradeImmediately,
        showResultsImmediately: currentQuiz.showResultsImmediately,
        maxAttempts: currentQuiz.maxAttempts,
        active: currentQuiz.active
      });
    }
  }, [currentQuiz, isEditing]);

  const handleInputChange = (field: keyof CreateQuizRequest, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveQuiz = async () => {
    try {
      if (isEditing && id) {
        await dispatch(updateQuiz({ id: Number(id), quizData })).unwrap();
      } else {
        const result = await dispatch(createQuiz(quizData as CreateQuizRequest)).unwrap();
        if (result && !Array.isArray(result) && 'id' in result) {
          navigate(`/app/quiz-creation/${result.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to save quiz:', error);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuiz) return;
    dispatch(openModal({
      title: 'Add New Question',
      bodyType: MODAL_BODY_TYPES.QUESTION_ADD_NEW,
      extraObject: { quizId: currentQuiz.id },
      size: 'lg'
    }));
  };

  const handleEditQuestion = (question: Question) => {
    dispatch(openModal({
      title: 'Edit Question',
      bodyType: MODAL_BODY_TYPES.QUESTION_EDIT,
      extraObject: question,
      size: 'lg'
    }));
  };

  const handleDeleteQuestion = (question: Question) => {
    dispatch(openModal({
      title: 'Delete Question',
      bodyType: MODAL_BODY_TYPES.QUESTION_DELETE_CONFIRMATION,
      extraObject: question,
      size: 'md'
    }));
  };

  const handlePreviewQuiz = () => {
    if (currentQuiz) {
      navigate(`/app/quiz-take/${currentQuiz.id}?preview=true`);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'TRUE_FALSE': return 'True/False';
      case 'SHORT_ANSWER': return 'Short Answer';
      case 'ESSAY': return 'Essay';
      default: return type;
    }
  };

  const calculateTotalPoints = () => {
    return (questions || []).reduce((total, question) => total + question.points, 0);
  };

  if (status === 'loading' || questionsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/quizzes')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Modify quiz details and questions' : 'Set up a new quiz for your course'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && currentQuiz && (
            <button
              onClick={handlePreviewQuiz}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Eye size={16} />
              Preview
            </button>
          )}
          <button
            onClick={handleSaveQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            {isEditing ? 'Update Quiz' : 'Save Quiz'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearCurrentQuiz())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quiz Details
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Questions ({(questions || []).length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Quiz Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Code *
                  </label>
                  <input
                    type="text"
                    value={quizData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter unique quiz code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <SearchableCourseSelect
                    value={quizData.courseId || 0}
                    onChange={(value) => handleInputChange('courseId', value)}
                    placeholder="Select a course"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={quizData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={quizData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quiz description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={quizData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={quizData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={quizData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Points
                  </label>
                  <input
                    type="number"
                    value={calculateTotalPoints()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Calculated from questions"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically calculated from question points
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Quiz Questions</h3>
                  <p className="text-sm text-gray-600">
                    Add and manage questions for this quiz
                  </p>
                </div>
                {isEditing && currentQuiz && (
                  <button
                    onClick={handleAddQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileQuestion size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Save Quiz First</h3>
                  <p className="text-gray-600">
                    Please save the quiz details before adding questions.
                  </p>
                </div>
              ) : (questions || []).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileQuestion size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start building your quiz by adding questions.
                  </p>
                  <button
                    onClick={handleAddQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
                  >
                    <Plus size={16} />
                    Add First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(questions || []).map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              Question {index + 1}
                            </span>
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                              {getQuestionTypeLabel(question.type)}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              {question.points} points
                            </span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {question.text}
                          </h4>
                          {question.correctAnswer && (
                            <p className="text-sm text-gray-600">
                              Explanation: {question.correctAnswer}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Question"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Show options for multiple choice questions */}
                      {question.type === 'MULTIPLE_CHOICE' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                option.isCorrect
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="text-sm">{option.text}</span>
                                {option.isCorrect && (
                                  <span className="text-green-600 text-xs font-medium">
                                    (Correct)
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quiz Settings</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiz Status
                      </label>
                      <select
                        value={quizData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grading Type
                      </label>
                      <select
                        value={quizData.gradingType}
                        onChange={(e) => handleInputChange('gradingType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="AUTO">Automatic</option>
                        <option value="MANUAL">Manual</option>
                        <option value="HYBRID">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Attempts
                    </label>
                    <input
                      type="number"
                      value={quizData.maxAttempts}
                      onChange={(e) => handleInputChange('maxAttempts', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoGradeImmediately"
                        checked={quizData.autoGradeImmediately}
                        onChange={(e) => handleInputChange('autoGradeImmediately', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoGradeImmediately" className="ml-2 block text-sm text-gray-900">
                        Auto-grade immediately after submission
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showResultsImmediately"
                        checked={quizData.showResultsImmediately}
                        onChange={(e) => handleInputChange('showResultsImmediately', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showResultsImmediately" className="ml-2 block text-sm text-gray-900">
                        Show results immediately after submission
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={quizData.active}
                        onChange={(e) => handleInputChange('active', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                        Quiz is active and available to students
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCreationPage; 