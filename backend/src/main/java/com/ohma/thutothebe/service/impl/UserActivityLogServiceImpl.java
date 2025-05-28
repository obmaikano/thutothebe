package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.UserActivityLogDTO;
import com.ohma.thutothebe.entity.UserActivityLog;
import com.ohma.thutothebe.entity.UserActivityType;
import com.ohma.thutothebe.mapper.UserActivityLogMapper;
import com.ohma.thutothebe.repository.UserActivityLogRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.UserActivityLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class UserActivityLogServiceImpl extends BaseServiceImpl<UserActivityLog, UserActivityLogDTO, Long> implements UserActivityLogService {

    @Autowired
    private UserActivityLogRepository userActivityLogRepository;

    @Autowired
    private UserActivityLogMapper userActivityLogMapper;

    @Autowired
    private UserRepository userRepository;

    public UserActivityLogServiceImpl(UserActivityLogRepository repository) {
        super(repository);
    }

    @Override
    protected UserActivityLog mapToEntity(UserActivityLogDTO dto) {
        return userActivityLogMapper.toEntity(dto);
    }

    @Override
    protected UserActivityLogDTO mapToDto(UserActivityLog entity) {
        return userActivityLogMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(UserActivityLog entity, UserActivityLogDTO dto) {
        userActivityLogMapper.updateEntity(entity, dto);
    }

    @Override
    public Page<UserActivityLogDTO> findByUserId(Long userId, Pageable pageable) {
        log.info("Finding activity logs for user ID: {}", userId);
        return userActivityLogRepository.findByUserId(userId, pageable)
                .map(userActivityLogMapper::toDto);
    }

    @Override
    public Page<UserActivityLogDTO> findBySchoolId(Long schoolId, Pageable pageable) {
        log.info("Finding activity logs for school ID: {}", schoolId);
        return userActivityLogRepository.findBySchoolId(schoolId, pageable)
                .map(userActivityLogMapper::toDto);
    }

    @Override
    public Page<UserActivityLogDTO> findByRegionId(Long regionId, Pageable pageable) {
        log.info("Finding activity logs for region ID: {}", regionId);
        return userActivityLogRepository.findByRegionId(regionId, pageable)
                .map(userActivityLogMapper::toDto);
    }

    @Override
    public Page<UserActivityLogDTO> findByActivityType(UserActivityType activityType, Pageable pageable) {
        log.info("Finding activity logs for activity type: {}", activityType);
        return userActivityLogRepository.findByActivityType(activityType, pageable)
                .map(userActivityLogMapper::toDto);
    }

    @Override
    public List<UserActivityLogDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding activity logs between {} and {}", startDate, endDate);
        return userActivityLogRepository.findByDateRange(startDate, endDate)
                .stream()
                .map(userActivityLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogDTO> findByUserIdAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding activity logs for user ID: {} between {} and {}", userId, startDate, endDate);
        return userActivityLogRepository.findByUserIdAndDateRange(userId, startDate, endDate)
                .stream()
                .map(userActivityLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogDTO> findBySchoolIdAndDateRange(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding activity logs for school ID: {} between {} and {}", schoolId, startDate, endDate);
        return userActivityLogRepository.findBySchoolIdAndDateRange(schoolId, startDate, endDate)
                .stream()
                .map(userActivityLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogDTO> findByRegionIdAndDateRange(Long regionId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding activity logs for region ID: {} between {} and {}", regionId, startDate, endDate);
        return userActivityLogRepository.findByRegionIdAndDateRange(regionId, startDate, endDate)
                .stream()
                .map(userActivityLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Long countActiveUsersBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Counting active users for school ID: {} between {} and {}", schoolId, startDate, endDate);
        return userActivityLogRepository.countActiveUsersBySchool(schoolId, startDate, endDate);
    }

    @Override
    public Long countActiveUsersByRegion(Long regionId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Counting active users for region ID: {} between {} and {}", regionId, startDate, endDate);
        return userActivityLogRepository.countActiveUsersByRegion(regionId, startDate, endDate);
    }

    @Override
    public Long countActivityBySchoolAndType(Long schoolId, UserActivityType activityType, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Counting activity for school ID: {} and type: {} between {} and {}", schoolId, activityType, startDate, endDate);
        return userActivityLogRepository.countActivityBySchoolAndType(schoolId, activityType, startDate, endDate);
    }

    @Override
    public Long countActivityByRegionAndType(Long regionId, UserActivityType activityType, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Counting activity for region ID: {} and type: {} between {} and {}", regionId, activityType, startDate, endDate);
        return userActivityLogRepository.countActivityByRegionAndType(regionId, activityType, startDate, endDate);
    }

    @Override
    public Map<UserActivityType, Long> getActivityStatisticsBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting activity statistics for school ID: {} between {} and {}", schoolId, startDate, endDate);
        
        List<Object[]> results = userActivityLogRepository.getActivityStatisticsBySchool(schoolId, startDate, endDate);
        Map<UserActivityType, Long> statistics = new HashMap<>();
        
        for (Object[] result : results) {
            UserActivityType activityType = (UserActivityType) result[0];
            Long count = (Long) result[1];
            statistics.put(activityType, count);
        }
        
        return statistics;
    }

    @Override
    public Map<UserActivityType, Long> getActivityStatisticsByRegion(Long regionId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting activity statistics for region ID: {} between {} and {}", regionId, startDate, endDate);
        
        List<Object[]> results = userActivityLogRepository.getActivityStatisticsByRegion(regionId, startDate, endDate);
        Map<UserActivityType, Long> statistics = new HashMap<>();
        
        for (Object[] result : results) {
            UserActivityType activityType = (UserActivityType) result[0];
            Long count = (Long) result[1];
            statistics.put(activityType, count);
        }
        
        return statistics;
    }

    @Override
    public Map<Integer, Long> getPeakUsageHoursBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting peak usage hours for school ID: {} between {} and {}", schoolId, startDate, endDate);
        
        List<Object[]> results = userActivityLogRepository.getPeakUsageHoursBySchool(schoolId, startDate, endDate);
        Map<Integer, Long> peakHours = new HashMap<>();
        
        for (Object[] result : results) {
            Integer hour = (Integer) result[0];
            Long count = (Long) result[1];
            peakHours.put(hour, count);
        }
        
        return peakHours;
    }

    @Override
    public Map<String, Long> getModuleUsageStatisticsBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting module usage statistics for school ID: {} between {} and {}", schoolId, startDate, endDate);
        
        List<Object[]> results = userActivityLogRepository.getModuleUsageStatisticsBySchool(schoolId, startDate, endDate);
        Map<String, Long> moduleStats = new HashMap<>();
        
        for (Object[] result : results) {
            String moduleName = (String) result[0];
            Long count = (Long) result[1];
            moduleStats.put(moduleName, count);
        }
        
        return moduleStats;
    }

    @Override
    public Double getAverageSessionDurationBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting average session duration for school ID: {} between {} and {}", schoolId, startDate, endDate);
        return userActivityLogRepository.getAverageSessionDurationBySchool(schoolId, startDate, endDate);
    }

    @Override
    public Long countFailedActivitiesBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Counting failed activities for school ID: {} between {} and {}", schoolId, startDate, endDate);
        return userActivityLogRepository.countFailedActivitiesBySchool(schoolId, startDate, endDate);
    }

    @Override
    public UserActivityLogDTO logActivity(Long userId, UserActivityType activityType, String moduleName,
                                         String featureName, String actionPerformed, String sessionId,
                                         String ipAddress, String userAgent, Integer durationMinutes,
                                         boolean success, String errorMessage, String additionalData) {
        log.info("Logging activity for user ID: {} - type: {}, module: {}", userId, activityType, moduleName);
        
        try {
            UserActivityLog activityLog = new UserActivityLog();
            activityLog.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId)));
            activityLog.setActivityTimestamp(LocalDateTime.now());
            activityLog.setActivityType(activityType);
            activityLog.setModuleName(moduleName);
            activityLog.setFeatureName(featureName);
            activityLog.setActionPerformed(actionPerformed);
            activityLog.setSessionId(sessionId);
            activityLog.setIpAddress(ipAddress);
            activityLog.setUserAgent(userAgent);
            activityLog.setDurationMinutes(durationMinutes);
            activityLog.setSuccess(success);
            activityLog.setErrorMessage(errorMessage);
            activityLog.setAdditionalData(additionalData);

            UserActivityLog saved = userActivityLogRepository.save(activityLog);
            return userActivityLogMapper.toDto(saved);

        } catch (Exception e) {
            log.error("Error logging activity for user ID: {} - type: {}", userId, activityType, e);
            throw new RuntimeException("Failed to log activity", e);
        }
    }

    @Override
    public void logUserLogin(Long userId, String sessionId, String ipAddress, String userAgent) {
        log.info("Logging user login for user ID: {}", userId);
        
        try {
            logActivity(
                userId,
                UserActivityType.LOGIN,
                "Authentication",
                "User Login",
                "User logged into the system",
                sessionId,
                ipAddress,
                userAgent,
                null,
                true,
                null,
                null
            );
        } catch (Exception e) {
            log.error("Error logging user login for user ID: {}", userId, e);
        }
    }

    @Override
    public void logUserLogout(Long userId, String sessionId, Integer sessionDurationMinutes) {
        log.info("Logging user logout for user ID: {}", userId);
        
        try {
            logActivity(
                userId,
                UserActivityType.LOGOUT,
                "Authentication",
                "User Logout",
                "User logged out of the system",
                sessionId,
                null,
                null,
                sessionDurationMinutes,
                true,
                null,
                String.format("{\"sessionDuration\": %d}", sessionDurationMinutes)
            );
        } catch (Exception e) {
            log.error("Error logging user logout for user ID: {}", userId, e);
        }
    }

    @Override
    public void logPageView(Long userId, String moduleName, String featureName, String sessionId, String ipAddress) {
        log.info("Logging page view for user ID: {} - module: {}, feature: {}", userId, moduleName, featureName);
        
        try {
            logActivity(
                userId,
                UserActivityType.PAGE_VIEW,
                moduleName,
                featureName,
                String.format("Viewed %s page", featureName),
                sessionId,
                ipAddress,
                null,
                null,
                true,
                null,
                null
            );
        } catch (Exception e) {
            log.error("Error logging page view for user ID: {}", userId, e);
        }
    }

    @Override
    public void logError(Long userId, String moduleName, String featureName, String errorMessage, String sessionId, String ipAddress) {
        log.info("Logging error for user ID: {} - module: {}, error: {}", userId, moduleName, errorMessage);
        
        try {
            logActivity(
                userId,
                UserActivityType.ERROR_OCCURRED,
                moduleName,
                featureName,
                "Error occurred during user action",
                sessionId,
                ipAddress,
                null,
                null,
                false,
                errorMessage,
                null
            );
        } catch (Exception e) {
            log.error("Error logging error for user ID: {}", userId, e);
        }
    }
} 