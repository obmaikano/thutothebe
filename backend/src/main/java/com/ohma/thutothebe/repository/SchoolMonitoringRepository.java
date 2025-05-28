package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.SchoolMonitoring;
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
public interface SchoolMonitoringRepository extends JpaRepository<SchoolMonitoring, Long> {

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.id = :schoolId AND sm.monitoringDate = :date AND sm.active = true")
    Optional<SchoolMonitoring> findBySchoolIdAndMonitoringDate(@Param("schoolId") Long schoolId, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.id = :schoolId AND sm.monitoringDate BETWEEN :startDate AND :endDate AND sm.active = true ORDER BY sm.monitoringDate DESC")
    List<SchoolMonitoring> findBySchoolIdAndDateRange(@Param("schoolId") Long schoolId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findByMonitoringDate(@Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.monitoringDate BETWEEN :startDate AND :endDate AND sm.active = true ORDER BY sm.monitoringDate DESC")
    Page<SchoolMonitoring> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findByRegionIdAndDate(@Param("regionId") Long regionId, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.monitoringDate BETWEEN :startDate AND :endDate AND sm.active = true ORDER BY sm.monitoringDate DESC")
    List<SchoolMonitoring> findByRegionIdAndDateRange(@Param("regionId") Long regionId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.attendanceRate < :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithLowAttendance(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.totalLogins < :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithLowUsage(@Param("threshold") Integer threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.averageGradingTurnaroundHours > :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithDelayedGrading(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.complianceScore < :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithLowCompliance(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.totalAlerts > :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithHighAlerts(@Param("threshold") Integer threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.assignmentSubmissionRate < :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithLowSubmissionRate(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.curriculumCompletionRate < :threshold AND sm.monitoringDate = :date AND sm.active = true")
    List<SchoolMonitoring> findSchoolsWithLowCurriculumCompletion(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT AVG(sm.attendanceRate) FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.monitoringDate = :date AND sm.active = true")
    Double getAverageAttendanceRateByRegion(@Param("regionId") Long regionId, @Param("date") LocalDate date);

    @Query("SELECT AVG(sm.complianceScore) FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.monitoringDate = :date AND sm.active = true")
    Double getAverageComplianceScoreByRegion(@Param("regionId") Long regionId, @Param("date") LocalDate date);

    @Query("SELECT AVG(sm.assignmentSubmissionRate) FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.monitoringDate = :date AND sm.active = true")
    Double getAverageSubmissionRateByRegion(@Param("regionId") Long regionId, @Param("date") LocalDate date);

    @Query("SELECT AVG(sm.curriculumCompletionRate) FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.monitoringDate = :date AND sm.active = true")
    Double getAverageCurriculumCompletionByRegion(@Param("regionId") Long regionId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(sm) FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.totalLogins < :threshold AND sm.monitoringDate = :date AND sm.active = true")
    Long countSchoolsWithLowUsageInRegion(@Param("regionId") Long regionId, @Param("threshold") Integer threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.id = :schoolId AND sm.monitoringDate = (SELECT MAX(sm2.monitoringDate) FROM SchoolMonitoring sm2 WHERE sm2.school.id = :schoolId AND sm2.active = true) AND sm.active = true")
    Optional<SchoolMonitoring> findLatestMonitoringDataForSchool(@Param("schoolId") Long schoolId);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.monitoringDate = (SELECT MAX(sm2.monitoringDate) FROM SchoolMonitoring sm2 WHERE sm2.school.id = sm.school.id AND sm2.active = true) AND sm.active = true")
    List<SchoolMonitoring> findLatestMonitoringDataForAllSchools();

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.complianceScore >= :threshold AND sm.monitoringDate = :date AND sm.active = true ORDER BY sm.complianceScore DESC")
    List<SchoolMonitoring> findTopPerformingSchools(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.complianceScore < :threshold AND sm.monitoringDate = :date AND sm.active = true ORDER BY sm.complianceScore ASC")
    List<SchoolMonitoring> findUnderperformingSchools(@Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.complianceScore >= :threshold AND sm.monitoringDate = :date AND sm.active = true ORDER BY sm.complianceScore DESC")
    List<SchoolMonitoring> findTopPerformingSchoolsInRegion(@Param("regionId") Long regionId, @Param("threshold") Double threshold, @Param("date") LocalDate date);

    @Query("SELECT sm FROM SchoolMonitoring sm WHERE sm.school.region.id = :regionId AND sm.complianceScore < :threshold AND sm.monitoringDate = :date AND sm.active = true ORDER BY sm.complianceScore ASC")
    List<SchoolMonitoring> findUnderperformingSchoolsInRegion(@Param("regionId") Long regionId, @Param("threshold") Double threshold, @Param("date") LocalDate date);
} 