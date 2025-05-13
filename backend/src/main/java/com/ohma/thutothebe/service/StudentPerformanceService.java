package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.StudentPerformanceDTO;
import com.ohma.thutothebe.entity.StudentPerformance;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

public interface StudentPerformanceService extends BaseService<StudentPerformance, Long> {
    
    StudentPerformanceDTO getStudentPerformance(Long studentId, Long courseId);
    
    List<StudentPerformanceDTO> getStudentPerformanceHistory(Long studentId);
    
    List<StudentPerformanceDTO> getCoursePerformance(Long courseId);
    
    List<StudentPerformanceDTO> getPerformanceByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    void updateStudentPerformance(Long studentId, Long courseId);
    
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    void updateAllStudentPerformance();
} 