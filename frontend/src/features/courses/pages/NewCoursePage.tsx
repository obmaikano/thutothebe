import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCourses } from '../hooks';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { CreateCourseRequest } from '../../../api/services/courseApi';

const NewCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { createCourse, loading, error } = useCourses();
  
  const [courseData, setCourseData] = useState<CreateCourseRequest>({
    code: '',
    name: '',
    subjectId: 1, // Default values
    classId: 1,    // Default values
    term: 'FIRST',
    year: new Date().getFullYear(),
    active: true,
    type: 'CORE',
    instructorIds: []
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    // Convert numeric fields
    if (name === 'subjectId' || name === 'classId' || name === 'year') {
      processedValue = parseInt(value, 10);
    }
    
    // Convert checkbox fields
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setCourseData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Basic validation
    if (!courseData.code.trim() || !courseData.name.trim()) {
      setFormError('Course code and name are required');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await createCourse(courseData);
      navigate('/app/courses');
    } catch (error) {
      console.error('Failed to create course:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to create course');
      setSubmitting(false);
    }
  };
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4 flex items-center">
          <Link to="/app/courses" className="mr-4">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-6 px-6">
        <div className="bg-white rounded-lg shadow p-6">
          {(error || formError) && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formError || error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Code */}
              <div>
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={courseData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., CS101"
                  className="mt-1"
                />
              </div>
              
              {/* Course Name */}
              <div>
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={courseData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Introduction to Computer Science"
                  className="mt-1"
                />
              </div>
              
              {/* Subject ID */}
              <div>
                <Label htmlFor="subjectId">Subject ID</Label>
                <Input
                  id="subjectId"
                  name="subjectId"
                  type="number"
                  value={courseData.subjectId}
                  onChange={handleChange}
                  className="mt-1"
                  min="1"
                />
              </div>
              
              {/* Class ID */}
              <div>
                <Label htmlFor="classId">Class ID</Label>
                <Input
                  id="classId"
                  name="classId"
                  type="number"
                  value={courseData.classId}
                  onChange={handleChange}
                  className="mt-1"
                  min="1"
                />
              </div>
              
              {/* Term */}
              <div>
                <Label htmlFor="term">Term</Label>
                <Select
                  id="term"
                  name="term"
                  value={courseData.term}
                  onChange={handleChange}
                  className="mt-1 w-full"
                >
                  <option value="FIRST">First Term</option>
                  <option value="SECOND">Second Term</option>
                  <option value="THIRD">Third Term</option>
                </Select>
              </div>
              
              {/* Year */}
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={courseData.year}
                  onChange={handleChange}
                  className="mt-1"
                  min={new Date().getFullYear() - 5}
                  max={new Date().getFullYear() + 5}
                />
              </div>
              
              {/* Type */}
              <div>
                <Label htmlFor="type">Course Type</Label>
                <Select
                  id="type"
                  name="type"
                  value={courseData.type}
                  onChange={handleChange}
                  className="mt-1 w-full"
                >
                  <option value="CORE">Core</option>
                  <option value="ELECTIVE">Elective</option>
                </Select>
              </div>
              
              {/* Active */}
              <div className="flex items-center pt-6">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={courseData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active course
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/app/courses')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                isLoading={submitting}
              >
                Create Course
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCoursePage; 