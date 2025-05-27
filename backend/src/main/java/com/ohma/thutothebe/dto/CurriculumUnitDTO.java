package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

public record CurriculumUnitDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    
    String curriculumTitle,
    
    @NotBlank(message = "Unit title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,
    
    String description,
    
    @NotNull(message = "Unit order is required")
    Integer unitOrder,
    
    Integer durationWeeks,
    
    Integer allocatedHours,
    
    String learningObjectives,
    
    String assessmentCriteria,
    
    Set<Long> topicIds,
    
    Set<String> topicTitles,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CurriculumUnitDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (unitOrder != null && unitOrder <= 0) {
            throw new IllegalArgumentException("Unit order must be positive");
        }
        if (durationWeeks != null && durationWeeks <= 0) {
            throw new IllegalArgumentException("Duration weeks must be positive");
        }
        if (allocatedHours != null && allocatedHours < 0) {
            throw new IllegalArgumentException("Allocated hours cannot be negative");
        }
    }
} 