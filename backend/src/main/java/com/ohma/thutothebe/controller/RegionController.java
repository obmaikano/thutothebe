package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.service.RegionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/code/{code}")
    @Operation(summary = "Get region by code")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<RegionDTO>> getByCode(@PathVariable String code) {
        try {
            RegionDTO region = regionService.getRegionByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region retrieved successfully", region, null));
        } catch (Exception e) {
            log.error("Error retrieving region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active regions")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<RegionDTO>>> getActiveRegions() {
        try {
            List<RegionDTO> regions = regionService.getActiveRegions();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active regions retrieved successfully", regions, null));
        } catch (Exception e) {
            log.error("Error retrieving active regions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }


    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a region")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateRegion(@PathVariable Long id) {
        try {
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateRegion(@PathVariable Long id) {
        try {
            regionService.deactivateRegion(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 