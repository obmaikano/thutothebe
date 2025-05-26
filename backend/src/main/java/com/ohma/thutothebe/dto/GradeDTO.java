package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.GradeType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record GradeDTO(
    Long id,
    
    @NotNull(message = "Student ID is required")
    Long studentId,
    
    @NotNull(message = "Course ID is required")
    Long courseId,
    
    Long gradeCategoryId,
    
    Long assessmentId,
    
    Long assignmentId,
    
    @NotNull(message = "Grade type is required")
    GradeType gradeType,
    
    @NotNull(message = "Score is required")
    @DecimalMin(value = "0.0", message = "Score cannot be negative")
    @DecimalMax(value = "100.0", message = "Score cannot exceed 100")
    Double score,
    
    @DecimalMin(value = "0.0", message = "Max score cannot be negative")
    @DecimalMax(value = "100.0", message = "Max score cannot exceed 100")
    Double maxScore,
    
    @DecimalMin(value = "0.0", message = "Weight cannot be negative")
    Double weight,
    
    String feedback,
    
    @NotNull(message = "Graded by user ID is required")
    Long gradedById,
    
    LocalDateTime gradedAt,
    
    boolean isFinal,
    
    boolean isModerated,
    
    Long moderatedById,
    
    LocalDateTime moderatedAt,
    
    String moderationNotes,
    
    Double originalScore,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public GradeDTO {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (gradeType == null) {
            throw new IllegalArgumentException("Grade type cannot be null");
        }
        if (score == null) {
            throw new IllegalArgumentException("Score cannot be null");
        }
        if (gradedById == null) {
            throw new IllegalArgumentException("Graded by user ID cannot be null");
        }
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Score must be between 0 and 100");
        }
        if (maxScore != null && (maxScore < 0 || maxScore > 100)) {
            throw new IllegalArgumentException("Max score must be between 0 and 100");
        }
        if (weight != null && weight < 0) {
            throw new IllegalArgumentException("Weight cannot be negative");
        }
        if (originalScore != null && (originalScore < 0 || originalScore > 100)) {
            throw new IllegalArgumentException("Original score must be between 0 and 100");
        }
    }
} 