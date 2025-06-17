# Backend Fix Required: DocumentController Upload Method

## Issue
The DocumentController is creating a DocumentDTO with null values for required fields (fileName, filePath, fileSize, mimeType, documentType), which causes the DocumentDTO constructor validation to fail with "File name cannot be null or blank".

## Root Cause
The DocumentDTO has strict validation in its constructor that requires non-null, non-blank values for essential fields. However, the DocumentController is trying to create a DocumentDTO with null values for file-related fields before the DocumentService can populate them from the uploaded file.

## Current Problematic Code
```java
// In DocumentController.uploadDocument()
DocumentDTO documentDTO = new DocumentDTO(
    null, title, description, null, null, null, null, null,  // <- null values cause validation failure
    documentCategory, accessLevel, uploadedById, null, null,
    schoolId, null, regionId, null, classId, null, courseId, null,
    subjectId, null, tags, null, 1, null, null, null,
    isPublic, requiresApproval, DocumentApprovalStatus.PENDING,
    null, null, null, null, 0L, 0L, null, null,
    false, null, null, null, true, null, null,
    null, null, null
);
```

## Solution
Provide placeholder values for the required fields that will be overridden by the DocumentService:

```java
// In DocumentController.uploadDocument()
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "Upload a new document")
public ResponseEntity<OhmaApiResponse<DocumentDTO>> uploadDocument(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("documentCategory") DocumentCategory documentCategory,
        @RequestParam("accessLevel") DocumentAccessLevel accessLevel,
        @RequestParam("uploadedById") Long uploadedById,
        @RequestParam(value = "schoolId", required = false) Long schoolId,
        @RequestParam(value = "regionId", required = false) Long regionId,
        @RequestParam(value = "classId", required = false) Long classId,
        @RequestParam(value = "courseId", required = false) Long courseId,
        @RequestParam(value = "subjectId", required = false) Long subjectId,
        @RequestParam(value = "tags", required = false) String tags,
        @RequestParam(value = "isPublic", defaultValue = "false") boolean isPublic,
        @RequestParam(value = "requiresApproval", defaultValue = "false") boolean requiresApproval) {
    try {
        // Get original filename for placeholder
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "uploaded_file";
        }
        
        DocumentDTO documentDTO = new DocumentDTO(
            null, // id
            title, // title
            description, // description
            originalFilename, // fileName - use actual filename as placeholder
            "/temp/placeholder", // filePath - placeholder, will be overridden
            file.getSize(), // fileSize - use actual file size
            file.getContentType() != null ? file.getContentType() : "application/octet-stream", // mimeType - use actual or default
            DocumentType.OTHER, // documentType - placeholder, will be determined by service
            documentCategory, // documentCategory
            accessLevel, // accessLevel
            uploadedById, // uploadedById
            null, // uploadedByName
            null, // uploadedAt
            schoolId, // schoolId
            null, // schoolName
            regionId, // regionId
            null, // regionName
            classId, // classId
            null, // className
            courseId, // courseId
            null, // courseName
            subjectId, // subjectId
            null, // subjectName
            tags, // tags
            null, // checksum
            1, // versionNumber
            null, // parentDocumentId
            null, // parentDocumentTitle
            null, // childDocuments
            isPublic, // isPublic
            requiresApproval, // requiresApproval
            requiresApproval ? DocumentApprovalStatus.PENDING : DocumentApprovalStatus.APPROVED, // approvalStatus
            null, // approvedById
            null, // approvedByName
            null, // approvedAt
            null, // approvalNotes
            0L, // downloadCount
            0L, // viewCount
            null, // lastAccessedAt
            null, // expiryDate
            false, // isArchived
            null, // archivedAt
            null, // archivedById
            null, // archivedByName
            true, // active
            null, // documentPermissions
            null, // accessLogs
            null, // createdAt
            null, // modifiedAt
            null // version
        );

        DocumentDTO uploadedDocument = documentService.uploadDocument(file, documentDTO, uploadedById);
        return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document uploaded successfully", uploadedDocument, null));
    } catch (Exception e) {
        log.error("Error uploading document: {}", e.getMessage(), e);
        return ResponseEntity.badRequest()
                .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
    }
}
```

## Alternative Solution (Recommended)
Create a separate DTO for upload requests that doesn't have the strict validation:

