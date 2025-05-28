package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserActivityLogDTO;
import com.ohma.thutothebe.entity.UserActivityType;
import com.ohma.thutothebe.service.UserActivityLogService;
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
@RequestMapping("/activity-logs")
@Tag(name = "User Activity Log Management", description = "APIs for managing user activity logs")
public class UserActivityLogController extends BaseController<UserActivityLogDTO, Long> {

    @Autowired
    private UserActivityLogService userActivityLogService;

    public UserActivityLogController(UserActivityLogService userActivityLogService) {
        super(userActivityLogService);
        this.userActivityLogService = userActivityLogService;
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get activity logs by user ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Page<UserActivityLogDTO>>> getByUserId(
            @Parameter(description = "User ID") @PathVariable Long userId,
            Pageable pageable) {
        try {
            Page<UserActivityLogDTO> activityLogs = userActivityLogService.findByUserId(userId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get activity logs by school ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<Page<UserActivityLogDTO>>> getBySchoolId(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            Pageable pageable) {
        try {
            Page<UserActivityLogDTO> activityLogs = userActivityLogService.findBySchoolId(schoolId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for school {}: {}", schoolId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get activity logs by region ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Page<UserActivityLogDTO>>> getByRegionId(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            Pageable pageable) {
        try {
            Page<UserActivityLogDTO> activityLogs = userActivityLogService.findByRegionId(regionId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for region {}: {}", regionId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/activity-type/{activityType}")
    @Operation(summary = "Get activity logs by activity type")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Page<UserActivityLogDTO>>> getByActivityType(
            @Parameter(description = "Activity type") @PathVariable String activityType,
            Pageable pageable) {
        try {
            UserActivityType type = UserActivityType.valueOf(activityType.toUpperCase());
            Page<UserActivityLogDTO> activityLogs = userActivityLogService.findByActivityType(type, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activity type logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for type {}: {}", activityType, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get activity logs by date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<UserActivityLogDTO>>> getByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<UserActivityLogDTO> activityLogs = userActivityLogService.findByDateRange(startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs between {} and {}: {}", startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}/date-range")
    @Operation(summary = "Get activity logs by user ID and date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<UserActivityLogDTO>>> getByUserIdAndDateRange(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<UserActivityLogDTO> activityLogs = userActivityLogService.findByUserIdAndDateRange(userId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for user {} between {} and {}: {}", userId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}/date-range")
    @Operation(summary = "Get activity logs by school ID and date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<UserActivityLogDTO>>> getBySchoolIdAndDateRange(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<UserActivityLogDTO> activityLogs = userActivityLogService.findBySchoolIdAndDateRange(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}/date-range")
    @Operation(summary = "Get activity logs by region ID and date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<UserActivityLogDTO>>> getByRegionIdAndDateRange(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<UserActivityLogDTO> activityLogs = userActivityLogService.findByRegionIdAndDateRange(regionId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region activity logs retrieved successfully", activityLogs, null));
        } catch (Exception e) {
            log.error("Error retrieving activity logs for region {} between {} and {}: {}", regionId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/active-users/school/{schoolId}")
    @Operation(summary = "Count active users by school")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countActiveUsersBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Long count = userActivityLogService.countActiveUsersBySchool(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active users count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting active users for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/active-users/region/{regionId}")
    @Operation(summary = "Count active users by region")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countActiveUsersByRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Long count = userActivityLogService.countActiveUsersByRegion(regionId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active users count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting active users for region {} between {} and {}: {}", regionId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/activity/school/{schoolId}/type/{activityType}")
    @Operation(summary = "Count activity by school and type")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countActivityBySchoolAndType(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Activity type") @PathVariable String activityType,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            UserActivityType type = UserActivityType.valueOf(activityType.toUpperCase());
            Long count = userActivityLogService.countActivityBySchoolAndType(schoolId, type, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activity count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting activity for school {} and type {} between {} and {}: {}", schoolId, activityType, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/activity/region/{regionId}/type/{activityType}")
    @Operation(summary = "Count activity by region and type")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countActivityByRegionAndType(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Activity type") @PathVariable String activityType,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            UserActivityType type = UserActivityType.valueOf(activityType.toUpperCase());
            Long count = userActivityLogService.countActivityByRegionAndType(regionId, type, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activity count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting activity for region {} and type {} between {} and {}: {}", regionId, activityType, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/school/{schoolId}")
    @Operation(summary = "Get activity statistics by school")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<String, Long>>> getActivityStatisticsBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<UserActivityType, Long> statistics = userActivityLogService.getActivityStatisticsBySchool(schoolId, startDate, endDate);
            Map<String, Long> stringKeyStatistics = statistics.entrySet().stream()
                    .collect(java.util.stream.Collectors.toMap(
                            entry -> entry.getKey().toString(),
                            Map.Entry::getValue
                    ));
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School activity statistics retrieved successfully", stringKeyStatistics, null));
        } catch (Exception e) {
            log.error("Error retrieving activity statistics for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/region/{regionId}")
    @Operation(summary = "Get activity statistics by region")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<String, Long>>> getActivityStatisticsByRegion(
            @Parameter(description = "Region ID") @PathVariable Long regionId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<UserActivityType, Long> statistics = userActivityLogService.getActivityStatisticsByRegion(regionId, startDate, endDate);
            Map<String, Long> stringKeyStatistics = statistics.entrySet().stream()
                    .collect(java.util.stream.Collectors.toMap(
                            entry -> entry.getKey().toString(),
                            Map.Entry::getValue
                    ));
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region activity statistics retrieved successfully", stringKeyStatistics, null));
        } catch (Exception e) {
            log.error("Error retrieving activity statistics for region {} between {} and {}: {}", regionId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/peak-usage-hours/school/{schoolId}")
    @Operation(summary = "Get peak usage hours by school")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<Integer, Long>>> getPeakUsageHoursBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<Integer, Long> peakHours = userActivityLogService.getPeakUsageHoursBySchool(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Peak usage hours retrieved successfully", peakHours, null));
        } catch (Exception e) {
            log.error("Error retrieving peak usage hours for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/module-usage/school/{schoolId}")
    @Operation(summary = "Get module usage statistics by school")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Map<String, Long>>> getModuleUsageStatisticsBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<String, Long> moduleUsage = userActivityLogService.getModuleUsageStatisticsBySchool(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Module usage statistics retrieved successfully", moduleUsage, null));
        } catch (Exception e) {
            log.error("Error retrieving module usage statistics for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/average-session-duration/school/{schoolId}")
    @Operation(summary = "Get average session duration by school")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Double>> getAverageSessionDurationBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Double averageDuration = userActivityLogService.getAverageSessionDurationBySchool(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Average session duration retrieved successfully", averageDuration, null));
        } catch (Exception e) {
            log.error("Error retrieving average session duration for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/count/failed-activities/school/{schoolId}")
    @Operation(summary = "Count failed activities by school")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Long>> countFailedActivitiesBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Long count = userActivityLogService.countFailedActivitiesBySchool(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Failed activities count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error counting failed activities for school {} between {} and {}: {}", schoolId, startDate, endDate, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/log-activity")
    @Operation(summary = "Log user activity")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<UserActivityLogDTO>> logActivity(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Activity type") @RequestParam String activityType,
            @Parameter(description = "Module name") @RequestParam String moduleName,
            @Parameter(description = "Feature name") @RequestParam String featureName,
            @Parameter(description = "Action performed") @RequestParam String actionPerformed,
            @Parameter(description = "Session ID") @RequestParam String sessionId,
            @Parameter(description = "IP address") @RequestParam String ipAddress,
            @Parameter(description = "User agent") @RequestParam String userAgent,
            @Parameter(description = "Duration in minutes") @RequestParam(required = false) Integer durationMinutes,
            @Parameter(description = "Success flag") @RequestParam(defaultValue = "true") boolean success,
            @Parameter(description = "Error message") @RequestParam(required = false) String errorMessage,
            @Parameter(description = "Additional data") @RequestParam(required = false) String additionalData) {
        try {
            UserActivityType type = UserActivityType.valueOf(activityType.toUpperCase());
            UserActivityLogDTO loggedActivity = userActivityLogService.logActivity(
                    userId, type, moduleName, featureName, actionPerformed, sessionId,
                    ipAddress, userAgent, durationMinutes, success, errorMessage, additionalData);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User activity logged successfully", loggedActivity, null));
        } catch (Exception e) {
            log.error("Error logging user activity: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/log-login")
    @Operation(summary = "Log user login")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Void>> logUserLogin(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Session ID") @RequestParam String sessionId,
            @Parameter(description = "IP address") @RequestParam String ipAddress,
            @Parameter(description = "User agent") @RequestParam String userAgent) {
        try {
            userActivityLogService.logUserLogin(userId, sessionId, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User login logged successfully", null, null));
        } catch (Exception e) {
            log.error("Error logging user login: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/log-logout")
    @Operation(summary = "Log user logout")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Void>> logUserLogout(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Session ID") @RequestParam String sessionId,
            @Parameter(description = "Session duration in minutes") @RequestParam Integer sessionDurationMinutes) {
        try {
            userActivityLogService.logUserLogout(userId, sessionId, sessionDurationMinutes);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User logout logged successfully", null, null));
        } catch (Exception e) {
            log.error("Error logging user logout: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/log-page-view")
    @Operation(summary = "Log page view")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Void>> logPageView(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Module name") @RequestParam String moduleName,
            @Parameter(description = "Feature name") @RequestParam String featureName,
            @Parameter(description = "Session ID") @RequestParam String sessionId,
            @Parameter(description = "IP address") @RequestParam String ipAddress) {
        try {
            userActivityLogService.logPageView(userId, moduleName, featureName, sessionId, ipAddress);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Page view logged successfully", null, null));
        } catch (Exception e) {
            log.error("Error logging page view: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/log-error")
    @Operation(summary = "Log error")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Void>> logError(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Module name") @RequestParam String moduleName,
            @Parameter(description = "Feature name") @RequestParam String featureName,
            @Parameter(description = "Error message") @RequestParam String errorMessage,
            @Parameter(description = "Session ID") @RequestParam String sessionId,
            @Parameter(description = "IP address") @RequestParam String ipAddress) {
        try {
            userActivityLogService.logError(userId, moduleName, featureName, errorMessage, sessionId, ipAddress);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Error logged successfully", null, null));
        } catch (Exception e) {
            log.error("Error logging error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 