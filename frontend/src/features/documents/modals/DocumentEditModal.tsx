import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { updateDocument } from '../documentsSlice';
import { closeModal } from '../../common/modalSlice';
import { Document, UpdateDocumentRequest, DOCUMENT_CATEGORIES, DOCUMENT_ACCESS_LEVELS } from '../../../api/services/documentApi';
import { useAuth } from '../../../contexts/AuthContext';
import SearchableSchoolSelect from '../components/SearchableSchoolSelect';
import SearchableClassSelect from '../components/SearchableClassSelect';
import SearchableSubjectSelect from '../components/SearchableSubjectSelect';
import SearchableCourseSelect from '../components/SearchableCourseSelect';

const documentEditSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
  documentCategory: z.enum(['POLICY', 'PROCEDURE', 'CURRICULUM', 'LESSON_PLAN', 'ASSIGNMENT', 'ASSESSMENT', 'STUDENT_RECORD', 'STAFF_RECORD', 'COMPLIANCE', 'ADMINISTRATIVE', 'ACADEMIC_RESOURCE', 'ANNOUNCEMENT', 'FORM', 'REPORT', 'CERTIFICATE', 'TRANSCRIPT', 'ATTENDANCE_RECORD', 'GRADE_RECORD', 'DISCIPLINARY_RECORD', 'MEDICAL_RECORD', 'FINANCIAL_RECORD', 'MEETING_MINUTES', 'CORRESPONDENCE', 'TRAINING_MATERIAL', 'REFERENCE_MATERIAL', 'OTHER']),
  accessLevel: z.enum(['PUBLIC', 'REGIONAL', 'SCHOOL', 'CLASS', 'COURSE', 'SUBJECT', 'TEACHER_ONLY', 'ADMIN_ONLY', 'PRIVATE']),
  schoolId: z.number().optional(),
  classId: z.number().optional(),
  subjectId: z.number().optional(),
  courseId: z.number().optional(),
  tags: z.string().optional(),
  isPublic: z.boolean().optional(),
});

type DocumentEditFormData = z.infer<typeof documentEditSchema>;

interface DocumentEditModalProps {
  extraObject?: {
    document: Document;
  };
}

const DocumentEditModal: React.FC<DocumentEditModalProps> = ({ extraObject }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const document = extraObject?.document;

  // Form state for searchable dropdowns
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(document?.schoolId || null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(document?.classId || null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(document?.subjectId || null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(document?.courseId || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<DocumentEditFormData>({
    resolver: zodResolver(documentEditSchema),
    defaultValues: {
      title: document?.title || '',
      description: document?.description || '',
      documentCategory: document?.documentCategory || 'ACADEMIC_RESOURCE',
      accessLevel: document?.accessLevel || 'SCHOOL',
      schoolId: document?.schoolId,
      classId: document?.classId,
      subjectId: document?.subjectId,
      courseId: document?.courseId,
      tags: document?.tags || '',
      isPublic: document?.isPublic || false,
    }
  });

  const description = watch('description') || '';

  // Update form values when dropdown selections change
  React.useEffect(() => {
    setValue('schoolId', selectedSchoolId || undefined);
  }, [selectedSchoolId, setValue]);

  React.useEffect(() => {
    setValue('classId', selectedClassId || undefined);
  }, [selectedClassId, setValue]);

  React.useEffect(() => {
    setValue('subjectId', selectedSubjectId || undefined);
  }, [selectedSubjectId, setValue]);

  React.useEffect(() => {
    setValue('courseId', selectedCourseId || undefined);
  }, [selectedCourseId, setValue]);

  // Clear dependent selections when parent changes
  React.useEffect(() => {
    if (!selectedSchoolId) {
      setSelectedClassId(null);
    }
  }, [selectedSchoolId]);

  if (!document) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Document not found</p>
      </div>
    );
  }

  const onSubmit = async (data: DocumentEditFormData) => {
    try {
      const updateData: UpdateDocumentRequest = {
        title: data.title,
        description: data.description,
        documentCategory: data.documentCategory,
        accessLevel: data.accessLevel,
        tags: data.tags,
        isPublic: data.isPublic,
      };

      await dispatch(updateDocument({ id: document.id, documentData: updateData }));
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Document Info Header */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            <div><span className="font-medium">File:</span> {document.fileName}</div>
            <div><span className="font-medium">Current Version:</span> {document.versionNumber}</div>
            <div><span className="font-medium">Last Modified:</span> {new Date(document.modifiedAt).toLocaleDateString()}</div>
            <div><span className="font-medium">Uploaded by:</span> {document.uploadedByName}</div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title *</span>
            </label>
            <input
              type="text"
              className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
              {...register('title')}
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.title.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category *</span>
            </label>
            <select
              className={`select select-bordered ${errors.documentCategory ? 'select-error' : ''}`}
              {...register('documentCategory')}
            >
              {DOCUMENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.documentCategory && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.documentCategory.message}</span>
              </label>
            )}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
            <span className="label-text-alt">{description.length}/1000</span>
          </label>
          <textarea
            className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
            placeholder="Brief description of the document..."
            maxLength={1000}
            {...register('description')}
          />
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.description.message}</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Access Level *</span>
            </label>
            <select
              className={`select select-bordered ${errors.accessLevel ? 'select-error' : ''}`}
              {...register('accessLevel')}
            >
              {DOCUMENT_ACCESS_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.accessLevel && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.accessLevel.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Enter tags separated by commas"
              {...register('tags')}
            />
            <label className="label">
              <span className="label-text-alt">Separate multiple tags with commas</span>
            </label>
          </div>
        </div>

        {/* Document Association Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Document Association</h3>
          <p className="text-sm text-gray-600">Update document associations with educational entities for better organization and access control.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">School</span>
              </label>
              <SearchableSchoolSelect
                value={selectedSchoolId}
                onChange={setSelectedSchoolId}
                placeholder="Select a school..."
                showActiveOnly={true}
              />
            </div>

            {/* Class Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Class</span>
              </label>
              <SearchableClassSelect
                value={selectedClassId}
                onChange={setSelectedClassId}
                placeholder="Select a class..."
                schoolId={selectedSchoolId}
                showActiveOnly={true}
              />
            </div>

            {/* Subject Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <SearchableSubjectSelect
                value={selectedSubjectId}
                onChange={setSelectedSubjectId}
                placeholder="Select a subject..."
                showActiveOnly={true}
              />
            </div>

            {/* Course Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Course</span>
              </label>
              <SearchableCourseSelect
                value={selectedCourseId}
                onChange={setSelectedCourseId}
                placeholder="Select a course..."
                classId={selectedClassId}
                subjectId={selectedSubjectId}
                showActiveOnly={true}
              />
            </div>
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Make this document public</span>
            <input
              type="checkbox"
              className="checkbox"
              {...register('isPublic')}
            />
          </label>
          <label className="label">
            <span className="label-text-alt">Public documents can be accessed by anyone</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentEditModal; 