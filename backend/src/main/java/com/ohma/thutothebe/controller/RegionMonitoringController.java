package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.RegionMonitoringDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.RegionMonitoringService;
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
@RequestMapping("/monitoring/regions")
@Tag(name = "Region Monitoring Management", description = "APIs for managing region monitoring data")
public class RegionMonitoringController extends BaseController<RegionMonitoringDTO, Long> {

    @Autowired
    private RegionMonitoringService regionMonitoringService;

    public RegionMonitoringController(RegionMonitoringService regionMonitoringService) {
        super(regionMonitoringService);
        this.regionMonitoringService = regionMonitoringService;
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get latest monitoring data by region ID")
    public ResponseEntity<OhmaApiResponse<RegionMonitoringDTO>> getByRegionId(
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

            RegionMonitoringDTO monitoringData = regionMonitoringService.findLatestMonitoringDataForRegion(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for region {}: {}", regionId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/date/{date}")
    @Operation(summary = "Get monitoring data by region ID and date")
    public ResponseEntity<OhmaApiResponse<RegionMonitoringDTO>> getByRegionIdAndDate(
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

            RegionMonitoringDTO monitoringData = regionMonitoringService.findByRegionIdAndDate(regionId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for region {} on date {}: {}", regionId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/date-range")
    @Operation(summary = "Get monitoring data by region ID and date range")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getByRegionIdAndDateRange(
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

            List<RegionMonitoringDTO> monitoringData = regionMonitoringService.findByRegionIdAndDateRange(regionId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for region {} between {} and {}: {}", regionId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date/{date}")
    @Operation(summary = "Get monitoring data by date")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getByDate(
            @Parameter(description = "Monitoring date") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view all regional monitoring data by date
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to system-wide regional monitoring data", null, null));
            }

            List<RegionMonitoringDTO> monitoringData = regionMonitoringService.findByDate(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get monitoring data by date range")
    public ResponseEntity<OhmaApiResponse<Page<RegionMonitoringDTO>>> getByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view all regional monitoring data by date range
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to system-wide regional monitoring data", null, null));
            }

            Page<RegionMonitoringDTO> monitoringData = regionMonitoringService.findByDateRange(startDate, endDate, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving monitoring data between {} and {}: {}", startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/attendance/below-threshold")
    @Operation(summary = "Get regions with attendance below threshold")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getRegionsWithAttendanceBelowThreshold(
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
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional attendance threshold analysis", null, null));
            }

            List<RegionMonitoringDTO> regions = regionMonitoringService.findRegionsWithLowAttendance(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regions with low attendance retrieved successfully", regions, null));
        } catch (Exception e) {
            log.error("Error retrieving regions with attendance below {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/performance/below-threshold")
    @Operation(summary = "Get regions with low compliance")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getRegionsWithLowCompliance(
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
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional compliance threshold analysis", null, null));
            }

            List<RegionMonitoringDTO> regions = regionMonitoringService.findRegionsWithLowCompliance(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regions with low compliance retrieved successfully", regions, null));
        } catch (Exception e) {
            log.error("Error retrieving regions with compliance below {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/top-performing")
    @Operation(summary = "Get top performing regions")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getTopPerformingRegions(
            @Parameter(description = "Performance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view performance analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional performance analysis", null, null));
            }

            List<RegionMonitoringDTO> regions = regionMonitoringService.findTopPerformingRegions(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Top performing regions retrieved successfully", regions, null));
        } catch (Exception e) {
            log.error("Error retrieving top performing regions above {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/underperforming")
    @Operation(summary = "Get underperforming regions")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getUnderperformingRegions(
            @Parameter(description = "Performance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view performance analysis
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to regional performance analysis", null, null));
            }

            List<RegionMonitoringDTO> regions = regionMonitoringService.findUnderperformingRegions(threshold, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Underperforming regions retrieved successfully", regions, null));
        } catch (Exception e) {
            log.error("Error retrieving underperforming regions below {} on {}: {}", threshold, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/latest/all")
    @Operation(summary = "Get latest monitoring data for all regions")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getLatestMonitoringDataForAllRegions() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional admin access or higher to view all regional monitoring data
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to system-wide regional monitoring data", null, null));
            }

            List<RegionMonitoringDTO> monitoringData = regionMonitoringService.findLatestMonitoringDataForAllRegions();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Latest monitoring data retrieved successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error retrieving latest monitoring data for all regions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/compliance-score")
    @Operation(summary = "Get national average compliance score")
    public ResponseEntity<OhmaApiResponse<Double>> getNationalAverageComplianceScore(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view national statistics (system-wide metrics)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to national statistics", null, null));
            }

            Double complianceScore = regionMonitoringService.getNationalAverageComplianceScore(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "National compliance score retrieved successfully", complianceScore, null));
        } catch (Exception e) {
            log.error("Error retrieving national compliance score for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/attendance-rate")
    @Operation(summary = "Get national average attendance rate")
    public ResponseEntity<OhmaApiResponse<Double>> getNationalAverageAttendanceRate(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view national statistics (system-wide metrics)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to national statistics", null, null));
            }

            Double attendanceRate = regionMonitoringService.getNationalAverageAttendanceRate(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "National attendance rate retrieved successfully", attendanceRate, null));
        } catch (Exception e) {
            log.error("Error retrieving national attendance rate for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/total-schools")
    @Operation(summary = "Get total schools nationally")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalSchoolsNationally(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view national statistics (system-wide metrics)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to national statistics", null, null));
            }

            Long totalSchools = regionMonitoringService.getTotalSchoolsNationally(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total schools nationally retrieved successfully", totalSchools, null));
        } catch (Exception e) {
            log.error("Error retrieving total schools nationally for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/total-teachers")
    @Operation(summary = "Get total teachers nationally")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalTeachersNationally(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view national statistics (system-wide metrics)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to national statistics", null, null));
            }

            Long totalTeachers = regionMonitoringService.getTotalTeachersNationally(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total teachers nationally retrieved successfully", totalTeachers, null));
        } catch (Exception e) {
            log.error("Error retrieving total teachers nationally for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/total-students")
    @Operation(summary = "Get total students nationally")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalStudentsNationally(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to view national statistics (system-wide metrics)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to national statistics", null, null));
            }

            Long totalStudents = regionMonitoringService.getTotalStudentsNationally(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total students nationally retrieved successfully", totalStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving total students nationally for date {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/update/region/{regionId}")
    @Operation(summary = "Update monitoring data for region")
    public ResponseEntity<OhmaApiResponse<Void>> updateRegionMonitoringData(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to update monitoring data for this region (regional admin or higher)
            if (!hasAccess(AccessScope.REGION, regionId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update regional monitoring data", null, null));
            }

            regionMonitoringService.updateRegionMonitoringData(regionId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region monitoring data updated successfully", null, null));
        } catch (Exception e) {
            log.error("Error updating monitoring data for region {} on {}: {}", regionId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/generate/region/{regionId}")
    @Operation(summary = "Generate monitoring data for region")
    public ResponseEntity<OhmaApiResponse<RegionMonitoringDTO>> generateMonitoringDataForRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to generate monitoring data for this region (regional admin or higher)
            if (!hasAccess(AccessScope.REGION, regionId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to generate regional monitoring data", null, null));
            }

            RegionMonitoringDTO monitoringData = regionMonitoringService.generateMonitoringDataForRegion(regionId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data generated successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error generating monitoring data for region {} on {}: {}", regionId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/generate/all")
    @Operation(summary = "Generate monitoring data for all regions")
    public ResponseEntity<OhmaApiResponse<Void>> generateMonitoringDataForAllRegions(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access to generate monitoring data for all regions (system operation)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to generate system-wide regional monitoring data", null, null));
            }

            regionMonitoringService.generateMonitoringDataForAllRegions(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data generated for all regions successfully", null, null));
        } catch (Exception e) {
            log.error("Error generating monitoring data for all regions on {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 