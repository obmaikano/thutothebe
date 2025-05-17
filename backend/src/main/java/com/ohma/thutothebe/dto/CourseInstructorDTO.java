package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseInstructorDTO(
    Long id,
    
    @NotNull(message = "Course ID is required")
    Long courseId,
    
    @NotNull(message = "Teacher ID is required")
    Long teacherId,
    
    boolean isPrimary,
    
    @Size(max = 200, message = "Notes cannot exceed 200 characters")
    String notes
) {
    public CourseInstructorDTO {
        // Validation logic if needed
    }
} 