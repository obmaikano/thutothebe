package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.mapper.AssignmentMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.service.AssignmentService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.SubmissionService;
import com.ohma.thutothebe.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/submissions")
public class SubmissionController extends BaseController<SubmissionDTO, Long> {

    private final SubmissionService submissionService;
    private final AssignmentService assignmentService;
    private final CourseService courseService;
    private final UserService userService;
    private final AssignmentMapper assignmentMapper;
    private final CourseMapper courseMapper;
    private final UserMapper userMapper;

    public SubmissionController(SubmissionService submissionService,
                              AssignmentService assignmentService,
                              CourseService courseService,
                              UserService userService,
                              AssignmentMapper assignmentMapper,
                              CourseMapper courseMapper,
                              UserMapper userMapper) {
        super(submissionService);
        this.submissionService = submissionService;
        this.assignmentService = assignmentService;
        this.courseService = courseService;
        this.userService = userService;
        this.assignmentMapper = assignmentMapper;
        this.courseMapper = courseMapper;
        this.userMapper = userMapper;
    }

    @GetMapping("/assignment/{assignmentId}/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<SubmissionDTO>> getSubmissionByAssignmentAndStudent(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId) {
        try {
            var assignmentDTO = assignmentService.getById(assignmentId);
            var courseDTO = courseService.getById(assignmentDTO.courseId());
            var course = courseMapper.toEntity(courseDTO);
            var instructorDTO = userService.getById(assignmentDTO.instructorId());
            var instructor = userMapper.toEntity(instructorDTO);
            var assignment = assignmentMapper.toEntity(assignmentDTO);
            var studentDTO = userService.getById(studentId);
            var student = userMapper.toEntity(studentDTO);
            SubmissionDTO submission = submissionService.getSubmissionByAssignmentAndStudent(assignment.getId(), student.getId());
            return ResponseEntity.ok(OhmaApiResponse.success(submission));
        } catch (Exception e) {
            log.error("Error getting submission: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, e.getMessage()));
        }
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getSubmissionsByAssignment(
            @PathVariable Long assignmentId) {
        try {
            var assignmentDTO = assignmentService.getById(assignmentId);
            var courseDTO = courseService.getById(assignmentDTO.courseId());
            var course = courseMapper.toEntity(courseDTO);
            var instructorDTO = userService.getById(assignmentDTO.instructorId());
            var instructor = userMapper.toEntity(instructorDTO);
            var assignment = assignmentMapper.toEntity(assignmentDTO);
            List<SubmissionDTO> submissions = submissionService.getSubmissionsByAssignment(assignment.getId());
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting submissions by assignment: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Assignment not found with id: " + assignmentId));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getSubmissionsByStudent(
            @PathVariable Long studentId) {
        try {
            var studentDTO = userService.getById(studentId);
            var student = userMapper.toEntity(studentDTO);
            List<SubmissionDTO> submissions = submissionService.getSubmissionsByStudent(student.getId());
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting submissions by student: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Student not found with id: " + studentId));
        }
    }

    @GetMapping("/assignment/{assignmentId}/graded")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getGradedSubmissionsByAssignment(
            @PathVariable Long assignmentId) {
        try {
            var assignmentDTO = assignmentService.getById(assignmentId);
            var courseDTO = courseService.getById(assignmentDTO.courseId());
            var course = courseMapper.toEntity(courseDTO);
            var instructorDTO = userService.getById(assignmentDTO.instructorId());
            var instructor = userMapper.toEntity(instructorDTO);
            var assignment = assignmentMapper.toEntity(assignmentDTO);
            List<SubmissionDTO> submissions = submissionService.getGradedSubmissionsByAssignment(assignment.getId());
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting graded submissions by assignment: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Assignment not found with id: " + assignmentId));
        }
    }

    @GetMapping("/student/{studentId}/graded")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getGradedSubmissionsByStudent(
            @PathVariable Long studentId) {
        try {
            var studentDTO = userService.getById(studentId);
            var student = userMapper.toEntity(studentDTO);
            List<SubmissionDTO> submissions = submissionService.getGradedSubmissionsByStudent(student.getId());
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting graded submissions by student: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Student not found with id: " + studentId));
        }
    }

    @PostMapping("/{id}/grade")
    public ResponseEntity<OhmaApiResponse<SubmissionDTO>> gradeSubmission(
            @PathVariable Long id,
            @RequestParam Integer score,
            @RequestParam(required = false) String feedback) {
        try {
            SubmissionDTO submission = submissionService.gradeSubmission(id, score, feedback);
            return ResponseEntity.ok(OhmaApiResponse.success(submission));
        } catch (Exception e) {
            log.error("Error grading submission: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Submission not found with id: " + id));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getSubmissionsByTeacher(@PathVariable Long teacherId) {
        try {
            List<SubmissionDTO> submissions = submissionService.getSubmissionsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting submissions by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/teacher/{teacherId}/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getPendingSubmissionsByTeacher(@PathVariable Long teacherId) {
        try {
            List<SubmissionDTO> submissions = submissionService.getPendingSubmissionsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting pending submissions by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/teacher/{teacherId}/late")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getLateSubmissionsByTeacher(@PathVariable Long teacherId) {
        try {
            List<SubmissionDTO> submissions = submissionService.getLateSubmissionsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting late submissions by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/course/{courseId}/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getPendingSubmissionsByCourse(@PathVariable Long courseId) {
        try {
            List<SubmissionDTO> submissions = submissionService.getPendingSubmissionsByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting pending submissions by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }

    @GetMapping("/course/{courseId}/late")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getLateSubmissionsByCourse(@PathVariable Long courseId) {
        try {
            List<SubmissionDTO> submissions = submissionService.getLateSubmissionsByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting late submissions by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }
} 