package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @PostMapping
    @Operation(summary = "Create a new department")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> create(@Valid @RequestBody DepartmentDTO dto) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> update(@PathVariable Long id, @Valid @RequestBody DepartmentDTO dto) {
        try {
            DepartmentDTO updated = departmentService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating department: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get departments by school ID")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getActiveDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getActiveDepartments() {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentByNameAndSchoolId(
            @RequestParam String name, @RequestParam Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentByDepartmentHeadId(@PathVariable Long departmentHeadId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsByTeacherId(@PathVariable Long teacherId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> getDepartmentBySubjectId(@PathVariable Long subjectId) {
        try {
            DepartmentDTO department = departmentService.getDepartmentBySubjectId(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department retrieved successfully", department, null));
        } catch (Exception e) {
            log.error("Error retrieving department for subject {}: {}", subjectId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{departmentId}/head/{userId}")
    @Operation(summary = "Assign department head")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignDepartmentHead(
            @PathVariable Long departmentId, @PathVariable Long userId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeDepartmentHead(@PathVariable Long departmentId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignTeacherToDepartment(
            @PathVariable Long departmentId, @PathVariable Long teacherId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeTeacherFromDepartment(
            @PathVariable Long departmentId, @PathVariable Long teacherId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> assignSubjectToDepartment(
            @PathVariable Long departmentId, @PathVariable Long subjectId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<DepartmentDTO>> removeSubjectFromDepartment(
            @PathVariable Long departmentId, @PathVariable Long subjectId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateDepartment(@PathVariable Long departmentId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateDepartment(@PathVariable Long departmentId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countActiveDepartmentsBySchoolId(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsWithoutHead(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> getDepartmentsWithSubjects(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Boolean>> existsByNameAndSchoolId(
            @RequestParam String name, @RequestParam Long schoolId) {
        try {
            boolean exists = departmentService.existsByNameAndSchoolId(name, schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Department existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking department existence for name {} and school {}: {}", name, schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 