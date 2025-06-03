# Frontend Implementation Prompt: Permissions & Role Management System for Administrative Roles

## Overview
Implement a comprehensive frontend interface for the permissions and user role management system targeting administrative roles above school head level: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER** and **SCHOOL_ADMIN**.

**IMPORTANT**: Follow the established code architecture and patterns in the existing frontend project. Stick strictly to the already established design patterns and conventions. Do not invent or hallucinate new functions, services, or modules that aren't present in the existing codebase. Ensure compatibility and consistency with the existing structure.

## Existing Technology Stack (DO NOT CHANGE)
- **Framework**: React 18+ with TypeScript and Vite
- **State Management**: Redux Toolkit (already configured)
- **UI Library**: DaisyUI with Tailwind CSS (already configured)
- **Routing**: React Router v6+ (already configured)
- **HTTP Client**: Axios with interceptors (already configured)
- **Form Management**: React Hook Form with Zod validation (already available)
- **Data Tables**: React Data Table Component (already available)
- **Charts**: Chart.js with react-chartjs-2 (already configured)
- **Authentication**: JWT token management (already implemented)
- **Icons**: Lucide React (already available)

## Existing Architecture Patterns to Follow

### 1. Redux Store Structure (EXISTING)
The application already uses Redux Toolkit with the following structure:
```typescript
// Existing store structure in src/app/store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    // ... other existing reducers
    // ADD NEW REDUCERS HERE:
    permissions: permissionsReducer,  // TO BE CREATED
    rolePermissions: rolePermissionsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/permissions/
├── pages/
│   ├── PermissionMatrixPage.tsx
│   ├── RoleManagementPage.tsx
│   └── PermissionAuditPage.tsx
├── components/
│   ├── PermissionMatrix.tsx
│   ├── RoleHierarchyViewer.tsx
│   └── PermissionScopeSelector.tsx
├── modals/
│   ├── AssignPermissionModal.tsx
│   ├── CreateRoleModal.tsx
│   └── BulkPermissionModal.tsx
├── permissionsSlice.ts
├── rolePermissionsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/permissionApi.ts
// src/api/services/rolePermissionApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface PermissionResponse {
  status: string;
  message: string;
  data: Permission | Permission[] | null;
  timestamp: string | null;
}

const permissionApi = {
  getAll: async (): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get('/permissions');
  },
  // ... other methods following existing pattern
};

export default permissionApi;
```

### 4. Component Patterns (EXISTING)
Follow existing component patterns from `src/components/common/`:
- Use existing `Button.tsx`, `Modal.tsx`, `Input.tsx`, `Select.tsx` components
- Follow existing styling with DaisyUI classes
- Use existing `Table.tsx` component for data display
- Follow existing form patterns with React Hook Form

### 5. Page Structure Pattern (EXISTING)
Follow the existing pattern from `src/features/users/pages/UserListPage.tsx`:
```typescript
const PermissionMatrixPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { permissions, status, error } = useAppSelector(state => state.permissions);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchPermissions());
    return () => {
      dispatch(clearPermissionsError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreatePermission = () => {
    dispatch(openModal({
      title: 'Create New Permission',
      bodyType: MODAL_BODY_TYPES.PERMISSION_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-600 mt-2">Manage system permissions and roles</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Role-Based Dashboard Enhancement
Extend existing dashboard functionality for administrative roles:

**Add to existing dashboard features:**
- Permission audit widgets
- Role distribution charts using existing Chart.js setup
- User activity monitoring within scope
- System health indicators for permissions

### 2. Permission Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/permissions/permissionsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    // Follow existing reducer patterns
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/permissionApi.ts
// src/api/services/rolePermissionApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `PermissionMatrixPage.tsx` - Interactive permission matrix
- `RoleManagementPage.tsx` - Role hierarchy and management
- `PermissionAuditPage.tsx` - Audit logs and compliance

### 3. User Management Enhancement
Extend existing `UserListPage.tsx` with permission-specific features:
- Add permission override capabilities
- Add bulk role assignment
- Add scope-based filtering
- Add permission audit trail per user

### 4. Organizational Structure Integration
Extend existing region/school management with permission context:
- Add permission scope visualization
- Add role assignment within organizational units
- Add permission inheritance display

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canManagePermissions = [
  'SUPER_ADMIN', 
  'MINISTRY_EXECUTIVE', 
  'MINISTRY_STAFF'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  PERMISSION_ADD_NEW: "PERMISSION_ADD_NEW",
  PERMISSION_EDIT: "PERMISSION_EDIT",
  ROLE_ASSIGN: "ROLE_ASSIGN",
  BULK_PERMISSION_UPDATE: "BULK_PERMISSION_UPDATE",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handlePermissionUpdate = async () => {
  try {
    await dispatch(updatePermission(permissionData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to update permission:', error);
    // Error handling following existing pattern
  }
};
```

