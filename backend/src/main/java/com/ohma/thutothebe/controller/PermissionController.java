package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.PermissionDTO;
import com.ohma.thutothebe.entity.PermissionAction;
import com.ohma.thutothebe.service.PermissionService;
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<PermissionDTO>> getByName(
            @Parameter(description = "Permission name") @PathVariable String name) {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE') or hasRole('MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<List<PermissionDTO>>> getActivePermissions() {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> initializeDefaultPermissions() {
        try {
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
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<PermissionDTO>> create(@Valid @RequestBody PermissionDTO dto) {
        return super.create(dto);
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<PermissionDTO>> update(@PathVariable Long id, @Valid @RequestBody PermissionDTO dto) {
        return super.update(id, dto);
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        return super.delete(id);
    }
} 