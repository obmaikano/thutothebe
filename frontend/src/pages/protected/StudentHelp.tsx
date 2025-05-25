import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import { 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Calendar, 
  MessageSquare, 
  User, 
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
  ExternalLink
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

const StudentHelp = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();
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
            icon: User,
            description: 'Learn the basics of using the student portal',
            items: [
                'How to log in to your account',
                'Setting up your profile',
                'Understanding your dashboard',
                'Navigating the student portal',
                'First-time setup checklist'
            ]
        },
        {
            id: 'courses',
            title: 'My Courses',
            icon: BookOpen,
            description: 'Managing your enrolled courses',
            items: [
                'Viewing your enrolled courses',
                'Accessing course materials',
                'Understanding course progress',
                'Contacting your teachers',
                'Course completion requirements'
            ]
        },
        {
            id: 'assignments',
            title: 'Assignments',
            icon: FileText,
            description: 'Submitting and managing assignments',
            items: [
                'Viewing assignment details',
                'Submitting assignments on time',
                'Understanding due dates',
                'Checking assignment feedback',
                'Late submission policies'
            ]
        },
        {
            id: 'schedule',
            title: 'Schedule & Calendar',
            icon: Calendar,
            description: 'Managing your class schedule',
            items: [
                'Viewing your class timetable',
                'Understanding schedule changes',
                'Setting up calendar reminders',
                'Checking exam schedules',
                'Holiday and break information'
            ]
        },
        {
            id: 'communication',
            title: 'Communication',
            icon: MessageSquare,
            description: 'Staying connected with teachers and staff',
            items: [
                'Sending messages to teachers',
                'Reading announcements',
                'Participating in class discussions',
                'Emergency contact procedures',
                'Parent-teacher communication'
            ]
        },
        {
            id: 'technical',
            title: 'Technical Support',
            icon: Settings,
            description: 'Solving technical issues',
            items: [
                'Password reset procedures',
                'Browser compatibility',
                'Mobile app usage',
                'File upload issues',
                'System maintenance schedules'
            ]
        }
    ];

    const faqItems: FAQItem[] = [
        {
            id: 1,
            question: "How do I reset my password?",
            answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email. If you don't receive the email, check your spam folder or contact your school administrator.",
            category: "account"
        },
        {
            id: 2,
            question: "Why can't I see my courses?",
            answer: "If you can't see your courses, it might be because your student profile isn't fully set up or you haven't been enrolled in any courses yet. Contact your school administrator for assistance.",
            category: "courses"
        },
        {
            id: 3,
            question: "How do I submit an assignment?",
            answer: "Go to 'My Assignments', click on the assignment you want to submit, and follow the submission instructions. Make sure to submit before the due date to avoid late penalties.",
            category: "assignments"
        },
        {
            id: 4,
            question: "Can I access the portal on my mobile device?",
            answer: "Yes, the student portal is mobile-friendly and can be accessed through your mobile browser. For the best experience, use the latest version of Chrome, Safari, or Firefox.",
            category: "technical"
        },
        {
            id: 5,
            question: "How do I contact my teacher?",
            answer: "You can send messages to your teachers through the 'Messages' section. Select your teacher from the contact list and compose your message. Teachers typically respond within 24-48 hours.",
            category: "communication"
        },
        {
            id: 6,
            question: "What should I do if I miss a class?",
            answer: "Check your course materials for any announcements or assignments you might have missed. Contact your teacher or classmates to catch up on what was covered. Some classes may have recorded sessions available.",
            category: "schedule"
        },
        {
            id: 7,
            question: "How do I check my grades?",
            answer: "Go to 'My Grades' to view your current grades and performance metrics. Grades are updated regularly by your teachers after assignments and exams are graded.",
            category: "grades"
        },
        {
            id: 8,
            question: "What if I'm having trouble with course content?",
            answer: "Don't hesitate to reach out to your teacher for help. You can also check if there are study groups or tutoring resources available through your school. Many teachers offer office hours for additional support.",
            category: "courses"
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
            type: 'School Office',
            icon: Phone,
            value: '+267 123 4567',
            description: 'General inquiries and support'
        },
        {
            type: 'IT Support',
            icon: Mail,
            value: 'support@thutothebe.edu.bw',
            description: 'Technical issues and account problems'
        },
        {
            type: 'Academic Support',
            icon: Mail,
            value: 'academic@thutothebe.edu.bw',
            description: 'Course and assignment help'
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
                    <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
                </div>
                <p className="text-lg text-gray-600">
                    Welcome to the student help center. Find answers to common questions and learn how to make the most of your student portal.
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
                                onClick={() => navigate('/app/student-courses')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                            >
                                <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
                                <h3 className="font-medium text-gray-900">View My Courses</h3>
                                <p className="text-sm text-gray-600">Access your enrolled courses</p>
                            </button>
                            <button
                                onClick={() => navigate('/app/student-assignments')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                            >
                                <FileText className="h-6 w-6 text-green-600 mb-2" />
                                <h3 className="font-medium text-gray-900">My Assignments</h3>
                                <p className="text-sm text-gray-600">Check and submit assignments</p>
                            </button>
                            <button
                                onClick={() => navigate('/app/messages')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                            >
                                <MessageSquare className="h-6 w-6 text-purple-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Messages</h3>
                                <p className="text-sm text-gray-600">Contact teachers and staff</p>
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
                                                    <h4 className="font-medium text-blue-900">New Student?</h4>
                                                    <p className="text-blue-800 text-sm mt-1">
                                                        If this is your first time logging in, make sure to complete your profile setup and familiarize yourself with the dashboard layout.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {section.id === 'technical' && (
                                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <div className="flex items-start">
                                                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-yellow-900">System Requirements</h4>
                                                    <p className="text-yellow-800 text-sm mt-1">
                                                        For the best experience, use Chrome, Firefox, Safari, or Edge. Ensure JavaScript is enabled and your browser is up to date.
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Need More Help?</h2>
                        <p className="text-gray-600 mb-6">
                            Can't find what you're looking for? Our support team is here to help you.
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
                                        Monday - Friday: 8:00 AM - 5:00 PM<br />
                                        Saturday: 9:00 AM - 1:00 PM<br />
                                        Sunday: Closed
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

export default StudentHelp; 