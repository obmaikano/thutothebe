package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CourseStatisticsDTO;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

public interface CourseStatisticsService extends BaseService<CourseStatisticsDTO, Long> {
    
    CourseStatisticsDTO getCurrentStatistics(Long courseId);
    
    List<CourseStatisticsDTO> getHistoricalStatistics(Long courseId);
    
    List<CourseStatisticsDTO> getStatisticsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    void updateStatistics(Long courseId);
    
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    void updateAllCourseStatistics();
} 