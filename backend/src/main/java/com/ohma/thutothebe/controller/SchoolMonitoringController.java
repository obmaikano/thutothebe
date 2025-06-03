package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SchoolMonitoringDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.SchoolMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/monitoring/schools")
@Tag(name = "School Monitoring Management", description = "APIs for managing school monitoring data")
public class SchoolMonitoringController extends BaseController<SchoolMonitoringDTO, Long> {

    @Autowired
    private SchoolMonitoringService schoolMonitoringService;

    public SchoolMonitoringController(SchoolMonitoringService schoolMonitoringService) {
        super(schoolMonitoringService);
        this.schoolMonitoringService = schoolMonitoringService;
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get latest monitoring data by school ID")
    public ResponseEntity<OhmaApiResponse<SchoolMonitoringDTO>> getBySchoolId(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view monitoring data for this school
            if (!hasAccess(AccessScope.SCHOOL, schoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to school monitoring data", null, null));
            }

            SchoolMonitoringDTO monitoringData = schoolMonitoringService.findLatestMonitoringDataForSchool(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/date/{date}")
    @Operation(summary = "Get monitoring data by school ID and date")
    public ResponseEntity<OhmaApiResponse<SchoolMonitoringDTO>> getBySchoolIdAndDate(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Monitoring date") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view monitoring data for this school
            if (!hasAccess(AccessScope.SCHOOL, schoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to school monitoring data", null, null));
            }

            SchoolMonitoringDTO monitoringData = schoolMonitoringService.findBySchoolIdAndDate(schoolId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for school {} on date {}: {}", schoolId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/date-range")
    @Operation(summary = "Get monitoring data by school ID and date range")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getBySchoolIdAndDateRange(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view monitoring data for this school
            if (!hasAccess(AccessScope.SCHOOL, schoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to school monitoring data", null, null));
            }

            List<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findBySchoolIdAndDateRange(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get latest monitoring data for all schools in region")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getByRegionId(
            @Parameter(description = "Region ID") @PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view monitoring data for this region
            if (!hasAccess(AccessScope.REGION, regionId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional monitoring data", null, null));
            }

            List<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findLatestMonitoringDataForAllSchools();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regional school monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for region {}: {}", regionId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/date/{date}")
    @Operation(summary = "Get monitoring data by region ID and date")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getByRegionIdAndDate(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Monitoring date") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view monitoring data for this region
            if (!hasAccess(AccessScope.REGION, regionId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional monitoring data", null, null));
            }

            List<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findByRegionIdAndDate(regionId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regional school monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for region {} on date {}: {}", regionId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/date-range")
    @Operation(summary = "Get monitoring data by region ID and date range")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getByRegionIdAndDateRange(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view monitoring data for this region
            if (!hasAccess(AccessScope.REGION, regionId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional monitoring data", null, null));
            }

            List<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findByRegionIdAndDateRange(regionId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regional school monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for region {} between {} and {}: {}", regionId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date/{date}")
    @Operation(summary = "Get monitoring data by date")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getByDate(
            @Parameter(description = "Monitoring date") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view all monitoring data by date
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to system-wide monitoring data", null, null));
            }

            List<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findByDate(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get monitoring data by date range")
    public ResponseEntity<OhmaApiResponse<Page<SchoolMonitoringDTO>>> getByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view all monitoring data by date range
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to system-wide monitoring data", null, null));
            }

            Page<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findByDateRange(startDate, endDate, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data between {} and {}: {}", startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/attendance/below-threshold")
    @Operation(summary = "Get schools with attendance below threshold")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getSchoolsWithAttendanceBelowThreshold(
            @Parameter(description = "Attendance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view attendance threshold analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to attendance threshold analysis", null, null));
            }

            List<SchoolMonitoringDTO> schools = schoolMonitoringService.findSchoolsWithLowAttendance(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools with low attendance retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools with attendance below {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/usage/below-threshold")
    @Operation(summary = "Get schools with usage below threshold")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getSchoolsWithUsageBelowThreshold(
            @Parameter(description = "Usage threshold") @RequestParam Integer threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view usage threshold analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to usage threshold analysis", null, null));
            }

            List<SchoolMonitoringDTO> schools = schoolMonitoringService.findSchoolsWithLowUsage(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools with low usage retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools with usage below {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/grading/delayed")
    @Operation(summary = "Get schools with delayed grading")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getSchoolsWithDelayedGrading(
            @Parameter(description = "Grading delay threshold (hours)") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view grading delay analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to grading delay analysis", null, null));
            }

            List<SchoolMonitoringDTO> schools = schoolMonitoringService.findSchoolsWithDelayedGrading(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools with delayed grading retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools with grading delay above {} hours on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/compliance/below-threshold")
    @Operation(summary = "Get schools with compliance below threshold")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getSchoolsWithLowCompliance(
            @Parameter(description = "Compliance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view compliance threshold analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to compliance threshold analysis", null, null));
            }

            List<SchoolMonitoringDTO> schools = schoolMonitoringService.findSchoolsWithLowCompliance(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools with low compliance retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools with compliance below {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/alerts/high")
    @Operation(summary = "Get schools with high alert count")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getSchoolsWithHighAlerts(
            @Parameter(description = "Alert count threshold") @RequestParam Integer threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view high alert analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to high alert analysis", null, null));
            }

            List<SchoolMonitoringDTO> schools = schoolMonitoringService.findSchoolsWithHighAlerts(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schools with high alerts retrieved successfully", schools, null));
        } catch (Exception e) {
            log.error("Error retrieving schools with alerts above {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/latest/all")
    @Operation(summary = "Get latest monitoring data for all schools")
    public ResponseEntity<OhmaApiResponse<List<SchoolMonitoringDTO>>> getLatestMonitoringDataForAllSchools() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view all schools monitoring data
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to system-wide monitoring data", null, null));
            }

            List<SchoolMonitoringDTO> monitoringData = schoolMonitoringService.findLatestMonitoringDataForAllSchools();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Latest monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving latest monitoring data for all schools: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/compliance/school/{schoolId}")
    @Operation(summary = "Calculate compliance score for school")
    public ResponseEntity<OhmaApiResponse<Double>> calculateComplianceScore(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view compliance scores for this school
            if (!hasAccess(AccessScope.SCHOOL, schoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to school compliance scores", null, null));
            }

            Double complianceScore = schoolMonitoringService.calculateComplianceScore(schoolId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Compliance score calculated successfully", complianceScore, null));
        } catch (Exception e) {
            log.error("Error calculating compliance score for school {} on {}: {}", schoolId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/update/school/{schoolId}")
    @Operation(summary = "Update monitoring data for school")
    public ResponseEntity<OhmaApiResponse<Void>> updateSchoolMonitoringData(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to update monitoring data
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update monitoring data", null, null));
            }

            schoolMonitoringService.updateSchoolMonitoringData(schoolId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School monitoring data updated successfully", null, null));
        } catch (Exception e) {
            log.error("Error updating monitoring data for school {} on {}: {}", schoolId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/generate/school/{schoolId}")
    @Operation(summary = "Generate monitoring data for school")
    public ResponseEntity<OhmaApiResponse<SchoolMonitoringDTO>> generateMonitoringDataForSchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to generate monitoring data
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to generate monitoring data", null, null));
            }

            SchoolMonitoringDTO monitoringData = schoolMonitoringService.generateMonitoringDataForSchool(schoolId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data generated successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error generating monitoring data for school {} on {}: {}", schoolId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/generate/all")
    @Operation(summary = "Generate monitoring data for all schools")
    public ResponseEntity<OhmaApiResponse<Void>> generateMonitoringDataForAllSchools(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to generate monitoring data for all schools (system operation)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to generate system-wide monitoring data", null, null));
            }

            schoolMonitoringService.generateMonitoringDataForAllSchools(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data generated for all schools successfully", null, null));
        } catch (Exception e) {
            log.error("Error generating monitoring data for all schools on {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 