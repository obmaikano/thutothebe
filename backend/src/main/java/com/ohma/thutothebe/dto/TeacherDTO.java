package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TeacherDTO(
    Long id,
    
    @NotBlank(message = "Staff ID is required")
    @Size(min = 3, max = 20, message = "Staff ID must be between 3 and 20 characters")
    String staffId,
    
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
    
    @Size(max = 200, message = "Qualification cannot exceed 200 characters")
    String qualification,
    
    boolean active
) {
    public TeacherDTO {
        if (staffId != null) {
            staffId = staffId.toUpperCase();
        }
        if (email != null) {
            email = email.toLowerCase();
        }
    }
} 