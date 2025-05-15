package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AssessmentDto;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.enums.AssessmentStatus;
import com.ohma.thutothebe.entity.enums.GradingStrategy;
import com.ohma.thutothebe.service.AssessmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/assessments")
@Tag(name = "Assessment Management", description = "APIs for managing peer and self assessments")
public class AssessmentController extends BaseController<AssessmentDto, Long> {

    private final AssessmentService assessmentService;

    @Autowired
    public AssessmentController(AssessmentService assessmentService) {
        super(assessmentService);
        this.assessmentService = assessmentService;
    }

    @Operation(summary = "Get assessments by submission ID", description = "Retrieves all assessments for a specific submission")
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<OhmaApiResponse<List<AssessmentDto>>> getAssessmentsBySubmissionId(@PathVariable Long submissionId) {
        try {
            List<AssessmentDto> assessments = assessmentService.getAssessmentsBySubmissionId(submissionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessments retrieved successfully", assessments, null));
        } catch (Exception e) {
            log.error("Error fetching assessments: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get assessments by assessor ID", description = "Retrieves all assessments created by a specific assessor")
    @GetMapping("/assessor/{assessorId}")
    public ResponseEntity<OhmaApiResponse<List<AssessmentDto>>> getAssessmentsByAssessorId(@PathVariable Long assessorId) {
        try {
            List<AssessmentDto> assessments = assessmentService.getAssessmentsByAssessorId(assessorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessments retrieved successfully", assessments, null));
        } catch (Exception e) {
            log.error("Error fetching assessments: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get assessments by course ID", description = "Retrieves all assessments for a specific course")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<List<AssessmentDto>>> getAssessmentsByCourseId(@PathVariable Long courseId) {
        try {
            List<AssessmentDto> assessments = assessmentService.getAssessmentsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessments retrieved successfully", assessments, null));
        } catch (Exception e) {
            log.error("Error fetching assessments: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Submit an assessment", description = "Submits an assessment with score and feedback")
    @PostMapping("/{id}/submit")
    public ResponseEntity<OhmaApiResponse<AssessmentDto>> submitAssessment(
            @PathVariable Long id,
            @RequestParam Double score,
            @RequestParam String feedback,
            @RequestParam(required = false) String rubricScores
    ) {
        try {
            AssessmentDto submittedAssessment = assessmentService.submitAssessment(id, score, feedback, rubricScores);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessment submitted successfully", submittedAssessment, null));
        } catch (Exception e) {
            log.error("Error submitting assessment: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Update assessment status", description = "Updates the status of an assessment")
    @PutMapping("/{id}/status")
    public ResponseEntity<OhmaApiResponse<AssessmentDto>> updateAssessmentStatus(
            @PathVariable Long id,
            @RequestParam AssessmentStatus status
    ) {
        try {
            AssessmentDto updatedAssessment = assessmentService.updateAssessmentStatus(id, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessment status updated successfully", updatedAssessment, null));
        } catch (Exception e) {
            log.error("Error updating assessment status: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get assessments by submission ID and status", description = "Retrieves all assessments for a specific submission with a given status")
    @GetMapping("/submission/{submissionId}/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<AssessmentDto>>> getAssessmentsBySubmissionIdAndStatus(
            @PathVariable Long submissionId,
            @PathVariable AssessmentStatus status
    ) {
        try {
            List<AssessmentDto> assessments = assessmentService.getAssessmentsBySubmissionIdAndStatus(submissionId, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessments retrieved successfully", assessments, null));
        } catch (Exception e) {
            log.error("Error fetching assessments: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Assign peer assessments", description = "Assigns peer assessments to multiple assessors for a submission")
    @PostMapping("/submission/{submissionId}/assign")
    public ResponseEntity<OhmaApiResponse<List<AssessmentDto>>> assignPeerAssessments(
            @PathVariable Long submissionId,
            @RequestParam List<Long> assessorIds,
            @RequestParam GradingStrategy gradingStrategy
    ) {
        try {
            List<AssessmentDto> assessments = assessmentService.assignPeerAssessments(submissionId, assessorIds, gradingStrategy);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Peer assessments assigned successfully", assessments, null));
        } catch (Exception e) {
            log.error("Error assigning peer assessments: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 