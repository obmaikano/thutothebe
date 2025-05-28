# Department Management Module

## Overview

The Department Management Module is a comprehensive backend implementation for managing academic departments within a school management system. It provides full CRUD operations, role-based access control, and sophisticated relationship management between departments, users, and subjects.

## Features

### Core Functionality
- **CRUD Operations**: Create, Read, Update, Delete departments
- **Department Status Management**: Activate/deactivate departments
- **User Assignment**: Assign department heads and teachers
- **Subject Management**: Link subjects to departments
- **Role-Based Access Control**: Granular permissions for different user roles

### Business Logic
- **Department Head Management**: Each department can have one department head
- **Teacher Assignment**: Multiple teachers can be assigned to a department
- **Subject Linking**: Subjects belong to only one department
- **Automatic Role Promotion**: Teachers are automatically promoted to DEPARTMENT_HEAD when assigned as head
- **Validation**: Comprehensive validation for all operations

## Architecture

The module follows the established architectural patterns:

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Entity Layer (Database Mapping)
```

### Key Components

1. **Department Entity** - Core domain model
2. **DepartmentDTO** - Data transfer object with validation
3. **DepartmentRepository** - Data access layer
4. **DepartmentService/ServiceImpl** - Business logic layer
5. **DepartmentController** - REST API layer
6. **DepartmentMapper** - Entity-DTO conversion

## Database Schema

### Department Entity
```sql
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    school_id BIGINT NOT NULL,
    department_head_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (department_head_id) REFERENCES users(id),
    UNIQUE KEY unique_dept_name_school (name, school_id)
);
```

### Relationships
- **Department ↔ School**: Many-to-One
- **Department ↔ User (Head)**: Many-to-One
- **Department ↔ User (Teachers)**: Many-to-Many
- **Department ↔ Subject**: One-to-Many

## API Endpoints

### Department CRUD Operations

#### Create Department
```http
POST /api/departments
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
Content-Type: application/json

{
    "name": "Mathematics Department",
    "description": "Department of Mathematics and Statistics",
    "schoolId": 1
}
```

#### Update Department
```http
PUT /api/departments/{id}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD
Content-Type: application/json

