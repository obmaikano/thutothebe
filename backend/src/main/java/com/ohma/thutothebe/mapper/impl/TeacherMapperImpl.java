package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.mapper.TeacherMapper;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapperImpl implements TeacherMapper {

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
            entity.isActive()
        );
    }
} 