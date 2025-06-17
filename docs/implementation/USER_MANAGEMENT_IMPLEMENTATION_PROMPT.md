# Frontend Implementation Prompt: User Management System for Administrative Roles

## Overview
Implement a comprehensive frontend interface for the user management system targeting administrative roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER** and **SCHOOL_ADMIN**. This system will handle user lifecycle management, profile administration, and organizational user hierarchies.

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
    users: usersReducer,  // TO BE ENHANCED
    userProfiles: userProfilesReducer,  // TO BE CREATED
    userActivity: userActivityReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/users/
├── pages/
│   ├── UserListPage.tsx  // ENHANCE EXISTING
│   ├── UserProfilePage.tsx
│   ├── UserAnalyticsPage.tsx
│   └── BulkUserManagementPage.tsx
├── components/
│   ├── UserTable.tsx
│   ├── UserProfileCard.tsx
│   ├── UserStatsWidget.tsx
│   └── OrganizationalUserTree.tsx
├── modals/
│   ├── CreateUserModal.tsx
│   ├── EditUserModal.tsx
│   ├── BulkImportModal.tsx
│   └── UserDeactivationModal.tsx
├── usersSlice.ts  // ENHANCE EXISTING
├── userProfilesSlice.ts
├── userActivitySlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Enhance existing files and create new ones:
// src/api/services/userApi.ts  // ENHANCE EXISTING
// src/api/services/userProfileApi.ts  // TO BE CREATED
// src/api/services/userActivityApi.ts  // TO BE CREATED

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface UserResponse {
  status: string;
  message: string;
  data: User | User[] | null;
  timestamp: string | null;
}

const userApi = {
  getAll: async (params?: UserQueryParams): Promise<AxiosResponse<UserResponse>> => {
    return api.get('/users', { params });
  },
  bulkImport: async (userData: BulkUserData): Promise<AxiosResponse<UserResponse>> => {
    return api.post('/users/bulk-import', userData);
  },
  // ... other methods following existing pattern
};

