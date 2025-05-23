import React from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/modalConstants';
import { AuditLogRightDrawer } from '../features/admin/components/AuditLogRightDrawer';
import NotificationBodyRightDrawer from '../features/common/components/NotificationBodyRightDrawer';

export const RightSidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isOpen, header, bodyType, extraObject } = useAppSelector(state => state.rightDrawer);

    const close = () => {
        dispatch(closeRightDrawer({}));
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? "opacity-50" : "opacity-0"
                }`}
                onClick={close}
            />
            
            {/* Right Drawer */}
            <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{header}</h2>
                    <button
                        onClick={close}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Loading right drawer body according to different body type */}
                    {
                        {
                            [RIGHT_DRAWER_TYPES.NOTIFICATIONS]: <NotificationBodyRightDrawer closeRightDrawer={close} extraObject={extraObject} />,
                            [RIGHT_DRAWER_TYPES.AUDIT_LOGS]: <AuditLogRightDrawer closeRightDrawer={close} {...extraObject} />,
                            [RIGHT_DRAWER_TYPES.SYSTEM_NOTIFICATIONS]: <NotificationBodyRightDrawer closeRightDrawer={close} extraObject={extraObject} />,
                            [RIGHT_DRAWER_TYPES.USER_ACTIVITY]: <div className="p-6">User Activity coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.SYSTEM_HEALTH]: <div className="p-6">System Health coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.NATIONAL_REPORTS]: <div className="p-6">National Reports coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.SYSTEM_MONITORING]: <div className="p-6">System Monitoring dashboard available in main navigation...</div>,
                            [RIGHT_DRAWER_TYPES.USAGE_ANALYTICS]: <div className="p-6">Usage Analytics coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.PERFORMANCE_METRICS]: <div className="p-6">Performance Metrics coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.REGIONAL_MONITORING]: <div className="p-6">Regional Monitoring coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.SCHOOL_MONITORING]: <div className="p-6">School Monitoring coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.SETTINGS]: <div className="p-6">Settings coming soon...</div>,
                            [RIGHT_DRAWER_TYPES.HELP]: <div className="p-6">Help coming soon...</div>,
                        }[bodyType] || <div className="p-6">No content found for type: {bodyType}</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default RightSidebar; 