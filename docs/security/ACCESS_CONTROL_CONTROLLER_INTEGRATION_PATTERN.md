# Access Control Controller Integration Pattern

## Overview
This document provides the systematic pattern for integrating rule-based access control into all controllers based on our implemented role hierarchy and access rules.

## Role-Based Access Control Rules

### User Role Access Scopes
| User Role | Access Scope | Description |
|-----------|--------------|-------------|
| **STUDENT** | Own school data | Access only to their own school, classes, and classmates |
| **TEACHER** | Own school data | Access only to their assigned classes and students in their school |
| **SCHOOL_ADMIN** | Own school management | Manage/view all data within their own school |
| **SCHOOL_HEAD** | Own school management | View/manage all data within their own school |
| **DEPARTMENT_HEAD** | Department management | View/manage only their assigned departments |
| **REGIONAL_ADMIN** | Regional access | Access to all schools in their assigned region |
| **DIRECTOR** | Regional access | Regional scope access (same as REGIONAL_ADMIN) |
| **MINISTRY_EXECUTIVE** | Global access | Full access to all data across the system |
| **MINISTRY_STAFF** | Global access | Full access to all data across the system |
| **SUPER_ADMIN** | System-wide control | Full system administration capabilities |
| **PARENT** | Children's data | Access to each child's data across multiple schools/regions |

## Integration Steps

### 1. Update Imports
```java
// Remove this import:
// import org.springframework.security.access.prepost.PreAuthorize;

// Add these imports:
import com.ohma.thutothebe.entity.AccessScope;
import org.springframework.http.HttpStatus;
import java.util.stream.Collectors; // if filtering is needed
```

### 2. Remove @PreAuthorize Annotations
Remove all `@PreAuthorize` annotations from controller methods.

### 3. Apply Role-Based Access Control Patterns

#### **Basic Authentication Check (Required for ALL endpoints)**
```java
Long currentUserId = getCurrentUserId();
if (currentUserId == null) {
    return createUnauthorizedResponse();
}
```

## Controller-Specific Integration Patterns

### **UserController - User Management**
```java
// View specific user
if (!hasAccess(AccessScope.USER, userId)) {
    return createAccessDeniedResponse();
}

// List users (filtered by accessible users)
List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
List<UserDTO> filteredUsers = allUsers.stream()
    .filter(user -> accessibleUserIds.contains(user.getId()))
    .collect(Collectors.toList());

// Create user (admin level required)
if (!hasAccess(AccessScope.GLOBAL, null)) {
    return createAccessDeniedResponse();
}
```

### **StudentController - Student Management**
```java
// View specific student
if (!hasAccess(AccessScope.USER, student.userId())) {
    return createAccessDeniedResponse();
}

// View students by class
if (!hasAccess(AccessScope.CLASS, classId)) {
    return createAccessDeniedResponse();
}

// View students by school
if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
    return createAccessDeniedResponse();
}

// List students (filtered by accessible users)
List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
List<StudentDTO> filteredStudents = allStudents.stream()
    .filter(student -> accessibleUserIds.contains(student.userId()))
    .collect(Collectors.toList());
```

### **TeacherController - Teacher Management**
```java
// View specific teacher
if (!hasAccess(AccessScope.USER, teacher.userId())) {
    return createAccessDeniedResponse();
}

// View teachers by school
if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
    return createAccessDeniedResponse();
}

// List teachers (filtered by accessible users)
List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
List<TeacherDTO> filteredTeachers = allTeachers.stream()
    .filter(teacher -> accessibleUserIds.contains(teacher.getUserId()))
    .collect(Collectors.toList());
```

### **SchoolController - School Management**
```java
// View specific school
if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
    return createAccessDeniedResponse();
}

// List schools (filtered by accessible schools)
List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
List<SchoolDTO> filteredSchools = allSchools.stream()
    .filter(school -> accessibleSchoolIds.contains(school.getId()))
    .collect(Collectors.toList());

// Create school (regional admin or higher required)
if (!hasAccess(AccessScope.REGION, regionId) && !hasAccess(AccessScope.GLOBAL, null)) {
    return createAccessDeniedResponse();
}
```

