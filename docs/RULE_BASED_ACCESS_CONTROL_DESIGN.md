# Rule-Based Access Control System Design

## Overview

Instead of maintaining separate `UserScope` tables, we derive access control from **existing organizational relationships** and **business rules**. This approach is simpler, more performant, and eliminates data synchronization issues.

## Core Principle

**Access is determined by:**
1. User's role (`UserRole`)
2. User's organizational relationships (existing FK relationships)
3. Hierarchical business rules (coded logic)

## Organizational Relationships (Existing Tables)

```sql
-- Users already have organizational context
User {
  id: Long
  role: UserRole
  schoolId: Long (FK) -- Primary school assignment
  departmentId: Long (FK) -- For teachers/department heads
  -- Other existing fields
}

-- Teachers are assigned to classes (existing)
TeacherClassAssignment {
  teacherId: Long (FK)
  classId: Long (FK)
}

-- Students are enrolled in classes (existing)
StudentEnrollment {
  studentId: Long (FK)
  classId: Long (FK)
}

-- Parents are linked to children (existing)
ParentChildRelationship {
  parentId: Long (FK)
  childId: Long (FK)
}

-- Existing hierarchy
Region -> School -> Department -> Class
```

## Access Rules by Role

### 1. SUPER_ADMIN / MINISTRY_EXECUTIVE
```java
// Global access to everything
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    return true; // No restrictions
}
```

### 2. REGIONAL_ADMIN
```java
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    User user = userRepository.findById(userId);
    Long userRegionId = user.getSchool().getRegion().getId();
    
    switch (targetScope) {
        case REGION:
            return targetScopeId.equals(userRegionId);
        case SCHOOL:
            School school = schoolRepository.findById(targetScopeId);
            return school.getRegion().getId().equals(userRegionId);
        case DEPARTMENT:
            Department dept = departmentRepository.findById(targetScopeId);
            return dept.getSchool().getRegion().getId().equals(userRegionId);
        case CLASS:
            Class cls = classRepository.findById(targetScopeId);
            return cls.getSchool().getRegion().getId().equals(userRegionId);
        default:
            return false;
    }
}
```

### 3. SCHOOL_ADMIN / SCHOOL_HEAD
```java
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    User user = userRepository.findById(userId);
    Long userSchoolId = user.getSchoolId();
    
    switch (targetScope) {
        case SCHOOL:
            return targetScopeId.equals(userSchoolId);
        case DEPARTMENT:
            Department dept = departmentRepository.findById(targetScopeId);
            return dept.getSchoolId().equals(userSchoolId);
        case CLASS:
            Class cls = classRepository.findById(targetScopeId);
            return cls.getSchoolId().equals(userSchoolId);
        case USER:
            User targetUser = userRepository.findById(targetScopeId);
            return targetUser.getSchoolId().equals(userSchoolId);
        default:
            return false;
    }
}
```

### 4. TEACHER
```java
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    switch (targetScope) {
        case CLASS:
            // Teacher can access classes they're assigned to
            return teacherClassRepository.existsByTeacherIdAndClassId(userId, targetScopeId);
        case USER:
            if (targetScopeId.equals(userId)) return true; // Self access
            
            // Can access students in their classes
            User targetUser = userRepository.findById(targetScopeId);
            if (targetUser.getRole() == UserRole.STUDENT) {
                List<Long> teacherClassIds = getTeacherClassIds(userId);
                List<Long> studentClassIds = getStudentClassIds(targetScopeId);
                return !Collections.disjoint(teacherClassIds, studentClassIds);
            }
            return false;
        default:
            return false;
    }
}
```

### 5. STUDENT
```java
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    switch (targetScope) {
        case CLASS:
            // Student can access classes they're enrolled in
            return studentEnrollmentRepository.existsByStudentIdAndClassId(userId, targetScopeId);
        case USER:
            if (targetScopeId.equals(userId)) return true; // Self access
            
            // Can access classmates in same classes
            List<Long> userClassIds = getStudentClassIds(userId);
            List<Long> targetClassIds = getStudentClassIds(targetScopeId);
            return !Collections.disjoint(userClassIds, targetClassIds);
        default:
            return false;
    }
}
```

