package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.repository.ClassRepository;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/classes")
@Tag(name = "Class Management", description = "APIs for managing classes")
public class ClassController extends BaseController<ClassDTO, Long> {

    private final ClassService classService;
    private final ClassRepository classRepository;

    @Autowired
    public ClassController(ClassService classService, ClassRepository classRepository) {
        super(classService);
        this.classService = classService;
        this.classRepository = classRepository;
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get classes by school ID")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getBySchoolId(@PathVariable Long schoolId) {
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

            List<ClassDTO> classes = classService.getClassesBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active classes")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getActiveClasses() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible class IDs and filter active classes
            List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            if (accessibleClassIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible classes", List.of(), null));
            }

            List<ClassDTO> allActiveClasses = classService.getActiveClasses();
            List<ClassDTO> accessibleActiveClasses = allActiveClasses.stream()
                    .filter(classDTO -> accessibleClassIds.contains(classDTO.id()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active classes retrieved successfully", accessibleActiveClasses, null));
        } catch (Exception e) {
            log.error("Error retrieving active classes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/active")
    @Operation(summary = "Get active classes by school ID")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getActiveBySchoolId(@PathVariable Long schoolId) {
        try {
            List<ClassDTO> classes = classService.getActiveClassesBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving active classes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/teacher/{teacherId}")
    @Operation(summary = "Get classes by school ID and teacher ID")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getBySchoolIdAndTeacherId(
            @PathVariable Long schoolId,
            @PathVariable Long teacherId) {
        try {
            List<ClassDTO> classes = classService.getClassesBySchoolIdAndTeacherId(schoolId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/student/{studentId}")
    @Operation(summary = "Get classes by school ID and student ID")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getBySchoolIdAndStudentId(
            @PathVariable Long schoolId,
            @PathVariable Long studentId) {
        try {
            List<ClassDTO> classes = classService.getClassesBySchoolIdAndStudentId(schoolId, studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/with-teachers")
    @Operation(summary = "Get class by ID with teachers")
    public ResponseEntity<OhmaApiResponse<ClassDTO>> getClassWithTeachers(@PathVariable Long id) {
        try {
            ClassDTO classDTO = classService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class with teachers retrieved successfully", classDTO, null));
        } catch (Exception e) {
            log.error("Error retrieving class with teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/with-students")
    @Operation(summary = "Get class by ID with enrolled students")
    public ResponseEntity<OhmaApiResponse<ClassDTO>> getClassWithStudents(@PathVariable Long id) {
        try {
            ClassDTO classDTO = classService.getClassWithStudents(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class with students retrieved successfully", classDTO, null));
        } catch (Exception e) {
            log.error("Error retrieving class with students: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a class")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateClass(@PathVariable Long id) {
        try {
            classService.deactivateClass(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a class")
    public ResponseEntity<OhmaApiResponse<Void>> activateClass(@PathVariable Long id) {
        try {
            classService.activateClass(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{classId}/teacher/{teacherId}")
    @Operation(summary = "Add a teacher to a class")
    public ResponseEntity<OhmaApiResponse<Void>> addTeacherToClass(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {
        try {
            classService.addTeacherToClass(classId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher added to class successfully", null, null));
        } catch (Exception e) {
            log.error("Error adding teacher to class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{classId}/teacher/{teacherId}")
    @Operation(summary = "Remove a teacher from a class")
    public ResponseEntity<OhmaApiResponse<Void>> removeTeacherFromClass(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {
        try {
            classService.removeTeacherFromClass(classId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher removed from class successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing teacher from class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{classId}/student/{studentId}")
    @Operation(summary = "Add a student to a class")
    public ResponseEntity<OhmaApiResponse<Void>> addStudentToClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        try {
            classService.addStudentToClass(classId, studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student added to class successfully", null, null));
        } catch (Exception e) {
            log.error("Error adding student to class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{classId}/student/{studentId}")
    @Operation(summary = "Remove a student from a class")
    public ResponseEntity<OhmaApiResponse<Void>> removeStudentFromClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        try {
            classService.removeStudentFromClass(classId, studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student removed from class successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing student from class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get classes by teacher ID")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getByTeacherId(@PathVariable Long teacherId) {
        try {
            List<ClassDTO> classes = classService.getClassesByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    @Operation(summary = "Get active classes by teacher ID")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getActiveByTeacherId(@PathVariable Long teacherId) {
        try {
            List<ClassDTO> activeClasses = classService.getActiveClassesByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active classes retrieved successfully", activeClasses, null));
        } catch (Exception e) {
            log.error("Error retrieving active classes for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/with-teachers")
    @Operation(summary = "Get all classes with teachers")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getClassesWithTeachers() {
        try {
            List<ClassDTO> classes = classService.getAll();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Classes with teachers retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving classes with teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/debug-teachers")
    @Operation(summary = "Debug: Get teacher assignments for a class")
    public ResponseEntity<OhmaApiResponse<Object>> debugTeacherAssignments(@PathVariable Long id) {
        try {
            Class classEntity = classRepository.findByIdWithTeachers(id)
                .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
            
            Map<String, Object> debugInfo = new HashMap<>();
            debugInfo.put("classId", classEntity.getId());
            debugInfo.put("className", classEntity.getName());
            debugInfo.put("teachersCount", classEntity.getTeachers() != null ? classEntity.getTeachers().size() : 0);
            
            if (classEntity.getTeachers() != null) {
                List<Map<String, Object>> teacherDetails = classEntity.getTeachers().stream()
                    .map(teacher -> {
                        Map<String, Object> teacherInfo = new HashMap<>();
                        teacherInfo.put("id", teacher.getId());
                        teacherInfo.put("firstName", teacher.getFirstName());
                        teacherInfo.put("lastName", teacher.getLastName());
                        teacherInfo.put("email", teacher.getEmail());
                        teacherInfo.put("staffId", teacher.getStaffId());
                        return teacherInfo;
                    })
                    .collect(Collectors.toList());
                debugInfo.put("teachers", teacherDetails);
            }
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Debug info retrieved successfully", debugInfo, null));
        } catch (Exception e) {
            log.error("Error retrieving debug info: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 