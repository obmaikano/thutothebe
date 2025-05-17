interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled
}: RadioGroupProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option.value} className="label cursor-pointer justify-start gap-2">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`radio ${error ? 'radio-error' : ''}`}
            />
            <span className="label-text">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
} 