package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.BaseService;
import com.ohma.thutothebe.service.impl.RuleBasedAccessControlServiceImpl;
import com.ohma.thutothebe.util.AuthUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Base Controller", description = "Base CRUD operations")
public abstract class BaseController<D, ID> {
    
    protected final BaseService<D, ID> service;
    
    @Autowired
    protected RuleBasedAccessControlServiceImpl accessControlService;
    
    @Autowired
    protected AuthUtils authUtils;
    
    protected BaseController(BaseService<D, ID> service) {
        this.service = service;
    }

    /**
     * Helper method to get current user ID
     */
    protected Long getCurrentUserId() {
        return authUtils.getCurrentUserId();
    }

    /**
     * Helper method to check access before proceeding with operations
     */
    protected boolean hasAccess(AccessScope scope, Long scopeId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return false;
        }
        return accessControlService.hasAccess(currentUserId, scope, scopeId);
    }

    /**
     * Helper method to create access denied response
     */
    protected ResponseEntity<OhmaApiResponse<D>> createAccessDeniedResponse() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
    }

    /**
     * Helper method to create access denied response for lists
     */
    protected ResponseEntity<OhmaApiResponse<List<D>>> createAccessDeniedListResponse() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
    }

    /**
     * Helper method to create unauthorized response when user is not authenticated
     */
    protected ResponseEntity<OhmaApiResponse<D>> createUnauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
    }

    @PostMapping
    @Operation(summary = "Create a new resource")
    public ResponseEntity<OhmaApiResponse<D>> create(@RequestBody D dto) {
        try {
            // Note: Specific access control logic should be implemented in individual controllers
            // as resource creation requirements vary by entity type
            D created = service.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a resource by ID")
    public ResponseEntity<OhmaApiResponse<D>> getById(@PathVariable ID id) {
        try {
            // Note: Specific access control logic should be implemented in individual controllers
            // as read access requirements vary by entity type
            D resource = service.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource retrieved successfully", resource, null));
        } catch (Exception e) {
            log.error("Error retrieving resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping
    @Operation(summary = "Get all resources")
    public ResponseEntity<OhmaApiResponse<List<D>>> getAll() {
        try {
            // Note: Specific access control logic should be implemented in individual controllers
            // to filter results based on user permissions
            List<D> resources = service.getAll();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resources retrieved successfully", resources, null));
        } catch (Exception e) {
            log.error("Error retrieving resources: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a resource")
    public ResponseEntity<OhmaApiResponse<D>> update(@PathVariable ID id, @RequestBody D dto) {
        try {
            // Note: Specific access control logic should be implemented in individual controllers
            // as update access requirements vary by entity type
            D updated = service.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resource")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable ID id) {
        try {
            // Note: Specific access control logic should be implemented in individual controllers
            // as delete access requirements vary by entity type
            service.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 