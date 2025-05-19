package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserDTO(
    Long id,
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName,
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    String lastName,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,
    
    @NotNull(message = "Role is required")
    UserRole role,
    
    @NotNull(message = "School ID is required for teachers and students")
    Long schoolId
) {
    public UserDTO {
        if (firstName != null) firstName = firstName.trim();
        if (lastName != null) lastName = lastName.trim();
        if (email != null) email = email.trim();
        
        // Validate school ID is provided for teachers and students
        if ((role == UserRole.TEACHER || role == UserRole.STUDENT) && schoolId == null) {
            throw new IllegalArgumentException("School ID is required for teachers and students");
        }
    }
} 