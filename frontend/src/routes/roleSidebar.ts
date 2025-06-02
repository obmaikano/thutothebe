import { 
  LayoutGrid, 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  BarChart, 
  Settings, 
  HelpCircle,
  Ruler,
  School,
  GraduationCap,
  Bell,
  CheckSquare,
  UserCog,
  Map,
  ClipboardList,
  MessageSquare,
  Briefcase,
  Award,
  Building,
  UserSquare,
  Library,
  Globe,
  User,
  Clipboard,
  FileCheck,
  Monitor,
  TrendingUp,
  Target,
  Activity,
  MapPin,
  Building2,
  Book,
  Clock,
  FileQuestion,
  Megaphone,
  FolderOpen,
  Upload,
  Download,
  Eye,
  Share2,
  Archive,
  Plus,
  BarChart3
} from 'lucide-react';

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  description: string;
  children?: MenuItem[];
}

// Common menu items that all users might need
const commonMenuItems: MenuItem[] = [
  { 
    icon: LayoutGrid, 
    label: 'Dashboard', 
    path: '/app/dashboard',
    description: 'Overview of your activities'
  },
  {
    icon: HelpCircle,
    label: 'Help',
    path: '/app/help',
    description: 'Support and documentation'
  }
];

// Student-specific menu items
export const studentMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/student-announcements',
    description: 'View important announcements and updates'
  },
  {
    icon: BookOpen,
    label: 'My Courses',
    path: '/app/student-courses',
    description: 'View and access your enrolled courses'
  },
  {
    icon: ClipboardList,
    label: 'My Assignments',
    path: '/app/student-assignments',
    description: 'View and submit assignments'
  },
  {
    icon: FileQuestion,
    label: 'Quizzes',
    path: '/app/student-quizzes',
    description: 'Take quizzes and view results'
  },
  {
    icon: BarChart,
    label: 'My Grades',
    path: '/app/student-grades',
    description: 'View your academic performance and grades'
  },
  {
    icon: CheckSquare,
    label: 'My Attendance',
    path: '/app/student-attendance',
    description: 'View your attendance record and statistics'
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/student-calendar',
    description: 'View school events and your schedule'
  },
  {
    icon: MessageSquare,
    label: 'Discussion Forums',
    path: '/app/student-forum-list',
    description: 'Participate in course discussions'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/app/student-messages',
    description: 'Contact teachers and staff'
  }
];

