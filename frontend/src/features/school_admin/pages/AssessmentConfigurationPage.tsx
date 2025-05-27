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

// Card component for statistics
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
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
    },
    {
      id: 4,
      title: 'History Project - Independence',
      subject: 'History',
      class: 'Form 3A',
      type: 'PROJECT',
      status: 'ACTIVE',
      dueDate: '2025-05-15',
      totalMarks: 75,
      submissions: 15,
      totalStudents: 28,
      averageScore: 72.8,
      teacher: 'Mr. Molefe'
    },
    {
      id: 5,
      title: 'Biology Lab Report',
      subject: 'Biology',
      class: 'Form 2A',
      type: 'ASSIGNMENT',
      status: 'COMPLETED',
      dueDate: '2025-04-10',
      totalMarks: 40,
      submissions: 24,
      totalStudents: 24,
      averageScore: 78.3,
      teacher: 'Dr. Seretse'
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
      assessment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === '' || assessment.type === filterType;
    const matchesStatus = filterStatus === '' || assessment.status === filterStatus;
    const matchesClass = selectedClass === null || assessment.class.includes(classes.find(c => c.id === selectedClass)?.name || '');

    return matchesSearch && matchesType && matchesStatus && matchesClass;
  });

  const getStatistics = () => {
    const total = assessments.length;
    const active = assessments.filter(a => a.status === 'ACTIVE').length;
    const draft = assessments.filter(a => a.status === 'DRAFT').length;
    const completed = assessments.filter(a => a.status === 'COMPLETED').length;

    return { total, active, draft, completed };
  };

  const stats = getStatistics();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EXAM':
        return 'bg-red-100 text-red-800';
      case 'QUIZ':
        return 'bg-blue-100 text-blue-800';
      case 'ASSIGNMENT':
        return 'bg-green-100 text-green-800';
      case 'PROJECT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assessments by title, subject, class, or teacher..."
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
      </div>

      {/* Assessments Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject & Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                        <div className="text-sm text-gray-500">by {assessment.teacher}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assessment.subject}</div>
                    <div className="text-sm text-gray-500">{assessment.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(assessment.type)}`}>
                        {assessment.type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                        {assessment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(assessment.dueDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assessment.submissions}/{assessment.totalStudents}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(assessment.submissions / assessment.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assessment.averageScore ? `${assessment.averageScore}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      out of {assessment.totalMarks} marks
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewAssessment(assessment)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditAssessment(assessment)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit Assessment"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAssessment(assessment)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Assessment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || filterType || filterStatus || selectedClass ? 'No assessments found matching your criteria' : 'No assessments found'}
            </div>
            {!searchTerm && !filterType && !filterStatus && !selectedClass && (
              <button
                onClick={handleCreateAssessment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={16} />
                Create First Assessment
              </button>
            )}
          </div>
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