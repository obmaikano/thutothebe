import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface SelectOption {
  name: string;
  value: string;
}

interface SelectBoxProps {
  labelTitle: string;
  labelDescription?: string;
  defaultValue?: string;
  containerStyle?: string;
  placeholder?: string;
  labelStyle?: string;
  options: SelectOption[];
  updateType: string;
  updateFormValue: (values: { updateType: string; value: string }) => void;
  loading?: boolean;
  error?: string | null;
}

function SelectBox({
  labelTitle,
  labelDescription,
  defaultValue,
  containerStyle,
  placeholder,
  labelStyle,
  options,
  updateType,
  updateFormValue,
  loading,
  error
}: SelectBoxProps) {
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
          {labelDescription && (
            <div className="tooltip tooltip-right" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </div>
      </label>

      <select 
        className={`select select-bordered w-full ${loading ? 'loading' : ''}`} 
        value={value} 
        onChange={(e) => updateValue(e.target.value)}
        disabled={loading}
      >
        <option disabled value="PLACEHOLDER">{loading ? "Loading..." : placeholder}</option>
        {!loading && options && options.map((o, k) => (
          <option value={o.value || o.name} key={k}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectBox; 