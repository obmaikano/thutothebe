package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.entity.Nationality;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Data
@Entity
@Table(name = "persons")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class Person extends BaseEntity {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Surname is required")
    @Size(min = 2, max = 50, message = "Surname must be between 2 and 50 characters")
    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "identity_number")
    @EqualsAndHashCode.Include
    private String identityNumber;

    @NotNull(message = "Gender is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(name = "birth_certificate_number")
    @EqualsAndHashCode.Include
    private String birthCertificateNumber;

    @Column(name = "birth_registration_number")
    private String birthRegistrationNumber;

    @NotNull(message = "Nationality is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nationality nationality;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
    private Set<User> users = new HashSet<>();

    public int getAge() {
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }

    // Override hashCode and equals to prevent circular references
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person that = (Person) o;
        return Objects.equals(getId(), that.getId()) && 
               Objects.equals(identityNumber, that.identityNumber) &&
               Objects.equals(birthCertificateNumber, that.birthCertificateNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), identityNumber, birthCertificateNumber);
    }
} 