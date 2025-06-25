import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchDepartmentById, clearCurrentDepartment, activateDepartment, deactivateDepartment, removeSubjectFromDepartment, removeTeacherFromDepartment } from '../departmentsSlice';
import { 
  Building2, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  UserCheck,
  Calendar,
  School,
  MapPin,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Copy,
  Share2,
  Download,
  Settings,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Activity,
  AlertCircle,
  FileText,
  Eye,
  Clock,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';

const DepartmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDepartment, status, error } = useAppSelector(state => state.departments);
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'subjects' | 'analytics' | 'performance' | 'resources'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [removingSubjectId, setRemovingSubjectId] = useState<number | null>(null);
  const [removingTeacherId, setRemovingTeacherId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchDepartmentById(parseInt(id)));
    }
    return () => {
      dispatch(clearCurrentDepartment());
    };
  }, [dispatch, id]);

  const canManageDepartments = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD'].includes(user?.role || '');
  const canEditDepartment = canManageDepartments && (
    ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role || '') ||
    (user?.role === 'DEPARTMENT_HEAD' && currentDepartment?.departmentHeadId === user?.id)
  );

  const canViewAnalytics = user && [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  const handleDataRefresh = async () => {
    if (!currentDepartment) return;
    
    try {
      setIsLoading(true);
      await dispatch(fetchDepartmentById(currentDepartment.id)).unwrap();
    } catch (error) {
      console.error('Failed to refresh department data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Edit Department',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_EDIT,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleDelete = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Delete Department',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_DELETE_CONFIRMATION,
        extraObject: currentDepartment
      }));
    }
  };

  const handleDuplicate = () => {
    if (currentDepartment) {
      const duplicateData = {
        ...currentDepartment,
        name: `${currentDepartment.name} (Copy)`,
        id: undefined
      };
      dispatch(openModal({
        title: 'Duplicate Department',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ADD_NEW,
        extraObject: duplicateData,
        size: 'lg'
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!currentDepartment) return;
    
    try {
      if (currentDepartment.active) {
        await dispatch(deactivateDepartment(currentDepartment.id)).unwrap();
      } else {
        await dispatch(activateDepartment(currentDepartment.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle department status:', error);
    }
  };

  const handleExport = () => {
    if (!currentDepartment) return;
    
    const exportData = {
      department: currentDepartment,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.firstName + ' ' + user?.lastName || 'Unknown User',
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `department-${currentDepartment.name}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = () => {
    if (!currentDepartment) return;
    
    const shareData = {
      title: currentDepartment.name,
      text: `Check out this department: ${currentDepartment.name}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Department link copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  };

  const handleAssignHead = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Assign Department Head',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_HEAD,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleAssignTeacher = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Manage Teachers',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_TEACHER,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleAssignSubject = () => {
    if (currentDepartment) {
      dispatch(openModal({
        title: 'Manage Subjects',
        bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_SUBJECT,
        extraObject: currentDepartment,
        size: 'lg'
      }));
    }
  };

  const handleRemoveSubject = async (subjectName: string, subjectIndex: number) => {
    if (!currentDepartment || !currentDepartment.subjectIds) return;
    
    try {
      const subjectId = currentDepartment.subjectIds[subjectIndex];
      if (!subjectId) {
        console.error('Subject ID not found for index:', subjectIndex);
        return;
      }

      setRemovingSubjectId(subjectId);
      await dispatch(removeSubjectFromDepartment({
        departmentId: currentDepartment.id,
        subjectId: subjectId
      })).unwrap();
      
      // The Redux slice will automatically update the currentDepartment
      // with the new data from the API response
    } catch (error) {
      console.error('Failed to remove subject from department:', error);
    } finally {
      setRemovingSubjectId(null);
    }
  };

  const handleRemoveTeacher = async (teacherName: string, teacherIndex: number) => {
    if (!currentDepartment || !currentDepartment.teacherIds) return;
    
    try {
      const teacherId = currentDepartment.teacherIds[teacherIndex];
      if (!teacherId) {
        console.error('Teacher ID not found for index:', teacherIndex);
        return;
      }

      setRemovingTeacherId(teacherId);
      await dispatch(removeTeacherFromDepartment({
        departmentId: currentDepartment.id,
        teacherId: teacherId
      })).unwrap();
      
      // The Redux slice will automatically update the currentDepartment
      // with the new data from the API response
    } catch (error) {
      console.error('Failed to remove teacher from department:', error);
    } finally {
      setRemovingTeacherId(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearCurrentDepartment())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Department not found</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/departments')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentDepartment.name}
            </h1>
            <p className="text-gray-600">Department Details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            currentDepartment.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {currentDepartment.active ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={handleDataRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            title="Refresh department data"
          >
            <Clock className="h-4 w-4 mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          {canManageDepartments && (
            <button
              onClick={handleAssignHead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              title="Assign department head"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {currentDepartment.departmentHeadName ? 'Change Head' : 'Assign Head'}
            </button>
          )}
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Department
          </button>
        </div>
      </div>

      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentDepartment.teacherIds?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Assigned Teachers</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentDepartment.subjectIds?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Department Subjects</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentDepartment.departmentHeadName ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-500">Department Head</div>
            </div>
          </div>
          {canManageDepartments && (
            <button
              onClick={handleAssignHead}
              className="mt-3 w-full text-left text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              {currentDepartment.departmentHeadName ? 'Change Department Head' : 'Assign Department Head'}
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentDepartment.schoolName || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">School</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'teachers', label: 'Teachers', icon: Users },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, requiresPermission: canViewAnalytics },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'resources', label: 'Resources', icon: Target }
          ].filter(tab => !tab.requiresPermission || tab.requiresPermission).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'overview' | 'teachers' | 'subjects' | 'analytics' | 'performance' | 'resources')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Department Name</div>
                    <div className="text-sm text-gray-600">{currentDepartment.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">School</div>
                    <div className="text-sm text-gray-600">{currentDepartment.schoolName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Department Head</div>
                    <div className="text-sm text-gray-600">{currentDepartment.departmentHeadName || 'Not assigned'}</div>
                  </div>
                  {canManageDepartments && (
                    <button
                      onClick={handleAssignHead}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      {currentDepartment.departmentHeadName ? 'Change' : 'Assign'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Status</div>
                    <div className="text-sm text-gray-600">
                      {currentDepartment.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
              
              {currentDepartment.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{currentDepartment.description}</p>
                </div>
              )}
            </div>

            {/* Department Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Teachers</span>
                  <span className="text-sm font-medium">{currentDepartment.teacherIds?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Subjects</span>
                  <span className="text-sm font-medium">{currentDepartment.subjectIds?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Department Head</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{currentDepartment.departmentHeadName ? 'Assigned' : 'Not assigned'}</span>
                    {canManageDepartments && (
                      <button
                        onClick={handleAssignHead}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        {currentDepartment.departmentHeadName ? 'Change' : 'Assign'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(currentDepartment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Department Teachers ({currentDepartment.teacherIds?.length || 0})
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleAssignTeacher}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Manage Teachers
                  </button>
                </div>
              </div>
            </div>
            
            {currentDepartment.teacherNames?.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by assigning teachers to this department.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAssignTeacher}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Teachers
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDepartment.teacherNames?.map((teacherName, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {teacherName}
                              </div>
                              <div className="text-sm text-gray-500">Teacher</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          N/A
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {canManageDepartments && (
                            <button
                              onClick={() => handleRemoveTeacher(teacherName, index)}
                              disabled={removingTeacherId === currentDepartment.teacherIds?.[index]}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove from department"
                            >
                              {removingTeacherId === currentDepartment.teacherIds?.[index] ? (
                                <div className="loading loading-spinner loading-xs"></div>
                              ) : (
                                <UserMinus className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Department Subjects ({currentDepartment.subjectIds?.length || 0})
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleAssignSubject}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Manage Subjects
                  </button>
                </div>
              </div>
            </div>
            
            {currentDepartment.subjectNames?.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by assigning subjects to this department.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAssignSubject}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Subjects
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDepartment.subjectNames?.map((subjectName, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-green-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {subjectName}
                              </div>
                              <div className="text-sm text-gray-500">Subject</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subjectName.substring(0, 3).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {canManageDepartments && (
                            <button
                              onClick={() => handleRemoveSubject(subjectName, index)}
                              disabled={removingSubjectId === currentDepartment.subjectIds?.[index]}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove from department"
                            >
                              {removingSubjectId === currentDepartment.subjectIds?.[index] ? (
                                <div className="loading loading-spinner loading-xs"></div>
                              ) : (
                                <UserMinus className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Analytics</h3>
            <p className="text-gray-600 mb-6">Detailed analytics and insights coming soon.</p>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Metrics</h3>
            <p className="text-gray-600 mb-6">Department performance tracking coming soon.</p>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Resources</h3>
            <p className="text-gray-600 mb-6">Resource management coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetailsPage; 