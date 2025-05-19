package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.mapper.SchoolMapper;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SchoolMapperImpl implements SchoolMapper {

    @Autowired
    private RegionRepository regionRepository;

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
        entity.setRegion(dto.regionId() != null ? regionRepository.findById(dto.regionId()).get() : null);
        entity.setActive(dto.active());
        return entity;
    }
} 