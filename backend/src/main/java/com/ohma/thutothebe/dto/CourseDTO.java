package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.Term;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

public record CourseDTO(
    Long id,
    
    @NotBlank(message = "Course code is required")
    @Size(min = 3, max = 20, message = "Course code must be between 3 and 20 characters")
    String code,
    
    @NotBlank(message = "Course name is required")
    @Size(min = 3, max = 100, message = "Course name must be between 3 and 100 characters")
    String name,
    
    @NotNull(message = "Subject ID is required")
    Long subjectId,
    
    @NotNull(message = "Class ID is required")
    Long classId,
    
    @NotNull(message = "Term is required")
    Term term,
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    Integer year,
    
    boolean active,
    
    Set<Long> instructorIds
) {
    public CourseDTO {
        if (code != null) {
            code = code.toUpperCase();
        }
        if (instructorIds == null) {
            instructorIds = new HashSet<>();
        }
    }
} 