// Teacher-specific menu items
export const teacherMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/teacher-announcements',
    description: 'View and create announcements',
    children: [
      {
        icon: Megaphone,
        label: 'All Announcements',
        path: '/app/teacher-announcements',
        description: 'View all announcements'
      },
      {
        icon: Megaphone,
        label: 'My Announcements',
        path: '/app/teacher-my-announcements',
        description: 'Manage your announcements'
      }
    ]
  },
  {
    icon: BookOpen,
    label: 'My Classes',
    path: '/app/teacher-classes',
    description: 'View your assigned classes'
  },
  {
    icon: BookOpen,
    label: 'My Courses',
    path: '/app/teacher-courses',
    description: 'Manage your assigned courses'
  },
  {
    icon: Users,
    label: 'My Students',
    path: '/app/teacher-students',
    description: 'View students from your courses'
  },
  {
    icon: CheckSquare,
    label: 'Attendance',
    path: '/app/teacher-attendance',
    description: 'Mark and manage student attendance',
    children: [
      {
        icon: CheckSquare,
        label: 'Mark Attendance',
        path: '/app/teacher-attendance/mark',
        description: 'Mark daily attendance for your classes'
      },
      {
        icon: BarChart,
        label: 'Attendance Reports',
        path: '/app/teacher-attendance/reports',
        description: 'View attendance analytics and reports'
      },
      {
        icon: Calendar,
        label: 'Attendance Calendar',
        path: '/app/teacher-attendance/calendar',
        description: 'Calendar view of attendance records'
      }
    ]
  },
  {
    icon: ClipboardList,
    label: 'My Assignments',
    path: '/app/teacher-assignments',
    description: 'Create and manage assignments'
  },
  {
    icon: FileQuestion,
    label: 'Quizzes',
    path: '/app/teacher-quizzes',
    description: 'Create and manage quizzes',
    children: [
      {
        icon: FileQuestion,
        label: 'All Quizzes',
        path: '/app/teacher-quizzes',
        description: 'View all quizzes'
      },
      {
        icon: Plus,
        label: 'Create Quiz',
        path: '/app/teacher-quiz-creation',
        description: 'Create new quiz'
      },
      {
        icon: BarChart,
        label: 'Quiz Analytics',
        path: '/app/teacher-quiz-analytics',
        description: 'View quiz performance analytics'
      }
    ]
  },
  {
    icon: MessageSquare,
    label: 'Discussion Forums',
    path: '/app/teacher-forum-list',
    description: 'Participate in course discussions',
    children: [
      {
        icon: MessageSquare,
        label: 'All Forums',
        path: '/app/teacher-forum-list',
        description: 'View all discussion forums'
      }
    ]
  },
  {
    icon: BarChart,
    label: 'My Grades',
    path: '/app/my-grades',
    description: 'Manage student grades'
  },
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/teacher-content',
    description: 'Manage course content and resources'
  },
  {
    icon: FileText,
    label: 'Document Library',
    path: '/app/teacher-documents',
    description: 'Access and manage documents',
    children: [
      {
        icon: FileText,
        label: 'All Documents',
        path: '/app/teacher-documents',
        description: 'Browse all available documents'
      },
      {
        icon: Upload,
        label: 'Upload Documents',
        path: '/app/teacher-documents/upload',
        description: 'Upload new documents'
      },
      {
        icon: User,
        label: 'My Documents',
        path: '/app/teacher-my-documents',
        description: 'View your uploaded documents'
      },
      {
        icon: Eye,
        label: 'Document Approval',
        path: '/app/teacher-documents/approval',
        description: 'Review and approve documents'
      }
    ]
  },
  {
    icon: Library,
    label: 'Teaching Resources',
    path: '/app/teacher-resources',
    description: 'Manage course materials and resources'
  },
  {
    icon: FileCheck,
    label: 'Student Submissions',
    path: '/app/teacher-submissions',
    description: 'Review and grade student submissions'
  },
  {
    icon: FileText,
    label: 'Lesson Plans',
    path: '/app/lessons',
    description: 'Create and manage lesson plans'
  },
  {
    icon: BarChart,
    label: 'Gradebook',
    path: '/app/gradebook',
    description: 'Manage student grades'
  },
  {
    icon: BarChart,
    label: 'Grade Management',
    path: '/app/grade-management',
    description: 'View and manage all grades',
    children: [
      {
        icon: BarChart,
        label: 'All Grades',
        path: '/app/grades',
        description: 'View and manage all grades'
      },
      {
        icon: BarChart,
        label: 'Gradebook',
        path: '/app/gradebook',
        description: 'Interactive gradebook interface'
      }
    ]
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/teacher-calendar',
    description: 'Manage school events and your schedule'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/app/teacher-messages',
    description: 'Communicate with students and parents'
  }
];

// Senior Teacher menu items
export const seniorTeacherMenuItems: MenuItem[] = [
  ...teacherMenuItems,
  {
    icon: FileCheck,
    label: 'Department Reports',
    path: '/app/department-reports',
    description: 'View and create department reports'
  },
  {
    icon: Users,
    label: 'Teacher Management',
    path: '/app/teacher-management',
    description: 'Oversee teacher performance'
  }
];

// Parent-specific menu items
export const parentMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/parent-announcements',
    description: 'View school announcements and updates'
  },
  {
    icon: Users,
    label: 'My Children',
    path: '/app/parent-children',
    description: 'View your children\'s profiles'
  },
  {
    icon: BarChart,
    label: 'Academic Progress',
    path: '/app/parent-academic-progress',
    description: 'Track academic performance'
  },
  {
    icon: CheckSquare,
    label: 'Child Attendance',
    path: '/app/parent-child-attendance',
    description: 'Monitor your child\'s attendance record'
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/parent-calendar',
    description: 'View school events and activities'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/parent-reports',
    description: 'View academic reports'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/app/parent-messages',
    description: 'Contact teachers and staff'
  },
  {
    icon: Bell,
    label: 'Notifications',
    path: '/app/parent-notifications',
    description: 'School announcements and alerts'
  }
];

