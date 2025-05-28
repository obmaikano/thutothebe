package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RegionMonitoringDTO;
import com.ohma.thutothebe.entity.RegionMonitoring;
import com.ohma.thutothebe.mapper.RegionMonitoringMapper;
import com.ohma.thutothebe.repository.RegionMonitoringRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.service.RegionMonitoringService;
import com.ohma.thutothebe.service.SchoolMonitoringService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class RegionMonitoringServiceImpl extends BaseServiceImpl<RegionMonitoring, RegionMonitoringDTO, Long> implements RegionMonitoringService {

    @Autowired
    private RegionMonitoringRepository regionMonitoringRepository;

    @Autowired
    private RegionMonitoringMapper regionMonitoringMapper;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private SchoolMonitoringService schoolMonitoringService;

    public RegionMonitoringServiceImpl(RegionMonitoringRepository repository) {
        super(repository);
    }

    @Override
    protected RegionMonitoring mapToEntity(RegionMonitoringDTO dto) {
        return regionMonitoringMapper.toEntity(dto);
    }

    @Override
    protected RegionMonitoringDTO mapToDto(RegionMonitoring entity) {
        return regionMonitoringMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(RegionMonitoring entity, RegionMonitoringDTO dto) {
        regionMonitoringMapper.updateEntity(entity, dto);
    }

    @Override
    public RegionMonitoringDTO findByRegionIdAndDate(Long regionId, LocalDate date) {
        log.info("Finding region monitoring data for region ID: {} and date: {}", regionId, date);
        return regionMonitoringRepository.findByRegionIdAndMonitoringDate(regionId, date)
                .map(regionMonitoringMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<RegionMonitoringDTO> findByRegionIdAndDateRange(Long regionId, LocalDate startDate, LocalDate endDate) {
        log.info("Finding region monitoring data for region ID: {} between {} and {}", regionId, startDate, endDate);
        return regionMonitoringRepository.findByRegionIdAndDateRange(regionId, startDate, endDate)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionMonitoringDTO> findByDate(LocalDate date) {
        log.info("Finding all region monitoring data for date: {}", date);
        return regionMonitoringRepository.findByMonitoringDate(date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<RegionMonitoringDTO> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        log.info("Finding region monitoring data between {} and {} with pagination", startDate, endDate);
        return regionMonitoringRepository.findByDateRange(startDate, endDate, pageable)
                .map(regionMonitoringMapper::toDto);
    }

    @Override
    public List<RegionMonitoringDTO> findRegionsWithLowAttendance(Double threshold, LocalDate date) {
        log.info("Finding regions with attendance rate below {} for date: {}", threshold, date);
        return regionMonitoringRepository.findRegionsWithLowAttendance(threshold, date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionMonitoringDTO> findRegionsWithLowUsageSchools(Integer threshold, LocalDate date) {
        log.info("Finding regions with low usage schools above {} for date: {}", threshold, date);
        return regionMonitoringRepository.findRegionsWithLowUsageSchools(threshold, date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionMonitoringDTO> findRegionsWithLowCompliance(Double threshold, LocalDate date) {
        log.info("Finding regions with compliance score below {} for date: {}", threshold, date);
        return regionMonitoringRepository.findRegionsWithLowCompliance(threshold, date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionMonitoringDTO> findRegionsWithHighAlerts(Integer threshold, LocalDate date) {
        log.info("Finding regions with alert count above {} for date: {}", threshold, date);
        return regionMonitoringRepository.findRegionsWithHighAlerts(threshold, date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionMonitoringDTO> findTopPerformingRegions(Double threshold, LocalDate date) {
        log.info("Finding top performing regions with compliance score above {} for date: {}", threshold, date);
        return regionMonitoringRepository.findTopPerformingRegions(threshold, date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionMonitoringDTO> findUnderperformingRegions(Double threshold, LocalDate date) {
        log.info("Finding underperforming regions with compliance score below {} for date: {}", threshold, date);
        return regionMonitoringRepository.findUnderperformingRegions(threshold, date)
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RegionMonitoringDTO findLatestMonitoringDataForRegion(Long regionId) {
        log.info("Finding latest monitoring data for region ID: {}", regionId);
        return regionMonitoringRepository.findLatestMonitoringDataForRegion(regionId)
                .map(regionMonitoringMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<RegionMonitoringDTO> findLatestMonitoringDataForAllRegions() {
        log.info("Finding latest monitoring data for all regions");
        return regionMonitoringRepository.findLatestMonitoringDataForAllRegions()
                .stream()
                .map(regionMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RegionMonitoringDTO generateMonitoringDataForRegion(Long regionId, LocalDate date) {
        log.info("Generating monitoring data for region ID: {} on date: {}", regionId, date);
        
        try {
            // Check if data already exists
            RegionMonitoringDTO existing = findByRegionIdAndDate(regionId, date);
            if (existing != null) {
                log.info("Monitoring data already exists for region ID: {} on date: {}", regionId, date);
                return existing;
            }

            // Generate new monitoring data by aggregating school data
            RegionMonitoring monitoring = new RegionMonitoring();
            monitoring.setRegion(regionRepository.findById(regionId)
                .orElseThrow(() -> new IllegalArgumentException("Region not found with id: " + regionId)));
            monitoring.setMonitoringDate(date);

            // Get all school monitoring data for this region and date
            var schoolData = schoolMonitoringService.findByRegionIdAndDate(regionId, date);

            // Aggregate data from schools
            int totalSchools = schoolData.size();
            int activeSchools = (int) schoolData.stream().filter(s -> s.active()).count();
            
            int totalTeachers = schoolData.stream()
                .mapToInt(s -> s.totalActiveTeachers() != null ? s.totalActiveTeachers() : 0)
                .sum();
            
            int totalStudents = schoolData.stream()
                .mapToInt(s -> s.totalActiveStudents() != null ? s.totalActiveStudents() : 0)
                .sum();
            
            int totalLogins = schoolData.stream()
                .mapToInt(s -> s.totalLogins() != null ? s.totalLogins() : 0)
                .sum();

            double avgAttendanceRate = schoolData.stream()
                .filter(s -> s.attendanceRate() != null)
                .mapToDouble(s -> s.attendanceRate())
                .average()
                .orElse(0.0);

            int totalAssignmentSubmissions = schoolData.stream()
                .mapToInt(s -> s.assignmentSubmissions() != null ? s.assignmentSubmissions() : 0)
                .sum();

            int totalAssignmentsGraded = schoolData.stream()
                .mapToInt(s -> s.assignmentsGraded() != null ? s.assignmentsGraded() : 0)
                .sum();

            double avgGradingTurnaround = schoolData.stream()
                .filter(s -> s.averageGradingTurnaroundHours() != null)
                .mapToDouble(s -> s.averageGradingTurnaroundHours())
                .average()
                .orElse(0.0);

            double avgCurriculumCompletion = schoolData.stream()
                .filter(s -> s.curriculumCompletionRate() != null)
                .mapToDouble(s -> s.curriculumCompletionRate())
                .average()
                .orElse(0.0);

            double avgSystemUptime = schoolData.stream()
                .filter(s -> s.systemUptimePercentage() != null)
                .mapToDouble(s -> s.systemUptimePercentage())
                .average()
                .orElse(0.0);

            int schoolsWithLowUsage = (int) schoolData.stream()
                .filter(s -> s.totalLogins() != null && s.totalLogins() < 50)
                .count();

            int schoolsWithDelayedGrading = (int) schoolData.stream()
                .filter(s -> s.averageGradingTurnaroundHours() != null && s.averageGradingTurnaroundHours() > 48)
                .count();

            int schoolsWithIrregularAttendance = (int) schoolData.stream()
                .filter(s -> s.attendanceRate() != null && s.attendanceRate() < 80)
                .count();

            int totalAlerts = schoolData.stream()
                .mapToInt(s -> s.alertCount() != null ? s.alertCount() : 0)
                .sum();

            int highPerformingSchools = (int) schoolData.stream()
                .filter(s -> s.complianceScore() != null && s.complianceScore() >= 85)
                .count();

            int lowPerformingSchools = (int) schoolData.stream()
                .filter(s -> s.complianceScore() != null && s.complianceScore() < 60)
                .count();

            double avgComplianceScore = schoolData.stream()
                .filter(s -> s.complianceScore() != null)
                .mapToDouble(s -> s.complianceScore())
                .average()
                .orElse(0.0);

            // Set aggregated values
            monitoring.setTotalSchools(totalSchools);
            monitoring.setActiveSchools(activeSchools);
            monitoring.setTotalTeachers(totalTeachers);
            monitoring.setTotalStudents(totalStudents);
            monitoring.setTotalLogins(totalLogins);
            monitoring.setAverageAttendanceRate(Math.round(avgAttendanceRate * 100.0) / 100.0);
            monitoring.setTotalAssignmentSubmissions(totalAssignmentSubmissions);
            monitoring.setTotalAssignmentsGraded(totalAssignmentsGraded);
            monitoring.setAverageGradingTurnaroundHours(Math.round(avgGradingTurnaround * 100.0) / 100.0);
            monitoring.setAverageCurriculumCompletionRate(Math.round(avgCurriculumCompletion * 100.0) / 100.0);
            monitoring.setAverageSystemUptimePercentage(Math.round(avgSystemUptime * 100.0) / 100.0);
            monitoring.setSchoolsWithLowUsage(schoolsWithLowUsage);
            monitoring.setSchoolsWithDelayedGrading(schoolsWithDelayedGrading);
            monitoring.setSchoolsWithIrregularAttendance(schoolsWithIrregularAttendance);
            monitoring.setTotalAlerts(totalAlerts);
            monitoring.setHighPerformingSchools(highPerformingSchools);
            monitoring.setLowPerformingSchools(lowPerformingSchools);
            monitoring.setAverageComplianceScore(Math.round(avgComplianceScore * 100.0) / 100.0);
            monitoring.setResourceUtilizationRate(75.0); // Default value
            monitoring.setLastUpdated(LocalDateTime.now());
            monitoring.setActive(true);

            RegionMonitoring saved = regionMonitoringRepository.save(monitoring);
            return regionMonitoringMapper.toDto(saved);

        } catch (Exception e) {
            log.error("Error generating monitoring data for region ID: {} on date: {}", regionId, date, e);
            throw new RuntimeException("Failed to generate region monitoring data", e);
        }
    }

    @Override
    public void generateMonitoringDataForAllRegions(LocalDate date) {
        log.info("Generating monitoring data for all regions on date: {}", date);
        
        List<Long> regionIds = regionRepository.findAll().stream()
            .map(region -> region.getId())
            .collect(Collectors.toList());

        for (Long regionId : regionIds) {
            try {
                generateMonitoringDataForRegion(regionId, date);
            } catch (Exception e) {
                log.error("Failed to generate monitoring data for region ID: {} on date: {}", regionId, date, e);
            }
        }
    }

    @Override
    public Double getNationalAverageAttendanceRate(LocalDate date) {
        log.info("Calculating national average attendance rate for date: {}", date);
        return regionMonitoringRepository.getNationalAverageAttendanceRate(date);
    }

    @Override
    public Double getNationalAverageComplianceScore(LocalDate date) {
        log.info("Calculating national average compliance score for date: {}", date);
        return regionMonitoringRepository.getNationalAverageComplianceScore(date);
    }

    @Override
    public Long getTotalSchoolsNationally(LocalDate date) {
        log.info("Getting total schools nationally for date: {}", date);
        return regionMonitoringRepository.getTotalSchoolsNationally(date);
    }

    @Override
    public Long getTotalTeachersNationally(LocalDate date) {
        log.info("Getting total teachers nationally for date: {}", date);
        return regionMonitoringRepository.getTotalTeachersNationally(date);
    }

    @Override
    public Long getTotalStudentsNationally(LocalDate date) {
        log.info("Getting total students nationally for date: {}", date);
        return regionMonitoringRepository.getTotalStudentsNationally(date);
    }

    @Override
    public void updateRegionMonitoringData(Long regionId, LocalDate date) {
        log.info("Updating region monitoring data for region ID: {} on date: {}", regionId, date);
        
        try {
            RegionMonitoring existing = regionMonitoringRepository.findByRegionIdAndMonitoringDate(regionId, date)
                .orElse(null);

            if (existing != null) {
                // Regenerate data by aggregating current school data
                generateMonitoringDataForRegion(regionId, date);
                log.info("Updated monitoring data for region ID: {} on date: {}", regionId, date);
            } else {
                log.warn("No existing monitoring data found for region ID: {} on date: {}", regionId, date);
                generateMonitoringDataForRegion(regionId, date);
            }

        } catch (Exception e) {
            log.error("Error updating monitoring data for region ID: {} on date: {}", regionId, date, e);
            throw new RuntimeException("Failed to update region monitoring data", e);
        }
    }
} 