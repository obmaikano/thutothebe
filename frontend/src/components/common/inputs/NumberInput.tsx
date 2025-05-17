interface NumberInputProps {
  label?: string;
  placeholder?: string;
  value: number | '';
  onChange: (value: number | '') => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export function NumberInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  min,
  max,
  step,
  prefix,
  suffix
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? '' : Number(e.target.value);
    onChange(newValue);
  };

  const input = (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
    />
  );

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
      
      {(prefix || suffix) ? (
        <label className="input-group">
          {prefix && <span>{prefix}</span>}
          {input}
          {suffix && <span>{suffix}</span>}
        </label>
      ) : input}

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
} 