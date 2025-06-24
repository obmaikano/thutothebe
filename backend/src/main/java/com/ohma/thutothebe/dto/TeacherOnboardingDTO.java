package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.Nationality;
import com.ohma.thutothebe.entity.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TeacherOnboardingDTO(
    // Teacher information
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
    
    @NotNull(message = "School ID is required")
    Long schoolId,
    
    // Identity information
    @NotBlank(message = "Identity number is required")
    @Size(min = 9, max = 13, message = "Identity number must be between 9 and 13 characters")
    String identityNumber,
    
    @NotNull(message = "Nationality is required")
    Nationality nationality,
    
    @NotNull(message = "Gender is required")
    Gender gender,
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth,
    
    // User account information
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password,
    
    boolean active
) {
    public TeacherOnboardingDTO {
        if (staffId != null) {
            staffId = staffId.toUpperCase();
        }
        if (email != null) {
            email = email.toLowerCase();
        }
        if (username != null) {
            username = username.toLowerCase();
        }
        if (identityNumber != null) {
            identityNumber = identityNumber.trim();
        }
    }
} 