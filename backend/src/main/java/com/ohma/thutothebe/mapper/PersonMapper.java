package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.PersonDTO;
import com.ohma.thutothebe.entity.Person;
import org.springframework.stereotype.Component;

@Component
public class PersonMapper implements BaseDtoMapper<Person, PersonDTO> {

    @Override
    public PersonDTO toDto(Person entity) {
        if (entity == null) {
            return null;
        }

        return new PersonDTO(
            entity.getId(),
            entity.getFirstName(),
            entity.getSurname(),
            entity.getPassportNumber(),
            entity.getIdentityNumber(),
            entity.getGender(),
            entity.getBirthCertificateNumber(),
            entity.getBirthRegistrationNumber(),
            entity.getNationality(),
            entity.getDateOfBirth(),
            entity.getUser() != null ? entity.getUser().getRole() : null
        );
    }

    @Override
    public Person toEntity(PersonDTO dto) {
        if (dto == null) {
            return null;
        }

        Person person = new Person();
        person.setId(dto.id());
        person.setFirstName(dto.firstName());
        person.setSurname(dto.surname());
        person.setPassportNumber(dto.passportNumber());
        person.setIdentityNumber(dto.identityNumber());
        person.setGender(dto.gender());
        person.setBirthCertificateNumber(dto.birthCertificateNumber());
        person.setBirthRegistrationNumber(dto.birthRegistrationNumber());
        person.setNationality(dto.nationality());
        person.setDateOfBirth(dto.dateOfBirth());
        
        return person;
    }
} 