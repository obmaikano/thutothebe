package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.RegionMonitoring;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegionMonitoringRepository extends JpaRepository<RegionMonitoring, Long> {

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.region.id = :regionId AND rm.monitoringDate = :date AND rm.active = true")
    Optional<RegionMonitoring> findByRegionIdAndMonitoringDate(@Param("regionId") Long regionId, @Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.region.id = :regionId AND rm.monitoringDate BETWEEN :startDate AND :endDate AND rm.active = true ORDER BY rm.monitoringDate DESC")
    List<RegionMonitoring> findByRegionIdAndDateRange(@Param("regionId") Long regionId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.monitoringDate = :date AND rm.active = true")
    List<RegionMonitoring> findByMonitoringDate(@Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.monitoringDate BETWEEN :startDate AND :endDate AND rm.active = true ORDER BY rm.monitoringDate DESC")
    Page<RegionMonitoring> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.averageAttendanceRate < :threshold AND rm.monitoringDate = :date AND rm.active = true")
    List<RegionMonitoring> findRegionsWithLowAttendance(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.schoolsWithLowUsage > :threshold AND rm.monitoringDate = :date AND rm.active = true")
    List<RegionMonitoring> findRegionsWithLowUsageSchools(@Param("threshold") Integer threshold, @Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.averageComplianceScore < :threshold AND rm.monitoringDate = :date AND rm.active = true")
    List<RegionMonitoring> findRegionsWithLowCompliance(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.totalAlerts > :threshold AND rm.monitoringDate = :date AND rm.active = true")
    List<RegionMonitoring> findRegionsWithHighAlerts(@Param("threshold") Integer threshold, @Param("date") LocalDate date);

    @Query("SELECT AVG(rm.averageAttendanceRate) FROM RegionMonitoring rm WHERE rm.monitoringDate = :date AND rm.active = true")
    Double getNationalAverageAttendanceRate(@Param("date") LocalDate date);

    @Query("SELECT AVG(rm.averageComplianceScore) FROM RegionMonitoring rm WHERE rm.monitoringDate = :date AND rm.active = true")
    Double getNationalAverageComplianceScore(@Param("date") LocalDate date);

    @Query("SELECT SUM(rm.totalSchools) FROM RegionMonitoring rm WHERE rm.monitoringDate = :date AND rm.active = true")
    Long getTotalSchoolsNationally(@Param("date") LocalDate date);

    @Query("SELECT SUM(rm.totalTeachers) FROM RegionMonitoring rm WHERE rm.monitoringDate = :date AND rm.active = true")
    Long getTotalTeachersNationally(@Param("date") LocalDate date);

    @Query("SELECT SUM(rm.totalStudents) FROM RegionMonitoring rm WHERE rm.monitoringDate = :date AND rm.active = true")
    Long getTotalStudentsNationally(@Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.monitoringDate = (SELECT MAX(rm2.monitoringDate) FROM RegionMonitoring rm2 WHERE rm2.region.id = rm.region.id AND rm2.active = true) AND rm.active = true")
    List<RegionMonitoring> findLatestMonitoringDataForAllRegions();

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.region.id = :regionId AND rm.monitoringDate = (SELECT MAX(rm2.monitoringDate) FROM RegionMonitoring rm2 WHERE rm2.region.id = :regionId AND rm2.active = true) AND rm.active = true")
    Optional<RegionMonitoring> findLatestMonitoringDataForRegion(@Param("regionId") Long regionId);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.averageComplianceScore >= :threshold AND rm.monitoringDate = :date AND rm.active = true ORDER BY rm.averageComplianceScore DESC")
    List<RegionMonitoring> findTopPerformingRegions(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT rm FROM RegionMonitoring rm WHERE rm.averageComplianceScore < :threshold AND rm.monitoringDate = :date AND rm.active = true ORDER BY rm.averageComplianceScore ASC")
    List<RegionMonitoring> findUnderperformingRegions(@Param("threshold") Double threshold, @Param("date") LocalDate date);
} 