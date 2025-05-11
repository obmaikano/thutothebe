package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.BaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Base Controller", description = "Base CRUD operations")
public abstract class BaseController<D, ID> {
    
    protected final BaseService<D, ID> service;
    
    protected BaseController(BaseService<D, ID> service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Create a new resource")
    public ResponseEntity<OhmaApiResponse<D>> create(@RequestBody D dto) {
        try {
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
            service.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 