### **ClassController - Class Management**
```java
// View specific class
if (!hasAccess(AccessScope.CLASS, classId)) {
    return createAccessDeniedResponse();
}

// View classes by school
if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
    return createAccessDeniedResponse();
}

// List classes (filtered by accessible classes)
List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
List<ClassDTO> filteredClasses = allClasses.stream()
    .filter(classDto -> accessibleClassIds.contains(classDto.getId()))
    .collect(Collectors.toList());

// Manage class assignments (school admin or higher)
ClassDTO classDto = classService.getById(classId);
if (!hasAccess(AccessScope.SCHOOL, classDto.getSchoolId())) {
    return createAccessDeniedResponse();
}
```

### **DepartmentController - Department Management**
```java
// View specific department
if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
    return createAccessDeniedResponse();
}

// View departments by school
if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
    return createAccessDeniedResponse();
}

// List departments (filtered by accessible departments)
List<Long> accessibleDeptIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.DEPARTMENT);
List<DepartmentDTO> filteredDepts = allDepartments.stream()
    .filter(dept -> accessibleDeptIds.contains(dept.getId()))
    .collect(Collectors.toList());
```

### **CourseController - Course Management**
```java
// View course (check class access)
CourseDTO course = courseService.getById(courseId);
if (!hasAccess(AccessScope.CLASS, course.getClassId())) {
    return createAccessDeniedResponse();
}

// View courses by teacher (check user access)
if (!hasAccess(AccessScope.USER, teacherId)) {
    return createAccessDeniedResponse();
}

// List courses (filter by accessible classes)
List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
List<CourseDTO> filteredCourses = allCourses.stream()
    .filter(course -> accessibleClassIds.contains(course.getClassId()))
    .collect(Collectors.toList());
```

### **GradeController - Grade Management**
```java
// View student grades
if (!hasAccess(AccessScope.USER, studentUserId)) {
    return createAccessDeniedResponse();
}

// Manage grades (teacher must have access to the class)
GradeDTO grade = gradeService.getById(gradeId);
StudentDTO student = studentService.getById(grade.getStudentId());
if (!hasAccess(AccessScope.USER, student.userId())) {
    return createAccessDeniedResponse();
}

// View class grades
if (!hasAccess(AccessScope.CLASS, classId)) {
    return createAccessDeniedResponse();
}
```

### **AssignmentController - Assignment Management**
```java
// View assignment (check class access)
AssignmentDTO assignment = assignmentService.getById(assignmentId);
if (!hasAccess(AccessScope.CLASS, assignment.getClassId())) {
    return createAccessDeniedResponse();
}

// Create assignment (teacher must be assigned to class)
if (!hasAccess(AccessScope.CLASS, dto.getClassId())) {
    return createAccessDeniedResponse();
}

// List assignments (filter by accessible classes)
List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
List<AssignmentDTO> filteredAssignments = allAssignments.stream()
    .filter(assignment -> accessibleClassIds.contains(assignment.getClassId()))
    .collect(Collectors.toList());
```

### **AttendanceController - Attendance Management**
```java
// View student attendance
if (!hasAccess(AccessScope.USER, studentUserId)) {
    return createAccessDeniedResponse();
}

// Record attendance (teacher must have access to class)
if (!hasAccess(AccessScope.CLASS, classId)) {
    return createAccessDeniedResponse();
}

// View class attendance
if (!hasAccess(AccessScope.CLASS, classId)) {
    return createAccessDeniedResponse();
}
```

### **RegionController - Regional Management**
```java
// View specific region
if (!hasAccess(AccessScope.REGION, regionId)) {
    return createAccessDeniedResponse();
}

// List regions (filtered by accessible regions)
List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
List<RegionDTO> filteredRegions = allRegions.stream()
    .filter(region -> accessibleRegionIds.contains(region.getId()))
    .collect(Collectors.toList());

// Create region (global admin required)
if (!hasAccess(AccessScope.GLOBAL, null)) {
    return createAccessDeniedResponse();
}
```

### **ParentController - Parent Access**
```java
// View child data
if (!hasAccess(AccessScope.USER, childUserId)) {
    return createAccessDeniedResponse();
}

// List children (parents get filtered list of their children)
List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
List<UserDTO> children = userService.getChildrenByParentId(parentId).stream()
    .filter(child -> accessibleUserIds.contains(child.getId()))
    .collect(Collectors.toList());
```

