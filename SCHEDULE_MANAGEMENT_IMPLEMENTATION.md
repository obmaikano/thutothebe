# Schedule Management System Implementation

## Overview

A comprehensive, secure, and scalable schedule and event management system for educational institutions with role-based access control, conflict detection, audit trails, and version management.

## Architecture

### Core Components

1. **Entities**
   - `Schedule` - Main schedule entity extending `BaseEntity`
   - `ScheduleHistory` - Audit trail for schedule changes
   - Supporting enums: `DayOfWeek`, `ScheduleType`, `ScheduleStatus`, `ScheduleHistoryAction`

2. **DTOs**
   - `ScheduleDTO` - Data transfer object with validation
   - `ScheduleHistoryDTO` - Audit trail data transfer object

3. **Repositories**
   - `ScheduleRepository` - Comprehensive queries with role-based access
   - `ScheduleHistoryRepository` - Audit trail management

4. **Mappers**
   - `ScheduleMapper` - Entity-DTO conversion
   - `ScheduleHistoryMapper` - History entity-DTO conversion

5. **Services**
   - `ScheduleService` - Main business logic interface
   - `ScheduleServiceImpl` - Implementation with validation and access control
   - `ScheduleAccessService` - Role-based permission management

6. **Controllers**
   - `ScheduleController` - REST API endpoints with security

## Role-Based Access Control

### User Roles and Permissions

#### National Level
- **SUPER_ADMIN**: Full CRUD access to all schedules
- **MINISTRY_EXECUTIVE**: Full CRUD access to all schedules
- **MINISTRY_STAFF**: Full CRUD access within assigned regions

#### Regional Level
- **DIRECTOR**: Full CRUD access within assigned regions
- **REGIONAL_ADMIN**: Full CRUD access within their region
- **REGIONAL_OFFICER**: CRUD access within assigned schools in their region

#### School Level
- **SCHOOL_ADMIN**: Full CRUD access within their school
- **SCHOOL_HEAD**: Full CRUD access within their school
- **DEPARTMENT_HEAD**: CRUD access within their school/department
- **SENIOR_TEACHER**: CRUD access within their school
- **TEACHER**: Read access + partial updates to their own schedules
- **STUDENT**: Read-only access to their class schedules
- **PARENT**: Read-only access to their children's schedules

### Access Control Matrix

| Role | Create | Read | Update | Delete | History | Rollback |
|------|--------|------|--------|--------|---------|----------|
| SUPER_ADMIN | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| MINISTRY_EXECUTIVE | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| MINISTRY_STAFF | ✅ Region | ✅ Region | ✅ Region | ✅ Region | ✅ Region | ✅ Region |
| DIRECTOR | ✅ Region | ✅ Region | ✅ Region | ✅ Region | ✅ Region | ✅ Region |
| REGIONAL_ADMIN | ✅ Region | ✅ Region | ✅ Region | ✅ Region | ✅ Region | ✅ Region |
| REGIONAL_OFFICER | ✅ Schools | ✅ Schools | ✅ Schools | ❌ | ✅ Schools | ❌ |
| SCHOOL_ADMIN | ✅ School | ✅ School | ✅ School | ✅ School | ✅ School | ✅ School |
| SCHOOL_HEAD | ✅ School | ✅ School | ✅ School | ✅ School | ✅ School | ✅ School |
| DEPARTMENT_HEAD | ✅ School | ✅ School | ✅ School | ❌ | ✅ School | ❌ |
| SENIOR_TEACHER | ✅ School | ✅ School | ✅ School | ❌ | ✅ School | ❌ |
| TEACHER | ❌ | ✅ Own/School | ✅ Partial | ❌ | ✅ Own | ❌ |
| STUDENT | ❌ | ✅ Own Class | ❌ | ❌ | ❌ | ❌ |
| PARENT | ❌ | ✅ Children | ❌ | ❌ | ❌ | ❌ |

## Key Features

### 1. Multi-Tenancy Support
- School-based data isolation
- Region-based access control
- Hierarchical permission inheritance

### 2. Schedule Conflict Detection
- Class-based time conflict checking
- Teacher availability validation
- Automatic conflict resolution suggestions

### 3. Version Control & Audit Trail
- Complete change history tracking
- Version rollback functionality
- User action logging with IP and user agent
- JSON-based old/new value comparison

### 4. Advanced Querying
- Role-based schedule filtering
- Date range queries
- Day-of-week filtering
- Student/parent specific views
- Teacher schedule management

### 5. Bulk Operations
- Mass schedule updates
- Batch status changes
- Bulk permission validation

## API Endpoints

### User-Specific Endpoints
```
GET /api/schedules/user - Get schedules for current user
GET /api/schedules/student/{studentId} - Get student schedules
GET /api/schedules/parent/{parentId} - Get parent's children schedules
GET /api/schedules/teacher/{teacherId} - Get teacher schedules
```

### School/Class Management
```
GET /api/schedules/school/{schoolId} - Get school schedules
GET /api/schedules/class/{classId} - Get class schedules
GET /api/schedules/day/{dayOfWeek} - Get schedules by day
```

### Schedule Management
```
POST /api/schedules/create - Create new schedule
PUT /api/schedules/{id}/update - Update schedule
DELETE /api/schedules/{id}/delete - Delete schedule
PUT /api/schedules/{id}/status - Update schedule status
PUT /api/schedules/bulk-update - Bulk update schedules
```

