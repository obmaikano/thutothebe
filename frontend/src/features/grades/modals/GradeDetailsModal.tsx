import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchGradeCategories } from '../gradeCategoriesSlice';
import { closeModal, openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Grade } from '../../../api/services/gradeApi';
import { GradeCategory } from '../../../api/services/gradeCategoryApi';
import { Edit, Calendar, User, BookOpen, BarChart, MessageSquare } from 'lucide-react';

interface GradeDetailsModalProps {
  extraObject?: Grade;
}

const GradeDetailsModal: React.FC<GradeDetailsModalProps> = ({ extraObject: grade }) => {
  const dispatch = useAppDispatch();
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const { gradeCategories } = useAppSelector(state => state.gradeCategories);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    if (grade?.courseId) {
      dispatch(fetchGradeCategories(grade.courseId));
    }
  }, [dispatch, grade?.courseId]);

  if (!grade) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No grade data available</p>
      </div>
    );
  }

  const student = students.find(s => s.id === grade.studentId);
  const course = courses.find(c => c.id === grade.courseId);
  const category = gradeCategories.find((c: GradeCategory) => c.id === grade.gradeCategoryId);

  const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
  const letterGrade = (() => {
    const perc = parseFloat(percentage);
    if (perc >= 90) return 'A';
    if (perc >= 80) return 'B';
    if (perc >= 70) return 'C';
    if (perc >= 60) return 'D';
    return 'F';
  })();

  const getGradeTypeColor = (gradeType: string) => {
    switch (gradeType) {
      case 'ASSIGNMENT': return 'bg-blue-100 text-blue-800';
      case 'ASSESSMENT': return 'bg-green-100 text-green-800';
      case 'QUIZ': return 'bg-yellow-100 text-yellow-800';
      case 'EXAM': return 'bg-red-100 text-red-800';
      case 'PROJECT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLetterGradeColor = (letter: string) => {
    switch (letter) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    dispatch(closeModal());
    dispatch(openModal({
      title: 'Edit Grade',
      bodyType: MODAL_BODY_TYPES.GRADE_EDIT,
      extraObject: grade
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Grade Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Grade Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive view of grade information
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
        </div>

        {/* Grade Score Display */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {grade.score} / {grade.maxScore}
              </div>
              <div className="text-sm text-gray-500">Raw Score</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {percentage}%
              </div>
              <div className="text-sm text-gray-500">Percentage</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-center">
              <span className={`inline-flex px-3 py-1 text-lg font-semibold rounded-full ${getLetterGradeColor(letterGrade)}`}>
                {letterGrade}
              </span>
              <div className="text-sm text-gray-500 mt-1">Letter Grade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student and Course Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Student Information</h4>
          </div>
          {student ? (
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Name:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Admission Number:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {student.admissionNumber}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {student.email}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Student information not available</p>
          )}
        </div>

        {/* Course Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Course Information</h4>
          </div>
          {course ? (
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Course:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {course.name}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Code:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {course.code}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Type:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {course.type}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Course information not available</p>
          )}
        </div>
      </div>

      {/* Grade Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <BarChart className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-sm font-medium text-gray-900">Grade Details</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Grade Type:</span>
              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeTypeColor(grade.gradeType)}`}>
                {grade.gradeType}
              </span>
            </div>
            
            {category && (
              <div>
                <span className="text-sm text-gray-500">Category:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {category.name}
                </span>
              </div>
            )}
            
            <div>
              <span className="text-sm text-gray-500">Weight:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {grade.weight}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <div className="ml-2 space-y-1">
                {grade.isFinal && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Final
                  </span>
                )}
                {grade.isModerated && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 ml-1">
                    Moderated
                  </span>
                )}
                {!grade.active && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 ml-1">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Graded At:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {new Date(grade.gradedAt).toLocaleDateString()} {new Date(grade.gradedAt).toLocaleTimeString()}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Created:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {new Date(grade.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Last Modified:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {new Date(grade.modifiedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {grade.feedback && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Feedback</h4>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{grade.feedback}</p>
          </div>
        </div>
      )}

      {/* Moderation Information */}
      {grade.isModerated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="text-sm font-medium text-yellow-800">Moderation Information</h4>
          </div>
          <div className="space-y-2">
            {grade.moderatedAt && (
              <div>
                <span className="text-sm text-yellow-700">Moderated At:</span>
                <span className="ml-2 text-sm font-medium text-yellow-800">
                  {new Date(grade.moderatedAt).toLocaleDateString()} {new Date(grade.moderatedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
            {grade.originalScore && (
              <div>
                <span className="text-sm text-yellow-700">Original Score:</span>
                <span className="ml-2 text-sm font-medium text-yellow-800">
                  {grade.originalScore} / {grade.maxScore}
                </span>
              </div>
            )}
            {grade.moderationNotes && (
              <div>
                <span className="text-sm text-yellow-700">Moderation Notes:</span>
                <div className="ml-2 bg-yellow-100 p-2 rounded text-sm text-yellow-800 mt-1">
                  {grade.moderationNotes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => dispatch(closeModal())}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GradeDetailsModal; 