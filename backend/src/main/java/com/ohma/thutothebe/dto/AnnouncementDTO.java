package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AnnouncementType;
import com.ohma.thutothebe.entity.AnnouncementPriority;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record AnnouncementDTO(
    Long id,
    
    @NotBlank(message = "Title is required")
    String title,
    
    @NotBlank(message = "Content is required")
    String content,
    
    @NotNull(message = "Type is required")
    AnnouncementType type,
    
    @NotNull(message = "Priority is required")
    AnnouncementPriority priority,
    
    @NotNull(message = "Creator ID is required")
    Long creatorId,
    
    String creatorName,
    
    @NotNull(message = "Creator role is required")
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
    
    boolean active,
    
    LocalDateTime createdAt,
    LocalDateTime modifiedAt,
    
    // Read receipt and acknowledgment counts
    Long readCount,
    Long acknowledgmentCount,
    Long targetUserCount,
    
    // User-specific flags
    Boolean isRead,
    Boolean isAcknowledged
) {
    public AnnouncementDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (content != null && content.isBlank()) {
            throw new IllegalArgumentException("Content cannot be blank");
        }
        if (priority == null) {
            priority = AnnouncementPriority.NORMAL;
        }
    }
} 