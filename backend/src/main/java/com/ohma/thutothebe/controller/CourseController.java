package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.CourseType;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.service.CourseService;
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
@RequestMapping("/courses")
@Tag(name = "Course Management", description = "APIs for managing courses")
public class CourseController extends BaseController<CourseDTO, Long> {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        super(courseService);
        this.courseService = courseService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible class IDs and filter courses by those classes
            List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            if (accessibleClassIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible courses", List.of(), null));
            }

            List<CourseDTO> allCourses = courseService.getAll();
            List<CourseDTO> accessibleCourses = allCourses.stream()
                    .filter(course -> accessibleClassIds.contains(course.classId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", accessibleCourses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            CourseDTO course = courseService.getById(id);
            
            // Check if user has access to view this course (via class access)
            if (!hasAccess(AccessScope.CLASS, course.classId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course retrieved successfully", course, null));
        } catch (Exception e) {
            log.error("Error retrieving course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<CourseDTO>> create(@RequestBody CourseDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has permission to create courses in this class
            if (!hasAccess(AccessScope.CLASS, dto.classId())) {
                return createAccessDeniedResponse();
            }

            CourseDTO created = courseService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> update(@PathVariable Long id, @RequestBody CourseDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this course (via class access)
            CourseDTO existingCourse = courseService.getById(id);
            if (!hasAccess(AccessScope.CLASS, existingCourse.classId())) {
                return createAccessDeniedResponse();
            }

            CourseDTO updated = courseService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating course: {}", e.getMessage(), e);
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

            // Check if user has access to delete this course (via class access)
            CourseDTO course = courseService.getById(id);
            if (!hasAccess(AccessScope.CLASS, course.classId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            courseService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get course by code")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> getByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            CourseDTO course = courseService.getCourseByCode(code);
            
            // Check if user has access to view this course (via class access)
            if (!hasAccess(AccessScope.CLASS, course.classId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course retrieved successfully", course, null));
        } catch (Exception e) {
            log.error("Error retrieving course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active courses")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCourses() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible class IDs and filter active courses by those classes
            List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            if (accessibleClassIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible courses", List.of(), null));
            }

            List<CourseDTO> allActiveCourses = courseService.getActiveCourses().stream().toList();
            List<CourseDTO> accessibleCourses = allActiveCourses.stream()
                    .filter(course -> accessibleClassIds.contains(course.classId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", accessibleCourses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get courses by subject ID")
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
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByClassId(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this class's courses
            if (!hasAccess(AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this class", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this teacher's courses
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher data", null, null));
            }

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
    
    @GetMapping("/type/{type}")
    @Operation(summary = "Get courses by type (CORE or ELECTIVE)")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByType(@PathVariable CourseType type) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByType(type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses for type retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
    
    @GetMapping("/type/{type}/active")
    @Operation(summary = "Get active courses by type (CORE or ELECTIVE)")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesByType(@PathVariable CourseType type) {
        try {
            List<CourseDTO> courses = courseService.getActiveCoursesByType(type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses for type retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses for type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a course")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateCourse(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get course and check if user has access to manage it
            CourseDTO course = courseService.getById(id);
            if (!hasAccess(AccessScope.CLASS, course.classId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<Void>> activateCourse(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get course and check if user has access to manage it
            CourseDTO course = courseService.getById(id);
            if (!hasAccess(AccessScope.CLASS, course.classId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

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