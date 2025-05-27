package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.*;
import com.ohma.thutothebe.entity.CurriculumAnalytics;
import com.ohma.thutothebe.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/curriculum-advanced")
@Tag(name = "Advanced Curriculum Management", description = "Advanced features for curriculum management including version control, resources, analytics, and integrations")
public class CurriculumAdvancedController {

    private final CurriculumVersionService curriculumVersionService;
    private final CurriculumResourceService curriculumResourceService;
    private final CurriculumAnalyticsService curriculumAnalyticsService;
    private final CurriculumIntegrationService curriculumIntegrationService;
    private final CurriculumAssessmentService curriculumAssessmentService;

    @Autowired
    public CurriculumAdvancedController(
            CurriculumVersionService curriculumVersionService,
            CurriculumResourceService curriculumResourceService,
            CurriculumAnalyticsService curriculumAnalyticsService,
            CurriculumIntegrationService curriculumIntegrationService,
            CurriculumAssessmentService curriculumAssessmentService) {
        this.curriculumVersionService = curriculumVersionService;
        this.curriculumResourceService = curriculumResourceService;
        this.curriculumAnalyticsService = curriculumAnalyticsService;
        this.curriculumIntegrationService = curriculumIntegrationService;
        this.curriculumAssessmentService = curriculumAssessmentService;
    }

    // ==================== VERSION CONTROL ====================

