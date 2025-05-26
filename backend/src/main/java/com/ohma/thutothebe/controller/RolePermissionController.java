package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.RolePermissionDTO;
import com.ohma.thutothebe.dto.UserPermissionCheckDTO;
import com.ohma.thutothebe.entity.PermissionScope;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.RolePermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE') or hasRole('MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getByRole(
            @Parameter(description = "User role") @PathVariable UserRole role) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE') or hasRole('MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getActiveByRole(
            @Parameter(description = "User role") @PathVariable UserRole role) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE') or hasRole('MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getByPermissionId(
            @Parameter(description = "Permission ID") @PathVariable Long permissionId) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE') or hasRole('MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<List<RolePermissionDTO>>> getByScope(
            @Parameter(description = "Permission scope type") @PathVariable PermissionScope scopeType,
            @Parameter(description = "Scope ID") @PathVariable Long scopeId) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<RolePermissionDTO>> assignPermissionToRole(
            @RequestParam UserRole role,
            @RequestParam Long permissionId,
            @RequestParam(required = false) PermissionScope scopeType,
            @RequestParam(required = false) Long scopeId) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<Void>> removePermissionFromRole(
            @RequestParam UserRole role,
            @RequestParam Long permissionId,
            @RequestParam(required = false) PermissionScope scopeType,
            @RequestParam(required = false) Long scopeId) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> initializeDefaultRolePermissions() {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<RolePermissionDTO>> create(@Valid @RequestBody RolePermissionDTO dto) {
        return super.create(dto);
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<RolePermissionDTO>> update(@PathVariable Long id, @Valid @RequestBody RolePermissionDTO dto) {
        return super.update(id, dto);
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        return super.delete(id);
    }
} 