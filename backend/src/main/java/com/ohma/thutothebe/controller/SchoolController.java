package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.SchoolService;
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
@RequestMapping("/schools")
@Tag(name = "School Management", description = "APIs for managing schools")
public class SchoolController extends BaseController<SchoolDTO, Long> {

    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        super(schoolService);
        this.schoolService = schoolService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<SchoolDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible school IDs and filter schools
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            
            if (accessibleSchoolIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible schools", List.of(), null));
            }

            List<SchoolDTO> allSchools = schoolService.getAll();
            List<SchoolDTO> accessibleSchools = allSchools.stream()
                    .filter(school -> accessibleSchoolIds.contains(school.id()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools retrieved successfully", accessibleSchools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to view this school
            if (!hasAccess(AccessScope.SCHOOL, id)) {
                return createAccessDeniedResponse();
            }

            SchoolDTO school = schoolService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School retrieved successfully", school, null));
        } catch (Exception e) {
            log.error("Error retrieving school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> create(@RequestBody SchoolDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has permission to create schools (requires regional admin or higher)
            if (!hasAccess(AccessScope.REGION, dto.regionId()) && !hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            SchoolDTO created = schoolService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> update(@PathVariable Long id, @RequestBody SchoolDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this school
            if (!hasAccess(AccessScope.SCHOOL, id)) {
                return createAccessDeniedResponse();
            }

            SchoolDTO updated = schoolService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating school: {}", e.getMessage(), e);
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

            // Check if user has access to delete this school (requires regional admin or higher)
            SchoolDTO school = schoolService.getById(id);
            if (!hasAccess(AccessScope.REGION, school.regionId()) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            schoolService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get school by code")
    public ResponseEntity<OhmaApiResponse<SchoolDTO>> getByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            SchoolDTO school = schoolService.getSchoolByCode(code);
            
            // Check if user has access to view this school
            if (!hasAccess(AccessScope.SCHOOL, school.id())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School retrieved successfully", school, null));
        } catch (Exception e) {
            log.error("Error retrieving school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get schools by region ID")
    public ResponseEntity<OhmaApiResponse<List<SchoolDTO>>> getByRegionId(@PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this region's schools
            if (!hasAccess(AccessScope.REGION, regionId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this region", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<SchoolDTO>>> getActiveByRegionId(@PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this region's schools
            if (!hasAccess(AccessScope.REGION, regionId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this region", null, null));
            }

            List<SchoolDTO> schools = schoolService.getActiveSchoolsByRegionId(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active schools retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving active schools: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a school")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateSchool(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to manage this school (requires regional admin or higher)
            SchoolDTO school = schoolService.getById(id);
            if (!hasAccess(AccessScope.REGION, school.regionId()) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<Void>> activateSchool(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to manage this school (requires regional admin or higher)
            SchoolDTO school = schoolService.getById(id);
            if (!hasAccess(AccessScope.REGION, school.regionId()) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            schoolService.activateSchool(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 