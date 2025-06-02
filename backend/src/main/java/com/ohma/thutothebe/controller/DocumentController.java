package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.DocumentDTO;
import com.ohma.thutothebe.dto.DocumentUploadRequest;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.DocumentAccessLevel;
import com.ohma.thutothebe.entity.DocumentApprovalStatus;
import com.ohma.thutothebe.entity.DocumentCategory;
import com.ohma.thutothebe.entity.DocumentType;
import com.ohma.thutothebe.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/documents")
@Tag(name = "Document Management", description = "Document management operations")
public class DocumentController extends BaseController<DocumentDTO, Long> {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        super(documentService);
        this.documentService = documentService;
    }

    // File Upload Operations
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

    @PostMapping(value = "/{parentDocumentId}/upload-version", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a new version of an existing document")
    public ResponseEntity<OhmaApiResponse<DocumentDTO>> uploadDocumentVersion(
            @PathVariable Long parentDocumentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("uploadedById") Long uploadedById) {
        try {
            DocumentDTO documentDTO = new DocumentDTO(
                null, title, description, null, null, null, null, null,
                null, null, uploadedById, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, 1, null, null, null,
                false, false, DocumentApprovalStatus.PENDING,
                null, null, null, null, 0L, 0L, null, null,
                false, null, null, null, true, null, null,
                null, null, null
            );

            DocumentDTO uploadedVersion = documentService.uploadDocumentVersion(parentDocumentId, file, documentDTO, uploadedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document version uploaded successfully", uploadedVersion, null));
        } catch (Exception e) {
            log.error("Error uploading document version: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // File Download Operations
    @GetMapping("/{documentId}/download")
    @Operation(summary = "Download a document")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable Long documentId,
            @RequestParam("userId") Long userId) {
        try {
            byte[] fileContent = documentService.downloadDocument(documentId, userId);
            DocumentDTO document = documentService.getActiveDocumentById(documentId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.fileName() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, document.mimeType())
                    .body(fileContent);
        } catch (Exception e) {
            log.error("Error downloading document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Document Retrieval Operations
    @GetMapping("/active")
    @Operation(summary = "Get all active documents with pagination")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getAllActiveDocuments(Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getAllActiveDocuments(pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving active documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get documents by school")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsBySchool(
            @PathVariable Long schoolId, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsBySchool(schoolId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving school documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get documents by region")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByRegion(
            @PathVariable Long regionId, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByRegion(regionId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving region documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get documents by class")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByClass(
            @PathVariable Long classId, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByClass(classId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving class documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get documents by course")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByCourse(
            @PathVariable Long courseId, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByCourse(courseId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving course documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get documents by subject")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsBySubject(
            @PathVariable Long subjectId, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsBySubject(subjectId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving subject documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get documents uploaded by user")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByUploadedBy(
            @PathVariable Long userId, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByUploadedBy(userId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving user documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Category and Type Filtering
    @GetMapping("/category/{category}")
    @Operation(summary = "Get documents by category")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByCategory(
            @PathVariable DocumentCategory category, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByCategory(category, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Documents by category retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving documents by category: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get documents by type")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByType(
            @PathVariable DocumentType type, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByType(type, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Documents by type retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving documents by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/access-level/{accessLevel}")
    @Operation(summary = "Get documents by access level")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByAccessLevel(
            @PathVariable DocumentAccessLevel accessLevel, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByAccessLevel(accessLevel, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Documents by access level retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving documents by access level: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/approval-status/{status}")
    @Operation(summary = "Get documents by approval status")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getDocumentsByApprovalStatus(
            @PathVariable DocumentApprovalStatus status, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getDocumentsByApprovalStatus(status, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Documents by approval status retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving documents by approval status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Public and Archived Documents
    @GetMapping("/public")
    @Operation(summary = "Get public documents")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getPublicDocuments(Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getPublicDocuments(pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Public documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving public documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/archived")
    @Operation(summary = "Get archived documents")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> getArchivedDocuments(Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.getArchivedDocuments(pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Archived documents retrieved successfully", documents, null));
        } catch (Exception e) {
            log.error("Error retrieving archived documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Document Versioning
    @GetMapping("/{parentDocumentId}/versions")
    @Operation(summary = "Get all versions of a document")
    public ResponseEntity<OhmaApiResponse<List<DocumentDTO>>> getDocumentVersions(@PathVariable Long parentDocumentId) {
        try {
            List<DocumentDTO> versions = documentService.getDocumentVersions(parentDocumentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document versions retrieved successfully", versions, null));
        } catch (Exception e) {
            log.error("Error retrieving document versions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{parentDocumentId}/latest-version")
    @Operation(summary = "Get the latest version of a document")
    public ResponseEntity<OhmaApiResponse<DocumentDTO>> getLatestVersion(@PathVariable Long parentDocumentId) {
        try {
            DocumentDTO latestVersion = documentService.getLatestVersion(parentDocumentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Latest document version retrieved successfully", latestVersion, null));
        } catch (Exception e) {
            log.error("Error retrieving latest document version: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Search Functionality
    @GetMapping("/search")
    @Operation(summary = "Search documents")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> searchDocuments(
            @RequestParam("searchTerm") String searchTerm, Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.searchDocuments(searchTerm, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document search completed successfully", documents, null));
        } catch (Exception e) {
            log.error("Error searching documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search/user/{userId}")
    @Operation(summary = "Search documents for a specific user")
    public ResponseEntity<OhmaApiResponse<Page<DocumentDTO>>> searchDocumentsByUser(
            @PathVariable Long userId,
            @RequestParam("searchTerm") String searchTerm, 
            Pageable pageable) {
        try {
            Page<DocumentDTO> documents = documentService.searchDocumentsByUser(searchTerm, userId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User document search completed successfully", documents, null));
        } catch (Exception e) {
            log.error("Error searching user documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Document Management Operations
    @DeleteMapping("/{documentId}/user/{userId}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<OhmaApiResponse<Void>> deleteDocument(
            @PathVariable Long documentId,
            @PathVariable Long userId) {
        try {
            documentService.deleteDocument(documentId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Access Control
    @GetMapping("/{documentId}/access/read/{userId}")
    @Operation(summary = "Check if user has read access to document")
    public ResponseEntity<OhmaApiResponse<Boolean>> hasReadAccess(
            @PathVariable Long documentId,
            @PathVariable Long userId) {
        try {
            boolean hasAccess = documentService.hasReadAccess(documentId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Access check completed", hasAccess, null));
        } catch (Exception e) {
            log.error("Error checking read access: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{documentId}/access/download/{userId}")
    @Operation(summary = "Check if user has download access to document")
    public ResponseEntity<OhmaApiResponse<Boolean>> hasDownloadAccess(
            @PathVariable Long documentId,
            @PathVariable Long userId) {
        try {
            boolean hasAccess = documentService.hasDownloadAccess(documentId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Access check completed", hasAccess, null));
        } catch (Exception e) {
            log.error("Error checking download access: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{documentId}/access/edit/{userId}")
    @Operation(summary = "Check if user has edit access to document")
    public ResponseEntity<OhmaApiResponse<Boolean>> hasEditAccess(
            @PathVariable Long documentId,
            @PathVariable Long userId) {
        try {
            boolean hasAccess = documentService.hasEditAccess(documentId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Access check completed", hasAccess, null));
        } catch (Exception e) {
            log.error("Error checking edit access: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{documentId}/access/delete/{userId}")
    @Operation(summary = "Check if user has delete access to document")
    public ResponseEntity<OhmaApiResponse<Boolean>> hasDeleteAccess(
            @PathVariable Long documentId,
            @PathVariable Long userId) {
        try {
            boolean hasAccess = documentService.hasDeleteAccess(documentId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Access check completed", hasAccess, null));
        } catch (Exception e) {
            log.error("Error checking delete access: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Statistics and Analytics
    @GetMapping("/statistics/school/{schoolId}/count")
    @Operation(summary = "Get document count by school")
    public ResponseEntity<OhmaApiResponse<Long>> getDocumentCountBySchool(@PathVariable Long schoolId) {
        try {
            Long count = documentService.getDocumentCountBySchool(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Document count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving document count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/user/{userId}/count")
    @Operation(summary = "Get document count by user")
    public ResponseEntity<OhmaApiResponse<Long>> getDocumentCountByUser(@PathVariable Long userId) {
        try {
            Long count = documentService.getDocumentCountByUser(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User document count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving user document count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/school/{schoolId}/total-size")
    @Operation(summary = "Get total file size by school")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalFileSizeBySchool(@PathVariable Long schoolId) {
        try {
            Long totalSize = documentService.getTotalFileSizeBySchool(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total file size retrieved successfully", totalSize, null));
        } catch (Exception e) {
            log.error("Error retrieving total file size: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/expired")
    @Operation(summary = "Get expired documents")
    public ResponseEntity<OhmaApiResponse<List<DocumentDTO>>> getExpiredDocuments() {
        try {
            List<DocumentDTO> expiredDocuments = documentService.getExpiredDocuments();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Expired documents retrieved successfully", expiredDocuments, null));
        } catch (Exception e) {
            log.error("Error retrieving expired documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/expiring-within/{days}")
    @Operation(summary = "Get documents expiring within specified days")
    public ResponseEntity<OhmaApiResponse<List<DocumentDTO>>> getDocumentsExpiringWithin(@PathVariable int days) {
        try {
            List<DocumentDTO> expiringDocuments = documentService.getDocumentsExpiringWithin(days);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Expiring documents retrieved successfully", expiringDocuments, null));
        } catch (Exception e) {
            log.error("Error retrieving expiring documents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 