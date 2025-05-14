package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.mapper.SchoolMapper;
import org.springframework.stereotype.Component;

@Component
public class SchoolMapperImpl implements SchoolMapper {

    @Override
    public SchoolDTO toDto(School entity) {
        if (entity == null) {
            return null;
        }
        return new SchoolDTO(
            entity.getId(),
            entity.getCode(),
            entity.getName(),
            entity.getDescription(),
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.isActive()
        );
    }

    @Override
    public School toEntity(SchoolDTO dto) {
        if (dto == null) {
            return null;
        }
        School entity = new School();
        entity.setId(dto.id());
        entity.setCode(dto.code());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
        return entity;
    }
} 