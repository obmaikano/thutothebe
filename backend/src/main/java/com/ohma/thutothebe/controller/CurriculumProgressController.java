package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.ImplementationStatus;
import com.ohma.thutothebe.service.CurriculumProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getByCurriculumId(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view curriculum progress (school-level access or higher)
            if (!hasAccess(AccessScope.SCHOOL, null) && !hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view curriculum progress", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getBySchoolId(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view progress for this school (school-level access or higher)
            if (!hasAccess(AccessScope.SCHOOL, schoolId) && !hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view school progress", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getOverdueProgress(
            @Parameter(description = "Reference date (YYYY-MM-DD)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view overdue progress (regional access or higher)
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view overdue progress", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> updateImplementationStatus(
            @Parameter(description = "Progress ID") @PathVariable Long progressId,
            @Parameter(description = "New implementation status") @RequestParam ImplementationStatus status,
            @Parameter(description = "Progress percentage") @RequestParam(required = false) Double progressPercentage,
            @Parameter(description = "Updated by user ID") @RequestParam Long updatedById) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing progress to check school access
            CurriculumProgressDTO existingProgress = curriculumProgressService.getById(progressId);
            if (existingProgress == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to update progress for this school (school-level access or higher)
            if (!hasAccess(AccessScope.SCHOOL, existingProgress.schoolId()) && !hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update implementation status", null, null));
            }

            CurriculumProgressDTO progress = curriculumProgressService.updateImplementationStatus(progressId, status, progressPercentage, updatedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Implementation status updated successfully", progress, null));
        } catch (Exception e) {
            log.error("Error updating implementation status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> create(@RequestBody CurriculumProgressDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to create progress for this school (school-level access or higher)
            if (dto.schoolId() != null && !hasAccess(AccessScope.SCHOOL, dto.schoolId()) && !hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create progress for this school", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            log.error("Error creating curriculum progress: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> update(@PathVariable Long id, @RequestBody CurriculumProgressDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing progress to check school access
            CurriculumProgressDTO existingProgress = curriculumProgressService.getById(id);
            if (existingProgress == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to update progress for this school (school-level access or higher)
            if (!hasAccess(AccessScope.SCHOOL, existingProgress.schoolId()) && !hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update this progress", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            log.error("Error updating curriculum progress: {}", e.getMessage(), e);
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

            // Get existing progress to check school access
            CurriculumProgressDTO existingProgress = curriculumProgressService.getById(id);
            if (existingProgress == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to delete progress for this school (school-level access or higher)
            if (!hasAccess(AccessScope.SCHOOL, existingProgress.schoolId()) && !hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete this progress", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            log.error("Error deleting curriculum progress: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 