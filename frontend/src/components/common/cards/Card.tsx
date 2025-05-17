interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, actions, className }: CardProps) {
  return (
    <div className={`card bg-base-100 shadow-sm ${className || ''}`}>
      {(title || subtitle) && (
        <div className="card-body">
          {title && <h2 className="card-title">{title}</h2>}
          {subtitle && <p className="text-base-content/60">{subtitle}</p>}
          {children}
          {actions && <div className="card-actions justify-end">{actions}</div>}
        </div>
      )}
    </div>
  );
} 