package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.dto.CreateQuizDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.QuizStatus;
import com.ohma.thutothebe.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/quizzes")
@Tag(name = "Quiz Management", description = "APIs for managing quizzes")
public class QuizController extends BaseController<QuizDTO, Long> {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        super(quizService);
        this.quizService = quizService;
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new quiz")
    public ResponseEntity<OhmaApiResponse<QuizDTO>> createQuiz(@RequestBody CreateQuizDTO createQuizDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to create quizzes for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, createQuizDTO.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create quiz for this course", null, null));
            }

            // Check if user has access to create quizzes for this instructor (user-level access required)
            if (!hasAccess(AccessScope.USER, createQuizDTO.instructorId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create quiz for this instructor", null, null));
            }

            QuizDTO created = quizService.createQuiz(createQuizDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quiz created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating quiz: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering instead of unsafe memory filtering
            List<QuizDTO> accessibleQuizzes = quizService.getQuizzesByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", accessibleQuizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get a quiz by code")
    public ResponseEntity<OhmaApiResponse<QuizDTO>> getByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view quizzes (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view quiz", null, null));
            }

            QuizDTO quiz = quizService.getByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quiz retrieved successfully", quiz, null));
        } catch (Exception e) {
            log.error("Error retrieving quiz: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get quizzes by course ID")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getByCourseId(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view quizzes for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view course quizzes", null, null));
            }

            // Use secure multi-tenant filtering for course quizzes
            List<QuizDTO> quizzes = quizService.getQuizzesByCourseIdAndAccessibleScopes(courseId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", quizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/instructor/{instructorId}")
    @Operation(summary = "Get quizzes by instructor ID")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getByInstructorId(@PathVariable Long instructorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this instructor's quizzes
            if (!hasAccess(AccessScope.USER, instructorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view instructor quizzes", null, null));
            }

            // Use secure multi-tenant filtering for instructor quizzes
            List<QuizDTO> quizzes = quizService.getQuizzesByTeacherIdAndAccessibleScopes(instructorId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Instructor quizzes retrieved successfully", quizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving instructor quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get quizzes by status")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getByStatus(@PathVariable QuizStatus status) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for status-based quizzes
            List<QuizDTO> quizzes = quizService.getQuizzesByStatusAndAccessibleScopes(status, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", quizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/status/{status}")
    @Operation(summary = "Get quizzes by course ID and status")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getByCourseIdAndStatus(
            @PathVariable Long courseId,
            @PathVariable QuizStatus status) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view quizzes for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view course quizzes by status", null, null));
            }

            // Use secure multi-tenant filtering for course quizzes, then filter by status
            List<QuizDTO> courseQuizzes = quizService.getQuizzesByCourseIdAndAccessibleScopes(courseId, currentUserId);
            List<QuizDTO> filteredQuizzes = courseQuizzes.stream()
                    .filter(quiz -> quiz.status() == status)
                    .toList();
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", filteredQuizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    @Operation(summary = "Get active quizzes by course ID")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getActiveByCourseId(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view active quizzes for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view active course quizzes", null, null));
            }

            // Use secure multi-tenant filtering for active course quizzes
            List<QuizDTO> courseQuizzes = quizService.getQuizzesByCourseIdAndAccessibleScopes(courseId, currentUserId);
            List<QuizDTO> activeQuizzes = courseQuizzes.stream()
                    .filter(quiz -> quiz.active())
                    .toList();
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active quizzes retrieved successfully", activeQuizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active quizzes")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getActiveQuizzes() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for active quizzes
            List<QuizDTO> activeQuizzes = quizService.getActiveQuizzesByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active quizzes retrieved successfully", activeQuizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving active quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get quizzes by school ID")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getQuizzesBySchoolId(@PathVariable Long schoolId) {
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

            List<QuizDTO> quizzes = quizService.getQuizzesBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School quizzes retrieved successfully", quizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get quizzes by subject ID")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getQuizzesBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for subject quizzes
            List<QuizDTO> accessibleQuizzes = quizService.getQuizzesBySubjectIdAndAccessibleScopes(subjectId, currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject quizzes retrieved successfully", accessibleQuizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists/{code}")
    @Operation(summary = "Check if a quiz exists by code")
    public ResponseEntity<OhmaApiResponse<Boolean>> existsByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to check quiz existence (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to check quiz existence", null, null));
            }

            boolean exists = quizService.existsByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quiz existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking quiz existence: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 