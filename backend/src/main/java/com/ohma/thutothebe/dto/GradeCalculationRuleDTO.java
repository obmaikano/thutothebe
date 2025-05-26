package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record GradeCalculationRuleDTO(
    Long id,
    
    @NotNull(message = "Course ID is required")
    Long courseId,
    
    @NotNull(message = "Grade type is required")
    GradeType gradeType,
    
    @NotNull(message = "Weight percentage is required")
    @DecimalMin(value = "0.0", message = "Weight percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Weight percentage cannot exceed 100")
    Double weightPercentage,
    
    @NotNull(message = "Passing grade is required")
    @DecimalMin(value = "0.0", message = "Passing grade cannot be negative")
    @DecimalMax(value = "100.0", message = "Passing grade cannot exceed 100")
    Double passingGrade,
    
    String description,
    
    boolean active,
    
    @NotNull(message = "Term is required")
    Term term,
    
    @NotNull(message = "Academic year is required")
    Integer academicYear,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public GradeCalculationRuleDTO {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (gradeType == null) {
            throw new IllegalArgumentException("Grade type cannot be null");
        }
        if (weightPercentage == null) {
            throw new IllegalArgumentException("Weight percentage cannot be null");
        }
        if (passingGrade == null) {
            throw new IllegalArgumentException("Passing grade cannot be null");
        }
        if (term == null) {
            throw new IllegalArgumentException("Term cannot be null");
        }
        if (academicYear == null) {
            throw new IllegalArgumentException("Academic year cannot be null");
        }
        if (weightPercentage < 0 || weightPercentage > 100) {
            throw new IllegalArgumentException("Weight percentage must be between 0 and 100");
        }
        if (passingGrade < 0 || passingGrade > 100) {
            throw new IllegalArgumentException("Passing grade must be between 0 and 100");
        }
        if (academicYear < 2000 || academicYear > 2100) {
            throw new IllegalArgumentException("Academic year must be between 2000 and 2100");
        }
    }
} 