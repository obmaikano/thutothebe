package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Page<ScheduleDTO>>> getSchedulesForUser(
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            Pageable pageable) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesBySchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesByClass(
            @Parameter(description = "Class ID") @PathVariable Long classId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesByTeacher(
            @Parameter(description = "Teacher ID") @PathVariable Long teacherId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesByDayOfWeek(
            @Parameter(description = "Day of week") @PathVariable DayOfWeek dayOfWeek,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getSchedulesForParent(
            @Parameter(description = "Parent ID") @PathVariable Long parentId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER')")
    public ResponseEntity<OhmaApiResponse<ScheduleDTO>> createScheduleWithValidation(
            @RequestBody ScheduleDTO scheduleDTO,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            HttpServletRequest request) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<ScheduleDTO>> updateScheduleWithValidation(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestBody ScheduleDTO scheduleDTO,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            HttpServletRequest request) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteScheduleWithValidation(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            scheduleService.deleteScheduleWithValidation(
                id, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Conflict detection
    @GetMapping("/conflicts/check")
    @Operation(summary = "Check for time conflicts")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> checkTimeConflicts(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teacherId,
            @RequestParam DayOfWeek dayOfWeek,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime currentDate,
            @RequestParam(required = false) Long excludeId) {
        try {
            List<ScheduleDTO> conflicts = scheduleService.checkTimeConflicts(
                classId, teacherId, dayOfWeek, startTime, endTime, currentDate, excludeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conflict check completed", conflicts, null));
        } catch (Exception e) {
            log.error("Error checking conflicts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // History and versioning
    @GetMapping("/{id}/history")
    @Operation(summary = "Get schedule history")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleHistoryDTO>>> getScheduleHistory(
            @Parameter(description = "Schedule ID") @PathVariable Long id,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getScheduleVersionHistory(
            @Parameter(description = "Parent Schedule ID") @PathVariable Long parentId,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD')")
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
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            ScheduleDTO rolledBack = scheduleService.rollbackToVersion(
                id, version, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule rolled back successfully", rolledBack, null));
        } catch (Exception e) {
            log.error("Error rolling back schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Status management
    @PutMapping("/{id}/status")
    @Operation(summary = "Update schedule status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
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
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            ScheduleDTO updated = scheduleService.updateScheduleStatus(
                id, status, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule status updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating schedule status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Bulk operations
    @PutMapping("/bulk-update")
    @Operation(summary = "Bulk update schedules")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD')")
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
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            List<ScheduleDTO> updated = scheduleService.bulkUpdateSchedules(
                scheduleIds, updateData, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedules updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error bulk updating schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Date range queries
    @GetMapping("/date-range")
    @Operation(summary = "Get active schedules for date range")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<List<ScheduleDTO>>> getActiveSchedulesForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam UserRole userRole,
            @RequestParam Long userId,
            @RequestParam(required = false) Long userRegionId,
            @RequestParam(required = false) Long userSchoolId) {
        try {
            List<ScheduleDTO> schedules = scheduleService.getActiveSchedulesForDateRange(
                startDate, endDate, userRole, userId, userRegionId, userSchoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Date range schedules retrieved successfully", schedules, null));
        } catch (Exception e) {
            log.error("Error retrieving date range schedules: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Helper method to get client IP address
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