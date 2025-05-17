interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export function Alert({
  type = 'info',
  message,
  onClose
}: AlertProps) {
  const alertClasses = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  };

  return (
    <div className={`alert ${alertClasses[type]}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost"
        >
          ✕
        </button>
      )}
    </div>
  );
} 