// Department Head menu items
export const departmentHeadMenuItems: MenuItem[] = [
  ...seniorTeacherMenuItems,
  {
    icon: Briefcase,
    label: 'Department Management',
    path: '/app/department',
    description: 'Manage your department'
  },
  {
    icon: BookOpen,
    label: 'Curriculum Management',
    path: '/app/curriculum',
    description: 'Manage regional curriculum',
    children: [
      {
        icon: BookOpen,
        label: 'All Curricula',
        path: '/app/curriculum',
        description: 'View and manage all curricula'
      },
      {
        icon: BookOpen,
        label: 'Curriculum Builder',
        path: '/app/curriculum-builder',
        description: 'Create and edit curricula'
      },
      {
        icon: BookOpen,
        label: 'Standards',
        path: '/app/standards-management',
        description: 'Manage learning standards'
      },
      {
        icon: BookOpen,
        label: 'Learning Objectives',
        path: '/app/learning-objectives',
        description: 'Define learning objectives'
      },
      {
        icon: BookOpen,
        label: 'Templates',
        path: '/app/curriculum-templates',
        description: 'Browse curriculum templates'
      },
      {
        icon: CheckSquare,
        label: 'Approval',
        path: '/app/curriculum-approval',
        description: 'Review and approve curricula'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/app/curriculum-analytics',
        description: 'View curriculum implementation analytics'
      },
      {
        icon: FolderOpen,
        label: 'Resources',
        path: '/app/curriculum-resources',
        description: 'Manage curriculum resources and materials'
      },
      {
        icon: TrendingUp,
        label: 'Progress Tracking',
        path: '/app/curriculum-progress',
        description: 'Track curriculum implementation progress'
      }
    ]
  }
];

// School Admin menu items
export const schoolAdminMenuItems: MenuItem[] = [
  { 
    icon: LayoutGrid, 
    label: 'Dashboard', 
    path: '/app/school-admin-dashboard',
    description: 'Overview of your activities'
  },
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/announcements',
    description: 'Manage school announcements',
    children: [
      {
        icon: Megaphone,
        label: 'All Announcements',
        path: '/app/announcements',
        description: 'View all announcements'
      },
      {
        icon: Megaphone,
        label: 'My Announcements',
        path: '/app/my-announcements',
        description: 'Manage your announcements'
      }
    ]
  },
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage school content and resources'
  },
  {
    icon: Users,
    label: 'Staff Management',
    path: '/app/staff-management',
    description: 'Manage school staff'
  },
  {
    icon: UserSquare,
    label: 'Student Records',
    path: '/app/student-records',
    description: 'Manage student information'
  },
  {
    icon: BookOpen,
    label: 'Class Management',
    path: '/app/class-management',
    description: 'Manage classes and assignments'
  },
  {
    icon: Clock,
    label: 'Timetable Management',
    path: '/app/timetable-management',
    description: 'Create and manage class schedules'
  },
  {
    icon: FileText,
    label: 'Assessment Configuration',
    path: '/app/assessment-configuration',
    description: 'Configure assessments and grading'
  },
  {
    icon: FileQuestion,
    label: 'Quiz Management',
    path: '/app/quizzes',
    description: 'Manage school quizzes and assessments'
  },
  {
    icon: BookOpen,
    label: 'Subject Allocation',
    path: '/app/subject-allocation',
    description: 'Allocate subjects to teachers'
  },
  {
    icon: Building2,
    label: 'Department Management',
    path: '/app/departments',
    description: 'Manage school departments and their resources'
  },
  {
    icon: BookOpen,
    label: 'Curriculum Management',
    path: '/app/curriculum',
    description: 'Manage system-wide curriculum',
    children: [
      {
        icon: BookOpen,
        label: 'All Curricula',
        path: '/app/curriculum',
        description: 'View and manage all curricula'
      },
      {
        icon: BookOpen,
        label: 'Curriculum Builder',
        path: '/app/curriculum-builder',
        description: 'Create and edit curricula'
      },
      {
        icon: BookOpen,
        label: 'Standards',
        path: '/app/standards-management',
        description: 'Manage learning standards'
      },
      {
        icon: BookOpen,
        label: 'Learning Objectives',
        path: '/app/learning-objectives',
        description: 'Define learning objectives'
      },
      {
        icon: BookOpen,
        label: 'Templates',
        path: '/app/curriculum-templates',
        description: 'Browse curriculum templates'
      },
      {
        icon: CheckSquare,
        label: 'Approval',
        path: '/app/curriculum-approval',
        description: 'Review and approve curricula'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/app/curriculum-analytics',
        description: 'View curriculum implementation analytics'
      },
      {
        icon: FolderOpen,
        label: 'Resources',
        path: '/app/curriculum-resources',
        description: 'Manage curriculum resources and materials'
      },
      {
        icon: TrendingUp,
        label: 'Progress Tracking',
        path: '/app/curriculum-progress',
        description: 'Track curriculum implementation progress'
      }
    ]
  },
  {
    icon: Building,
    label: 'Facilities',
    path: '/app/facilities',
    description: 'Manage school facilities'
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/school-calendar',
    description: 'Manage school calendar and events'
  },
  {
    icon: FileText,
    label: 'Documents',
    path: '/app/documents',
    description: 'Manage school documents'
  },
  {
    icon: Monitor,
    label: 'Monitoring',
    path: '/app/monitoring',
    description: 'Monitor school systems'
  },
  {
    icon: BarChart,
    label: 'Reports',
    path: '/app/school-reports',
    description: 'Generate and view school reports'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/school-settings',
    description: 'Configure school settings'
  },
  {
    icon: HelpCircle,
    label: 'Help',
    path: '/app/school-admin-help',
    description: 'Support and documentation'
  }
];

