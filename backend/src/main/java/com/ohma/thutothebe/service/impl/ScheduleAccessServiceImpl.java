package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.ScheduleAccessService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional(readOnly = true)
public class ScheduleAccessServiceImpl implements ScheduleAccessService {

    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private RegionRepository regionRepository;
    
    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public boolean canUserCreateSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
            case MINISTRY_STAFF:
            case DIRECTOR:
            case REGIONAL_ADMIN:
            case REGIONAL_OFFICER:
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
                return true;
            case TEACHER:
                // Teachers can create limited schedules (partial update capability)
                return false; // Only partial updates allowed
            case STUDENT:
            case PARENT:
                return false;
            default:
                return false;
        }
    }

    @Override
    public boolean canUserViewSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId) {
        Optional<Schedule> scheduleOpt = scheduleRepository.findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            return false;
        }
        
        Schedule schedule = scheduleOpt.get();
        
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
            case MINISTRY_STAFF:
                return true; // Can view all schedules
                
            case DIRECTOR:
                // Can view schedules in assigned regions
                return userRegionId == null || 
                       schedule.getRegion() == null || 
                       schedule.getRegion().getId().equals(userRegionId);
                
            case REGIONAL_ADMIN:
            case REGIONAL_OFFICER:
                // Can view schedules within their region
                return schedule.getRegion() != null && 
                       schedule.getRegion().getId().equals(userRegionId);
                
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
                // Can view schedules within their school
                return schedule.getSchool() != null && 
                       schedule.getSchool().getId().equals(userSchoolId);
                
            case TEACHER:
                // Can view schedules they created or are assigned to teach
                return (schedule.getCreatedBy() != null && schedule.getCreatedBy().getId().equals(userId)) ||
                       (schedule.getTeacher() != null && schedule.getTeacher().getId().equals(userId)) ||
                       (schedule.getSchool() != null && schedule.getSchool().getId().equals(userSchoolId));
                
            case STUDENT:
                // Can view schedules for their class
                return isScheduleForStudentClass(schedule, userId);
                
            case PARENT:
                // Can view schedules for their children's classes
                return isScheduleForParentChildren(schedule, userId);
                
            default:
                return false;
        }
    }

    @Override
    public boolean canUserUpdateSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId) {
        Optional<Schedule> scheduleOpt = scheduleRepository.findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            return false;
        }
        
        Schedule schedule = scheduleOpt.get();
        
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
                return true; // Can update all schedules
                
            case MINISTRY_STAFF:
            case DIRECTOR:
                // Can update schedules in assigned regions
                return userRegionId == null || 
                       schedule.getRegion() == null || 
                       schedule.getRegion().getId().equals(userRegionId);
                
            case REGIONAL_ADMIN:
                // Can update schedules within their region
                return schedule.getRegion() != null && 
                       schedule.getRegion().getId().equals(userRegionId);
                
            case REGIONAL_OFFICER:
                // Can update schedules in assigned schools within region
                return schedule.getRegion() != null && 
                       schedule.getRegion().getId().equals(userRegionId) &&
                       schedule.getSchool() != null &&
                       isSchoolInRegion(schedule.getSchool().getId(), userRegionId);
                
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
                // Can update all schedules within their school
                return schedule.getSchool() != null && 
                       schedule.getSchool().getId().equals(userSchoolId);
                
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
                // Can update schedules within their school/department
                return schedule.getSchool() != null && 
                       schedule.getSchool().getId().equals(userSchoolId);
                
            case TEACHER:
                // Can only do partial updates on their own schedules
                return schedule.getTeacher() != null && 
                       schedule.getTeacher().getId().equals(userId);
                
            case STUDENT:
            case PARENT:
                return false; // Cannot update schedules
                
            default:
                return false;
        }
    }

    @Override
    public boolean canUserDeleteSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId) {
        Optional<Schedule> scheduleOpt = scheduleRepository.findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            return false;
        }
        
        Schedule schedule = scheduleOpt.get();
        
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
                return true; // Can delete all schedules
                
            case MINISTRY_STAFF:
            case DIRECTOR:
                // Can delete schedules in assigned regions
                return userRegionId == null || 
                       schedule.getRegion() == null || 
                       schedule.getRegion().getId().equals(userRegionId);
                
            case REGIONAL_ADMIN:
                // Can delete schedules within their region
                return schedule.getRegion() != null && 
                       schedule.getRegion().getId().equals(userRegionId);
                
            case REGIONAL_OFFICER:
                // Can delete schedules in assigned schools within region
                return schedule.getRegion() != null && 
                       schedule.getRegion().getId().equals(userRegionId) &&
                       schedule.getSchool() != null &&
                       isSchoolInRegion(schedule.getSchool().getId(), userRegionId);
                
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
                // Can delete schedules within their school
                return schedule.getSchool() != null && 
                       schedule.getSchool().getId().equals(userSchoolId);
                
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
            case TEACHER:
            case STUDENT:
            case PARENT:
                return false; // Cannot delete schedules
                
            default:
                return false;
        }
    }

    @Override
    public boolean canUserCreateScheduleForTarget(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId,
                                                 Long targetRegionId, Long targetSchoolId, Long targetClassId) {
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
                return true; // Can create schedules for any target
                
            case MINISTRY_STAFF:
            case DIRECTOR:
                // Can create schedules for assigned regions
                return targetRegionId == null || targetRegionId.equals(userRegionId);
                
            case REGIONAL_ADMIN:
                // Can create schedules within their region
                if (targetRegionId != null && !targetRegionId.equals(userRegionId)) {
                    return false;
                }
                return targetSchoolId == null || isSchoolInRegion(targetSchoolId, userRegionId);
                
            case REGIONAL_OFFICER:
                // Can create schedules in assigned schools within region
                return (targetRegionId == null || targetRegionId.equals(userRegionId)) &&
                       (targetSchoolId == null || isSchoolInRegion(targetSchoolId, userRegionId));
                
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
                // Can create schedules within their school
                return targetSchoolId == null || targetSchoolId.equals(userSchoolId);
                
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
                // Can create schedules within their school/department
                return targetSchoolId == null || targetSchoolId.equals(userSchoolId);
                
            case TEACHER:
            case STUDENT:
            case PARENT:
                return false; // Cannot create schedules
                
            default:
                return false;
        }
    }

    @Override
    public boolean canUserViewScheduleHistory(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId) {
        // History viewing follows same rules as schedule viewing
        return canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId);
    }

    @Override
    public boolean canUserRollbackSchedule(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Long scheduleId) {
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
            case MINISTRY_STAFF:
            case DIRECTOR:
            case REGIONAL_ADMIN:
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
                return canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId);
            case REGIONAL_OFFICER:
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
            case TEACHER:
            case STUDENT:
            case PARENT:
                return false; // Cannot rollback schedules
            default:
                return false;
        }
    }

    @Override
    public boolean validateScheduleDataForUser(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, ScheduleDTO scheduleDTO) {
        // Validate that user can create schedule for the specified targets
        return canUserCreateScheduleForTarget(userRole, userId, userRegionId, userSchoolId,
                scheduleDTO.regionId(), scheduleDTO.schoolId(), scheduleDTO.classId());
    }

    // Helper methods
    private boolean isScheduleForStudentClass(Schedule schedule, Long userId) {
        if (schedule.getClassEntity() == null) {
            return false;
        }
        
        return studentRepository.existsByUserIdAndStudentClassId(userId, schedule.getClassEntity().getId());
    }

    private boolean isScheduleForParentChildren(Schedule schedule, Long parentId) {
        if (schedule.getClassEntity() == null) {
            return false;
        }
        
        return studentRepository.existsByUserParentIdAndStudentClassId(parentId, schedule.getClassEntity().getId());
    }

    private boolean isSchoolInRegion(Long schoolId, Long regionId) {
        return schoolRepository.findById(schoolId)
                .map(school -> school.getRegion() != null && school.getRegion().getId().equals(regionId))
                .orElse(false);
    }
} 