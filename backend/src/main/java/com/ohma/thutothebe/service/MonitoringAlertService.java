package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.MonitoringAlertDTO;
import com.ohma.thutothebe.entity.MonitoringAlertSeverity;
import com.ohma.thutothebe.entity.MonitoringAlertType;
import com.ohma.thutothebe.entity.MonitoringScope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface MonitoringAlertService extends BaseService<MonitoringAlertDTO, Long> {
    
    List<MonitoringAlertDTO> findBySchoolId(Long schoolId);
    
    List<MonitoringAlertDTO> findByRegionId(Long regionId);
    
    List<MonitoringAlertDTO> findByScope(MonitoringScope scope);
    
    List<MonitoringAlertDTO> findByAlertType(MonitoringAlertType alertType);
    
    List<MonitoringAlertDTO> findBySeverity(MonitoringAlertSeverity severity);
    
    Page<MonitoringAlertDTO> findByAcknowledged(boolean acknowledged, Pageable pageable);
    
    Page<MonitoringAlertDTO> findByResolved(boolean resolved, Pageable pageable);
    
    List<MonitoringAlertDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<MonitoringAlertDTO> findBySchoolIdAndDateRange(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<MonitoringAlertDTO> findByRegionIdAndDateRange(Long regionId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<MonitoringAlertDTO> findUnacknowledgedBySeverities(List<MonitoringAlertSeverity> severities);
    
    List<MonitoringAlertDTO> findUnresolvedBySeverity(MonitoringAlertSeverity severity);
    
    Long countUnacknowledgedBySchool(Long schoolId);
    
    Long countUnacknowledgedByRegion(Long regionId);
    
    Long countUnresolvedBySchool(Long schoolId);
    
    Long countUnresolvedByRegion(Long regionId);
    
    Map<MonitoringAlertType, Long> getAlertTypeStatistics(LocalDateTime startDate, LocalDateTime endDate);
    
    Map<MonitoringAlertSeverity, Long> getAlertSeverityStatistics(LocalDateTime startDate, LocalDateTime endDate);
    
    List<MonitoringAlertDTO> findPendingNotifications();
    
    List<MonitoringAlertDTO> findActiveAlertsBySchoolAndType(Long schoolId, MonitoringAlertType alertType);
    
    List<MonitoringAlertDTO> findActiveAlertsByRegionAndType(Long regionId, MonitoringAlertType alertType);
    
    MonitoringAlertDTO acknowledgeAlert(Long alertId, String acknowledgedBy);
    
    MonitoringAlertDTO resolveAlert(Long alertId, String resolvedBy, String resolutionNotes);
    
    MonitoringAlertDTO createAlert(MonitoringAlertType alertType, MonitoringAlertSeverity severity, 
                                  MonitoringScope scope, Long scopeId, String title, String description,
                                  Double thresholdValue, Double actualValue, String metricName);
    
    void processAlerts();
    
    void sendNotifications();
    
    void checkThresholds();
} 