// School Head menu items
export const schoolHeadMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/announcements',
    description: 'Manage school announcements',
    children: [
      {
        icon: Megaphone,
        label: 'All Announcements',
        path: '/app/announcements',
        description: 'View all announcements'
      },
      {
        icon: Megaphone,
        label: 'My Announcements',
        path: '/app/my-announcements',
        description: 'Manage your announcements'
      }
    ]
  },
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage school content and resources'
  },
  {
    icon: Users,
    label: 'Staff Management',
    path: '/app/staff',
    description: 'Manage school staff'
  },
  {
    icon: Building2,
    label: 'Department Management',
    path: '/app/departments',
    description: 'Manage school departments and their resources'
  },
  {
    icon: UserSquare,
    label: 'Student Records',
    path: '/app/student-records',
    description: 'Manage student information'
  },
  {
    icon: Building,
    label: 'Facilities',
    path: '/app/facilities',
    description: 'Manage school facilities'
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/calendar',
    description: 'Manage school events and activities'
  },
  {
    icon: Clipboard,
    label: 'Attendance',
    path: '/app/attendance',
    description: 'School-wide attendance oversight',
    children: [
      {
        icon: BarChart,
        label: 'Attendance Reports',
        path: '/app/attendance/reports',
        description: 'Comprehensive attendance analytics and reports'
      },
      {
        icon: Calendar,
        label: 'Attendance Calendar',
        path: '/app/attendance/calendar',
        description: 'Calendar view of attendance records'
      },
      {
        icon: TrendingUp,
        label: 'Attendance Trends',
        path: '/app/attendance/trends',
        description: 'Attendance patterns and analysis'
      }
    ]
  },
  {
    icon: FileText,
    label: 'Documents',
    path: '/app/documents',
    description: 'Manage school documentation'
  },
  {
    icon: BarChart,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and view reports',
    children: [
      {
        icon: Target,
        label: 'Assignment Tracking',
        path: '/app/reports/assignment-tracking',
        description: 'Track assignment submissions'
      },
      {
        icon: School,
        label: 'School Performance',
        path: '/app/reports/school-performance',
        description: 'Detailed school analytics'
      },
      {
        icon: TrendingUp,
        label: 'Student Progression',
        path: '/app/reports/learner-progression',
        description: 'Student progression analysis'
      }
    ]
  },
  {
    icon: Monitor,
    label: 'Monitoring',
    path: '/app/monitoring',
    description: 'School monitoring',
    children: [
      {
        icon: School,
        label: 'School Usage',
        path: '/app/monitoring/school',
        description: 'Monitor school LMS usage'
      }
    ]
  },
  {
    icon: Award,
    label: 'Academic Oversight',
    path: '/app/academic-oversight',
    description: 'Monitor academic performance'
  },
  {
    icon: BarChart,
    label: 'Performance Metrics',
    path: '/app/performance',
    description: 'School performance analytics'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'School configuration'
  }
];

