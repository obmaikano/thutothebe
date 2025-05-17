interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'lg', className = '' }: LoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <span className={`loading loading-spinner loading-${size} text-primary ${className}`}></span>
    </div>
  );
} 