package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.entity.QuizStatus;
import com.ohma.thutothebe.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/quizzes")
@Tag(name = "Quiz Management", description = "APIs for managing quizzes")
public class QuizController extends BaseController<QuizDTO, Long> {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        super(quizService);
        this.quizService = quizService;
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get a quiz by code")
    public ResponseEntity<OhmaApiResponse<QuizDTO>> getByCode(@PathVariable String code) {
        try {
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
            List<QuizDTO> quizzes = quizService.getByCourseId(courseId);
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
            List<QuizDTO> quizzes = quizService.getByInstructorId(instructorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", quizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get quizzes by status")
    public ResponseEntity<OhmaApiResponse<List<QuizDTO>>> getByStatus(@PathVariable QuizStatus status) {
        try {
            List<QuizDTO> quizzes = quizService.getByStatus(status);
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
            List<QuizDTO> quizzes = quizService.getByCourseIdAndStatus(courseId, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", quizzes, null));
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
            List<QuizDTO> quizzes = quizService.getActiveByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quizzes retrieved successfully", quizzes, null));
        } catch (Exception e) {
            log.error("Error retrieving quizzes: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists/{code}")
    @Operation(summary = "Check if a quiz exists by code")
    public ResponseEntity<OhmaApiResponse<Boolean>> existsByCode(@PathVariable String code) {
        try {
            boolean exists = quizService.existsByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Quiz existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking quiz existence: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 