// Regional Officer menu items
export const regionalOfficerMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Map,
    label: 'Schools Map',
    path: '/app/schools-map',
    description: 'Geographic view of schools'
  },
  {
    icon: CheckSquare,
    label: 'School Visits',
    path: '/app/school-visits',
    description: 'Schedule and manage school visits'
  },
  {
    icon: FileText,
    label: 'Assessment Reports',
    path: '/app/assessment-reports',
    description: 'Create and view assessment reports'
  },
  {
    icon: BarChart,
    label: 'Regional Metrics',
    path: '/app/regional-metrics',
    description: 'Regional performance data'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and view reports',
    children: [
      {
        icon: School,
        label: 'School Performance',
        path: '/app/reports/school-performance',
        description: 'Monitor school performance'
      }
    ]
  },
  {
    icon: Monitor,
    label: 'Monitoring',
    path: '/app/monitoring',
    description: 'Usage monitoring',
    children: [
      {
        icon: Activity,
        label: 'Regional Usage',
        path: '/app/monitoring/regional',
        description: 'Regional LMS usage patterns'
      }
    ]
  },
  {
    icon: Calendar,
    label: 'Schedule',
    path: '/app/schedule',
    description: 'Your work schedule'
  }
];

// Regional Admin menu items
export const regionalAdminMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/announcements',
    description: 'Manage regional announcements',
    children: [
      {
        icon: Megaphone,
        label: 'All Announcements',
        path: '/app/announcements',
        description: 'View all announcements'
      },
      {
        icon: Megaphone,
        label: 'My Announcements',
        path: '/app/my-announcements',
        description: 'Manage your announcements'
      }
    ]
  },
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage regional content and resources'
  },
  {
    icon: School,
    label: 'Schools',
    path: '/app/schools',
    description: 'Manage schools in your region'
  },
  {
    icon: Building2,
    label: 'Regional Management',
    path: '/app/regions',
    description: 'Manage regional configurations'
  },
  {
    icon: BookOpen,
    label: 'Curriculum Management',
    path: '/app/curriculum',
    description: 'Manage regional curriculum',
    children: [
      {
        icon: BookOpen,
        label: 'All Curricula',
        path: '/app/curriculum',
        description: 'View and manage all curricula'
      },
      {
        icon: BookOpen,
        label: 'Curriculum Builder',
        path: '/app/curriculum-builder',
        description: 'Create and edit curricula'
      },
      {
        icon: BookOpen,
        label: 'Standards',
        path: '/app/standards-management',
        description: 'Manage learning standards'
      },
      {
        icon: BookOpen,
        label: 'Learning Objectives',
        path: '/app/learning-objectives',
        description: 'Define learning objectives'
      },
      {
        icon: BookOpen,
        label: 'Templates',
        path: '/app/curriculum-templates',
        description: 'Browse curriculum templates'
      },
      {
        icon: CheckSquare,
        label: 'Approval',
        path: '/app/curriculum-approval',
        description: 'Review and approve curricula'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/app/curriculum-analytics',
        description: 'View curriculum implementation analytics'
      },
      {
        icon: FolderOpen,
        label: 'Resources',
        path: '/app/curriculum-resources',
        description: 'Manage curriculum resources and materials'
      },
      {
        icon: TrendingUp,
        label: 'Progress Tracking',
        path: '/app/curriculum-progress',
        description: 'Track curriculum implementation progress'
      }
    ]
  },
  {
    icon: Users,
    label: 'Personnel',
    path: '/app/personnel',
    description: 'Manage regional staff'
  },
  {
    icon: BarChart,
    label: 'Regional Analytics',
    path: '/app/analytics',
    description: 'Performance analytics for your region'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and view reports',
    children: [
      {
        icon: School,
        label: 'School Performance',
        path: '/app/reports/school-performance',
        description: 'School performance analytics'
      }
    ]
  },
  {
    icon: Monitor,
    label: 'Usage Monitoring',
    path: '/app/monitoring',
    description: 'Monitor regional LMS usage',
    children: [
      {
        icon: Activity,
        label: 'Regional Usage',
        path: '/app/monitoring/regional',
        description: 'Regional usage patterns'
      }
    ]
  },
  {
    icon: ClipboardList,
    label: 'Requests',
    path: '/app/requests',
    description: 'Manage regional requests'
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/calendar',
    description: 'Manage regional calendar and events'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'Regional configuration'
  }
];

