package com.ohma.thutothebe.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.ScheduleHistoryMapper;
import com.ohma.thutothebe.mapper.ScheduleMapper;
import com.ohma.thutothebe.repository.ScheduleHistoryRepository;
import com.ohma.thutothebe.repository.ScheduleRepository;
import com.ohma.thutothebe.service.ScheduleAccessService;
import com.ohma.thutothebe.service.ScheduleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class ScheduleServiceImpl extends BaseServiceImpl<Schedule, ScheduleDTO, Long> implements ScheduleService {

    @Autowired
    private ScheduleMapper scheduleMapper;
    
    @Autowired
    private ScheduleHistoryMapper scheduleHistoryMapper;
    
    @Autowired
    private ScheduleHistoryRepository scheduleHistoryRepository;
    
    @Autowired
    private ScheduleAccessService scheduleAccessService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ScheduleServiceImpl(ScheduleRepository repository) {
        super(repository);
    }

    private ScheduleRepository getScheduleRepository() {
        return (ScheduleRepository) repository;
    }

    @Override
    protected Schedule mapToEntity(ScheduleDTO dto) {
        return scheduleMapper.toEntity(dto);
    }

    @Override
    protected ScheduleDTO mapToDto(Schedule entity) {
        return scheduleMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Schedule entity, ScheduleDTO dto) {
        scheduleMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScheduleDTO> getSchedulesForUser(UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, Pageable pageable) {
        Page<Schedule> schedules = getScheduleRepository().findSchedulesForUser(userRole, userId, userRegionId, userSchoolId, pageable);
        return schedules.map(scheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesBySchool(Long schoolId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        validateUserCanViewSchoolSchedules(schoolId, userRole, userId, userRegionId, userSchoolId);
        
        List<Schedule> schedules = getScheduleRepository().findBySchoolIdAndActive(schoolId);
        return schedules.stream()
                .filter(schedule -> scheduleAccessService.canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, schedule.getId()))
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesByClass(Long classId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        List<Schedule> schedules = getScheduleRepository().findByClassIdAndActive(classId);
        return schedules.stream()
                .filter(schedule -> scheduleAccessService.canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, schedule.getId()))
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesByTeacher(Long teacherId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        List<Schedule> schedules = getScheduleRepository().findByTeacherIdAndActive(teacherId);
        return schedules.stream()
                .filter(schedule -> scheduleAccessService.canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, schedule.getId()))
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesByDayOfWeek(DayOfWeek dayOfWeek, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        List<Schedule> schedules = getScheduleRepository().findActiveSchedulesForDayOfWeek(dayOfWeek, LocalDateTime.now());
        return schedules.stream()
                .filter(schedule -> scheduleAccessService.canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, schedule.getId()))
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesForStudent(Long studentId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        validateUserCanViewStudentSchedules(studentId, userRole, userId, userRegionId, userSchoolId);
        
        List<Schedule> schedules = getScheduleRepository().findSchedulesForStudent(studentId);
        return schedules.stream()
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesForParent(Long parentId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        if (!userRole.equals(UserRole.PARENT) || !userId.equals(parentId)) {
            throw new IllegalArgumentException("Access denied: Can only view own children's schedules");
        }
        
        List<Schedule> schedules = getScheduleRepository().findSchedulesForParent(parentId);
        return schedules.stream()
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleDTO createScheduleWithValidation(ScheduleDTO scheduleDTO, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String ipAddress, String userAgent) {
        // Validate permissions
        if (!scheduleAccessService.canUserCreateSchedule(userRole, userId, userRegionId, userSchoolId)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to create schedules");
        }
        
        if (!scheduleAccessService.validateScheduleDataForUser(userRole, userId, userRegionId, userSchoolId, scheduleDTO)) {
            throw new IllegalArgumentException("Access denied: Cannot create schedule for specified target");
        }
        
        // Check for conflicts
        List<ScheduleDTO> conflicts = checkTimeConflicts(
            scheduleDTO.classId(), 
            scheduleDTO.teacherId(), 
            scheduleDTO.dayOfWeek(), 
            scheduleDTO.startTime(), 
            scheduleDTO.endTime(), 
            LocalDateTime.now(), 
            null
        );
        
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Schedule conflicts detected with existing schedules");
        }
        
        // Create schedule
        ScheduleDTO created = create(scheduleDTO);
        
        // Create audit trail
        createScheduleHistory(created.id(), ScheduleHistoryAction.CREATED, userId.toString(), 
                            null, serializeScheduleData(created), "Schedule created", ipAddress, userAgent, 1);
        
        log.info("Schedule created with ID: {} by user: {}", created.id(), userId);
        return created;
    }

    @Override
    public ScheduleDTO updateScheduleWithValidation(Long id, ScheduleDTO scheduleDTO, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String ipAddress, String userAgent) {
        // Validate permissions
        if (!scheduleAccessService.canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, id)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to update this schedule");
        }
        
        // Get current schedule for audit trail
        ScheduleDTO currentSchedule = getById(id);
        
        // For teachers, only allow partial updates
        if (userRole.equals(UserRole.TEACHER)) {
            scheduleDTO = createPartialUpdateForTeacher(currentSchedule, scheduleDTO);
        }
        
        // Check for conflicts (excluding current schedule)
        List<ScheduleDTO> conflicts = checkTimeConflicts(
            scheduleDTO.classId(), 
            scheduleDTO.teacherId(), 
            scheduleDTO.dayOfWeek(), 
            scheduleDTO.startTime(), 
            scheduleDTO.endTime(), 
            LocalDateTime.now(), 
            id
        );
        
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Schedule conflicts detected with existing schedules");
        }
        
        // Update schedule
        ScheduleDTO updated = update(id, scheduleDTO);
        
        // Create audit trail
        createScheduleHistory(id, ScheduleHistoryAction.UPDATED, userId.toString(),
                            serializeScheduleData(currentSchedule), serializeScheduleData(updated), 
                            "Schedule updated", ipAddress, userAgent, updated.scheduleVersion());
        
        log.info("Schedule updated with ID: {} by user: {}", id, userId);
        return updated;
    }

    @Override
    public void deleteScheduleWithValidation(Long id, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent) {
        // Validate permissions
        if (!scheduleAccessService.canUserDeleteSchedule(userRole, userId, userRegionId, userSchoolId, id)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to delete this schedule");
        }
        
        // Get current schedule for audit trail
        ScheduleDTO currentSchedule = getById(id);
        
        // Create audit trail before deletion
        createScheduleHistory(id, ScheduleHistoryAction.DELETED, userId.toString(),
                            serializeScheduleData(currentSchedule), null, reason, ipAddress, userAgent, currentSchedule.scheduleVersion());
        
        // Delete schedule
        delete(id);
        
        log.info("Schedule deleted with ID: {} by user: {}", id, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> checkTimeConflicts(Long classId, Long teacherId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, LocalDateTime currentDate, Long excludeId) {
        List<Schedule> conflicts = getScheduleRepository().findConflictingSchedulesForClass(
            classId, dayOfWeek, startTime, endTime, currentDate, excludeId
        );
        
        if (teacherId != null) {
            List<Schedule> teacherConflicts = getScheduleRepository().findConflictingSchedulesForTeacher(
                teacherId, dayOfWeek, startTime, endTime, currentDate, excludeId
            );
            conflicts.addAll(teacherConflicts);
        }
        
        return conflicts.stream()
                .distinct()
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleHistoryDTO> getScheduleHistory(Long scheduleId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        if (!scheduleAccessService.canUserViewScheduleHistory(userRole, userId, userRegionId, userSchoolId, scheduleId)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to view schedule history");
        }
        
        List<ScheduleHistory> history = scheduleHistoryRepository.findByScheduleIdOrderByChangeTimestampDesc(scheduleId);
        return history.stream()
                .map(scheduleHistoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getScheduleVersionHistory(Long parentScheduleId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        if (!scheduleAccessService.canUserViewScheduleHistory(userRole, userId, userRegionId, userSchoolId, parentScheduleId)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to view schedule version history");
        }
        
        List<Schedule> versions = getScheduleRepository().findVersionHistory(parentScheduleId);
        return versions.stream()
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleDTO rollbackToVersion(Long scheduleId, Integer version, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent) {
        if (!scheduleAccessService.canUserRollbackSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to rollback schedule");
        }
        
        // Get current schedule
        ScheduleDTO currentSchedule = getById(scheduleId);
        
        // Find the version to rollback to
        Schedule versionSchedule = getScheduleRepository().findByParentIdAndVersion(
            currentSchedule.parentScheduleId() != null ? currentSchedule.parentScheduleId() : scheduleId, 
            version
        );
        
        if (versionSchedule == null) {
            throw new ResourceNotFoundException("Schedule version not found: " + version);
        }
        
        // Create new version with rollback data
        ScheduleDTO rollbackData = scheduleMapper.toDto(versionSchedule);
        ScheduleDTO updated = update(scheduleId, rollbackData);
        
        // Create audit trail
        createScheduleHistory(scheduleId, ScheduleHistoryAction.VERSION_ROLLBACK, userId.toString(),
                            serializeScheduleData(currentSchedule), serializeScheduleData(updated), 
                            reason + " (Rolled back to version " + version + ")", ipAddress, userAgent, updated.scheduleVersion());
        
        log.info("Schedule rolled back to version {} for ID: {} by user: {}", version, scheduleId, userId);
        return updated;
    }

    @Override
    public ScheduleDTO updateScheduleStatus(Long id, ScheduleStatus status, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent) {
        if (!scheduleAccessService.canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, id)) {
            throw new IllegalArgumentException("Access denied: Insufficient permissions to update schedule status");
        }
        
        ScheduleDTO currentSchedule = getById(id);
        ScheduleDTO updatedSchedule = new ScheduleDTO(
            currentSchedule.id(), currentSchedule.title(), currentSchedule.description(),
            currentSchedule.startTime(), currentSchedule.endTime(), currentSchedule.dayOfWeek(),
            currentSchedule.effectiveDate(), currentSchedule.expiryDate(), currentSchedule.location(),
            currentSchedule.type(), status, currentSchedule.color(), currentSchedule.isRecurring(),
            currentSchedule.recurrenceRule(), currentSchedule.courseId(), currentSchedule.courseName(),
            currentSchedule.classId(), currentSchedule.className(), currentSchedule.schoolId(),
            currentSchedule.schoolName(), currentSchedule.regionId(), currentSchedule.regionName(),
            currentSchedule.createdById(), currentSchedule.createdByName(), currentSchedule.teacherId(),
            currentSchedule.teacherName(), currentSchedule.scheduleVersion(), currentSchedule.parentScheduleId(),
            currentSchedule.metadata(), currentSchedule.active()
        );
        
        ScheduleDTO updated = update(id, updatedSchedule);
        
        // Create audit trail
        createScheduleHistory(id, ScheduleHistoryAction.STATUS_CHANGED, userId.toString(),
                            serializeScheduleData(currentSchedule), serializeScheduleData(updated), 
                            reason, ipAddress, userAgent, updated.scheduleVersion());
        
        log.info("Schedule status updated to {} for ID: {} by user: {}", status, id, userId);
        return updated;
    }

    @Override
    public List<ScheduleDTO> bulkUpdateSchedules(List<Long> scheduleIds, ScheduleDTO updateData, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId, String reason, String ipAddress, String userAgent) {
        return scheduleIds.stream()
                .map(id -> {
                    try {
                        return updateScheduleWithValidation(id, updateData, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent);
                    } catch (Exception e) {
                        log.error("Failed to update schedule ID: {} - {}", id, e.getMessage());
                        return null;
                    }
                })
                .filter(schedule -> schedule != null)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getActiveSchedulesForDateRange(LocalDateTime startDate, LocalDateTime endDate, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        List<Schedule> schedules = getScheduleRepository().findActiveSchedulesForDate(startDate);
        return schedules.stream()
                .filter(schedule -> scheduleAccessService.canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, schedule.getId()))
                .filter(schedule -> schedule.getEffectiveDate().isBefore(endDate) && 
                                  (schedule.getExpiryDate() == null || schedule.getExpiryDate().isAfter(startDate)))
                .map(scheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    // Helper methods
    private void validateUserCanViewSchoolSchedules(Long schoolId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
            case MINISTRY_STAFF:
            case DIRECTOR:
                return; // Can view all
            case REGIONAL_ADMIN:
            case REGIONAL_OFFICER:
                // Validate school is in user's region
                break;
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
            case DEPARTMENT_HEAD:
            case SENIOR_TEACHER:
            case TEACHER:
                if (!schoolId.equals(userSchoolId)) {
                    throw new IllegalArgumentException("Access denied: Can only view schedules for your school");
                }
                break;
            default:
                throw new IllegalArgumentException("Access denied: Insufficient permissions");
        }
    }

    private void validateUserCanViewStudentSchedules(Long studentId, UserRole userRole, Long userId, Long userRegionId, Long userSchoolId) {
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
            case TEACHER:
                return; // Can view based on their scope
            case STUDENT:
                if (!studentId.equals(userId)) {
                    throw new IllegalArgumentException("Access denied: Can only view own schedules");
                }
                break;
            case PARENT:
                // Validate student is user's child
                break;
            default:
                throw new IllegalArgumentException("Access denied: Insufficient permissions");
        }
    }

    private ScheduleDTO createPartialUpdateForTeacher(ScheduleDTO current, ScheduleDTO update) {
        // Teachers can only update limited fields
        return new ScheduleDTO(
            current.id(), current.title(), update.description(), // Can update description
            current.startTime(), current.endTime(), current.dayOfWeek(),
            current.effectiveDate(), current.expiryDate(), update.location(), // Can update location
            current.type(), current.status(), update.color(), // Can update color
            current.isRecurring(), current.recurrenceRule(),
            current.courseId(), current.courseName(), current.classId(), current.className(),
            current.schoolId(), current.schoolName(), current.regionId(), current.regionName(),
            current.createdById(), current.createdByName(), current.teacherId(), current.teacherName(),
            current.scheduleVersion(), current.parentScheduleId(), update.metadata(), // Can update metadata
            current.active()
        );
    }

    private void createScheduleHistory(Long scheduleId, ScheduleHistoryAction action, String changedBy, 
                                     String oldValues, String newValues, String reason, String ipAddress, 
                                     String userAgent, Integer version) {
        ScheduleHistoryDTO historyDTO = new ScheduleHistoryDTO(
            null, scheduleId, action, changedBy, LocalDateTime.now(),
            oldValues, newValues, reason, ipAddress, userAgent, version
        );
        
        ScheduleHistory history = scheduleHistoryMapper.toEntity(historyDTO);
        scheduleHistoryRepository.save(history);
    }

    private String serializeScheduleData(ScheduleDTO schedule) {
        try {
            return objectMapper.writeValueAsString(schedule);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize schedule data", e);
            return "Serialization failed: " + e.getMessage();
        }
    }

    @Override
    protected Long extractSchoolId(Schedule entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Schedule entity) {
        return entity.getSchool() != null && entity.getSchool().getRegion() != null 
            ? entity.getSchool().getRegion().getId() : null;
    }
} 