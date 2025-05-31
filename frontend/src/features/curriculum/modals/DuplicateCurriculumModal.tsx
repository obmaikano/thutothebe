import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { duplicateCurriculum } from '../curriculumSlice';
import { Curriculum } from '../../../api/services/curriculumApi';
import { Copy, BookOpen, AlertCircle } from 'lucide-react';

interface DuplicateCurriculumModalProps {
  extraObject: { curriculum: Curriculum };
}

const DuplicateCurriculumModal: React.FC<DuplicateCurriculumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const curriculum = extraObject?.curriculum;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for the new curriculum
  const [formData, setFormData] = useState({
    title: curriculum ? `${curriculum.title} (Copy)` : '',
    academicYear: curriculum ? curriculum.academicYear + 1 : new Date().getFullYear(),
    gradeLevel: curriculum?.gradeLevel || 'STANDARD_1',
    curriculumType: curriculum?.curriculumType || 'SCHOOL_SPECIFIC',
    description: curriculum?.description || '',
    effectiveDate: '',
    expiryDate: '',
  });

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDuplicate = async () => {
    if (!curriculum?.id) {
      setError('Original curriculum ID is missing');
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(duplicateCurriculum({
        id: curriculum.id,
        newTitle: formData.title,
        newAcademicYear: formData.academicYear,
      })).unwrap();
      
      dispatch(closeModal({}));
    } catch (error: any) {
      setError(error.message || 'Failed to duplicate curriculum');
    } finally {
      setIsLoading(false);
    }
  };

  if (!curriculum) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">No Data</h3>
          <p className="text-red-600">No curriculum information available.</p>
          <button 
            onClick={handleClose}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const formatGradeLevel = (gradeLevel: string) => {
    return gradeLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurriculumType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const gradeOptions = [
    'STANDARD_1', 'STANDARD_2', 'STANDARD_3', 'STANDARD_4', 'STANDARD_5', 'STANDARD_6', 'STANDARD_7',
    'FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6',
    'KINDERGARTEN', 'PRE_KINDERGARTEN'
  ];

  const typeOptions = [
    'NATIONAL', 'REGIONAL', 'SCHOOL_SPECIFIC', 'INTERNATIONAL', 'VOCATIONAL', 'SPECIAL_NEEDS'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Copy className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Duplicate Curriculum</h2>
          <p className="text-sm text-gray-600">Create a copy of this curriculum with modifications</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Original Curriculum Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Original Curriculum</h3>
            <p className="text-sm text-gray-600">{curriculum.title}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-medium text-gray-900">{formatCurriculumType(curriculum.curriculumType)}</span>
          </div>
          <div>
            <span className="text-gray-600">Grade Level:</span>
            <span className="ml-2 font-medium text-gray-900">{formatGradeLevel(curriculum.gradeLevel)}</span>
          </div>
          <div>
            <span className="text-gray-600">Academic Year:</span>
            <span className="ml-2 font-medium text-gray-900">{curriculum.academicYear}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium text-gray-900">{curriculum.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Duplicate Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">New Curriculum Details</h3>
        
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter curriculum title"
            required
          />
        </div>

        {/* Academic Year and Grade Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              min="2020"
              max="2050"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>
                  {formatGradeLevel(grade)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Curriculum Type */}
        <div>
          <label htmlFor="curriculumType" className="block text-sm font-medium text-gray-700 mb-1">
            Curriculum Type <span className="text-red-500">*</span>
          </label>
          <select
            id="curriculumType"
            name="curriculumType"
            value={formData.curriculumType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {typeOptions.map(type => (
              <option key={type} value={type}>
                {formatCurriculumType(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Enter curriculum description"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              id="effectiveDate"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Copy className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Duplication Information</h4>
            <p className="text-sm text-blue-700">
              The following will be copied from the original curriculum:
            </p>
            <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
              <li>Learning outcomes and objectives</li>
              <li>Subject associations</li>
              <li>Duration and total hours</li>
              <li>Metadata and configurations</li>
            </ul>
            <p className="text-sm text-blue-700 mt-2">
              The new curriculum will be created with a "DRAFT" status and will require approval.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={handleDuplicate}
          disabled={isLoading || !formData.title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Duplicating...
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Create Duplicate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DuplicateCurriculumModal; 