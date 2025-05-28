package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.SchoolMonitoringDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface SchoolMonitoringService extends BaseService<SchoolMonitoringDTO, Long> {
    
    SchoolMonitoringDTO findBySchoolIdAndDate(Long schoolId, LocalDate date);
    
    List<SchoolMonitoringDTO> findBySchoolIdAndDateRange(Long schoolId, LocalDate startDate, LocalDate endDate);
    
    List<SchoolMonitoringDTO> findByRegionIdAndDate(Long regionId, LocalDate date);
    
    List<SchoolMonitoringDTO> findByRegionIdAndDateRange(Long regionId, LocalDate startDate, LocalDate endDate);
    
    List<SchoolMonitoringDTO> findByDate(LocalDate date);
    
    Page<SchoolMonitoringDTO> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    List<SchoolMonitoringDTO> findSchoolsWithLowAttendance(Double threshold, LocalDate date);
    
    List<SchoolMonitoringDTO> findSchoolsWithLowUsage(Integer threshold, LocalDate date);
    
    List<SchoolMonitoringDTO> findSchoolsWithDelayedGrading(Double threshold, LocalDate date);
    
    List<SchoolMonitoringDTO> findSchoolsWithLowCompliance(Double threshold, LocalDate date);
    
    List<SchoolMonitoringDTO> findSchoolsWithHighAlerts(Integer threshold, LocalDate date);
    
    SchoolMonitoringDTO findLatestMonitoringDataForSchool(Long schoolId);
    
    List<SchoolMonitoringDTO> findLatestMonitoringDataForAllSchools();
    
    SchoolMonitoringDTO generateMonitoringDataForSchool(Long schoolId, LocalDate date);
    
    void generateMonitoringDataForAllSchools(LocalDate date);
    
    Double calculateComplianceScore(Long schoolId, LocalDate date);
    
    void updateSchoolMonitoringData(Long schoolId, LocalDate date);
} 