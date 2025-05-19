package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.StudentMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class StudentMapperImpl implements StudentMapper {

    private final UserRepository userRepository;

    private final SchoolRepository schoolRepository;

    public StudentMapperImpl(UserRepository userRepository, SchoolRepository schoolRepository) {
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
    }

    @Override
    public Student toEntity(StudentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Student student = new Student();
        student.setId(dto.id());
        student.setStudentId(dto.studentId());
        student.setFirstName(dto.firstName());
        student.setLastName(dto.lastName());
        student.setEmail(dto.email());
        student.setActive(dto.active());
        student.setSchool(dto.schoolId() != null ? schoolRepository.findById(dto.schoolId()).get() : null);
        student.setUser(dto.userId() != null ? userRepository.findById(dto.userId()).get() : null);
        return student;
    }

    @Override
    public StudentDTO toDto(Student entity) {
        if (entity == null) {
            return null;
        }
        
        return new StudentDTO(
            entity.getId(),
            entity.getStudentId(),
            entity.getFirstName(),
            entity.getLastName(),
            entity.getEmail(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.isActive()
        );
    }
} 