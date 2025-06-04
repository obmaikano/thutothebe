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

    // ==================== SECURE MULTI-TENANT OVERRIDES ====================

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure database-level filtering instead of memory filtering
            List<CourseDTO> courses = courseService.getCoursesByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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

            // Validate access before retrieving
            if (!courseService.validateCourseAccess(id, currentUserId)) {
                return createAccessDeniedResponse();
            }

            CourseDTO course = courseService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course retrieved successfully", course, null));
        } catch (Exception e) {
            log.error("Error retrieving course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<CourseDTO>> create(@Valid @RequestBody CourseDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Business rule validation is handled in service layer
            CourseDTO created = courseService.createCourse(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course created successfully", created, null));
        } catch (SecurityException e) {
            log.warn("Access denied creating course: {}", e.getMessage());
            return createAccessDeniedResponse();
        } catch (Exception e) {
            log.error("Error creating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> update(@PathVariable Long id, @Valid @RequestBody CourseDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Validate access before updating
            if (!courseService.validateCourseAccess(id, currentUserId)) {
                return createAccessDeniedResponse();
            }

            CourseDTO updated = courseService.updateCourse(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course updated successfully", updated, null));
        } catch (SecurityException e) {
            log.warn("Access denied updating course: {}", e.getMessage());
            return createAccessDeniedResponse();
        } catch (Exception e) {
            log.error("Error updating course: {}", e.getMessage(), e);
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
            if (!courseService.validateCourseAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            courseService.deleteCourse(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== SECURE COURSE-SPECIFIC ENDPOINTS ====================

    @GetMapping("/code/{code}")
    @Operation(summary = "Get course by code")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> getByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            CourseDTO course = courseService.getCourseByCode(code);
            
            // Validate access to the retrieved course
            if (!courseService.validateCourseAccess(course.id(), currentUserId)) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course retrieved successfully", course, null));
        } catch (Exception e) {
            log.error("Error retrieving course by code: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active courses with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCourses() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure database-level filtering
            List<CourseDTO> courses = courseService.getActiveCoursesByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get courses by subject ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesBySubjectIdAndAccessibleScopes(subjectId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by subject: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}/active")
    @Operation(summary = "Get active courses by subject ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesBySubjectIdAndAccessibleScopes(subjectId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses by subject: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get courses by class ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByClassId(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByClassIdAndAccessibleScopes(classId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/active")
    @Operation(summary = "Get active courses by class ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesByClassId(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByClassIdAndAccessibleScopes(classId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses by class: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get courses by teacher ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by teacher: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    @Operation(summary = "Get active courses by teacher ID with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses by teacher: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/term/{term}")
    @Operation(summary = "Get courses by term with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByTerm(@PathVariable Term term) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByTermAndAccessibleScopes(term, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by term: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/year/{year}")
    @Operation(summary = "Get courses by year with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByYear(@PathVariable Integer year) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByYearAndAccessibleScopes(year, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by year: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get courses by type with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByType(@PathVariable CourseType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByTypeAndAccessibleScopes(type, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by type: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{type}/active")
    @Operation(summary = "Get active courses by type with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCoursesByType(@PathVariable CourseType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByTypeAndAccessibleScopes(type, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving active courses by type: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== NEW SECURE ENDPOINTS ====================

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get courses by school ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by school: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get courses by region ID with access validation")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByRegionId(@PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CourseDTO> courses = courseService.getCoursesByRegionIdAndAccessibleScopes(regionId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses by region: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== COURSE MANAGEMENT ENDPOINTS ====================

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a course")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateCourse(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before deactivating
            if (!courseService.validateCourseAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            courseService.deactivateCourse(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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

            // Validate access before activating
            if (!courseService.validateCourseAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            courseService.activateCourse(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before adding teacher
            if (!courseService.validateCourseAccess(courseId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            courseService.addInstructorToCourse(courseId, teacherId, isPrimary);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher added to course successfully", null, null));
        } catch (Exception e) {
            log.error("Error adding teacher to course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{courseId}/teacher/{teacherId}")
    @Operation(summary = "Remove a teacher from a course")
    public ResponseEntity<OhmaApiResponse<Void>> removeTeacherFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before removing teacher
            if (!courseService.validateCourseAccess(courseId, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            courseService.removeInstructorFromCourse(courseId, teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher removed from course successfully", null, null));
        } catch (Exception e) {
            log.error("Error removing teacher from course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 