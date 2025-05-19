package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.entity.enums.StudentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Set;

public record StudentDTO(
    Long id,
    
    @NotBlank(message = "Admission number is required")
    @Size(min = 3, max = 20, message = "Admission number must be between 3 and 20 characters")
    String admissionNumber,
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    String firstName,
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    String lastName,
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth,
    
    @NotNull(message = "Gender is required")
    Gender gender,
    
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 20, message = "Phone number must be between 10 and 20 characters")
    String phone,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    String email,
    
    String address,
    
    @NotNull(message = "Academic year is required")
    Integer academicYear,
    
    @NotNull(message = "Class ID is required")
    Long classId,
    
    String medicalConditions,
    
    String disabilities,
    
    @NotBlank(message = "Emergency contact name is required")
    String emergencyContactName,
    
    @NotBlank(message = "Emergency contact phone is required")
    String emergencyContactPhone,
    
    @NotBlank(message = "Emergency contact relation is required")
    String emergencyContactRelation,
    
    @NotNull(message = "School ID is required")
    Long schoolId,
    
    Long userId,
    
    Long personId,
    
    boolean active,
    
    StudentStatus status,
    
    String onboardingNotes,
    
    Set<Long> subjectIds
) {
    public StudentDTO {
        if (admissionNumber != null) {
            admissionNumber = admissionNumber.toUpperCase();
        }
        if (email != null) {
            email = email.toLowerCase();
        }
    }
} 