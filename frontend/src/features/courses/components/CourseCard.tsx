import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Award, User } from 'lucide-react';
import { Course } from '../coursesSlice';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Function to get status badge color
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-blue-600 relative">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
            <BookOpen className="text-white h-12 w-12 opacity-30" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-600 font-medium">{course.code}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-xs text-gray-600">{course.credits} credits</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <User size={14} className="mr-2 text-blue-600" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 text-blue-600" />
            <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
          </div>
          <div className="flex items-center">
            <Award size={14} className="mr-2 text-blue-600" />
            <span>{course.department}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-600">{course.enrollmentCount} students enrolled</span>
          </div>
          <Link 
            to={`/app/courses/${course.id}`}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}; 