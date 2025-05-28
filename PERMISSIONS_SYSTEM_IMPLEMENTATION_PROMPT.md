# Frontend Implementation Prompt: Permissions & Role Management System

## Overview
Implement a comprehensive frontend interface for the permissions and role management system targeting administrative roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, and **DEPARTMENT_HEAD**.

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
    userPermissions: userPermissionsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/permissions/
├── pages/
│   ├── PermissionsListPage.tsx
│   ├── RolePermissionsPage.tsx
│   ├── UserPermissionsPage.tsx
│   ├── PermissionManagementPage.tsx
│   └── RoleManagementPage.tsx
├── components/
│   ├── PermissionCard.tsx
│   ├── PermissionForm.tsx
│   ├── RolePermissionMatrix.tsx
│   ├── PermissionChecker.tsx
│   ├── RoleSelector.tsx
│   └── PermissionFilters.tsx
├── modals/
│   ├── CreatePermissionModal.tsx
│   ├── EditPermissionModal.tsx
│   ├── AssignPermissionModal.tsx
│   ├── RolePermissionModal.tsx
│   └── PermissionDetailsModal.tsx
├── permissionsSlice.ts
├── rolePermissionsSlice.ts
├── userPermissionsSlice.ts
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

export interface Permission {
  id: number;
  name: string;
  description?: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXECUTE' | 'APPROVE' | 'MANAGE' | 'VIEW' | 'EDIT' | 'ASSIGN';
  resource: string;
  scope: 'GLOBAL' | 'REGIONAL' | 'SCHOOL' | 'DEPARTMENT' | 'CLASS' | 'COURSE' | 'USER';
  category: 'SYSTEM' | 'ACADEMIC' | 'ADMINISTRATIVE' | 'CONTENT' | 'USER_MANAGEMENT' | 'REPORTING';
  isSystemPermission: boolean;
  requiresApproval: boolean;
  conditions?: string;
  metadata?: {
    priority: number;
    dependencies: number[];
    conflictsWith: number[];
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: number;
  role: 'SUPER_ADMIN' | 'MINISTRY_EXECUTIVE' | 'MINISTRY_STAFF' | 'DIRECTOR' | 'REGIONAL_ADMIN' | 'REGIONAL_OFFICER' | 'SCHOOL_ADMIN' | 'SCHOOL_HEAD' | 'DEPARTMENT_HEAD' | 'SENIOR_TEACHER' | 'TEACHER' | 'STUDENT' | 'PARENT';
  permissionId: number;
  permission?: Permission;
  scopeType?: 'GLOBAL' | 'REGIONAL' | 'SCHOOL' | 'DEPARTMENT' | 'CLASS' | 'COURSE' | 'USER';
  scopeId?: number;
  grantedById: number;
  grantedAt: string;
  expiresAt?: string;
  conditions?: string;
  isInherited: boolean;
  isActive: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissionCheck {
  userId: number;
  permissionName: string;
  resource?: string;
  action?: string;
  scopeType?: string;
  scopeId?: number;
  hasPermission: boolean;
  grantedBy: 'ROLE' | 'DIRECT' | 'INHERITED';
  source?: string;
  conditions?: string[];
  expiresAt?: string;
}

const permissionApi = {
  getAll: async (): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get('/permissions');
  },
  getById: async (id: number): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get(`/permissions/${id}`);
  },
  getByName: async (name: string): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get(`/permissions/name/${name}`);
  },
  getActive: async (): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get('/permissions/active');
  },
  getByCategory: async (category: string): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get(`/permissions/category/${category}`);
  },
  getByAction: async (action: string): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get(`/permissions/action/${action}`);
  },
  getByResource: async (resource: string): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get(`/permissions/resource/${resource}`);
  },
  getByScope: async (scope: string): Promise<AxiosResponse<PermissionResponse>> => {
    return api.get(`/permissions/scope/${scope}`);
  },
  create: async (permissionData: CreatePermissionRequest): Promise<AxiosResponse<PermissionResponse>> => {
    return api.post('/permissions', permissionData);
  },
  update: async (id: number, permissionData: UpdatePermissionRequest): Promise<AxiosResponse<PermissionResponse>> => {
    return api.put(`/permissions/${id}`, permissionData);
  },
  delete: async (id: number): Promise<AxiosResponse<PermissionResponse>> => {
    return api.delete(`/permissions/${id}`);
  },
  activate: async (id: number): Promise<AxiosResponse<PermissionResponse>> => {
    return api.post(`/permissions/${id}/activate`);
  },
  deactivate: async (id: number): Promise<AxiosResponse<PermissionResponse>> => {
    return api.post(`/permissions/${id}/deactivate`);
  },
};

