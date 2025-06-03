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
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Get accessible class IDs and filter assignments by those classes
            List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            if (accessibleClassIds.isEmpty()) {
                return ResponseEntity.ok(OhmaApiResponse.success(List.of()));
            }

            List<AssignmentDTO> allAssignments = assignmentService.getAll();
            List<AssignmentDTO> accessibleAssignments = allAssignments.stream()
                    .filter(assignment -> accessibleClassIds.contains(assignment.courseId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(OhmaApiResponse.success(accessibleAssignments));
        } catch (Exception e) {
            log.error("Error retrieving assignments: ", e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
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
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to view this course's assignments
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied to course data"));
            }

            List<AssignmentDTO> assignments = assignmentService.getByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting assignments by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignments() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Get accessible class IDs and filter active assignments by those classes
            List<Long> accessibleClassIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            if (accessibleClassIds.isEmpty()) {
                return ResponseEntity.ok(OhmaApiResponse.success(List.of()));
            }

            List<AssignmentDTO> allActiveAssignments = assignmentService.getActive();
            List<AssignmentDTO> accessibleActiveAssignments = allActiveAssignments.stream()
                    .filter(assignment -> accessibleClassIds.contains(assignment.courseId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(OhmaApiResponse.success(accessibleActiveAssignments));
        } catch (Exception e) {
            log.error("Error getting active assignments: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Error getting active assignments: " + e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to view this course's active assignments
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied to course data"));
            }

            List<AssignmentDTO> activeAssignments = assignmentService.getActiveByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(activeAssignments));
        } catch (Exception e) {
            log.error("Error getting active assignments by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to view this teacher's assignments
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied to teacher data"));
            }

            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting assignments by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to view this teacher's assignments
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied to teacher data"));
            }

            List<AssignmentDTO> assignments = assignmentService.getActiveAssignmentsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting active assignments by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to view this instructor's assignments
            if (!hasAccess(AccessScope.USER, instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied to instructor data"));
            }

            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByInstructor(instructorId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting assignments by instructor: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Instructor not found with id: " + instructorId));
        }
    }

    @GetMapping("/instructor/{instructorId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByInstructor(@PathVariable Long instructorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OhmaApiResponse.error(401, "Authentication required"));
            }

            // Check if user has access to view this instructor's assignments
            if (!hasAccess(AccessScope.USER, instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(OhmaApiResponse.error(403, "Access denied to instructor data"));
            }

            List<AssignmentDTO> assignments = assignmentService.getActiveAssignmentsByInstructor(instructorId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting active assignments by instructor: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Instructor not found with id: " + instructorId));
        }
    }
} 