package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.ImplementationStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CurriculumProgressDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    
    String curriculumTitle,
    
    Long schoolId,
    
    String schoolName,
    
    Long classId,
    
    String className,
    
    Long teacherId,
    
    String teacherName,
    
    @NotNull(message = "Implementation status is required")
    ImplementationStatus implementationStatus,
    
    Double progressPercentage,
    
    LocalDate startDate,
    
    LocalDate expectedCompletionDate,
    
    LocalDate actualCompletionDate,
    
    @NotNull(message = "Last updated date is required")
    LocalDate lastUpdatedDate,
    
    @NotNull(message = "Updated by is required")
    Long updatedById,
    
    String updatedByName,
    
    String notes,
    
    String challenges,
    
    String achievements,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CurriculumProgressDTO {
        if (progressPercentage != null && (progressPercentage < 0 || progressPercentage > 100)) {
            throw new IllegalArgumentException("Progress percentage must be between 0 and 100");
        }
        if (startDate != null && expectedCompletionDate != null && startDate.isAfter(expectedCompletionDate)) {
            throw new IllegalArgumentException("Start date cannot be after expected completion date");
        }
        if (actualCompletionDate != null && startDate != null && actualCompletionDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Actual completion date cannot be before start date");
        }
        if (implementationStatus == null) {
            implementationStatus = ImplementationStatus.NOT_STARTED;
        }
        if (progressPercentage == null) {
            progressPercentage = 0.0;
        }
    }
} 