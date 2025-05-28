package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MonitoringAlertDTO;
import com.ohma.thutothebe.entity.MonitoringAlert;
import com.ohma.thutothebe.entity.MonitoringAlertSeverity;
import com.ohma.thutothebe.entity.MonitoringAlertType;
import com.ohma.thutothebe.entity.MonitoringScope;
import com.ohma.thutothebe.mapper.MonitoringAlertMapper;
import com.ohma.thutothebe.repository.MonitoringAlertRepository;
import com.ohma.thutothebe.service.MonitoringAlertService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
public class MonitoringAlertServiceImpl extends BaseServiceImpl<MonitoringAlert, MonitoringAlertDTO, Long> implements MonitoringAlertService {

    @Autowired
    private MonitoringAlertRepository monitoringAlertRepository;

    @Autowired
    private MonitoringAlertMapper monitoringAlertMapper;

    public MonitoringAlertServiceImpl(MonitoringAlertRepository repository) {
        super(repository);
    }

    @Override
    protected MonitoringAlert mapToEntity(MonitoringAlertDTO dto) {
        return monitoringAlertMapper.toEntity(dto);
    }

    @Override
    protected MonitoringAlertDTO mapToDto(MonitoringAlert entity) {
        return monitoringAlertMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(MonitoringAlert entity, MonitoringAlertDTO dto) {
        monitoringAlertMapper.updateEntity(entity, dto);
    }

    @Override
    public List<MonitoringAlertDTO> findBySchoolId(Long schoolId) {
        log.info("Finding alerts for school ID: {}", schoolId);
        return monitoringAlertRepository.findBySchoolId(schoolId)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findByRegionId(Long regionId) {
        log.info("Finding alerts for region ID: {}", regionId);
        return monitoringAlertRepository.findByRegionId(regionId)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findByScope(MonitoringScope scope) {
        log.info("Finding alerts for scope: {}", scope);
        return monitoringAlertRepository.findByScope(scope)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findByAlertType(MonitoringAlertType alertType) {
        log.info("Finding alerts for type: {}", alertType);
        return monitoringAlertRepository.findByAlertType(alertType)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findBySeverity(MonitoringAlertSeverity severity) {
        log.info("Finding alerts for severity: {}", severity);
        return monitoringAlertRepository.findBySeverity(severity)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<MonitoringAlertDTO> findByAcknowledged(boolean acknowledged, Pageable pageable) {
        log.info("Finding alerts with acknowledged status: {}", acknowledged);
        List<MonitoringAlert> alerts = monitoringAlertRepository.findByAcknowledged(acknowledged);
        List<MonitoringAlertDTO> dtos = alerts.stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), dtos.size());
        List<MonitoringAlertDTO> pageContent = dtos.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, dtos.size());
    }

    @Override
    public Page<MonitoringAlertDTO> findByResolved(boolean resolved, Pageable pageable) {
        log.info("Finding alerts with resolved status: {}", resolved);
        List<MonitoringAlert> alerts = monitoringAlertRepository.findByResolved(resolved);
        List<MonitoringAlertDTO> dtos = alerts.stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), dtos.size());
        List<MonitoringAlertDTO> pageContent = dtos.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, dtos.size());
    }

