package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.CurriculumResource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record CurriculumResourceDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    String curriculumTitle,
    
    Long curriculumUnitId,
    String curriculumUnitTitle,
    
    Long curriculumTopicId,
    String curriculumTopicTitle,
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title,
    
    String description,
    
    @NotNull(message = "Resource type is required")
    CurriculumResource.ResourceType resourceType,
    
    @NotBlank(message = "URL is required")
    String url,
    
    String fileName,
    Long fileSize,
    String mimeType,
    String thumbnailUrl,
    Integer durationMinutes,
    String language,
    List<String> accessibilityFeatures,
    List<String> tags,
    String metadata,
    
    @NotNull(message = "Uploaded by ID is required")
    Long uploadedById,
    String uploadedByName,
    
    LocalDateTime uploadedAt,
    LocalDateTime lastAccessedAt,
    Long accessCount,
    Long downloadCount,
    boolean isPublic,
    boolean requiresAuthentication,
    String copyrightInfo,
    String licenseType,
    String externalId,
    String checksum,
    boolean isActive
) {
    public CurriculumResourceDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (url != null && url.isBlank()) {
            throw new IllegalArgumentException("URL cannot be blank");
        }
        if (fileSize != null && fileSize < 0) {
            throw new IllegalArgumentException("File size cannot be negative");
        }
        if (accessCount == null) {
            accessCount = 0L;
        }
        if (downloadCount == null) {
            downloadCount = 0L;
        }
    }
} 