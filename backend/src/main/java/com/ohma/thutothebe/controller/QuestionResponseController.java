package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.QuestionResponseDTO;
import com.ohma.thutothebe.service.QuestionResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/question-responses")
@Tag(name = "Question Response Management", description = "APIs for managing question responses")
public class QuestionResponseController extends BaseController<QuestionResponseDTO, Long> {

    private final QuestionResponseService questionResponseService;

    public QuestionResponseController(QuestionResponseService questionResponseService) {
        super(questionResponseService);
        this.questionResponseService = questionResponseService;
    }

    @GetMapping("/submission/{submissionId}")
    @Operation(summary = "Get responses by submission ID")
    public ResponseEntity<OhmaApiResponse<List<QuestionResponseDTO>>> getBySubmissionId(@PathVariable Long submissionId) {
        try {
            List<QuestionResponseDTO> responses = questionResponseService.getBySubmissionId(submissionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Responses retrieved successfully", responses, null));
        } catch (Exception e) {
            log.error("Error retrieving responses: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/question/{questionId}")
    @Operation(summary = "Get responses by question ID")
    public ResponseEntity<OhmaApiResponse<List<QuestionResponseDTO>>> getByQuestionId(@PathVariable Long questionId) {
        try {
            List<QuestionResponseDTO> responses = questionResponseService.getByQuestionId(questionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Responses retrieved successfully", responses, null));
        } catch (Exception e) {
            log.error("Error retrieving responses: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 