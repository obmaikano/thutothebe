package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByIdentityNumber(String identityNumber);
    Optional<Person> findByPassportNumber(String passportNumber);
    Optional<Person> findByBirthCertificateNumber(String birthCertificateNumber);
    boolean existsByIdentityNumber(String identityNumber);
    boolean existsByPassportNumber(String passportNumber);
    boolean existsByBirthCertificateNumber(String birthCertificateNumber);
} 