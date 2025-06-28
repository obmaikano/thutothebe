package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.Lesson;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record LessonDTO(
    Long id,
    
    @NotNull(message = "Lesson title is required")
    String title,
    
    String description,
    
    @NotNull(message = "Course ID is required")
    Long courseId,
    
    String courseName,
    
    @NotNull(message = "Instructor ID is required")
    Long instructorId,
    
    String instructorName,
    
    @NotNull(message = "Lesson order is required")
    Integer lessonOrder,
    
    Integer durationMinutes,
    
    Integer estimatedDurationMinutes,
    
    LocalDateTime scheduledDate,
    
    LocalDateTime completedDate,
    
    @NotNull(message = "Lesson status is required")
    Lesson.LessonStatus status,
    
    String objectives,
    
    String materials,
    
    String activities,
    
    String assessment,
    
    String notes,
    
    boolean isMandatory,
    
    List<Long> prerequisites,
    
    List<String> learningOutcomes,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public LessonDTO {
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
        if (status == null) {
            throw new IllegalArgumentException("Lesson status cannot be null");
        }
    }
} 