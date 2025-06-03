package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/teachers")
@Tag(name = "Teacher Management", description = "APIs for managing teachers/instructors")
public class TeacherController extends BaseController<TeacherDTO, Long> {

    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        super(teacherService);
        this.teacherService = teacherService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering instead of unsafe getAll()
            List<TeacherDTO> accessibleTeachers = teacherService.getTeachersByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teachers retrieved successfully", accessibleTeachers, null));
        } catch (Exception e) {
            log.error("Error retrieving teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/staff-id/{staffId}")
    @Operation(summary = "Get teacher by staff ID")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> getByStaffId(@PathVariable String staffId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            TeacherDTO teacher = teacherService.getTeacherByStaffId(staffId);
            
            // Check if user has access to view this teacher's data
            if (!hasAccess(AccessScope.USER, teacher.userId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher retrieved successfully", teacher, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get teacher by email")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> getByEmail(@PathVariable String email) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            TeacherDTO teacher = teacherService.getTeacherByEmail(email);
            
            // Check if user has access to view this teacher's data
            if (!hasAccess(AccessScope.USER, teacher.userId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher retrieved successfully", teacher, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get teacher by user ID")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> getByUserId(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to view this teacher's data
            if (!hasAccess(AccessScope.USER, userId)) {
                return createAccessDeniedResponse();
            }

            TeacherDTO teacher = teacherService.getTeacherByUserId(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher retrieved successfully", teacher, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active teachers")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getActiveTeachers() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering instead of unsafe memory filtering
            List<TeacherDTO> accessibleTeachers = teacherService.getActiveTeachersByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active teachers retrieved successfully", accessibleTeachers, null));
        } catch (Exception e) {
            log.error("Error retrieving active teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get teachers by course ID")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getTeachersByCourseId(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for course teachers
            List<TeacherDTO> accessibleTeachers = teacherService.getTeachersByCourseIdAndAccessibleScopes(courseId, currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teachers for course retrieved successfully", accessibleTeachers, null));
        } catch (Exception e) {
            log.error("Error retrieving teachers for course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get teachers by class ID")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getTeachersByClassId(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this class
            if (!hasAccess(AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this class", null, null));
            }

            // Use secure multi-tenant filtering for class teachers
            List<TeacherDTO> teachers = teacherService.getTeachersByClassIdAndAccessibleScopes(classId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teachers for class retrieved successfully", teachers, null));
        } catch (Exception e) {
            log.error("Error retrieving teachers for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get teachers by school ID")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getTeachersBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's data
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            List<TeacherDTO> teachers = teacherService.getTeachersBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teachers for school retrieved successfully", teachers, null));
        } catch (Exception e) {
            log.error("Error retrieving teachers for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get teachers by subject ID")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getTeachersBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for subject teachers
            List<TeacherDTO> accessibleTeachers = teacherService.getTeachersBySubjectIdAndAccessibleScopes(subjectId, currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teachers for subject retrieved successfully", accessibleTeachers, null));
        } catch (Exception e) {
            log.error("Error retrieving teachers for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a teacher")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateTeacher(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get teacher to check access
            TeacherDTO teacher = teacherService.getById(id);
            
            // Check if user has access to manage this teacher (requires access to teacher's school or higher)
            if (!hasAccess(AccessScope.SCHOOL, teacher.schoolId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            teacherService.deactivateTeacher(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a teacher")
    public ResponseEntity<OhmaApiResponse<Void>> activateTeacher(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get teacher to check access
            TeacherDTO teacher = teacherService.getById(id);
            
            // Check if user has access to manage this teacher (requires access to teacher's school or higher)
            if (!hasAccess(AccessScope.SCHOOL, teacher.schoolId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            teacherService.activateTeacher(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 