    @Override
    public List<MonitoringAlertDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding alerts between {} and {}", startDate, endDate);
        return monitoringAlertRepository.findByDateRange(startDate, endDate, Pageable.unpaged())
                .getContent()
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findBySchoolIdAndDateRange(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding alerts for school ID: {} between {} and {}", schoolId, startDate, endDate);
        return monitoringAlertRepository.findBySchoolId(schoolId)
                .stream()
                .filter(alert -> alert.getAlertTimestamp().isAfter(startDate) && alert.getAlertTimestamp().isBefore(endDate))
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findByRegionIdAndDateRange(Long regionId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding alerts for region ID: {} between {} and {}", regionId, startDate, endDate);
        return monitoringAlertRepository.findByRegionId(regionId)
                .stream()
                .filter(alert -> alert.getAlertTimestamp().isAfter(startDate) && alert.getAlertTimestamp().isBefore(endDate))
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findUnacknowledgedBySeverities(List<MonitoringAlertSeverity> severities) {
        log.info("Finding unacknowledged alerts for severities: {}", severities);
        return monitoringAlertRepository.findCriticalUnacknowledgedAlerts(severities)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findUnresolvedBySeverity(MonitoringAlertSeverity severity) {
        log.info("Finding unresolved alerts for severity: {}", severity);
        return monitoringAlertRepository.findUnresolvedBySeverity(severity)
                .stream()
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Long countUnacknowledgedBySchool(Long schoolId) {
        log.info("Counting unacknowledged alerts for school ID: {}", schoolId);
        return monitoringAlertRepository.countUnacknowledgedBySchoolId(schoolId);
    }

    @Override
    public Long countUnacknowledgedByRegion(Long regionId) {
        log.info("Counting unacknowledged alerts for region ID: {}", regionId);
        return monitoringAlertRepository.countUnacknowledgedByRegionId(regionId);
    }

    @Override
    public Long countUnresolvedBySchool(Long schoolId) {
        log.info("Counting unresolved alerts for school ID: {}", schoolId);
        return monitoringAlertRepository.findBySchoolId(schoolId)
                .stream()
                .filter(alert -> !alert.isResolved())
                .count();
    }

    @Override
    public Long countUnresolvedByRegion(Long regionId) {
        log.info("Counting unresolved alerts for region ID: {}", regionId);
        return monitoringAlertRepository.findByRegionId(regionId)
                .stream()
                .filter(alert -> !alert.isResolved())
                .count();
    }

    @Override
    public Map<MonitoringAlertType, Long> getAlertTypeStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting alert type statistics between {} and {}", startDate, endDate);
        Map<MonitoringAlertType, Long> statistics = new HashMap<>();
        
        for (MonitoringAlertType type : MonitoringAlertType.values()) {
            Long count = monitoringAlertRepository.countByAlertTypeSince(type, startDate);
            statistics.put(type, count);
        }
        
        return statistics;
    }

    @Override
    public Map<MonitoringAlertSeverity, Long> getAlertSeverityStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting alert severity statistics between {} and {}", startDate, endDate);
        Map<MonitoringAlertSeverity, Long> statistics = new HashMap<>();
        
        for (MonitoringAlertSeverity severity : MonitoringAlertSeverity.values()) {
            Long count = monitoringAlertRepository.countUnacknowledgedBySeverity(severity);
            statistics.put(severity, count);
        }
        
        return statistics;
    }

    @Override
    public List<MonitoringAlertDTO> findPendingNotifications() {
        log.info("Finding alerts with pending notifications");
        return monitoringAlertRepository.findByAcknowledged(false)
                .stream()
                .filter(alert -> !alert.isNotificationSent())
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findActiveAlertsBySchoolAndType(Long schoolId, MonitoringAlertType alertType) {
        log.info("Finding active alerts for school ID: {} and type: {}", schoolId, alertType);
        return monitoringAlertRepository.findBySchoolId(schoolId)
                .stream()
                .filter(alert -> alert.getAlertType() == alertType && alert.isActive() && !alert.isResolved())
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MonitoringAlertDTO> findActiveAlertsByRegionAndType(Long regionId, MonitoringAlertType alertType) {
        log.info("Finding active alerts for region ID: {} and type: {}", regionId, alertType);
        return monitoringAlertRepository.findByRegionId(regionId)
                .stream()
                .filter(alert -> alert.getAlertType() == alertType && alert.isActive() && !alert.isResolved())
                .map(monitoringAlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MonitoringAlertDTO acknowledgeAlert(Long alertId, String acknowledgedBy) {
        log.info("Acknowledging alert ID: {} by user: {}", alertId, acknowledgedBy);
        
        try {
            MonitoringAlert alert = monitoringAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + alertId));

            if (alert.isAcknowledged()) {
                log.warn("Alert ID: {} is already acknowledged", alertId);
                return monitoringAlertMapper.toDto(alert);
            }

            alert.setAcknowledged(true);
            alert.setAcknowledgedBy(acknowledgedBy);
            alert.setAcknowledgedAt(LocalDateTime.now());

            MonitoringAlert saved = monitoringAlertRepository.save(alert);
            log.info("Alert ID: {} acknowledged successfully", alertId);
            
            return monitoringAlertMapper.toDto(saved);

        } catch (Exception e) {
            log.error("Error acknowledging alert ID: {}", alertId, e);
            throw new RuntimeException("Failed to acknowledge alert", e);
        }
    }

    @Override
    public MonitoringAlertDTO resolveAlert(Long alertId, String resolvedBy, String resolutionNotes) {
        log.info("Resolving alert ID: {} by user: {}", alertId, resolvedBy);
        
        try {
            MonitoringAlert alert = monitoringAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + alertId));

            if (alert.isResolved()) {
                log.warn("Alert ID: {} is already resolved", alertId);
                return monitoringAlertMapper.toDto(alert);
            }

            // Auto-acknowledge if not already acknowledged
            if (!alert.isAcknowledged()) {
                alert.setAcknowledged(true);
                alert.setAcknowledgedBy(resolvedBy);
                alert.setAcknowledgedAt(LocalDateTime.now());
            }

            alert.setResolved(true);
            alert.setResolvedBy(resolvedBy);
            alert.setResolvedAt(LocalDateTime.now());
            alert.setResolutionNotes(resolutionNotes);

            MonitoringAlert saved = monitoringAlertRepository.save(alert);
            log.info("Alert ID: {} resolved successfully", alertId);
            
            return monitoringAlertMapper.toDto(saved);

        } catch (Exception e) {
            log.error("Error resolving alert ID: {}", alertId, e);
            throw new RuntimeException("Failed to resolve alert", e);
        }
    }

    @Override
    public MonitoringAlertDTO createAlert(MonitoringAlertType alertType, MonitoringAlertSeverity severity,
                                         MonitoringScope scope, Long scopeId, String title, String description,
                                         Double thresholdValue, Double actualValue, String metricName) {
        log.info("Creating new alert: type={}, severity={}, scope={}, scopeId={}", alertType, severity, scope, scopeId);
        
        try {
            MonitoringAlert alert = new MonitoringAlert();
            alert.setAlertType(alertType);
            alert.setSeverity(severity);
            alert.setScope(scope);
            alert.setScopeId(scopeId);
            alert.setTitle(title);
            alert.setDescription(description);
            alert.setThresholdValue(thresholdValue);
            alert.setActualValue(actualValue);
            alert.setMetricName(metricName);
            alert.setAlertTimestamp(LocalDateTime.now());
            alert.setAcknowledged(false);
            alert.setResolved(false);
            alert.setNotificationSent(false);
            alert.setActive(true);

            MonitoringAlert saved = monitoringAlertRepository.save(alert);
            log.info("Alert created successfully with ID: {}", saved.getId());
            
            return monitoringAlertMapper.toDto(saved);

        } catch (Exception e) {
            log.error("Error creating alert: type={}, severity={}", alertType, severity, e);
            throw new RuntimeException("Failed to create alert", e);
        }
    }

    @Override
    public void processAlerts() {
        log.info("Processing alerts - checking thresholds and generating new alerts");
        
        try {
            // This would contain business logic to check various thresholds
            // and generate alerts based on monitoring data
            checkThresholds();
            sendNotifications();
            
        } catch (Exception e) {
            log.error("Error processing alerts", e);
        }
    }

    @Override
    public void sendNotifications() {
        log.info("Sending notifications for pending alerts");
        
        try {
            List<MonitoringAlert> pendingAlerts = monitoringAlertRepository.findByAcknowledged(false)
                .stream()
                .filter(alert -> !alert.isNotificationSent())
                .collect(Collectors.toList());

            for (MonitoringAlert alert : pendingAlerts) {
                try {
                    // Here you would integrate with notification service (email, SMS, etc.)
                    log.info("Sending notification for alert ID: {} - {}", alert.getId(), alert.getTitle());
                    
                    // Mark as notification sent
                    alert.setNotificationSent(true);
                    alert.setNotificationSentAt(LocalDateTime.now());
                    monitoringAlertRepository.save(alert);
                    
                } catch (Exception e) {
                    log.error("Failed to send notification for alert ID: {}", alert.getId(), e);
                }
            }
            
        } catch (Exception e) {
            log.error("Error sending notifications", e);
        }
    }

    @Override
    public void checkThresholds() {
        log.info("Checking thresholds for generating new alerts");
        
        try {
            // This is where you would implement threshold checking logic
            // For example:
            // - Check attendance rates below threshold
            // - Check grading turnaround times above threshold
            // - Check system usage below threshold
            // - Check compliance scores below threshold
            
            // Example threshold check (simplified)
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime oneDayAgo = now.minusDays(1);
            
            // Check for high alert counts (example)
            for (MonitoringAlertSeverity severity : MonitoringAlertSeverity.values()) {
                Long count = monitoringAlertRepository.countUnacknowledgedBySeverity(severity);
                if (count > getThresholdForSeverity(severity)) {
                    createAlert(
                        MonitoringAlertType.HIGH_ALERT_COUNT,
                        MonitoringAlertSeverity.HIGH,
                        MonitoringScope.NATIONAL,
                        null,
                        "High Alert Count Detected",
                        String.format("High number of unacknowledged %s alerts: %d", severity, count),
                        (double) getThresholdForSeverity(severity),
                        count.doubleValue(),
                        "unacknowledged_alerts_count"
                    );
                }
            }
            
        } catch (Exception e) {
            log.error("Error checking thresholds", e);
        }
    }

    private int getThresholdForSeverity(MonitoringAlertSeverity severity) {
        return switch (severity) {
            case CRITICAL -> 5;
            case HIGH -> 10;
            case MEDIUM -> 20;
            case LOW -> 50;
        };
    }
} 