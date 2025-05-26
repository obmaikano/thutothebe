package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "permissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"resource", "action"})
})
@EqualsAndHashCode(callSuper = true)
public class Permission extends BaseEntity {

    @NotBlank(message = "Permission name is required")
    @Size(min = 3, max = 100, message = "Permission name must be between 3 and 100 characters")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Resource is required")
    @Size(min = 3, max = 50, message = "Resource must be between 3 and 50 characters")
    @Column(nullable = false)
    private String resource;

    @NotBlank(message = "Action is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionAction action;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    private Set<RolePermission> rolePermissions = new HashSet<>();

    public Permission() {}

    public Permission(String name, String resource, PermissionAction action, String description) {
        this.name = name;
        this.resource = resource;
        this.action = action;
        this.description = description;
    }
} 