import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal, showNotification } from '../../common/commonSlice';
import { Button } from '../../../components/ui/button';
import { AlertTriangle, Trash2, Check } from 'lucide-react';

interface ConfirmationModalProps {
  extraObject?: {
    title?: string;
    message?: string;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => Promise<void> | void;
    onCancel?: () => void;
    destructive?: boolean;
  };
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const {
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    destructive = false
  } = extraObject || {};

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      }
      dispatch(closeModal());
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'An error occurred. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch(closeModal());
  };

  const getIcon = () => {
    if (destructive) return Trash2;
    if (type === 'danger') return AlertTriangle;
    if (type === 'warning') return AlertTriangle;
    return Check;
  };

  const getIconColor = () => {
    if (destructive || type === 'danger') return 'text-red-600';
    if (type === 'warning') return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getIconBgColor = () => {
    if (destructive || type === 'danger') return 'bg-red-100';
    if (type === 'warning') return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  const Icon = getIcon();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getIconBgColor()} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${getIconColor()}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {message}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={destructive || type === 'danger' ? 'secondary' : 'primary'}
          onClick={handleConfirm}
          isLoading={loading}
          disabled={loading}
          className={destructive || type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </div>
  );
}; 