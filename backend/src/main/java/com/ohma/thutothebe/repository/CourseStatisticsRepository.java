package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CourseStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface CourseStatisticsRepository extends JpaRepository<CourseStatistics, Long> {
    
    Optional<CourseStatistics> findByCourseId(Long courseId);
    
    @Query("SELECT cs FROM CourseStatistics cs WHERE cs.course.id = :courseId ORDER BY cs.lastUpdated DESC")
    List<CourseStatistics> findHistoricalByCourseId(Long courseId);
    
    @Query("SELECT cs FROM CourseStatistics cs WHERE cs.lastUpdated >= :startDate AND cs.lastUpdated <= :endDate")
    List<CourseStatistics> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
} 