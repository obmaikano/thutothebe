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
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/departments")
@Tag(name = "Department Management", description = "APIs for managing departments with role-based access control")
public class DepartmentController extends BaseController<DepartmentDTO, Long> {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        super(departmentService);
        this.departmentService = departmentService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible department IDs and filter departments
            List<Long> accessibleDeptIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.DEPARTMENT);
            
            if (accessibleDeptIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible departments", List.of(), null));
            }

            List<DepartmentDTO> allDepartments = departmentService.getAll();
            List<DepartmentDTO> accessibleDepartments = allDepartments.stream()
                    .filter(dept -> accessibleDeptIds.contains(dept.id()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", accessibleDepartments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
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

            // Check if user has access to view this department
            if (!hasAccess(AccessScope.DEPARTMENT, id)) {
                return createAccessDeniedResponse();
            }

            DepartmentDTO department = departmentService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    @Operation(summary = "Create a new department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> create(@RequestBody DepartmentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has permission to create departments in this school (requires school admin or higher)
            if (!hasAccess(AccessScope.SCHOOL, dto.schoolId())) {
                return createAccessDeniedResponse();
            }

            DepartmentDTO created = departmentService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating department: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    @Operation(summary = "Update a department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> update(@PathVariable Long id, @RequestBody DepartmentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this department
            if (!hasAccess(AccessScope.DEPARTMENT, id)) {
                return createAccessDeniedResponse();
            }

            DepartmentDTO updated = departmentService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating department: {}", e.getMessage(), e);
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

            // Check if user has access to delete this department (requires school admin or higher)
            DepartmentDTO department = departmentService.getById(id);
            if (!hasAccess(AccessScope.SCHOOL, department.schoolId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            departmentService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting department: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get departments by school ID")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/active")
    @Operation(summary = "Get active departments by school ID")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getActiveDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getActiveDepartmentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving active departments for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active departments")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getActiveDepartments() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getActiveDepartments();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving active departments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Get department by name and school ID")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentByNameAndSchoolId(
            @RequestParam String name, @RequestParam Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            DepartmentDTO department = departmentService.getDepartmentByNameAndSchoolId(name, schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department by name {} and school {}: {}", name, schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/head/{departmentHeadId}")
    @Operation(summary = "Get department by department head ID")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentByDepartmentHeadId(@PathVariable Long departmentHeadId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this user (department head)
            if (!hasAccess(AccessScope.USER, departmentHeadId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.getDepartmentByDepartmentHeadId(departmentHeadId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department for head {}: {}", departmentHeadId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get departments by teacher ID")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this teacher's information
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments for teacher {}: {}", teacherId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get department by subject ID")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get the department first, then check access to that department
            DepartmentDTO department = departmentService.getDepartmentBySubjectId(subjectId);
            
            // Check if user has access to view this department
            if (!hasAccess(AccessScope.DEPARTMENT, department.id())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department for subject {}: {}", subjectId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/head/{userId}")
    @Operation(summary = "Assign department head")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignDepartmentHead(
            @PathVariable Long departmentId, @PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to assign department head
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.assignDepartmentHead(departmentId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department head assigned successfully", department, null));
        } catch (Exception e) {
            log.error("Error assigning department head {} to department {}: {}", userId, departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
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

            // Check if user has access to remove department head
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.removeDepartmentHead(departmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department head removed successfully", department, null));
        } catch (Exception e) {
            log.error("Error removing department head from department {}: {}", departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/teachers/{teacherId}")
    @Operation(summary = "Assign teacher to department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignTeacherToDepartment(
            @PathVariable Long departmentId, @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to assign teacher to department
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.assignTeacherToDepartment(departmentId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher assigned to department successfully", department, null));
        } catch (Exception e) {
            log.error("Error assigning teacher {} to department {}: {}", teacherId, departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{departmentId}/teachers/{teacherId}")
    @Operation(summary = "Remove teacher from department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeTeacherFromDepartment(
            @PathVariable Long departmentId, @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to remove teacher from department
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.removeTeacherFromDepartment(departmentId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher removed from department successfully", department, null));
        } catch (Exception e) {
            log.error("Error removing teacher {} from department {}: {}", teacherId, departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/subjects/{subjectId}")
    @Operation(summary = "Assign subject to department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignSubjectToDepartment(
            @PathVariable Long departmentId, @PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to assign subject to department
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.assignSubjectToDepartment(departmentId, subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject assigned to department successfully", department, null));
        } catch (Exception e) {
            log.error("Error assigning subject {} to department {}: {}", subjectId, departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{departmentId}/subjects/{subjectId}")
    @Operation(summary = "Remove subject from department")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeSubjectFromDepartment(
            @PathVariable Long departmentId, @PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to remove subject from department
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            DepartmentDTO department = departmentService.removeSubjectFromDepartment(departmentId, subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject removed from department successfully", department, null));
        } catch (Exception e) {
            log.error("Error removing subject {} from department {}: {}", subjectId, departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{departmentId}/activate")
    @Operation(summary = "Activate department")
    public ResponseEntity<OhmaApiResponse<Void>> activateDepartment(@PathVariable Long departmentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to activate this department
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            departmentService.activateDepartment(departmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating department {}: {}", departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{departmentId}/deactivate")
    @Operation(summary = "Deactivate department")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateDepartment(@PathVariable Long departmentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to deactivate this department
            if (!hasAccess(AccessScope.DEPARTMENT, departmentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            departmentService.deactivateDepartment(departmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating department {}: {}", departmentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/count")
    @Operation(summary = "Count active departments by school ID")
    public ResponseEntity<OhmaApiResponse<Long>> countActiveDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            Long count = departmentService.countActiveDepartmentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting departments for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/without-head")
    @Operation(summary = "Get departments without head by school ID")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsWithoutHead(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsWithoutHead(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments without head retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments without head for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/with-subjects")
    @Operation(summary = "Get departments with subjects by school ID")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsWithSubjects(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            List<DepartmentDTO> departments = departmentService.getDepartmentsWithSubjects(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Departments with subjects retrieved successfully", departments, null));
        } catch (Exception e) {
            log.error("Error retrieving departments with subjects for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists")
    @Operation(summary = "Check if department exists by name and school ID")
    public ResponseEntity<OhmaApiResponse<Boolean>> existsByNameAndSchoolId(
            @RequestParam String name, @RequestParam Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's departments
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            boolean exists = departmentService.existsByNameAndSchoolId(name, schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking department existence for name {} and school {}: {}", name, schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 