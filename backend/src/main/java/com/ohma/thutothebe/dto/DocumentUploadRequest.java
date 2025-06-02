package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.DocumentAccessLevel;
import com.ohma.thutothebe.entity.DocumentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for document upload requests
 * This DTO is used for file upload operations and doesn't have strict validation
 * for file-related fields that will be populated from the uploaded file
 */
public record DocumentUploadRequest(
    @NotBlank(message = "Document title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title,
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description,
    
    @NotNull(message = "Document category is required")
    DocumentCategory documentCategory,
    
    @NotNull(message = "Access level is required")
    DocumentAccessLevel accessLevel,
    
    @NotNull(message = "Uploaded by user is required")
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
    // No strict validation for file-related fields in constructor
    // File name, path, size, mime type, etc. will be populated from the uploaded file
} 