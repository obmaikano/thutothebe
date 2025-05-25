package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.service.AssignmentService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/code/{code}")
    public ResponseEntity<OhmaApiResponse<AssignmentDTO>> getAssignmentByCode(@PathVariable String code) {
        try {
            AssignmentDTO assignment = assignmentService.getAssignmentByCode(code);
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
            List<AssignmentDTO> assignments = assignmentService.getActive();
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting active assignments: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Error getting active assignments: " + e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByCourse(@PathVariable Long courseId) {
        try {
            List<AssignmentDTO> assignments = assignmentService.getActiveByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting active assignments by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByTeacher(@PathVariable Long teacherId) {
        try {
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting assignments by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByTeacher(@PathVariable Long teacherId) {
        try {
            List<AssignmentDTO> assignments = assignmentService.getActiveAssignmentsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting active assignments by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        try {
            List<AssignmentDTO> assignments = assignmentService.getAssignmentsByInstructor(instructorId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting assignments by instructor: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Instructor not found with id: " + instructorId));
        }
    }

    @GetMapping("/instructor/{instructorId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<AssignmentDTO>>> getActiveAssignmentsByInstructor(@PathVariable Long instructorId) {
        try {
            List<AssignmentDTO> assignments = assignmentService.getActiveAssignmentsByInstructor(instructorId);
            return ResponseEntity.ok(OhmaApiResponse.success(assignments));
        } catch (Exception e) {
            log.error("Error getting active assignments by instructor: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Instructor not found with id: " + instructorId));
        }
    }
} 