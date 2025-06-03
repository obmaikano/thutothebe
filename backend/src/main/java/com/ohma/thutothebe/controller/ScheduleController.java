package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.DayOfWeek;
import com.ohma.thutothebe.entity.ScheduleStatus;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/schedules")
@Tag(name = "Schedule Management", description = "APIs for managing schedules and timetables with role-based access control")
public class ScheduleController extends BaseController<ScheduleDTO, Long> {

    @Autowired
    private ScheduleService scheduleService;

    public ScheduleController(ScheduleService service) {
        super(service);
    }

    // User-specific schedule endpoints
    @GetMapping("/user")
    @Operation(summary = "Get schedules for current user based on role and permissions")
    public ResponseEntity<OhmaApiResponse<Page<ScheduleDTO>>> getSchedulesForUser(
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            Pageable pageable) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules for this user
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user schedules", null, null));
            }

            Page<ScheduleDTO> schedules = scheduleService.getSchedulesForUser(userRole, userId, userRegionId, userSchoolId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving user schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // School-based endpoints
    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get schedules for a specific school")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules for this school
            if (!hasAccess(AccessScope.SCHOOL, schoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to school schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getSchedulesBySchool(schoolId, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving school schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Class-based endpoints
    @GetMapping("/class/{classId}")
    @Operation(summary = "Get schedules for a specific class")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesByClass(
            @Parameter(description = "Class ID") @PathVariable Long classId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules for this class
            if (!hasAccess(AccessScope.CLASS, classId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to class schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getSchedulesByClass(classId, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving class schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Teacher-based endpoints
    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get schedules for a specific teacher")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesByTeacher(
            @Parameter(description = "Teacher ID") @PathVariable Long teacherId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules for this teacher
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getSchedulesByTeacher(teacherId, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Day-based endpoints
    @GetMapping("/day/{dayOfWeek}")
    @Operation(summary = "Get schedules for a specific day of week")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesByDayOfWeek(
            @Parameter(description = "Day of week") @PathVariable DayOfWeek dayOfWeek,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to day schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getSchedulesByDayOfWeek(dayOfWeek, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Day schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving day schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Student-specific endpoints
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get schedules for a specific student")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules for this student
            if (!hasAccess(AccessScope.USER, studentId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getSchedulesForStudent(studentId, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving student schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Parent-specific endpoints
    @GetMapping("/parent/{parentId}")
    @Operation(summary = "Get schedules for a parent's children")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesForParent(
            @Parameter(description = "Parent ID") @PathVariable Long parentId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules for this parent
            if (!hasAccess(AccessScope.USER, parentId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to parent schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getSchedulesForParent(parentId, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parent schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving parent schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Schedule management endpoints
    @PostMapping("/create")
    @Operation(summary = "Create a new schedule with validation")
    public ResponseEntity<OhmaApiResponse<ScheduleDTO>> createScheduleWithValidation(
            @RequestBody ScheduleDTO scheduleDTO,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            HttpServletRequest request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to create schedules
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create schedules", null, null));
            }

            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            ScheduleDTO created = scheduleService.createScheduleWithValidation(
                scheduleDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}/update")
    @Operation(summary = "Update a schedule with validation")
    public ResponseEntity<OhmaApiResponse<ScheduleDTO>> updateScheduleWithValidation(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestBody ScheduleDTO scheduleDTO,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            HttpServletRequest request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to update schedules
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update schedules", null, null));
            }

            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            ScheduleDTO updated = scheduleService.updateScheduleWithValidation(
                id, scheduleDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}/delete")
    @Operation(summary = "Delete a schedule with validation")
    public ResponseEntity<OhmaApiResponse<Void>> deleteScheduleWithValidation(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to delete schedules (school admin or higher)
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete schedules", null, null));
            }

            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            scheduleService.deleteScheduleWithValidation(id, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/conflicts/check")
    @Operation(summary = "Check for time conflicts")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> checkTimeConflicts(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teacherId,
            @RequestParam DayOfWeek dayOfWeek,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime currentDate,
            @RequestParam(required = false) Long excludeId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to check conflicts
            if (classId != null && !hasAccess(AccessScope.CLASS, classId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to check schedule conflicts", null, null));
            }

            List<ScheduleDTO> conflicts = scheduleService.checkTimeConflicts(classId, teacherId, dayOfWeek, startTime, endTime, currentDate, excludeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conflicts checked successfully", conflicts, null));
        } catch (Exception e) {
            log.error("Error checking time conflicts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get schedule history")
    public ResponseEntity<OhmaApiResponse<List<ScheduleHistoryDTO>>> getScheduleHistory(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to view schedule history
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to schedule history", null, null));
            }

            List<ScheduleHistoryDTO> history = scheduleService.getScheduleHistory(id, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule history retrieved successfully", history, null));
        } catch (Exception e) {
            log.error("Error retrieving schedule history: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{parentId}/versions")
    @Operation(summary = "Get schedule version history")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getScheduleVersionHistory(
            @Parameter(description = "Parent Schedule ID") @PathVariable Long parentId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to view schedule versions
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to schedule versions", null, null));
            }

            List<ScheduleDTO> versions = scheduleService.getScheduleVersionHistory(parentId, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule versions retrieved successfully", versions, null));
        } catch (Exception e) {
            log.error("Error retrieving schedule versions: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/rollback/{version}")
    @Operation(summary = "Rollback schedule to previous version")
    public ResponseEntity<OhmaApiResponse<ScheduleDTO>> rollbackToVersion(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @Parameter(description = "Version number") @PathVariable Integer version,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to rollback schedules (admin level)
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to rollback schedules", null, null));
            }

            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            ScheduleDTO rolledBack = scheduleService.rollbackToVersion(id, version, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule rolled back successfully", rolledBack, null));
        } catch (Exception e) {
            log.error("Error rolling back schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update schedule status")
    public ResponseEntity<OhmaApiResponse<ScheduleDTO>> updateScheduleStatus(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestParam ScheduleStatus status,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to update schedule status
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update schedule status", null, null));
            }

            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            ScheduleDTO updated = scheduleService.updateScheduleStatus(id, status, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule status updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating schedule status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/bulk-update")
    @Operation(summary = "Bulk update schedules")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> bulkUpdateSchedules(
            @RequestParam List<Long> scheduleIds,
            @RequestBody ScheduleDTO updateData,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to bulk update schedules (admin level)
            if (!hasAccess(AccessScope.SCHOOL, userSchoolId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to bulk update schedules", null, null));
            }

            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            List<ScheduleDTO> updated = scheduleService.bulkUpdateSchedules(scheduleIds, updateData, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedules bulk updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error bulk updating schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get active schedules for date range")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getActiveSchedulesForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view schedules
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to date range schedules", null, null));
            }

            List<ScheduleDTO> schedules = scheduleService.getActiveSchedulesForDateRange(startDate, endDate, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Date range schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving date range schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 