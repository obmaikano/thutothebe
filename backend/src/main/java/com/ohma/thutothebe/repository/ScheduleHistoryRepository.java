package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.ScheduleHistory;
import com.ohma.thutothebe.entity.ScheduleHistoryAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleHistoryRepository extends JpaRepository<ScheduleHistory, Long> {
    
    // Find history by schedule ID
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.schedule.id = :scheduleId ORDER BY sh.changeTimestamp DESC")
    List<ScheduleHistory> findByScheduleIdOrderByChangeTimestampDesc(@Param("scheduleId") Long scheduleId);
    
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.schedule.id = :scheduleId ORDER BY sh.changeTimestamp DESC")
    Page<ScheduleHistory> findByScheduleId(@Param("scheduleId") Long scheduleId, Pageable pageable);
    
    // Find history by action
    List<ScheduleHistory> findByAction(ScheduleHistoryAction action);
    
    // Find history by user
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.changedBy = :changedBy ORDER BY sh.changeTimestamp DESC")
    List<ScheduleHistory> findByChangedByOrderByChangeTimestampDesc(@Param("changedBy") String changedBy);
    
    // Find history within date range
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.changeTimestamp BETWEEN :startDate AND :endDate ORDER BY sh.changeTimestamp DESC")
    List<ScheduleHistory> findByChangeTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find history by schedule and action
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.schedule.id = :scheduleId AND sh.action = :action ORDER BY sh.changeTimestamp DESC")
    List<ScheduleHistory> findByScheduleIdAndAction(@Param("scheduleId") Long scheduleId, @Param("action") ScheduleHistoryAction action);
    
    // Find history by schedule version
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.schedule.id = :scheduleId AND sh.scheduleVersion = :version")
    List<ScheduleHistory> findByScheduleIdAndVersion(@Param("scheduleId") Long scheduleId, @Param("version") Integer version);
    
    // Find recent changes
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.changeTimestamp >= :since ORDER BY sh.changeTimestamp DESC")
    List<ScheduleHistory> findRecentChanges(@Param("since") LocalDateTime since);
    
    // Find changes by IP address (for security auditing)
    @Query("SELECT sh FROM ScheduleHistory sh WHERE sh.ipAddress = :ipAddress ORDER BY sh.changeTimestamp DESC")
    List<ScheduleHistory> findByIpAddress(@Param("ipAddress") String ipAddress);
} 