package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.UserActivityLog;
import com.ohma.thutothebe.entity.UserActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.user.id = :userId ORDER BY ual.activityTimestamp DESC")
    Page<UserActivityLog> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId ORDER BY ual.activityTimestamp DESC")
    Page<UserActivityLog> findBySchoolId(@Param("schoolId") Long schoolId, Pageable pageable);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.user.region.id = :regionId ORDER BY ual.activityTimestamp DESC")
    Page<UserActivityLog> findByRegionId(@Param("regionId") Long regionId, Pageable pageable);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.activityType = :activityType ORDER BY ual.activityTimestamp DESC")
    Page<UserActivityLog> findByActivityType(@Param("activityType") UserActivityType activityType, Pageable pageable);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.activityTimestamp BETWEEN :startDate AND :endDate ORDER BY ual.activityTimestamp DESC")
    List<UserActivityLog> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.user.id = :userId AND ual.activityTimestamp BETWEEN :startDate AND :endDate ORDER BY ual.activityTimestamp DESC")
    List<UserActivityLog> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityTimestamp BETWEEN :startDate AND :endDate ORDER BY ual.activityTimestamp DESC")
    List<UserActivityLog> findBySchoolIdAndDateRange(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ual FROM UserActivityLog ual WHERE ual.user.region.id = :regionId AND ual.activityTimestamp BETWEEN :startDate AND :endDate ORDER BY ual.activityTimestamp DESC")
    List<UserActivityLog> findByRegionIdAndDateRange(@Param("regionId") Long regionId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(DISTINCT ual.user.id) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityTimestamp BETWEEN :startDate AND :endDate")
    Long countActiveUsersBySchool(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(DISTINCT ual.user.id) FROM UserActivityLog ual WHERE ual.user.region.id = :regionId AND ual.activityTimestamp BETWEEN :startDate AND :endDate")
    Long countActiveUsersByRegion(@Param("regionId") Long regionId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(ual) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityType = :activityType AND ual.activityTimestamp BETWEEN :startDate AND :endDate")
    Long countActivityBySchoolAndType(@Param("schoolId") Long schoolId, @Param("activityType") UserActivityType activityType, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(ual) FROM UserActivityLog ual WHERE ual.user.region.id = :regionId AND ual.activityType = :activityType AND ual.activityTimestamp BETWEEN :startDate AND :endDate")
    Long countActivityByRegionAndType(@Param("regionId") Long regionId, @Param("activityType") UserActivityType activityType, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ual.activityType, COUNT(ual) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityTimestamp BETWEEN :startDate AND :endDate GROUP BY ual.activityType ORDER BY COUNT(ual) DESC")
    List<Object[]> getActivityStatisticsBySchool(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ual.activityType, COUNT(ual) FROM UserActivityLog ual WHERE ual.user.region.id = :regionId AND ual.activityTimestamp BETWEEN :startDate AND :endDate GROUP BY ual.activityType ORDER BY COUNT(ual) DESC")
    List<Object[]> getActivityStatisticsByRegion(@Param("regionId") Long regionId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT HOUR(ual.activityTimestamp), COUNT(ual) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityTimestamp BETWEEN :startDate AND :endDate GROUP BY HOUR(ual.activityTimestamp) ORDER BY COUNT(ual) DESC")
    List<Object[]> getPeakUsageHoursBySchool(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ual.moduleName, COUNT(ual) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityTimestamp BETWEEN :startDate AND :endDate AND ual.moduleName IS NOT NULL GROUP BY ual.moduleName ORDER BY COUNT(ual) DESC")
    List<Object[]> getModuleUsageStatisticsBySchool(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(ual.durationMinutes) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.activityTimestamp BETWEEN :startDate AND :endDate AND ual.durationMinutes IS NOT NULL")
    Double getAverageSessionDurationBySchool(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(ual) FROM UserActivityLog ual WHERE ual.user.school.id = :schoolId AND ual.success = false AND ual.activityTimestamp BETWEEN :startDate AND :endDate")
    Long countFailedActivitiesBySchool(@Param("schoolId") Long schoolId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
} 