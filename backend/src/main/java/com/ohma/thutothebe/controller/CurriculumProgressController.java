package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.ImplementationStatus;
import com.ohma.thutothebe.service.CurriculumProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/curriculum-progress")
@Tag(name = "Curriculum Progress Management", description = "APIs for monitoring curriculum implementation progress")
public class CurriculumProgressController extends BaseController<CurriculumProgressDTO, Long> {

    private final CurriculumProgressService curriculumProgressService;

    @Autowired
    public CurriculumProgressController(CurriculumProgressService curriculumProgressService) {
        super(curriculumProgressService);
        this.curriculumProgressService = curriculumProgressService;
    }

    @GetMapping("/curriculum/{curriculumId}")
    @Operation(summary = "Get progress for a specific curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getByCurriculumId(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.findByCurriculumId(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum progress retrieved successfully", progress, null));
        } catch (Exception e) {
            log.error("Error retrieving curriculum progress: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get progress for a specific school")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getBySchoolId(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.findBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School progress retrieved successfully", progress, null));
        } catch (Exception e) {
            log.error("Error retrieving school progress: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue curriculum implementations")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getOverdueProgress(
            @Parameter(description = "Reference date (YYYY-MM-DD)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            LocalDate referenceDate = date != null ? date : LocalDate.now();
            List<CurriculumProgressDTO> progress = curriculumProgressService.findOverdueProgress(referenceDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Overdue progress retrieved successfully", progress, null));
        } catch (Exception e) {
            log.error("Error retrieving overdue progress: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{progressId}/update-status")
    @Operation(summary = "Update implementation status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> updateImplementationStatus(
            @Parameter(description = "Progress ID") @PathVariable Long progressId,
            @Parameter(description = "New implementation status") @RequestParam ImplementationStatus status,
            @Parameter(description = "Progress percentage") @RequestParam(required = false) Double progressPercentage,
            @Parameter(description = "Updated by user ID") @RequestParam Long updatedById) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.updateImplementationStatus(progressId, status, progressPercentage, updatedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Implementation status updated successfully", progress, null));
        } catch (Exception e) {
            log.error("Error updating implementation status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 