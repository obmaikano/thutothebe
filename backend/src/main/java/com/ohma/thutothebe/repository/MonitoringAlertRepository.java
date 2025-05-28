package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.MonitoringAlert;
import com.ohma.thutothebe.entity.MonitoringAlertSeverity;
import com.ohma.thutothebe.entity.MonitoringAlertType;
import com.ohma.thutothebe.entity.MonitoringScope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MonitoringAlertRepository extends JpaRepository<MonitoringAlert, Long> {

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.school.id = :schoolId AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findBySchoolId(@Param("schoolId") Long schoolId);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.region.id = :regionId AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findByRegionId(@Param("regionId") Long regionId);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.severity = :severity AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findBySeverity(@Param("severity") MonitoringAlertSeverity severity);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.alertType = :alertType AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findByAlertType(@Param("alertType") MonitoringAlertType alertType);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.scope = :scope AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findByScope(@Param("scope") MonitoringScope scope);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.acknowledged = :acknowledged AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findByAcknowledged(@Param("acknowledged") Boolean acknowledged);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.resolved = :resolved AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findByResolved(@Param("resolved") Boolean resolved);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.createdAt BETWEEN :startDate AND :endDate AND ma.active = true ORDER BY ma.createdAt DESC")
    Page<MonitoringAlert> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.severity = :severity AND ma.acknowledged = false AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findUnacknowledgedBySeverity(@Param("severity") MonitoringAlertSeverity severity);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.severity = :severity AND ma.resolved = false AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findUnresolvedBySeverity(@Param("severity") MonitoringAlertSeverity severity);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.school.id = :schoolId AND ma.severity = :severity AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findBySchoolIdAndSeverity(@Param("schoolId") Long schoolId, @Param("severity") MonitoringAlertSeverity severity);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.region.id = :regionId AND ma.severity = :severity AND ma.active = true ORDER BY ma.createdAt DESC")
    List<MonitoringAlert> findByRegionIdAndSeverity(@Param("regionId") Long regionId, @Param("severity") MonitoringAlertSeverity severity);

    @Query("SELECT COUNT(ma) FROM MonitoringAlert ma WHERE ma.school.id = :schoolId AND ma.acknowledged = false AND ma.active = true")
    Long countUnacknowledgedBySchoolId(@Param("schoolId") Long schoolId);

    @Query("SELECT COUNT(ma) FROM MonitoringAlert ma WHERE ma.region.id = :regionId AND ma.acknowledged = false AND ma.active = true")
    Long countUnacknowledgedByRegionId(@Param("regionId") Long regionId);

    @Query("SELECT COUNT(ma) FROM MonitoringAlert ma WHERE ma.severity = :severity AND ma.acknowledged = false AND ma.active = true")
    Long countUnacknowledgedBySeverity(@Param("severity") MonitoringAlertSeverity severity);

    @Query("SELECT COUNT(ma) FROM MonitoringAlert ma WHERE ma.alertType = :alertType AND ma.createdAt >= :since AND ma.active = true")
    Long countByAlertTypeSince(@Param("alertType") MonitoringAlertType alertType, @Param("since") LocalDateTime since);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.severity IN :severities AND ma.acknowledged = false AND ma.active = true ORDER BY ma.severity DESC, ma.createdAt DESC")
    List<MonitoringAlert> findCriticalUnacknowledgedAlerts(@Param("severities") List<MonitoringAlertSeverity> severities);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.scope = :scope AND ma.acknowledged = false AND ma.active = true ORDER BY ma.severity DESC, ma.createdAt DESC")
    List<MonitoringAlert> findUnacknowledgedByScope(@Param("scope") MonitoringScope scope);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.acknowledgedBy = :userId AND ma.active = true ORDER BY ma.acknowledgedAt DESC")
    List<MonitoringAlert> findAcknowledgedByUser(@Param("userId") Long userId);

    @Query("SELECT ma FROM MonitoringAlert ma WHERE ma.resolvedBy = :userId AND ma.active = true ORDER BY ma.resolvedAt DESC")
    List<MonitoringAlert> findResolvedByUser(@Param("userId") Long userId);
} 