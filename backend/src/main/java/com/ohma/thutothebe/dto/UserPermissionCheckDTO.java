package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.PermissionAction;
import com.ohma.thutothebe.entity.PermissionScope;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserPermissionCheckDTO(
    @NotNull(message = "User ID is required")
    Long userId,
    
    @NotNull(message = "User role is required")
    UserRole userRole,
    
    @NotBlank(message = "Resource is required")
    String resource,
    
    @NotNull(message = "Action is required")
    PermissionAction action,
    
    PermissionScope scopeType,
    Long scopeId,
    
    // Response fields
    boolean hasPermission,
    String reason,
    String scopeName
) {
    public UserPermissionCheckDTO {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User ID must be positive");
        }
        if (userRole == null) {
            throw new IllegalArgumentException("User role cannot be null");
        }
        if (resource == null || resource.isBlank()) {
            throw new IllegalArgumentException("Resource cannot be null or blank");
        }
        if (action == null) {
            throw new IllegalArgumentException("Action cannot be null");
        }
    }
} 