import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearNotification } from '../commonSlice';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

export function Notification() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(state => state.common.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const icons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />
  };

  return (
    <div className="toast toast-top toast-end">
      <div className={`alert alert-${notification.type}`}>
        {icons[notification.type]}
        <span>{notification.message}</span>
      </div>
    </div>
  );
} 