package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.StudentPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentPerformanceRepository extends JpaRepository<StudentPerformance, Long> {
    
    Optional<StudentPerformance> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    @Query("SELECT sp FROM StudentPerformance sp WHERE sp.student.id = :studentId ORDER BY sp.lastUpdated DESC")
    List<StudentPerformance> findByStudentId(Long studentId);
    
    @Query("SELECT sp FROM StudentPerformance sp WHERE sp.course.id = :courseId ORDER BY sp.averageGrade DESC")
    List<StudentPerformance> findByCourseId(Long courseId);
    
    @Query("SELECT sp FROM StudentPerformance sp WHERE sp.lastUpdated >= :startDate AND sp.lastUpdated <= :endDate")
    List<StudentPerformance> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
} 