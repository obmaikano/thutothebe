package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.service.TeacherService;
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
@RequestMapping("/api/teachers")
@Tag(name = "Teacher Management", description = "APIs for managing teachers/instructors")
public class TeacherController extends BaseController<TeacherDTO, Long> {

    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        super(teacherService);
        this.teacherService = teacherService;
    }

    @GetMapping("/staff-id/{staffId}")
    @Operation(summary = "Get teacher by staff ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> getByStaffId(@PathVariable String staffId) {
        try {
            TeacherDTO teacher = teacherService.getTeacherByStaffId(staffId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher retrieved successfully", teacher, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get teacher by email")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> getByEmail(@PathVariable String email) {
        try {
            TeacherDTO teacher = teacherService.getTeacherByEmail(email);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher retrieved successfully", teacher, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active teachers")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getActiveTeachers() {
        try {
            List<TeacherDTO> teachers = teacherService.getActiveTeachers();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active teachers retrieved successfully", teachers, null));
        } catch (Exception e) {
            log.error("Error retrieving active teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get teachers by course ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<TeacherDTO>>> getTeachersByCourseId(@PathVariable Long courseId) {
        try {
            List<TeacherDTO> teachers = teacherService.getTeachersByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teachers for course retrieved successfully", teachers, null));
        } catch (Exception e) {
            log.error("Error retrieving teachers for course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> createTeacher(@Valid @RequestBody TeacherDTO teacherDTO) {
        try {
            TeacherDTO created = teacherService.createTeacher(teacherDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<TeacherDTO>> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherDTO teacherDTO) {
        try {
            TeacherDTO updated = teacherService.updateTeacher(id, teacherDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteTeacher(@PathVariable Long id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateTeacher(@PathVariable Long id) {
        try {
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateTeacher(@PathVariable Long id) {
        try {
            teacherService.activateTeacher(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 