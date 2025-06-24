package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record StaffDTO(
    Long id,
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,
    
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
    
    @NotNull(message = "Role is required")
    UserRole role,
    
    String qualification,
    
    String staffId,
    
    Long schoolId,
    
    Long regionId,
    
    boolean active,
    
    boolean isTeacher,
    
    LocalDateTime lastLoginTime,
    
    LocalDateTime createdAt,
    
    LocalDateTime updatedAt
) {
    public StaffDTO {
        if (email != null) {
            email = email.toLowerCase();
        }
        if (username != null) {
            username = username.toLowerCase();
        }
    }
} 