package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.CurriculumStatus;
import com.ohma.thutothebe.entity.CurriculumType;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.service.CurriculumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/curricula")
@Tag(name = "Curriculum Management", description = "APIs for managing curricula")
public class CurriculumController extends BaseController<CurriculumDTO, Long> {

    private final CurriculumService curriculumService;

    @Autowired
    public CurriculumController(CurriculumService curriculumService) {
        super(curriculumService);
        this.curriculumService = curriculumService;
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active curricula")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getAllActive() {
        try {
            List<CurriculumDTO> curricula = curriculumService.findAllActive();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving active curricula: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get curricula by status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getByStatus(
            @Parameter(description = "Curriculum status") @PathVariable CurriculumStatus status) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findByStatus(status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula by status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get curricula by type")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getByType(
            @Parameter(description = "Curriculum type") @PathVariable CurriculumType type) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findByCurriculumType(type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/grade-level/{gradeLevel}")
    @Operation(summary = "Get curricula by grade level")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getByGradeLevel(
            @Parameter(description = "Grade level") @PathVariable GradeLevel gradeLevel) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findByGradeLevel(gradeLevel);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula by grade level: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/academic-year/{academicYear}")
    @Operation(summary = "Get curricula by academic year")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getByAcademicYear(
            @Parameter(description = "Academic year") @PathVariable Integer academicYear) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findByAcademicYear(academicYear);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula by academic year: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get curricula by region")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getByRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findByRegionId(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula by region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get curricula by school")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula by school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/effective-on/{date}")
    @Operation(summary = "Get curricula effective on a specific date")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getEffectiveOnDate(
            @Parameter(description = "Date (YYYY-MM-DD)") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findEffectiveOnDate(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error retrieving curricula effective on date: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search curricula by title")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> searchByTitle(
            @Parameter(description = "Title search term") @RequestParam String title) {
        try {
            List<CurriculumDTO> curricula = curriculumService.findByTitleContaining(title);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula retrieved successfully", curricula, null));
        } catch (Exception e) {
            log.error("Error searching curricula by title: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{curriculumId}/approve")
    @Operation(summary = "Approve a curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> approveCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Approver user ID") @RequestParam Long approvedById) {
        try {
            CurriculumDTO curriculum = curriculumService.approveCurriculum(curriculumId, approvedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum approved successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error approving curriculum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{curriculumId}/activate")
    @Operation(summary = "Activate a curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> activateCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            CurriculumDTO curriculum = curriculumService.activateCurriculum(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum activated successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error activating curriculum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{curriculumId}/suspend")
    @Operation(summary = "Suspend a curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> suspendCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            CurriculumDTO curriculum = curriculumService.suspendCurriculum(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum suspended successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error suspending curriculum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{curriculumId}/archive")
    @Operation(summary = "Archive a curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> archiveCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            CurriculumDTO curriculum = curriculumService.archiveCurriculum(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum archived successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error archiving curriculum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists")
    @Operation(summary = "Check if curriculum exists by title, grade level and academic year")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkCurriculumExists(
            @Parameter(description = "Curriculum title") @RequestParam String title,
            @Parameter(description = "Grade level") @RequestParam GradeLevel gradeLevel,
            @Parameter(description = "Academic year") @RequestParam Integer academicYear) {
        try {
            boolean exists = curriculumService.existsByTitleAndGradeLevelAndAcademicYear(title, gradeLevel, academicYear);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum existence checked", exists, null));
        } catch (Exception e) {
            log.error("Error checking curriculum existence: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 