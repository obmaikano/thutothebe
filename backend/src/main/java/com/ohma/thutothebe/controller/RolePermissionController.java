package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.RolePermissionDTO;
import com.ohma.thutothebe.dto.UserPermissionCheckDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.PermissionScope;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.RolePermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/role-permissions")
@Tag(name = "Role Permission Management", description = "APIs for managing role-based permissions")
public class RolePermissionController extends BaseController<RolePermissionDTO, Long> {

    private final RolePermissionService rolePermissionService;

    public RolePermissionController(RolePermissionService rolePermissionService) {
        super(rolePermissionService);
        this.rolePermissionService = rolePermissionService;
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get permissions by role")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getByRole(
            @Parameter(description = "User role") @PathVariable UserRole role) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view role permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to role permission management", null, null));
            }

            List<RolePermissionDTO> permissions = rolePermissionService.findByRole(role);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Role permissions retrieved successfully", permissions, null));
        } catch (Exception e) {
            log.error("Error retrieving permissions by role: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/role/{role}/active")
    @Operation(summary = "Get active permissions by role")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getActiveByRole(
            @Parameter(description = "User role") @PathVariable UserRole role) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view active role permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to role permission management", null, null));
            }

            List<RolePermissionDTO> permissions = rolePermissionService.findActiveByRole(role);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active role permissions retrieved successfully", permissions, null));
        } catch (Exception e) {
            log.error("Error retrieving active permissions by role: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/permission/{permissionId}")
    @Operation(summary = "Get role permissions by permission ID")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getByPermissionId(
            @Parameter(description = "Permission ID") @PathVariable Long permissionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view role permissions by permission
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to role permission management", null, null));
            }

            List<RolePermissionDTO> rolePermissions = rolePermissionService.findByPermissionId(permissionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Role permissions retrieved successfully", rolePermissions, null));
        } catch (Exception e) {
            log.error("Error retrieving role permissions by permission ID: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/scope/{scopeType}/{scopeId}")
    @Operation(summary = "Get role permissions by scope")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getByScope(
            @Parameter(description = "Permission scope type") @PathVariable PermissionScope scopeType,
            @Parameter(description = "Scope ID") @PathVariable Long scopeId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view role permissions by scope
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to role permission management", null, null));
            }

            List<RolePermissionDTO> rolePermissions = rolePermissionService.findByScope(scopeType, scopeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Role permissions retrieved successfully", rolePermissions, null));
        } catch (Exception e) {
            log.error("Error retrieving role permissions by scope: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/check")
    @Operation(summary = "Check user permission")
    public ResponseEntity<OhmaApiResponse<UserPermissionCheckDTO>> checkUserPermission(
            @Valid @RequestBody UserPermissionCheckDTO checkRequest) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // This endpoint might be used for internal permission checking, allow authenticated users
            UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(checkRequest);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Permission check completed", result, null));
        } catch (Exception e) {
            log.error("Error checking user permission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/assign")
    @Operation(summary = "Assign permission to role")
    public ResponseEntity<OhmaApiResponse<RolePermissionDTO>> assignPermissionToRole(
            @RequestParam UserRole role,
            @RequestParam Long permissionId,
            @RequestParam(required = false) PermissionScope scopeType,
            @RequestParam(required = false) Long scopeId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to assign permissions to roles
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to assign role permissions", null, null));
            }

            RolePermissionDTO result = rolePermissionService.assignPermissionToRole(role, permissionId, scopeType, scopeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Permission assigned to role successfully", result, null));
        } catch (Exception e) {
            log.error("Error assigning permission to role: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove permission from role")
    public ResponseEntity<OhmaApiResponse<Void>> removePermissionFromRole(
            @RequestParam UserRole role,
            @RequestParam Long permissionId,
            @RequestParam(required = false) PermissionScope scopeType,
            @RequestParam(required = false) Long scopeId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to remove permissions from roles
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to remove role permissions", null, null));
            }

            rolePermissionService.removePermissionFromRole(role, permissionId, scopeType, scopeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Permission removed from role successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing permission from role: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/initialize")
    @Operation(summary = "Initialize default role permissions")
    public ResponseEntity<OhmaApiResponse<Void>> initializeDefaultRolePermissions() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to initialize role permissions (SUPER_ADMIN only)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to initialize role permissions", null, null));
            }

            rolePermissionService.initializeDefaultRolePermissions();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Default role permissions initialized successfully", null, null));
        } catch (Exception e) {
            log.error("Error initializing default role permissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<RolePermissionDTO>> create(@Valid @RequestBody RolePermissionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to create role permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create role permissions", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            log.error("Error creating role permission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<RolePermissionDTO>> update(@PathVariable Long id, @Valid @RequestBody RolePermissionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to update role permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update role permissions", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            log.error("Error updating role permission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to delete role permissions (SUPER_ADMIN only)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete role permissions", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            log.error("Error deleting role permission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 