{
    "name": "Updated Department Name",
    "description": "Updated description"
}
```

#### Get Departments by School
```http
GET /api/departments/school/{schoolId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD, TEACHER
```

#### Get Active Departments
```http
GET /api/departments/school/{schoolId}/active
Authorization: All authenticated users
```

### Department Management

#### Assign Department Head
```http
POST /api/departments/{departmentId}/head/{userId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
```

#### Remove Department Head
```http
DELETE /api/departments/{departmentId}/head
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
```

#### Assign Teacher to Department
```http
POST /api/departments/{departmentId}/teachers/{teacherId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD
```

#### Remove Teacher from Department
```http
DELETE /api/departments/{departmentId}/teachers/{teacherId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD
```

### Subject Management

#### Assign Subject to Department
```http
POST /api/departments/{departmentId}/subjects/{subjectId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD
```

#### Remove Subject from Department
```http
DELETE /api/departments/{departmentId}/subjects/{subjectId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD
```

### Department Status

#### Activate Department
```http
PUT /api/departments/{departmentId}/activate
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
```

#### Deactivate Department
```http
PUT /api/departments/{departmentId}/deactivate
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
```

### Query Operations

#### Search Department
```http
GET /api/departments/search?name={name}&schoolId={schoolId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN, DEPARTMENT_HEAD, TEACHER
```

#### Check Department Existence
```http
GET /api/departments/exists?name={name}&schoolId={schoolId}
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
```

#### Count Active Departments
```http
GET /api/departments/school/{schoolId}/count
Authorization: SUPER_ADMIN, SCHOOL_ADMIN
```

## Role-Based Access Control

### Permission Matrix

| Operation | SUPER_ADMIN | SCHOOL_ADMIN | DEPARTMENT_HEAD | TEACHER | STUDENT |
|-----------|-------------|--------------|-----------------|---------|---------|
| Create Department | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Department | ✅ | ✅ | ✅* | ❌ | ❌ |
| View Departments | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Active Departments | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assign Department Head | ✅ | ✅ | ❌ | ❌ | ❌ |
| Assign Teachers | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign Subjects | ✅ | ✅ | ✅ | ❌ | ❌ |
| Activate/Deactivate | ✅ | ✅ | ❌ | ❌ | ❌ |

*Department heads can only update their own department

## Business Rules

### Department Head Assignment
1. A user must have TEACHER or DEPARTMENT_HEAD role to be assigned as department head
2. If a TEACHER is assigned as department head, their role is automatically promoted to DEPARTMENT_HEAD
3. Only one department head per department is allowed
4. Department heads are automatically added to the department's teacher list

### Teacher Assignment
1. Users must have TEACHER role to be assigned to departments
2. Teachers can be assigned to multiple departments
3. Department heads are automatically included in the teacher list

### Subject Assignment
1. Subjects can only belong to one department at a time
2. Assigning a subject to a new department automatically removes it from the previous department
3. Only active subjects can be assigned to departments

### Department Status
1. Departments can be activated or deactivated
2. Inactive departments are hidden from most queries
3. Department operations are still allowed on inactive departments for administrative purposes

## Validation Rules

### Department Creation/Update
- **Name**: Required, 1-100 characters, unique within school
- **Description**: Optional, max 500 characters
- **School ID**: Required, must reference existing school

### User Assignment
- **Department Head**: Must have TEACHER or DEPARTMENT_HEAD role
- **Teachers**: Must have TEACHER role
- **Users must belong to the same school as the department**

### Subject Assignment
- **Subject must exist and be active**
- **Subject must belong to the same school as the department**

## Error Handling

The module implements comprehensive error handling:

### Common Error Responses
```json
{
    "status": "ERROR",
    "message": "Department not found with id: 123",
    "data": null,
    "errors": null
}
```

### Validation Errors
```json
{
    "status": "ERROR",
    "message": "Validation failed",
    "data": null,
    "errors": [
        "Department name is required",
        "School ID must be provided"
    ]
}
```

## Testing

The module includes comprehensive test coverage:

### Unit Tests
- **DepartmentServiceImplTest**: 32 test cases covering all service methods
- **DepartmentControllerTest**: 15 test cases covering all controller endpoints

### Test Coverage
- Service layer: 100% method coverage
- Controller layer: 100% method coverage
- Business logic validation: Comprehensive edge case testing
- Error handling: All error scenarios tested

### Running Tests
```bash
# Run all department tests
mvn test -Dtest="*Department*"

# Run service tests only
mvn test -Dtest=DepartmentServiceImplTest

# Run controller tests only
mvn test -Dtest=DepartmentControllerTest
```

## Usage Examples

### Creating a Department
```java
DepartmentDTO departmentDTO = new DepartmentDTO(
    null, // id will be generated
    "Computer Science Department",
    "Department of Computer Science and Information Technology",
    1L, // schoolId
    "School Name",
    null, // no department head initially
    null,
    Set.of(), // no subjects initially
    Set.of(),
    Set.of(), // no teachers initially
    Set.of(),
    true, // active
    null, // createdAt will be set
    null  // updatedAt will be set
);

DepartmentDTO created = departmentService.create(departmentDTO);
```

### Assigning a Department Head
```java
// This will automatically promote the user to DEPARTMENT_HEAD role if they're a TEACHER
DepartmentDTO updated = departmentService.assignDepartmentHead(departmentId, userId);
```

### Querying Departments
```java
// Get all departments for a school
List<DepartmentDTO> departments = departmentService.getDepartmentsBySchoolId(schoolId);

// Get only active departments
List<DepartmentDTO> activeDepartments = departmentService.getActiveDepartmentsBySchoolId(schoolId);

// Search for specific department
DepartmentDTO department = departmentService.getDepartmentByNameAndSchoolId("Mathematics", schoolId);
```

## Integration Points

### With User Management
- Department heads and teachers must be valid users with appropriate roles
- Role promotion is handled automatically when assigning department heads

### With Subject Management
- Subjects are linked to departments for organizational purposes
- Subject-department relationships are enforced at the database level

### With School Management
- Departments belong to schools and inherit school-level permissions
- School-level administrators can manage all departments within their school

## Security Considerations

1. **Role-Based Access**: All endpoints are protected with appropriate role checks
2. **Data Validation**: Comprehensive input validation prevents malicious data
3. **Business Logic Enforcement**: Database constraints ensure data integrity
4. **Audit Trail**: All operations are logged for accountability
5. **Cross-School Protection**: Users cannot access departments from other schools

## Performance Considerations

1. **Lazy Loading**: Entity relationships use lazy loading to prevent N+1 queries
2. **Query Optimization**: Custom JPQL queries with @EntityGraph for efficient data fetching
3. **Indexing**: Database indexes on frequently queried fields (name, school_id)
4. **Caching**: Service layer can be enhanced with caching for frequently accessed data

## Future Enhancements

1. **Department Hierarchy**: Support for parent-child department relationships
2. **Department Budgets**: Financial management capabilities
3. **Department Analytics**: Reporting and analytics features
4. **Department Events**: Integration with calendar and event management
5. **Department Resources**: Management of department-specific resources

## Conclusion

The Department Management Module provides a robust, scalable, and secure foundation for managing academic departments. It follows best practices in software architecture, includes comprehensive testing, and provides a clean API for frontend integration. 