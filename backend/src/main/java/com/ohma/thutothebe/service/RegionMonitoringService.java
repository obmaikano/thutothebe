package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.RegionMonitoringDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface RegionMonitoringService extends BaseService<RegionMonitoringDTO, Long> {
    
    RegionMonitoringDTO findByRegionIdAndDate(Long regionId, LocalDate date);
    
    List<RegionMonitoringDTO> findByRegionIdAndDateRange(Long regionId, LocalDate startDate, LocalDate endDate);
    
    List<RegionMonitoringDTO> findByDate(LocalDate date);
    
    Page<RegionMonitoringDTO> findByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    List<RegionMonitoringDTO> findRegionsWithLowAttendance(Double threshold, LocalDate date);
    
    List<RegionMonitoringDTO> findRegionsWithLowUsageSchools(Integer threshold, LocalDate date);
    
    List<RegionMonitoringDTO> findRegionsWithLowCompliance(Double threshold, LocalDate date);
    
    List<RegionMonitoringDTO> findRegionsWithHighAlerts(Integer threshold, LocalDate date);
    
    List<RegionMonitoringDTO> findTopPerformingRegions(Double threshold, LocalDate date);
    
    List<RegionMonitoringDTO> findUnderperformingRegions(Double threshold, LocalDate date);
    
    RegionMonitoringDTO findLatestMonitoringDataForRegion(Long regionId);
    
    List<RegionMonitoringDTO> findLatestMonitoringDataForAllRegions();
    
    RegionMonitoringDTO generateMonitoringDataForRegion(Long regionId, LocalDate date);
    
    void generateMonitoringDataForAllRegions(LocalDate date);
    
    Double getNationalAverageAttendanceRate(LocalDate date);
    
    Double getNationalAverageComplianceScore(LocalDate date);
    
    Long getTotalSchoolsNationally(LocalDate date);
    
    Long getTotalTeachersNationally(LocalDate date);
    
    Long getTotalStudentsNationally(LocalDate date);
    
    void updateRegionMonitoringData(Long regionId, LocalDate date);
} 