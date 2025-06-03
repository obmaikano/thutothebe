package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.service.AssignmentService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/assignments")
public class AssignmentController extends BaseController<AssignmentDTO, Long> {

    private final AssignmentService assignmentService;
    private final CourseService courseService;
    private final UserService userService;

    public AssignmentController(AssignmentService assignmentService,
                              CourseService courseService,
                              UserService userService) {
        super(assignmentService);
        this.assignmentService = assignmentService;
        this.courseService = courseService;
        this.userService = userService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering instead of unsafe memory filtering
            List<AssignmentDTO> accessibleAssignments = assignmentService.getAssignmentsByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assignments retrieved successfully", accessibleAssignments, null));
        } catch (Exception e) {
            log.error("Error retrieving assignments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<AssignmentDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            AssignmentDTO assignment = assignmentService.getById(id);
            
            // Check if user has access to view this assignment (via course/class access)
            if (!hasAccess(AccessScope.CLASS, assignment.courseId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(OhmaApiResponse.success(assignment));
        } catch (Exception e) {
            log.error("Error retrieving assignment: ", e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<AssignmentDTO>> create(@RequestBody AssignmentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has permission to create assignments in this course/class
            if (!hasAccess(AccessScope.CLASS, dto.courseId())) {
                return createAccessDeniedResponse();
            }

            AssignmentDTO created = assignmentService.create(dto);
            return ResponseEntity.ok(OhmaApiResponse.success(created));
        } catch (Exception e) {
            log.error("Error creating assignment: ", e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<AssignmentDTO>> update(@PathVariable Long id, @RequestBody AssignmentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this assignment
            AssignmentDTO existingAssignment = assignmentService.getById(id);
            if (!hasAccess(AccessScope.CLASS, existingAssignment.courseId())) {
                return createAccessDeniedResponse();
            }

            AssignmentDTO updated = assignmentService.update(id, dto);
            return ResponseEntity.ok(OhmaApiResponse.success(updated));
        } catch (Exception e) {
            log.error("Error updating assignment: ", e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to delete this assignment
            AssignmentDTO assignment = assignmentService.getById(id);
            if (!hasAccess(AccessScope.CLASS, assignment.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied"));
            }

            assignmentService.delete(id);
            return ResponseEntity.ok(OhmaApiResponse.success(null));
        } catch (Exception e) {
            log.error("Error deleting assignment: ", e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<OhmaApiResponse<AssignmentDTO>> getAssignmentByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            AssignmentDTO assignment = assignmentService.getAssignmentByCode(code);
            
            // Check if user has access to view this assignment
            if (!hasAccess(AccessScope.CLASS, assignment.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied"));
            }

            return ResponseEntity.ok(OhmaApiResponse.success(assignment));
        } catch (Exception e) {
            log.error("Error getting assignment by code: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Assignment not found with code: " + code));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this course's assignments
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course data", null, null));
            }

            // Use secure multi-tenant filtering for course assignments
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByCourseIdAndAccessibleScopes(courseId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course assignments retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error getting assignments by course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignments() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering instead of unsafe memory filtering
            List<AssignmentDTO> accessibleActiveAssignments = assignmentService.getActiveAssignmentsByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active assignments retrieved successfully", accessibleActiveAssignments, null));
        } catch (Exception e) {
            log.error("Error retrieving active assignments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this course's assignments
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course data", null, null));
            }

            // Use secure multi-tenant filtering for active course assignments
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByCourseIdAndAccessibleScopes(courseId, currentUserId);
            // Filter for active assignments at service level would be better, but this maintains existing API
            List<AssignmentDTO> activeAssignments = assignments.stream()
                    .filter(assignment -> assignment.active())
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active course assignments retrieved successfully", activeAssignments, null));
        } catch (Exception e) {
            log.error("Error getting active assignments by course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this teacher's assignments
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher data", null, null));
            }

            // Use secure multi-tenant filtering for teacher assignments
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher assignments retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error getting assignments by teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this teacher's assignments
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher data", null, null));
            }

            // Use secure multi-tenant filtering for active teacher assignments
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByTeacherIdAndAccessibleScopes(teacherId, currentUserId);
            List<AssignmentDTO> activeAssignments = assignments.stream()
                    .filter(assignment -> assignment.active())
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active teacher assignments retrieved successfully", activeAssignments, null));
        } catch (Exception e) {
            log.error("Error getting active assignments by teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this instructor's assignments
            if (!hasAccess(AccessScope.USER, instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to instructor data", null, null));
            }

            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByInstructor(instructorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Instructor assignments retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error getting assignments by instructor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/instructor/{instructorId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByInstructor(@PathVariable Long instructorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this instructor's assignments
            if (!hasAccess(AccessScope.USER, instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to instructor data", null, null));
            }

            List<AssignmentDTO> assignments = assignmentService.getActiveAssignmentsByInstructor(instructorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active instructor assignments retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error getting active assignments by instructor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByStatus(@PathVariable String status) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for status-based assignments
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByStatusAndAccessibleScopes(status, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assignments by status retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error getting assignments by status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsBySchoolId(@PathVariable Long schoolId) {
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

            List<AssignmentDTO> assignments = assignmentService.getAssignmentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School assignments retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error retrieving assignments for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for subject assignments
            List<AssignmentDTO> accessibleAssignments = assignmentService.getAssignmentsBySubjectIdAndAccessibleScopes(subjectId, currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject assignments retrieved successfully", accessibleAssignments, null));
        } catch (Exception e) {
            log.error("Error retrieving assignments for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 