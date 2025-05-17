interface PageTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageTitle({ title, subtitle, children }: PageTitleProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
} 