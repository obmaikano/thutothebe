import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchGradeCategories, createGradeCategory, updateGradeCategory, deleteGradeCategory } from '../gradeCategoriesSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { GradeCategory } from '../../../api/services/gradeCategoryApi';
import { Save, X, Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  weight: z.number().min(0).max(100, 'Weight must be between 0 and 100'),
  courseId: z.number().min(1, 'Course is required'),
  minGrade: z.number().min(0).max(100, 'Min grade must be between 0 and 100').default(0),
  maxGrade: z.number().min(0).max(100, 'Max grade must be between 0 and 100').default(100),
  passingGrade: z.number().min(0).max(100, 'Passing grade must be between 0 and 100').default(60),
  active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface GradeCategoryManageModalProps {
  extraObject?: {
    courseId?: number;
  };
}

const GradeCategoryManageModal: React.FC<GradeCategoryManageModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { gradeCategories, status, error } = useAppSelector(state => state.gradeCategories);
  const { courses } = useAppSelector(state => state.courses);
  const [selectedCourse, setSelectedCourse] = useState<number>(extraObject?.courseId || 0);
  const [editingCategory, setEditingCategory] = useState<GradeCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      weight: 0,
      courseId: extraObject?.courseId || 0,
      minGrade: 0,
      maxGrade: 100,
      passingGrade: 60,
      active: true,
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    dispatch(fetchCourses());
    if (selectedCourse) {
      dispatch(fetchGradeCategories(selectedCourse));
    }
  }, [dispatch, selectedCourse]);

  useEffect(() => {
    if (editingCategory) {
      setValue('name', editingCategory.name);
      setValue('description', editingCategory.description || '');
      setValue('weight', editingCategory.weight);
      setValue('courseId', editingCategory.courseId);
      setValue('minGrade', editingCategory.minGrade);
      setValue('maxGrade', editingCategory.maxGrade);
      setValue('passingGrade', editingCategory.passingGrade);
      setValue('active', editingCategory.active);
    }
  }, [editingCategory, setValue]);

  const handleCourseChange = (courseId: number) => {
    setSelectedCourse(courseId);
    setValue('courseId', courseId);
    if (courseId) {
      dispatch(fetchGradeCategories(courseId));
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      weight: 0,
      courseId: selectedCourse,
      minGrade: 0,
      maxGrade: 100,
      passingGrade: 60,
      active: true,
    });
    setShowForm(true);
  };

  const handleEdit = (category: GradeCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await dispatch(deleteGradeCategory(categoryId)).unwrap();
      setDeleteConfirm(null);
      if (selectedCourse) {
        dispatch(fetchGradeCategories(selectedCourse));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const submitData = {
        ...data,
        description: data.description || '', // Ensure description is always a string
      };
      
      if (editingCategory) {
        await dispatch(updateGradeCategory({
          id: editingCategory.id,
          categoryData: submitData
        })).unwrap();
      } else {
        await dispatch(createGradeCategory(submitData)).unwrap();
      }
      
      setShowForm(false);
      setEditingCategory(null);
      reset();
      
      if (selectedCourse) {
        dispatch(fetchGradeCategories(selectedCourse));
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const getTotalWeight = () => {
    const courseCategories = gradeCategories.filter(cat => cat.courseId === selectedCourse);
    return courseCategories.reduce((total, cat) => total + cat.weight, 0);
  };

  const getWeightValidation = () => {
    const totalWeight = getTotalWeight();
    const currentWeight = editingCategory ? editingCategory.weight : 0;
    const newTotal = totalWeight - currentWeight + watchedValues.weight;
    
    if (newTotal > 100) {
      return {
        isValid: false,
        message: `Total weight would be ${newTotal}%. Maximum is 100%.`,
        type: 'error' as const
      };
    } else if (newTotal < 100) {
      return {
        isValid: true,
        message: `Total weight: ${newTotal}%. Remaining: ${100 - newTotal}%`,
        type: 'warning' as const
      };
    } else {
      return {
        isValid: true,
        message: `Total weight: ${newTotal}%. Perfect!`,
        type: 'success' as const
      };
    }
  };

  const weightValidation = getWeightValidation();
  const courseCategories = gradeCategories.filter(cat => cat.courseId === selectedCourse);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manage Grade Categories</h3>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage grade categories for weighted grading
          </p>
        </div>
        <button
          onClick={() => dispatch(closeModal(extraObject?.courseId ?? 0))}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Course Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course *
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => handleCourseChange(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!!extraObject?.courseId}
        >
          <option value={0}>Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {selectedCourse > 0 && (
        <>
          {/* Weight Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">Weight Distribution</h4>
              <span className={`text-sm font-medium ${getTotalWeight() === 100 ? 'text-green-600' : getTotalWeight() > 100 ? 'text-red-600' : 'text-yellow-600'}`}>
                {getTotalWeight()}% / 100%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  getTotalWeight() === 100 ? 'bg-green-500' : 
                  getTotalWeight() > 100 ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(getTotalWeight(), 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Categories ({courseCategories.length})</h4>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>

            {courseCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No categories found. Add a category to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {courseCategories.map(category => (
                  <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-900">{category.name}</h5>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Weight: {category.weight}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Form */}
          {showForm && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h4>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Assignments, Quizzes, Exams"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description of this category"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    {...register('weight', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>
                  )}
                </div>

                {/* Grade Range */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Grade *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      {...register('minGrade', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.minGrade && (
                      <p className="text-red-500 text-xs mt-1">{errors.minGrade.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Grade *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      {...register('maxGrade', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.maxGrade && (
                      <p className="text-red-500 text-xs mt-1">{errors.maxGrade.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Grade *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      {...register('passingGrade', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.passingGrade && (
                      <p className="text-red-500 text-xs mt-1">{errors.passingGrade.message}</p>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('active')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active Category
                  </label>
                </div>

                {/* Weight Validation */}
                <div className={`p-3 rounded-lg border ${
                  weightValidation.type === 'error' ? 'bg-red-50 border-red-200' :
                  weightValidation.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {weightValidation.type === 'error' ? (
                      <AlertCircle size={16} className="text-red-600" />
                    ) : weightValidation.type === 'success' ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      weightValidation.type === 'error' ? 'text-red-800' :
                      weightValidation.type === 'warning' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>
                      {weightValidation.message}
                    </span>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                      reset();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || !weightValidation.isValid || status === 'loading'}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {status === 'loading' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Confirmation */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={24} className="text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this category? This action cannot be undone and may affect existing grades.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GradeCategoryManageModal; 