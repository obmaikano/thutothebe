package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "role_permissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"role", "permission_id", "scope_type", "scope_id"})
})
@EqualsAndHashCode(callSuper = true)
public class RolePermission extends BaseEntity {

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @NotNull(message = "Permission is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope_type")
    private PermissionScope scopeType;

    @Column(name = "scope_id")
    private Long scopeId;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permission_permissions",
        joinColumns = @JoinColumn(name = "role_permission_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    public RolePermission() {}

    public RolePermission(UserRole role, Permission permission, PermissionScope scopeType, Long scopeId) {
        this.role = role;
        this.permission = permission;
        this.scopeType = scopeType;
        this.scopeId = scopeId;
    }
} 