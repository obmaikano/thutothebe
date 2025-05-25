import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStudentById, clearCurrentStudent, activateStudent, deactivateStudent } from '../studentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import StudentAcademicTab from '../components/StudentAcademicTab';
import { 
  Users, Edit, Trash2, ArrowLeft, UserCheck, UserX, 
  Calendar, Mail, Phone, MapPin, Heart, AlertTriangle,
  GraduationCap, BookOpen, User
} from 'lucide-react';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentStudent, status, error } = useAppSelector(state => state.students);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearCurrentStudent());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    if (currentStudent) {
      dispatch(openModal({
        title: 'Edit Student',
        bodyType: MODAL_BODY_TYPES.STUDENT_EDIT,
        extraObject: currentStudent
      }));
    }
  };

  const handleDelete = () => {
    if (currentStudent) {
      dispatch(openModal({
        title: 'Delete Student',
        bodyType: MODAL_BODY_TYPES.STUDENT_DELETE_CONFIRMATION,
        extraObject: currentStudent
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (currentStudent) {
      try {
        if (currentStudent.active) {
          await dispatch(deactivateStudent(currentStudent.id)).unwrap();
        } else {
          await dispatch(activateStudent(currentStudent.id)).unwrap();
        }
        // Refresh the student data
        dispatch(fetchStudentById(currentStudent.id));
      } catch (error) {
        console.error('Failed to toggle student status:', error);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'GRADUATED': return 'bg-blue-100 text-blue-800';
      case 'WITHDRAWN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <span>Student not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/students')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentStudent.firstName} {currentStudent.lastName}
            </h1>
            <p className="text-gray-600">Student Profile & Academic Information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentStudent.active
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {currentStudent.active ? <UserX size={16} /> : <UserCheck size={16} />}
            {currentStudent.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Student Overview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <Users size={32} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStudent.firstName} {currentStudent.lastName}
              </h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(currentStudent.status)}`}>
                  {currentStudent.status}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  currentStudent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {currentStudent.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Admission: <span className="font-medium">{currentStudent.admissionNumber}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{currentStudent.email}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Academic Year: <span className="font-medium">{currentStudent.academicYear}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'academic', label: 'Academic', icon: BookOpen },
              { id: 'emergency', label: 'Emergency Contact', icon: Phone },
              { id: 'health', label: 'Health Information', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Full Name</span>
                        <div className="font-medium">{currentStudent.firstName} {currentStudent.lastName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Date of Birth</span>
                        <div className="font-medium">{formatDate(currentStudent.dateOfBirth)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Gender</span>
                        <div className="font-medium">{currentStudent.gender}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Email</span>
                        <div className="font-medium">{currentStudent.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Phone</span>
                        <div className="font-medium">{currentStudent.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-1" />
                      <div>
                        <span className="text-sm text-gray-600">Address</span>
                        <div className="font-medium">{currentStudent.address || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <StudentAcademicTab student={currentStudent} />
          )}

          {/* Emergency Contact Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Contact Name</span>
                        <div className="font-medium">{currentStudent.emergencyContactName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Contact Phone</span>
                        <div className="font-medium">{currentStudent.emergencyContactPhone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Relationship</span>
                        <div className="font-medium">{currentStudent.emergencyContactRelation}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Emergency Contact Information</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This contact will be notified in case of emergencies. Please ensure the information is current and accurate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Information Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medical Conditions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-24">
                    {currentStudent.medicalConditions ? (
                      <p className="text-gray-700">{currentStudent.medicalConditions}</p>
                    ) : (
                      <p className="text-gray-500 italic">No medical conditions reported</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Disabilities</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-24">
                    {currentStudent.disabilities ? (
                      <p className="text-gray-700">{currentStudent.disabilities}</p>
                    ) : (
                      <p className="text-gray-500 italic">No disabilities reported</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Heart size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Health Information Privacy</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      This health information is confidential and should only be accessed by authorized personnel for the student's care and safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage; 