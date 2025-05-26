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
  Book
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
    icon: BarChart,
    label: 'My Grades',
    path: '/app/student-grades',
    description: 'View your academic performance and grades'
  },
  {
    icon: Calendar,
    label: 'Schedule',
    path: '/app/schedule',
    description: 'Your class timetable'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/app/messages',
    description: 'Contact teachers and staff'
  }
];

// Teacher-specific menu items
export const teacherMenuItems: MenuItem[] = [
  ...commonMenuItems,
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
    icon: ClipboardList,
    label: 'My Assignments',
    path: '/app/teacher-assignments',
    description: 'Create and manage assignments'
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
    icon: Calendar,
    label: 'Schedule',
    path: '/app/schedule',
    description: 'Your teaching schedule'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/app/messages',
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
    icon: Users,
    label: 'My Children',
    path: '/app/children',
    description: 'View your children\'s profiles'
  },
  {
    icon: BarChart,
    label: 'Academic Progress',
    path: '/app/academic-progress',
    description: 'Track academic performance'
  },
  {
    icon: Calendar,
    label: 'School Calendar',
    path: '/app/school-calendar',
    description: 'View school events and schedule'
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/app/reports',
    description: 'View academic reports'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/app/messages',
    description: 'Contact teachers and staff'
  },
  {
    icon: Bell,
    label: 'Notifications',
    path: '/app/notifications',
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
    icon: CheckSquare,
    label: 'Curriculum Planning',
    path: '/app/curriculum',
    description: 'Plan and review curriculum'
  }
];

// School Admin menu items
export const schoolAdminMenuItems: MenuItem[] = [
  { 
    icon: LayoutGrid, 
    label: 'Dashboard', 
    path: '/app/dashboard',
    description: 'Overview of your activities'
  },
  {
    icon: Users,
    label: 'Staff Management',
    path: '/app/staff',
    description: 'Manage school staff'
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
    label: 'School Calendar',
    path: '/app/school-calendar',
    description: 'Manage school events and schedule'
  },
  {
    icon: Clipboard,
    label: 'Attendance',
    path: '/app/attendance',
    description: 'Track staff and student attendance'
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
    icon: Settings,
    label: 'Settings',
    path: '/app/settings',
    description: 'School configuration'
  },
  {
    icon: HelpCircle,
    label: 'Help',
    path: '/app/school-admin-help',
    description: 'School admin support and documentation'
  }
];

// School Head menu items
export const schoolHeadMenuItems: MenuItem[] = [
  ...commonMenuItems,
  {
    icon: Users,
    label: 'Staff Management',
    path: '/app/staff',
    description: 'Manage school staff'
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
    label: 'School Calendar',
    path: '/app/school-calendar',
    description: 'Manage school events and schedule'
  },
  {
    icon: Clipboard,
    label: 'Attendance',
    path: '/app/attendance',
    description: 'Track staff and student attendance'
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
    label: 'Events',
    path: '/app/events',
    description: 'Regional calendar and events'
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
    icon: MapPin,
    label: 'Regional Oversight',
    path: '/app/regions',
    description: 'Monitor regional education offices'
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
    label: 'Schedule',
    path: '/app/schedule',
    description: 'Your work schedule'
  }
];

// Ministry Executive menu items
export const ministryExecutiveMenuItems: MenuItem[] = [
  ...commonMenuItems,
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
    icon: Monitor,
    label: 'System Monitoring',
    path: '/app/monitoring',
    description: 'Monitor LMS usage and adoption',
    children: [
      {
        icon: BarChart,
        label: 'Usage Analytics',
        path: '/app/monitoring/usage',
        description: 'Comprehensive usage monitoring'
      },
      {
        icon: Activity,
        label: 'Regional Usage',
        path: '/app/monitoring/regional',
        description: 'Regional usage patterns'
      },
      {
        icon: School,
        label: 'School Usage',
        path: '/app/monitoring/school',
        description: 'Individual school monitoring'
      },
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
    label: 'System Settings',
    path: '/app/settings',
    description: 'Configure system parameters'
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