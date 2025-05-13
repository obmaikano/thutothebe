package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.SystemUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SystemUsageRepository extends JpaRepository<SystemUsage, Long> {
    
    Optional<SystemUsage> findFirstByOrderByTimestampDesc();
    
    @Query("SELECT su FROM SystemUsage su WHERE su.timestamp >= :startDate AND su.timestamp <= :endDate ORDER BY su.timestamp DESC")
    List<SystemUsage> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT su FROM SystemUsage su WHERE su.timestamp >= :startDate AND su.timestamp <= :endDate ORDER BY su.activeUsers DESC")
    List<SystemUsage> findPeakUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT su FROM SystemUsage su WHERE su.timestamp >= :startDate AND su.timestamp <= :endDate ORDER BY su.totalLogins DESC")
    List<SystemUsage> findLoginTrendsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
} 