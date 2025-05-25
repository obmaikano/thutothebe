package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AnnouncementAcknowledgmentDTO(
    Long id,
    
    @NotNull(message = "Announcement ID is required")
    Long announcementId,
    
    String announcementTitle,
    
    @NotNull(message = "User ID is required")
    Long userId,
    
    String userName,
    
    @NotNull(message = "Acknowledgment time is required")
    LocalDateTime acknowledgedAt,
    
    String acknowledgmentNote,
    
    LocalDateTime createdAt
) {
    public AnnouncementAcknowledgmentDTO {
        if (announcementId != null && announcementId <= 0) {
            throw new IllegalArgumentException("Announcement ID must be positive");
        }
        if (userId != null && userId <= 0) {
            throw new IllegalArgumentException("User ID must be positive");
        }
    }
} 