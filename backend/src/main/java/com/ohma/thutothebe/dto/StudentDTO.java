package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StudentDTO(
    Long id,
    
    @NotBlank(message = "Student ID is required")
    @Size(min = 3, max = 20, message = "Student ID must be between 3 and 20 characters")
    String studentId,
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    String firstName,
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    String lastName,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    String email,
    
    @NotNull(message = "School ID is required")
    Long schoolId,
    
    Long userId,
    
    boolean active
) {
    public StudentDTO {
        if (studentId != null) {
            studentId = studentId.toUpperCase();
        }
        if (email != null) {
            email = email.toLowerCase();
        }
    }
} 