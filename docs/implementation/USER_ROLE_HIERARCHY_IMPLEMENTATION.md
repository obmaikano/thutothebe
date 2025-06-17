# User Role Hierarchy Implementation

## Overview
This document outlines the implementation of a role-based user management system that enforces a specific hierarchy for user creation. The system ensures that users can only create accounts for roles that are below their level in the organizational hierarchy.

## Role Creation Hierarchy

### 1. Super Administrator (SUPER_ADMIN)
- Can create users with roles:
  - MINISTRY_EXECUTIVE
  - MINISTRY_STAFF
  - DATA_PROTECTION_OFFICER
  - DIRECTOR
  - REGIONAL_ADMIN
  - REGIONAL_OFFICER
  - SCHOOL_ADMIN
  - SCHOOL_HEAD
  - DEPARTMENT_HEAD
  - SENIOR_TEACHER
  - TEACHER
  - STUDENT
  - PARENT

### 2. Regional Administrator (REGIONAL_ADMIN)
- Can create users with roles:
  - REGIONAL_OFFICER
  - SCHOOL_ADMIN
  - SCHOOL_HEAD
  - DEPARTMENT_HEAD
  - SENIOR_TEACHER
  - TEACHER
  - STUDENT
  - PARENT

### 3. Regional Officer (REGIONAL_OFFICER)
- Can create users with roles:
  - SCHOOL_ADMIN
  - SCHOOL_HEAD
  - DEPARTMENT_HEAD
  - SENIOR_TEACHER
  - TEACHER
  - STUDENT
  - PARENT

### 4. School Head (SCHOOL_HEAD)
- Can create users with roles:
  - DEPARTMENT_HEAD
  - SENIOR_TEACHER
  - TEACHER
  - STUDENT
  - PARENT

### 5. School Administrator (SCHOOL_ADMIN)
- Can create users with roles:
  - DEPARTMENT_HEAD
  - SENIOR_TEACHER
  - TEACHER
  - STUDENT
  - PARENT

## Technical Implementation

### Backend Components

#### 1. User Entity Enhancement
```java
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    // ... existing fields ...
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    @Column(name = "creation_hierarchy_level")
    private Integer creationHierarchyLevel;
}
```

#### 2. Role-Based Access Control
```java
@Service
public class UserCreationPermissionService {
    private static final Map<UserRole, Set<UserRole>> ROLE_CREATION_MATRIX = Map.of(
        UserRole.SUPER_ADMIN, Set.of(
            UserRole.MINISTRY_EXECUTIVE,
            UserRole.MINISTRY_STAFF,
            UserRole.DATA_PROTECTION_OFFICER,
            UserRole.DIRECTOR,
            UserRole.REGIONAL_ADMIN,
            UserRole.REGIONAL_OFFICER,
            UserRole.SCHOOL_ADMIN,
            UserRole.SCHOOL_HEAD,
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        ),
        UserRole.REGIONAL_ADMIN, Set.of(
            UserRole.REGIONAL_OFFICER,
            UserRole.SCHOOL_ADMIN,
            UserRole.SCHOOL_HEAD,
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        ),
        UserRole.REGIONAL_OFFICER, Set.of(
            UserRole.SCHOOL_ADMIN,
            UserRole.SCHOOL_HEAD,
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        ),
        UserRole.SCHOOL_HEAD, Set.of(
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        ),
        UserRole.SCHOOL_ADMIN, Set.of(
            UserRole.DEPARTMENT_HEAD,
            UserRole.SENIOR_TEACHER,
            UserRole.TEACHER,
            UserRole.STUDENT,
            UserRole.PARENT
        )
    );
    
    public boolean canCreateRole(UserRole creatorRole, UserRole targetRole) {
        return ROLE_CREATION_MATRIX.getOrDefault(creatorRole, Set.of())
            .contains(targetRole);
    }
}
```

### Frontend Components

