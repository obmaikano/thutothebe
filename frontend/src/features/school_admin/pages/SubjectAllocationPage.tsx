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
  CheckCircle, Clock, AlertTriangle, Eye, User
} from 'lucide-react';

// Card component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Subject allocation card component
const SubjectAllocationCard: React.FC<{
  allocation: any;
  onEdit: (allocation: any) => void;
  onRemove: (allocation: any) => void;
  onViewProgress: (allocation: any) => void;
}> = ({ allocation, onEdit, onRemove, onViewProgress }) => (
  <Card className="hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{allocation.subject}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{allocation.teacher}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{allocation.class}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{allocation.term}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            allocation.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            allocation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {allocation.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            allocation.progress >= 80 ? 'bg-green-100 text-green-800' :
            allocation.progress >= 50 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {allocation.progress}% Complete
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onViewProgress(allocation)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEdit(allocation)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onRemove(allocation)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Lessons:</span>
        <span className="ml-2 font-medium">{allocation.completedLessons}/{allocation.totalLessons}</span>
      </div>
      <div>
        <span className="text-gray-500">Assessments:</span>
        <span className="ml-2 font-medium">{allocation.assessments}</span>
      </div>
      <div>
        <span className="text-gray-500">Last Update:</span>
        <span className="ml-2 font-medium">{allocation.lastUpdate}</span>
      </div>
    </div>
  </Card>
);

export const SubjectAllocationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { classes } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const { subjects } = useAppSelector(state => state.subjects);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  // Mock allocation data - would come from API
  const [allocations] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Mr. Kgosi Moeti',
      teacherId: 1,
      class: 'Form 1A',
      classId: 1,
      term: 'Term 1 2025',
      status: 'ACTIVE',
      progress: 75,
      completedLessons: 15,
      totalLessons: 20,
      assessments: 3,
      lastUpdate: '2025-04-15'
    },
    {
      id: 2,
      subject: 'English',
      teacher: 'Mrs. Sarah Phiri',
      teacherId: 2,
      class: 'Form 1A',
      classId: 1,
      term: 'Term 1 2025',
      status: 'ACTIVE',
      progress: 60,
      completedLessons: 12,
      totalLessons: 20,
      assessments: 2,
      lastUpdate: '2025-04-14'
    },
    {
      id: 3,
      subject: 'Science',
      teacher: 'Dr. Moses Tebogo',
      teacherId: 3,
      class: 'Form 2B',
      classId: 2,
      term: 'Term 1 2025',
      status: 'PENDING',
      progress: 30,
      completedLessons: 6,
      totalLessons: 20,
      assessments: 1,
      lastUpdate: '2025-04-10'
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
        console.error('Failed to load subject allocation data:', error);
      }
    };

    loadData();
  }, [dispatch]);

  const handleAllocateSubject = () => {
    dispatch(openModal({
      title: 'Allocate Subject to Teacher',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ASSIGN_TEACHER,
      extraObject: { 
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleEditAllocation = (allocation: any) => {
    dispatch(openModal({
      title: 'Edit Subject Allocation',
      bodyType: MODAL_BODY_TYPES.SUBJECT_EDIT,
      extraObject: { 
        allocation,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleRemoveAllocation = (allocation: any) => {
    dispatch(openModal({
      title: 'Remove Subject Allocation',
      bodyType: MODAL_BODY_TYPES.SUBJECT_DELETE_CONFIRMATION,
      extraObject: allocation
    }));
  };

  const handleViewProgress = (allocation: any) => {
    dispatch(openModal({
      title: 'Curriculum Progress',
      bodyType: MODAL_BODY_TYPES.REPORT_GENERATE,
      extraObject: { 
        allocation,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const handleBulkAllocation = () => {
    dispatch(openModal({
      title: 'Bulk Subject Allocation',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ASSIGN_TEACHER,
      extraObject: { 
        bulk: true,
        classes,
        teachers,
        subjects
      }
    }));
  };

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = 
      allocation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = filterSubject === '' || allocation.subject === filterSubject;
    const matchesStatus = filterStatus === '' || allocation.status === filterStatus;
    const matchesClass = selectedClass === null || allocation.classId === selectedClass;

    return matchesSearch && matchesSubject && matchesStatus && matchesClass;
  });

  const getStatistics = () => {
    const total = allocations.length;
    const active = allocations.filter(a => a.status === 'ACTIVE').length;
    const pending = allocations.filter(a => a.status === 'PENDING').length;
    const avgProgress = allocations.reduce((sum, a) => sum + a.progress, 0) / allocations.length;

    return { total, active, pending, avgProgress: Math.round(avgProgress) };
  };

  const stats = getStatistics();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Allocation</h1>
          <p className="text-gray-600 mt-2">Allocate subjects to teachers and monitor curriculum delivery</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBulkAllocation}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Users size={16} />
            Bulk Allocation
          </button>
          <button 
            onClick={handleAllocateSubject} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Allocate Subject
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Allocations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
            <BookOpen className="text-blue-600" size={24} />
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgProgress}%</p>
            </div>
            <BarChart3 className="text-purple-600" size={24} />
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
              placeholder="Search allocations..."
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

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-500" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Allocations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAllocations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No subject allocations found for the selected criteria.</p>
          </div>
        ) : (
          filteredAllocations.map(allocation => (
            <SubjectAllocationCard
              key={allocation.id}
              allocation={allocation}
              onEdit={handleEditAllocation}
              onRemove={handleRemoveAllocation}
              onViewProgress={handleViewProgress}
            />
          ))
        )}
      </div>

      {/* Teacher Workload Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Workload Overview</h3>
        <div className="space-y-4">
          {teachers.slice(0, 5).map(teacher => {
            const teacherAllocations = allocations.filter(a => a.teacherId === teacher.id);
            const workload = teacherAllocations.length;
            const avgProgress = teacherAllocations.length > 0 
              ? teacherAllocations.reduce((sum, a) => sum + a.progress, 0) / teacherAllocations.length 
              : 0;

            return (
              <div key={teacher.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</h4>
                    <p className="text-sm text-gray-600">{workload} subjects allocated</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{Math.round(avgProgress)}% Progress</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workload <= 3 ? 'bg-green-100 text-green-800' :
                    workload <= 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {workload <= 3 ? 'Light' : workload <= 5 ? 'Moderate' : 'Heavy'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleAllocateSubject}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Allocate Subject</h4>
                <p className="text-sm text-gray-600">Assign a subject to a teacher</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={handleBulkAllocation}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Bulk Allocation</h4>
                <p className="text-sm text-gray-600">Allocate multiple subjects at once</p>
              </div>
            </div>
          </button>
          
          <button
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Progress Reports</h4>
                <p className="text-sm text-gray-600">View curriculum delivery reports</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}; 