package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.QuestionDTO;
import com.ohma.thutothebe.entity.QuestionType;
import com.ohma.thutothebe.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/questions")
@Tag(name = "Question Management", description = "APIs for managing questions")
public class QuestionController extends BaseController<QuestionDTO, Long> {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        super(questionService);
        this.questionService = questionService;
    }

    @GetMapping("/quiz/{quizId}")
    @Operation(summary = "Get questions by quiz ID")
    public ResponseEntity<OhmaApiResponse<List<QuestionDTO>>> getByQuizId(@PathVariable Long quizId) {
        try {
            List<QuestionDTO> questions = questionService.getByQuizId(quizId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Questions retrieved successfully", questions, null));
        } catch (Exception e) {
            log.error("Error retrieving questions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/quiz/{quizId}/type/{type}")
    @Operation(summary = "Get questions by quiz ID and type")
    public ResponseEntity<OhmaApiResponse<List<QuestionDTO>>> getByQuizIdAndType(
            @PathVariable Long quizId,
            @PathVariable QuestionType type) {
        try {
            List<QuestionDTO> questions = questionService.getByQuizIdAndType(quizId, type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Questions retrieved successfully", questions, null));
        } catch (Exception e) {
            log.error("Error retrieving questions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 