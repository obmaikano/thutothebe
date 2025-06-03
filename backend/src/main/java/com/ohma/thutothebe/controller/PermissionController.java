package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.PermissionDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.PermissionAction;
import com.ohma.thutothebe.service.PermissionService;
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
@RequestMapping("/permissions")
@Tag(name = "Permission Management", description = "APIs for managing system permissions")
public class PermissionController extends BaseController<PermissionDTO, Long> {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        super(permissionService);
        this.permissionService = permissionService;
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get permission by name")
    public ResponseEntity<OhmaApiResponse<PermissionDTO>> getByName(
            @Parameter(description = "Permission name") @PathVariable String name) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to permission management", null, null));
            }

            PermissionDTO permission = permissionService.findByName(name);
            if (permission != null) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Permission retrieved successfully", permission, null));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving permission by name: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active permissions")
    public ResponseEntity<OhmaApiResponse<List<PermissionDTO>>> getActivePermissions() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view active permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to permission management", null, null));
            }

            List<PermissionDTO> permissions = permissionService.findActivePermissions();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active permissions retrieved successfully", permissions, null));
        } catch (Exception e) {
            log.error("Error retrieving active permissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/initialize")
    @Operation(summary = "Initialize default permissions")
    public ResponseEntity<OhmaApiResponse<Void>> initializeDefaultPermissions() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to initialize permissions (SUPER_ADMIN only)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to initialize permissions", null, null));
            }

            permissionService.initializeDefaultPermissions();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Default permissions initialized successfully", null, null));
        } catch (Exception e) {
            log.error("Error initializing default permissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<PermissionDTO>> create(@Valid @RequestBody PermissionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to create permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create permissions", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            log.error("Error creating permission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<PermissionDTO>> update(@PathVariable Long id, @Valid @RequestBody PermissionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to update permissions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update permissions", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            log.error("Error updating permission: {}", e.getMessage(), e);
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

            // Check if user has global admin access to delete permissions (SUPER_ADMIN only)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete permissions", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            log.error("Error deleting permission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 