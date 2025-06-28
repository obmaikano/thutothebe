package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.LessonCompletion;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record LessonCompletionDTO(
    Long id,
    
    @NotNull(message = "Lesson ID is required")
    Long lessonId,
    
    String lessonTitle,
    
    @NotNull(message = "Student ID is required")
    Long studentId,
    
    String studentName,
    
    @NotNull(message = "Completion status is required")
    LessonCompletion.CompletionStatus completionStatus,
    
    LocalDateTime startedAt,
    
    LocalDateTime completedAt,
    
    Integer timeSpentMinutes,
    
    Double completionPercentage,
    
    Double score,
    
    Double maxScore,
    
    String feedback,
    
    String notes,
    
    boolean attendedInPerson,
    
    boolean participatedActively,
    
    boolean completedAssignments,
    
    boolean understoodContent,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public LessonCompletionDTO {
        if (lessonId == null) {
            throw new IllegalArgumentException("Lesson ID cannot be null");
        }
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (completionStatus == null) {
            throw new IllegalArgumentException("Completion status cannot be null");
        }
        if (completionPercentage != null && (completionPercentage < 0 || completionPercentage > 100)) {
            throw new IllegalArgumentException("Completion percentage must be between 0 and 100");
        }
        if (score != null && (score < 0 || score > 100)) {
            throw new IllegalArgumentException("Score must be between 0 and 100");
        }
    }
} 