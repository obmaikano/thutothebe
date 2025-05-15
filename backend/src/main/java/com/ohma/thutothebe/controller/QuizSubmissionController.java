package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.QuizSubmissionDTO;
import com.ohma.thutothebe.entity.QuizSubmissionStatus;
import com.ohma.thutothebe.service.QuizSubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/quiz-submissions")
@Tag(name = "Quiz Submission Management", description = "APIs for managing quiz submissions")
public class QuizSubmissionController extends BaseController<QuizSubmissionDTO, Long> {

    private final QuizSubmissionService quizSubmissionService;

    public QuizSubmissionController(QuizSubmissionService quizSubmissionService) {
        super(quizSubmissionService);
        this.quizSubmissionService = quizSubmissionService;
    }

    @GetMapping("/quiz/{quizId}")
    @Operation(summary = "Get submissions by quiz ID")
    public ResponseEntity<OhmaApiResponse<List<QuizSubmissionDTO>>> getByQuizId(@PathVariable Long quizId) {
        try {
            List<QuizSubmissionDTO> submissions = quizSubmissionService.getByQuizId(quizId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Submissions retrieved successfully", submissions, null));
        } catch (Exception e) {
            log.error("Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get submissions by student ID")
    public ResponseEntity<OhmaApiResponse<List<QuizSubmissionDTO>>> getByStudentId(@PathVariable Long studentId) {
        try {
            List<QuizSubmissionDTO> submissions = quizSubmissionService.getByStudentId(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Submissions retrieved successfully", submissions, null));
        } catch (Exception e) {
            log.error("Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/quiz/{quizId}/student/{studentId}")
    @Operation(summary = "Get submissions by quiz ID and student ID")
    public ResponseEntity<OhmaApiResponse<List<QuizSubmissionDTO>>> getByQuizIdAndStudentId(
            @PathVariable Long quizId,
            @PathVariable Long studentId) {
        try {
            List<QuizSubmissionDTO> submissions = quizSubmissionService.getByQuizIdAndStudentId(quizId, studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Submissions retrieved successfully", submissions, null));
        } catch (Exception e) {
            log.error("Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get submissions by status")
    public ResponseEntity<OhmaApiResponse<List<QuizSubmissionDTO>>> getByStatus(@PathVariable QuizSubmissionStatus status) {
        try {
            List<QuizSubmissionDTO> submissions = quizSubmissionService.getByStatus(status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Submissions retrieved successfully", submissions, null));
        } catch (Exception e) {
            log.error("Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/quiz/{quizId}/status/{status}")
    @Operation(summary = "Get submissions by quiz ID and status")
    public ResponseEntity<OhmaApiResponse<List<QuizSubmissionDTO>>> getByQuizIdAndStatus(
            @PathVariable Long quizId,
            @PathVariable QuizSubmissionStatus status) {
        try {
            List<QuizSubmissionDTO> submissions = quizSubmissionService.getByQuizIdAndStatus(quizId, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Submissions retrieved successfully", submissions, null));
        } catch (Exception e) {
            log.error("Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/status/{status}")
    @Operation(summary = "Get submissions by student ID and status")
    public ResponseEntity<OhmaApiResponse<List<QuizSubmissionDTO>>> getByStudentIdAndStatus(
            @PathVariable Long studentId,
            @PathVariable QuizSubmissionStatus status) {
        try {
            List<QuizSubmissionDTO> submissions = quizSubmissionService.getByStudentIdAndStatus(studentId, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Submissions retrieved successfully", submissions, null));
        } catch (Exception e) {
            log.error("Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 