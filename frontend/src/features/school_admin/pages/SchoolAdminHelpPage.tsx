import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../features/common/headerSlice';
import { 
  HelpCircle, 
  Users, 
  Building, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Search,
  BarChart,
  UserSquare,
  Clipboard,
  Monitor
} from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  items: string[];
}

const SchoolAdminHelpPage = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string>('getting-started');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(setPageTitle({ title: "Help & Support" }));
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    const helpSections: HelpSection[] = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: Settings,
            description: 'Learn the basics of using the school admin portal',
            items: [
                'How to access your admin dashboard',
                'Understanding your administrative privileges',
                'Navigating the school management interface',
                'Setting up your school profile',
                'First-time administrator checklist'
            ]
        },
        {
            id: 'staff-management',
            title: 'Staff Management',
            icon: Users,
            description: 'Managing teachers and school staff',
            items: [
                'Adding new teachers to your school',
                'Managing teacher profiles and permissions',
                'Assigning teachers to classes and subjects',
                'Monitoring teacher performance',
                'Handling staff leave requests'
            ]
        },
        {
            id: 'student-records',
            title: 'Student Records',
            icon: UserSquare,
            description: 'Managing student information and enrollment',
            items: [
                'Enrolling new students',
                'Managing student profiles and data',
                'Tracking student attendance',
                'Handling student transfers',
                'Generating student reports'
            ]
        },
        {
            id: 'facilities',
            title: 'Facilities Management',
            icon: Building,
            description: 'Managing school facilities and resources',
            items: [
                'Managing classroom assignments',
                'Scheduling facility usage',
                'Tracking equipment and resources',
                'Maintenance request procedures',
                'Facility booking system'
            ]
        },
        {
            id: 'calendar',
            title: 'School Calendar',
            icon: Calendar,
            description: 'Managing school events and schedules',
            items: [
                'Creating school events and activities',
                'Managing academic calendar',
                'Scheduling parent-teacher meetings',
                'Coordinating with regional events',
                'Holiday and break planning'
            ]
        },
        {
            id: 'attendance',
            title: 'Attendance Tracking',
            icon: Clipboard,
            description: 'Monitoring staff and student attendance',
            items: [
                'Viewing daily attendance reports',
                'Managing attendance policies',
                'Handling attendance issues',
                'Generating attendance analytics',
                'Parent notification system'
            ]
        },
        {
            id: 'reports',
            title: 'Reports & Analytics',
            icon: BarChart,
            description: 'Generating and analyzing school reports',
            items: [
                'Creating academic performance reports',
                'Monitoring school statistics',
                'Generating compliance reports',
                'Tracking assignment submissions',
                'Analyzing school usage data'
            ]
        },
        {
            id: 'communication',
            title: 'Communication',
            icon: MessageSquare,
            description: 'Managing school communications',
            items: [
                'Sending announcements to staff and students',
                'Managing parent communications',
                'Coordinating with regional offices',
                'Emergency communication procedures',
                'Newsletter and bulletin management'
            ]
        },
        {
            id: 'monitoring',
            title: 'System Monitoring',
            icon: Monitor,
            description: 'Monitoring school system usage',
            items: [
                'Tracking LMS usage statistics',
                'Monitoring system performance',
                'Managing user access and permissions',
                'Reviewing activity logs',
                'System health monitoring'
            ]
        }
    ];

    const faqItems: FAQItem[] = [
        {
            id: 1,
            question: "How do I add a new teacher to my school?",
            answer: "Go to 'Staff Management', click 'Add New Teacher', fill in their details including qualifications and subjects they can teach. The teacher will receive login credentials via email once approved.",
            category: "staff"
        },
        {
            id: 2,
            question: "How can I track student attendance across all classes?",
            answer: "Navigate to 'Attendance' section where you can view daily, weekly, or monthly attendance reports. You can filter by class, grade, or individual students to get detailed attendance analytics.",
            category: "attendance"
        },
        {
            id: 3,
            question: "How do I generate academic performance reports?",
            answer: "Go to 'Reports & Analytics', select 'Academic Performance', choose your criteria (class, subject, time period), and click 'Generate Report'. Reports can be exported as PDF or Excel files.",
            category: "reports"
        },
        {
            id: 4,
            question: "How do I manage facility bookings and usage?",
            answer: "In the 'Facilities' section, you can view all available facilities, their current bookings, and schedule new reservations. You can also set booking policies and approval requirements.",
            category: "facilities"
        },
        {
            id: 5,
            question: "How do I send announcements to all students and staff?",
            answer: "Use the 'Communication' section to create announcements. You can target specific groups (all staff, specific classes, parents) and schedule announcements for future delivery.",
            category: "communication"
        },
        {
            id: 6,
            question: "How do I handle student enrollment and transfers?",
            answer: "In 'Student Records', you can enroll new students by filling their details and assigning them to appropriate classes. For transfers, use the 'Transfer Student' option to move them between classes or handle school transfers.",
            category: "students"
        },
        {
            id: 7,
            question: "How do I monitor teacher performance and activities?",
            answer: "The 'Staff Management' section provides teacher activity dashboards showing their class engagement, assignment creation, grading progress, and student feedback scores.",
            category: "staff"
        },
        {
            id: 8,
            question: "How do I coordinate with regional education offices?",
            answer: "Use the 'Communication' section to send reports and updates to regional offices. You can also access regional announcements and compliance requirements through the dashboard.",
            category: "communication"
        },
        {
            id: 9,
            question: "How do I manage school calendar and events?",
            answer: "In the 'School Calendar' section, you can create events, set academic terms, schedule meetings, and coordinate with regional calendar events. All stakeholders will be automatically notified.",
            category: "calendar"
        },
        {
            id: 10,
            question: "How do I track system usage and performance?",
            answer: "The 'Monitoring' section provides comprehensive analytics on LMS usage, user activity, system performance, and resource utilization across your school.",
            category: "monitoring"
        }
    ];

    const filteredFAQs = faqItems.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFAQ = (id: number) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const contactInfo = [
        {
            type: 'Regional Office',
            icon: Phone,
            value: '+267 123 4567',
            description: 'Administrative support and guidance'
        },
        {
            type: 'Technical Support',
            icon: Mail,
            value: 'admin-support@thutothebe.edu.bw',
            description: 'System issues and technical problems'
        },
        {
            type: 'Academic Support',
            icon: Mail,
            value: 'academic-admin@thutothebe.edu.bw',
            description: 'Curriculum and academic administration'
        }
    ];

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

    return (
        <div className="p-4 sm:p-6 max-w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-900">School Admin Help & Support</h1>
                </div>
                <p className="text-lg text-gray-600">
                    Welcome to the school administrator help center. Find guidance on managing your school effectively using the Thuto Thebe Learning Management System.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Topics</h3>
                        <nav className="space-y-2">
                            {helpSections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
                                            activeSection === section.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        <span className="font-medium">{section.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => navigate('/app/staff-management')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                            >
                                <Users className="h-6 w-6 text-blue-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Manage Staff</h3>
                                <p className="text-sm text-gray-600">Add and manage school staff</p>
                            </button>
                            <button
                                onClick={() => navigate('/app/student-records')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                            >
                                <UserSquare className="h-6 w-6 text-green-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Student Records</h3>
                                <p className="text-sm text-gray-600">Manage student information</p>
                            </button>
                            <button
                                onClick={() => navigate('/app/reports')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                            >
                                <BarChart className="h-6 w-6 text-purple-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Reports</h3>
                                <p className="text-sm text-gray-600">Generate school reports</p>
                            </button>
                        </div>
                    </div>

                    {/* Active Section Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        {helpSections.map((section) => {
                            if (section.id !== activeSection) return null;
                            const Icon = section.icon;
                            
                            return (
                                <div key={section.id}>
                                    <div className="flex items-center mb-4">
                                        <Icon className="h-6 w-6 text-blue-600 mr-3" />
                                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                    </div>
                                    <p className="text-gray-600 mb-6">{section.description}</p>
                                    
                                    <div className="space-y-4">
                                        {section.items.map((item, index) => (
                                            <div key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Section-specific additional content */}
                                    {section.id === 'getting-started' && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-start">
                                                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-blue-900">New School Administrator?</h4>
                                                    <p className="text-blue-800 text-sm mt-1">
                                                        Start by reviewing your school's current setup, familiarizing yourself with the dashboard, and connecting with your regional education office for guidance.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {section.id === 'monitoring' && (
                                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <div className="flex items-start">
                                                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-yellow-900">System Monitoring Best Practices</h4>
                                                    <p className="text-yellow-800 text-sm mt-1">
                                                        Regular monitoring helps ensure optimal system performance. Check usage patterns weekly and report any issues to technical support promptly.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {section.id === 'communication' && (
                                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-start">
                                                <MessageSquare className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-green-900">Communication Guidelines</h4>
                                                    <p className="text-green-800 text-sm mt-1">
                                                        Maintain clear, professional communication with all stakeholders. Use the appropriate channels for different types of messages and ensure timely responses.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                        
                        {/* Search FAQ */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search FAQ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredFAQs.map((faq) => (
                                <div key={faq.id} className="border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => toggleFAQ(faq.id)}
                                        className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                                    >
                                        <span className="font-medium text-gray-900">{faq.question}</span>
                                        {expandedFAQ === faq.id ? (
                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                    {expandedFAQ === faq.id && (
                                        <div className="px-4 pb-4">
                                            <p className="text-gray-700">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredFAQs.length === 0 && searchTerm && (
                            <div className="text-center py-8">
                                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                                <p className="text-gray-500">Try searching with different keywords or browse the help topics above.</p>
                            </div>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Additional Support?</h2>
                        <p className="text-gray-600 mb-6">
                            Can't find what you're looking for? Our support team and regional offices are here to assist you with school administration.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactInfo.map((contact, index) => {
                                const Icon = contact.icon;
                                return (
                                    <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                                        <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                        <h3 className="font-medium text-gray-900 mb-2">{contact.type}</h3>
                                        <p className="text-blue-600 font-medium mb-1">{contact.value}</p>
                                        <p className="text-sm text-gray-500">{contact.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start">
                                <Clock className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Support Hours</h4>
                                    <p className="text-gray-700 text-sm mt-1">
                                        Monday - Friday: 7:30 AM - 5:00 PM<br />
                                        Saturday: 8:00 AM - 12:00 PM<br />
                                        Sunday: Emergency support only
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolAdminHelpPage; 