interface BaseInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
}

export function InputWrapper({
  label,
  error,
  required,
  children,
  className = '',
  helpText
}: BaseInputProps & { children: React.ReactNode }) {
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      {children}
      
      {(error || helpText) && (
        <label className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
          {helpText && <span className="label-text-alt">{helpText}</span>}
        </label>
      )}
    </div>
  );
} 