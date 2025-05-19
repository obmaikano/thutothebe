package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.entity.Nationality;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PersonDTO(
    Long id,
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName,
    
    @NotBlank(message = "Surname is required")
    @Size(min = 2, max = 50, message = "Surname must be between 2 and 50 characters")
    String surname,
    
    String passportNumber,
    
    String identityNumber,
    
    @NotNull(message = "Gender is required")
    Gender gender,
    
    String birthCertificateNumber,
    
    String birthRegistrationNumber,
    
    @NotNull(message = "Nationality is required")
    Nationality nationality,
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth,
    
    UserRole role
) {
    public PersonDTO {
        if (firstName != null) firstName = firstName.trim();
        if (surname != null) surname = surname.trim();
        
        // Validate identification based on role and age
        if (role != null) {
            int age = LocalDate.now().getYear() - dateOfBirth.getYear();
            
            if (role == UserRole.STUDENT) {
                if (age < 16 && birthCertificateNumber == null) {
                    throw new IllegalArgumentException("Birth certificate number is required for students under 16");
                }
                if (age >= 16 && identityNumber == null) {
                    throw new IllegalArgumentException("Identity number is required for students 16 and older");
                }
            } else {
                if (nationality == Nationality.CITIZEN && identityNumber == null) {
                    throw new IllegalArgumentException("Identity number is required for citizens");
                }
                if (nationality != Nationality.CITIZEN && passportNumber == null) {
                    throw new IllegalArgumentException("Passport number is required for non-citizens");
                }
            }
        }
    }
} 