# Technical Implementation Guide - Multi-Tenant Security

## Architecture Overview

### BaseServiceImpl Pattern
All service implementations extend `BaseServiceImpl` and must implement two critical methods for multi-tenant security:

```java
public abstract class BaseServiceImpl<E extends BaseEntity, D, ID> implements BaseService<D, ID> {
    
    /**
     * Extract school ID from entity for tenant validation
     * Must be implemented by subclasses for multi-tenant entities
     */
    protected abstract Long extractSchoolId(E entity);
    
    /**
     * Extract region ID from entity for tenant validation
     * Must be implemented by subclasses for multi-tenant entities
     */
    protected abstract Long extractRegionId(E entity);
}
```

## Implementation Patterns

### 1. Direct School Relationship
For entities directly linked to schools:
```java
@Override
protected Long extractSchoolId(Student entity) {
    return entity.getSchool() != null ? entity.getSchool().getId() : null;
}

@Override
protected Long extractRegionId(Student entity) {
    return entity.getSchool() != null && entity.getSchool().getRegion() != null 
        ? entity.getSchool().getRegion().getId() : null;
}
```

### 2. Course-Based Relationship Chain
For entities linked through course relationships:
```java
@Override
protected Long extractSchoolId(Content entity) {
    return entity.getCourse() != null && 
           entity.getCourse().getClassEntity() != null && 
           entity.getCourse().getClassEntity().getSchool() != null 
        ? entity.getCourse().getClassEntity().getSchool().getId() : null;
}
```

### 3. Multi-Source Relationship
For entities with multiple possible relationship paths:
```java
@Override
protected Long extractSchoolId(AttendanceSummary entity) {
    // Try student relationship first
    if (entity.getStudentUser() != null && entity.getStudentUser().getSchool() != null) {
        return entity.getStudentUser().getSchool().getId();
    }
    // Fall back to class relationship
    if (entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null) {
        return entity.getClassEntity().getSchool().getId();
    }
    return null;
}
```

### 4. System-Level Entities
For global system entities not tied to specific tenants:
```java
@Override
protected Long extractSchoolId(SystemUsage entity) {
    // SystemUsage is a system-level entity not tied to specific schools
    return null;
}

@Override
protected Long extractRegionId(SystemUsage entity) {
    // SystemUsage is a system-level entity not tied to specific regions
    return null;
}
```

### 5. Hierarchy Entities
For entities that represent the hierarchy itself:
```java
// School entity returns its own ID
@Override
protected Long extractSchoolId(School entity) {
    return entity.getId();
}

// Region entity returns its own ID for region, null for school
@Override
protected Long extractRegionId(Region entity) {
    return entity.getId();
}
```

### 6. Complex Chain Relationships
For entities with deep relationship chains:
```java
@Override
protected Long extractSchoolId(Assessment entity) {
    return entity.getSubmission() != null && 
           entity.getSubmission().getAssignment() != null && 
           entity.getSubmission().getAssignment().getCourse() != null && 
           entity.getSubmission().getAssignment().getCourse().getClassEntity() != null && 
           entity.getSubmission().getAssignment().getCourse().getClassEntity().getSchool() != null 
        ? entity.getSubmission().getAssignment().getCourse().getClassEntity().getSchool().getId() : null;
}
```

### 7. Curriculum-Based Relationships
For curriculum management entities:
```java
@Override
protected Long extractSchoolId(CurriculumResource entity) {
    return entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null 
        ? entity.getCurriculum().getSchool().getId() : null;
}

@Override
protected Long extractRegionId(CurriculumResource entity) {
    // Try curriculum's direct region first
    if (entity.getCurriculum() != null && entity.getCurriculum().getRegion() != null) {
        return entity.getCurriculum().getRegion().getId();
    }
    // Fall back to curriculum's school region
    if (entity.getCurriculum() != null && 
        entity.getCurriculum().getSchool() != null && 
        entity.getCurriculum().getSchool().getRegion() != null) {
        return entity.getCurriculum().getSchool().getRegion().getId();
    }
    return null;
}
```

