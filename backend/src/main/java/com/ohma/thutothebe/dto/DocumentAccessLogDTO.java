package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.DocumentAccessType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DocumentAccessLogDTO(
    Long id,
    
    @NotNull(message = "Document ID is required")
    Long documentId,
    
    String documentTitle,
    
    @NotNull(message = "User ID is required")
    Long userId,
    
    String userName,
    
    @NotNull(message = "Access type is required")
    DocumentAccessType accessType,
    
    @NotNull(message = "Accessed at is required")
    LocalDateTime accessedAt,
    
    String ipAddress,
    String userAgent,
    String sessionId,
    
    boolean success,
    String errorMessage,
    
    LocalDateTime createdAt,
    LocalDateTime modifiedAt,
    Long version
) {
    public DocumentAccessLogDTO {
        if (documentId == null) {
            throw new IllegalArgumentException("Document ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (accessType == null) {
            throw new IllegalArgumentException("Access type cannot be null");
        }
        if (accessedAt == null) {
            throw new IllegalArgumentException("Accessed at cannot be null");
        }
    }
} 