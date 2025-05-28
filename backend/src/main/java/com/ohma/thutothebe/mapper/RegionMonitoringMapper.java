package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.RegionMonitoringDTO;
import com.ohma.thutothebe.entity.RegionMonitoring;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegionMonitoringMapper implements BaseDtoMapper<RegionMonitoring, RegionMonitoringDTO> {

    private final RegionRepository regionRepository;

    @Override
    public RegionMonitoringDTO toDto(RegionMonitoring entity) {
        if (entity == null) return null;

        Region region = entity.getRegion();
        return new RegionMonitoringDTO(
            entity.getId(),
            region != null ? region.getId() : null,
            region != null ? region.getName() : null,
            region != null ? region.getCode() : null,
            entity.getMonitoringDate(),
            entity.getTotalSchools(),
            entity.getActiveSchools(),
            entity.getTotalTeachers(),
            entity.getTotalStudents(),
            entity.getTotalLogins(),
            entity.getAverageAttendanceRate(),
            entity.getTotalAssignmentSubmissions(),
            entity.getTotalAssignmentsGraded(),
            entity.getAverageGradingTurnaroundHours(),
            entity.getAverageCurriculumCompletionRate(),
            entity.getAverageSystemUptimePercentage(),
            entity.getSchoolsWithLowUsage(),
            entity.getSchoolsWithDelayedGrading(),
            entity.getSchoolsWithIrregularAttendance(),
            entity.getTotalAlerts(),
            entity.getHighPerformingSchools(),
            entity.getLowPerformingSchools(),
            entity.getAverageComplianceScore(),
            entity.getResourceUtilizationRate(),
            entity.getLastUpdated(),
            entity.isActive()
        );
    }

    @Override
    public RegionMonitoring toEntity(RegionMonitoringDTO dto) {
        if (dto == null) return null;

        RegionMonitoring entity = new RegionMonitoring();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(RegionMonitoring entity, RegionMonitoringDTO dto) {
        if (dto.regionId() != null) {
            Region region = regionRepository.findById(dto.regionId())
                .orElseThrow(() -> new IllegalArgumentException("Region not found with id: " + dto.regionId()));
            entity.setRegion(region);
        }
        
        entity.setMonitoringDate(dto.monitoringDate());
        entity.setTotalSchools(dto.totalSchools());
        entity.setActiveSchools(dto.activeSchools());
        entity.setTotalTeachers(dto.totalTeachers());
        entity.setTotalStudents(dto.totalStudents());
        entity.setTotalLogins(dto.totalLogins());
        entity.setAverageAttendanceRate(dto.averageAttendanceRate());
        entity.setTotalAssignmentSubmissions(dto.totalAssignmentSubmissions());
        entity.setTotalAssignmentsGraded(dto.totalAssignmentsGraded());
        entity.setAverageGradingTurnaroundHours(dto.averageGradingTurnaroundHours());
        entity.setAverageCurriculumCompletionRate(dto.averageCurriculumCompletionRate());
        entity.setAverageSystemUptimePercentage(dto.averageSystemUptimePercentage());
        entity.setSchoolsWithLowUsage(dto.schoolsWithLowUsage());
        entity.setSchoolsWithDelayedGrading(dto.schoolsWithDelayedGrading());
        entity.setSchoolsWithIrregularAttendance(dto.schoolsWithIrregularAttendance());
        entity.setTotalAlerts(dto.totalAlerts());
        entity.setHighPerformingSchools(dto.highPerformingSchools());
        entity.setLowPerformingSchools(dto.lowPerformingSchools());
        entity.setAverageComplianceScore(dto.averageComplianceScore());
        entity.setResourceUtilizationRate(dto.resourceUtilizationRate());
        entity.setLastUpdated(dto.lastUpdated());
        entity.setActive(dto.active());
    }
} 