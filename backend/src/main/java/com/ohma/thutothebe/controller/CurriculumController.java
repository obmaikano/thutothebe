package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.dto.CurriculumSubjectDTO;
import com.ohma.thutothebe.dto.CurriculumUnitDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.dto.UpdateCurriculumSubjectRequest;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.CurriculumStatus;
import com.ohma.thutothebe.entity.CurriculumType;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.service.CurriculumService;
import com.ohma.thutothebe.service.CurriculumSubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/curricula")
@Tag(name = "Curriculum Management", description = "APIs for managing curricula")
public class CurriculumController extends BaseController<CurriculumDTO, Long> {

    private final CurriculumService curriculumService;
    private final CurriculumSubjectService curriculumSubjectService;

    @Autowired
    public CurriculumController(CurriculumService curriculumService, CurriculumSubjectService curriculumSubjectService) {
        super(curriculumService);
        this.curriculumService = curriculumService;
        this.curriculumSubjectService = curriculumSubjectService;
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active curricula")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getAllActive() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view curricula (most authenticated users can view active curricula)
            if (!hasAccess(AccessScope.SCHOOL, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to curricula", null, null));
            }

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

    // ==================== CURRICULUM SUBJECTS ====================

    @GetMapping("/{curriculumId}/subjects")
    @Operation(summary = "Get all subjects associated with a curriculum")
    public ResponseEntity<OhmaApiResponse<List<CurriculumSubjectDTO>>> getCurriculumSubjects(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumSubjectDTO> curriculumSubjects = curriculumSubjectService.findByCurriculumId(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum subjects retrieved successfully", curriculumSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve curriculum subjects", e);
        }
    }

    @GetMapping("/{curriculumId}/subjects/available")
    @Operation(summary = "Get all subjects available to be added to a curriculum (excluding already associated ones)")
    public ResponseEntity<OhmaApiResponse<List<SubjectDTO>>> getAvailableSubjects(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<SubjectDTO> availableSubjects = curriculumService.getAvailableSubjects(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Available subjects retrieved successfully", availableSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve available subjects", e);
        }
    }

