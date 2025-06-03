package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.AccessScope;
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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get assignment to check course access
            var assignmentDTO = assignmentService.getById(assignmentId);
            
            // Check if user has access to view submissions for this assignment (class-level access or student self-access)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId()) && !hasAccess(AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view this submission", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get assignment to check course access
            var assignmentDTO = assignmentService.getById(assignmentId);
            
            // Check if user has access to view all submissions for this assignment (class-level access required)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view assignment submissions", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view submissions for this student (self-access or admin access)
            if (!hasAccess(AccessScope.USER, studentId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view student submissions", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get assignment to check course access
            var assignmentDTO = assignmentService.getById(assignmentId);
            
            // Check if user has access to view graded submissions for this assignment (class-level access required)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view graded submissions", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view graded submissions for this student (self-access or admin access)
            if (!hasAccess(AccessScope.USER, studentId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view student graded submissions", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get submission to check assignment and course access
            SubmissionDTO submissionDTO = submissionService.getById(id);
            var assignmentDTO = assignmentService.getById(submissionDTO.assignmentId());
            
            // Check if user has access to grade submissions for this assignment (class-level access required)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to grade this submission", null, null));
            }

            SubmissionDTO submission = submissionService.gradeSubmission(id, score, feedback);
            return ResponseEntity.ok(OhmaApiResponse.success(submission));
        } catch (Exception e) {
            log.error("Error grading submission: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Submission not found with id: " + id));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getSubmissionsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view submissions for this teacher (self-access or admin access)
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view teacher submissions", null, null));
            }

            List<SubmissionDTO> submissions = submissionService.getSubmissionsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting submissions by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/teacher/{teacherId}/pending")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getPendingSubmissionsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view pending submissions for this teacher (self-access or admin access)
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view teacher pending submissions", null, null));
            }

            List<SubmissionDTO> submissions = submissionService.getPendingSubmissionsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting pending submissions by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/teacher/{teacherId}/late")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getLateSubmissionsByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view late submissions for this teacher (self-access or admin access)
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view teacher late submissions", null, null));
            }

            List<SubmissionDTO> submissions = submissionService.getLateSubmissionsByTeacher(teacherId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting late submissions by teacher: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/course/{courseId}/pending")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getPendingSubmissionsByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view pending submissions for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view course pending submissions", null, null));
            }

            List<SubmissionDTO> submissions = submissionService.getPendingSubmissionsByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting pending submissions by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }

    @GetMapping("/course/{courseId}/late")
    public ResponseEntity<OhmaApiResponse<List<SubmissionDTO>>> getLateSubmissionsByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view late submissions for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view course late submissions", null, null));
            }

            List<SubmissionDTO> submissions = submissionService.getLateSubmissionsByCourse(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(submissions));
        } catch (Exception e) {
            log.error("Error getting late submissions by course: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with id: " + courseId));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<SubmissionDTO>> create(@RequestBody SubmissionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get assignment to check course access
            var assignmentDTO = assignmentService.getById(dto.assignmentId());
            
            // Check if user has access to create submissions for this assignment (class-level access or student self-access)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId()) && !hasAccess(AccessScope.USER, dto.studentId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create submission for this assignment", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            log.error("Error creating submission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<SubmissionDTO>> update(@PathVariable Long id, @RequestBody SubmissionDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing submission to check access
            SubmissionDTO existingSubmission = submissionService.getById(id);
            if (existingSubmission == null) {
                return ResponseEntity.notFound().build();
            }

            var assignmentDTO = assignmentService.getById(existingSubmission.assignmentId());
            
            // Check if user has access to update this submission (class-level access or student self-access)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId()) && !hasAccess(AccessScope.USER, existingSubmission.studentId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update this submission", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            log.error("Error updating submission: {}", e.getMessage(), e);
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

            // Get existing submission to check access
            SubmissionDTO existingSubmission = submissionService.getById(id);
            if (existingSubmission == null) {
                return ResponseEntity.notFound().build();
            }

            var assignmentDTO = assignmentService.getById(existingSubmission.assignmentId());
            
            // Check if user has access to delete this submission (class-level access required)
            if (!hasAccess(AccessScope.CLASS, assignmentDTO.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete this submission", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            log.error("Error deleting submission: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 