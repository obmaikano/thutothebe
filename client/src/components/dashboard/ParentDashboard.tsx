import React from 'react';
import { Calendar, BookOpen, Clock, Bell, MessageSquare, BarChart2 } from 'lucide-react';
import StatCard from './StatCard';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ParentDashboard: React.FC = () => {
  // Mock data for parent dashboard
  const children = [
    { 
      id: '1', 
      name: 'Thabiso Kgosi', 
      grade: 'Grade 10', 
      school: 'Gaborone Secondary School',
      avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150',
      attendance: 92,
      grades: {
        Mathematics: 'B+',
        Science: 'A-',
        English: 'B',
        History: 'C+',
      },
      upcomingAssignments: [
        { title: 'Mathematics Quiz', dueDate: 'Tomorrow', status: 'Not started' },
        { title: 'Science Lab Report', dueDate: 'In 3 days', status: 'In progress' },
      ]
    },
    { 
      id: '2', 
      name: 'Lesedi Kgosi', 
      grade: 'Grade 8', 
      school: 'Gaborone Secondary School',
      avatar: 'https://images.pexels.com/photos/3850543/pexels-photo-3850543.jpeg?auto=compress&cs=tinysrgb&w=150',
      attendance: 95,
      grades: {
        Mathematics: 'A',
        Science: 'B+',
        English: 'A-',
        History: 'B',
      },
      upcomingAssignments: [
        { title: 'English Essay', dueDate: 'Tomorrow', status: 'Not started' },
        { title: 'History Project', dueDate: 'In 5 days', status: 'Not started' },
      ]
    }
  ];

  const announcements = [
    { id: '1', title: 'Parent-Teacher Meeting', content: 'Parent-teacher meetings will be held on May 5th, 2025.', date: '2 days ago' },
    { id: '2', title: 'School Holiday', content: 'School will be closed on April 25th for a national holiday.', date: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, Parent User!</h1>
        <p className="text-blue-100 mb-4">Track your children's education journey and stay connected with their teachers.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Upcoming Event</p>
              <p className="text-white font-medium">Parent-Teacher Meeting - May 5th, 2025</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Bell size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Recent Notification</p>
              <p className="text-white font-medium">Thabiso has a mathematics quiz tomorrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Child Selection Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {children.map((child, index) => (
            <button 
              key={child.id}
              className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
                index === 0 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100'
              }`}
            >
              <img 
                src={child.avatar}
                alt={child.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Child Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Overall Grade" 
          value="B+" 
          change={5} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Attendance Rate" 
          value="92%" 
          change={-2} 
          icon={<Calendar size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Assignments Due" 
          value="2" 
          icon={<Clock size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Teacher Messages" 
          value="3" 
          change={2}
          icon={<MessageSquare size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Subject Grades</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Term 2, 2025</option>
              <option>Term 1, 2025</option>
              <option>All Terms</option>
            </select>
          </div>
          <div className="space-y-3">
            {Object.entries(children[0].grades).map(([subject, grade]) => (
              <div key={subject} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="font-medium">{subject}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                  grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                  grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {grade}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline">View Detailed Report</Button>
          </div>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Assignments</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {children[0].upcomingAssignments.map((assignment, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  assignment.dueDate === 'Tomorrow' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <h3 className="font-medium">{assignment.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    Due: {assignment.dueDate}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assignment.status === 'Not started' ? 'bg-red-100 text-red-700' : 
                    assignment.status === 'In progress' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline">Check All Assignments</Button>
          </div>
        </Card>

        {/* Attendance & Announcements */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">School Announcements</h2>
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline">View All Announcements</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Academic Progress Tracker */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Academic Progress</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>This Academic Year</option>
              <option>Previous Year</option>
              <option>All Years</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Current vs. Last Term</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
                  +5%
                </div>
                <p className="text-sm text-gray-500 mt-2">Overall improvement</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Class Ranking</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-700 text-2xl font-bold">
                  12<span className="text-sm align-super">th</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Out of 35 students</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Key Strength</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 text-purple-700 font-bold">
                  <span className="text-xl">Science</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Consistently high scores</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="mb-2 flex justify-between">
              <h3 className="text-sm font-medium text-gray-700">Performance Across Subjects</h3>
              <a href="#" className="text-sm text-blue-600 hover:underline">View detailed report</a>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {Object.entries(children[0].grades).map(([subject, grade]) => (
                <div key={subject} className="min-w-[120px] bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-800">{subject}</p>
                  <div className={`mt-2 text-lg font-bold ${
                    grade.startsWith('A') ? 'text-green-600' :
                    grade.startsWith('B') ? 'text-blue-600' :
                    grade.startsWith('C') ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {grade}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;