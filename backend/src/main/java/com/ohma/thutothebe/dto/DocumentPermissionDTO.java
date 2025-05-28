package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.DocumentPermissionType;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DocumentPermissionDTO(
    Long id,
    
    @NotNull(message = "Document ID is required")
    Long documentId,
    
    String documentTitle,
    
    @NotNull(message = "User role is required")
    UserRole userRole,
    
    @NotNull(message = "Permission type is required")
    DocumentPermissionType permissionType,
    
    Long specificUserId,
    String specificUserName,
    
    Long schoolId,
    String schoolName,
    
    Long regionId,
    String regionName,
    
    Long classId,
    String className,
    
    Long courseId,
    String courseName,
    
    boolean active,
    
    LocalDateTime createdAt,
    LocalDateTime modifiedAt,
    Long version
) {
    public DocumentPermissionDTO {
        if (documentId == null) {
            throw new IllegalArgumentException("Document ID cannot be null");
        }
        if (userRole == null) {
            throw new IllegalArgumentException("User role cannot be null");
        }
        if (permissionType == null) {
            throw new IllegalArgumentException("Permission type cannot be null");
        }
    }
} 