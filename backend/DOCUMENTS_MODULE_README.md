# Documents Management Module

## Overview

The Documents Management Module is a comprehensive solution for managing documents within a school-based Learning Management System (LMS). It provides secure file storage, role-based access control, document versioning, approval workflows, and comprehensive audit trails.

## Architecture

The module follows clean architecture principles and adheres to SOLID principles, implementing the established codebase patterns:

- **Entities** extend `BaseEntity`
- **Services** extend `BaseService` with implementations extending `BaseServiceImpl`
- **Controllers** extend `BaseController`
- **Mappers** implement `BaseDtoMapper`
- **DTOs** use record pattern with validation

## Core Features

### 1. Document Management
- **File Upload/Download**: Secure file handling with validation
- **Document Metadata**: Title, description, categories, tags
- **File Types**: Support for PDFs, Word documents, images, videos, and more
- **Storage**: Organized file system storage with unique naming
- **Versioning**: Document version control with parent-child relationships

### 2. Access Control
- **Role-based Permissions**: Granular permissions by user role
- **Access Levels**: PUBLIC, REGIONAL, SCHOOL, CLASS, COURSE, SUBJECT, TEACHER_ONLY, ADMIN_ONLY, PRIVATE
- **Permission Types**: READ, DOWNLOAD, EDIT, DELETE, SHARE, APPROVE, ARCHIVE
- **Specific User Permissions**: Individual user access control
- **Scope-based Permissions**: School, region, class, course-specific access

### 3. Approval Workflow
- **Approval Status**: PENDING, APPROVED, REJECTED
- **Approval Notes**: Comments and feedback
- **Approval History**: Track approval decisions
- **Automatic Approval**: Configurable approval requirements

### 4. Audit and Analytics
- **Access Logging**: Comprehensive access tracking
- **Usage Statistics**: Download counts, view counts, access patterns
- **Security Monitoring**: Failed access attempts, suspicious activity
- **Reporting**: Usage reports, compliance reports, activity summaries

### 5. Document Organization
- **Categories**: POLICY, PROCEDURE, CURRICULUM, LESSON_PLAN, ASSIGNMENT, etc.
- **Linking**: Associate documents with assignments, announcements, schedules
- **Tagging**: Flexible tagging system for organization
- **Search**: Full-text search across titles, descriptions, and tags
- **Filtering**: Filter by category, type, access level, approval status

## Database Schema

### Core Entities

#### Document
```sql
CREATE TABLE documents (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_category VARCHAR(50) NOT NULL,
    access_level VARCHAR(50) NOT NULL,
    uploaded_by_id BIGINT NOT NULL,
    uploaded_at TIMESTAMP NOT NULL,
    school_id BIGINT,
    region_id BIGINT,
    class_id BIGINT,
    course_id BIGINT,
    subject_id BIGINT,
    tags TEXT,
    checksum VARCHAR(255),
    version_number INTEGER NOT NULL DEFAULT 1,
    parent_document_id BIGINT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by_id BIGINT,
    approved_at TIMESTAMP,
    approval_notes TEXT,
    download_count BIGINT NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMP,
    expiry_date TIMESTAMP,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMP,
    archived_by_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);
```

#### DocumentPermission
```sql
CREATE TABLE document_permissions (
    id BIGINT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    permission_type VARCHAR(50) NOT NULL,
    specific_user_id BIGINT,
    school_id BIGINT,
    region_id BIGINT,
    class_id BIGINT,
    course_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);
```

#### DocumentAccessLog
```sql
CREATE TABLE document_access_logs (
    id BIGINT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    access_type VARCHAR(50) NOT NULL,
    accessed_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(255),
    user_agent TEXT,
    session_id VARCHAR(255),
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL DEFAULT 0
);
```

## API Endpoints

