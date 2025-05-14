package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.mapper.RegionMapper;
import org.springframework.stereotype.Component;

@Component
public class RegionMapperImpl implements RegionMapper {

    @Override
    public RegionDTO toDto(Region entity) {
        if (entity == null) {
            return null;
        }
        return new RegionDTO(
            entity.getId(),
            entity.getCode(),
            entity.getName(),
            entity.getDescription(),
            entity.isActive()
        );
    }

    @Override
    public Region toEntity(RegionDTO dto) {
        if (dto == null) {
            return null;
        }
        Region entity = new Region();
        entity.setId(dto.id());
        entity.setCode(dto.code());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
        return entity;
    }

    @Override
    public void updateEntityFromDto(RegionDTO dto, Region entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setCode(dto.code());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
    }
} 