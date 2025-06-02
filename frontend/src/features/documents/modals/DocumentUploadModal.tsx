import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { uploadDocument } from '../documentsSlice';
import { closeModal } from '../../common/modalSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { CreateDocumentRequest, DOCUMENT_CATEGORIES, DOCUMENT_ACCESS_LEVELS } from '../../../api/services/documentApi';
import SearchableSchoolSelect from '../components/SearchableSchoolSelect';
import SearchableClassSelect from '../components/SearchableClassSelect';
import SearchableSubjectSelect from '../components/SearchableSubjectSelect';
import SearchableCourseSelect from '../components/SearchableCourseSelect';

const documentUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
  documentCategory: z.enum(['POLICY', 'PROCEDURE', 'CURRICULUM', 'LESSON_PLAN', 'ASSIGNMENT', 'ASSESSMENT', 'STUDENT_RECORD', 'STAFF_RECORD', 'COMPLIANCE', 'ADMINISTRATIVE', 'ACADEMIC_RESOURCE', 'ANNOUNCEMENT', 'FORM', 'REPORT', 'CERTIFICATE', 'TRANSCRIPT', 'ATTENDANCE_RECORD', 'GRADE_RECORD', 'DISCIPLINARY_RECORD', 'MEDICAL_RECORD', 'FINANCIAL_RECORD', 'MEETING_MINUTES', 'CORRESPONDENCE', 'TRAINING_MATERIAL', 'REFERENCE_MATERIAL', 'OTHER']),
  accessLevel: z.enum(['PUBLIC', 'REGIONAL', 'SCHOOL', 'CLASS', 'COURSE', 'SUBJECT', 'TEACHER_ONLY', 'ADMIN_ONLY', 'PRIVATE']),
  schoolId: z.number().optional(),
  classId: z.number().optional(),
  subjectId: z.number().optional(),
  courseId: z.number().optional(),
  tags: z.string().optional(),
});

type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

const DocumentUploadModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form state for searchable dropdowns
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(user?.schoolId || null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      documentCategory: 'ACADEMIC_RESOURCE',
      accessLevel: 'SCHOOL',
      schoolId: user?.schoolId,
    }
  });

  const accessLevel = watch('accessLevel');
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

  const handleFileSelect = (file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size must be less than 50MB');
      return;
    }
    
    setSelectedFile(file);
    if (!watch('title')) {
      setValue('title', file.name.split('.')[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    if (!selectedFile || !user?.id) {
      alert('Please select a file and ensure you are logged in');
      return;
    }

    setIsUploading(true);
    
    try {
      const metadata: CreateDocumentRequest = {
        title: data.title?.trim() || selectedFile.name.split('.')[0],
        description: data.description?.trim() || '',
        documentCategory: data.documentCategory,
        accessLevel: data.accessLevel,
        uploadedById: user.id,
        schoolId: data.schoolId,
        classId: data.classId,
        subjectId: data.subjectId,
        courseId: data.courseId,
        tags: data.tags?.trim() || undefined,
        isPublic: false, // Set default value
        requiresApproval: false, // Set default value
      };

      await dispatch(uploadDocument({ file: selectedFile, metadata }));
      
      // Reset form and close modal
      reset();
      setSelectedFile(null);
      setSelectedSchoolId(user?.schoolId || null);
      setSelectedClassId(null);
      setSelectedSubjectId(null);
      setSelectedCourseId(null);
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select File
          </label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : selectedFile
                ? 'border-success bg-success/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-success mx-auto" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-600">
                    Drag and drop your file here, or{' '}
                    <label className="text-primary cursor-pointer hover:underline">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileInputChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500">Maximum file size: 50MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document Details */}
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
            className={`textarea textarea-bordered h-20 ${errors.description ? 'textarea-error' : ''}`}
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

        {/* Document Association Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Document Association</h3>
          <p className="text-sm text-gray-600">Associate this document with educational entities for better organization.</p>
          
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

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <progress className="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="btn btn-ghost"
            disabled={isUploading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadModal; 