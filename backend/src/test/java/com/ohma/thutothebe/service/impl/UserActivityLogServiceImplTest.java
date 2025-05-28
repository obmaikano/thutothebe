package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.UserActivityLogDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserActivityLog;
import com.ohma.thutothebe.entity.UserActivityType;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.mapper.UserActivityLogMapper;
import com.ohma.thutothebe.repository.UserActivityLogRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserActivityLogServiceImplTest {

    @Mock
    private UserActivityLogRepository userActivityLogRepository;

    @Mock
    private UserActivityLogMapper userActivityLogMapper;

    @Mock
    private UserRepository userRepository;

    private UserActivityLogServiceImpl userActivityLogService;

    private UserActivityLog userActivityLog;
    private UserActivityLogDTO userActivityLogDTO;
    private User user;
    private School school;
    private Region region;
    private LocalDateTime testDateTime;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Create service instance and inject mocked dependencies
        userActivityLogService = new UserActivityLogServiceImpl(userActivityLogRepository);
        ReflectionTestUtils.setField(userActivityLogService, "userActivityLogRepository", userActivityLogRepository);
        ReflectionTestUtils.setField(userActivityLogService, "userActivityLogMapper", userActivityLogMapper);
        ReflectionTestUtils.setField(userActivityLogService, "userRepository", userRepository);

        testDateTime = LocalDateTime.now();
        pageable = PageRequest.of(0, 10);

        region = new Region();
        region.setId(1L);
        region.setName("Test Region");

        school = new School();
        school.setId(1L);
        school.setName("Test School");
        school.setRegion(region);

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(UserRole.TEACHER);
        user.setSchool(school);
        user.setRegion(region);

        userActivityLog = new UserActivityLog();
        userActivityLog.setId(1L);
        userActivityLog.setUser(user);
        userActivityLog.setActivityTimestamp(testDateTime);
        userActivityLog.setActivityType(UserActivityType.LOGIN);
        userActivityLog.setModuleName("Dashboard");
        userActivityLog.setFeatureName("Main Dashboard");
        userActivityLog.setActionPerformed("User logged in");
        userActivityLog.setSessionId("session123");
        userActivityLog.setIpAddress("192.168.1.1");
        userActivityLog.setUserAgent("Mozilla/5.0");
        userActivityLog.setDurationMinutes(30);
        userActivityLog.setSuccess(true);
        userActivityLog.setErrorMessage(null);
        userActivityLog.setAdditionalData(null);

        userActivityLogDTO = new UserActivityLogDTO(
            1L, 1L, "testuser", "TEACHER", 1L, "Test School", 1L, "Test Region",
            testDateTime, UserActivityType.LOGIN, "Dashboard", "Main Dashboard", "User logged in",
            "session123", "192.168.1.1", "Mozilla/5.0", 30, true, null, null
        );
    }

    @Test
    @DisplayName("Test findByUserId")
    void findByUserId_ShouldReturnPagedActivities() {
        Page<UserActivityLog> activityPage = new PageImpl<>(Arrays.asList(userActivityLog));
        when(userActivityLogRepository.findByUserId(1L, pageable)).thenReturn(activityPage);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        Page<UserActivityLogDTO> result = userActivityLogService.findByUserId(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1L, result.getContent().get(0).userId());
        verify(userActivityLogRepository).findByUserId(1L, pageable);
    }

    @Test
    @DisplayName("Test findBySchoolId")
    void findBySchoolId_ShouldReturnPagedActivities() {
        Page<UserActivityLog> activityPage = new PageImpl<>(Arrays.asList(userActivityLog));
        when(userActivityLogRepository.findBySchoolId(1L, pageable)).thenReturn(activityPage);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        Page<UserActivityLogDTO> result = userActivityLogService.findBySchoolId(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1L, result.getContent().get(0).schoolId());
        verify(userActivityLogRepository).findBySchoolId(1L, pageable);
    }

    @Test
    @DisplayName("Test findByRegionId")
    void findByRegionId_ShouldReturnPagedActivities() {
        Page<UserActivityLog> activityPage = new PageImpl<>(Arrays.asList(userActivityLog));
        when(userActivityLogRepository.findByRegionId(1L, pageable)).thenReturn(activityPage);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        Page<UserActivityLogDTO> result = userActivityLogService.findByRegionId(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1L, result.getContent().get(0).regionId());
        verify(userActivityLogRepository).findByRegionId(1L, pageable);
    }

    @Test
    @DisplayName("Test findByActivityType")
    void findByActivityType_ShouldReturnPagedActivities() {
        Page<UserActivityLog> activityPage = new PageImpl<>(Arrays.asList(userActivityLog));
        when(userActivityLogRepository.findByActivityType(UserActivityType.LOGIN, pageable)).thenReturn(activityPage);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        Page<UserActivityLogDTO> result = userActivityLogService.findByActivityType(UserActivityType.LOGIN, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(UserActivityType.LOGIN, result.getContent().get(0).activityType());
        verify(userActivityLogRepository).findByActivityType(UserActivityType.LOGIN, pageable);
    }

    @Test
    @DisplayName("Test findByDateRange")
    void findByDateRange_ShouldReturnActivities() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        List<UserActivityLog> activities = Arrays.asList(userActivityLog);
        
        when(userActivityLogRepository.findByDateRange(startDate, endDate))
            .thenReturn(activities);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        List<UserActivityLogDTO> result = userActivityLogService.findByDateRange(startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userActivityLogRepository).findByDateRange(startDate, endDate);
    }

    @Test
    @DisplayName("Test findByUserIdAndDateRange")
    void findByUserIdAndDateRange_ShouldReturnActivities() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        List<UserActivityLog> activities = Arrays.asList(userActivityLog);
        
        when(userActivityLogRepository.findByUserIdAndDateRange(1L, startDate, endDate))
            .thenReturn(activities);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        List<UserActivityLogDTO> result = userActivityLogService.findByUserIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userActivityLogRepository).findByUserIdAndDateRange(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test findBySchoolIdAndDateRange")
    void findBySchoolIdAndDateRange_ShouldReturnActivities() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        List<UserActivityLog> activities = Arrays.asList(userActivityLog);
        
        when(userActivityLogRepository.findBySchoolIdAndDateRange(1L, startDate, endDate))
            .thenReturn(activities);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        List<UserActivityLogDTO> result = userActivityLogService.findBySchoolIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userActivityLogRepository).findBySchoolIdAndDateRange(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test findByRegionIdAndDateRange")
    void findByRegionIdAndDateRange_ShouldReturnActivities() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        List<UserActivityLog> activities = Arrays.asList(userActivityLog);
        
        when(userActivityLogRepository.findByRegionIdAndDateRange(1L, startDate, endDate))
            .thenReturn(activities);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        List<UserActivityLogDTO> result = userActivityLogService.findByRegionIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userActivityLogRepository).findByRegionIdAndDateRange(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test countActiveUsersBySchool")
    void countActiveUsersBySchool_ShouldReturnCount() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(userActivityLogRepository.countActiveUsersBySchool(1L, startDate, endDate)).thenReturn(25L);

        Long result = userActivityLogService.countActiveUsersBySchool(1L, startDate, endDate);

        assertEquals(25L, result);
        verify(userActivityLogRepository).countActiveUsersBySchool(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test countActiveUsersByRegion")
    void countActiveUsersByRegion_ShouldReturnCount() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(userActivityLogRepository.countActiveUsersByRegion(1L, startDate, endDate)).thenReturn(150L);

        Long result = userActivityLogService.countActiveUsersByRegion(1L, startDate, endDate);

        assertEquals(150L, result);
        verify(userActivityLogRepository).countActiveUsersByRegion(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test countActivityBySchoolAndType")
    void countActivityBySchoolAndType_ShouldReturnCount() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(userActivityLogRepository.countActivityBySchoolAndType(1L, UserActivityType.LOGIN, startDate, endDate))
            .thenReturn(50L);

        Long result = userActivityLogService.countActivityBySchoolAndType(1L, UserActivityType.LOGIN, startDate, endDate);

        assertEquals(50L, result);
        verify(userActivityLogRepository).countActivityBySchoolAndType(1L, UserActivityType.LOGIN, startDate, endDate);
    }

    @Test
    @DisplayName("Test countActivityByRegionAndType")
    void countActivityByRegionAndType_ShouldReturnCount() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(userActivityLogRepository.countActivityByRegionAndType(1L, UserActivityType.LOGIN, startDate, endDate))
            .thenReturn(300L);

        Long result = userActivityLogService.countActivityByRegionAndType(1L, UserActivityType.LOGIN, startDate, endDate);

        assertEquals(300L, result);
        verify(userActivityLogRepository).countActivityByRegionAndType(1L, UserActivityType.LOGIN, startDate, endDate);
    }

    @Test
    @DisplayName("Test getActivityStatisticsBySchool")
    void getActivityStatisticsBySchool_ShouldReturnStatistics() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{UserActivityType.LOGIN, 50L},
            new Object[]{UserActivityType.PAGE_VIEW, 200L}
        );
        
        when(userActivityLogRepository.getActivityStatisticsBySchool(1L, startDate, endDate))
            .thenReturn(mockResults);

        Map<UserActivityType, Long> result = userActivityLogService.getActivityStatisticsBySchool(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(50L, result.get(UserActivityType.LOGIN));
        assertEquals(200L, result.get(UserActivityType.PAGE_VIEW));
        verify(userActivityLogRepository).getActivityStatisticsBySchool(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test getActivityStatisticsByRegion")
    void getActivityStatisticsByRegion_ShouldReturnStatistics() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{UserActivityType.LOGIN, 250L},
            new Object[]{UserActivityType.PAGE_VIEW, 1000L}
        );
        
        when(userActivityLogRepository.getActivityStatisticsByRegion(1L, startDate, endDate))
            .thenReturn(mockResults);

        Map<UserActivityType, Long> result = userActivityLogService.getActivityStatisticsByRegion(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(250L, result.get(UserActivityType.LOGIN));
        assertEquals(1000L, result.get(UserActivityType.PAGE_VIEW));
        verify(userActivityLogRepository).getActivityStatisticsByRegion(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test getPeakUsageHoursBySchool")
    void getPeakUsageHoursBySchool_ShouldReturnPeakHours() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{10, 25L},
            new Object[]{14, 30L}
        );
        
        when(userActivityLogRepository.getPeakUsageHoursBySchool(1L, startDate, endDate))
            .thenReturn(mockResults);

        Map<Integer, Long> result = userActivityLogService.getPeakUsageHoursBySchool(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(25L, result.get(10));
        assertEquals(30L, result.get(14));
        verify(userActivityLogRepository).getPeakUsageHoursBySchool(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test getModuleUsageStatisticsBySchool")
    void getModuleUsageStatisticsBySchool_ShouldReturnStatistics() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{"Dashboard", 50L},
            new Object[]{"Assignments", 30L}
        );
        
        when(userActivityLogRepository.getModuleUsageStatisticsBySchool(1L, startDate, endDate))
            .thenReturn(mockResults);

        Map<String, Long> result = userActivityLogService.getModuleUsageStatisticsBySchool(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(50L, result.get("Dashboard"));
        assertEquals(30L, result.get("Assignments"));
        verify(userActivityLogRepository).getModuleUsageStatisticsBySchool(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test getAverageSessionDurationBySchool")
    void getAverageSessionDurationBySchool_ShouldReturnAverage() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(userActivityLogRepository.getAverageSessionDurationBySchool(1L, startDate, endDate)).thenReturn(45.5);

        Double result = userActivityLogService.getAverageSessionDurationBySchool(1L, startDate, endDate);

        assertEquals(45.5, result);
        verify(userActivityLogRepository).getAverageSessionDurationBySchool(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test countFailedActivitiesBySchool")
    void countFailedActivitiesBySchool_ShouldReturnCount() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(userActivityLogRepository.countFailedActivitiesBySchool(1L, startDate, endDate)).thenReturn(5L);

        Long result = userActivityLogService.countFailedActivitiesBySchool(1L, startDate, endDate);

        assertEquals(5L, result);
        verify(userActivityLogRepository).countFailedActivitiesBySchool(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test logActivity")
    void logActivity_ShouldCreateNewActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userActivityLogRepository.save(any(UserActivityLog.class))).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        UserActivityLogDTO result = userActivityLogService.logActivity(
            1L, UserActivityType.LOGIN, "Dashboard", "Main Dashboard", "User logged in",
            "session123", "192.168.1.1", "Mozilla/5.0", 30, true, null, null
        );

        assertNotNull(result);
        verify(userRepository).findById(1L);
        verify(userActivityLogRepository).save(any(UserActivityLog.class));
    }

    @Test
    @DisplayName("Test logActivity when user not found")
    void logActivity_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            userActivityLogService.logActivity(
                1L, UserActivityType.LOGIN, "Dashboard", "Main Dashboard", "User logged in",
                "session123", "192.168.1.1", "Mozilla/5.0", 30, true, null, null
            ));

        verify(userRepository).findById(1L);
        verify(userActivityLogRepository, never()).save(any(UserActivityLog.class));
    }

    @Test
    @DisplayName("Test logUserLogin")
    void logUserLogin_ShouldLogLoginActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userActivityLogRepository.save(any(UserActivityLog.class))).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        userActivityLogService.logUserLogin(1L, "session123", "192.168.1.1", "Mozilla/5.0");

        verify(userRepository).findById(1L);
        verify(userActivityLogRepository).save(any(UserActivityLog.class));
    }

    @Test
    @DisplayName("Test logUserLogout")
    void logUserLogout_ShouldLogLogoutActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userActivityLogRepository.save(any(UserActivityLog.class))).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        userActivityLogService.logUserLogout(1L, "session123", 30);

        verify(userRepository).findById(1L);
        verify(userActivityLogRepository).save(any(UserActivityLog.class));
    }

    @Test
    @DisplayName("Test logPageView")
    void logPageView_ShouldLogPageViewActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userActivityLogRepository.save(any(UserActivityLog.class))).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        userActivityLogService.logPageView(1L, "Dashboard", "Main Dashboard", "session123", "192.168.1.1");

        verify(userRepository).findById(1L);
        verify(userActivityLogRepository).save(any(UserActivityLog.class));
    }

    @Test
    @DisplayName("Test logError")
    void logError_ShouldLogErrorActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userActivityLogRepository.save(any(UserActivityLog.class))).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        userActivityLogService.logError(1L, "Assignments", "Grade Assignment", "Database connection failed", "session123", "192.168.1.1");

        verify(userRepository).findById(1L);
        verify(userActivityLogRepository).save(any(UserActivityLog.class));
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - create")
    void create_ShouldCreateNewActivity() {
        when(userActivityLogMapper.toEntity(userActivityLogDTO)).thenReturn(userActivityLog);
        when(userActivityLogRepository.save(userActivityLog)).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        UserActivityLogDTO result = userActivityLogService.create(userActivityLogDTO);

        assertNotNull(result);
        assertEquals(userActivityLogDTO.userId(), result.userId());
        verify(userActivityLogRepository).save(userActivityLog);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getById")
    void getById_ShouldReturnActivity_WhenExists() {
        when(userActivityLogRepository.findById(1L)).thenReturn(Optional.of(userActivityLog));
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        UserActivityLogDTO result = userActivityLogService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.id());
        verify(userActivityLogRepository).findById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - update")
    void update_ShouldUpdateActivity_WhenExists() {
        when(userActivityLogRepository.findById(1L)).thenReturn(Optional.of(userActivityLog));
        when(userActivityLogRepository.save(userActivityLog)).thenReturn(userActivityLog);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        UserActivityLogDTO result = userActivityLogService.update(1L, userActivityLogDTO);

        assertNotNull(result);
        verify(userActivityLogRepository).findById(1L);
        verify(userActivityLogMapper).updateEntity(userActivityLog, userActivityLogDTO);
        verify(userActivityLogRepository).save(userActivityLog);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - delete")
    void delete_ShouldDeleteActivity_WhenExists() {
        when(userActivityLogRepository.existsById(1L)).thenReturn(true);

        userActivityLogService.delete(1L);

        verify(userActivityLogRepository).existsById(1L);
        verify(userActivityLogRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll")
    void getAll_ShouldReturnAllActivities() {
        List<UserActivityLog> activities = Arrays.asList(userActivityLog);
        when(userActivityLogRepository.findAll()).thenReturn(activities);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        List<UserActivityLogDTO> result = userActivityLogService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userActivityLogRepository).findAll();
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll with pagination")
    void getAll_ShouldReturnPagedActivities() {
        Page<UserActivityLog> activityPage = new PageImpl<>(Arrays.asList(userActivityLog));
        when(userActivityLogRepository.findAll(pageable)).thenReturn(activityPage);
        when(userActivityLogMapper.toDto(userActivityLog)).thenReturn(userActivityLogDTO);

        Page<UserActivityLogDTO> result = userActivityLogService.getAll(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(userActivityLogRepository).findAll(pageable);
    }
} 