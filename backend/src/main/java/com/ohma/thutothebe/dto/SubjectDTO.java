package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubjectDTO(
    Long id,
    
    @NotBlank(message = "Subject code is required")
    @Size(min = 2, max = 10, message = "Subject code must be between 2 and 10 characters")
    String code,
    
    @NotBlank(message = "Subject name is required")
    @Size(min = 3, max = 100, message = "Subject name must be between 3 and 100 characters")
    String name,
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description,
    
    boolean active
) {
    public SubjectDTO {
        if (code != null) {
            code = code.toUpperCase();
        }
    }
} 