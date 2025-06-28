package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record UpdateLessonRequest(
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,
    
    String description,
    
    Integer lessonOrder,
    
    Integer durationMinutes,
    
    Integer estimatedDurationMinutes,
    
    LocalDateTime scheduledDate,
    
    String objectives,
    
    String materials,
    
    String activities,
    
    String assessment,
    
    String notes,
    
    Boolean isMandatory,
    
    List<Long> prerequisites,
    
    List<String> learningOutcomes,
    
    Boolean active
) {
    public UpdateLessonRequest {
        if (title != null && title.trim().isEmpty()) {
            throw new IllegalArgumentException("Lesson title cannot be empty if provided");
        }
        if (lessonOrder != null && lessonOrder < 0) {
            throw new IllegalArgumentException("Lesson order must be non-negative");
        }
    }
} 