package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.SystemUsageDTO;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

public interface SystemUsageService extends BaseService<SystemUsageDTO, Long> {
    
    SystemUsageDTO getCurrentUsage();
    
    List<SystemUsageDTO> getUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<SystemUsageDTO> getPeakUsageByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<SystemUsageDTO> getLoginTrendsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    void updateSystemUsage();
    
    @Scheduled(cron = "0 */15 * * * *") // Run every 15 minutes
    void updateSystemUsageScheduled();
} 