#### 1. User Creation Form
```typescript
interface UserCreationFormProps {
  currentUserRole: UserRole;
  onSubmit: (userData: CreateUserRequest) => Promise<void>;
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ currentUserRole, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    // ... other fields
  });

  const availableRoles = useMemo(() => {
    switch (currentUserRole) {
      case UserRole.REGIONAL_ADMIN:
        return [
          UserRole.REGIONAL_OFFICER,
          UserRole.SCHOOL_ADMIN,
          UserRole.SCHOOL_HEAD,
          UserRole.DEPARTMENT_HEAD,
          UserRole.SENIOR_TEACHER,
          UserRole.TEACHER,
          UserRole.STUDENT,
          UserRole.PARENT
        ];
      case UserRole.REGIONAL_OFFICER:
        return [
          UserRole.SCHOOL_ADMIN,
          UserRole.SCHOOL_HEAD,
          UserRole.DEPARTMENT_HEAD,
          UserRole.SENIOR_TEACHER,
          UserRole.TEACHER,
          UserRole.STUDENT,
          UserRole.PARENT
        ];
      case UserRole.SCHOOL_HEAD:
      case UserRole.SCHOOL_ADMIN:
        return [
          UserRole.DEPARTMENT_HEAD,
          UserRole.SENIOR_TEACHER,
          UserRole.TEACHER,
          UserRole.STUDENT,
          UserRole.PARENT
        ];
      default:
        return [];
    }
  }, [currentUserRole]);

  // ... form implementation
};
```

#### 2. User Management Page
```typescript
const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  
  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={() => dispatch(openModal({ type: 'CREATE_USER' }))}
          className="btn btn-primary"
        >
          Create User
        </button>
      </div>
      
      <UserTable />
    </div>
  );
};
```

### API Endpoints

#### User Creation Endpoint
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @PostMapping
    public ResponseEntity<OhmaApiResponse<UserDTO>> createUser(
        @RequestBody CreateUserRequest request,
        @AuthenticationPrincipal User currentUser
    ) {
        // Validate role creation permissions
        if (!userCreationPermissionService.canCreateRole(
            currentUser.getRole(), 
            request.getRole()
        )) {
            throw new AccessDeniedException("Insufficient permissions to create this role");
        }
        
        // Create user with creator information
        UserDTO createdUser = userService.createUser(request, currentUser);
        return ResponseEntity.ok(new OhmaApiResponse<>("success", "User created successfully", createdUser));
    }
}
```

## Validation Rules

### 1. Role Creation Validation
- REGIONAL_ADMIN can only create REGIONAL_OFFICER, SCHOOL_ADMIN, SCHOOL_HEAD, DEPARTMENT_HEAD, SENIOR_TEACHER, TEACHER, STUDENT, and PARENT roles
- REGIONAL_OFFICER can only create SCHOOL_ADMIN, SCHOOL_HEAD, DEPARTMENT_HEAD, SENIOR_TEACHER, TEACHER, STUDENT, and PARENT roles
- SCHOOL_HEAD can only create DEPARTMENT_HEAD, SENIOR_TEACHER, TEACHER, STUDENT, and PARENT roles
- SCHOOL_ADMIN can only create DEPARTMENT_HEAD, SENIOR_TEACHER, TEACHER, STUDENT, and PARENT roles

### 2. Scope Validation
- Users can only create users within their organizational scope
- REGIONAL_ADMIN can create users for their region
- REGIONAL_OFFICER can create users for schools in their region
- SCHOOL_HEAD and SCHOOL_ADMIN can create users for their school

### 3. Data Validation
- Email must be unique
- Required fields: firstName, lastName, email, password, role
- Password must meet security requirements
- Role must be valid and within creation permissions

## Error Handling

```java
@RestControllerAdvice
public class UserManagementExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<OhmaApiResponse<?>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new OhmaApiResponse<>("error", ex.getMessage(), null));
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<OhmaApiResponse<?>> handleValidationError(IllegalArgumentException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new OhmaApiResponse<>("error", ex.getMessage(), null));
    }
}
```

## Security Considerations

1. Role-based access control for all endpoints
2. Input validation and sanitization
3. Audit logging for user creation
4. Password encryption
5. Session management
6. Rate limiting for user creation endpoints

## Testing Requirements

### 1. Unit Tests
- Role creation permission validation
- User creation service logic
- Form validation
- API endpoint security

### 2. Integration Tests
- End-to-end user creation flow
- Role-based access control
- Error handling
- Audit logging

### 3. UI Tests
- Form validation
- Role selection based on current user
- Success/error message display
- Navigation flow

## Implementation Notes

1. All user creation must be logged with the creator's information
2. Role hierarchy must be strictly enforced at both frontend and backend
3. Proper error messages must be shown to users when they attempt unauthorized actions
4. All user creation must be audited and logged
5. Password policies must be enforced
6. Email verification must be implemented for new users
7. Proper notification system must be in place for new user creation

## Success Criteria

1. Users can only create accounts for roles below their level
2. All validation rules are properly enforced
3. Error handling is comprehensive and user-friendly
4. Audit logging is complete and accurate
5. Security measures are properly implemented
6. UI is intuitive and responsive
7. All tests pass successfully 