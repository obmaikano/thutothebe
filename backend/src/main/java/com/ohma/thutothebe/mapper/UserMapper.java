package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Person;
import com.ohma.thutothebe.entity.enums.Gender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserMapper implements BaseDtoMapper<User, UserDTO> {

    @Override
    public UserDTO toDto(User entity) {
        if (entity == null) return null;

        UserDTO dto = new UserDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPassword(entity.getPassword());
        dto.setRole(entity.getRole());
        dto.setSchoolId(entity.getSchool() != null ? entity.getSchool().getId() : null);
        dto.setQualification(entity.getQualification());

        if (entity.getPerson() != null) {
            Person person = entity.getPerson();
            dto.setSurname(person.getSurname());
            dto.setGender(person.getGender());
            dto.setNationality(person.getNationality());
            dto.setDateOfBirth(person.getDateOfBirth());
            dto.setIdentityNumber(person.getIdentityNumber());
            dto.setBirthCertificateNumber(person.getBirthCertificateNumber());
        }

        return dto;
    }

    @Override
    public User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User entity = new User();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(User entity, UserDTO dto) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPassword(dto.getPassword());
        entity.setRole(dto.getRole());
        entity.setUsername(dto.getEmail());
        entity.setQualification(dto.getQualification());

        // Create or update Person entity
        Person person = entity.getPerson();
        if (person == null) {
            person = new Person();
            entity.setPerson(person);
        }

        person.setFirstName(dto.getFirstName());
        person.setSurname(dto.getSurname());
        person.setGender(dto.getGender());
        person.setNationality(dto.getNationality());
        person.setDateOfBirth(dto.getDateOfBirth());
        person.setIdentityNumber(dto.getIdentityNumber());
        person.setBirthCertificateNumber(dto.getBirthCertificateNumber());
    }

    /**
     * Updates an existing entity with data from the DTO
     * @param entity The entity to update
     * @param dto The DTO containing the new data
     */
    public void updateEntityFromDto(User entity, UserDTO dto) {
        updateEntity(entity, dto);
    }

} 