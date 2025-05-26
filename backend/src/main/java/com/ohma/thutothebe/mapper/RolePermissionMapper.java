package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.RolePermissionDTO;
import com.ohma.thutothebe.entity.RolePermission;
import com.ohma.thutothebe.entity.Permission;
import com.ohma.thutothebe.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RolePermissionMapper implements BaseDtoMapper<RolePermission, RolePermissionDTO> {

    private final PermissionRepository permissionRepository;

    @Override
    public RolePermissionDTO toDto(RolePermission entity) {
        if (entity == null) return null;

        Permission permission = entity.getPermission();
        String scopeName = determineScopeName(entity);

        return new RolePermissionDTO(
            entity.getId(),
            entity.getRole(),
            permission != null ? permission.getId() : null,
            permission != null ? permission.getName() : null,
            permission != null ? permission.getResource() : null,
            permission != null ? permission.getAction().name() : null,
            entity.getScopeType(),
            entity.getScopeId(),
            scopeName,
            entity.isActive()
        );
    }

    @Override
    public RolePermission toEntity(RolePermissionDTO dto) {
        if (dto == null) return null;

        RolePermission entity = new RolePermission();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(RolePermission entity, RolePermissionDTO dto) {
        entity.setRole(dto.role());
        entity.setScopeType(dto.scopeType());
        entity.setScopeId(dto.scopeId());
        entity.setActive(dto.active());

        if (dto.permissionId() != null) {
            Permission permission = permissionRepository.findById(dto.permissionId())
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with id: " + dto.permissionId()));
            entity.setPermission(permission);
        }
    }

    private String determineScopeName(RolePermission entity) {
        if (entity.getScopeType() == null || entity.getScopeId() == null) {
            return null;
        }

        // This would need to be expanded based on actual scope resolution logic
        // For now, return a simple representation
        return entity.getScopeType().name() + ":" + entity.getScopeId();
    }
} 