    @PostMapping("/{curriculumId}/versions")
    @Operation(summary = "Create a new curriculum version")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumVersionDTO>> createVersion(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Version name") @RequestParam String versionName,
            @Parameter(description = "Version description") @RequestParam(required = false) String description,
            @Parameter(description = "Is major version") @RequestParam(defaultValue = "false") boolean isMajorVersion,
            @Parameter(description = "Created by user ID") @RequestParam Long createdById) {
        try {
            CurriculumVersionDTO version = curriculumVersionService.createVersion(curriculumId, versionName, description, isMajorVersion, createdById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Version created successfully", version, null));
        } catch (Exception e) {
            log.error("Error creating curriculum version: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/versions")
    @Operation(summary = "Get all versions of a curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumVersionDTO>>> getVersions(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumVersionDTO> versions = curriculumVersionService.getVersionsByCurriculumId(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Versions retrieved successfully", versions, null));
        } catch (Exception e) {
            log.error("Error retrieving curriculum versions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/versions/{sourceVersionId}/compare/{targetVersionId}")
    @Operation(summary = "Compare two curriculum versions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumComparisonDTO>> compareVersions(
            @Parameter(description = "Source version ID") @PathVariable Long sourceVersionId,
            @Parameter(description = "Target version ID") @PathVariable Long targetVersionId,
            @Parameter(description = "Compared by user ID") @RequestParam Long comparedById) {
        try {
            CurriculumComparisonDTO comparison = curriculumVersionService.compareVersions(sourceVersionId, targetVersionId, comparedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Version comparison completed", comparison, null));
        } catch (Exception e) {
            log.error("Error comparing curriculum versions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== RESOURCE MANAGEMENT ====================

    @PostMapping("/{curriculumId}/resources")
    @Operation(summary = "Upload a resource to curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<CurriculumResourceDTO>> uploadResource(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Resource file") @RequestParam(required = false) MultipartFile file,
            @Parameter(description = "Resource data") @RequestBody CurriculumResourceDTO resourceData) {
        try {
            CurriculumResourceDTO resource = curriculumResourceService.uploadResource(curriculumId, file, resourceData);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource uploaded successfully", resource, null));
        } catch (Exception e) {
            log.error("Error uploading curriculum resource: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/resources")
    @Operation(summary = "Get all resources for a curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumResourceDTO>>> getResources(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Resource type filter") @RequestParam(required = false) String resourceType,
            @Parameter(description = "Unit ID filter") @RequestParam(required = false) Long unitId,
            @Parameter(description = "Topic ID filter") @RequestParam(required = false) Long topicId) {
        try {
            List<CurriculumResourceDTO> resources = curriculumResourceService.getResourcesByCurriculum(curriculumId, resourceType, unitId, topicId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resources retrieved successfully", resources, null));
        } catch (Exception e) {
            log.error("Error retrieving curriculum resources: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/resources/{resourceId}/access")
    @Operation(summary = "Track resource access")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Void>> trackResourceAccess(
            @Parameter(description = "Resource ID") @PathVariable Long resourceId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            curriculumResourceService.trackAccess(resourceId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Resource access tracked", null, null));
        } catch (Exception e) {
            log.error("Error tracking resource access: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== ANALYTICS AND MONITORING ====================

    @PostMapping("/{curriculumId}/analytics/generate")
    @Operation(summary = "Generate curriculum analytics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CurriculumAnalyticsDTO>> generateAnalytics(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Analytics type") @RequestParam CurriculumAnalytics.AnalyticsType analyticsType,
            @Parameter(description = "Aggregation level") @RequestParam CurriculumAnalytics.AggregationLevel aggregationLevel,
            @Parameter(description = "School ID (optional)") @RequestParam(required = false) Long schoolId,
            @Parameter(description = "Region ID (optional)") @RequestParam(required = false) Long regionId,
            @Parameter(description = "Generated by user ID") @RequestParam Long generatedById) {
        try {
            CurriculumAnalyticsDTO analytics;
            switch (analyticsType) {
                case IMPLEMENTATION_PROGRESS:
                    analytics = curriculumAnalyticsService.generateImplementationProgressAnalytics(curriculumId, aggregationLevel, generatedById);
                    break;
                case PERFORMANCE_ANALYSIS:
                    analytics = curriculumAnalyticsService.generatePerformanceAnalytics(curriculumId, schoolId, regionId, generatedById);
                    break;
                case RESOURCE_UTILIZATION:
                    analytics = curriculumAnalyticsService.generateResourceUtilizationAnalytics(curriculumId, aggregationLevel, generatedById);
                    break;
                case TEACHER_EFFECTIVENESS:
                    analytics = curriculumAnalyticsService.generateTeacherEffectivenessAnalytics(curriculumId, schoolId, generatedById);
                    break;
                case STUDENT_OUTCOMES:
                    analytics = curriculumAnalyticsService.generateStudentOutcomesAnalytics(curriculumId, aggregationLevel, generatedById);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported analytics type: " + analyticsType);
            }
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Analytics generated successfully", analytics, null));
        } catch (Exception e) {
            log.error("Error generating curriculum analytics: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/analytics/dashboard")
    @Operation(summary = "Get dashboard analytics for curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getDashboardAnalytics(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Aggregation level") @RequestParam CurriculumAnalytics.AggregationLevel level,
            @Parameter(description = "School ID (optional)") @RequestParam(required = false) Long schoolId,
            @Parameter(description = "Teacher ID (optional)") @RequestParam(required = false) Long teacherId) {
        try {
            Map<String, Object> dashboardData;
            if (teacherId != null) {
                dashboardData = curriculumAnalyticsService.getTeacherDashboard(curriculumId, teacherId);
            } else if (schoolId != null) {
                dashboardData = curriculumAnalyticsService.getSchoolDashboard(curriculumId, schoolId);
            } else {
                dashboardData = curriculumAnalyticsService.getDashboardMetrics(curriculumId, level);
            }
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Dashboard analytics retrieved successfully", dashboardData, null));
        } catch (Exception e) {
            log.error("Error retrieving dashboard analytics: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/analytics/real-time")
    @Operation(summary = "Get real-time analytics for curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getRealTimeAnalytics(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "School ID (optional)") @RequestParam(required = false) Long schoolId,
            @Parameter(description = "Region ID (optional)") @RequestParam(required = false) Long regionId) {
        try {
            Map<String, Object> realTimeData;
            if (schoolId != null) {
                realTimeData = curriculumAnalyticsService.getRealTimeProgress(curriculumId, schoolId);
            } else if (regionId != null) {
                realTimeData = curriculumAnalyticsService.getLiveImplementationStatus(curriculumId, regionId);
            } else {
                realTimeData = curriculumAnalyticsService.getRealTimePerformanceMetrics(curriculumId);
            }
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Real-time analytics retrieved successfully", realTimeData, null));
        } catch (Exception e) {
            log.error("Error retrieving real-time analytics: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/analytics/trends")
    @Operation(summary = "Get trend analytics for curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<Map<String, Object>>>> getTrendAnalytics(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @Parameter(description = "Metric type") @RequestParam String metric) {
        try {
            Map<String, Object> trendData = curriculumAnalyticsService.getAnalyticsTrends(curriculumId, metric, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Trend analytics retrieved successfully", List.of(trendData), null));
        } catch (Exception e) {
            log.error("Error retrieving trend analytics: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== ASSESSMENT INTEGRATION ====================

    @PostMapping("/{curriculumId}/assessments/link")
    @Operation(summary = "Link assessment to curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<CurriculumAssessmentDTO>> linkAssessment(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Assessment data") @RequestBody CurriculumAssessmentDTO assessmentData) {
        try {
            CurriculumAssessmentDTO linkedAssessment = curriculumAssessmentService.linkAssessment(assessmentData);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessment linked successfully", linkedAssessment, null));
        } catch (Exception e) {
            log.error("Error linking assessment to curriculum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/assessments")
    @Operation(summary = "Get linked assessments for curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumAssessmentDTO>>> getLinkedAssessments(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Unit ID filter") @RequestParam(required = false) Long unitId,
            @Parameter(description = "Topic ID filter") @RequestParam(required = false) Long topicId) {
        try {
            List<CurriculumAssessmentDTO> assessments = curriculumAssessmentService.getAssessmentsByCurriculum(curriculumId, unitId, topicId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Linked assessments retrieved successfully", assessments, null));
        } catch (Exception e) {
            log.error("Error retrieving linked assessments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== EXTERNAL INTEGRATIONS ====================

    @PostMapping("/{curriculumId}/integrations")
    @Operation(summary = "Configure external system integration")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<CurriculumIntegrationDTO>> configureIntegration(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId,
            @Parameter(description = "Integration configuration") @RequestBody CurriculumIntegrationDTO integrationData) {
        try {
            CurriculumIntegrationDTO integration = curriculumIntegrationService.configureIntegration(integrationData);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Integration configured successfully", integration, null));
        } catch (Exception e) {
            log.error("Error configuring curriculum integration: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/integrations/{integrationId}/sync")
    @Operation(summary = "Trigger manual synchronization")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> triggerSync(
            @Parameter(description = "Integration ID") @PathVariable Long integrationId,
            @Parameter(description = "Triggered by user ID") @RequestParam Long triggeredById) {
        try {
            Map<String, Object> syncResult = curriculumIntegrationService.triggerSync(integrationId, triggeredById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Synchronization triggered successfully", syncResult, null));
        } catch (Exception e) {
            log.error("Error triggering integration sync: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{curriculumId}/integrations")
    @Operation(summary = "Get integration configurations for curriculum")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<CurriculumIntegrationDTO>>> getIntegrations(
            @Parameter(description = "Curriculum ID") @PathVariable Long curriculumId) {
        try {
            List<CurriculumIntegrationDTO> integrations = curriculumIntegrationService.getIntegrationsByCurriculum(curriculumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Integrations retrieved successfully", integrations, null));
        } catch (Exception e) {
            log.error("Error retrieving curriculum integrations: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 