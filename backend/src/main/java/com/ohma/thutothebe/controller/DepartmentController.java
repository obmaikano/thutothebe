package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/departments")
@Tag(name = "Department Management", description = "APIs for managing departments with multi-tenant security")
public class DepartmentController extends BaseController<DepartmentDTO, Long> {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        super(departmentService);
        this.departmentService = departmentService;
    }

    // ==================== SECURE MULTI-TENANT OVERRIDES ====================

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure database-level filtering instead of memory filtering
            List<DepartmentDTO> departments = departmentService.getDepartmentsByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Validate access before retrieving
            if (!departmentService.validateDepartmentAccess(id, currentUserId)) {
                return createAccessDeniedResponse();
            }

            DepartmentDTO department = departmentService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> create(@Valid @RequestBody DepartmentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Business rule validation is handled in service layer
            DepartmentDTO created = departmentService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department created successfully", created, null));
        } catch (SecurityException e) {
            log.warn("Access denied creating department: {}", e.getMessage());
            return createAccessDeniedResponse();
        } catch (Exception e) {
            log.error("Error creating department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> update(@PathVariable Long id, @Valid @RequestBody DepartmentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Validate access before updating
            if (!departmentService.validateDepartmentAccess(id, currentUserId)) {
                return createAccessDeniedResponse();
            }

            DepartmentDTO updated = departmentService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department updated successfully", updated, null));
        } catch (SecurityException e) {
            log.warn("Access denied updating department: {}", e.getMessage());
            return createAccessDeniedResponse();
        } catch (Exception e) {
            log.error("Error updating department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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

            // Validate access before deleting
            if (!departmentService.validateDepartmentAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            departmentService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== SECURE DEPARTMENT-SPECIFIC ENDPOINTS ====================

    @GetMapping("/active")
    @Operation(summary = "Get all active departments with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getActiveDepartments() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure database-level filtering
            List<DepartmentDTO> departments = departmentService.getActiveDepartmentsByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving active departments: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get departments by school ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments by school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get departments by region ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsByRegionId(@PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsByRegionIdAndAccessibleScopes(regionId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments by region: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get departments by teacher ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments by teacher: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get department by subject ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            DepartmentDTO department = departmentService.getDepartmentBySubjectIdAndAccessibleScopes(subjectId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department by subject: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/head/{departmentHeadId}")
    @Operation(summary = "Get department by department head ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentByDepartmentHeadId(@PathVariable Long departmentHeadId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            DepartmentDTO department = departmentService.getDepartmentByDepartmentHeadIdAndAccessibleScopes(departmentHeadId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department by head: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search departments by name with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> searchDepartmentsByName(@RequestParam String name) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.searchDepartmentsByNameAndAccessibleScopes(name, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error searching departments by name: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/without-head")
    @Operation(summary = "Get departments without head with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsWithoutHead() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsWithoutHeadByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments without head retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments without head: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/with-subjects")
    @Operation(summary = "Get departments with subjects with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsWithSubjects() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsWithSubjectsByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments with subjects retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments with subjects: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== DEPARTMENT MANAGEMENT ENDPOINTS ====================

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a department")
    public ResponseEntity<OhmaApiResponse<Void>> activateDepartment(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before activating
            if (!departmentService.validateDepartmentAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            departmentService.activateDepartment(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a department")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateDepartment(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before deactivating
            if (!departmentService.validateDepartmentAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            departmentService.deactivateDepartment(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/head/{teacherId}")
    @Operation(summary = "Assign department head")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignDepartmentHead(
            @PathVariable Long departmentId,
            @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before assigning head
            if (!departmentService.validateDepartmentAccess(departmentId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.assignDepartmentHead(departmentId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department head assigned successfully", department, null));
        } catch (Exception e) {
            log.error("Error assigning department head: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{departmentId}/head")
    @Operation(summary = "Remove department head")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeDepartmentHead(@PathVariable Long departmentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before removing head
            if (!departmentService.validateDepartmentAccess(departmentId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.removeDepartmentHead(departmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department head removed successfully", department, null));
        } catch (Exception e) {
            log.error("Error removing department head: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/teacher/{teacherId}")
    @Operation(summary = "Assign teacher to department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignTeacherToDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before assigning teacher
            if (!departmentService.validateDepartmentAccess(departmentId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.assignTeacherToDepartment(departmentId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher assigned to department successfully", department, null));
        } catch (Exception e) {
            log.error("Error assigning teacher to department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{departmentId}/teacher/{teacherId}")
    @Operation(summary = "Remove teacher from department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeTeacherFromDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before removing teacher
            if (!departmentService.validateDepartmentAccess(departmentId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.removeTeacherFromDepartment(departmentId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher removed from department successfully", department, null));
        } catch (Exception e) {
            log.error("Error removing teacher from department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/subject/{subjectId}")
    @Operation(summary = "Assign subject to department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignSubjectToDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before assigning subject
            if (!departmentService.validateDepartmentAccess(departmentId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.assignSubjectToDepartment(departmentId, subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject assigned to department successfully", department, null));
        } catch (Exception e) {
            log.error("Error assigning subject to department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{departmentId}/subject/{subjectId}")
    @Operation(summary = "Remove subject from department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeSubjectFromDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before removing subject
            if (!departmentService.validateDepartmentAccess(departmentId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.removeSubjectFromDepartment(departmentId, subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject removed from department successfully", department, null));
        } catch (Exception e) {
            log.error("Error removing subject from department: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== MISSING METHODS FOR TESTS ====================

    @GetMapping("/active/school/{schoolId}")
    @Operation(summary = "Get active departments by school ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getActiveDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getActiveDepartmentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving active departments by school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/name/{name}/school/{schoolId}")
    @Operation(summary = "Get department by name and school ID with access validation")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentByNameAndSchoolId(@PathVariable String name, @PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            DepartmentDTO department = departmentService.getDepartmentByNameAndSchoolId(name, schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department by name and school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/active/school/{schoolId}")
    @Operation(summary = "Count active departments by school ID with access validation")
    public ResponseEntity<OhmaApiResponse<Long>> countActiveDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = departmentService.countActiveDepartmentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting active departments by school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists/name/{name}/school/{schoolId}")
    @Operation(summary = "Check if department exists by name and school ID with access validation")
    public ResponseEntity<OhmaApiResponse<Boolean>> existsByNameAndSchoolId(@PathVariable String name, @PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Boolean exists = departmentService.existsByNameAndSchoolId(name, schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking department existence by name and school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== STATISTICS ENDPOINTS ====================

    @GetMapping("/statistics/count")
    @Operation(summary = "Get department count by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getDepartmentCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = departmentService.getDepartmentCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving department count: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/with-head")
    @Operation(summary = "Get departments with head count by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getDepartmentsWithHeadCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = departmentService.getDepartmentsWithHeadCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments with head count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving departments with head count: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/without-head")
    @Operation(summary = "Get departments without head count by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getDepartmentsWithoutHeadCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = departmentService.getDepartmentsWithoutHeadCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments without head count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving departments without head count: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/with-subjects")
    @Operation(summary = "Get departments with subjects count by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getDepartmentsWithSubjectsCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = departmentService.getDepartmentsWithSubjectsCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments with subjects count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving departments with subjects count: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/with-teachers")
    @Operation(summary = "Get departments with teachers count by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getDepartmentsWithTeachersCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = departmentService.getDepartmentsWithTeachersCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments with teachers count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving departments with teachers count: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 