package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.PermissionDTO;
import com.ohma.thutothebe.entity.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper implements BaseDtoMapper<Permission, PermissionDTO> {

    @Override
    public PermissionDTO toDto(Permission entity) {
        if (entity == null) return null;

        return new PermissionDTO(
            entity.getId(),
            entity.getName(),
            entity.getResource(),
            entity.getAction(),
            entity.getDescription(),
            entity.isActive()
        );
    }

    @Override
    public Permission toEntity(PermissionDTO dto) {
        if (dto == null) return null;

        Permission entity = new Permission();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(Permission entity, PermissionDTO dto) {
        entity.setName(dto.name());
        entity.setResource(dto.resource());
        entity.setAction(dto.action());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
    }
} 