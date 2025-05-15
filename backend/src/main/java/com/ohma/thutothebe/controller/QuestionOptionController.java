package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.QuestionOptionDTO;
import com.ohma.thutothebe.service.QuestionOptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/question-options")
@Tag(name = "Question Option Management", description = "APIs for managing question options")
public class QuestionOptionController extends BaseController<QuestionOptionDTO, Long> {

    private final QuestionOptionService questionOptionService;

    public QuestionOptionController(QuestionOptionService questionOptionService) {
        super(questionOptionService);
        this.questionOptionService = questionOptionService;
    }

    @GetMapping("/question/{questionId}")
    @Operation(summary = "Get options by question ID")
    public ResponseEntity<OhmaApiResponse<List<QuestionOptionDTO>>> getByQuestionId(@PathVariable Long questionId) {
        try {
            List<QuestionOptionDTO> options = questionOptionService.getByQuestionId(questionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Options retrieved successfully", options, null));
        } catch (Exception e) {
            log.error("Error retrieving options: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/question/{questionId}/correct/{isCorrect}")
    @Operation(summary = "Get options by question ID and correctness")
    public ResponseEntity<OhmaApiResponse<List<QuestionOptionDTO>>> getByQuestionIdAndIsCorrect(
            @PathVariable Long questionId,
            @PathVariable boolean isCorrect) {
        try {
            List<QuestionOptionDTO> options = questionOptionService.getByQuestionIdAndIsCorrect(questionId, isCorrect);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Options retrieved successfully", options, null));
        } catch (Exception e) {
            log.error("Error retrieving options: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 