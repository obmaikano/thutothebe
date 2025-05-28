package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.DocumentAccessLevel;
import com.ohma.thutothebe.entity.DocumentApprovalStatus;
import com.ohma.thutothebe.entity.DocumentCategory;
import com.ohma.thutothebe.entity.DocumentType;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.Set;

public record DocumentDTO(
    Long id,
    
    @NotBlank(message = "Document title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title,
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description,
    
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name must not exceed 255 characters")
    String fileName,
    
    @NotBlank(message = "File path is required")
    String filePath,
    
    @NotNull(message = "File size is required")
    @Positive(message = "File size must be positive")
    Long fileSize,
    
    @NotBlank(message = "MIME type is required")
    @Size(max = 100, message = "MIME type must not exceed 100 characters")
    String mimeType,
    
    @NotNull(message = "Document type is required")
    DocumentType documentType,
    
    @NotNull(message = "Document category is required")
    DocumentCategory documentCategory,
    
    @NotNull(message = "Access level is required")
    DocumentAccessLevel accessLevel,
    
    @NotNull(message = "Uploaded by user is required")
    Long uploadedById,
    
    String uploadedByName,
    
    LocalDateTime uploadedAt,
    
    Long schoolId,
    String schoolName,
    
    Long regionId,
    String regionName,
    
    Long classId,
    String className,
    
    Long courseId,
    String courseName,
    
    Long subjectId,
    String subjectName,
    
    String tags,
    String checksum,
    
    @NotNull(message = "Version number is required")
    @Positive(message = "Version number must be positive")
    Integer versionNumber,
    
    Long parentDocumentId,
    String parentDocumentTitle,
    
    Set<DocumentDTO> childDocuments,
    
    boolean isPublic,
    boolean requiresApproval,
    
    @NotNull(message = "Approval status is required")
    DocumentApprovalStatus approvalStatus,
    
    Long approvedById,
    String approvedByName,
    LocalDateTime approvedAt,
    String approvalNotes,
    
    @NotNull(message = "Download count is required")
    @PositiveOrZero(message = "Download count must be zero or positive")
    Long downloadCount,
    
    @NotNull(message = "View count is required")
    @PositiveOrZero(message = "View count must be zero or positive")
    Long viewCount,
    
    LocalDateTime lastAccessedAt,
    LocalDateTime expiryDate,
    
    boolean isArchived,
    LocalDateTime archivedAt,
    Long archivedById,
    String archivedByName,
    
    boolean active,
    
    Set<DocumentPermissionDTO> documentPermissions,
    Set<DocumentAccessLogDTO> accessLogs,
    
    LocalDateTime createdAt,
    LocalDateTime modifiedAt,
    Long version
) {
    public DocumentDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Document title cannot be null or blank");
        }
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("File name cannot be null or blank");
        }
        if (filePath == null || filePath.isBlank()) {
            throw new IllegalArgumentException("File path cannot be null or blank");
        }
        if (fileSize == null || fileSize <= 0) {
            throw new IllegalArgumentException("File size must be positive");
        }
        if (mimeType == null || mimeType.isBlank()) {
            throw new IllegalArgumentException("MIME type cannot be null or blank");
        }
        if (documentType == null) {
            throw new IllegalArgumentException("Document type cannot be null");
        }
        if (documentCategory == null) {
            throw new IllegalArgumentException("Document category cannot be null");
        }
        if (accessLevel == null) {
            throw new IllegalArgumentException("Access level cannot be null");
        }
        if (uploadedById == null) {
            throw new IllegalArgumentException("Uploaded by user ID cannot be null");
        }
        if (versionNumber == null || versionNumber <= 0) {
            throw new IllegalArgumentException("Version number must be positive");
        }
        if (approvalStatus == null) {
            throw new IllegalArgumentException("Approval status cannot be null");
        }
        if (downloadCount == null || downloadCount < 0) {
            throw new IllegalArgumentException("Download count must be zero or positive");
        }
        if (viewCount == null || viewCount < 0) {
            throw new IllegalArgumentException("View count must be zero or positive");
        }
    }
    
    public boolean isExpired() {
        return expiryDate != null && LocalDateTime.now().isAfter(expiryDate);
    }
    
    public boolean isApproved() {
        return approvalStatus == DocumentApprovalStatus.APPROVED;
    }
    
    public boolean isPending() {
        return approvalStatus == DocumentApprovalStatus.PENDING;
    }
    
    public boolean isRejected() {
        return approvalStatus == DocumentApprovalStatus.REJECTED;
    }
} 