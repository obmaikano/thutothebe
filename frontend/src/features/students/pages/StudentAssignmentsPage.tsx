import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../features/common/headerSlice';
import studentApi from '../../../api/services/studentApi';
import { 
    FileText, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    AlertTriangle, 
    Search,
    Filter,
    Eye,
    Upload,
    Download,
    BookOpen,
    User
} from 'lucide-react';

interface Assignment {
    id: number;
    title: string;
    description?: string;
    dueDate: string;
    courseName: string;
    courseCode: string;
    status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
    submissionDate?: string;
    grade?: number;
    maxGrade?: number;
    feedback?: string;
    instructorName?: string;
    type?: string;
    urgent?: boolean;
}

const StudentAssignmentsPage = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<any>(null);
    const [noStudentRecord, setNoStudentRecord] = useState(false);
    const [creatingStudent, setCreatingStudent] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Assignments" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchStudentAssignments = async () => {
            if (!isAuthenticated || !user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setNoStudentRecord(false);
                
                console.log('Fetching student record for user ID:', user.id);

                // Get student record first using user ID
                const studentResponse = await studentApi.getByUserId(user.id);
                console.log('Student API response:', studentResponse.data);
                
                if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
                    console.error('Failed to get student record. Response:', studentResponse.data);
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet.');
                    setLoading(false);
                    return;
                }

                const student = Array.isArray(studentResponse.data.data) 
                    ? studentResponse.data.data[0] 
                    : studentResponse.data.data;

                if (!student) {
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet.');
                    setLoading(false);
                    return;
                }

                setStudentData(student);
                console.log('Student data:', student);

                // Fetch assignments for the student using student ID
                const assignmentsResponse = await studentApi.getAssignments(student.id);
                console.log('Assignments API response:', assignmentsResponse.data);
                
                if (assignmentsResponse.data.status === 'SUCCESS') {
                    const assignmentsData = (assignmentsResponse.data.data as any[]) || [];
                    console.log('Fetched assignments:', assignmentsData);
                    setAssignments(assignmentsData);
                } else {
                    console.error('Failed to fetch assignments:', assignmentsResponse.data.message);
                    setAssignments([]);
                }
            } catch (err: any) {
                console.error('Error fetching student assignments:', err);
                if (err.response?.status === 404) {
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet. Please contact your administrator to complete your student profile setup.');
                } else if (err.response?.status === 401) {
                    setError('Authentication failed. Please log in again.');
                    navigate('/login');
                } else if (err.response?.status === 403) {
                    setError('You do not have permission to access this resource.');
                } else {
                    setError(err.response?.data?.message || err.message || 'Failed to fetch assignments');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentAssignments();
    }, [user?.id, isAuthenticated, navigate]);

    const createStudentRecord = async () => {
        if (!user?.id) return;
        
        try {
            setCreatingStudent(true);
            console.log('Creating student record for user ID:', user.id);
            
            const response = await studentApi.createForUser(user.id);
            console.log('Create student response:', response.data);
            
            if (response.data.status === 'SUCCESS') {
                // Student record created successfully, refresh the page data
                setNoStudentRecord(false);
                setError(null);
                // Trigger a re-fetch of the data
                window.location.reload();
            } else {
                setError('Failed to create student record: ' + response.data.message);
            }
        } catch (err: any) {
            console.error('Error creating student record:', err);
            if (err.response?.status === 400 && err.response?.data?.message?.includes('school')) {
                setError('Cannot create student record: You must be assigned to a school first. Please contact your administrator.');
            } else {
                setError('Failed to create student record: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setCreatingStudent(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUBMITTED':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'GRADED':
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'OVERDUE':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUBMITTED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'GRADED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'OVERDUE':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dueDate: string, status: string) => {
        return new Date(dueDate) < new Date() && status === 'PENDING';
    };

    // Filter assignments based on search and filters
    const filteredAssignments = assignments.filter((assignment: Assignment) => {
        const matchesSearch = 
            assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (assignment.description && assignment.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = 
            statusFilter === '' || 
            assignment.status === statusFilter ||
            (statusFilter === 'OVERDUE' && isOverdue(assignment.dueDate, assignment.status));

        const matchesCourse = 
            courseFilter === '' || assignment.courseName === courseFilter;

        return matchesSearch && matchesStatus && matchesCourse;
    });

    // Get unique courses for filter
    const uniqueCourses = [...new Set(assignments.map(a => a.courseName))];

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
                    <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className={`border rounded-lg p-6 ${noStudentRecord ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className={`h-5 w-5 ${noStudentRecord ? 'text-yellow-400' : 'text-red-400'}`} />
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${noStudentRecord ? 'text-yellow-800' : 'text-red-800'}`}>
                                {noStudentRecord ? 'Student Profile Setup Required' : 'Error'}
                            </h3>
                            <div className={`mt-2 text-sm ${noStudentRecord ? 'text-yellow-700' : 'text-red-700'}`}>
                                <p>{error}</p>
                                {noStudentRecord && (
                                    <div className="mt-4">
                                        <button
                                            onClick={createStudentRecord}
                                            disabled={creatingStudent}
                                            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            {creatingStudent ? 'Creating...' : 'Create Student Profile'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
                    <p className="text-gray-600 mt-2">View and manage your course assignments</p>
                    {studentData && (
                        <p className="text-sm text-gray-500 mt-1">
                            Student: {studentData.firstName} {studentData.lastName} ({studentData.admissionNumber})
                        </p>
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    {filteredAssignments.length} of {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search assignments by title, course, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="GRADED">Graded</option>
                        <option value="OVERDUE">Overdue</option>
                    </select>
                    <select 
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Courses</option>
                        {uniqueCourses.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Summary */}
            {assignments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                <FileText size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
                                <div className="text-sm text-gray-500">Total Assignments</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {assignments.filter(a => a.status === 'PENDING' && !isOverdue(a.dueDate, a.status)).length}
                                </div>
                                <div className="text-sm text-gray-500">Pending</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {assignments.filter(a => a.status === 'SUBMITTED' || a.status === 'GRADED').length}
                                </div>
                                <div className="text-sm text-gray-500">Completed</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg mr-3">
                                <XCircle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {assignments.filter(a => isOverdue(a.dueDate, a.status)).length}
                                </div>
                                <div className="text-sm text-gray-500">Overdue</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assignments Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {assignments.length === 0 ? 'No assignments found' : 'No assignments match your filters'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {assignments.length === 0 
                                ? "You don't have any assignments yet. Check back later or contact your instructor."
                                : "Try adjusting your search terms or filters to find what you're looking for."
                            }
                        </p>
                        {studentData && assignments.length === 0 && (
                            <div className="mt-4 text-xs text-gray-400">
                                <p>Student ID: {studentData.id}</p>
                                <p>Class: {studentData.classId ? `Class ID ${studentData.classId}` : 'Not assigned to a class'}</p>
                                <p>Status: {studentData.status}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assignment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grade
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                                    {assignment.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {assignment.description}
                                                        </div>
                                                    )}
                                                    {assignment.instructorName && (
                                                        <div className="text-xs text-gray-400 flex items-center mt-1">
                                                            <User className="h-3 w-3 mr-1" />
                                                            {assignment.instructorName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{assignment.courseName}</div>
                                            <div className="text-sm text-gray-500">{assignment.courseCode}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(assignment.dueDate)}</div>
                                            {isOverdue(assignment.dueDate, assignment.status) && (
                                                <div className="text-xs text-red-500 font-medium">Overdue</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(isOverdue(assignment.dueDate, assignment.status) ? 'OVERDUE' : assignment.status)}`}>
                                                {getStatusIcon(isOverdue(assignment.dueDate, assignment.status) ? 'OVERDUE' : assignment.status)}
                                                <span className="ml-1">
                                                    {isOverdue(assignment.dueDate, assignment.status) ? 'OVERDUE' : assignment.status}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {assignment.status === 'GRADED' && assignment.grade !== undefined ? (
                                                <div className="text-sm">
                                                    <span className="font-medium text-gray-900">{assignment.grade}%</span>
                                                    {assignment.maxGrade && (
                                                        <span className="text-gray-500"> / {assignment.maxGrade}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                
                                                {assignment.status === 'PENDING' && !isOverdue(assignment.dueDate, assignment.status) && (
                                                    <button 
                                                        className="text-green-600 hover:text-green-900 p-1 rounded"
                                                        title="Submit Assignment"
                                                    >
                                                        <Upload size={16} />
                                                    </button>
                                                )}
                                                
                                                {(assignment.status === 'SUBMITTED' || assignment.status === 'GRADED') && (
                                                    <button 
                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                        title="Download Submission"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAssignmentsPage; 