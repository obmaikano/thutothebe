package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.time.LocalDateTime;

public record CreateCurriculumProgressRequest(
    @NotNull(message = "Student ID is required")
    Long studentId,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    
    @NotNull(message = "Course ID is required")
    Long courseId,
    
    @Min(value = 0, message = "Progress percentage must be between 0 and 100")
    @Max(value = 100, message = "Progress percentage must be between 0 and 100")
    Integer progressPercentage,
    
    @Min(value = 0, message = "Completed lessons must be non-negative")
    Integer completedLessons,
    
    @Min(value = 0, message = "Total lessons must be non-negative")
    Integer totalLessons,
    
    @Min(value = 0, message = "Completed assessments must be non-negative")
    Integer completedAssessments,
    
    @Min(value = 0, message = "Total assessments must be non-negative")
    Integer totalAssessments,
    
    LocalDateTime startDate,
    
    LocalDateTime lastActivityDate,
    
    String status,
    
    String notes
) {
    public CreateCurriculumProgressRequest {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (curriculumId == null) {
            throw new IllegalArgumentException("Curriculum ID cannot be null");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (progressPercentage != null && (progressPercentage < 0 || progressPercentage > 100)) {
            throw new IllegalArgumentException("Progress percentage must be between 0 and 100");
        }
        if (completedLessons != null && completedLessons < 0) {
            throw new IllegalArgumentException("Completed lessons must be non-negative");
        }
        if (totalLessons != null && totalLessons < 0) {
            throw new IllegalArgumentException("Total lessons must be non-negative");
        }
        if (completedAssessments != null && completedAssessments < 0) {
            throw new IllegalArgumentException("Completed assessments must be non-negative");
        }
        if (totalAssessments != null && totalAssessments < 0) {
            throw new IllegalArgumentException("Total assessments must be non-negative");
        }
    }
} 