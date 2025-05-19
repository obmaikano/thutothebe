package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.PersonDTO;
import com.ohma.thutothebe.entity.Person;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.PersonMapper;
import com.ohma.thutothebe.repository.PersonRepository;
import com.ohma.thutothebe.service.PersonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class PersonServiceImpl extends BaseServiceImpl<Person, PersonDTO, Long> implements PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    public PersonServiceImpl(PersonRepository personRepository, PersonMapper personMapper) {
        super(personRepository);
        this.personRepository = personRepository;
        this.personMapper = personMapper;
    }

    @Override
    protected PersonDTO mapToDto(Person entity) {
        return personMapper.toDto(entity);
    }

    @Override
    protected Person mapToEntity(PersonDTO dto) {
        return personMapper.toEntity(dto);
    }

    @Override
    protected void updateEntity(Person entity, PersonDTO dto) {
        entity.setFirstName(dto.firstName());
        entity.setSurname(dto.surname());
        entity.setPassportNumber(dto.passportNumber());
        entity.setIdentityNumber(dto.identityNumber());
        entity.setGender(dto.gender());
        entity.setBirthCertificateNumber(dto.birthCertificateNumber());
        entity.setBirthRegistrationNumber(dto.birthRegistrationNumber());
        entity.setNationality(dto.nationality());
        entity.setDateOfBirth(dto.dateOfBirth());
    }

    @Override
    @Transactional(readOnly = true)
    public PersonDTO getPersonByIdentityNumber(String identityNumber) {
        log.debug("Finding person by identity number: {}", identityNumber);
        return personRepository.findByIdentityNumber(identityNumber)
                .map(personMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with identity number: " + identityNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public PersonDTO getPersonByPassportNumber(String passportNumber) {
        log.debug("Finding person by passport number: {}", passportNumber);
        return personRepository.findByPassportNumber(passportNumber)
                .map(personMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with passport number: " + passportNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public PersonDTO getPersonByBirthCertificateNumber(String birthCertificateNumber) {
        log.debug("Finding person by birth certificate number: {}", birthCertificateNumber);
        return personRepository.findByBirthCertificateNumber(birthCertificateNumber)
                .map(personMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with birth certificate number: " + birthCertificateNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByIdentityNumber(String identityNumber) {
        return personRepository.existsByIdentityNumber(identityNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPassportNumber(String passportNumber) {
        return personRepository.existsByPassportNumber(passportNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByBirthCertificateNumber(String birthCertificateNumber) {
        return personRepository.existsByBirthCertificateNumber(birthCertificateNumber);
    }
} 