// Director menu items
export const directorMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage national content and resources'
  },
  {
    icon: Globe,
    label: 'All Regions',
    path: '/app/regions',
    description: 'Oversee all educational regions'
  },
  {
    icon: MapPin,
    label: 'Regional Management',
    path: '/app/regions',
    description: 'Configure and manage regional offices'
  },
  {
    icon: School,
    label: 'Schools',
    path: '/app/schools',
    description: 'National school oversight'
  },
  {
    icon: CheckSquare,
    label: 'Approvals',
    path: '/app/approvals',
    description: 'Review and manage approvals'
  },
  {
    icon: Bell,
    label: 'Escalated Issues',
    path: '/app/issues',
    description: 'Handle escalated issues'
  },
  {
    icon: BarChart,
    label: 'Performance',
    path: '/app/performance',
    description: 'National performance metrics'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and view reports',
    children: [
      {
        icon: TrendingUp,
        label: 'Learner Progression',
        path: '/app/reports/learner-progression',
        description: 'Learner progression analytics'
      },
      {
        icon: BookOpen,
        label: 'Subject Analytics',
        path: '/app/reports/subject-analytics',
        description: 'Subject performance data'
      }
    ]
  },
  {
    icon: Monitor,
    label: 'System Monitoring',
    path: '/app/monitoring',
    description: 'Monitor LMS usage and adoption',
    children: [
      {
        icon: Users,
        label: 'User Activity',
        path: '/app/monitoring/users',
        description: 'User behavior analytics'
      }
    ]
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'System configuration'
  }
];

// Ministry Staff menu items
export const ministryStaffMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage ministry content and resources'
  },
  {
    icon: MapPin,
    label: 'Regional Oversight',
    path: '/app/regions',
    description: 'Monitor regional education offices'
  },
  {
    icon: BookOpen,
    label: 'Curriculum Management',
    path: '/app/curriculum',
    description: 'Manage national curriculum',
    children: [
      {
        icon: BookOpen,
        label: 'All Curricula',
        path: '/app/curriculum',
        description: 'View and manage all curricula'
      },
      {
        icon: BookOpen,
        label: 'Curriculum Builder',
        path: '/app/curriculum-builder',
        description: 'Create and edit curricula'
      },
      {
        icon: BookOpen,
        label: 'Standards',
        path: '/app/standards-management',
        description: 'Manage learning standards'
      },
      {
        icon: BookOpen,
        label: 'Learning Objectives',
        path: '/app/learning-objectives',
        description: 'Define learning objectives'
      },
      {
        icon: BookOpen,
        label: 'Templates',
        path: '/app/curriculum-templates',
        description: 'Browse curriculum templates'
      },
      {
        icon: CheckSquare,
        label: 'Approval',
        path: '/app/curriculum-approval',
        description: 'Review and approve curricula'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/app/curriculum-analytics',
        description: 'View curriculum implementation analytics'
      },
      {
        icon: FolderOpen,
        label: 'Resources',
        path: '/app/curriculum-resources',
        description: 'Manage curriculum resources and materials'
      },
      {
        icon: TrendingUp,
        label: 'Progress Tracking',
        path: '/app/curriculum-progress',
        description: 'Track curriculum implementation progress'
      }
    ]
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and manage reports',
    children: [
      {
        icon: Target,
        label: 'Assignment Tracking',
        path: '/app/reports/assignment-tracking',
        description: 'Assignment submission analytics'
      }
    ]
  },
  {
    icon: Monitor,
    label: 'System Monitoring',
    path: '/app/monitoring',
    description: 'Monitor LMS usage and adoption',
    children: [
      {
        icon: BarChart,
        label: 'Usage Analytics',
        path: '/app/monitoring/usage',
        description: 'Comprehensive usage analytics'
      }
    ]
  },
  {
    icon: ClipboardList,
    label: 'Tasks',
    path: '/app/tasks',
    description: 'Manage assigned tasks'
  },
  {
    icon: Map,
    label: 'Regional Coordination',
    path: '/app/regional-coordination',
    description: 'Coordinate with regional offices'
  },
  {
    icon: BarChart,
    label: 'Statistics',
    path: '/app/statistics',
    description: 'Educational statistics and data'
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/calendar',
    description: 'Manage ministry events and schedule'
  }
];

