package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.RegionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/regions")
@Tag(name = "Region Management", description = "APIs for managing regions")
public class RegionController extends BaseController<RegionDTO, Long> {

    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        super(regionService);
        this.regionService = regionService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<RegionDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible region IDs and filter regions
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            if (accessibleRegionIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible regions", List.of(), null));
            }

            List<RegionDTO> allRegions = regionService.getAll();
            List<RegionDTO> accessibleRegions = allRegions.stream()
                    .filter(region -> accessibleRegionIds.contains(region.id()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regions retrieved successfully", accessibleRegions, null));
        } catch (Exception e) {
            log.error("Error retrieving regions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<RegionDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to view this region
            if (!hasAccess(AccessScope.REGION, id)) {
                return createAccessDeniedResponse();
            }

            RegionDTO region = regionService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region retrieved successfully", region, null));
        } catch (Exception e) {
            log.error("Error retrieving region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<RegionDTO>> create(@RequestBody RegionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Only global admin can create regions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            RegionDTO created = regionService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<RegionDTO>> update(@PathVariable Long id, @RequestBody RegionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this region (global admin or regional admin)
            if (!hasAccess(AccessScope.REGION, id) && !hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            RegionDTO updated = regionService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating region: {}", e.getMessage(), e);
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

            // Only global admin can delete regions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            regionService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get region by code")
    public ResponseEntity<OhmaApiResponse<RegionDTO>> getByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            RegionDTO region = regionService.getRegionByCode(code);
            
            // Check if user has access to view this region
            if (!hasAccess(AccessScope.REGION, region.id())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region retrieved successfully", region, null));
        } catch (Exception e) {
            log.error("Error retrieving region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active regions")
    public ResponseEntity<OhmaApiResponse<List<RegionDTO>>> getActiveRegions() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible region IDs and filter active regions
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            
            if (accessibleRegionIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible regions", List.of(), null));
            }

            List<RegionDTO> allActiveRegions = regionService.getActiveRegions();
            List<RegionDTO> accessibleActiveRegions = allActiveRegions.stream()
                    .filter(region -> accessibleRegionIds.contains(region.id()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active regions retrieved successfully", accessibleActiveRegions, null));
        } catch (Exception e) {
            log.error("Error retrieving active regions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a region")
    public ResponseEntity<OhmaApiResponse<Void>> activateRegion(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Only global admin can activate regions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            regionService.activateRegion(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a region")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateRegion(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Only global admin can deactivate regions
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            regionService.deactivateRegion(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 