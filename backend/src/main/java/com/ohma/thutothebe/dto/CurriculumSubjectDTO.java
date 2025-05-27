package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CurriculumSubjectDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    
    String curriculumTitle,
    
    @NotNull(message = "Subject ID is required")
    Long subjectId,
    
    String subjectName,
    
    String subjectCode,
    
    boolean isCore,
    
    Integer allocatedHours,
    
    Double weightPercentage,
    
    String objectives,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CurriculumSubjectDTO {
        if (allocatedHours != null && allocatedHours < 0) {
            throw new IllegalArgumentException("Allocated hours cannot be negative");
        }
        if (weightPercentage != null && (weightPercentage < 0 || weightPercentage > 100)) {
            throw new IllegalArgumentException("Weight percentage must be between 0 and 100");
        }
    }
} 