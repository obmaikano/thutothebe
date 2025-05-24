# Form Input Management - React Project0 Pattern

Your frontend implements a global form input system following the React Project0 pattern. This allows you to use reusable form components across the entire application with consistent state management.

## 🎯 **Form Input System Overview**

The form input system provides:
- **Global Form Components**: Reusable input components in `/components/Input` folder
- **Unified State Management**: Single pattern for handling form state across all components
- **Consistent API**: All inputs use the same props interface
- **Type Safety**: TypeScript support for all input types
- **DaisyUI Integration**: Consistent styling with your design system

## 📁 **Current File Structure**

```
frontend/src/
├── components/
│   └── Input/
│       ├── InputText.tsx              # Text input component
│       ├── SelectBox.js/.jsx          # Select dropdown component
│       ├── InputNumber.tsx            # Number input component
│       ├── InputDate.tsx              # Date input component
│       ├── InputTextArea.tsx          # Textarea component
│       ├── InputToggle.tsx            # Toggle/switch component
│       └── InputRadio.tsx             # Radio button component
└── features/[feature]/
    └── components/
        └── YourForm.tsx               # Form using global input components
```

## 🚀 **React Project0 Form Pattern**

### **1. Form State Management Pattern**

```typescript
// Standard pattern for any form component
const INITIAL_FORM_OBJ = {
  first_name: "", 
  last_name: "", 
  email: "",
  age: 0,
  is_active: false
};

const [formObj, setFormObj] = useState(INITIAL_FORM_OBJ);
const [errorMessage, setErrorMessage] = useState("");

const updateFormValue = ({ updateType, value }) => {
  setErrorMessage(""); // Clear errors when user types
  setFormObj({ ...formObj, [updateType]: value });
};
```

### **2. Input Component Usage**

```typescript
<InputText 
  type="text" 
  defaultValue={formObj.first_name}  
  updateType="first_name" 
  containerStyle="mt-4"  
  labelTitle="First Name" 
  updateFormValue={updateFormValue}
/>
```

## 🧩 **Available Input Components**

### **📝 InputText Component**

Create this component in `/components/Input/InputText.tsx`:

```typescript
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InputTextProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  defaultValue: string;
  updateType: string;
  containerStyle?: string;
  labelTitle: string;
  labelDescription?: string;
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

  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label">
        <span className="label-text">
          {labelTitle}
          {required && <span className="text-error ml-1">*</span>}
          {labelDescription && (
            <div className="tooltip tooltip-right ml-2" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </span>
      </label>
      <input 
        type={type}
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        placeholder={placeholder}
        disabled={loading || disabled}
        maxLength={maxLength}
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${loading ? 'loading' : ''}`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export default InputText;
```

### **🔢 InputNumber Component**

```typescript
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InputNumberProps {
  defaultValue: number;
  updateType: string;
  containerStyle?: string;
  labelTitle: string;
  labelDescription?: string;
  placeholder?: string;
  updateFormValue: (values: { updateType: string; value: number }) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
}

