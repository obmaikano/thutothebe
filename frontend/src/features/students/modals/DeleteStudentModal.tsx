import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { deleteStudent, fetchStudents } from '../studentsSlice';
import { closeModal } from '../../common/modalSlice';
import { Student } from '../../../api/services/studentApi';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';

interface DeleteStudentModalProps {
  extraObject?: Student;
}

const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = async () => {
    if (!extraObject) return;

    setLoading(true);
    setError(null);
    
    try {
      await dispatch(deleteStudent(extraObject.id)).unwrap();
      setIsSuccess(true);
      
      // Refresh the students list
      await dispatch(fetchStudents());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete student';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!extraObject) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No student data available</div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Deleted Successfully!</h3>
        <p className="text-gray-600">The student has been permanently removed from the system.</p>
      </div>
    );
  }

  const isConfirmed = confirmationText === extraObject.admissionNumber;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-red-100 rounded-lg">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Student</h3>
          <p className="text-sm text-gray-600">Permanently remove student from the system</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              This action cannot be undone
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Deleting this student will permanently remove all their data from the system, 
              including academic records, progress tracking, and associated information.
            </p>
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Student Details:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{extraObject.firstName} {extraObject.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Admission Number:</span>
            <span className="font-mono">{extraObject.admissionNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{extraObject.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Academic Year:</span>
            <span>{extraObject.academicYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              extraObject.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              extraObject.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              extraObject.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-800' :
              extraObject.status === 'GRADUATED' ? 'bg-blue-100 text-blue-800' :
              extraObject.status === 'WITHDRAWN' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {extraObject.status}
            </span>
          </div>
        </div>
      </div>

      {/* Alternative Actions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Consider Alternative Actions
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Instead of deleting, you might want to:
            </p>
            <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
              <li>Deactivate the student account</li>
              <li>Change status to "Withdrawn" or "Graduated"</li>
              <li>Archive the student record for future reference</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Input */}
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Type the student's admission number to confirm deletion:
          </p>
          <p className="text-sm font-mono font-bold text-gray-900 mt-1 bg-gray-100 px-2 py-1 rounded">
            {extraObject.admissionNumber}
          </p>
        </div>

        <div>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Type "${extraObject.admissionNumber}" to confirm`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={!isConfirmed || loading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Delete Student
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteStudentModal; 