### **Administrative Controllers (Reports, Analytics, etc.)**
```java
// System-wide reports (global admin only)
if (!hasAccess(AccessScope.GLOBAL, null)) {
    return createAccessDeniedResponse();
}

// School reports (school admin or higher)
if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
    return createAccessDeniedResponse();
}

// Class reports (teacher assigned to class or higher)
if (!hasAccess(AccessScope.CLASS, classId)) {
    return createAccessDeniedResponse();
}
```

## Implementation Status

### ✅ Completed Controllers
- [x] **BaseController** - Added access control service and utility methods
- [x] **UserController** - Full role-based access control integration
- [x] **StudentController** - Full role-based access control integration  
- [x] **ClassController** - Partial integration (imports updated, needs role-based logic)

### 🔄 Pending Controllers (Apply Role-Based Patterns)
- [ ] **TeacherController** - Apply teacher/user access patterns
- [ ] **SchoolController** - Apply school-level access patterns
- [ ] **DepartmentController** - Apply department-level access patterns
- [ ] **RegionController** - Apply regional access patterns
- [ ] **CourseController** - Apply class-based access patterns
- [ ] **AssignmentController** - Apply class-based access patterns
- [ ] **GradeController** - Apply student/class access patterns
- [ ] **AttendanceController** - Apply student/class access patterns
- [ ] **ParentController** - Apply parent-child access patterns
- [ ] **ReportController** - Apply hierarchical report access
- [ ] **AnnouncementController** - Apply school/class access patterns
- [ ] **MessageController** - Apply user-to-user access patterns
- [ ] And 10+ other controllers...

## Access Control Decision Matrix

| Operation | STUDENT | TEACHER | SCHOOL_ADMIN | REGIONAL_ADMIN | GLOBAL_ADMIN |
|-----------|---------|---------|--------------|----------------|--------------|
| View own data | ✅ | ✅ | ✅ | ✅ | ✅ |
| View classmates | ✅ | ✅ | ✅ | ✅ | ✅ |
| View students in assigned classes | ❌ | ✅ | ✅ | ✅ | ✅ |
| View all students in school | ❌ | ❌ | ✅ | ✅ | ✅ |
| View students across schools | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage grades | ❌ | ✅ (own classes) | ✅ | ✅ | ✅ |
| Create classes | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage school data | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create schools | ❌ | ❌ | ❌ | ✅ | ✅ |
| System administration | ❌ | ❌ | ❌ | ❌ | ✅ |

## Testing Role-Based Access

### Test Scenarios for Each Role:
```bash
# STUDENT access - should only see own school data
curl -H "Authorization: Bearer <student-jwt>" /api/v1/students
curl -H "Authorization: Bearer <student-jwt>" /api/v1/classes/school/1

# TEACHER access - should only see assigned classes
curl -H "Authorization: Bearer <teacher-jwt>" /api/v1/students/class/1
curl -H "Authorization: Bearer <teacher-jwt>" /api/v1/grades/class/1

# SCHOOL_ADMIN access - should see all school data
curl -H "Authorization: Bearer <school-admin-jwt>" /api/v1/students/school/1
curl -H "Authorization: Bearer <school-admin-jwt>" /api/v1/classes/school/1

# REGIONAL_ADMIN access - should see all schools in region
curl -H "Authorization: Bearer <regional-admin-jwt>" /api/v1/schools/region/1
curl -H "Authorization: Bearer <regional-admin-jwt>" /api/v1/students/school/2

# GLOBAL_ADMIN access - should see everything
curl -H "Authorization: Bearer <global-admin-jwt>" /api/v1/schools
curl -H "Authorization: Bearer <global-admin-jwt>" /api/v1/regions
```

## Key Implementation Points

1. **Hierarchical Access**: Higher roles automatically get access to lower scopes
2. **Filtering vs Blocking**: Use filtering for list operations, blocking for specific resource access
3. **Parent-Child Relationships**: Always check parent resource access when appropriate
4. **Cross-School Access**: Only REGIONAL_ADMIN+ and PARENT roles can access across schools
5. **Teacher Scope**: Teachers only access their assigned classes and students
6. **Student Scope**: Students only access their own school and classes
7. **Performance**: Use bulk ID filtering rather than individual checks where possible