// Ministry Executive menu items
export const ministryExecutiveMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage national content and resources'
  },
  {
    icon: Globe,
    label: 'National Overview',
    path: '/app/national-overview',
    description: 'Country-wide education metrics'
  },
  {
    icon: Building2,
    label: 'Regional Administration',
    path: '/app/regions',
    description: 'Oversee all regional education offices'
  },
  {
    icon: BookOpen,
    label: 'Curriculum Management',
    path: '/app/curriculum',
    description: 'Oversee national curriculum',
    children: [
      {
        icon: BookOpen,
        label: 'All Curricula',
        path: '/app/curriculum',
        description: 'View and manage all curricula'
      },
      {
        icon: BookOpen,
        label: 'Curriculum Builder',
        path: '/app/curriculum-builder',
        description: 'Create and edit curricula'
      },
      {
        icon: BookOpen,
        label: 'Standards',
        path: '/app/standards-management',
        description: 'Manage learning standards'
      },
      {
        icon: BookOpen,
        label: 'Learning Objectives',
        path: '/app/learning-objectives',
        description: 'Define learning objectives'
      },
      {
        icon: BookOpen,
        label: 'Templates',
        path: '/app/curriculum-templates',
        description: 'Browse curriculum templates'
      },
      {
        icon: CheckSquare,
        label: 'Approval',
        path: '/app/curriculum-approval',
        description: 'Review and approve curricula'
      }
    ]
  },
  {
    icon: BarChart,
    label: 'Performance',
    path: '/app/performance',
    description: 'National performance analytics'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and view national reports',
    children: [
      {
        icon: School,
        label: 'School Performance',
        path: '/app/reports/school-performance',
        description: 'National school performance'
      },
      {
        icon: TrendingUp,
        label: 'Learner Progression',
        path: '/app/reports/learner-progression',
        description: 'National learner progression'
      },
      {
        icon: BookOpen,
        label: 'Subject Analytics',
        path: '/app/reports/subject-analytics',
        description: 'National subject performance'
      }
    ]
  },
  {
    icon: Monitor,
    label: 'System Monitoring',
    path: '/app/monitoring',
    description: 'Monitor LMS usage and adoption',
    children: [
      {
        icon: Activity,
        label: 'Regional Usage',
        path: '/app/monitoring/regional',
        description: 'Regional usage monitoring'
      },
      {
        icon: Users,
        label: 'User Activity',
        path: '/app/monitoring/users',
        description: 'National user activity'
      }
    ]
  },
  {
    icon: FileText,
    label: 'Policy Management',
    path: '/app/policy',
    description: 'Develop and review policies'
  },
  {
    icon: Users,
    label: 'Leadership',
    path: '/app/leadership',
    description: 'Manage education leadership'
  },
  {
    icon: Bell,
    label: 'Critical Alerts',
    path: '/app/alerts',
    description: 'High-priority notifications'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'System configuration'
  }
];

