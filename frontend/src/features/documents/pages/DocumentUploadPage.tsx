import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { uploadDocument } from '../documentsSlice';
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
  isPublic: z.boolean().optional(),
});

type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

const DocumentUploadPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
  const [uploadResults, setUploadResults] = useState<Array<{ file: string; success: boolean; error?: string }>>([]);

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
      isPublic: false,
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

  const handleFileSelect = (files: FileList) => {
    const validFiles: File[] = [];
    const maxSize = 50 * 1024 * 1024; // 50MB

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
        return;
      }
      validFiles.push(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
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
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    if (selectedFiles.length === 0 || !user?.id) {
      alert('Please select at least one file and ensure you are logged in');
      return;
    }

    setUploadStatus('uploading');
    setUploadResults([]);
    const results: Array<{ file: string; success: boolean; error?: string }> = [];

    for (const file of selectedFiles) {
      try {
        const metadata: CreateDocumentRequest = {
          title: data.title?.trim() || file.name.split('.')[0],
          description: data.description?.trim() || '',
          documentCategory: data.documentCategory,
          accessLevel: data.accessLevel,
          uploadedById: user.id,
          schoolId: data.schoolId,
          classId: data.classId,
          subjectId: data.subjectId,
          courseId: data.courseId,
          tags: data.tags?.trim() || undefined,
          isPublic: data.isPublic || false,
          requiresApproval: false, // Set default value
        };

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        await dispatch(uploadDocument({ file, metadata }));
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        results.push({ file: file.name, success: true });
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        results.push({ 
          file: file.name, 
          success: false, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        });
      }
    }

    setUploadResults(results);
    setUploadStatus(results.every(r => r.success) ? 'completed' : 'error');
    
    if (results.every(r => r.success)) {
      // Reset form if all uploads successful
      reset();
      setSelectedFiles([]);
      setUploadProgress({});
      setSelectedSchoolId(user?.schoolId || null);
      setSelectedClassId(null);
      setSelectedSubjectId(null);
      setSelectedCourseId(null);
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-600 mt-2">Upload and share educational documents and resources</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              User: {user.firstName} {user.lastName} | Role: {user.role}
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Files
            </label>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Drag and drop your files here, or{' '}
                  <label className="text-primary cursor-pointer hover:underline font-medium">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileInputChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, Word, Excel, PowerPoint, Images, Videos, Audio
                </p>
                <p className="text-sm text-gray-500">Maximum file size: 50MB per file</p>
              </div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="btn btn-ghost btn-sm"
                        disabled={uploadStatus === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                placeholder="Leave empty to use filename"
                {...register('title')}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.title.message}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt">If empty, filename will be used as title</span>
              </label>
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
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
              <span className="label-text-alt">{description.length}/1000</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Brief description of the documents..."
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
            </div>
          </div>

          {/* Searchable Reference Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Document Association</h3>
            <p className="text-sm text-gray-600">Associate this document with specific educational entities for better organization and access control.</p>
            
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
              <span className="label-text">Make documents public</span>
              <input
                type="checkbox"
                className="checkbox"
                {...register('isPublic')}
              />
            </label>
          </div>

          {/* Upload Progress */}
          {uploadStatus === 'uploading' && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Upload Progress</h4>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
                </div>
              ))}
            </div>
          )}

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Upload Results</h4>
              {uploadResults.map((result, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{result.file}</p>
                    {result.error && <p className="text-sm">{result.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                setSelectedFiles([]);
                setUploadProgress({});
                setUploadResults([]);
                setUploadStatus('idle');
                setSelectedSchoolId(user?.schoolId || null);
                setSelectedClassId(null);
                setSelectedSubjectId(null);
                setSelectedCourseId(null);
              }}
              disabled={uploadStatus === 'uploading'}
            >
              Clear All
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedFiles.length === 0 || uploadStatus === 'uploading'}
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadPage; 