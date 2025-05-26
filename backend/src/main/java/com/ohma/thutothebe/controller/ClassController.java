package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.ClassService;
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
@RequestMapping("/classes")
@Tag(name = "Class Management", description = "APIs for managing classes")
public class ClassController extends BaseController<ClassDTO, Long> {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        super(classService);
        this.classService = classService;
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get classes by school ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getBySchoolId(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getActiveClasses() {
        try {
            List<ClassDTO> classes = classService.getActiveClasses();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active classes retrieved successfully", classes, null));
        } catch (Exception e) {
            log.error("Error retrieving active classes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/active")
    @Operation(summary = "Get active classes by school ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
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

    @GetMapping("/{id}/with-students")
    @Operation(summary = "Get class by ID with enrolled students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
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
} 