package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.MonitoringAlertDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.MonitoringAlertSeverity;
import com.ohma.thutothebe.entity.MonitoringAlertType;
import com.ohma.thutothebe.entity.MonitoringScope;
import com.ohma.thutothebe.service.MonitoringAlertService;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/monitoring/alerts")
@Tag(name = "Monitoring Alert Management", description = "APIs for managing monitoring alerts")
public class MonitoringAlertController extends BaseController<MonitoringAlertDTO, Long> {

    @Autowired
    private MonitoringAlertService monitoringAlertService;

    public MonitoringAlertController(MonitoringAlertService monitoringAlertService) {
        super(monitoringAlertService);
        this.monitoringAlertService = monitoringAlertService;
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get alerts by school ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getBySchoolId(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School alerts retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get alerts by region ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getByRegionId(
            @Parameter(description = "Region ID") @PathVariable Long regionId) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findByRegionId(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regional alerts retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for region {}: {}", regionId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/scope/{scope}")
    @Operation(summary = "Get alerts by scope")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getByScope(
            @Parameter(description = "Monitoring scope") @PathVariable MonitoringScope scope) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findByScope(scope);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts by scope retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for scope {}: {}", scope, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{alertType}")
    @Operation(summary = "Get alerts by alert type")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getByAlertType(
            @Parameter(description = "Alert type") @PathVariable MonitoringAlertType alertType) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findByAlertType(alertType);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts by type retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for type {}: {}", alertType, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/severity/{severity}")
    @Operation(summary = "Get alerts by severity")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getBySeverity(
            @Parameter(description = "Alert severity") @PathVariable MonitoringAlertSeverity severity) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findBySeverity(severity);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts by severity retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for severity {}: {}", severity, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/acknowledged")
    @Operation(summary = "Get alerts by acknowledged status")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Page<MonitoringAlertDTO>>> getByAcknowledged(
            @Parameter(description = "Acknowledged status") @RequestParam boolean acknowledged,
            Pageable pageable) {
        try {
            Page<MonitoringAlertDTO> alerts = monitoringAlertService.findByAcknowledged(acknowledged, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts by acknowledged status retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts by acknowledged status {}: {}", acknowledged, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/resolved")
    @Operation(summary = "Get alerts by resolved status")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Page<MonitoringAlertDTO>>> getByResolved(
            @Parameter(description = "Resolved status") @RequestParam boolean resolved,
            Pageable pageable) {
        try {
            Page<MonitoringAlertDTO> alerts = monitoringAlertService.findByResolved(resolved, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts by resolved status retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts by resolved status {}: {}", resolved, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get alerts by date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findByDateRange(startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts by date range retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for date range {} to {}: {}", startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/date-range")
    @Operation(summary = "Get school alerts by date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getBySchoolIdAndDateRange(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findBySchoolIdAndDateRange(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School alerts by date range retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for school {} and date range {} to {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/date-range")
    @Operation(summary = "Get regional alerts by date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getByRegionIdAndDateRange(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findByRegionIdAndDateRange(regionId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regional alerts by date range retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving alerts for region {} and date range {} to {}: {}", regionId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unacknowledged/critical")
    @Operation(summary = "Get unacknowledged critical alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getUnacknowledgedCritical() {
        try {
            List<MonitoringAlertSeverity> criticalSeverities = List.of(MonitoringAlertSeverity.HIGH, MonitoringAlertSeverity.CRITICAL);
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findUnacknowledgedBySeverities(criticalSeverities);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unacknowledged critical alerts retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving unacknowledged critical alerts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unresolved/severity/{severity}")
    @Operation(summary = "Get unresolved alerts by severity")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getUnresolvedBySeverity(
            @Parameter(description = "Alert severity") @PathVariable MonitoringAlertSeverity severity) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findUnresolvedBySeverity(severity);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unresolved alerts by severity retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving unresolved alerts for severity {}: {}", severity, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/unacknowledged/school/{schoolId}")
    @Operation(summary = "Count unacknowledged alerts for school")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countUnacknowledgedBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            Long count = monitoringAlertService.countUnacknowledgedBySchool(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unacknowledged alert count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting unacknowledged alerts for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/unacknowledged/region/{regionId}")
    @Operation(summary = "Count unacknowledged alerts for region")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countUnacknowledgedByRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId) {
        try {
            Long count = monitoringAlertService.countUnacknowledgedByRegion(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unacknowledged alert count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting unacknowledged alerts for region {}: {}", regionId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/unresolved/school/{schoolId}")
    @Operation(summary = "Count unresolved alerts for school")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countUnresolvedBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            Long count = monitoringAlertService.countUnresolvedBySchool(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unresolved alert count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting unresolved alerts for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/unresolved/region/{regionId}")
    @Operation(summary = "Count unresolved alerts for region")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countUnresolvedByRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId) {
        try {
            Long count = monitoringAlertService.countUnresolvedByRegion(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unresolved alert count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting unresolved alerts for region {}: {}", regionId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/type")
    @Operation(summary = "Get alert type statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<MonitoringAlertType, Long>>> getAlertTypeStatistics(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<MonitoringAlertType, Long> statistics = monitoringAlertService.getAlertTypeStatistics(startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alert type statistics retrieved successfully", statistics, null));
        } catch (Exception e) {
            log.error("Error retrieving alert type statistics for date range {} to {}: {}", startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/severity")
    @Operation(summary = "Get alert severity statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<MonitoringAlertSeverity, Long>>> getAlertSeverityStatistics(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<MonitoringAlertSeverity, Long> statistics = monitoringAlertService.getAlertSeverityStatistics(startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alert severity statistics retrieved successfully", statistics, null));
        } catch (Exception e) {
            log.error("Error retrieving alert severity statistics for date range {} to {}: {}", startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/pending-notifications")
    @Operation(summary = "Get alerts with pending notifications")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getPendingNotifications() {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findPendingNotifications();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Pending notification alerts retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving pending notification alerts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active/school/{schoolId}/type/{alertType}")
    @Operation(summary = "Get active alerts by school and type")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getActiveAlertsBySchoolAndType(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Alert type") @PathVariable MonitoringAlertType alertType) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findActiveAlertsBySchoolAndType(schoolId, alertType);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active school alerts by type retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving active alerts for school {} and type {}: {}", schoolId, alertType, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active/region/{regionId}/type/{alertType}")
    @Operation(summary = "Get active alerts by region and type")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<MonitoringAlertDTO>>> getActiveAlertsByRegionAndType(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Alert type") @PathVariable MonitoringAlertType alertType) {
        try {
            List<MonitoringAlertDTO> alerts = monitoringAlertService.findActiveAlertsByRegionAndType(regionId, alertType);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active regional alerts by type retrieved successfully", alerts, null));
        } catch (Exception e) {
            log.error("Error retrieving active alerts for region {} and type {}: {}", regionId, alertType, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{alertId}/acknowledge")
    @Operation(summary = "Acknowledge an alert")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<MonitoringAlertDTO>> acknowledgeAlert(
            @Parameter(description = "Alert ID") @PathVariable Long alertId,
            @Parameter(description = "User acknowledging the alert") @RequestParam String acknowledgedBy) {
        try {
            MonitoringAlertDTO alert = monitoringAlertService.acknowledgeAlert(alertId, acknowledgedBy);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alert acknowledged successfully", alert, null));
        } catch (Exception e) {
            log.error("Error acknowledging alert {}: {}", alertId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{alertId}/resolve")
    @Operation(summary = "Resolve an alert")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<MonitoringAlertDTO>> resolveAlert(
            @Parameter(description = "Alert ID") @PathVariable Long alertId,
            @Parameter(description = "User resolving the alert") @RequestParam String resolvedBy,
            @Parameter(description = "Resolution notes") @RequestParam(required = false) String resolutionNotes) {
        try {
            MonitoringAlertDTO alert = monitoringAlertService.resolveAlert(alertId, resolvedBy, resolutionNotes);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alert resolved successfully", alert, null));
        } catch (Exception e) {
            log.error("Error resolving alert {}: {}", alertId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new alert")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<MonitoringAlertDTO>> createAlert(
            @Parameter(description = "Alert type") @RequestParam MonitoringAlertType alertType,
            @Parameter(description = "Alert severity") @RequestParam MonitoringAlertSeverity severity,
            @Parameter(description = "Alert scope") @RequestParam MonitoringScope scope,
            @Parameter(description = "Scope ID") @RequestParam(required = false) Long scopeId,
            @Parameter(description = "Alert title") @RequestParam String title,
            @Parameter(description = "Alert description") @RequestParam(required = false) String description,
            @Parameter(description = "Threshold value") @RequestParam(required = false) Double thresholdValue,
            @Parameter(description = "Actual value") @RequestParam(required = false) Double actualValue,
            @Parameter(description = "Metric name") @RequestParam(required = false) String metricName) {
        try {
            MonitoringAlertDTO alert = monitoringAlertService.createAlert(
                alertType, severity, scope, scopeId, title, description, thresholdValue, actualValue, metricName);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alert created successfully", alert, null));
        } catch (Exception e) {
            log.error("Error creating alert: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/process")
    @Operation(summary = "Process alerts (check thresholds and send notifications)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> processAlerts() {
        try {
            monitoringAlertService.processAlerts();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Alerts processed successfully", null, null));
        } catch (Exception e) {
            log.error("Error processing alerts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/send-notifications")
    @Operation(summary = "Send notifications for pending alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> sendNotifications() {
        try {
            monitoringAlertService.sendNotifications();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Notifications sent successfully", null, null));
        } catch (Exception e) {
            log.error("Error sending notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/check-thresholds")
    @Operation(summary = "Check thresholds and generate alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> checkThresholds() {
        try {
            monitoringAlertService.checkThresholds();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Thresholds checked successfully", null, null));
        } catch (Exception e) {
            log.error("Error checking thresholds: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 