package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for updating curriculum subject details
 */
public record UpdateCurriculumSubjectRequest(
    @NotNull(message = "Core status is required")
    Boolean isCore,
    
    @Min(value = 1, message = "Allocated hours must be at least 1")
    Integer allocatedHours,
    
    @DecimalMin(value = "0.0", message = "Weight percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "Weight percentage must not exceed 100")
    Double weightPercentage,
    
    String objectives
) {
    public UpdateCurriculumSubjectRequest {
        if (isCore == null) {
            throw new IllegalArgumentException("Core status cannot be null");
        }
        
        if (allocatedHours != null && allocatedHours < 1) {
            throw new IllegalArgumentException("Allocated hours must be at least 1");
        }
        
        if (weightPercentage != null && (weightPercentage < 0.0 || weightPercentage > 100.0)) {
            throw new IllegalArgumentException("Weight percentage must be between 0 and 100");
        }
    }
} 