export default userApi;
```

### 4. Component Patterns (EXISTING)
Follow existing component patterns from `src/components/common/`:
- Use existing `Button.tsx`, `Modal.tsx`, `Input.tsx`, `Select.tsx` components
- Follow existing styling with DaisyUI classes
- Use existing `Table.tsx` component for data display
- Follow existing form patterns with React Hook Form

### 5. Page Structure Pattern (EXISTING)
Follow the existing pattern from existing pages:
```typescript
const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, status, error, pagination } = useAppSelector(state => state.users);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(clearUsersError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleCreateUser = () => {
    dispatch(openModal({
      title: 'Create New User',
      bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their profiles</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Enhanced User Dashboard
Extend existing dashboard functionality for user management:

**Add to existing dashboard features:**
- User registration analytics using existing Chart.js setup
- Active user metrics and trends
- Role distribution visualizations
- User engagement monitoring
- System adoption rates

### 2. Comprehensive User Management Interface

**Enhanced Redux Slices:**
```typescript
// src/features/users/usersSlice.ts  // ENHANCE EXISTING
// Add new reducers and actions for advanced user management
export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    // ... existing state
    bulkOperations: [],
    userAnalytics: null,
    activeFilters: {},
    exportData: null,
  },
  reducers: {
    // ... existing reducers
    setBulkOperation: (state, action) => {
      state.bulkOperations = action.payload;
    },
    setUserAnalytics: (state, action) => {
      state.userAnalytics = action.payload;
    },
    // Follow existing reducer patterns
  },
  extraReducers: (builder) => {
    // ... existing async thunks
    // Add new async thunks for bulk operations, analytics, etc.
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/userProfileApi.ts
// src/api/services/userActivityApi.ts
// Follow existing userApi.ts pattern exactly
```

**Enhanced/New Pages to Create:**
- `UserListPage.tsx` - Enhanced with advanced filtering and bulk operations
- `UserProfilePage.tsx` - Comprehensive user profile management
- `UserAnalyticsPage.tsx` - User engagement and system analytics
- `BulkUserManagementPage.tsx` - Mass user operations and imports

### 3. Advanced User Profile Management
Create comprehensive user profile interface:
- Detailed profile editing with validation
- Profile picture upload and management
- Contact information management
- Security settings (password reset, 2FA status)
- Activity history and audit trail
- Role and permission assignments

### 4. Organizational User Hierarchy
Implement user management within organizational context:
- Regional user distribution
- School-level user management
- Department-based user grouping
- Hierarchical user reporting
- Cross-organizational user transfers

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canManageUsers = [
  'SUPER_ADMIN', 
  'MINISTRY_EXECUTIVE', 
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  USER_ADD_NEW: "USER_ADD_NEW",
  USER_EDIT: "USER_EDIT",
  USER_PROFILE_EDIT: "USER_PROFILE_EDIT",
  BULK_USER_IMPORT: "BULK_USER_IMPORT",
  USER_DEACTIVATE: "USER_DEACTIVATE",
  USER_ROLE_CHANGE: "USER_ROLE_CHANGE",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleUserUpdate = async (userData: UpdateUserData) => {
  try {
    await dispatch(updateUser(userData)).unwrap();
    // Success handling following existing pattern
  } catch (error) {
    console.error('Failed to update user:', error);
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
  data={users}
  columns={columns}
  pagination={pagination}
  onSort={handleSort}
  onFilter={handleFilter}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Enhanced User Table Component
```typescript
// src/features/users/components/UserTable.tsx
// Enhance existing or create with advanced features:
// - Advanced filtering and sorting
// - Bulk selection and operations
// - Export functionality
// - Inline editing capabilities
// Use existing Table component as base
```

### 2. User Profile Card Component
```typescript
// src/features/users/components/UserProfileCard.tsx
// Comprehensive user profile display
// Follow existing card component patterns
// Include role badges, status indicators, action buttons
```

### 3. User Statistics Widget
```typescript
// src/features/users/components/UserStatsWidget.tsx
// Dashboard widget for user metrics
// Use existing Chart.js integration
// Follow existing widget patterns
```

### 4. Organizational User Tree
```typescript
// src/features/users/components/OrganizationalUserTree.tsx
// Hierarchical user display by organization
// Interactive tree structure
// Follow existing component patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include enhanced user management routes:
```typescript
// Enhance existing user management navigation
{
  label: 'User Management',
  icon: Users,
  submenu: [
    { label: 'All Users', path: '/app/users' },
    { label: 'User Profiles', path: '/app/users/profiles' },
    { label: 'User Analytics', path: '/app/users/analytics' },
    { label: 'Bulk Operations', path: '/app/users/bulk' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/users" element={<UserListPage />} />
<Route path="/users/profile/:id" element={<UserProfilePage />} />
<Route path="/users/analytics" element={<UserAnalyticsPage />} />
<Route path="/users/bulk" element={<BulkUserManagementPage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchUsersWithAnalytics = createAsyncThunk(
  'users/fetchUsersWithAnalytics',
  async (params: UserQueryParams, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllWithAnalytics(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const bulkImportUsers = createAsyncThunk(
  'users/bulkImportUsers',
  async (userData: BulkUserData, { rejectWithValue }) => {
    try {
      const response = await userApi.bulkImport(userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to import users');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [dateRange, setDateRange] = useState({ start: '', end: '' });
const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
```

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Follow Existing Permission Checking
```typescript
// Use existing role checking patterns
const canAccessUserFeature = (requiredRoles: string[], targetUserRole?: string) => {
  const hasRole = requiredRoles.includes(user?.role);
  const canManageRole = checkRoleHierarchy(user?.role, targetUserRole);
  return hasRole && canManageRole;
};
```

### 3. Data Privacy Compliance
```typescript
// Implement data masking for sensitive information
const maskSensitiveData = (userData: User, viewerRole: string) => {
  // Follow existing patterns for data privacy
  const canViewFullProfile = ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE'].includes(viewerRole);
  return canViewFullProfile ? userData : maskUserData(userData);
};
```

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns
- Mock API calls using existing mock patterns

### 2. Integration with Existing Features
- Ensure compatibility with existing authentication
- Test integration with existing dashboard
- Verify compatibility with existing modal system
- Test organizational hierarchy integration

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns for large user lists
- Implement virtual scrolling for extensive user tables
- Use existing component memoization patterns
- Implement debounced search following existing patterns

### 2. Data Management
- Use existing caching patterns for user data
- Implement pagination following existing patterns
- Use existing error boundary patterns
- Optimize bulk operations with progress indicators

## Deliverables

1. **Enhanced Redux Slices**: Enhanced `usersSlice.ts`, new `userProfilesSlice.ts`, `userActivitySlice.ts`
2. **Enhanced API Services**: Enhanced `userApi.ts`, new `userProfileApi.ts`, `userActivityApi.ts`
3. **Enhanced/New Pages**: Enhanced user list, new profile management, analytics, bulk operations pages
4. **New Components**: User-specific reusable components and widgets
5. **Enhanced Navigation**: Extended sidebar and routes for user management
6. **New Modal Types**: User-specific modals for various operations
7. **Enhanced Dashboard**: User management widgets and analytics

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time updates using existing WebSocket infrastructure
- Responsive design consistent with existing pages
- Performance optimization for large user datasets
- Comprehensive user lifecycle management
- Secure handling of sensitive user data

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
11. **DO** implement proper data validation using existing Zod schemas
12. **DO** use existing loading states and error boundaries
13. **DO** follow existing accessibility patterns
14. **DO** implement proper data export/import functionality
15. **DO** ensure mobile responsiveness following existing patterns

This implementation should provide a comprehensive user management system that seamlessly integrates with the existing codebase while offering powerful administrative capabilities for managing users across all organizational levels and roles. 