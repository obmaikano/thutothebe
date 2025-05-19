package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.mapper.ClassMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ClassMapperImpl implements ClassMapper {

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ClassDTO toDto(Class entity) {
        if (entity == null) {
            return null;
        }
        return new ClassDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getTeachers() != null ? 
                entity.getTeachers().stream()
                    .map(teacher -> teacher.getId())
                    .collect(Collectors.toSet()) : 
                null,
            entity.getStudents() != null ? 
                entity.getStudents().stream()
                    .map(student -> student.getId())
                    .collect(Collectors.toSet()) : 
                null,
            entity.isActive()
        );
    }

    @Override
    public Class toEntity(ClassDTO dto) {
        if (dto == null) {
            return null;
        }
        Class entity = new Class();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
        entity.setSchool(schoolRepository.findById(dto.schoolId()).orElse(null));
        entity.setTeachers(dto.teacherIds() != null ?
                dto.teacherIds().stream()
                .map(teacher -> userRepository.findById(teacher).orElse(null))
                .collect(Collectors.toSet()) :
                null);
        entity.setStudents(dto.studentIds() != null ?
                dto.studentIds().stream()
                .map(student -> userRepository.findById(student).orElse(null))
                .collect(Collectors.toSet()) :
                null);
        return entity;
    }
} 