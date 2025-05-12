import React from 'react';
import { BookOpen, Calendar, Clock, FileText, Users, Bookmark } from 'lucide-react';
import StatCard from './StatCard';
import Card from '../ui/Card';
import Button from '../ui/Button';

const StudentDashboard: React.FC = () => {
  // Mock data for student dashboard
  const upcomingAssignments = [
    { id: '1', title: 'Mathematics Quiz', course: 'Mathematics', dueDate: '2025-04-15', urgent: true },
    { id: '2', title: 'Science Lab Report', course: 'Biology', dueDate: '2025-04-18', urgent: false },
    { id: '3', title: 'English Essay', course: 'English Literature', dueDate: '2025-04-20', urgent: false },
  ];

  const enrolledCourses = [
    { id: '1', title: 'Mathematics', progress: 75, teacher: 'Mr. Kgosi', img: 'https://images.pexels.com/photos/3808845/pexels-photo-3808845.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: '2', title: 'Biology', progress: 60, teacher: 'Mrs. Tau', img: 'https://images.pexels.com/photos/4226264/pexels-photo-4226264.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: '3', title: 'English Literature', progress: 40, teacher: 'Ms. Pule', img: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: '4', title: 'History', progress: 30, teacher: 'Mr. Moremi', img: 'https://images.pexels.com/photos/4861342/pexels-photo-4861342.jpeg?auto=compress&cs=tinysrgb&w=150' },
  ];

  const announcements = [
    { id: '1', title: 'End of Term Exams', content: 'End of term exams will start on May 10th, 2025.', date: '1 day ago' },
    { id: '2', title: 'School Holiday', content: 'School will be closed on April 25th for a national holiday.', date: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, Student User!</h1>
        <p className="text-blue-100 mb-4">You have 3 assignments due this week. Keep up the good work!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Next class</p>
              <p className="text-white font-medium">Mathematics - Today, 10:00 AM</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Next assignment</p>
              <p className="text-white font-medium">Mathematics Quiz - Due in 2 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Courses Enrolled" 
          value="4" 
          icon={<BookOpen size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Attendance Rate" 
          value="95%" 
          change={2} 
          icon={<Calendar size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Assignments Completed" 
          value="12/15" 
          change={-5}
          icon={<FileText size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Average Grade" 
          value="B+" 
          change={3}
          icon={<Bookmark size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Assignments</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {upcomingAssignments.map(assignment => (
              <div 
                key={assignment.id} 
                className={`p-3 rounded-lg border ${assignment.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{assignment.title}</h3>
                  {assignment.urgent && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Urgent</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    Due: {assignment.dueDate}
                  </div>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Enrolled Courses */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">My Courses</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">View all courses</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden flex">
                <div className="w-1/3">
                  <img 
                    src={course.img} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-3">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.teacher}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Discussion Activity */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Class Discussion</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">Join chat</a>
          </div>
          <div className="flex flex-col h-48 overflow-hidden relative">
            <div className="space-y-3 flex-1">
              <div className="flex items-start">
                <img 
                  src="https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Student 1" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="bg-gray-100 rounded-lg p-2 text-sm">
                  <p className="text-gray-800">Has anyone completed the math problems yet?</p>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex items-start justify-end">
                <div className="bg-blue-100 rounded-lg p-2 text-sm mr-2">
                  <p className="text-gray-800">I'm still working on them. Question 3 is tricky.</p>
                  <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                </div>
                <img 
                  src="https://images.pexels.com/photos/5212307/pexels-photo-5212307.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="You" 
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white pt-12 pb-2 flex items-center justify-center">
              <Button size="sm" leftIcon={<Users size={16} />}>View Discussion</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;