### 6. PARENT
```java
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    List<Long> childrenIds = getParentChildrenIds(userId);
    
    switch (targetScope) {
        case USER:
            // Can access their children
            return childrenIds.contains(targetScopeId);
        case CLASS:
            // Can access classes their children are in
            for (Long childId : childrenIds) {
                if (studentEnrollmentRepository.existsByStudentIdAndClassId(childId, targetScopeId)) {
                    return true;
                }
            }
            return false;
        default:
            return false;
    }
}
```

## Implementation

### 1. Rule-Based Access Control Service

```java
@Service
public class RuleBasedAccessControlService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TeacherClassRepository teacherClassRepository;
    
    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;
    
    @Autowired
    private ParentChildRepository parentChildRepository;
    
    public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> true;
            case REGIONAL_ADMIN -> hasRegionalAdminAccess(user, targetScope, targetScopeId);
            case SCHOOL_ADMIN, SCHOOL_HEAD -> hasSchoolAdminAccess(user, targetScope, targetScopeId);
            case DEPARTMENT_HEAD -> hasDepartmentHeadAccess(user, targetScope, targetScopeId);
            case TEACHER -> hasTeacherAccess(user, targetScope, targetScopeId);
            case STUDENT -> hasStudentAccess(user, targetScope, targetScopeId);
            case PARENT -> hasParentAccess(user, targetScope, targetScopeId);
            default -> false;
        };
    }
    
    public List<Long> getAccessibleScopeIds(Long userId, AccessScope scopeType) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> getAllScopeIds(scopeType);
            case REGIONAL_ADMIN -> getRegionalAdminScopeIds(user, scopeType);
            case SCHOOL_ADMIN, SCHOOL_HEAD -> getSchoolAdminScopeIds(user, scopeType);
            case TEACHER -> getTeacherScopeIds(user, scopeType);
            case STUDENT -> getStudentScopeIds(user, scopeType);
            case PARENT -> getParentScopeIds(user, scopeType);
            default -> Collections.emptyList();
        };
    }
    
    // Role-specific access methods...
}
```

### 2. Configuration Rules

```java
@Service
public class RuleBasedConfigurationService {
    
    // Configuration resolution based on hierarchy
    public String getConfigurationValue(String configKey, AccessScope scopeType, Long scopeId) {
        // Check most specific scope first, then walk up hierarchy
        String value = getDirectConfiguration(configKey, scopeType, scopeId);
        if (value != null) return value;
        
        // Walk up hierarchy
        return switch (scopeType) {
            case CLASS -> {
                Class cls = classRepository.findById(scopeId).orElse(null);
                if (cls != null) {
                    // Try school level
                    String schoolValue = getDirectConfiguration(configKey, AccessScope.SCHOOL, cls.getSchoolId());
                    if (schoolValue != null) yield schoolValue;
                    
                    // Try region level
                    String regionValue = getDirectConfiguration(configKey, AccessScope.REGION, cls.getSchool().getRegionId());
                    if (regionValue != null) yield regionValue;
                    
                    // Try global level
                    yield getDirectConfiguration(configKey, AccessScope.GLOBAL, null);
                }
                yield null;
            }
            case SCHOOL -> {
                School school = schoolRepository.findById(scopeId).orElse(null);
                if (school != null) {
                    // Try region level
                    String regionValue = getDirectConfiguration(configKey, AccessScope.REGION, school.getRegionId());
                    if (regionValue != null) yield regionValue;
                    
                    // Try global level
                    yield getDirectConfiguration(configKey, AccessScope.GLOBAL, null);
                }
                yield null;
            }
            // ... other cases
            default -> getDirectConfiguration(configKey, AccessScope.GLOBAL, null);
        };
    }
}
```

