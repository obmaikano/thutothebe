import { InputWrapper } from './BaseInput';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
}

export function TextInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  prefix,
  suffix,
  ...wrapperProps
}: TextInputProps) {
  const input = (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`input input-bordered w-full ${wrapperProps.error ? 'input-error' : ''}`}
    />
  );

  return (
    <InputWrapper {...wrapperProps}>
      {prefix || suffix ? (
        <label className="input-group">
          {prefix && <span>{prefix}</span>}
          {input}
          {suffix && <span>{suffix}</span>}
        </label>
      ) : input}
    </InputWrapper>
  );
} 