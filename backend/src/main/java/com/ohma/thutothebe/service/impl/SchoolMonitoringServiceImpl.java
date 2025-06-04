package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SchoolMonitoringDTO;
import com.ohma.thutothebe.entity.SchoolMonitoring;
import com.ohma.thutothebe.mapper.SchoolMonitoringMapper;
import com.ohma.thutothebe.repository.SchoolMonitoringRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.UserActivityLogRepository;
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
public class SchoolMonitoringServiceImpl extends BaseServiceImpl<SchoolMonitoring, SchoolMonitoringDTO, Long> implements SchoolMonitoringService {

    @Autowired
    private SchoolMonitoringRepository schoolMonitoringRepository;

    @Autowired
    private SchoolMonitoringMapper schoolMonitoringMapper;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private UserActivityLogRepository userActivityLogRepository;

    public SchoolMonitoringServiceImpl(SchoolMonitoringRepository repository) {
        super(repository);
    }

    @Override
    protected SchoolMonitoring mapToEntity(SchoolMonitoringDTO dto) {
        return schoolMonitoringMapper.toEntity(dto);
    }

    @Override
    protected SchoolMonitoringDTO mapToDto(SchoolMonitoring entity) {
        return schoolMonitoringMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(SchoolMonitoring entity, SchoolMonitoringDTO dto) {
        schoolMonitoringMapper.updateEntity(entity, dto);
    }

    @Override
    public SchoolMonitoringDTO findBySchoolIdAndDate(Long schoolId, LocalDate date) {
        log.info("Finding school monitoring data for school ID: {} and date: {}", schoolId, date);
        return schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(schoolId, date)
                .map(schoolMonitoringMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<SchoolMonitoringDTO> findBySchoolIdAndDateRange(Long schoolId, LocalDate startDate, LocalDate endDate) {
        log.info("Finding school monitoring data for school ID: {} between {} and {}", schoolId, startDate, endDate);
        return schoolMonitoringRepository.findBySchoolIdAndDateRange(schoolId, startDate, endDate)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findByRegionIdAndDate(Long regionId, LocalDate date) {
        log.info("Finding school monitoring data for region ID: {} and date: {}", regionId, date);
        return schoolMonitoringRepository.findByRegionIdAndDate(regionId, date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findByRegionIdAndDateRange(Long regionId, LocalDate startDate, LocalDate endDate) {
        log.info("Finding school monitoring data for region ID: {} between {} and {}", regionId, startDate, endDate);
        return schoolMonitoringRepository.findByRegionIdAndDateRange(regionId, startDate, endDate)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findByDate(LocalDate date) {
        log.info("Finding all school monitoring data for date: {}", date);
        return schoolMonitoringRepository.findByMonitoringDate(date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<SchoolMonitoringDTO> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        log.info("Finding school monitoring data between {} and {} with pagination", startDate, endDate);
        return schoolMonitoringRepository.findByDateRange(startDate, endDate, pageable)
                .map(schoolMonitoringMapper::toDto);
    }

    @Override
    public List<SchoolMonitoringDTO> findSchoolsWithLowAttendance(Double threshold, LocalDate date) {
        log.info("Finding schools with attendance rate below {} for date: {}", threshold, date);
        return schoolMonitoringRepository.findSchoolsWithLowAttendance(threshold, date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findSchoolsWithLowUsage(Integer threshold, LocalDate date) {
        log.info("Finding schools with login count below {} for date: {}", threshold, date);
        return schoolMonitoringRepository.findSchoolsWithLowUsage(threshold, date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findSchoolsWithDelayedGrading(Double threshold, LocalDate date) {
        log.info("Finding schools with grading turnaround above {} hours for date: {}", threshold, date);
        return schoolMonitoringRepository.findSchoolsWithDelayedGrading(threshold, date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findSchoolsWithLowCompliance(Double threshold, LocalDate date) {
        log.info("Finding schools with compliance score below {} for date: {}", threshold, date);
        return schoolMonitoringRepository.findSchoolsWithLowCompliance(threshold, date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SchoolMonitoringDTO> findSchoolsWithHighAlerts(Integer threshold, LocalDate date) {
        log.info("Finding schools with alert count above {} for date: {}", threshold, date);
        return schoolMonitoringRepository.findSchoolsWithHighAlerts(threshold, date)
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SchoolMonitoringDTO findLatestMonitoringDataForSchool(Long schoolId) {
        log.info("Finding latest monitoring data for school ID: {}", schoolId);
        return schoolMonitoringRepository.findLatestMonitoringDataForSchool(schoolId)
                .map(schoolMonitoringMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<SchoolMonitoringDTO> findLatestMonitoringDataForAllSchools() {
        log.info("Finding latest monitoring data for all schools");
        return schoolMonitoringRepository.findLatestMonitoringDataForAllSchools()
                .stream()
                .map(schoolMonitoringMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SchoolMonitoringDTO generateMonitoringDataForSchool(Long schoolId, LocalDate date) {
        log.info("Generating monitoring data for school ID: {} on date: {}", schoolId, date);
        
        try {
            // Check if data already exists
            SchoolMonitoringDTO existing = findBySchoolIdAndDate(schoolId, date);
            if (existing != null) {
                log.info("Monitoring data already exists for school ID: {} on date: {}", schoolId, date);
                return existing;
            }

            // Generate new monitoring data
            SchoolMonitoring monitoring = new SchoolMonitoring();
            monitoring.setSchool(schoolRepository.findById(schoolId)
                .orElseThrow(() -> new IllegalArgumentException("School not found with id: " + schoolId)));
            monitoring.setMonitoringDate(date);

            // Calculate metrics based on actual data
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(23, 59, 59);

            // Calculate login statistics
            Long totalLogins = userActivityLogRepository.countActivityBySchoolAndType(
                schoolId, com.ohma.thutothebe.entity.UserActivityType.LOGIN, startOfDay, endOfDay);
            monitoring.setTotalLogins(totalLogins.intValue());

            // Calculate active users
            Long activeUsers = userActivityLogRepository.countActiveUsersBySchool(schoolId, startOfDay, endOfDay);
            monitoring.setTotalActiveTeachers(activeUsers.intValue()); // This would need role-based filtering

            // Set default values for other metrics (would be calculated from actual data in production)
            monitoring.setAttendanceRate(85.0);
            monitoring.setAssignmentSubmissions(0);
            monitoring.setAssignmentsGraded(0);
            monitoring.setAverageGradingTurnaroundHours(24.0);
            monitoring.setCurriculumCompletionRate(75.0);
            monitoring.setSystemUptimePercentage(99.0);
            monitoring.setPeakUsageHour(10);
            monitoring.setComplianceScore(calculateComplianceScore(schoolId, date));
            monitoring.setAlertCount(0);
            monitoring.setLastActivityTimestamp(LocalDateTime.now());
            monitoring.setActive(true);

            SchoolMonitoring saved = schoolMonitoringRepository.save(monitoring);
            return schoolMonitoringMapper.toDto(saved);

        } catch (Exception e) {
            log.error("Error generating monitoring data for school ID: {} on date: {}", schoolId, date, e);
            throw new RuntimeException("Failed to generate monitoring data", e);
        }
    }

    @Override
    public void generateMonitoringDataForAllSchools(LocalDate date) {
        log.info("Generating monitoring data for all schools on date: {}", date);
        
        List<Long> schoolIds = schoolRepository.findAll().stream()
            .map(school -> school.getId())
            .collect(Collectors.toList());

        for (Long schoolId : schoolIds) {
            try {
                generateMonitoringDataForSchool(schoolId, date);
            } catch (Exception e) {
                log.error("Failed to generate monitoring data for school ID: {} on date: {}", schoolId, date, e);
            }
        }
    }

    @Override
    public Double calculateComplianceScore(Long schoolId, LocalDate date) {
        log.info("Calculating compliance score for school ID: {} on date: {}", schoolId, date);
        
        try {
            // This is a simplified compliance calculation
            // In production, this would involve complex business rules
            
            double attendanceWeight = 0.3;
            double usageWeight = 0.2;
            double gradingWeight = 0.2;
            double curriculumWeight = 0.3;

            SchoolMonitoringDTO monitoring = findBySchoolIdAndDate(schoolId, date);
            if (monitoring == null) {
                return 0.0;
            }

            double attendanceScore = monitoring.attendanceRate() != null ? monitoring.attendanceRate() : 0.0;
            double usageScore = monitoring.totalLogins() != null && monitoring.totalLogins() > 0 ? 
                Math.min(100.0, monitoring.totalLogins() * 2.0) : 0.0;
            double gradingScore = monitoring.averageGradingTurnaroundHours() != null ? 
                Math.max(0.0, 100.0 - monitoring.averageGradingTurnaroundHours()) : 0.0;
            double curriculumScore = monitoring.curriculumCompletionRate() != null ? 
                monitoring.curriculumCompletionRate() : 0.0;

            double complianceScore = (attendanceScore * attendanceWeight) +
                                   (usageScore * usageWeight) +
                                   (gradingScore * gradingWeight) +
                                   (curriculumScore * curriculumWeight);

            return Math.round(complianceScore * 100.0) / 100.0;

        } catch (Exception e) {
            log.error("Error calculating compliance score for school ID: {} on date: {}", schoolId, date, e);
            return 0.0;
        }
    }

    @Override
    public void updateSchoolMonitoringData(Long schoolId, LocalDate date) {
        log.info("Updating school monitoring data for school ID: {} on date: {}", schoolId, date);
        
        try {
            SchoolMonitoring existing = schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(schoolId, date)
                .orElse(null);

            if (existing != null) {
                // Update compliance score
                Double newComplianceScore = calculateComplianceScore(schoolId, date);
                existing.setComplianceScore(newComplianceScore);
                existing.setLastActivityTimestamp(LocalDateTime.now());
                
                schoolMonitoringRepository.save(existing);
                log.info("Updated monitoring data for school ID: {} on date: {}", schoolId, date);
            } else {
                log.warn("No existing monitoring data found for school ID: {} on date: {}", schoolId, date);
                generateMonitoringDataForSchool(schoolId, date);
            }

        } catch (Exception e) {
            log.error("Error updating monitoring data for school ID: {} on date: {}", schoolId, date, e);
            throw new RuntimeException("Failed to update monitoring data", e);
        }
    }

    @Override
    protected Long extractSchoolId(SchoolMonitoring entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(SchoolMonitoring entity) {
        return entity.getSchool() != null && entity.getSchool().getRegion() != null 
            ? entity.getSchool().getRegion().getId() : null;
    }
} 