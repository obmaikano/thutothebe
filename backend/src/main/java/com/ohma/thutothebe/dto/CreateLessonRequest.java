package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record CreateLessonRequest(
    @NotBlank(message = "Lesson title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,
    
    String description,
    
    @NotNull(message = "Course ID is required")
    Long courseId,
    
    @NotNull(message = "Instructor ID is required")
    Long instructorId,
    
    @NotNull(message = "Lesson order is required")
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
    
    List<String> learningOutcomes
) {
    public CreateLessonRequest {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Lesson title cannot be null or empty");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (instructorId == null) {
            throw new IllegalArgumentException("Instructor ID cannot be null");
        }
        if (lessonOrder == null || lessonOrder < 0) {
            throw new IllegalArgumentException("Lesson order must be non-negative");
        }
    }
} 