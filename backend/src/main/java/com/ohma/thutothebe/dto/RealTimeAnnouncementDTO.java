package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AnnouncementType;
import com.ohma.thutothebe.entity.AnnouncementPriority;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record RealTimeAnnouncementDTO(
    @NotNull
    Long id,
    
    @NotBlank
    String title,
    
    @NotBlank
    String content,
    
    @NotNull
    AnnouncementType type,
    
    @NotNull
    AnnouncementPriority priority,
    
    @NotNull
    Long creatorId,
    
    String creatorName,
    
    @NotNull
    UserRole creatorRole,
    
    Long targetRegionId,
    String targetRegionName,
    
    Long targetSchoolId,
    String targetSchoolName,
    
    UserRole targetRole,
    String targetDepartment,
    String targetClass,
    
    LocalDateTime startDate,
    LocalDateTime endDate,
    
    boolean commentsEnabled,
    boolean acknowledgmentRequired,
    
    List<String> attachmentUrls,
    List<String> tags,
    
    @NotNull
    LocalDateTime createdAt,
    
    // Real-time specific fields
    @NotNull
    String eventType, // "CREATED", "UPDATED", "DELETED", "ACTIVATED", "DEACTIVATED"
    
    @NotNull
    String groupId, // Target group for WebSocket subscription
    
    String message // Optional notification message
) {
    public RealTimeAnnouncementDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (content != null && content.isBlank()) {
            throw new IllegalArgumentException("Content cannot be blank");
        }
        if (eventType != null && eventType.isBlank()) {
            throw new IllegalArgumentException("Event type cannot be blank");
        }
        if (groupId != null && groupId.isBlank()) {
            throw new IllegalArgumentException("Group ID cannot be blank");
        }
    }
} 