// Super Admin menu items
export const superAdminMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Megaphone,
    label: 'Announcements',
    path: '/app/announcements',
    description: 'Manage system-wide announcements',
    children: [
      {
        icon: Megaphone,
        label: 'All Announcements',
        path: '/app/announcements',
        description: 'View all announcements'
      },
      {
        icon: Megaphone,
        label: 'My Announcements',
        path: '/app/my-announcements',
        description: 'Manage your announcements'
      }
    ]
  },
  {
    icon: FolderOpen,
    label: 'Content Management',
    path: '/app/content',
    description: 'Manage system-wide content and resources'
  },
  {
    icon: Users,
    label: 'User Management',
    path: '/app/users',
    description: 'Manage all system users'
  },
  {
    icon: UserCog,
    label: 'Roles & Permissions',
    path: '/app/permissions-roles',
    description: 'Configure access controls'
  },
  {
    icon: School,
    label: 'Institutions',
    path: '/app/schools',
    description: 'Manage educational institutions'
  },
  {
    icon: BookOpen,
    label: 'Subjects',
    path: '/app/subjects',
    description: 'Manage academic subjects'
  },
  {
    icon: Book,
    label: 'Courses',
    path: '/app/courses',
    description: 'Manage courses'
  },
  {
    icon: BookOpen,
    label: 'Curriculum Management',
    path: '/app/curriculum',
    description: 'Manage system-wide curriculum',
    children: [
      {
        icon: BookOpen,
        label: 'All Curricula',
        path: '/app/curriculum',
        description: 'View and manage all curricula'
      },
      {
        icon: BookOpen,
        label: 'Curriculum Builder',
        path: '/app/curriculum-builder',
        description: 'Create and edit curricula'
      },
      {
        icon: BookOpen,
        label: 'Standards',
        path: '/app/standards-management',
        description: 'Manage learning standards'
      },
      {
        icon: BookOpen,
        label: 'Learning Objectives',
        path: '/app/learning-objectives',
        description: 'Define learning objectives'
      },
      {
        icon: BookOpen,
        label: 'Templates',
        path: '/app/curriculum-templates',
        description: 'Browse curriculum templates'
      },
      {
        icon: CheckSquare,
        label: 'Approval',
        path: '/app/curriculum-approval',
        description: 'Review and approve curricula'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/app/curriculum-analytics',
        description: 'View curriculum implementation analytics'
      },
      {
        icon: FolderOpen,
        label: 'Resources',
        path: '/app/curriculum-resources',
        description: 'Manage curriculum resources and materials'
      },
      {
        icon: TrendingUp,
        label: 'Progress Tracking',
        path: '/app/curriculum-progress',
        description: 'Track curriculum implementation progress'
      }
    ]
  },
  {
    icon: Building2,
    label: 'Regional Management',
    path: '/app/regions',
    description: 'Oversee all regional education offices'
  },
  {
    icon: Globe,
    label: 'System Overview',
    path: '/app/system',
    description: 'Complete system status'
  },
  {
    icon: BarChart,
    label: 'Analytics',
    path: '/app/analytics',
    description: 'System-wide analytics'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'Generate and view reports',
    children: [
      {
        icon: School,
        label: 'School Performance',
        path: '/app/reports/school-performance',
        description: 'Detailed school analytics'
      },
      {
        icon: TrendingUp,
        label: 'Learner Progression',
        path: '/app/reports/learner-progression',
        description: 'Learner progression analysis'
      },
      {
        icon: BookOpen,
        label: 'Subject Analytics',
        path: '/app/reports/subject-analytics',
        description: 'Subject performance analytics'
      },
      {
        icon: Target,
        label: 'Assignment Tracking',
        path: '/app/reports/assignment-tracking',
        description: 'Assignment analytics'
      }
    ]
  },
  {
    icon: Calendar,
    label: 'Calendar Events',
    path: '/app/calendar',
    description: 'Manage system-wide calendar events'
  },
  {
    icon: Monitor,
    label: 'System Monitoring',
    path: '/app/monitoring',
    description: 'Monitor LMS usage and adoption',
    children: [
      {
        icon: Users,
        label: 'User Activity',
        path: '/app/monitoring/users',
        description: 'User behavior analytics'
      }
    ]
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'System configuration'
  }
];

// Admin menu items (fallback for unknown roles)
export const adminMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Users,
    label: 'Users',
    path: '/app/users',
    description: 'Manage system users'
  },
  {
    icon: FileText,
    label: 'Content',
    path: '/app/content',
    description: 'Manage site content'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'System configuration'
  }
];

// Function to get menu items based on user role
export const getMenuItemsByRole = (role: string): MenuItem[] => {
  switch (role) {
    case 'STUDENT':
      return studentMenuItems;
    case 'TEACHER':
      return teacherMenuItems;
    case 'SCHOOL_ADMIN':
      return schoolAdminMenuItems;
    case 'PARENT':
      return parentMenuItems;
    case 'SUPER_ADMIN':
      return superAdminMenuItems;
    case 'MINISTRY_EXECUTIVE':
      return ministryExecutiveMenuItems;
    case 'MINISTRY_STAFF':
      return ministryStaffMenuItems;
    case 'DIRECTOR':
      return directorMenuItems;
    case 'REGIONAL_ADMIN':
      return regionalAdminMenuItems;
    case 'REGIONAL_OFFICER':
      return regionalOfficerMenuItems;
    case 'SCHOOL_HEAD':
      return schoolHeadMenuItems;
    case 'DEPARTMENT_HEAD':
      return departmentHeadMenuItems;
    case 'SENIOR_TEACHER':
      return seniorTeacherMenuItems;
    default:
      return adminMenuItems;
  }
}; 