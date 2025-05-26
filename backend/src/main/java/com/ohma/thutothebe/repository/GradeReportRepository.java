package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.GradeReport;
import com.ohma.thutothebe.entity.GradeReportType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradeReportRepository extends JpaRepository<GradeReport, Long> {

    @Query("SELECT gr FROM GradeReport gr WHERE gr.generatedBy.id = :userId ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByGeneratedByIdOrderByGeneratedAtDesc(@Param("userId") Long userId);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.course.id = :courseId ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByCourseIdOrderByGeneratedAtDesc(@Param("courseId") Long courseId);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.term = :term ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByTermOrderByGeneratedAtDesc(@Param("term") Term term);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.reportType = :reportType ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByReportTypeOrderByGeneratedAtDesc(@Param("reportType") GradeReportType reportType);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.course.id = :courseId AND gr.term = :term ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByCourseIdAndTermOrderByGeneratedAtDesc(@Param("courseId") Long courseId, @Param("term") Term term);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.course.id = :courseId AND gr.term = :term AND gr.reportType = :reportType ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByCourseIdAndTermAndReportTypeOrderByGeneratedAtDesc(
            @Param("courseId") Long courseId, 
            @Param("term") Term term, 
            @Param("reportType") GradeReportType reportType);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.generatedAt BETWEEN :startDate AND :endDate ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByGeneratedAtBetweenOrderByGeneratedAtDesc(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.generatedBy.id = :userId AND gr.course.id = :courseId ORDER BY gr.generatedAt DESC")
    List<GradeReport> findByGeneratedByIdAndCourseIdOrderByGeneratedAtDesc(
            @Param("userId") Long userId, 
            @Param("courseId") Long courseId);

    @Query("SELECT COUNT(gr) FROM GradeReport gr WHERE gr.generatedBy.id = :userId AND gr.generatedAt >= :startDate")
    Long countByGeneratedByIdAndGeneratedAtAfter(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT gr FROM GradeReport gr WHERE gr.filePath LIKE %:fileName%")
    Optional<GradeReport> findByFileName(@Param("fileName") String fileName);
} 