### Conflict Detection
```
GET /api/schedules/conflicts/check - Check for time conflicts
```

### History & Versioning
```
GET /api/schedules/{id}/history - Get schedule history
GET /api/schedules/{parentId}/versions - Get version history
POST /api/schedules/{id}/rollback/{version} - Rollback to version
```

### Date Range Queries
```
GET /api/schedules/date-range - Get schedules for date range
```

## Database Schema

### Schedule Table
```sql
CREATE TABLE schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    effective_date DATETIME NOT NULL,
    expiry_date DATETIME,
    location VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    color VARCHAR(7),
    is_recurring BOOLEAN DEFAULT TRUE,
    recurrence_rule VARCHAR(255),
    course_id BIGINT,
    class_id BIGINT,
    school_id BIGINT,
    region_id BIGINT,
    created_by BIGINT NOT NULL,
    teacher_id BIGINT,
    schedule_version INT DEFAULT 1,
    parent_schedule_id BIGINT,
    metadata TEXT,
    active BOOLEAN DEFAULT TRUE,
    version BIGINT,
    created_at DATETIME NOT NULL,
    modified_at DATETIME NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);
```

### Schedule History Table
```sql
CREATE TABLE schedule_histories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    change_timestamp DATETIME NOT NULL,
    old_values TEXT,
    new_values TEXT,
    reason TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    schedule_version INT,
    version BIGINT,
    created_at DATETIME NOT NULL,
    modified_at DATETIME NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);
```

## Usage Examples

### Creating a Schedule
```java
ScheduleDTO scheduleDTO = new ScheduleDTO(
    null, "Mathematics", "Advanced Mathematics Class",
    LocalTime.of(9, 0), LocalTime.of(10, 0), DayOfWeek.MONDAY,
    LocalDateTime.now(), null, "Room 101", ScheduleType.CLASS,
    ScheduleStatus.ACTIVE, "#FF5733", true, null,
    1L, "Mathematics", 1L, "Grade 10A", 1L, "Test School",
    1L, "Test Region", 1L, "John Doe", 2L, "Jane Smith",
    1, null, null, true
);

ScheduleDTO created = scheduleService.createScheduleWithValidation(
    scheduleDTO, UserRole.SCHOOL_ADMIN, userId, userRegionId, userSchoolId, 
    ipAddress, userAgent
);
```

### Checking Conflicts
```java
List<ScheduleDTO> conflicts = scheduleService.checkTimeConflicts(
    classId, teacherId, DayOfWeek.MONDAY, 
    LocalTime.of(9, 0), LocalTime.of(10, 0), 
    LocalDateTime.now(), null
);
```

### Getting User Schedules
```java
Page<ScheduleDTO> userSchedules = scheduleService.getSchedulesForUser(
    UserRole.TEACHER, userId, userRegionId, userSchoolId, pageable
);
```

### Updating Schedule Status
```java
ScheduleDTO updated = scheduleService.updateScheduleStatus(
    scheduleId, ScheduleStatus.SUSPENDED, UserRole.SCHOOL_ADMIN,
    userId, userRegionId, userSchoolId, "Maintenance required",
    ipAddress, userAgent
);
```

## Security Features

### 1. Role-Based Access Control
- Comprehensive permission matrix
- Hierarchical access validation
- Multi-level security checks

### 2. Audit Trail
- Complete change tracking
- User identification logging
- IP address and user agent recording
- Timestamp tracking for all operations

### 3. Data Validation
- Input validation in DTOs
- Business rule enforcement
- Conflict detection and prevention

### 4. Multi-Tenancy Security
- School-based data isolation
- Region-based access restrictions
- Cross-tenant access prevention

## Performance Optimizations

### 1. Database Optimizations
- Indexed queries for role-based access
- Efficient conflict detection queries
- Optimized date range searches

### 2. Lazy Loading
- FetchType.LAZY for relationships
- @EntityGraph for avoiding N+1 problems

### 3. Caching Strategy
- Repository-level caching
- Service-level result caching
- Version-based cache invalidation

## Testing

### Unit Tests
- Comprehensive service layer testing
- Role-based access control validation
- Conflict detection verification
- Audit trail functionality testing

### Integration Tests
- End-to-end API testing
- Database integration validation
- Security constraint verification

## Deployment Considerations

### 1. Database Setup
- Run migration scripts for new tables
- Create appropriate indexes
- Set up foreign key constraints

### 2. Security Configuration
- Configure role-based security
- Set up authentication filters
- Enable audit logging

### 3. Performance Monitoring
- Monitor query performance
- Track API response times
- Set up alerting for conflicts

## Future Enhancements

### 1. Real-Time Features
- WebSocket notifications for schedule changes
- Live conflict detection
- Real-time collaboration

### 2. Advanced Scheduling
- Recurring schedule patterns
- Holiday management
- Automatic rescheduling

### 3. Integration Features
- Calendar system integration
- Email notifications
- Mobile app support

### 4. Analytics
- Schedule utilization reports
- Conflict analysis
- Performance metrics

## Conclusion

This schedule management system provides a robust, secure, and scalable solution for educational institutions. With comprehensive role-based access control, conflict detection, audit trails, and version management, it ensures data integrity while providing flexibility for different user roles and organizational structures.

The implementation follows SOLID principles, DRY principles, and OWASP security best practices, making it maintainable and secure for production use. 