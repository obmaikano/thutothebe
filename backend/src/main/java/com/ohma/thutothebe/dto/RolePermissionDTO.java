package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.PermissionScope;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotNull;

public record RolePermissionDTO(
    Long id,
    
    @NotNull(message = "Role is required")
    UserRole role,
    
    @NotNull(message = "Permission ID is required")
    Long permissionId,
    
    String permissionName,
    String resource,
    String action,
    
    PermissionScope scopeType,
    Long scopeId,
    String scopeName,
    
    boolean active
) {
    public RolePermissionDTO {
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        if (permissionId == null || permissionId <= 0) {
            throw new IllegalArgumentException("Permission ID must be positive");
        }
    }
} 