const rolePermissionApi = {
  getAll: async (): Promise<AxiosResponse<{ data: RolePermission[] }>> => {
    return api.get('/role-permissions');
  },
  getById: async (id: number): Promise<AxiosResponse<{ data: RolePermission }>> => {
    return api.get(`/role-permissions/${id}`);
  },
  getByRole: async (role: string): Promise<AxiosResponse<{ data: RolePermission[] }>> => {
    return api.get(`/role-permissions/role/${role}`);
  },
  getActiveByRole: async (role: string): Promise<AxiosResponse<{ data: RolePermission[] }>> => {
    return api.get(`/role-permissions/role/${role}/active`);
  },
  getByPermission: async (permissionId: number): Promise<AxiosResponse<{ data: RolePermission[] }>> => {
    return api.get(`/role-permissions/permission/${permissionId}`);
  },
  getByScope: async (scopeType: string, scopeId: number): Promise<AxiosResponse<{ data: RolePermission[] }>> => {
    return api.get(`/role-permissions/scope/${scopeType}/${scopeId}`);
  },
  checkUserPermission: async (checkData: UserPermissionCheck): Promise<AxiosResponse<{ data: UserPermissionCheck }>> => {
    return api.post('/role-permissions/check', checkData);
  },
  assignPermissionToRole: async (role: string, permissionId: number, scopeType?: string, scopeId?: number): Promise<AxiosResponse<{ data: RolePermission }>> => {
    const params = new URLSearchParams({ role, permissionId: permissionId.toString() });
    if (scopeType) params.append('scopeType', scopeType);
    if (scopeId) params.append('scopeId', scopeId.toString());
    return api.post(`/role-permissions/assign?${params.toString()}`);
  },
  removePermissionFromRole: async (role: string, permissionId: number, scopeType?: string, scopeId?: number): Promise<AxiosResponse<void>> => {
    const params = new URLSearchParams({ role, permissionId: permissionId.toString() });
    if (scopeType) params.append('scopeType', scopeType);
    if (scopeId) params.append('scopeId', scopeId.toString());
    return api.delete(`/role-permissions/remove?${params.toString()}`);
  },
  initializeDefaultRolePermissions: async (): Promise<AxiosResponse<void>> => {
    return api.post('/role-permissions/initialize');
  },
  create: async (rolePermissionData: CreateRolePermissionRequest): Promise<AxiosResponse<{ data: RolePermission }>> => {
    return api.post('/role-permissions', rolePermissionData);
  },
  update: async (id: number, rolePermissionData: UpdateRolePermissionRequest): Promise<AxiosResponse<{ data: RolePermission }>> => {
    return api.put(`/role-permissions/${id}`, rolePermissionData);
  },
  delete: async (id: number): Promise<AxiosResponse<void>> => {
    return api.delete(`/role-permissions/${id}`);
  },
};

export default { permissionApi, rolePermissionApi };
```

## Core Features to Implement

### 1. Permission Management Interface

**New Redux Slices to Create:**
```typescript
// src/features/permissions/permissionsSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearCurrentPermission: (state) => {
      state.currentPermission = null;
    },
    clearPermissionsError: (state) => {
      state.error = null;
    },
    setPermissionFilter: (state, action) => {
      state.filter = action.payload;
    },
    updatePermissionStatus: (state, action) => {
      const permission = state.permissions.find(p => p.id === action.payload.id);
      if (permission) {
        permission.active = action.payload.active;
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New Pages to Create:**
- `PermissionsListPage.tsx` - View and manage all permissions
- `RolePermissionsPage.tsx` - Manage role-based permissions
- `UserPermissionsPage.tsx` - Check and manage user permissions
- `PermissionManagementPage.tsx` - Advanced permission management
- `RoleManagementPage.tsx` - Role configuration and management

### 2. Permission System
Comprehensive permission management:
- Permission creation and editing
- Resource-based permissions
- Action-based access control
- Scope-based restrictions
- Permission dependencies

### 3. Role-Based Access Control
Advanced RBAC implementation:
- Role permission assignment
- Permission inheritance
- Scope-based permissions
- Conditional permissions
- Permission conflicts resolution

### 4. User Permission Checking
Real-time permission validation:
- Permission checking interface
- User capability assessment
- Access control validation
- Permission audit trails
- Dynamic permission evaluation

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
  'MINISTRY_EXECUTIVE'
].includes(userRole);

const canViewPermissions = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'SCHOOL_ADMIN'
].includes(userRole);

const canAssignPermissions = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF'
].includes(userRole);

