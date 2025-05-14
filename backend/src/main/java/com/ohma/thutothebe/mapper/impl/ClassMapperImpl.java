package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.mapper.ClassMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ClassMapperImpl implements ClassMapper {

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
        return entity;
    }
} 