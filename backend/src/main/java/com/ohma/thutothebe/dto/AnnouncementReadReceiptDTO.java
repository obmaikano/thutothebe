package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AnnouncementReadReceiptDTO(
    Long id,
    
    @NotNull(message = "Announcement ID is required")
    Long announcementId,
    
    String announcementTitle,
    
    @NotNull(message = "User ID is required")
    Long userId,
    
    String userName,
    
    @NotNull(message = "Read time is required")
    LocalDateTime readAt,
    
    LocalDateTime createdAt
) {
    public AnnouncementReadReceiptDTO {
        if (announcementId != null && announcementId <= 0) {
            throw new IllegalArgumentException("Announcement ID must be positive");
        }
        if (userId != null && userId <= 0) {
            throw new IllegalArgumentException("User ID must be positive");
        }
    }
} 