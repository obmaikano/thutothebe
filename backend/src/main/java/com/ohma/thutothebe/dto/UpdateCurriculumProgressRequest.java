package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.time.LocalDateTime;

public record UpdateCurriculumProgressRequest(
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
    
    String notes,
    
    Boolean active
) {
    public UpdateCurriculumProgressRequest {
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