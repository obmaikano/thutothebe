package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.service.StudentService;
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
@RequestMapping("/students")
@Tag(name = "Student Management", description = "APIs for managing students")
public class StudentController extends BaseController<StudentDTO, Long> {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        super(studentService);
        this.studentService = studentService;
    }

    @GetMapping("/admission-number/{admissionNumber}")
    @Operation(summary = "Get student by admission number")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<StudentDTO>> getByAdmissionNumber(@PathVariable String admissionNumber) {
        try {
            StudentDTO student = studentService.getStudentByAdmissionNumber(admissionNumber);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student retrieved successfully", student, null));
        } catch (Exception e) {
            log.error("Error retrieving student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get student by email")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<StudentDTO>> getByEmail(@PathVariable String email) {
        try {
            StudentDTO student = studentService.getStudentByEmail(email);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student retrieved successfully", student, null));
        } catch (Exception e) {
            log.error("Error retrieving student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudents() {
        try {
            List<StudentDTO> students = studentService.getActiveStudents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get students by course ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsByCourseId(@PathVariable Long courseId) {
        try {
            List<StudentDTO> students = studentService.getStudentsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for course retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get students by class ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsByClassId(@PathVariable Long classId) {
        try {
            List<StudentDTO> students = studentService.getStudentsByClassId(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for class retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/enrolled")
    @Operation(summary = "Get students enrolled in class via join table")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsEnrolledInClass(@PathVariable Long classId) {
        try {
            List<StudentDTO> students = studentService.getStudentsEnrolledInClass(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Enrolled students for class retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving enrolled students for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get students by school ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsBySchoolId(@PathVariable Long schoolId) {
        try {
            List<StudentDTO> students = studentService.getStudentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for school retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a student")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateStudent(@PathVariable Long id) {
        try {
            studentService.deactivateStudent(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a student")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateStudent(@PathVariable Long id) {
        try {
            studentService.activateStudent(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/debug")
    @Operation(summary = "Debug enrollment data for a class")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<String>> debugClassEnrollment(@PathVariable Long classId) {
        try {
            String debugInfo = studentService.debugClassEnrollment(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Debug info retrieved", debugInfo, null));
        } catch (Exception e) {
            log.error("Error getting debug info: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/class/{classId}/cleanup")
    @Operation(summary = "Cleanup enrollment inconsistencies for a class")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> cleanupClassEnrollment(@PathVariable Long classId) {
        try {
            studentService.cleanupClassEnrollmentInconsistencies(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Enrollment inconsistencies cleaned up", null, null));
        } catch (Exception e) {
            log.error("Error cleaning up enrollment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get students by teacher ID (from assigned courses)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsByTeacherId(@PathVariable Long teacherId) {
        try {
            List<StudentDTO> students = studentService.getStudentsByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for teacher retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    @Operation(summary = "Get active students by teacher ID (from assigned courses)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsByTeacherId(@PathVariable Long teacherId) {
        try {
            List<StudentDTO> students = studentService.getActiveStudentsByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for teacher retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get students by subject ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsBySubjectId(@PathVariable Long subjectId) {
        try {
            List<StudentDTO> students = studentService.getStudentsBySubjectId(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for subject retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}/active")
    @Operation(summary = "Get active students by subject ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsBySubjectId(@PathVariable Long subjectId) {
        try {
            List<StudentDTO> students = studentService.getActiveStudentsBySubjectId(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for subject retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    @Operation(summary = "Get active students by course ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsByCourseId(@PathVariable Long courseId) {
        try {
            List<StudentDTO> students = studentService.getActiveStudentsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for course retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/active")
    @Operation(summary = "Get active students by class ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsByClassId(@PathVariable Long classId) {
        try {
            List<StudentDTO> students = studentService.getActiveStudentsByClassId(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for class retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 