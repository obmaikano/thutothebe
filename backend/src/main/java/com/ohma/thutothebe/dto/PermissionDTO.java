package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.PermissionAction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PermissionDTO(
    Long id,
    
    @NotBlank(message = "Permission name is required")
    @Size(min = 3, max = 100, message = "Permission name must be between 3 and 100 characters")
    String name,
    
    @NotBlank(message = "Resource is required")
    @Size(min = 3, max = 50, message = "Resource must be between 3 and 50 characters")
    String resource,
    
    PermissionAction action,
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description,
    
    boolean active
) {
    public PermissionDTO {
        if (name != null && name.isBlank()) {
            throw new IllegalArgumentException("Permission name cannot be blank");
        }
        if (resource != null && resource.isBlank()) {
            throw new IllegalArgumentException("Resource cannot be blank");
        }
        if (action == null) {
            throw new IllegalArgumentException("Action cannot be null");
        }
    }
} 