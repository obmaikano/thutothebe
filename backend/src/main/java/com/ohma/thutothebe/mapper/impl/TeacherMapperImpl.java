package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.TeacherMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapperImpl implements TeacherMapper {

    private final UserRepository userRepository;

    private final SchoolRepository schoolRepository;

    public TeacherMapperImpl(UserRepository userRepository, SchoolRepository schoolRepository) {
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
    }

    @Override
    public Teacher toEntity(TeacherDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Teacher teacher = new Teacher();
        teacher.setId(dto.id());
        teacher.setStaffId(dto.staffId());
        teacher.setFirstName(dto.firstName());
        teacher.setLastName(dto.lastName());
        teacher.setEmail(dto.email());
        teacher.setQualification(dto.qualification());
        teacher.setActive(dto.active());
        teacher.setSchool(dto.schoolId() != null ? schoolRepository.findById(dto.schoolId()).get() : null);
        teacher.setUser(dto.userId() != null ? userRepository.findById(dto.userId()).get() : null);
        
        return teacher;
    }

    @Override
    public TeacherDTO toDto(Teacher entity) {
        if (entity == null) {
            return null;
        }
        
        return new TeacherDTO(
            entity.getId(),
            entity.getStaffId(),
            entity.getFirstName(),
            entity.getLastName(),
            entity.getEmail(),
            entity.getQualification(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.isActive()
        );
    }
} 