const canManageRoles = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE'
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
  PERMISSION_DETAILS: "PERMISSION_DETAILS",
  ASSIGN_PERMISSION: "ASSIGN_PERMISSION",
  ROLE_PERMISSION_MATRIX: "ROLE_PERMISSION_MATRIX",
  PERMISSION_CHECK: "PERMISSION_CHECK",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handlePermissionAssignment = async (assignmentData: AssignPermissionData) => {
  try {
    await dispatch(assignPermissionToRole(assignmentData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to assign permission:', error);
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

### 1. Permission Card Component
```typescript
// src/features/permissions/components/PermissionCard.tsx
// Display permission information in card format
// Follow existing component patterns
```

### 2. Role Permission Matrix Component
```typescript
// src/features/permissions/components/RolePermissionMatrix.tsx
// Interactive matrix for role-permission assignments
// Follow existing component patterns
```

### 3. Permission Checker Component
```typescript
// src/features/permissions/components/PermissionChecker.tsx
// Real-time permission checking interface
// Follow existing component patterns
```

### 4. Permission Form Component
```typescript
// src/features/permissions/components/PermissionForm.tsx
// Form for creating and editing permissions
// Follow existing form patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include permission routes:
```typescript
// Add to existing navigation items
{
  label: 'Permissions',
  icon: Shield,
  submenu: [
    { label: 'All Permissions', path: '/app/permissions' },
    { label: 'Role Permissions', path: '/app/permissions/roles' },
    { label: 'User Permissions', path: '/app/permissions/users' },
    { label: 'Permission Check', path: '/app/permissions/check' },
    { label: 'Role Management', path: '/app/permissions/role-management' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/permissions" element={<PermissionsListPage />} />
<Route path="/permissions/:id" element={<PermissionDetailsPage />} />
<Route path="/permissions/create" element={<CreatePermissionPage />} />
<Route path="/permissions/roles" element={<RolePermissionsPage />} />
<Route path="/permissions/users" element={<UserPermissionsPage />} />
<Route path="/permissions/check" element={<PermissionCheckPage />} />
<Route path="/permissions/role-management" element={<RoleManagementPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (params: PermissionFetchParams, { rejectWithValue }) => {
    try {
      const response = await permissionApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (permissionData: CreatePermissionData, { rejectWithValue }) => {
    try {
      const response = await permissionApi.create(permissionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create permission');
    }
  }
);

export const assignPermissionToRole = createAsyncThunk(
  'rolePermissions/assignPermissionToRole',
  async (assignmentData: AssignPermissionData, { rejectWithValue }) => {
    try {
      const response = await rolePermissionApi.assignPermissionToRole(
        assignmentData.role,
        assignmentData.permissionId,
        assignmentData.scopeType,
        assignmentData.scopeId
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign permission');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [permissionCategoryFilter, setPermissionCategoryFilter] = useState('ALL');
const [roleFilter, setRoleFilter] = useState('');
const [scopeFilter, setScopeFilter] = useState('');
const [activeFilter, setActiveFilter] = useState(true);
const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Permission Updates
- Real-time permission changes
- Live role updates
- Instant access control changes
- Permission conflict detection

### 2. Permission Validation
- Real-time permission checking
- Dynamic access validation
- Live permission inheritance
- Instant conflict resolution

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Permission Security Features
```typescript
// Implement permission access control
const canManagePermission = (permission: Permission, user: User) => {
  // Only super admins can manage system permissions
  if (permission.isSystemPermission && user.role !== 'SUPER_ADMIN') {
    return false;
  }
  
  // Ministry executives can manage most permissions
  if (['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(user.role)) {
    return true;
  }
  
  // Other roles have limited permission management
  return false;
};

// Implement role permission validation
const canAssignRolePermission = (role: string, permission: Permission, user: User) => {
  // Super admins can assign any permission to any role
  if (user.role === 'SUPER_ADMIN') return true;
  
  // Ministry executives can assign non-system permissions
  if (user.role === 'MINISTRY_EXECUTIVE' && !permission.isSystemPermission) {
    return true;
  }
  
  // Regional admins can only assign permissions within their scope
  if (user.role === 'REGIONAL_ADMIN' && permission.scope === 'REGIONAL') {
    return true;
  }
  
  return false;
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Permission-Specific Optimizations
- Efficient permission checking
- Smart role matrix rendering
- Optimized permission inheritance
- Permission caching strategies

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Permission-Specific Testing
- Test permission assignment workflow
- Test role-based access control
- Test permission checking accuracy
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `permissionsSlice.ts`, `rolePermissionsSlice.ts`, `userPermissionsSlice.ts`
2. **New API Services**: `permissionApi.ts`, `rolePermissionApi.ts`
3. **New Pages**: Permission and role management pages
4. **New Components**: Permission-specific reusable components
5. **Enhanced Existing Pages**: Integration with user management
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Permission-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Permission management functioning properly
- Role permission assignment working correctly
- Permission checking functioning as expected
- Real-time updates working reliably
- Responsive design consistent with existing pages
- Permission security measures properly implemented

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
11. **DO** implement proper permission validation
12. **DO** ensure secure permission handling
13. **DO** implement comprehensive permission tracking
14. **DO** optimize for complex permission hierarchies

This implementation should seamlessly integrate with the existing codebase while providing comprehensive permission and role management capabilities for administrative users in the educational system. 