This role-based approach ensures that our access control is consistent across all controllers and matches the real-world LMS hierarchy and permissions.

## Access Scope Mapping

| Resource Type | AccessScope | Description |
|---------------|-------------|-------------|
| Users | `AccessScope.USER` | Individual user access |
| Schools | `AccessScope.SCHOOL` | School-level access |
| Classes | `AccessScope.CLASS` | Class-level access |
| Departments | `AccessScope.DEPARTMENT` | Department-level access |
| Regions | `AccessScope.REGION` | Regional access |
| System-wide | `AccessScope.GLOBAL` | Global admin access |

## Implementation Status

### ✅ Completed Controllers
- [x] **BaseController** - Added access control service and utility methods
- [x] **UserController** - Full access control integration
- [x] **StudentController** - Full access control integration  
- [x] **ClassController** - Partial integration (imports updated, logic needs completion)

### 🔄 Pending Controllers (Pattern to Apply)
- [ ] **TeacherController**
- [ ] **SchoolController** 
- [ ] **DepartmentController**
- [ ] **RegionController**
- [ ] **SubjectController**
- [ ] **CourseController**
- [ ] **AssignmentController**
- [ ] **GradeController**
- [ ] **AttendanceController**
- [ ] **AnnouncementController**
- [ ] **TimetableController**
- [ ] **ReportController**
- [ ] **MessageController**
- [ ] **NotificationController**
- [ ] **InventoryController**
- [ ] **FinanceController**
- [ ] **EventController**
- [ ] **LibraryController**
- [ ] **TransportController**
- [ ] **HealthController**
- [ ] **ParentController**
- [ ] **AdminController**
- [ ] **AuthController** (special case - may need different approach)

## Special Cases

### AuthController
Authentication endpoints typically don't need access control checks as they establish authentication. Handle with care.

### Public Endpoints
Some endpoints may need to remain public (health checks, swagger docs). Consider carefully.

### Parent-Child Relationships
When dealing with resources that have parent-child relationships (e.g., Class belongs to School), check access to both the resource and its parent as appropriate.

## Testing Access Control

### Test Cases to Verify:
1. **Unauthorized access** - No JWT token
2. **Forbidden access** - Valid token but insufficient permissions
3. **Successful access** - Valid token with proper permissions
4. **Filtering works** - Only accessible resources returned in list operations
5. **Cross-scope access** - Teachers can only see their classes/students, etc.

### Example Test Endpoints:
```bash
# Test unauthorized access
curl -X GET http://localhost:8080/api/v1/students

# Test with valid teacher token
curl -X GET -H "Authorization: Bearer <teacher-jwt>" http://localhost:8080/api/v1/students

# Test admin access
curl -X GET -H "Authorization: Bearer <admin-jwt>" http://localhost:8080/api/v1/students
```

## Performance Considerations

1. **Caching**: Access control service uses caching to avoid repeated permission checks
2. **Bulk Operations**: When possible, get accessible IDs once and filter, rather than checking each item individually
3. **Database Queries**: Consider if filtering can be done at the database level for better performance

## Security Best Practices

1. **Fail Secure**: Always deny access by default if permission cannot be determined
2. **Log Access Attempts**: Log denied access attempts for security auditing
3. **Consistent Error Messages**: Use consistent error responses to avoid information leakage
4. **Input Validation**: Validate all inputs before performing access checks

## Migration Strategy

1. **Start with Critical Controllers**: Begin with User, Student, Teacher controllers
2. **Test Thoroughly**: Test each controller after integration
3. **Gradual Rollout**: Deploy one controller at a time in production
4. **Monitor Performance**: Watch for any performance degradation
5. **Rollback Plan**: Keep the original @PreAuthorize annotations commented for quick rollback if needed

## Next Steps

1. Apply the pattern to TeacherController
2. Update SchoolController 
3. Continue with remaining controllers systematically
4. Create automated tests for access control
5. Performance testing with realistic data loads
6. Documentation for frontend integration 