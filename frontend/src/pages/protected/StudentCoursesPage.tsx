import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import studentApi from '../../api/services/studentApi';
import { BookOpen, Clock, Users, Calendar, GraduationCap, AlertTriangle } from 'lucide-react';

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
            <div className="flex justify-center items-center h-64">
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
                                        <p className="font-medium">What you can do:</p>
                                        <ul className="mt-2 list-disc list-inside space-y-1">
                                            <li>Contact your school administrator to complete your student profile setup</li>
                                            <li>Ensure your account has been properly enrolled in the system</li>
                                            <li>Check that you have been assigned to a class and school</li>
                                        </ul>
                                        <div className="mt-4">
                                            <p className="text-sm">
                                                <strong>Your User ID:</strong> {user?.id} <br />
                                                <strong>Your Email:</strong> {user?.email} <br />
                                                <strong>Your Role:</strong> {user?.role}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                onClick={createStudentRecord}
                                                disabled={creatingStudent}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                            >
                                                {creatingStudent ? 'Creating...' : 'Create Student Profile'}
                                            </button>
                                            <p className="text-xs text-yellow-600 mt-2">
                                                This will attempt to create your student profile automatically. You must be assigned to a school for this to work.
                                            </p>
                                        </div>
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
                    {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
                </div>
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12">
                    <div className="text-center">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You are not currently enrolled in any courses. Please contact your administrator.
                        </p>
                        {studentData && (
                            <div className="mt-4 text-xs text-gray-400">
                                <p>Student ID: {studentData.id}</p>
                                <p>Class: {studentData.classId ? `Class ID ${studentData.classId}` : 'Not assigned to a class'}</p>
                                <p>Status: {studentData.status}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{course.code}</p>
                                    {course.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <BookOpen className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCourseTypeColor(course.type)}`}>
                                        {course.type}
                                    </span>
                                    {course.credits && (
                                        <span className="text-sm text-gray-500">{course.credits} credits</span>
                                    )}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {course.term} {course.year}
                                </div>

                                {course.teacherName && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        {course.teacherName}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                                        View Details
                                    </button>
                                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                                        Resources
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Course Summary */}
            {courses.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                            <div className="text-sm text-blue-600">Total Courses</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {courses.reduce((sum, course) => sum + (course.credits || 0), 0)}
                            </div>
                            <div className="text-sm text-green-600">Total Credits</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {new Set(courses.map(course => course.term)).size}
                            </div>
                            <div className="text-sm text-purple-600">Terms</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCoursesPage; 