# Announcement Management Module Implementation

## Overview

The Announcement Management module provides a comprehensive system for creating, managing, and distributing announcements with strict role-based access control (RBAC). The system enforces hierarchical permissions based on user roles and organizational structure.

## Architecture

The implementation follows the established architectural patterns:

- **Entities** extend `BaseEntity`
- **Services** extend `BaseService` and implement in `BaseServiceImpl`
- **Controllers** extend `BaseController`
- **Mappers** implement `BaseDtoMapper`
- **DTOs** are record types with validation

## Core Components

### Entities

#### Announcement
- **Location**: `backend/src/main/java/com/ohma/thutothebe/entity/Announcement.java`
- **Purpose**: Main announcement entity with targeting and scheduling capabilities
- **Key Features**:
  - Title and content with rich text support
  - Type classification (SYSTEM, ACADEMIC, ADMINISTRATIVE, EVENT, EMERGENCY, HOLIDAY, EXAM, GENERAL)
  - Priority levels (LOW, NORMAL, HIGH, URGENT)
  - Targeting by region, school, role, department, or class
  - Scheduling with start/end dates
  - Comments and acknowledgment settings
  - JSON storage for attachments and tags

#### AnnouncementReadReceipt
- **Location**: `backend/src/main/java/com/ohma/thutothebe/entity/AnnouncementReadReceipt.java`
- **Purpose**: Tracks when users read announcements
- **Features**: Unique constraint on announcement-user combination

#### AnnouncementAcknowledgment
- **Location**: `backend/src/main/java/com/ohma/thutothebe/entity/AnnouncementAcknowledgment.java`
- **Purpose**: Tracks acknowledgments for mandatory announcements
- **Features**: Optional acknowledgment notes

### Enums

#### AnnouncementType
- **Values**: SYSTEM, ACADEMIC, ADMINISTRATIVE, EVENT, EMERGENCY, HOLIDAY, EXAM, GENERAL
- **Purpose**: Categorizes announcements for filtering and organization

#### AnnouncementPriority
- **Values**: LOW, NORMAL, HIGH, URGENT
- **Purpose**: Determines display order and visual emphasis

### DTOs

#### AnnouncementDTO
- **Location**: `backend/src/main/java/com/ohma/thutothebe/dto/AnnouncementDTO.java`
- **Features**:
  - Comprehensive validation annotations
  - User-specific read/acknowledgment flags
  - Computed counts for analytics
  - JSON handling for attachments and tags

### Repositories

#### AnnouncementRepository
- **Location**: `backend/src/main/java/com/ohma/thutothebe/repository/AnnouncementRepository.java`
- **Key Queries**:
  - Role-based announcement filtering
  - Region and school targeting
  - Search functionality
  - Tag-based filtering
  - Pending acknowledgment counting

### Services

#### AnnouncementService
- **Interface**: `backend/src/main/java/com/ohma/thutothebe/service/AnnouncementService.java`
- **Implementation**: `backend/src/main/java/com/ohma/thutothebe/service/impl/AnnouncementServiceImpl.java`

**Key Methods**:
- `getAnnouncementsForUser()` - Role-based announcement retrieval
- `createAnnouncement()` - RBAC-validated creation
- `markAsRead()` - Read receipt tracking
- `acknowledgeAnnouncement()` - Acknowledgment handling
- `canUserCreateAnnouncementForTarget()` - Permission validation

### Controllers

#### AnnouncementController
- **Location**: `backend/src/main/java/com/ohma/thutothebe/controller/AnnouncementController.java`
- **Base Path**: `/api/announcements`
- **Security**: All endpoints protected with role-based authorization

## Role-Based Access Control (RBAC)

### Permission Matrix

| Role | Can View From | Can Create For | Target Audience |
|------|---------------|----------------|-----------------|
| SUPER_ADMIN | All system-wide | All users | Global, national, regional, school, roles |
| MINISTRY_EXECUTIVE | All levels | National/regional/school users | Any region, school, or role |
| MINISTRY_STAFF | Assigned regions/departments | Assigned departments/schools | Specified departments/schools |
| DIRECTOR | Assigned regions | Assigned regional/school users | Officers, school admins, teachers |
| REGIONAL_ADMIN | Region-wide | Schools and users within region | School staff, teachers, students, parents |
| REGIONAL_OFFICER | Assigned schools | Schools/users in assignment | School admins, heads, departments |
| SCHOOL_ADMIN | Own school | Full school scope | Teachers, students, staff, parents |
| SCHOOL_HEAD | Own school/departments | Teachers and departments | School staff and students |
| DEPARTMENT_HEAD | Own department | Teachers/students within department | Department members |
| SENIOR_TEACHER | Assigned department/classes | Class-level or department-level | Students in classes or department |
| TEACHER | Own courses | Students in own courses | Enrolled students only |

### Permission Validation

The system validates permissions at multiple levels:

1. **Creation Validation**: `canUserCreateAnnouncementForTarget()`
2. **Modification Validation**: `canUserModifyAnnouncement()`
3. **View Filtering**: Role-based queries in repository layer
4. **Controller Security**: Spring Security annotations

## API Endpoints

### Core Announcement Operations

```http
GET /api/announcements/user/{userId}
GET /api/announcements/user/{userId}/type/{type}
GET /api/announcements/creator/{creatorId}
POST /api/announcements/create/{creatorId}
PUT /api/announcements/{id}/update/{userId}
DELETE /api/announcements/{id}/delete/{userId}
```

### Read Receipts and Acknowledgments

```http
POST /api/announcements/{announcementId}/read/{userId}
POST /api/announcements/{announcementId}/acknowledge/{userId}
GET /api/announcements/user/{userId}/pending-acknowledgments/count
```

