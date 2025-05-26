package com.ohma.thutothebe.service;

import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.dto.ScheduleDTO;

public interface ScheduleAccessService {
    
    /**
     * Check if user can create schedules
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @return true if user can create schedules
     */
    boolean canUserCreateSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId);
    
    /**
     * Check if user can view a specific schedule
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param scheduleId Schedule ID to check
     * @return true if user can view the schedule
     */
    boolean canUserViewSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId);
    
    /**
     * Check if user can update a specific schedule
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param scheduleId Schedule ID to check
     * @return true if user can update the schedule
     */
    boolean canUserUpdateSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId);
    
    /**
     * Check if user can delete a specific schedule
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param scheduleId Schedule ID to check
     * @return true if user can delete the schedule
     */
    boolean canUserDeleteSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId);
    
    /**
     * Check if user can create schedule for target scope
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param targetRegionId Target region ID
     * @param targetSchoolId Target school ID
     * @param targetClassId Target class ID
     * @return true if user can create schedule for target
     */
    boolean canUserCreateScheduleForTarget(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId,
                                         Long targetRegionId, Long targetSchoolId, Long targetClassId);
    
    /**
     * Check if user can view schedule history
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param scheduleId Schedule ID to check
     * @return true if user can view schedule history
     */
    boolean canUserViewScheduleHistory(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId);
    
    /**
     * Check if user can rollback schedule version
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param scheduleId Schedule ID to check
     * @return true if user can rollback schedule
     */
    boolean canUserRollbackSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId);
    
    /**
     * Validate schedule data for user's permissions
     * @param userRole User's role
     * @param userId User ID
     * @param userRegionId User's region ID
     * @param userSchoolId User's school ID
     * @param scheduleDTO Schedule data to validate
     * @return true if schedule data is valid for user's permissions
     */
    boolean validateScheduleDataForUser(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, ScheduleDTO scheduleDTO);
} 