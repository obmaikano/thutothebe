package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
import com.ohma.thutothebe.entity.DayOfWeek;
import com.ohma.thutothebe.entity.ScheduleStatus;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleService extends BaseService<ScheduleDTO, Long> {
    
    /**
     * Get schedules for a user based on their role and permissions
     */
    Page<ScheduleDTO> getSchedulesForUser(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Pageable pageable);
    
    /**
     * Get schedules for a specific school
     */
    List<ScheduleDTO> getSchedulesBySchool(Long schoolId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get schedules for a specific class
     */
    List<ScheduleDTO> getSchedulesByClass(Long classId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get schedules for a specific teacher
     */
    List<ScheduleDTO> getSchedulesByTeacher(Long teacherId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get schedules for a specific day of week
     */
    List<ScheduleDTO> getSchedulesByDayOfWeek(DayOfWeek dayOfWeek, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get schedules for a student
     */
    List<ScheduleDTO> getSchedulesForStudent(Long studentId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get next upcoming class for a student
     */
    ScheduleDTO getNextClassForStudent(Long studentId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get schedules for a parent's children
     */
    List<ScheduleDTO> getSchedulesForParent(Long parentId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Create schedule with role-based validation
     */
    ScheduleDTO createScheduleWithValidation(ScheduleDTO scheduleDTO, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String ipAddress, String userAgent);
    
    /**
     * Update schedule with role-based validation
     */
    ScheduleDTO updateScheduleWithValidation(Long id, ScheduleDTO scheduleDTO, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String ipAddress, String userAgent);
    
    /**
     * Delete schedule with role-based validation
     */
    void deleteScheduleWithValidation(Long id, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent);
    
    /**
     * Check for time conflicts
     */
    List<ScheduleDTO> checkTimeConflicts(Long classId, Long teacherId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, LocalDateTime currentDate, Long excludeId);
    
    /**
     * Get schedule history
     */
    List<ScheduleHistoryDTO> getScheduleHistory(Long scheduleId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Get schedule version history
     */
    List<ScheduleDTO> getScheduleVersionHistory(Long parentScheduleId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Rollback to previous version
     */
    ScheduleDTO rollbackToVersion(Long scheduleId, Integer version, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent);
    
    /**
     * Update schedule status
     */
    ScheduleDTO updateScheduleStatus(Long id, ScheduleStatus status, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent);
    
    /**
     * Bulk update schedules
     */
    List<ScheduleDTO> bulkUpdateSchedules(List<Long> scheduleIds, ScheduleDTO updateData, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent);
    
    /**
     * Get active schedules for date range
     */
    List<ScheduleDTO> getActiveSchedulesForDateRange(LocalDateTime startDate, LocalDateTime endDate, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
} 