package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.List;

public record CurriculumVersionDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    String curriculumTitle,
    
    @NotNull(message = "Version number is required")
    @Positive(message = "Version number must be positive")
    Integer versionNumber,
    
    @NotBlank(message = "Version name is required")
    String versionName,
    
    String description,
    String snapshotData,
    
    @NotNull(message = "Created by ID is required")
    Long createdById,
    String createdByName,
    
    LocalDateTime createdAt,
    String changeSummary,
    boolean isMajorVersion,
    boolean isCurrent,
    List<String> tags,
    String filePath,
    String checksum
) {
    public CurriculumVersionDTO {
        if (versionName != null && versionName.isBlank()) {
            throw new IllegalArgumentException("Version name cannot be blank");
        }
        if (versionNumber != null && versionNumber <= 0) {
            throw new IllegalArgumentException("Version number must be positive");
        }
    }
} 