### Document Operations
- `POST /api/documents/upload` - Upload new document
- `POST /api/documents/{parentDocumentId}/upload-version` - Upload document version
- `GET /api/documents/{documentId}/download` - Download document
- `GET /api/documents/active` - Get all active documents
- `GET /api/documents/{id}` - Get document by ID
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{documentId}/user/{userId}` - Delete document

### Document Retrieval
- `GET /api/documents/school/{schoolId}` - Get documents by school
- `GET /api/documents/region/{regionId}` - Get documents by region
- `GET /api/documents/class/{classId}` - Get documents by class
- `GET /api/documents/course/{courseId}` - Get documents by course
- `GET /api/documents/subject/{subjectId}` - Get documents by subject
- `GET /api/documents/user/{userId}` - Get documents by user
- `GET /api/documents/category/{category}` - Get documents by category
- `GET /api/documents/type/{type}` - Get documents by type
- `GET /api/documents/public` - Get public documents
- `GET /api/documents/archived` - Get archived documents

### Search and Filtering
- `GET /api/documents/search` - Search documents
- `GET /api/documents/search/user/{userId}` - Search user's documents
- `GET /api/documents/{parentDocumentId}/versions` - Get document versions
- `GET /api/documents/expired` - Get expired documents

### Access Control
- `GET /api/documents/{documentId}/access/read/{userId}` - Check read access
- `GET /api/documents/{documentId}/access/download/{userId}` - Check download access
- `GET /api/documents/{documentId}/access/edit/{userId}` - Check edit access
- `GET /api/documents/{documentId}/access/delete/{userId}` - Check delete access

### Statistics
- `GET /api/documents/statistics/school/{schoolId}/count` - Get document count
- `GET /api/documents/statistics/user/{userId}/count` - Get user document count
- `GET /api/documents/statistics/school/{schoolId}/total-size` - Get total file size

## Service Layer

### DocumentService
Core document management operations:
- File upload/download with security checks
- Document CRUD operations
- Version management
- Search and filtering
- Access control integration
- Statistics and reporting

### DocumentPermissionService
Permission management:
- Grant/revoke permissions
- Role-based access control
- Specific user permissions
- Scope-based permissions
- Permission validation
- Bulk operations

### DocumentAccessLogService
Audit and analytics:
- Access logging
- Usage statistics
- Security monitoring
- Reporting and analytics
- Real-time activity tracking
- Compliance reporting

## Security Features

### File Security
- File type validation
- Size limits
- Virus scanning integration points
- Secure file storage
- Checksum verification

### Access Security
- Role-based access control
- Permission validation
- Access logging
- Failed attempt monitoring
- Session tracking

### Data Security
- Soft delete pattern
- Audit trails
- Data encryption points
- Backup considerations

## Configuration

### Application Properties
```properties
# Document upload configuration
app.document.upload.dir=uploads/documents
app.document.max.file.size=10485760
app.document.allowed.types=pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif,mp4,avi

# Security configuration
app.document.virus.scan.enabled=true
app.document.encryption.enabled=false

# Cleanup configuration
app.document.cleanup.enabled=true
app.document.cleanup.retention.days=365
```

## Testing

### Unit Tests
Comprehensive unit tests covering:
- Service layer operations
- Permission validation
- File operations
- Error handling
- Edge cases

### Test Coverage
- DocumentServiceImpl: Full lifecycle testing
- DocumentPermissionServiceImpl: Permission management
- DocumentAccessLogServiceImpl: Audit functionality
- Mapper implementations
- Controller endpoints

### Testing Patterns
- Mockito for dependency mocking
- JUnit 5 for test framework
- Proper isolation and setup
- Comprehensive assertions
- Error scenario testing

## Usage Examples

### Upload Document
```java
@PostMapping("/upload")
public ResponseEntity<OhmaApiResponse<DocumentDTO>> uploadDocument(
    @RequestParam("file") MultipartFile file,
    @RequestParam("title") String title,
    @RequestParam("description") String description,
    @RequestParam("documentCategory") DocumentCategory category,
    @RequestParam("accessLevel") DocumentAccessLevel accessLevel,
    @RequestParam("uploadedById") Long uploadedById) {
    
    DocumentDTO documentDTO = new DocumentDTO(/* parameters */);
    DocumentDTO result = documentService.uploadDocument(file, documentDTO, uploadedById);
    return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document uploaded", result, null));
}
```

### Check Permissions
```java
boolean hasAccess = documentPermissionService.hasReadPermission(documentId, userId);
if (!hasAccess) {
    throw new SecurityException("Access denied");
}
```

### Log Access
```java
documentAccessLogService.logSuccessfulAccess(
    documentId, userId, DocumentAccessType.DOWNLOAD, 
    ipAddress, userAgent, sessionId
);
```

## Future Enhancements

### Planned Features
- Document collaboration
- Real-time editing
- Advanced search with AI
- Automated categorization
- Integration with external storage
- Mobile app support
- Offline synchronization

### Performance Optimizations
- Caching strategies
- CDN integration
- Database indexing
- File compression
- Lazy loading

### Security Enhancements
- Advanced threat detection
- Encryption at rest
- Digital signatures
- Watermarking
- DLP integration

## Maintenance

### Regular Tasks
- Log cleanup
- File system maintenance
- Permission audits
- Performance monitoring
- Security updates

### Monitoring
- File storage usage
- Access patterns
- Error rates
- Performance metrics
- Security events

## Support

For technical support or questions about the Documents Management Module:
- Review the code documentation
- Check the unit tests for usage examples
- Refer to the API documentation
- Contact the development team

---

**Note**: This module is designed to be extensible and maintainable. Follow the established patterns when adding new features or modifications. 