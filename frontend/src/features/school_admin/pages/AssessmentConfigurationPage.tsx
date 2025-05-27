import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { 
  BookOpen, Plus, Search, Filter, Edit, Trash2, 
  Users, Calendar, FileText, BarChart3, 
  CheckCircle, Clock, AlertTriangle, Eye
} from 'lucide-react';

// Card component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Assessment card component
const AssessmentCard: React.FC<{
  assessment: any;
  onEdit: (assessment: any) => void;
  onDelete: (assessment: any) => void;
  onView: (assessment: any) => void;
}> = ({ assessment, onEdit, onDelete, onView }) => (
  <Card className="hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{assessment.subject}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{assessment.class}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{assessment.dueDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            assessment.type === 'EXAM' ? 'bg-red-100 text-red-800' :
            assessment.type === 'QUIZ' ? 'bg-blue-100 text-blue-800' :
            assessment.type === 'ASSIGNMENT' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {assessment.type}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            assessment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            assessment.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {assessment.status}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onView(assessment)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEdit(assessment)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(assessment)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Total Marks:</span>
        <span className="ml-2 font-medium">{assessment.totalMarks}</span>
      </div>
      <div>
        <span className="text-gray-500">Submissions:</span>
        <span className="ml-2 font-medium">{assessment.submissions}/{assessment.totalStudents}</span>
      </div>
      <div>
        <span className="text-gray-500">Average:</span>
        <span className="ml-2 font-medium">{assessment.averageScore || 'N/A'}</span>
      </div>
    </div>
  </Card>
);

export const AssessmentConfigurationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { classes } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const { subjects } = useAppSelector(state => state.subjects);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  // Mock assessment data - would come from API
  const [assessments] = useState([
    {
      id: 1,
      title: 'Mathematics Mid-Term Exam',
      subject: 'Mathematics',
      class: 'Form 1A',
      type: 'EXAM',
      status: 'ACTIVE',
      dueDate: '2025-04-25',
      totalMarks: 100,
      submissions: 28,
      totalStudents: 30,
      averageScore: 75.5,
      teacher: 'Mr. Kgosi'
    },
    {
      id: 2,
      title: 'English Literature Essay',
      subject: 'English',
      class: 'Form 2B',
      type: 'ASSIGNMENT',
      status: 'ACTIVE',
      dueDate: '2025-04-20',
      totalMarks: 50,
      submissions: 22,
      totalStudents: 25,
      averageScore: 68.2,
      teacher: 'Mrs. Phiri'
    },
    {
      id: 3,
      title: 'Science Quiz - Chapter 5',
      subject: 'Science',
      class: 'Form 1A',
      type: 'QUIZ',
      status: 'DRAFT',
      dueDate: '2025-04-30',
      totalMarks: 25,
      submissions: 0,
      totalStudents: 30,
      averageScore: null,
      teacher: 'Dr. Moeti'
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchClasses()),
          dispatch(fetchTeachers()),
          dispatch(fetchSubjects())
        ]);
      } catch (error) {
        console.error('Failed to load assessment data:', error);
      }
    };

    loadData();
  }, [dispatch]);

  const handleCreateAssessment = () => {
    dispatch(openModal({
      title: 'Create New Assessment',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_ADD_NEW,
      extraObject: { 
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleEditAssessment = (assessment: any) => {
    dispatch(openModal({
      title: 'Edit Assessment',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_EDIT,
      extraObject: { 
        assessment,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleDeleteAssessment = (assessment: any) => {
    dispatch(openModal({
      title: 'Delete Assessment',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_DELETE_CONFIRMATION,
      extraObject: assessment
    }));
  };

  const handleViewAssessment = (assessment: any) => {
    dispatch(openModal({
      title: 'Assessment Details',
      bodyType: MODAL_BODY_TYPES.ASSIGNMENT_VIEW_SUBMISSIONS,
      extraObject: { 
        assessment,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleConfigureGrading = () => {
    dispatch(openModal({
      title: 'Configure Grading Scheme',
      bodyType: MODAL_BODY_TYPES.GRADE_CATEGORY_ADD_NEW,
      extraObject: { 
        classes,
        subjects
      }
    }));
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = 
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === '' || assessment.type === filterType;
    const matchesStatus = filterStatus === '' || assessment.status === filterStatus;
    const matchesClass = selectedClass === null || assessment.class.includes(classes.find(c => c.id === selectedClass)?.name || '');

    return matchesSearch && matchesType && matchesStatus && matchesClass;
  });

  const getStatistics = () => {
    const total = assessments.length;
    const active = assessments.filter(a => a.status === 'ACTIVE').length;
    const draft = assessments.filter(a => a.status === 'DRAFT').length;
    const completed = assessments.filter(a => a.submissions === a.totalStudents).length;

    return { total, active, draft, completed };
  };

  const stats = getStatistics();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Configuration</h1>
          <p className="text-gray-600 mt-2">Create and manage class assessments and grading schemes</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleConfigureGrading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={16} />
            Configure Grading
          </button>
          <button 
            onClick={handleCreateAssessment} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create Assessment
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="text-blue-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
            <AlertTriangle className="text-purple-600" size={24} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="EXAM">Exam</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="PROJECT">Project</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssessments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No assessments found for the selected criteria.</p>
          </div>
        ) : (
          filteredAssessments.map(assessment => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onEdit={handleEditAssessment}
              onDelete={handleDeleteAssessment}
              onView={handleViewAssessment}
            />
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateAssessment}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Assessment</h4>
                <p className="text-sm text-gray-600">Add a new exam, quiz, or assignment</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={handleConfigureGrading}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Grading Scheme</h4>
                <p className="text-sm text-gray-600">Configure assessment grading rules</p>
              </div>
            </div>
          </button>
          
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Reports</h4>
                <p className="text-sm text-gray-600">Assessment performance reports</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}; 