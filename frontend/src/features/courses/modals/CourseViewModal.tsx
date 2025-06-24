import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { Course } from '../../../api/services/courseApi';
import { BookOpen } from 'lucide-react';

interface CourseViewModalProps {
  extraObject?: Course;
}

const CourseViewModal: React.FC<CourseViewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { subjects } = useAppSelector(state => state.subjects);
  const { classes } = useAppSelector(state => state.classes);

  // Fetch subjects and classes on component mount
  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  // Helper functions to get names from IDs
  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : `Subject ID: ${subjectId}`;
  };

  const getClassName = (classId: number) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? `${classItem.name} (Grade ${classItem.gradeLevel})` : `Class ID: ${classId}`;
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Data</h3>
        <p className="text-gray-600 mb-4">No course information was provided for viewing.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
          <p className="text-sm text-gray-600">View information for "{extraObject.name}"</p>
        </div>
      </div>

      {/* Course Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{extraObject.name}</div>
            <div className="text-sm text-gray-500">Code: {extraObject.code}</div>
            <div className="text-sm text-gray-500">{extraObject.term} {extraObject.year} • {extraObject.type}</div>
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

      {/* Details Grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden px-6 py-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="font-medium text-gray-900 mb-1">Name</div>
            <div className="text-gray-700">{extraObject.name}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Code</div>
            <div className="text-gray-700">{extraObject.code}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Type</div>
            <div className="text-gray-700">{extraObject.type}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Term</div>
            <div className="text-gray-700">{extraObject.term}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Year</div>
            <div className="text-gray-700">{extraObject.year}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Subject</div>
            <div className="text-gray-700">{getSubjectName(extraObject.subjectId)}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Class</div>
            <div className="text-gray-700">{getClassName(extraObject.classId)}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CourseViewModal; 