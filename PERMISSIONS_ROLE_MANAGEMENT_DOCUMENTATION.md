# Permissions and Role Management System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Implementation Details](#implementation-details)
4. [API Usage](#api-usage)
5. [Testing](#testing)
6. [Security Considerations](#security-considerations)
7. [Examples](#examples)

## System Overview

The Permissions and Role Management System provides a comprehensive, hierarchical role-based access control (RBAC) solution for the educational LMS platform. It supports fine-grained permissions with scope-based restrictions and role hierarchy inheritance.

### Key Features
- **Hierarchical User Roles**: 13 predefined roles from SUPER_ADMIN to PARENT
- **Scoped Permissions**: Global, Regional, School, Department, Class, and User-level access
- **Fine-grained Actions**: CREATE, READ, UPDATE, DELETE, EXECUTE, APPROVE, etc.
- **Role Inheritance**: Higher-level roles inherit permissions from lower levels
- **Dynamic Permission Checking**: Runtime permission validation with multiple fallback mechanisms

### User Role Hierarchy
```
SUPER_ADMIN (Highest Authority)
├── MINISTRY_EXECUTIVE
├── MINISTRY_STAFF
├── DIRECTOR
├── REGIONAL_ADMIN
├── REGIONAL_OFFICER
├── SCHOOL_ADMIN
├── SCHOOL_HEAD
├── DEPARTMENT_HEAD
├── SENIOR_TEACHER
├── TEACHER
├── STUDENT
└── PARENT (Lowest Authority)
```

## Architecture

### Entity Relationship Diagram
```
User ──────────── UserRole (enum)
                      │
                      │
Permission ────────── RolePermission ────────── PermissionScope (enum)
    │                     │                           │
    │                     │                           │
PermissionAction      scopeId ──────────────────── Region/School/Class
   (enum)
```

### Core Components

#### 1. Entities
- **Permission**: Defines individual permissions (resource + action)
- **RolePermission**: Maps roles to permissions with optional scope
- **PermissionAction**: Enum defining available actions
- **PermissionScope**: Enum defining permission scopes
- **UserRole**: Enum defining user roles

#### 2. DTOs
- **PermissionDTO**: Permission data transfer
- **RolePermissionDTO**: Role-permission mapping transfer
- **UserPermissionCheckDTO**: Permission validation requests/responses

#### 3. Services
- **PermissionService**: Permission CRUD operations
- **RolePermissionService**: Role-permission management and checking

#### 4. Controllers
- **PermissionController**: Permission management endpoints
- **RolePermissionController**: Role-permission management endpoints

## Implementation Details

### 1. Permission Entity

```java
@Entity
@Table(name = "permissions")
public class Permission extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;                    // e.g., "USER_CREATE"
    
    @Column(nullable = false)
    private String resource;                // e.g., "USER"
    
    @Enumerated(EnumType.STRING)
    private PermissionAction action;        // e.g., CREATE
    
    private String description;             // Human-readable description
    private boolean active = true;          // Enable/disable permission
}
```

### 2. RolePermission Entity

```java
@Entity
@Table(name = "role_permissions")
public class RolePermission extends BaseEntity {
    @Enumerated(EnumType.STRING)
    private UserRole role;                  // e.g., SCHOOL_ADMIN
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Permission permission;          // Associated permission
    
    @Enumerated(EnumType.STRING)
    private PermissionScope scopeType;      // e.g., SCHOOL
    
    private Long scopeId;                   // e.g., school ID
    private boolean active = true;
}
```

### 3. Permission Actions

```java
public enum PermissionAction {
    CREATE,     // Create new resources
    READ,       // View/read resources
    UPDATE,     // Modify existing resources
    DELETE,     // Remove resources
    EXECUTE,    // Execute operations
    APPROVE,    // Approve requests/submissions
    REJECT,     // Reject requests/submissions
    ASSIGN,     // Assign resources/roles
    UNASSIGN,   // Remove assignments
    PUBLISH,    // Publish content
    UNPUBLISH,  // Unpublish content
    ARCHIVE,    // Archive resources
    RESTORE     // Restore archived resources
}
```

### 4. Permission Scopes

```java
public enum PermissionScope {
    GLOBAL,     // System-wide access
    NATIONAL,   // Country-level access
    REGIONAL,   // Regional-level access
    SCHOOL,     // School-level access
    DEPARTMENT, // Department-level access
    CLASS,      // Class-level access
    COURSE,     // Course-level access
    USER,       // User-level access
    SELF,       // Self-only access
    CHILDREN    // Children-only access (for parents)
}
```

### 5. Service Implementation

#### PermissionServiceImpl
```java
@Service
@Transactional
public class PermissionServiceImpl extends BaseServiceImpl<Permission, PermissionDTO, Long> 
    implements PermissionService {
    
    // CRUD operations
    public PermissionDTO create(PermissionDTO dto) { ... }
    public PermissionDTO update(Long id, PermissionDTO dto) { ... }
    public void delete(Long id) { ... }
    
    // Query operations
    public PermissionDTO findByName(String name) { ... }
    public List<PermissionDTO> findByResource(String resource) { ... }
    public List<PermissionDTO> findActivePermissions() { ... }
    
    // Initialization
    public void initializeDefaultPermissions() { ... }
}
```

#### RolePermissionServiceImpl
```java
@Service
@Transactional
public class RolePermissionServiceImpl extends BaseServiceImpl<RolePermission, RolePermissionDTO, Long> 
    implements RolePermissionService {
    
    // Permission checking
    public boolean hasPermission(UserRole role, String resource, PermissionAction action) { ... }
    public UserPermissionCheckDTO checkUserPermission(UserPermissionCheckDTO request) { ... }
    
    // Role management
    public RolePermissionDTO assignPermissionToRole(UserRole role, Long permissionId, 
                                                   PermissionScope scope, Long scopeId) { ... }
    public void removePermissionFromRole(UserRole role, Long permissionId, 
                                       PermissionScope scope, Long scopeId) { ... }
}
```

### 6. Permission Checking Logic

The system uses a three-tier permission checking mechanism:

1. **Direct Permission Check**: Check if role has explicit permission
2. **Scoped Permission Check**: Check if role has permission within specific scope
3. **Role Hierarchy Check**: Check if role inherits permission through hierarchy

```java
public UserPermissionCheckDTO checkUserPermission(UserPermissionCheckDTO checkRequest) {
    // 1. Check direct global permission
    if (hasPermission(userRole, resource, action)) {
        return granted("Global permission granted");
    }
    
    // 2. Check scoped permission
    if (scopeType != null && hasPermissionWithScope(userRole, resource, action, scopeType, scopeId)) {
        return granted("Scoped permission granted");
    }
    
    // 3. Check role hierarchy
    if (checkRoleHierarchyPermission(userRole, resource, action, scopeType, scopeId)) {
        return granted("Permission granted through role hierarchy");
    }
    
    return denied("Permission denied");
}
```

## API Usage

### 1. Permission Management

#### Create Permission
```http
POST /permissions
Content-Type: application/json

{
    "name": "COURSE_CREATE",
    "resource": "COURSE",
    "action": "CREATE",
    "description": "Create new courses",
    "active": true
}
```

#### Get Permissions by Resource
```http
GET /permissions?resource=USER
```

#### Initialize Default Permissions
```http
POST /permissions/initialize
```

### 2. Role Permission Management

#### Assign Permission to Role
```http
POST /role-permissions/assign?role=SCHOOL_ADMIN&permissionId=1&scopeType=SCHOOL&scopeId=123
```

#### Check User Permission
```http
POST /role-permissions/check
Content-Type: application/json

{
    "userId": 1,
    "userRole": "TEACHER",
    "resource": "ASSIGNMENT",
    "action": "CREATE",
    "scopeType": "CLASS",
    "scopeId": 456
}
```

#### Get Role Permissions
```http
GET /role-permissions/role/SCHOOL_ADMIN/active
```

### 3. Security Annotations

Controllers use Spring Security annotations for access control:

```java
@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
public ResponseEntity<OhmaApiResponse<PermissionDTO>> create(@Valid @RequestBody PermissionDTO dto) {
    // Implementation
}
```

## Testing

### 1. Unit Tests

#### PermissionServiceImplTest
- Tests all CRUD operations
- Tests query methods (findByName, findByResource, etc.)
- Tests permission initialization
- Tests error handling and edge cases

#### RolePermissionServiceImplTest
- Tests role-based queries
- Tests permission checking logic
- Tests permission assignment/removal
- Tests role hierarchy validation

### 2. Test Coverage

```bash
# Run tests
mvn test

# Generate coverage report
mvn jacoco:report
```

### 3. Example Test Cases

```java
@Test
void checkUserPermission_ShouldReturnPermissionGranted_WhenRoleHierarchyAllows() {
    // Arrange
    UserPermissionCheckDTO checkRequest = new UserPermissionCheckDTO(
        1L, UserRole.SUPER_ADMIN, "USER", PermissionAction.CREATE, null, null, false, null, null
    );

    // Act
    UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(checkRequest);

    // Assert
    assertTrue(result.hasPermission());
    assertEquals("Permission granted through role hierarchy", result.reason());
}
```

## Security Considerations

### 1. Access Control
- All sensitive endpoints require authentication
- Role-based authorization using Spring Security
- Scope-based permission validation

### 2. Data Validation
- Input validation using Bean Validation annotations
- DTO validation in compact constructors
- Repository-level constraints

### 3. Audit Trail
- All entities extend BaseEntity with audit fields
- Soft delete capabilities for permissions
- Version control for concurrent updates

### 4. Performance
- Lazy loading for entity relationships
- Indexed database columns for frequent queries
- Caching for permission checks (recommended)

## Examples

### 1. School Administrator Use Case

```java
// School admin creating a new teacher
UserPermissionCheckDTO request = new UserPermissionCheckDTO(
    adminUserId,
    UserRole.SCHOOL_ADMIN,
    "USER",
    PermissionAction.CREATE,
    PermissionScope.SCHOOL,
    schoolId,
    false, null, null
);

UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(request);
if (result.hasPermission()) {
    // Proceed with teacher creation
    teacherService.createTeacher(teacherData);
}
```

### 2. Teacher Grading Assignment

```java
// Teacher grading student assignment
UserPermissionCheckDTO request = new UserPermissionCheckDTO(
    teacherId,
    UserRole.TEACHER,
    "GRADE",
    PermissionAction.CREATE,
    PermissionScope.CLASS,
    classId,
    false, null, null
);

if (rolePermissionService.checkUserPermission(request).hasPermission()) {
    gradeService.createGrade(assignmentId, studentId, grade);
}
```

### 3. Student Viewing Grades

```java
// Student viewing their own grades
UserPermissionCheckDTO request = new UserPermissionCheckDTO(
    studentId,
    UserRole.STUDENT,
    "GRADE",
    PermissionAction.READ,
    PermissionScope.SELF,
    studentId,
    false, null, null
);

if (rolePermissionService.checkUserPermission(request).hasPermission()) {
    List<Grade> grades = gradeService.getStudentGrades(studentId);
}
```

### 4. Parent Viewing Child's Progress

```java
// Parent viewing child's grades
UserPermissionCheckDTO request = new UserPermissionCheckDTO(
    parentId,
    UserRole.PARENT,
    "GRADE",
    PermissionAction.READ,
    PermissionScope.CHILDREN,
    childId,
    false, null, null
);

if (rolePermissionService.checkUserPermission(request).hasPermission()) {
    List<Grade> childGrades = gradeService.getStudentGrades(childId);
}
```

### 5. Dynamic Permission Assignment

```java
// Assign course management permission to department head
RolePermissionDTO assignment = rolePermissionService.assignPermissionToRole(
    UserRole.DEPARTMENT_HEAD,
    courseManagementPermissionId,
    PermissionScope.DEPARTMENT,
    departmentId
);
```

### 6. Bulk Permission Initialization

```java
// Initialize all default permissions
permissionService.initializeDefaultPermissions();

// Initialize default role-permission mappings
rolePermissionService.initializeDefaultRolePermissions();
```

## Best Practices

### 1. Permission Design
- Use descriptive permission names (e.g., "USER_CREATE" not "UC")
- Group related permissions by resource
- Define clear scope boundaries

### 2. Role Hierarchy
- Follow principle of least privilege
- Regularly audit role permissions
- Document permission inheritance rules

### 3. Performance Optimization
- Cache frequently checked permissions
- Use database indexes on query columns
- Implement permission checking at service layer

### 4. Maintenance
- Regular permission audits
- Automated testing for permission changes
- Documentation updates for new permissions

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check role hierarchy
   - Verify scope assignments
   - Confirm permission is active

2. **Performance Issues**
   - Implement caching
   - Optimize database queries
   - Review permission checking frequency

3. **Data Inconsistency**
   - Run permission initialization
   - Check for orphaned role permissions
   - Verify entity relationships

### Debugging

```java
// Enable debug logging
logging.level.com.ohma.thutothebe.service.impl.RolePermissionServiceImpl=DEBUG

// Check permission details
UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(request);
log.debug("Permission check result: {}", result);
```

This comprehensive documentation provides both implementation details and practical usage examples for the permissions and role management system, enabling developers to understand, maintain, and extend the system effectively. 