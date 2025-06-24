package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.dto.ClassWithTeachersDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.service.impl.RuleBasedAccessControlServiceImpl;
import com.ohma.thutothebe.service.ClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/classes")
@Tag(name = "Class Management", description = "APIs for managing classes")
public class ClassController extends BaseController<ClassDTO, Long> {

    private final ClassService classService;
    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;
    private final RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    public ClassController(ClassService classService, ClassRepository classRepository, TeacherRepository teacherRepository, RuleBasedAccessControlServiceImpl accessControlService) {
        super(classService);
        this.classService = classService;
        this.classRepository = classRepository;
        this.teacherRepository = teacherRepository;
        this.accessControlService = accessControlService;
    }

    // ==================== SECURE MULTI-TENANT OVERRIDES ====================

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure database-level filtering instead of memory filtering
            List<ClassDTO> classes = classService.getClassesByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<ClassDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Validate access before retrieving
            if (!classService.validateClassAccess(id, currentUserId)) {
                return createAccessDeniedResponse();
            }

            ClassDTO classDTO = classService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class retrieved successfully", classDTO, null));
        } catch (Exception e) {
            log.error("Error retrieving class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<ClassDTO>> create(@Valid @RequestBody ClassDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Business rule validation is handled in service layer
            ClassDTO created = classService.createClass(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class created successfully", created, null));
        } catch (SecurityException e) {
            log.warn("Access denied creating class: {}", e.getMessage());
            return createAccessDeniedResponse();
        } catch (Exception e) {
            log.error("Error creating class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<ClassDTO>> update(@PathVariable Long id, @Valid @RequestBody ClassDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Validate access before updating
            if (!classService.validateClassAccess(id, currentUserId)) {
                return createAccessDeniedResponse();
            }

            ClassDTO updated = classService.updateClass(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class updated successfully", updated, null));
        } catch (SecurityException e) {
            log.warn("Access denied updating class: {}", e.getMessage());
            return createAccessDeniedResponse();
        } catch (Exception e) {
            log.error("Error updating class: {}", e.getMessage(), e);
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
            if (!classService.validateClassAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.deleteClass(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== SECURE CLASS-SPECIFIC ENDPOINTS ====================

    @GetMapping("/active")
    @Operation(summary = "Get all active classes with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getActiveClasses() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure database-level filtering
            List<ClassDTO> classes = classService.getActiveClassesByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving active classes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get classes by school ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get classes by region ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesByRegionId(@PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByRegionIdAndAccessibleScopes(regionId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by region: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/grade-level/{gradeLevel}")
    @Operation(summary = "Get classes by grade level with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesByGradeLevel(@PathVariable GradeLevel gradeLevel) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByGradeLevelAndAccessibleScopes(gradeLevel, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by grade level: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get classes by teacher ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by teacher: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    @Operation(summary = "Get active classes by teacher ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getActiveClassesByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving active classes by teacher: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get classes by student ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesByStudentId(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByStudentIdAndAccessibleScopes(studentId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by student: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/capacity/{minCapacity}")
    @Operation(summary = "Get classes by minimum capacity with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesByMinCapacity(@PathVariable Integer minCapacity) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByMinCapacityAndAccessibleScopes(minCapacity, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by min capacity: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/available")
    @Operation(summary = "Get available classes (with spots left) with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getAvailableClasses() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getAvailableClassesByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Available classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving available classes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/over-capacity/{overCapacity}")
    @Operation(summary = "Get classes by over capacity status with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesByOverCapacity(@PathVariable Boolean overCapacity) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.getClassesByOverCapacityAndAccessibleScopes(overCapacity, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes by over capacity: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search classes by name with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> searchClassesByName(@RequestParam String name) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<ClassDTO> classes = classService.searchClassesByNameAndAccessibleScopes(name, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error searching classes by name: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/with-students")
    @Operation(summary = "Get class by ID with enrolled students")
    public ResponseEntity<OhmaApiResponse<ClassDTO>> getClassWithStudents(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before retrieving
            if (!classService.validateClassAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            ClassDTO classDTO = classService.getClassWithStudents(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class with students retrieved successfully", classDTO, null));
        } catch (Exception e) {
            log.error("Error retrieving class with students: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== CLASS MANAGEMENT ENDPOINTS ====================

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a class")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateClass(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before deactivating
            if (!classService.validateClassAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.deactivateClass(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a class")
    public ResponseEntity<OhmaApiResponse<Void>> activateClass(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before activating
            if (!classService.validateClassAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.activateClass(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{classId}/teacher/{teacherId}")
    @Operation(summary = "Add a teacher to a class")
    public ResponseEntity<OhmaApiResponse<Void>> addTeacherToClass(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before adding teacher
            if (!classService.validateClassAccess(classId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.addTeacherToClass(classId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher added to class successfully", null, null));
        } catch (Exception e) {
            log.error("Error adding teacher to class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{classId}/teacher/{teacherId}")
    @Operation(summary = "Remove a teacher from a class")
    public ResponseEntity<OhmaApiResponse<Void>> removeTeacherFromClass(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before removing teacher
            if (!classService.validateClassAccess(classId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.removeTeacherFromClass(classId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher removed from class successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing teacher from class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{classId}/student/{studentId}")
    @Operation(summary = "Add a student to a class")
    public ResponseEntity<OhmaApiResponse<Void>> addStudentToClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before adding student
            if (!classService.validateClassAccess(classId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.addStudentToClass(classId, studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student added to class successfully", null, null));
        } catch (Exception e) {
            log.error("Error adding student to class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{classId}/student/{studentId}")
    @Operation(summary = "Remove a student from a class")
    public ResponseEntity<OhmaApiResponse<Void>> removeStudentFromClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before removing student
            if (!classService.validateClassAccess(classId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            classService.removeStudentFromClass(classId, studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student removed from class successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing student from class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== STATISTICS ENDPOINTS ====================

    @GetMapping("/statistics/count")
    @Operation(summary = "Get class count by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getClassCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = classService.getClassCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving class count: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/enrollment")
    @Operation(summary = "Get total enrollment by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalEnrollment() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long totalEnrollment = classService.getTotalEnrollmentByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total enrollment retrieved successfully", totalEnrollment, null));
        } catch (Exception e) {
            log.error("Error retrieving total enrollment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/capacity")
    @Operation(summary = "Get total capacity by accessible scopes")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalCapacity() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long totalCapacity = classService.getTotalCapacityByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total capacity retrieved successfully", totalCapacity, null));
        } catch (Exception e) {
            log.error("Error retrieving total capacity: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/with-teachers")
    @Operation(summary = "Get all classes with their teachers (full teacher details) with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<ClassWithTeachersDTO>>> getClassesWithTeachers() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }
            List<ClassWithTeachersDTO> classes = classService.getClassesWithTeachersByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes with teachers retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes with teachers: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    /**
     * Get all possible grade levels (enum values)
     */
    @GetMapping("/grade-levels")
    @Operation(summary = "Get all possible grade levels")
    public ResponseEntity<OhmaApiResponse<List<String>>> getAllGradeLevels() {
        try {
            List<String> gradeLevels = java.util.Arrays.stream(GradeLevel.values())
                    .map(Enum::name)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade levels retrieved successfully", gradeLevels, null));
        } catch (Exception e) {
            log.error("Error retrieving grade levels: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/debug")
    @Operation(summary = "Debug endpoint to check teacher-class assignments and access control")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> debugTeacherClasses(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Map<String, Object> debugInfo = new HashMap<>();
            
            // Check if teacher exists
            Optional<Teacher> teacherOpt = teacherRepository.findById(teacherId);
            debugInfo.put("teacherExists", teacherOpt.isPresent());
            
            if (teacherOpt.isPresent()) {
                Teacher teacher = teacherOpt.get();
                debugInfo.put("teacherId", teacher.getId());
                debugInfo.put("teacherName", teacher.getFirstName() + " " + teacher.getLastName());
                debugInfo.put("teacherSchoolId", teacher.getSchool() != null ? teacher.getSchool().getId() : null);
                debugInfo.put("teacherActive", teacher.isActive());
            }
            
            // Check all classes this teacher is assigned to (without access control)
            List<Class> allTeacherClasses = classRepository.findByTeacherId(teacherId);
            debugInfo.put("totalClassesAssigned", allTeacherClasses.size());
            debugInfo.put("assignedClasses", allTeacherClasses.stream()
                .map(c -> Map.of(
                    "id", c.getId(),
                    "name", c.getName(),
                    "schoolId", c.getSchool() != null ? c.getSchool().getId() : null,
                    "active", c.isActive()
                ))
                .collect(Collectors.toList()));
            
            // Check accessible school IDs for current user
            List<Long> accessibleSchoolIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL);
            List<Long> accessibleRegionIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.REGION);
            debugInfo.put("accessibleSchoolIds", accessibleSchoolIds);
            debugInfo.put("accessibleRegionIds", accessibleRegionIds);
            
            // Check classes with access control
            List<ClassDTO> accessibleClasses = classService.getClassesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            debugInfo.put("accessibleClassesCount", accessibleClasses.size());
            debugInfo.put("accessibleClasses", accessibleClasses);
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Debug information retrieved", debugInfo, null));
        } catch (Exception e) {
            log.error("Error in debug endpoint: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 