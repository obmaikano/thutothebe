# Modal Management - React Project0 Pattern

Your frontend implements a global modal system following the React Project0 pattern. This allows you to use a single modal component across the entire application without creating separate modals for each page.

## 🎯 **Modal System Overview**

The modal system uses Redux for state management and provides:
- **Single Modal Component**: One modal handles all content types
- **Global State**: Redux manages modal open/close state
- **Lazy Loading**: Modal content components are loaded on demand
- **Type Safety**: TypeScript support for all modal types
- **Flexible Content**: Any component can be used as modal content

## 📁 **Current File Structure**

```
frontend/src/
├── features/common/
│   ├── modalSlice.tsx                    # Redux state management
│   └── components/
│       └── ModalContentSwitch.tsx       # Modal content router
├── containers/
│   └── ModalLayout.tsx                   # Main modal component
├── utils/
│   └── modalConstants.ts                 # Modal type constants
└── features/[feature]/
    └── modals/
        └── YourModal.tsx                 # Feature-specific modal components
```

## 🚀 **Adding a New Modal**

Follow these steps to add a new modal:

### **Step 1: Create Modal Component**

Create your modal content component in the appropriate feature folder:

```typescript
// Example: /src/features/users/modals/CreateUserModal.tsx
import React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';

interface CreateUserModalProps {
  extraObject?: any;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating user...', extraObject);
    handleClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Name</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter user name" 
            className="input input-bordered" 
          />
        </div>
        
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserModal;
```

### **Step 2: Add Modal Type Constant**

Add your new modal type to `/utils/modalConstants.ts`:

```typescript
export const MODAL_BODY_TYPES = {
  // Existing types...
  USER_ADD_NEW: "USER_ADD_NEW",
  USER_EDIT: "USER_EDIT",
  
  // Add your new modal type
  USER_CREATE: "USER_CREATE",  // 👈 Add this line
  
  // Other types...
  CONFIRMATION: "CONFIRMATION",
  DEFAULT: "DEFAULT"
};
```

### **Step 3: Register in ModalContentSwitch**

Add your component to `/features/common/components/ModalContentSwitch.tsx`:

```typescript
// Add lazy import at the top
const CreateUserModal = lazy(() => import('../../users/modals/CreateUserModal'));

// Add case in the switch statement
export const ModalContentSwitch: React.FC<ModalContentSwitchProps> = ({ content, contentProps }) => {
  switch (content) {
    // Existing cases...
    
    case MODAL_BODY_TYPES.USER_CREATE:  // 👈 Add this case
      return (
        <Suspense fallback={fallback}>
          <CreateUserModal extraObject={contentProps} />
        </Suspense>
      );
    
    // Other cases...
    default:
      return <div>No content found for type: {content}</div>;
  }
};
```

### **Step 4: Use the Modal**

Call the modal from any component using the dispatch method:

```typescript
import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { openModal } from '../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../utils/modalConstants';

const YourComponent: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleOpenCreateModal = () => {
    dispatch(openModal({
      title: "Create New User",
      bodyType: MODAL_BODY_TYPES.USER_CREATE,
      size: "md",  // sm, md, lg, xl
      extraObject: {
        // Pass any data you need in the modal
        departmentId: "123",
        defaultRole: "user"
      }
    }));
  };

  return (
    <div>
      <button 
        className="btn btn-primary" 
        onClick={handleOpenCreateModal}
      >
        Create User
      </button>
    </div>
  );
};
```

## 🎛️ **Modal Configuration Options**

When calling `openModal()`, you can pass these options:

```typescript
dispatch(openModal({
  title: "Modal Title",              // Required: Modal header title
  bodyType: MODAL_BODY_TYPES.TYPE,   // Required: Modal content type
  size: "md",                        // Optional: sm, md, lg, xl (default: md)
  extraObject: {                     // Optional: Data to pass to modal
    id: 123,
    data: "any data",
    callbacks: () => void
  },
  mode: "create" // Optional: Mode for the modal (create, edit, view)
}));
```

## 📋 **Available Modal Types**

Current modal types defined in `modalConstants.ts`:

```typescript
// User Management
USER_ADD_NEW, USER_EDIT, USER_DELETE_CONFIRMATION, USER_ASSIGN_ROLE

// School Management  
SCHOOL_ADD_NEW, SCHOOL_EDIT, SCHOOL_DELETE_CONFIRMATION, SCHOOL_ASSIGN_ADMIN

// Region Management
REGION_ADD_NEW, REGION_EDIT, REGION_DELETE_CONFIRMATION

// Role Management
ROLE_ADD_NEW, ROLE_EDIT, ROLE_DELETE_CONFIRMATION, ROLE_ASSIGN_PERMISSIONS

// Course Management
COURSE_ADD_NEW, COURSE_EDIT, COURSE_DELETE_CONFIRMATION, COURSE_ASSIGN_TEACHER

// System Management
SYSTEM_RULE_ADD_NEW, SYSTEM_RULE_EDIT, SYSTEM_RULE_DELETE_CONFIRMATION

// General
CONFIRMATION, DEFAULT
```

## 🔧 **Best Practices**

### **1. Modal Component Structure**
```typescript
interface YourModalProps {
  extraObject?: any;  // Always include for data passing
}

export const YourModal: React.FC<YourModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  
  const handleClose = () => {
    dispatch(closeModal({}));
  };

  // Your modal logic here
  
  return (
    <div>
      {/* Modal content */}
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
        <button className="btn btn-primary">Confirm</button>
      </div>
    </div>
  );
};
```

### **2. Error Handling**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    // Your API call
    await api.createUser(data);
    handleClose();
  } catch (err) {
    setError('Failed to create user');
  } finally {
    setIsLoading(false);
  }
};
```

### **3. Form Validation**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email')
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

## ✅ **Current Implementation Status**

Your modal system is properly implemented with:

- ✅ Redux state management (`modalSlice.tsx`)
- ✅ Global modal layout (`ModalLayout.tsx`)
- ✅ Content switching system (`ModalContentSwitch.tsx`)
- ✅ Type constants (`modalConstants.ts`)
- ✅ Lazy loading for performance
- ✅ TypeScript support
- ✅ DaisyUI styling integration

The system follows React Project0 patterns perfectly and provides a scalable solution for modal management across your application! 