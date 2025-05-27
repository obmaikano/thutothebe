package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CurriculumTeacherDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    
    String curriculumTitle,
    
    @NotNull(message = "Teacher ID is required")
    Long teacherId,
    
    String teacherName,
    
    Long subjectId,
    
    String subjectName,
    
    @NotNull(message = "Assigned date is required")
    LocalDate assignedDate,
    
    boolean isPrimary,
    
    Double responsibilityPercentage,
    
    String notes,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CurriculumTeacherDTO {
        if (responsibilityPercentage != null && (responsibilityPercentage < 0 || responsibilityPercentage > 100)) {
            throw new IllegalArgumentException("Responsibility percentage must be between 0 and 100");
        }
        if (assignedDate != null && assignedDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Assigned date cannot be in the future");
        }
    }
} 