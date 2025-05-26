# Permissions System Quick Reference Guide

## Quick Start

### 1. Check User Permission (Most Common Use Case)
```java
@Autowired
private RolePermissionService rolePermissionService;

// Basic permission check
UserPermissionCheckDTO request = new UserPermissionCheckDTO(
    userId, userRole, "RESOURCE_NAME", PermissionAction.ACTION, 
    scopeType, scopeId, false, null, null
);

UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(request);
if (result.hasPermission()) {
    // User has permission - proceed with operation
    performOperation();
} else {
    // Permission denied - handle accordingly
    throw new AccessDeniedException(result.reason());
}
```

### 2. Initialize System Permissions (Run Once)
```java
@Autowired
private PermissionService permissionService;
@Autowired
private RolePermissionService rolePermissionService;

// Initialize default permissions
permissionService.initializeDefaultPermissions();

// Initialize default role-permission mappings
rolePermissionService.initializeDefaultRolePermissions();
```

## Common Usage Patterns

### 1. Controller-Level Permission Checking
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO userDTO) {
        // Additional runtime permission check if needed
        UserPermissionCheckDTO permCheck = new UserPermissionCheckDTO(
            getCurrentUserId(), getCurrentUserRole(), "USER", 
            PermissionAction.CREATE, PermissionScope.SCHOOL, getSchoolId(),
            false, null, null
        );
        
        if (!rolePermissionService.checkUserPermission(permCheck).hasPermission()) {
            throw new AccessDeniedException("Insufficient permissions");
        }
        
        return ResponseEntity.ok(userService.createUser(userDTO));
    }
}
```

### 2. Service-Level Permission Checking
```java
@Service
public class GradeService {
    
    @Autowired
    private RolePermissionService rolePermissionService;
    
    public void createGrade(Long teacherId, UserRole teacherRole, Long classId, GradeDTO gradeDTO) {
        // Check if teacher can create grades for this class
        UserPermissionCheckDTO permCheck = new UserPermissionCheckDTO(
            teacherId, teacherRole, "GRADE", PermissionAction.CREATE,
            PermissionScope.CLASS, classId, false, null, null
        );
        
        UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(permCheck);
        if (!result.hasPermission()) {
            throw new AccessDeniedException("Cannot create grades for this class: " + result.reason());
        }
        
        // Proceed with grade creation
        gradeRepository.save(mapToEntity(gradeDTO));
    }
}
```

### 3. Dynamic Permission Assignment
```java
@Service
public class RoleManagementService {
    
    @Autowired
    private RolePermissionService rolePermissionService;
    
    public void assignTeacherToClass(Long teacherId, Long classId) {
        // Assign grade management permission for specific class
        rolePermissionService.assignPermissionToRole(
            UserRole.TEACHER,
            getPermissionId("GRADE", PermissionAction.CREATE),
            PermissionScope.CLASS,
            classId
        );
        
        // Assign assignment management permission
        rolePermissionService.assignPermissionToRole(
            UserRole.TEACHER,
            getPermissionId("ASSIGNMENT", PermissionAction.CREATE),
            PermissionScope.CLASS,
            classId
        );
    }
}
```

## Resource-Action Combinations

### Common Resources and Actions
```java
// User Management
"USER" + CREATE/READ/UPDATE/DELETE

// Academic Content
"COURSE" + CREATE/READ/UPDATE/DELETE
"ASSIGNMENT" + CREATE/READ/UPDATE/DELETE
"GRADE" + CREATE/READ/UPDATE/DELETE

// Communication
"ANNOUNCEMENT" + CREATE/READ/UPDATE/DELETE
"MESSAGE" + CREATE/READ/UPDATE/DELETE

// Scheduling
"SCHEDULE" + CREATE/READ/UPDATE/DELETE

// Administrative
"SCHOOL" + CREATE/READ/UPDATE/DELETE
"REGION" + CREATE/READ/UPDATE/DELETE
```

### Permission Scope Examples
```java
// Global access (SUPER_ADMIN only)
PermissionScope.GLOBAL, null

// Regional access
PermissionScope.REGIONAL, regionId

// School-specific access
PermissionScope.SCHOOL, schoolId

// Class-specific access
PermissionScope.CLASS, classId

// Self-access only
PermissionScope.SELF, userId

// Parent accessing child data
PermissionScope.CHILDREN, childId
```

## Role Hierarchy Quick Reference

```
SUPER_ADMIN          → All permissions globally
MINISTRY_EXECUTIVE   → National-level management
MINISTRY_STAFF       → National-level operations
DIRECTOR            → Regional oversight
REGIONAL_ADMIN      → Regional administration
REGIONAL_OFFICER    → Regional support
SCHOOL_ADMIN        → School administration
SCHOOL_HEAD         → School leadership
DEPARTMENT_HEAD     → Department management
SENIOR_TEACHER      → Advanced teaching + class management
TEACHER             → Basic teaching + class management
STUDENT             → Learning + self-management
PARENT              → Child monitoring
```

## Common Code Snippets

### 1. Get User's Accessible Resources
```java
public List<String> getUserAccessibleResources(UserRole userRole) {
    return rolePermissionService.findResourcesByRole(userRole);
}
```

### 2. Check Multiple Permissions
```java
public boolean hasAnyPermission(UserRole role, String resource, List<PermissionAction> actions) {
    return actions.stream()
        .anyMatch(action -> rolePermissionService.hasPermission(role, resource, action));
}
```

### 3. Scope-Aware Permission Check
```java
public boolean canAccessResource(Long userId, UserRole role, String resource, 
                               PermissionAction action, Long resourceId) {
    // Try global permission first
    if (rolePermissionService.hasPermission(role, resource, action)) {
        return true;
    }
    
    // Try scoped permissions
    PermissionScope[] scopes = {PermissionScope.SCHOOL, PermissionScope.CLASS, PermissionScope.SELF};
    for (PermissionScope scope : scopes) {
        if (rolePermissionService.hasPermissionWithScope(role, resource, action, scope, resourceId)) {
            return true;
        }
    }
    
    return false;
}
```

### 4. Bulk Permission Check
```java
public Map<String, Boolean> checkMultiplePermissions(UserRole role, Map<String, PermissionAction> resourceActions) {
    Map<String, Boolean> results = new HashMap<>();
    
    resourceActions.forEach((resource, action) -> {
        boolean hasPermission = rolePermissionService.hasPermission(role, resource, action);
        results.put(resource + "_" + action, hasPermission);
    });
    
    return results;
}
```

## Testing Helpers

### 1. Mock Permission Service for Tests
```java
@MockBean
private RolePermissionService rolePermissionService;