function InputNumber({
  defaultValue,
  updateType,
  containerStyle,
  labelTitle,
  labelDescription,
  placeholder,
  updateFormValue,
  min,
  max,
  step = 1,
  error,
  required,
  disabled
}: InputNumberProps) {
  const [value, setValue] = useState(defaultValue || 0);

  const updateValue = (newValue: number) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label">
        <span className="label-text">
          {labelTitle}
          {required && <span className="text-error ml-1">*</span>}
          {labelDescription && (
            <div className="tooltip tooltip-right ml-2" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </span>
      </label>
      <input 
        type="number"
        value={value}
        onChange={(e) => updateValue(Number(e.target.value))}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export default InputNumber;
```

### **📝 InputTextArea Component**

```typescript
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InputTextAreaProps {
  defaultValue: string;
  updateType: string;
  containerStyle?: string;
  labelTitle: string;
  labelDescription?: string;
  placeholder?: string;
  updateFormValue: (values: { updateType: string; value: string }) => void;
  rows?: number;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

function InputTextArea({
  defaultValue,
  updateType,
  containerStyle,
  labelTitle,
  labelDescription,
  placeholder,
  updateFormValue,
  rows = 4,
  error,
  required,
  disabled,
  maxLength
}: InputTextAreaProps) {
  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue: string) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label">
        <span className="label-text">
          {labelTitle}
          {required && <span className="text-error ml-1">*</span>}
          {labelDescription && (
            <div className="tooltip tooltip-right ml-2" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </span>
      </label>
      <textarea 
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`textarea textarea-bordered w-full ${error ? 'input-error' : ''}`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export default InputTextArea;
```

### **🔄 InputToggle Component**

```typescript
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InputToggleProps {
  defaultValue: boolean;
  updateType: string;
  containerStyle?: string;
  labelTitle: string;
  labelDescription?: string;
  updateFormValue: (values: { updateType: string; value: boolean }) => void;
  disabled?: boolean;
}

function InputToggle({
  defaultValue,
  updateType,
  containerStyle,
  labelTitle,
  labelDescription,
  updateFormValue,
  disabled
}: InputToggleProps) {
  const [value, setValue] = useState(defaultValue || false);

  const updateValue = (newValue: boolean) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label cursor-pointer">
        <span className="label-text">
          {labelTitle}
          {labelDescription && (
            <div className="tooltip tooltip-right ml-2" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </span>
        <input 
          type="checkbox"
          checked={value}
          onChange={(e) => updateValue(e.target.checked)}
          disabled={disabled}
          className="toggle toggle-primary"
        />
      </label>
    </div>
  );
}

export default InputToggle;
```

### **📅 InputDate Component**

```typescript
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InputDateProps {
  defaultValue: string;
  updateType: string;
  containerStyle?: string;
  labelTitle: string;
  labelDescription?: string;
  updateFormValue: (values: { updateType: string; value: string }) => void;
  min?: string;
  max?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
}

function InputDate({
  defaultValue,
  updateType,
  containerStyle,
  labelTitle,
  labelDescription,
  updateFormValue,
  min,
  max,
  error,
  required,
  disabled
}: InputDateProps) {
  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue: string) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label">
        <span className="label-text">
          {labelTitle}
          {required && <span className="text-error ml-1">*</span>}
          {labelDescription && (
            <div className="tooltip tooltip-right ml-2" data-tip={labelDescription}>
              <Info className='w-4 h-4' />
            </div>
          )}
        </span>
      </label>
      <input 
        type="date"
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export default InputDate;
```

## 🎯 **Common Props Interface**

All input components follow this standard props pattern:

```typescript
interface BaseInputProps {
  // Required props
  defaultValue: any;                    // Current value from parent state
  updateType: string;                   // Key for updating parent state
  labelTitle: string;                   // Label text
  updateFormValue: (values: { updateType: string; value: any }) => void;

  // Optional styling props
  containerStyle?: string;              // CSS classes for container
  labelStyle?: string;                  // CSS classes for label

  // Optional content props
  labelDescription?: string;            // Tooltip description
  placeholder?: string;                 // Input placeholder
  error?: string | null;               // Error message to display

  // Optional behavior props
  required?: boolean;                   // Show required indicator
  disabled?: boolean;                   // Disable input
  loading?: boolean;                    // Show loading state
}
```

## 💼 **Complete Form Example**

```typescript
import React, { useState } from 'react';
import InputText from '../../components/Input/InputText';
import InputNumber from '../../components/Input/InputNumber';
import SelectBox from '../../components/Input/SelectBox';
import InputToggle from '../../components/Input/InputToggle';
import InputDate from '../../components/Input/InputDate';

const INITIAL_USER_OBJ = {
  first_name: "",
  last_name: "",
  email: "",
  age: 0,
  department: "",
  is_active: true,
  start_date: ""
};

const UserForm: React.FC = () => {
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Your form submission logic
      console.log('Submitting:', userObj);
      await submitUser(userObj);
    } catch (error) {
      setErrorMessage('Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  const departmentOptions = [
    { name: "Engineering", value: "engineering" },
    { name: "Marketing", value: "marketing" },
    { name: "Sales", value: "sales" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          type="text"
          defaultValue={userObj.first_name}
          updateType="first_name"
          containerStyle="col-span-1"
          labelTitle="First Name"
          placeholder="Enter first name"
          updateFormValue={updateFormValue}
          required
        />

        <InputText
          type="text"
          defaultValue={userObj.last_name}
          updateType="last_name"
          containerStyle="col-span-1"
          labelTitle="Last Name"
          placeholder="Enter last name"
          updateFormValue={updateFormValue}
          required
        />

        <InputText
          type="email"
          defaultValue={userObj.email}
          updateType="email"
          containerStyle="col-span-2"
          labelTitle="Email Address"
          placeholder="Enter email address"
          updateFormValue={updateFormValue}
          required
        />

        <InputNumber
          defaultValue={userObj.age}
          updateType="age"
          containerStyle="col-span-1"
          labelTitle="Age"
          placeholder="Enter age"
          updateFormValue={updateFormValue}
          min={18}
          max={100}
        />

        <SelectBox
          defaultValue={userObj.department}
          updateType="department"
          containerStyle="col-span-1"
          labelTitle="Department"
          placeholder="Select department"
          options={departmentOptions}
          updateFormValue={updateFormValue}
        />

        <InputDate
          defaultValue={userObj.start_date}
          updateType="start_date"
          containerStyle="col-span-1"
          labelTitle="Start Date"
          updateFormValue={updateFormValue}
        />

        <InputToggle
          defaultValue={userObj.is_active}
          updateType="is_active"
          containerStyle="col-span-1"
          labelTitle="Active User"
          updateFormValue={updateFormValue}
        />
      </div>

      {errorMessage && (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="modal-action">
        <button type="button" className="btn btn-ghost">
          Cancel
        </button>
        <button 
          type="submit" 
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save User'}
        </button>
      </div>
    </form>
  );
};
```

## 🔧 **Best Practices**

### **1. Form Validation**
```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};
  
  if (!userObj.first_name.trim()) {
    errors.first_name = 'First name is required';
  }
  
  if (!userObj.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(userObj.email)) {
    errors.email = 'Email is invalid';
  }
  
  return errors;
};
```

### **2. Loading States**
```typescript
// Pass loading state to all inputs during form submission
<InputText
  defaultValue={userObj.first_name}
  updateType="first_name"
  labelTitle="First Name"
  updateFormValue={updateFormValue}
  loading={isLoading}  // Disable during submission
/>
```

### **3. Error Handling**
```typescript
// Pass field-specific errors
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

<InputText
  defaultValue={userObj.email}
  updateType="email"
  labelTitle="Email"
  updateFormValue={updateFormValue}
  error={fieldErrors.email}  // Show field-specific error
/>
```

## ✅ **Current Implementation Status**

Your form input system properly follows React Project0 patterns:

- ✅ Global input components in `/components/Input/`
- ✅ Unified `updateFormValue` pattern
- ✅ Consistent props interface across all inputs
- ✅ DaisyUI integration for styling
- ✅ TypeScript support
- ✅ Loading and error state management
- ✅ SelectBox component already implemented

This system provides a scalable, maintainable solution for form management across your entire application! 