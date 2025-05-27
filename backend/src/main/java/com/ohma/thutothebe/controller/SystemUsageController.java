package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.SystemUsageDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.SystemUsageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/analytics/system-usage")
@Tag(name = "System Usage", description = "APIs for managing system usage statistics")
public class SystemUsageController extends BaseController<SystemUsageDTO, Long> {

    private final SystemUsageService systemUsageService;

    @Autowired
    public SystemUsageController(SystemUsageService systemUsageService) {
        super(systemUsageService);
        this.systemUsageService = systemUsageService;
    }

    @GetMapping("/current")
    @Operation(summary = "Get current system usage")
    public ResponseEntity<OhmaApiResponse<SystemUsageDTO>> getCurrentUsage() {
        try {
            SystemUsageDTO usage = systemUsageService.getCurrentUsage();
            return ResponseEntity.ok(OhmaApiResponse.success(usage));
        } catch (Exception e) {
            log.error("Error getting current system usage: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get system usage by date range")
    public ResponseEntity<OhmaApiResponse<List<SystemUsageDTO>>> getUsageByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<SystemUsageDTO> usage = systemUsageService.getUsageByDateRange(startDate, endDate);
            return ResponseEntity.ok(OhmaApiResponse.success(usage));
        } catch (Exception e) {
            log.error("Error getting system usage by date range: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/peak-usage")
    @Operation(summary = "Get peak system usage by date range")
    public ResponseEntity<OhmaApiResponse<List<SystemUsageDTO>>> getPeakUsageByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<SystemUsageDTO> usage = systemUsageService.getPeakUsageByDateRange(startDate, endDate);
            return ResponseEntity.ok(OhmaApiResponse.success(usage));
        } catch (Exception e) {
            log.error("Error getting peak system usage by date range: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/login-trends")
    @Operation(summary = "Get login trends by date range")
    public ResponseEntity<OhmaApiResponse<List<SystemUsageDTO>>> getLoginTrendsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<SystemUsageDTO> trends = systemUsageService.getLoginTrendsByDateRange(startDate, endDate);
            return ResponseEntity.ok(OhmaApiResponse.success(trends));
        } catch (Exception e) {
            log.error("Error getting login trends by date range: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/update")
    @Operation(summary = "Update system usage statistics")
    public ResponseEntity<OhmaApiResponse<Void>> updateSystemUsage() {
        try {
            systemUsageService.updateSystemUsage();
            return ResponseEntity.ok(OhmaApiResponse.success(null));
        } catch (Exception e) {
            log.error("Error updating system usage: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 