@Test
void testUserCreation_WithPermission() {
    // Mock permission check to return true
    UserPermissionCheckDTO mockResult = new UserPermissionCheckDTO(
        1L, UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE,
        PermissionScope.SCHOOL, 1L, true, "Permission granted", "SCHOOL:1"
    );
    
    when(rolePermissionService.checkUserPermission(any())).thenReturn(mockResult);
    
    // Test your service method
    UserDTO result = userService.createUser(userDTO);
    assertNotNull(result);
}
```

### 2. Test Permission Scenarios
```java
@ParameterizedTest
@EnumSource(UserRole.class)
void testPermissionsByRole(UserRole role) {
    UserPermissionCheckDTO request = new UserPermissionCheckDTO(
        1L, role, "USER", PermissionAction.READ, null, null, false, null, null
    );
    
    UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(request);
    
    // Assert based on role hierarchy
    if (isAdminRole(role)) {
        assertTrue(result.hasPermission());
    } else {
        // Check specific conditions for non-admin roles
    }
}
```

## Troubleshooting

### 1. Permission Denied Issues
```java
// Debug permission check
UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(request);
log.debug("Permission check - User: {}, Role: {}, Resource: {}, Action: {}, HasPermission: {}, Reason: {}",
    request.userId(), request.userRole(), request.resource(), request.action(),
    result.hasPermission(), result.reason());
```

### 2. Check Role Assignments
```java
// Verify user's role permissions
List<RolePermissionDTO> rolePermissions = rolePermissionService.findActiveByRole(userRole);
log.debug("User role {} has {} active permissions", userRole, rolePermissions.size());
```

### 3. Validate Permission Existence
```java
// Check if permission exists
PermissionDTO permission = permissionService.findByResourceAndAction(resource, action);
if (permission == null) {
    log.error("Permission not found for resource: {} and action: {}", resource, action);
}
```

## Performance Tips

### 1. Cache Permission Results
```java
@Cacheable(value = "permissions", key = "#role + '_' + #resource + '_' + #action")
public boolean hasPermissionCached(UserRole role, String resource, PermissionAction action) {
    return rolePermissionService.hasPermission(role, resource, action);
}
```

### 2. Batch Permission Checks
```java
// Instead of multiple individual checks, use batch operations
List<RolePermissionDTO> userPermissions = rolePermissionService.findActiveByRole(userRole);
Set<String> allowedActions = userPermissions.stream()
    .filter(p -> p.resource().equals(targetResource))
    .map(p -> p.action())
    .collect(Collectors.toSet());
```

## Security Best Practices

### 1. Always Check Permissions at Service Layer
```java
@Service
public class SecureService {
    
    public void sensitiveOperation(Long userId, UserRole userRole) {
        // ALWAYS check permissions before proceeding
        if (!hasRequiredPermission(userId, userRole)) {
            throw new AccessDeniedException("Insufficient permissions");
        }
        
        // Proceed with operation
        performSensitiveOperation();
    }
}
```

### 2. Use Method-Level Security
```java
@PreAuthorize("@permissionEvaluator.hasPermission(authentication, #resourceId, 'RESOURCE', 'ACTION')")
public void secureMethod(Long resourceId) {
    // Method implementation
}
```

### 3. Validate Scope Boundaries
```java
public boolean validateScopeAccess(UserRole role, PermissionScope scope, Long scopeId, Long userId) {
    // Ensure user can only access resources within their scope
    switch (scope) {
        case SCHOOL:
            return userBelongsToSchool(userId, scopeId);
        case CLASS:
            return userBelongsToClass(userId, scopeId);
        case SELF:
            return userId.equals(scopeId);
        default:
            return false;
    }
}
```

## Error Handling

### 1. Custom Permission Exceptions
```java
public class InsufficientPermissionException extends RuntimeException {
    private final UserRole userRole;
    private final String resource;
    private final PermissionAction action;
    
    public InsufficientPermissionException(UserRole userRole, String resource, PermissionAction action) {
        super(String.format("User with role %s lacks permission %s on resource %s", 
              userRole, action, resource));
        this.userRole = userRole;
        this.resource = resource;
        this.action = action;
    }
}
```

### 2. Global Exception Handler
```java
@RestControllerAdvice
public class PermissionExceptionHandler {
    
    @ExceptionHandler(InsufficientPermissionException.class)
    public ResponseEntity<ErrorResponse> handlePermissionException(InsufficientPermissionException ex) {
        ErrorResponse error = new ErrorResponse(
            "PERMISSION_DENIED",
            ex.getMessage(),
            HttpStatus.FORBIDDEN.value()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
}
```

This quick reference guide provides the most commonly needed code patterns and troubleshooting approaches for working with the permissions system. 