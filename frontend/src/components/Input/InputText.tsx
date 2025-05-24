import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InputTextProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  defaultValue: string;
  updateType: string;
  containerStyle?: string;
  labelTitle: string;
  labelDescription?: string;
  labelStyle?: string;
  placeholder?: string;
  updateFormValue: (values: { updateType: string; value: string }) => void;
  loading?: boolean;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

function InputText({
  type = 'text',
  defaultValue,
  updateType,
  containerStyle,
  labelTitle,
  labelDescription,
  labelStyle,
  placeholder,
  updateFormValue,
  loading,
  error,
  required,
  disabled,
  maxLength
}: InputTextProps) {
  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue: string) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  return (
    <div className={`inline-block ${containerStyle}`}>
      <label className={`label ${labelStyle}`}>
        <div className="label-text">
          {labelTitle}
          {required && <span className="text-error ml-1">*</span>}
          {labelDescription && (
            <div className="tooltip tooltip-right" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </div>
      </label>

      <input 
        type={type}
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        placeholder={placeholder}
        disabled={loading || disabled}
        maxLength={maxLength}
        className={`input input-bordered w-full ${loading ? 'loading' : ''}`}
      />
    </div>
  );
}

export default InputText; 