### 8. Announcement-Based Relationships
For announcement and activity entities:
```java
@Override
protected Long extractSchoolId(AnnouncementActivity entity) {
    // Try announcement's target school first
    if (entity.getAnnouncement() != null && entity.getAnnouncement().getTargetSchool() != null) {
        return entity.getAnnouncement().getTargetSchool().getId();
    }
    // Fall back to user's school
    if (entity.getUser() != null && entity.getUser().getSchool() != null) {
        return entity.getUser().getSchool().getId();
    }
    return null;
}
```

## Repository Integration

### Query-Level Filtering
Repositories use tenant-aware queries:
```java
@Query("SELECT e FROM Entity e WHERE e.school.id IN :schoolIds")
List<Entity> findBySchoolIds(@Param("schoolIds") List<Long> schoolIds);

@Query("SELECT e FROM Entity e WHERE e.school.region.id IN :regionIds")
List<Entity> findByRegionIds(@Param("regionIds") List<Long> regionIds);
```

### EntityGraph for Performance
Use EntityGraph to avoid N+1 problems:
```java
@EntityGraph(attributePaths = {"school", "school.region"})
@Query("SELECT e FROM Entity e WHERE e.school.id IN :schoolIds")
List<Entity> findBySchoolIdsWithGraph(@Param("schoolIds") List<Long> schoolIds);
```

## Rule-Based Access Control

### Access Control Service
The `RuleBasedAccessControlService` provides high-performance validation:
```java
public boolean hasAccessToScope(UserRole role, String scope, Long scopeId) {
    return switch (role) {
        case SUPER_ADMIN -> true; // Global access
        case REGIONAL_ADMIN -> hasRegionalAccess(scopeId, scope);
        case SCHOOL_ADMIN -> hasSchoolAccess(scopeId, scope);
        case TEACHER -> hasTeacherAccess(scopeId, scope);
        case STUDENT -> hasStudentAccess(scopeId, scope);
        case PARENT -> hasParentAccess(scopeId, scope);
        default -> false;
    };
}
```

### Hierarchical Validation
```java
private boolean hasRegionalAccess(Long scopeId, String scope) {
    return switch (scope) {
        case "GLOBAL" -> false;
        case "REGION" -> userRegionIds.contains(scopeId);
        case "SCHOOL" -> userSchoolIds.contains(scopeId);
        case "CLASS", "USER", "PARENT" -> true; // Regional admins can access lower levels
        default -> false;
    };
}
```

## Performance Optimizations

### Caching Strategy
- Rule-based access control results are cached
- Entity relationship traversal is optimized
- Database queries use proper indexing

### Query Optimization
- Use EntityGraph to fetch related entities
- Implement proper database indexes on school_id and region_id
- Use batch queries where possible

## Security Considerations

### Fail-Secure Design
- Default to denying access if tenant cannot be determined
- Validate all entity relationships before granting access
- Log security violations for audit purposes

### Tenant Isolation
- Complete data separation at school and region levels
- Cross-tenant communication only through approved channels
- Audit trail for all access attempts

## Testing Strategy

### Unit Tests
Test each implementation pattern:
```java
@Test
void testExtractSchoolId_DirectRelationship() {
    Student student = new Student();
    School school = new School();
    school.setId(1L);
    student.setSchool(school);
    
    Long schoolId = studentService.extractSchoolId(student);
    assertEquals(1L, schoolId);
}
```

### Integration Tests
Test complete access control flows:
```java
@Test
void testAccessControl_SchoolLevelUser() {
    // Test that school-level users can only access their school's data
    List<Student> students = studentService.findAll();
    assertTrue(students.stream().allMatch(s -> 
        userSchoolIds.contains(s.getSchool().getId())));
}
```

## Deployment Checklist

### Database Setup
- [ ] Ensure foreign key constraints on school_id and region_id
- [ ] Create indexes on tenant discriminator columns
- [ ] Verify data integrity across all entities

### Application Configuration
- [ ] Enable multi-tenant security in application properties
- [ ] Configure rule-based access control
- [ ] Set up proper logging for security events

### Performance Validation
- [ ] Verify 10-20x performance improvement
- [ ] Test under load with multiple tenants
- [ ] Monitor query performance and optimization

### Security Validation
- [ ] Test tenant isolation
- [ ] Verify access control for all user roles
- [ ] Conduct penetration testing

This technical guide ensures consistent implementation of multi-tenant security across all entities in the ThutoLMS system. 