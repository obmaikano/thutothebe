package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.SystemUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SystemUsageRepository extends JpaRepository<SystemUsage, Long> {
    
    Optional<SystemUsage> findFirstByOrderByTimestampDesc();

    @Query("SELECT s FROM SystemUsage s WHERE s.timestamp BETWEEN :startDate AND :endDate ORDER BY s.timestamp")
    List<SystemUsage> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM SystemUsage s WHERE s.timestamp BETWEEN :startDate AND :endDate " +
           "AND s.activeUsers = (SELECT MAX(s2.activeUsers) FROM SystemUsage s2 WHERE s2.timestamp BETWEEN :startDate AND :endDate)")
    List<SystemUsage> findPeakUsageByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM SystemUsage s WHERE s.timestamp BETWEEN :startDate AND :endDate " +
           "ORDER BY s.totalLogins DESC")
    List<SystemUsage> findLoginTrendsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
} 