package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CurriculumTopicDTO(
    Long id,
    
    @NotNull(message = "Curriculum unit ID is required")
    Long curriculumUnitId,
    
    String curriculumUnitTitle,
    
    @NotBlank(message = "Topic title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,
    
    String description,
    
    @NotNull(message = "Topic order is required")
    Integer topicOrder,
    
    Integer durationHours,
    
    String learningObjectives,
    
    String activities,
    
    String resources,
    
    String assessmentMethods,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CurriculumTopicDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (topicOrder != null && topicOrder <= 0) {
            throw new IllegalArgumentException("Topic order must be positive");
        }
        if (durationHours != null && durationHours < 0) {
            throw new IllegalArgumentException("Duration hours cannot be negative");
        }
    }
} 