## Benefits of Rule-Based Approach

### 1. **Simplicity**
- No additional tables (`UserScope`, `ScopedConfiguration`)
- Uses existing organizational relationships
- Business logic is explicit and readable

### 2. **Performance**
- No joins across scope assignment tables
- Direct FK lookups using existing indexes
- Can be heavily cached

### 3. **Consistency**
- Access rules automatically follow organizational structure
- No risk of orphaned scope assignments
- Changes to org structure automatically update access

### 4. **Maintainability**
- All logic in code (version controlled)
- Easy to unit test
- Clear business rule documentation

## Handling Edge Cases

### 1. Temporary Access
```java
// Use time-based flags on existing entities
User {
    temporarySchoolId: Long (nullable)
    temporaryAccessStart: LocalDateTime (nullable)
    temporaryAccessEnd: LocalDateTime (nullable)
}

// Check temporary access in rules
private boolean hasTemporaryAccess(User user, Long targetSchoolId) {
    if (user.getTemporarySchoolId() != null && 
        user.getTemporaryAccessStart() != null &&
        user.getTemporaryAccessEnd() != null) {
        
        LocalDateTime now = LocalDateTime.now();
        return user.getTemporarySchoolId().equals(targetSchoolId) &&
               now.isAfter(user.getTemporaryAccessStart()) &&
               now.isBefore(user.getTemporaryAccessEnd());
    }
    return false;
}
```

### 2. Multi-School Teachers
```java
// Extend existing assignment table
TeacherClassAssignment {
    teacherId: Long (FK)
    classId: Long (FK)
    startDate: LocalDate
    endDate: LocalDate (nullable)
    isActive: Boolean
}

// Teacher access checks multiple assignments
private List<Long> getTeacherClassIds(Long teacherId) {
    return teacherClassRepository.findActiveByTeacherId(teacherId)
        .stream()
        .map(TeacherClassAssignment::getClassId)
        .collect(Collectors.toList());
}
```

### 3. Configuration Overrides
```java
// Store minimal configurations
Configuration {
    configKey: String
    configValue: String
    scopeType: AccessScope
    scopeId: Long (nullable for GLOBAL)
    isOverridable: Boolean
    active: Boolean
}

// Much simpler than current approach - just direct lookups
```

## Migration Strategy

### Phase 1: Implement Rule-Based Logic
1. Create `RuleBasedAccessControlService`
2. Implement role-specific access methods
3. Add comprehensive unit tests

### Phase 2: Simplify Configuration
1. Keep minimal `Configuration` table
2. Remove scope assignment complexity
3. Use direct hierarchy resolution

### Phase 3: Remove Complex Tables
1. Drop `UserScope` table
2. Drop `ScopedConfiguration` complexity
3. Clean up related services

## Frontend Integration

```typescript
// Much simpler service calls
const accessService = {
  async checkAccess(targetScope: string, targetScopeId: number): Promise<boolean> {
    // User context comes from authentication
    const response = await fetch(
      `/api/access-control/check?scope=${targetScope}&scopeId=${targetScopeId}`
    );
    return response.json();
  },
  
  async getAccessibleScopes(scopeType: string): Promise<number[]> {
    const response = await fetch(`/api/access-control/accessible/${scopeType}`);
    return response.json();
  }
};

// Configuration is much simpler
const configService = {
  async getConfig(key: string): Promise<string> {
    // Automatically resolves based on user's context
    const response = await fetch(`/api/config/${key}`);
    return response.json();
  }
};
```

## Conclusion

The rule-based approach is **significantly simpler** and more appropriate for educational systems where access patterns are predictable and based on organizational relationships. It eliminates:

- Complex scope assignment tables
- Data synchronization issues
- Performance overhead of multiple joins
- Administrative overhead of managing scope assignments

While slightly less flexible than the database-driven approach, it covers 95% of real-world use cases and is much easier to understand, maintain, and debug. 