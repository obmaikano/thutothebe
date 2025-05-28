package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.RegionMonitoringDTO;
import com.ohma.thutothebe.service.RegionMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/monitoring/regions")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<RegionMonitoringDTO>> getByRegionId(
            @Parameter(description = "Region ID") @PathVariable Long regionId) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<RegionMonitoringDTO>> getByRegionIdAndDate(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Monitoring date") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getByRegionIdAndDateRange(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getByDate(
            @Parameter(description = "Monitoring date") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Page<RegionMonitoringDTO>>> getByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getRegionsWithAttendanceBelowThreshold(
            @Parameter(description = "Attendance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getRegionsWithLowCompliance(
            @Parameter(description = "Compliance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getTopPerformingRegions(
            @Parameter(description = "Performance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getUnderperformingRegions(
            @Parameter(description = "Performance threshold") @RequestParam Double threshold,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<RegionMonitoringDTO>>> getLatestMonitoringDataForAllRegions() {
        try {
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Double>> getNationalAverageComplianceScore(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Double complianceScore = regionMonitoringService.getNationalAverageComplianceScore(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "National average compliance score retrieved successfully", complianceScore, null));
        } catch (Exception e) {
            log.error("Error retrieving national average compliance score for {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/attendance-rate")
    @Operation(summary = "Get national average attendance rate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Double>> getNationalAverageAttendanceRate(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Double attendanceRate = regionMonitoringService.getNationalAverageAttendanceRate(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "National average attendance rate retrieved successfully", attendanceRate, null));
        } catch (Exception e) {
            log.error("Error retrieving national average attendance rate for {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/total-schools")
    @Operation(summary = "Get total schools nationally")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalSchoolsNationally(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long totalSchools = regionMonitoringService.getTotalSchoolsNationally(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total schools nationally retrieved successfully", totalSchools, null));
        } catch (Exception e) {
            log.error("Error retrieving total schools nationally for {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/total-teachers")
    @Operation(summary = "Get total teachers nationally")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalTeachersNationally(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long totalTeachers = regionMonitoringService.getTotalTeachersNationally(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total teachers nationally retrieved successfully", totalTeachers, null));
        } catch (Exception e) {
            log.error("Error retrieving total teachers nationally for {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/national/total-students")
    @Operation(summary = "Get total students nationally")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> getTotalStudentsNationally(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Long totalStudents = regionMonitoringService.getTotalStudentsNationally(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total students nationally retrieved successfully", totalStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving total students nationally for {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/update/region/{regionId}")
    @Operation(summary = "Update monitoring data for region")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> updateRegionMonitoringData(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<RegionMonitoringDTO>> generateMonitoringDataForRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            RegionMonitoringDTO monitoringData = regionMonitoringService.generateMonitoringDataForRegion(regionId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region monitoring data generated successfully", monitoringData, null));
        } catch (Exception e) {
            log.error("Error generating monitoring data for region {} on {}: {}", regionId, date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/generate/all")
    @Operation(summary = "Generate monitoring data for all regions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> generateMonitoringDataForAllRegions(
            @Parameter(description = "Monitoring date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            regionMonitoringService.generateMonitoringDataForAllRegions(date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Monitoring data generated for all regions successfully", null, null));
        } catch (Exception e) {
            log.error("Error generating monitoring data for all regions on {}: {}", date, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 