### Search and Filtering

```http
GET /api/announcements/user/{userId}/search?searchTerm={term}
GET /api/announcements/user/{userId}/tag/{tag}
GET /api/announcements/global
```

### Analytics and Reporting

```http
GET /api/announcements/{announcementId}/read-receipts/{requesterId}
GET /api/announcements/{announcementId}/acknowledgments/{requesterId}
```

## Database Schema

### Tables Created

1. **announcements** - Main announcement data
2. **announcement_read_receipts** - Read tracking
3. **announcement_acknowledgments** - Acknowledgment tracking

### Key Relationships

- Announcements → Users (creator)
- Announcements → Regions (targeting)
- Announcements → Schools (targeting)
- ReadReceipts → Announcements + Users
- Acknowledgments → Announcements + Users

## Features Implemented

### Core Features
- ✅ Role-based announcement creation
- ✅ Hierarchical targeting (global → region → school → role → class)
- ✅ Rich content support with attachments
- ✅ Scheduling with start/end dates
- ✅ Priority-based ordering
- ✅ Read receipt tracking
- ✅ Mandatory acknowledgments
- ✅ Search functionality
- ✅ Tag-based organization

### Security Features
- ✅ Comprehensive RBAC implementation
- ✅ Server-side permission validation
- ✅ Audit trail through BaseEntity
- ✅ Input validation and sanitization

### Advanced Features
- ✅ JSON storage for flexible data (attachments, tags)
- ✅ Pagination support
- ✅ User-specific status tracking
- ✅ Analytics and reporting
- ✅ Bulk operations support

## Testing

### Unit Tests
- **Location**: `backend/src/test/java/com/ohma/thutothebe/service/impl/AnnouncementServiceImplTest.java`
- **Coverage**: Complete service layer testing with mocked dependencies
- **Test Cases**: 20+ comprehensive test scenarios covering:
  - CRUD operations
  - Permission validation
  - Read receipt handling
  - Acknowledgment processing
  - Search functionality
  - Role-based access control

### Test Scenarios Covered
1. User announcement retrieval
2. Permission-based creation
3. Read receipt tracking
4. Acknowledgment processing
5. Search and filtering
6. Role validation
7. Error handling
8. Edge cases

## Configuration

### Jackson Configuration
- **Location**: `backend/src/main/java/com/ohma/thutothebe/config/JacksonConfig.java`
- **Purpose**: Ensures proper JSON serialization for attachments and tags

### Security Configuration
- Integrated with existing Spring Security setup
- Role-based endpoint protection
- JWT token validation

## Usage Examples

### Creating an Announcement

```java
AnnouncementDTO dto = new AnnouncementDTO(
    null, // id
    "Important Notice",
    "This is an important announcement for all students.",
    AnnouncementType.GENERAL,
    AnnouncementPriority.HIGH,
    null, // creatorId - set by service
    null, // creatorName - set by mapper
    null, // creatorRole - set by service
    null, // targetRegionId
    null, // targetRegionName
    1L,   // targetSchoolId
    null, // targetSchoolName
    UserRole.STUDENT, // targetRole
    null, // targetDepartment
    null, // targetClass
    LocalDateTime.now(), // startDate
    LocalDateTime.now().plusDays(7), // endDate
    false, // commentsEnabled
    true,  // acknowledgmentRequired
    Arrays.asList("attachment1.pdf"), // attachmentUrls
    Arrays.asList("important", "notice"), // tags
    true,  // active
    null, null, null, null, null, null, null // computed fields
);

AnnouncementDTO created = announcementService.createAnnouncement(dto, teacherId);
```

### Retrieving User Announcements

```java
Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsForUser(
    userId, 
    PageRequest.of(0, 20, Sort.by("priority").descending().and(Sort.by("createdAt").descending()))
);
```

### Marking as Read

```java
AnnouncementReadReceiptDTO receipt = announcementService.markAsRead(announcementId, userId);
```

### Acknowledging Announcement

```java
AnnouncementAcknowledgmentDTO ack = announcementService.acknowledgeAnnouncement(
    announcementId, 
    userId, 
    "I acknowledge receipt of this important notice."
);
```

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Input validation with detailed messages
- **Permission Errors**: Clear RBAC violation messages
- **Not Found Errors**: Resource not found exceptions
- **Conflict Errors**: Duplicate operations (already read/acknowledged)

## Performance Considerations

- **Lazy Loading**: Relationships use FetchType.LAZY
- **Entity Graphs**: Optimized queries with @EntityGraph
- **Pagination**: All list operations support pagination
- **Indexing**: Database indexes on frequently queried fields
- **Caching**: Leverages existing Hibernate second-level cache

## Future Enhancements

### Planned Features
- Email/SMS notification integration
- Rich text editor integration
- File upload management
- Advanced analytics dashboard
- Announcement templates
- Bulk import/export
- Mobile push notifications

### Scalability Improvements
- Event-driven architecture for notifications
- Caching layer for frequently accessed announcements
- Database partitioning for large datasets
- CDN integration for attachments

## Maintenance

### Monitoring
- Application logs include detailed announcement operations
- Metrics available through Spring Boot Actuator
- Database performance monitoring recommended

### Backup Considerations
- Regular backup of announcement data
- Attachment file backup strategy
- Read receipt and acknowledgment data retention

## Conclusion

The Announcement Management module provides a robust, secure, and scalable solution for organizational communication. The implementation follows established architectural patterns, includes comprehensive testing, and enforces strict role-based access control to ensure appropriate information distribution within the educational system. 