import { 
    HomeIcon,
    UserIcon,
    CalendarIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const iconClasses = 'h-6 w-6';

const routes = [
    {
        path: '/app/dashboard',
        icon: <HomeIcon className={iconClasses}/>,
        name: 'Dashboard',
    },
    {
        path: '/app/profile',
        icon: <UserIcon className={iconClasses}/>,
        name: 'Profile',
    },
    {
        path: '/app/calendar',
        icon: <CalendarIcon className={iconClasses}/>,
        name: 'Calendar',
    },
    {
        path: '/app/analytics',
        icon: <ChartBarIcon className={iconClasses}/>,
        name: 'Analytics',
    },
    {
        path: '/app/notifications',
        icon: <BellIcon className={iconClasses}/>,
        name: 'Notifications',
    },
    {
        path: '/app/settings',
        icon: <Cog6ToothIcon className={iconClasses}/>,
        name: 'Settings',
    }
];

export default routes; 