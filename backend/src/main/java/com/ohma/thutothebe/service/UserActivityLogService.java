package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.UserActivityLogDTO;
import com.ohma.thutothebe.entity.UserActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface UserActivityLogService extends BaseService<UserActivityLogDTO, Long> {
    
    Page<UserActivityLogDTO> findByUserId(Long userId, Pageable pageable);
    
    Page<UserActivityLogDTO> findBySchoolId(Long schoolId, Pageable pageable);
    
    Page<UserActivityLogDTO> findByRegionId(Long regionId, Pageable pageable);
    
    Page<UserActivityLogDTO> findByActivityType(UserActivityType activityType, Pageable pageable);
    
    List<UserActivityLogDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<UserActivityLogDTO> findByUserIdAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<UserActivityLogDTO> findBySchoolIdAndDateRange(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<UserActivityLogDTO> findByRegionIdAndDateRange(Long regionId, LocalDateTime startDate, LocalDateTime endDate);
    
    Long countActiveUsersBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    Long countActiveUsersByRegion(Long regionId, LocalDateTime startDate, LocalDateTime endDate);
    
    Long countActivityBySchoolAndType(Long schoolId, UserActivityType activityType, LocalDateTime startDate, LocalDateTime endDate);
    
    Long countActivityByRegionAndType(Long regionId, UserActivityType activityType, LocalDateTime startDate, LocalDateTime endDate);
    
    Map<UserActivityType, Long> getActivityStatisticsBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    Map<UserActivityType, Long> getActivityStatisticsByRegion(Long regionId, LocalDateTime startDate, LocalDateTime endDate);
    
    Map<Integer, Long> getPeakUsageHoursBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    Map<String, Long> getModuleUsageStatisticsBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    Double getAverageSessionDurationBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    Long countFailedActivitiesBySchool(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    UserActivityLogDTO logActivity(Long userId, UserActivityType activityType, String moduleName, 
                                  String featureName, String actionPerformed, String sessionId, 
                                  String ipAddress, String userAgent, Integer durationMinutes, 
                                  boolean success, String errorMessage, String additionalData);
    
    void logUserLogin(Long userId, String sessionId, String ipAddress, String userAgent);
    
    void logUserLogout(Long userId, String sessionId, Integer sessionDurationMinutes);
    
    void logPageView(Long userId, String moduleName, String featureName, String sessionId, String ipAddress);
    
    void logError(Long userId, String moduleName, String featureName, String errorMessage, String sessionId, String ipAddress);
} 