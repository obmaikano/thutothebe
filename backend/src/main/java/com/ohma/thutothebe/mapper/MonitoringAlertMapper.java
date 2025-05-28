package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.MonitoringAlertDTO;
import com.ohma.thutothebe.entity.MonitoringAlert;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MonitoringAlertMapper implements BaseDtoMapper<MonitoringAlert, MonitoringAlertDTO> {

    private final SchoolRepository schoolRepository;
    private final RegionRepository regionRepository;

    @Override
    public MonitoringAlertDTO toDto(MonitoringAlert entity) {
        if (entity == null) return null;

        School school = entity.getSchool();
        Region region = entity.getRegion();
        
        return new MonitoringAlertDTO(
            entity.getId(),
            entity.getAlertType(),
            entity.getSeverity(),
            entity.getScope(),
            entity.getScopeId(),
            school != null ? school.getId() : null,
            school != null ? school.getName() : null,
            region != null ? region.getId() : null,
            region != null ? region.getName() : null,
            entity.getTitle(),
            entity.getDescription(),
            entity.getThresholdValue(),
            entity.getActualValue(),
            entity.getMetricName(),
            entity.getAlertTimestamp(),
            entity.isAcknowledged(),
            entity.getAcknowledgedBy(),
            entity.getAcknowledgedAt(),
            entity.isResolved(),
            entity.getResolvedBy(),
            entity.getResolvedAt(),
            entity.getResolutionNotes(),
            entity.isNotificationSent(),
            entity.getNotificationSentAt(),
            entity.isActive()
        );
    }

    @Override
    public MonitoringAlert toEntity(MonitoringAlertDTO dto) {
        if (dto == null) return null;

        MonitoringAlert entity = new MonitoringAlert();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(MonitoringAlert entity, MonitoringAlertDTO dto) {
        entity.setAlertType(dto.alertType());
        entity.setSeverity(dto.severity());
        entity.setScope(dto.scope());
        entity.setScopeId(dto.scopeId());
        
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId())
                .orElseThrow(() -> new IllegalArgumentException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }
        
        if (dto.regionId() != null) {
            Region region = regionRepository.findById(dto.regionId())
                .orElseThrow(() -> new IllegalArgumentException("Region not found with id: " + dto.regionId()));
            entity.setRegion(region);
        }
        
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setThresholdValue(dto.thresholdValue());
        entity.setActualValue(dto.actualValue());
        entity.setMetricName(dto.metricName());
        entity.setAlertTimestamp(dto.alertTimestamp());
        entity.setAcknowledged(dto.acknowledged());
        entity.setAcknowledgedBy(dto.acknowledgedBy());
        entity.setAcknowledgedAt(dto.acknowledgedAt());
        entity.setResolved(dto.resolved());
        entity.setResolvedBy(dto.resolvedBy());
        entity.setResolvedAt(dto.resolvedAt());
        entity.setResolutionNotes(dto.resolutionNotes());
        entity.setNotificationSent(dto.notificationSent());
        entity.setNotificationSentAt(dto.notificationSentAt());
        entity.setActive(dto.active());
    }
} 