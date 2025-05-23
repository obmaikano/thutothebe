import React from 'react';
import { Bell, Check, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationBodyRightDrawerProps {
    closeRightDrawer: () => void;
    extraObject?: any;
}

const NotificationBodyRightDrawer: React.FC<NotificationBodyRightDrawerProps> = () => {
    // Mock notification data - would come from API in real implementation
    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'System Update',
            message: 'Your sales has increased by 30% yesterday',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'success',
            title: 'New Achievement',
            message: 'Total likes for instagram post - New launch this week, has crossed 100k',
            time: '4 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'warning',
            title: 'Storage Warning',
            message: 'Your storage is 85% full. Consider upgrading your plan.',
            time: '1 day ago',
            read: true
        },
        {
            id: 4,
            type: 'info',
            title: 'Weekly Report',
            message: 'Your weekly performance report is ready for review.',
            time: '2 days ago',
            read: true
        },
        {
            id: 5,
            type: 'success',
            title: 'Payment Received',
            message: 'Payment of $299 has been successfully processed.',
            time: '3 days ago',
            read: true
        }
    ];

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <Check className="h-5 w-5 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'error':
                return <X className="h-5 w-5 text-red-600" />;
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getNotificationBg = (type: string, read: boolean) => {
        const baseClasses = read ? 'bg-white' : 'bg-blue-50';
        switch (type) {
            case 'success':
                return read ? 'bg-white' : 'bg-green-50';
            case 'warning':
                return read ? 'bg-white' : 'bg-yellow-50';
            case 'error':
                return read ? 'bg-white' : 'bg-red-50';
            default:
                return baseClasses;
        }
    };

    return (
        <div className="p-4 space-y-3">
            {notifications.map((notification) => (
                <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                        getNotificationBg(notification.type, notification.read)
                    } ${notification.read ? 'border-gray-200' : 'border-blue-200'}`}
                >
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-medium ${
                                    notification.read ? 'text-gray-900' : 'text-gray-900'
                                }`}>
                                    {notification.title}
                                </h4>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                                )}
                            </div>
                            <p className={`text-sm mt-1 ${
                                notification.read ? 'text-gray-600' : 'text-gray-700'
                            }`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Footer Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full text-sm text-blue-600 hover:text-blue-800 py-2">
                    Mark all as read
                </button>
                <button className="w-full text-sm text-gray-600 hover:text-gray-800 py-2">
                    View all notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationBodyRightDrawer; 