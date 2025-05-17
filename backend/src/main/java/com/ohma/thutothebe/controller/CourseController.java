package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.service.CourseService;
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
@RequestMapping("/api/courses")
@Tag(name = "Course Management", description = "APIs for managing courses")
public class CourseController extends BaseController<CourseDTO, Long> {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        super(courseService);
        this.courseService = courseService;
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get course by code")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> getByCode(@PathVariable String code) {
        try {
            CourseDTO course = courseService.getCourseByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course retrieved successfully", course, null));
        } catch (Exception e) {
            log.error("Error retrieving course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active courses")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCourses() {
        try {
            List<CourseDTO> courses = courseService.getActiveCourses().stream().toList();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get courses by subject ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesBySubjectId(@PathVariable Long subjectId) {
        try {
            List<CourseDTO> courses = courseService.getCoursesBySubjectId(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses for subject retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @GetMapping("/subject/{subjectId}/active")
    @Operation(summary = "Get active courses by subject ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesBySubjectId(@PathVariable Long subjectId) {
        try {
            List<CourseDTO> courses = courseService.getActiveCoursesbySubjectId(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses for subject retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get courses by class ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByClassId(@PathVariable Long classId) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByClassId(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses for class retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @GetMapping("/class/{classId}/active")
    @Operation(summary = "Get active courses by class ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesByClassId(@PathVariable Long classId) {
        try {
            List<CourseDTO> courses = courseService.getActiveCoursesByClassId(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses for class retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get courses by teacher ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses for teacher retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @GetMapping("/teacher/{teacherId}/active")
    @Operation(summary = "Get active courses by teacher ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesByTeacherId(@PathVariable Long teacherId) {
        try {
            List<CourseDTO> courses = courseService.getActiveCoursesByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses for teacher retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @GetMapping("/term/{term}")
    @Operation(summary = "Get courses by term")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByTerm(@PathVariable Term term) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByTerm(term);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses for term retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for term: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @GetMapping("/year/{year}")
    @Operation(summary = "Get courses by year")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByYear(@PathVariable Integer year) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByYear(year);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses for year retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for year: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        try {
            CourseDTO created = courseService.createCourse(courseDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseDTO courseDTO) {
        try {
            CourseDTO updated = courseService.updateCourse(id, courseDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateCourse(@PathVariable Long id) {
        try {
            courseService.deactivateCourse(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateCourse(@PathVariable Long id) {
        try {
            courseService.activateCourse(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @PostMapping("/{courseId}/teacher/{teacherId}")
    @Operation(summary = "Add a teacher to a course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> addTeacherToCourse(
            @PathVariable Long courseId,
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "false") boolean isPrimary) {
        try {
            courseService.addInstructorToCourse(courseId, teacherId, isPrimary);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher added to course successfully", null, null));
        } catch (Exception e) {
            log.error("Error adding teacher to course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @DeleteMapping("/{courseId}/teacher/{teacherId}")
    @Operation(summary = "Remove a teacher from a course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> removeTeacherFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long teacherId) {
        try {
            courseService.removeInstructorFromCourse(courseId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher removed from course successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing teacher from course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 