package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.PersonDTO;

public interface PersonService extends BaseService<PersonDTO, Long> {
    PersonDTO getPersonByIdentityNumber(String identityNumber);
    PersonDTO getPersonByBirthCertificateNumber(String birthCertificateNumber);
    PersonDTO getPersonByPassportNumber(String passportNumber);
    boolean existsByIdentityNumber(String identityNumber);
    boolean existsByBirthCertificateNumber(String birthCertificateNumber);
    boolean existsByPassportNumber(String passportNumber);
} 