package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumAnalytics;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumAnalyticsRepository extends JpaRepository<CurriculumAnalytics, Long> {

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    Optional<CurriculumAnalytics> findTopByCurriculumIdOrderByGeneratedAtDesc(Long curriculumId);

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByCurriculumIdAndAggregationLevelOrderByGeneratedAtDesc(
            Long curriculumId, CurriculumAnalytics.AggregationLevel aggregationLevel);

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByCurriculumIdAndGeneratedAtAfterOrderByGeneratedAtAsc(
            Long curriculumId, LocalDateTime startDate);

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByCurriculumIdAndGeneratedAtBetweenOrderByGeneratedAtDesc(
            Long curriculumId, LocalDateTime startDate, LocalDateTime endDate);

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByCurriculumIdAndAnalyticsTypeOrderByGeneratedAtDesc(
            Long curriculumId, CurriculumAnalytics.AnalyticsType analyticsType);

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findBySchoolIdAndCurriculumIdOrderByGeneratedAtDesc(
            Long schoolId, Long curriculumId);

    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByRegionIdAndCurriculumIdOrderByGeneratedAtDesc(
            Long regionId, Long curriculumId);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.reportDate BETWEEN :startDate AND :endDate ORDER BY ca.reportDate DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByCurriculumIdAndReportDateBetween(
            @Param("curriculumId") Long curriculumId, 
            @Param("startDate") LocalDate startDate, 
            @Param("endDate") LocalDate endDate);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.aggregationLevel = :level AND ca.isActive = true ORDER BY ca.qualityScore DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findBenchmarkData(@Param("level") CurriculumAnalytics.AggregationLevel level);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.analyticsType = :type AND ca.isActive = true ORDER BY ca.generatedAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByCurriculumIdAndType(
            @Param("curriculumId") Long curriculumId, 
            @Param("type") CurriculumAnalytics.AnalyticsType type);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.school.id = :schoolId AND ca.isActive = true ORDER BY ca.generatedAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findBySchoolId(@Param("schoolId") Long schoolId);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.region.id = :regionId AND ca.isActive = true ORDER BY ca.generatedAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findByRegionId(@Param("regionId") Long regionId);

    @Query("SELECT AVG(ca.overallProgressPercentage) FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Double getAverageProgressByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT AVG(ca.completionRate) FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Double getAverageCompletionRateByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT AVG(ca.qualityScore) FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Double getAverageQualityScoreByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT COUNT(ca) FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Long countByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.riskLevel = 'HIGH' AND ca.isActive = true ORDER BY ca.generatedAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findHighRiskAnalyticsByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.overallProgressPercentage < :threshold AND ca.isActive = true ORDER BY ca.overallProgressPercentage ASC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findLowProgressAnalytics(
            @Param("curriculumId") Long curriculumId, 
            @Param("threshold") Double threshold);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.qualityScore >= :minScore AND ca.isActive = true ORDER BY ca.qualityScore DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findHighQualityAnalytics(
            @Param("curriculumId") Long curriculumId, 
            @Param("minScore") Double minScore);

    @Query("SELECT DISTINCT ca.analyticsType FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    List<CurriculumAnalytics.AnalyticsType> findDistinctAnalyticsTypesByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.generatedAt >= :since AND ca.isActive = true ORDER BY ca.generatedAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findRecentAnalytics(@Param("since") LocalDateTime since);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id IN :curriculumIds AND ca.aggregationLevel = :level AND ca.isActive = true ORDER BY ca.generatedAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findComparativeAnalytics(
            @Param("curriculumIds") List<Long> curriculumIds, 
            @Param("level") CurriculumAnalytics.AggregationLevel level);

    @Query("SELECT ca FROM CurriculumAnalytics ca WHERE ca.curriculum.id = :curriculumId AND ca.reportDate = (SELECT MAX(ca2.reportDate) FROM CurriculumAnalytics ca2 WHERE ca2.curriculum.id = :curriculumId AND ca2.isActive = true) AND ca.isActive = true")
    @EntityGraph(attributePaths = {"curriculum", "school", "region", "generatedBy"})
    List<CurriculumAnalytics> findLatestAnalyticsByCurriculumId(@Param("curriculumId") Long curriculumId);
} 