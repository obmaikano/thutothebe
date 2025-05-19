package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.PersonDTO;
import com.ohma.thutothebe.entity.Person;

public interface PersonService extends BaseService<Person, PersonDTO, Long> {
    PersonDTO getPersonByIdentityNumber(String identityNumber);
    PersonDTO getPersonByPassportNumber(String passportNumber);
    PersonDTO getPersonByBirthCertificateNumber(String birthCertificateNumber);
    boolean existsByIdentityNumber(String identityNumber);
    boolean existsByPassportNumber(String passportNumber);
    boolean existsByBirthCertificateNumber(String birthCertificateNumber);
} 