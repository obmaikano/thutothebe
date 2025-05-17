import { 
  LayoutGrid, 
  FolderOpen, 
  Target, 
  Compass, 
  Beaker, 
  Radio, 
  Settings, 
  HelpCircle,
  Ruler,
  Mountain,
  FileText,
  BarChart
} from 'lucide-react';

export const menuItems = [
  { 
    icon: LayoutGrid, 
    label: 'Home', 
    path: '/',
    description: 'Dashboard overview of recent activities'
  },
  { 
    icon: FolderOpen, 
    label: 'Projects', 
    path: '/projects',
    description: 'Manage exploration projects'
  },
  { 
    icon: Target, 
    label: 'Scenarios', 
    path: '/scenarios',
    description: 'Exploration scenario planning'
  },
  {
    icon: Compass,
    label: 'Drillholes',
    path: '/drillholes',
    description: 'Drilling data management'
  },
  {
    icon: Beaker,
    label: 'Geochemistry',
    path: '/geochemistry',
    description: 'Sample and assay data'
  },
  {
    icon: Radio,
    label: 'Geophysical Surveys',
    path: '/geophysics',
    description: 'Survey data management'
  },
  {
    icon: Ruler,
    label: 'Boreholes',
    path: '/boreholes',
    description: 'Borehole logging and data'
  },
  {
    icon: Mountain,
    label: 'Geological Units',
    path: '/geology',
    description: 'Rock types and formations'
  },
  {
    icon: FileText,
    label: 'Documents',
    path: '/documents',
    description: 'Document management'
  },
  {
    icon: BarChart,
    label: 'Reports',
    path: '/reports',
    description: 'Generate and view reports'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    description: 'System configuration'
  },
  {
    icon: HelpCircle,
    label: 'Help',
    path: '/help',
    description: 'Support and documentation'
  }
]; 