```java
// Create a new DTO for upload requests
public record DocumentUploadRequest(
    String title,
    String description,
    DocumentCategory documentCategory,
    DocumentAccessLevel accessLevel,
    Long uploadedById,
    Long schoolId,
    Long regionId,
    Long classId,
    Long courseId,
    Long subjectId,
    String tags,
    boolean isPublic,
    boolean requiresApproval
) {
    // No strict validation in constructor
}

// Update DocumentController to use the upload request DTO
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "Upload a new document")
public ResponseEntity<OhmaApiResponse<DocumentDTO>> uploadDocument(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("documentCategory") DocumentCategory documentCategory,
        @RequestParam("accessLevel") DocumentAccessLevel accessLevel,
        @RequestParam("uploadedById") Long uploadedById,
        @RequestParam(value = "schoolId", required = false) Long schoolId,
        @RequestParam(value = "regionId", required = false) Long regionId,
        @RequestParam(value = "classId", required = false) Long classId,
        @RequestParam(value = "courseId", required = false) Long courseId,
        @RequestParam(value = "subjectId", required = false) Long subjectId,
        @RequestParam(value = "tags", required = false) String tags,
        @RequestParam(value = "isPublic", defaultValue = "false") boolean isPublic,
        @RequestParam(value = "requiresApproval", defaultValue = "false") boolean requiresApproval) {
    try {
        DocumentUploadRequest uploadRequest = new DocumentUploadRequest(
            title, description, documentCategory, accessLevel, uploadedById,
            schoolId, regionId, classId, courseId, subjectId, tags,
            isPublic, requiresApproval
        );

        DocumentDTO uploadedDocument = documentService.uploadDocument(file, uploadRequest, uploadedById);
        return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document uploaded successfully", uploadedDocument, null));
    } catch (Exception e) {
        log.error("Error uploading document: {}", e.getMessage(), e);
        return ResponseEntity.badRequest()
                .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
    }
}

// Update DocumentService interface and implementation
public interface DocumentService extends BaseService<DocumentDTO, Long> {
    DocumentDTO uploadDocument(MultipartFile file, DocumentUploadRequest uploadRequest, Long uploadedById);
    // ... other methods
}

@Service
public class DocumentServiceImpl extends BaseServiceImpl<Document, DocumentDTO, Long> implements DocumentService {
    
    @Override
    public DocumentDTO uploadDocument(MultipartFile file, DocumentUploadRequest uploadRequest, Long uploadedById) {
        validateFile(file);
        
        User uploadedBy = userRepository.findById(uploadedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + uploadedById));

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Copy file to upload directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Calculate checksum
            String checksum = calculateChecksum(file.getBytes());

            // Create document entity directly from upload request
            Document document = new Document();
            document.setTitle(uploadRequest.title());
            document.setDescription(uploadRequest.description());
            document.setFileName(originalFilename);
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setMimeType(file.getContentType());
            document.setDocumentType(determineDocumentType(file.getContentType()));
            document.setDocumentCategory(uploadRequest.documentCategory());
            document.setAccessLevel(uploadRequest.accessLevel());
            document.setUploadedBy(uploadedBy);
            document.setUploadedAt(LocalDateTime.now());
            document.setChecksum(checksum);
            document.setTags(uploadRequest.tags());
            document.setPublic(uploadRequest.isPublic());
            document.setRequiresApproval(uploadRequest.requiresApproval());
            document.setApprovalStatus(uploadRequest.requiresApproval() ? DocumentApprovalStatus.PENDING : DocumentApprovalStatus.APPROVED);

            // Set related entities
            setRelatedEntities(document, uploadRequest);

            Document savedDocument = documentRepository.save(document);

            // Log the upload
            documentAccessLogService.logSuccessfulAccess(savedDocument.getId(), uploadedById, 
                    DocumentAccessType.EDIT, null, null, null);

            log.info("Document uploaded successfully: {} by user: {}", savedDocument.getTitle(), uploadedById);
            return documentMapper.toDto(savedDocument);

        } catch (IOException e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload document: " + e.getMessage());
        }
    }
    
    private void setRelatedEntities(Document document, DocumentUploadRequest uploadRequest) {
        if (uploadRequest.schoolId() != null) {
            School school = schoolRepository.findById(uploadRequest.schoolId()).orElse(null);
            document.setSchool(school);
        }
        if (uploadRequest.regionId() != null) {
            Region region = regionRepository.findById(uploadRequest.regionId()).orElse(null);
            document.setRegion(region);
        }
        if (uploadRequest.classId() != null) {
            Class classEntity = classRepository.findById(uploadRequest.classId()).orElse(null);
            document.setClassEntity(classEntity);
        }
        if (uploadRequest.courseId() != null) {
            Course course = courseRepository.findById(uploadRequest.courseId()).orElse(null);
            document.setCourse(course);
        }
        if (uploadRequest.subjectId() != null) {
            Subject subject = subjectRepository.findById(uploadRequest.subjectId()).orElse(null);
            document.setSubject(subject);
        }
    }
}
```

## Files to Modify

### Option 1 (Quick Fix):
- `backend/src/main/java/com/ohma/thutothebe/controller/DocumentController.java`

### Option 2 (Recommended):
- Create: `backend/src/main/java/com/ohma/thutothebe/dto/DocumentUploadRequest.java`
- Modify: `backend/src/main/java/com/ohma/thutothebe/controller/DocumentController.java`
- Modify: `backend/src/main/java/com/ohma/thutothebe/service/DocumentService.java`
- Modify: `backend/src/main/java/com/ohma/thutothebe/service/impl/DocumentServiceImpl.java`

## Benefits of the Fix
1. **Eliminates Validation Error**: No more "File name cannot be null or blank" errors
2. **Cleaner Architecture**: Separates upload concerns from full document representation
3. **Better Validation**: Upload-specific validation separate from entity validation
4. **Maintainability**: Clearer separation of concerns

## Testing
After implementing the fix, test with:
1. Single file upload
2. Multiple file upload
3. Various file types
4. Large files (within limits)
5. Files with special characters in names
6. Files without extensions

The frontend code should work without any changes once this backend fix is implemented. 