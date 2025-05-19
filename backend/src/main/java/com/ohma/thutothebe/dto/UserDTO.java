package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.enums.Gender;
import com.ohma.thutothebe.enums.Nationality;
import com.ohma.thutothebe.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDTO {
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotNull(message = "Role is required")
    private UserRole role;

    private Long schoolId;

    // Person fields
    @NotBlank(message = "Surname is required")
    @Size(min = 2, max = 50, message = "Surname must be between 2 and 50 characters")
    private String surname;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Nationality is required")
    private Nationality nationality;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    // Identity document fields - one of these must be provided based on age
    private String identityNumber;
    private String birthCertificateNumber;

    // Additional fields for teachers
    private String qualification;

    // Additional fields for students
    private Long parentId;
} 