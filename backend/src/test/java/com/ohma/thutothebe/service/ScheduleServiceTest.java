package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.ScheduleHistoryMapper;
import com.ohma.thutothebe.mapper.ScheduleMapper;
import com.ohma.thutothebe.repository.ScheduleHistoryRepository;
import com.ohma.thutothebe.repository.ScheduleRepository;
import com.ohma.thutothebe.service.impl.ScheduleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private ScheduleHistoryRepository scheduleHistoryRepository;

    @Mock
    private ScheduleMapper scheduleMapper;

    @Mock
    private ScheduleHistoryMapper scheduleHistoryMapper;

    @Mock
    private ScheduleAccessService scheduleAccessService;

    @InjectMocks
    private ScheduleServiceImpl scheduleService;

    private ScheduleDTO testScheduleDTO;
    private Schedule testSchedule;
    private ScheduleHistory testScheduleHistory;
    private ScheduleHistoryDTO testScheduleHistoryDTO;

    @BeforeEach
    void setUp() {
        // Setup test data
        testScheduleDTO = new ScheduleDTO(
            1L, "Mathematics", "Advanced Mathematics Class",
            LocalTime.of(9, 0), LocalTime.of(10, 0), DayOfWeek.MONDAY,
            LocalDateTime.now(), null, "Room 101", ScheduleType.CLASS,
            ScheduleStatus.ACTIVE, "#FF5733", true, null,
            1L, "Mathematics", 1L, "Grade 10A", 1L, "Test School",
            1L, "Test Region", 1L, "John Doe", 2L, "Jane Smith",
            1, null, null, true
        );

        testSchedule = new Schedule();
        testSchedule.setId(1L);
        testSchedule.setTitle("Mathematics");
        testSchedule.setDescription("Advanced Mathematics Class");
        testSchedule.setStartTime(LocalTime.of(9, 0));
        testSchedule.setEndTime(LocalTime.of(10, 0));
        testSchedule.setDayOfWeek(DayOfWeek.MONDAY);
        testSchedule.setEffectiveDate(LocalDateTime.now());
        testSchedule.setType(ScheduleType.CLASS);
        testSchedule.setStatus(ScheduleStatus.ACTIVE);
        testSchedule.setActive(true);

        testScheduleHistoryDTO = new ScheduleHistoryDTO(
            1L, 1L, ScheduleHistoryAction.CREATED, "1",
            LocalDateTime.now(), null, "{}", "Schedule created",
            "127.0.0.1", "Test Agent", 1
        );

        testScheduleHistory = new ScheduleHistory();
        testScheduleHistory.setId(1L);
        testScheduleHistory.setAction(ScheduleHistoryAction.CREATED);
        testScheduleHistory.setChangedBy("1");
        testScheduleHistory.setChangeTimestamp(LocalDateTime.now());
    }

    @Test
    void testGetSchedulesForUser() {
        // Given
        UserRole userRole = UserRole.TEACHER;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        
        Page<Schedule> schedulePage = new PageImpl<>(Arrays.asList(testSchedule));
        when(scheduleRepository.findSchedulesForUser(userRole, userId, Arrays.asList(userSchoolId), pageable))
            .thenReturn(schedulePage);
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);

        // When
        Page<ScheduleDTO> result = scheduleService.getSchedulesForUser(userRole, userId, userRegionId, userSchoolId, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testScheduleDTO, result.getContent().get(0));
        verify(scheduleRepository).findSchedulesForUser(userRole, userId, Arrays.asList(userSchoolId), pageable);
    }

    @Test
    void testGetSchedulesBySchool() {
        // Given
        Long schoolId = 1L;
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;

        when(scheduleRepository.findBySchoolIdAndActive(schoolId)).thenReturn(Arrays.asList(testSchedule));
        when(scheduleAccessService.canUserViewSchedule(userRole, userId, userRegionId, userSchoolId, testSchedule.getId()))
            .thenReturn(true);
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);

        // When
        List<ScheduleDTO> result = scheduleService.getSchedulesBySchool(schoolId, userRole, userId, userRegionId, userSchoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testScheduleDTO, result.get(0));
        verify(scheduleRepository).findBySchoolIdAndActive(schoolId);
    }

    @Test
    void testCreateScheduleWithValidation_Success() {
        // Given
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        when(scheduleAccessService.canUserCreateSchedule(userRole, userId, userRegionId, userSchoolId))
            .thenReturn(true);
        when(scheduleAccessService.validateScheduleDataForUser(userRole, userId, userRegionId, userSchoolId, testScheduleDTO))
            .thenReturn(true);
        when(scheduleRepository.findConflictingSchedulesForClass(any(), any(), any(), any(), any(), any()))
            .thenReturn(Arrays.asList());
        when(scheduleMapper.toEntity(testScheduleDTO)).thenReturn(testSchedule);
        when(scheduleRepository.save(testSchedule)).thenReturn(testSchedule);
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);
        when(scheduleHistoryMapper.toEntity(any(ScheduleHistoryDTO.class))).thenReturn(testScheduleHistory);
        when(scheduleHistoryRepository.save(any(ScheduleHistory.class))).thenReturn(testScheduleHistory);

        // When
        ScheduleDTO result = scheduleService.createScheduleWithValidation(
            testScheduleDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent);

        // Then
        assertNotNull(result);
        assertEquals(testScheduleDTO, result);
        verify(scheduleAccessService).canUserCreateSchedule(userRole, userId, userRegionId, userSchoolId);
        verify(scheduleAccessService).validateScheduleDataForUser(userRole, userId, userRegionId, userSchoolId, testScheduleDTO);
        verify(scheduleRepository).save(testSchedule);
        verify(scheduleHistoryRepository).save(any(ScheduleHistory.class));
    }

    @Test
    void testCreateScheduleWithValidation_InsufficientPermissions() {
        // Given
        UserRole userRole = UserRole.STUDENT;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        when(scheduleAccessService.canUserCreateSchedule(userRole, userId, userRegionId, userSchoolId))
            .thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            scheduleService.createScheduleWithValidation(
                testScheduleDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent));

        assertEquals("Access denied: Insufficient permissions to create schedules", exception.getMessage());
        verify(scheduleAccessService).canUserCreateSchedule(userRole, userId, userRegionId, userSchoolId);
        verify(scheduleRepository, never()).save(any());
    }

    @Test
    void testCreateScheduleWithValidation_TimeConflict() {
        // Given
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        when(scheduleAccessService.canUserCreateSchedule(userRole, userId, userRegionId, userSchoolId))
            .thenReturn(true);
        when(scheduleAccessService.validateScheduleDataForUser(userRole, userId, userRegionId, userSchoolId, testScheduleDTO))
            .thenReturn(true);
        when(scheduleRepository.findConflictingSchedulesForClass(any(), any(), any(), any(), any(), any()))
            .thenReturn(Arrays.asList(testSchedule)); // Conflict found
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            scheduleService.createScheduleWithValidation(
                testScheduleDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent));

        assertEquals("Schedule conflicts detected with existing schedules", exception.getMessage());
        verify(scheduleRepository, never()).save(any());
    }

    @Test
    void testUpdateScheduleWithValidation_Success() {
        // Given
        Long scheduleId = 1L;
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        when(scheduleAccessService.canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId))
            .thenReturn(true);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(testSchedule));
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);
        when(scheduleRepository.findConflictingSchedulesForClass(any(), any(), any(), any(), any(), any()))
            .thenReturn(Arrays.asList());
        doNothing().when(scheduleMapper).updateEntityFromDto(any(ScheduleDTO.class), eq(testSchedule));
        when(scheduleRepository.save(testSchedule)).thenReturn(testSchedule);
        when(scheduleHistoryMapper.toEntity(any(ScheduleHistoryDTO.class))).thenReturn(testScheduleHistory);
        when(scheduleHistoryRepository.save(any(ScheduleHistory.class))).thenReturn(testScheduleHistory);

        // When
        ScheduleDTO result = scheduleService.updateScheduleWithValidation(
            scheduleId, testScheduleDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent);

        // Then
        assertNotNull(result);
        verify(scheduleAccessService).canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId);
        verify(scheduleRepository).save(testSchedule);
        verify(scheduleHistoryRepository).save(any(ScheduleHistory.class));
    }

    @Test
    void testUpdateScheduleWithValidation_TeacherPartialUpdate() {
        // Given
        Long scheduleId = 1L;
        UserRole userRole = UserRole.TEACHER;
        Long userId = 2L; // Teacher ID
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        ScheduleDTO updateDTO = new ScheduleDTO(
            1L, "Mathematics", "Updated description", // Only description should be updated
            LocalTime.of(9, 0), LocalTime.of(10, 0), DayOfWeek.MONDAY,
            LocalDateTime.now(), null, "Updated location", ScheduleType.CLASS,
            ScheduleStatus.ACTIVE, "#FF5733", true, null,
            1L, "Mathematics", 1L, "Grade 10A", 1L, "Test School",
            1L, "Test Region", 1L, "John Doe", 2L, "Jane Smith",
            1, null, "Updated metadata", true
        );

        when(scheduleAccessService.canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId))
            .thenReturn(true);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(testSchedule));
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);
        when(scheduleRepository.findConflictingSchedulesForClass(any(), any(), any(), any(), any(), any()))
            .thenReturn(Arrays.asList());
        doNothing().when(scheduleMapper).updateEntityFromDto(any(ScheduleDTO.class), eq(testSchedule));
        when(scheduleRepository.save(testSchedule)).thenReturn(testSchedule);
        when(scheduleHistoryMapper.toEntity(any(ScheduleHistoryDTO.class))).thenReturn(testScheduleHistory);
        when(scheduleHistoryRepository.save(any(ScheduleHistory.class))).thenReturn(testScheduleHistory);

        // When
        ScheduleDTO result = scheduleService.updateScheduleWithValidation(
            scheduleId, updateDTO, userRole, userId, userRegionId, userSchoolId, ipAddress, userAgent);

        // Then
        assertNotNull(result);
        verify(scheduleAccessService).canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId);
        verify(scheduleRepository).save(testSchedule);
        verify(scheduleHistoryRepository).save(any(ScheduleHistory.class));
    }

    @Test
    void testDeleteScheduleWithValidation_Success() {
        // Given
        Long scheduleId = 1L;
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String reason = "No longer needed";
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        when(scheduleAccessService.canUserDeleteSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId))
            .thenReturn(true);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(testSchedule));
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);
        when(scheduleRepository.existsById(scheduleId)).thenReturn(true);
        when(scheduleHistoryMapper.toEntity(any(ScheduleHistoryDTO.class))).thenReturn(testScheduleHistory);
        when(scheduleHistoryRepository.save(any(ScheduleHistory.class))).thenReturn(testScheduleHistory);

        // When
        scheduleService.deleteScheduleWithValidation(
            scheduleId, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);

        // Then
        verify(scheduleAccessService).canUserDeleteSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId);
        verify(scheduleRepository).deleteById(scheduleId);
        verify(scheduleHistoryRepository).save(any(ScheduleHistory.class));
    }

    @Test
    void testCheckTimeConflicts() {
        // Given
        Long classId = 1L;
        Long teacherId = 2L;
        DayOfWeek dayOfWeek = DayOfWeek.MONDAY;
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(10, 0);
        LocalDateTime currentDate = LocalDateTime.now();
        Long excludeId = null;

        when(scheduleRepository.findConflictingSchedulesForClass(
            classId, dayOfWeek, startTime, endTime, currentDate, excludeId))
            .thenReturn(Arrays.asList(testSchedule));
        when(scheduleRepository.findConflictingSchedulesForTeacher(
            teacherId, dayOfWeek, startTime, endTime, currentDate, excludeId))
            .thenReturn(Arrays.asList());
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);

        // When
        List<ScheduleDTO> conflicts = scheduleService.checkTimeConflicts(
            classId, teacherId, dayOfWeek, startTime, endTime, currentDate, excludeId);

        // Then
        assertNotNull(conflicts);
        assertEquals(1, conflicts.size());
        assertEquals(testScheduleDTO, conflicts.get(0));
        verify(scheduleRepository).findConflictingSchedulesForClass(
            classId, dayOfWeek, startTime, endTime, currentDate, excludeId);
        verify(scheduleRepository).findConflictingSchedulesForTeacher(
            teacherId, dayOfWeek, startTime, endTime, currentDate, excludeId);
    }

    @Test
    void testGetScheduleHistory() {
        // Given
        Long scheduleId = 1L;
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;

        when(scheduleAccessService.canUserViewScheduleHistory(userRole, userId, userRegionId, userSchoolId, scheduleId))
            .thenReturn(true);
        when(scheduleHistoryRepository.findByScheduleIdOrderByChangeTimestampDesc(scheduleId))
            .thenReturn(Arrays.asList(testScheduleHistory));
        when(scheduleHistoryMapper.toDto(testScheduleHistory)).thenReturn(testScheduleHistoryDTO);

        // When
        List<ScheduleHistoryDTO> history = scheduleService.getScheduleHistory(
            scheduleId, userRole, userId, userRegionId, userSchoolId);

        // Then
        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals(testScheduleHistoryDTO, history.get(0));
        verify(scheduleAccessService).canUserViewScheduleHistory(userRole, userId, userRegionId, userSchoolId, scheduleId);
        verify(scheduleHistoryRepository).findByScheduleIdOrderByChangeTimestampDesc(scheduleId);
    }

    @Test
    void testGetScheduleHistory_AccessDenied() {
        // Given
        Long scheduleId = 1L;
        UserRole userRole = UserRole.STUDENT;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;

        when(scheduleAccessService.canUserViewScheduleHistory(userRole, userId, userRegionId, userSchoolId, scheduleId))
            .thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            scheduleService.getScheduleHistory(scheduleId, userRole, userId, userRegionId, userSchoolId));

        assertEquals("Access denied: Insufficient permissions to view schedule history", exception.getMessage());
        verify(scheduleAccessService).canUserViewScheduleHistory(userRole, userId, userRegionId, userSchoolId, scheduleId);
        verify(scheduleHistoryRepository, never()).findByScheduleIdOrderByChangeTimestampDesc(any());
    }

    @Test
    void testUpdateScheduleStatus() {
        // Given
        Long scheduleId = 1L;
        ScheduleStatus newStatus = ScheduleStatus.SUSPENDED;
        UserRole userRole = UserRole.SCHOOL_ADMIN;
        Long userId = 1L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;
        String reason = "Maintenance required";
        String ipAddress = "127.0.0.1";
        String userAgent = "Test Agent";

        when(scheduleAccessService.canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId))
            .thenReturn(true);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(testSchedule));
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);
        doNothing().when(scheduleMapper).updateEntityFromDto(any(ScheduleDTO.class), eq(testSchedule));
        when(scheduleRepository.save(testSchedule)).thenReturn(testSchedule);
        when(scheduleHistoryMapper.toEntity(any(ScheduleHistoryDTO.class))).thenReturn(testScheduleHistory);
        when(scheduleHistoryRepository.save(any(ScheduleHistory.class))).thenReturn(testScheduleHistory);

        // When
        ScheduleDTO result = scheduleService.updateScheduleStatus(
            scheduleId, newStatus, userRole, userId, userRegionId, userSchoolId, reason, ipAddress, userAgent);

        // Then
        assertNotNull(result);
        verify(scheduleAccessService).canUserUpdateSchedule(userRole, userId, userRegionId, userSchoolId, scheduleId);
        verify(scheduleRepository).save(testSchedule);
        verify(scheduleHistoryRepository).save(any(ScheduleHistory.class));
    }

    @Test
    void testGetSchedulesForStudent() {
        // Given
        Long studentId = 1L;
        UserRole userRole = UserRole.TEACHER;
        Long userId = 2L;
        Long userRegionId = 1L;
        Long userSchoolId = 1L;

        when(scheduleRepository.findSchedulesForStudent(studentId))
            .thenReturn(Arrays.asList(testSchedule));
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);

        // When
        List<ScheduleDTO> result = scheduleService.getSchedulesForStudent(
            studentId, userRole, userId, userRegionId, userSchoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testScheduleDTO, result.get(0));
        verify(scheduleRepository).findSchedulesForStudent(studentId);
    }

    @Test
    void testGetSchedulesForParent() {
        // Given
        Long parentId = 1L;
        UserRole userRole = UserRole.PARENT;
        Long userId = 1L; // Same as parentId
        Long userRegionId = 1L;
        Long userSchoolId = 1L;

        when(scheduleRepository.findSchedulesForParent(parentId))
            .thenReturn(Arrays.asList(testSchedule));
        when(scheduleMapper.toDto(testSchedule)).thenReturn(testScheduleDTO);

        // When
        List<ScheduleDTO> result = scheduleService.getSchedulesForParent(
            parentId, userRole, userId, userRegionId, userSchoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testScheduleDTO, result.get(0));
        verify(scheduleRepository).findSchedulesForParent(parentId);
    }

    @Test
    void testGetSchedulesForParent_AccessDenied() {
        // Given
        Long parentId = 1L;
        UserRole userRole = UserRole.PARENT;
        Long userId = 2L; // Different from parentId
        Long userRegionId = 1L;
        Long userSchoolId = 1L;

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            scheduleService.getSchedulesForParent(parentId, userRole, userId, userRegionId, userSchoolId));

        assertEquals("Access denied: Can only view own children's schedules", exception.getMessage());
        verify(scheduleRepository, never()).findSchedulesForParent(any());
    }
} 