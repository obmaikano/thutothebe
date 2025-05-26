import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../features/common/headerSlice';
import studentApi from '../../../api/services/studentApi';
import { 
    BookOpen, 
    Clock, 
    Users, 
    Calendar, 
    GraduationCap, 
    AlertTriangle,
    Search,
    Eye,
    FileText,
    User,
    Award,
    TrendingUp
} from 'lucide-react';

interface Course {
    id: number;
    name: string;
    code: string;
    description?: string;
    term: string;
    year: number;
    type: string;
    credits?: number;
    teacherName?: string;
    progress?: number;
}

const StudentCoursesPage = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<any>(null);
    const [noStudentRecord, setNoStudentRecord] = useState(false);
    const [creatingStudent, setCreatingStudent] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [termFilter, setTermFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Courses" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchStudentCourses = async () => {
            if (!isAuthenticated || !user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setNoStudentRecord(false);
                
                console.log('Fetching student record for user ID:', user.id);
                console.log('User object:', user);

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

                // Fetch courses for the student using student ID
                const coursesResponse = await studentApi.getCourses(student.id);
                console.log('Courses API response:', coursesResponse.data);
                
                if (coursesResponse.data.status === 'SUCCESS') {
                    const coursesData = (coursesResponse.data.data as any[]) || [];
                    console.log('Fetched courses:', coursesData);
                    setCourses(coursesData);
                } else {
                    console.error('Failed to fetch courses:', coursesResponse.data.message);
                    setCourses([]);
                }
            } catch (err: any) {
                console.error('Error fetching student courses:', err);
                if (err.response?.status === 404) {
                    setNoStudentRecord(true);
                    setError('Student profile not found. Your account may not be fully set up yet. Please contact your administrator to complete your student profile setup.');
                } else if (err.response?.status === 401) {
                    setError('Authentication failed. Please log in again.');
                    navigate('/login');
                } else if (err.response?.status === 403) {
                    setError('You do not have permission to access this resource.');
                } else {
                    setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentCourses();
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

    const getCourseTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'core':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'elective':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'practical':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Filter courses based on search and filters
    const filteredCourses = courses.filter((course: Course) => {
        const matchesSearch = 
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (course.teacherName && course.teacherName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTerm = 
            termFilter === '' || course.term === termFilter;

        const matchesType = 
            typeFilter === '' || course.type === typeFilter;

        return matchesSearch && matchesTerm && matchesType;
    });

    // Get unique terms and types for filters
    const uniqueTerms = [...new Set(courses.map(c => c.term))];
    const uniqueTypes = [...new Set(courses.map(c => c.type))];

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
                    <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                    <p className="text-gray-600 mt-2">View your enrolled courses for this academic year</p>
                    {studentData && (
                        <p className="text-sm text-gray-500 mt-1">
                            Student: {studentData.firstName} {studentData.lastName} ({studentData.admissionNumber})
                        </p>
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    {filteredCourses.length} of {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses by name, code, or instructor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select 
                        value={termFilter}
                        onChange={(e) => setTermFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Terms</option>
                        {uniqueTerms.map(term => (
                            <option key={term} value={term}>{term}</option>
                        ))}
                    </select>
                    <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Summary */}
            {courses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                <BookOpen size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                                <div className="text-sm text-gray-500">Total Courses</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <Award size={20} className="text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {courses.filter(c => c.type?.toLowerCase() === 'core').length}
                                </div>
                                <div className="text-sm text-gray-500">Core Courses</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                <GraduationCap size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {courses.filter(c => c.type?.toLowerCase() === 'elective').length}
                                </div>
                                <div className="text-sm text-gray-500">Electives</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                <TrendingUp size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) || 0}%
                                </div>
                                <div className="text-sm text-gray-500">Avg Progress</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Courses Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {courses.length === 0 ? 'No courses found' : 'No courses match your filters'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {courses.length === 0 
                                ? "You are not currently enrolled in any courses. Please contact your administrator."
                                : "Try adjusting your search terms or filters to find what you're looking for."
                            }
                        </p>
                        {studentData && courses.length === 0 && (
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
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Instructor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Term
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <BookOpen className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                                    {course.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {course.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{course.code}</div>
                                            <div className="text-sm text-gray-500">{course.year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {course.teacherName ? (
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                                    {course.teacherName}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">No instructor assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{course.term}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCourseTypeColor(course.type)}`}>
                                                {course.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {course.progress !== undefined ? (
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                        <div 
                                                            className="bg-blue-600 h-2 rounded-full" 
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-900">{course.progress}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Course Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="View Assignments"
                                                >
                                                    <FileText size={16} />
                                                </button>
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

export default StudentCoursesPage; 