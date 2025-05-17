interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', fullScreen }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base-100/50 z-50">
        <span className={`loading loading-spinner ${sizeClasses[size]}`}></span>
      </div>
    );
  }

  return <span className={`loading loading-spinner ${sizeClasses[size]}`}></span>;
} 