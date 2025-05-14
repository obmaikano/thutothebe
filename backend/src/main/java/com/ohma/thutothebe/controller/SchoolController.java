package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.service.SchoolService;
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
@RequestMapping("/api/schools")
@Tag(name = "School Management", description = "APIs for managing schools")
public class SchoolController extends BaseController<SchoolDTO, Long> {

    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        super(schoolService);
        this.schoolService = schoolService;
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get school by code")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> getByCode(@PathVariable String code) {
        try {
            SchoolDTO school = schoolService.getSchoolByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School retrieved successfully", school, null));
        } catch (Exception e) {
            log.error("Error retrieving school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get schools by region ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<SchoolDTO>>> getByRegionId(@PathVariable Long regionId) {
        try {
            List<SchoolDTO> schools = schoolService.getSchoolsByRegionId(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/active")
    @Operation(summary = "Get active schools by region ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<SchoolDTO>>> getActiveByRegionId(@PathVariable Long regionId) {
        try {
            List<SchoolDTO> schools = schoolService.getActiveSchoolsByRegionId(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active schools retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving active schools: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new school")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> createSchool(@Valid @RequestBody SchoolDTO schoolDTO) {
        try {
            SchoolDTO created = schoolService.createSchool(schoolDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing school")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> updateSchool(
            @PathVariable Long id,
            @Valid @RequestBody SchoolDTO schoolDTO) {
        try {
            SchoolDTO updated = schoolService.updateSchool(id, schoolDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a school")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteSchool(@PathVariable Long id) {
        try {
            schoolService.deleteSchool(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a school")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateSchool(@PathVariable Long id) {
        try {
            schoolService.deactivateSchool(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a school")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateSchool(@PathVariable Long id) {
        try {
            schoolService.activateSchool(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 