    @PostMapping("/{curriculumId}/subjects/{subjectId}")
    @Operation(summary = "Add a subject to a curriculum")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> addSubjectToCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Subject ID") @PathVariable Long subjectId,
            @Parameter(description = "Is core subject") @RequestParam(defaultValue = "true") boolean isCore,
            @Parameter(description = "Allocated hours") @RequestParam(required = false) Integer allocatedHours,
            @Parameter(description = "Weight percentage") @RequestParam(required = false) Double weightPercentage) {
        try {
            CurriculumDTO updatedCurriculum = curriculumService.addSubjectToCurriculum(curriculumId, subjectId, isCore, allocatedHours, weightPercentage);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject added to curriculum successfully", updatedCurriculum, null));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Subject is already assigned to this curriculum", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add subject to curriculum", e);
        }
    }

    @DeleteMapping("/{curriculumId}/subjects/{subjectId}")
    @Operation(summary = "Remove a subject from a curriculum")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> removeSubjectFromCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Subject ID") @PathVariable Long subjectId) {
        try {
            CurriculumDTO updatedCurriculum = curriculumService.removeSubjectFromCurriculum(curriculumId, subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject removed from curriculum successfully", updatedCurriculum, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove subject from curriculum", e);
        }
    }

    @PutMapping("/{curriculumId}/subjects/{subjectId}")
    @Operation(summary = "Update curriculum subject details")
    public ResponseEntity<OhmaApiResponse<CurriculumSubjectDTO>> updateCurriculumSubject(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Subject ID") @PathVariable Long subjectId,
            @RequestBody @Valid UpdateCurriculumSubjectRequest request) {
        try {
            CurriculumSubjectDTO updatedSubject = curriculumService.updateCurriculumSubject(curriculumId, subjectId, request);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum subject updated successfully", updatedSubject, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update curriculum subject", e);
        }
    }

    @GetMapping("/{curriculumId}/subjects/core")
    @Operation(summary = "Get core subjects for a curriculum")
    public ResponseEntity<OhmaApiResponse<List<CurriculumSubjectDTO>>> getCoreSubjects(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumSubjectDTO> coreSubjects = curriculumSubjectService.findByCurriculumIdAndIsCore(curriculumId, true);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Core subjects retrieved successfully", coreSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve core subjects", e);
        }
    }

    @GetMapping("/{curriculumId}/subjects/elective")
    @Operation(summary = "Get elective subjects for a curriculum")
    public ResponseEntity<OhmaApiResponse<List<CurriculumSubjectDTO>>> getElectiveSubjects(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumSubjectDTO> electiveSubjects = curriculumSubjectService.findByCurriculumIdAndIsCore(curriculumId, false);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Elective subjects retrieved successfully", electiveSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve elective subjects", e);
        }
    }

    @GetMapping("/{curriculumId}/subjects/statistics")
    @Operation(summary = "Get curriculum subject statistics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getCurriculumSubjectStatistics(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            Integer totalAllocatedHours = curriculumSubjectService.getTotalAllocatedHoursByCurriculumId(curriculumId);
            Double totalWeightPercentage = curriculumSubjectService.getTotalWeightPercentageByCurriculumId(curriculumId);
            List<CurriculumSubjectDTO> allSubjects = curriculumSubjectService.findByCurriculumId(curriculumId);
            List<CurriculumSubjectDTO> coreSubjects = curriculumSubjectService.findByCurriculumIdAndIsCore(curriculumId, true);
            List<CurriculumSubjectDTO> electiveSubjects = curriculumSubjectService.findByCurriculumIdAndIsCore(curriculumId, false);

            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalSubjects", allSubjects.size());
            statistics.put("coreSubjects", coreSubjects.size());
            statistics.put("electiveSubjects", electiveSubjects.size());
            statistics.put("totalAllocatedHours", totalAllocatedHours != null ? totalAllocatedHours : 0);
            statistics.put("totalWeightPercentage", totalWeightPercentage != null ? totalWeightPercentage : 0.0);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum subject statistics retrieved successfully", statistics, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve curriculum subject statistics", e);
        }
    }

    @GetMapping("/subjects/core")
    @Operation(summary = "Get all core subjects across all curricula")
    public ResponseEntity<OhmaApiResponse<List<CurriculumSubjectDTO>>> getAllCoreSubjects() {
        try {
            List<CurriculumSubjectDTO> coreSubjects = curriculumSubjectService.findAllCoreSubjects();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "All core subjects retrieved successfully", coreSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve all core subjects", e);
        }
    }

    @GetMapping("/subjects/elective")
    @Operation(summary = "Get all elective subjects across all curricula")
    public ResponseEntity<OhmaApiResponse<List<CurriculumSubjectDTO>>> getAllElectiveSubjects() {
        try {
            List<CurriculumSubjectDTO> electiveSubjects = curriculumSubjectService.findAllElectiveSubjects();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "All elective subjects retrieved successfully", electiveSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve all elective subjects", e);
        }
    }

    @GetMapping("/subjects/{subjectId}/curricula")
    @Operation(summary = "Get all curricula that include a specific subject")
    public ResponseEntity<OhmaApiResponse<List<CurriculumSubjectDTO>>> getCurriculaBySubject(
            @Parameter(description = "Subject ID") @PathVariable Long subjectId) {
        try {
            List<CurriculumSubjectDTO> curriculaSubjects = curriculumSubjectService.findBySubjectId(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curricula with subject retrieved successfully", curriculaSubjects, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve curricula with subject", e);
        }
    }

    @GetMapping("/{curriculumId}/subjects/{subjectId}/exists")
    @Operation(summary = "Check if a subject exists in a curriculum")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkSubjectExistsInCurriculum(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Subject ID") @PathVariable Long subjectId) {
        try {
            boolean exists = curriculumSubjectService.existsByCurriculumIdAndSubjectId(curriculumId, subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject existence checked", exists, null));
        } catch (Exception e) {
            throw new RuntimeException("Failed to check subject existence", e);
        }
    }

    // ==================== CURRICULUM UNITS ====================

    @GetMapping("/{curriculumId}/units")
    @Operation(summary = "Get all units for a curriculum")
    public ResponseEntity<OhmaApiResponse<List<CurriculumUnitDTO>>> getCurriculumUnits(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumUnitDTO> units = curriculumService.getCurriculumUnits(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum units retrieved successfully", units, null));
        } catch (Exception e) {
            log.error("Error retrieving curriculum units: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{curriculumId}/units")
    @Operation(summary = "Create a curriculum unit")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> createCurriculumUnit(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Unit title") @RequestParam String title,
            @Parameter(description = "Unit description") @RequestParam(required = false) String description,
            @Parameter(description = "Unit order") @RequestParam Integer unitOrder,
            @Parameter(description = "Duration in weeks") @RequestParam(required = false) Integer durationWeeks,
            @Parameter(description = "Allocated hours") @RequestParam(required = false) Integer allocatedHours) {
        try {
            CurriculumDTO curriculum = curriculumService.createCurriculumUnit(
                curriculumId, title, description, unitOrder, durationWeeks, allocatedHours);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum unit created successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error creating curriculum unit: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== CURRICULUM TOPICS ====================

    @PostMapping("/units/{curriculumUnitId}/topics")
    @Operation(summary = "Create a curriculum topic")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> createCurriculumTopic(
            @Parameter(description = "Curriculum Unit ID") @PathVariable Long curriculumUnitId,
            @Parameter(description = "Topic title") @RequestParam String title,
            @Parameter(description = "Topic description") @RequestParam(required = false) String description,
            @Parameter(description = "Topic order") @RequestParam Integer topicOrder,
            @Parameter(description = "Duration in hours") @RequestParam(required = false) Integer durationHours) {
        try {
            CurriculumDTO curriculum = curriculumService.createCurriculumTopic(
                curriculumUnitId, title, description, topicOrder, durationHours);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum topic created successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error creating curriculum topic: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== CURRICULUM RECOMMENDATIONS ====================

    @GetMapping("/recommendations")
    @Operation(summary = "Get curriculum recommendations")
    public ResponseEntity<OhmaApiResponse<List<CurriculumDTO>>> getCurriculumRecommendations(
            @Parameter(description = "Grade level") @RequestParam GradeLevel gradeLevel,
            @Parameter(description = "Curriculum type") @RequestParam CurriculumType type,
            @Parameter(description = "Region ID (optional)") @RequestParam(required = false) Long regionId) {
        try {
            List<CurriculumDTO> recommendations = curriculumService.getCurriculumRecommendations(gradeLevel, type, regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum recommendations retrieved successfully", recommendations, null));
        } catch (Exception e) {
            log.error("Error retrieving curriculum recommendations: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== CURRICULUM VALIDATION ====================

    @PostMapping("/{curriculumId}/validate-alignment")
    @Operation(summary = "Validate curriculum alignment with regional standards")
    public ResponseEntity<OhmaApiResponse<String>> validateCurriculumAlignment(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Region ID") @RequestParam Long regionId) {
        try {
            curriculumService.validateCurriculumAlignment(curriculumId, regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum alignment validated successfully", "Curriculum is properly aligned with regional standards", null));
        } catch (Exception e) {
            log.error("Error validating curriculum alignment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{curriculumId}/submit-for-review")
    @Operation(summary = "Submit a curriculum for review")
    public ResponseEntity<OhmaApiResponse<CurriculumDTO>> submitCurriculumForReview(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            CurriculumDTO curriculum = curriculumService.submitCurriculumForReview(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Curriculum submitted for review successfully", curriculum, null));
        } catch (Exception e) {
            log.error("Error submitting curriculum for review: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 