### 4. Follow Existing Styling Patterns
Use existing DaisyUI classes and patterns:
```typescript
// Follow existing button patterns
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">

// Follow existing card patterns
<div className="bg-white border border-gray-200 rounded-lg p-6">

// Follow existing table patterns using existing Table component
<Table 
  data={permissions}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Permission Matrix Component
```typescript
// src/features/permissions/components/PermissionMatrix.tsx
// Use existing Table component as base
// Follow existing component patterns
```

### 2. Role Hierarchy Viewer
```typescript
// src/features/permissions/components/RoleHierarchyViewer.tsx
// Use existing styling patterns
// Follow existing component structure
```

### 3. Permission Scope Selector
```typescript
// src/features/permissions/components/PermissionScopeSelector.tsx
// Extend existing Select component
// Follow existing form patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include permission management routes:
```typescript
// Add to existing navigation items
{
  label: 'Permission Management',
  icon: Shield,
  submenu: [
    { label: 'Permission Matrix', path: '/app/permissions/matrix' },
    { label: 'Role Management', path: '/app/permissions/roles' },
    { label: 'Audit Logs', path: '/app/permissions/audit' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/permissions/matrix" element={<PermissionMatrixPage />} />
<Route path="/permissions/roles" element={<RoleManagementPage />} />
<Route path="/permissions/audit" element={<PermissionAuditPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from UserListPage
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('');
const [scopeFilter, setScopeFilter] = useState('');
```

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Follow Existing Permission Checking
```typescript
// Use existing role checking patterns
const canAccessFeature = (requiredRoles: string[]) => {
  return requiredRoles.includes(user?.role);
};
```

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure (if any)
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Integration with Existing Features
- Ensure compatibility with existing user management
- Test integration with existing authentication
- Verify compatibility with existing modal system

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Leverage Existing Infrastructure
- Use existing WebSocket service for real-time updates
- Use existing caching patterns
- Follow existing error boundary patterns

## Deliverables

1. **New Redux Slices**: `permissionsSlice.ts`, `rolePermissionsSlice.ts`
2. **New API Services**: `permissionApi.ts`, `rolePermissionApi.ts`
3. **New Pages**: Permission matrix, role management, audit pages
4. **New Components**: Permission-specific reusable components
5. **Enhanced Existing Pages**: Extended user management with permissions
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Permission-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time updates using existing WebSocket infrastructure
- Responsive design consistent with existing pages

## Implementation Notes

1. **DO NOT** create new authentication systems - use existing `AuthContext`
2. **DO NOT** create new HTTP clients - use existing `api` from `src/api/index.ts`
3. **DO NOT** create new styling systems - use existing DaisyUI + Tailwind
4. **DO NOT** create new modal systems - extend existing `modalSlice`
5. **DO NOT** create new routing systems - extend existing React Router setup
6. **DO** follow existing file naming conventions
7. **DO** follow existing component structure patterns
8. **DO** follow existing Redux patterns and naming
9. **DO** use existing utility functions and helpers
10. **DO** maintain consistency with existing error handling patterns

This implementation should seamlessly integrate with the existing codebase while providing powerful permission management capabilities for administrative users. 