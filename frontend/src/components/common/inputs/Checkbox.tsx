interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  error,
  size = 'md'
}: CheckboxProps) {
  const sizeClasses = {
    xs: 'checkbox-xs',
    sm: 'checkbox-sm',
    md: 'checkbox-md',
    lg: 'checkbox-lg'
  };

  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={`
            checkbox
            ${error ? 'checkbox-error' : ''}
            ${sizeClasses[size]}
          `}
        />
        {label && <span className="label-text">{label}</span>}
      </label>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
} 