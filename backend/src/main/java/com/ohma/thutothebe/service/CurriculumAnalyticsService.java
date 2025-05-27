package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumAnalyticsDTO;
import com.ohma.thutothebe.entity.CurriculumAnalytics;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CurriculumAnalyticsService extends BaseService<CurriculumAnalyticsDTO, Long> {

    // Analytics Generation
    CurriculumAnalyticsDTO generateImplementationProgressAnalytics(Long curriculumId, CurriculumAnalytics.AggregationLevel level, Long generatedById);
    
    CurriculumAnalyticsDTO generatePerformanceAnalytics(Long curriculumId, Long schoolId, Long regionId, Long generatedById);
    
    CurriculumAnalyticsDTO generateResourceUtilizationAnalytics(Long curriculumId, CurriculumAnalytics.AggregationLevel level, Long generatedById);
    
    CurriculumAnalyticsDTO generateTeacherEffectivenessAnalytics(Long curriculumId, Long schoolId, Long generatedById);
    
    CurriculumAnalyticsDTO generateStudentOutcomesAnalytics(Long curriculumId, CurriculumAnalytics.AggregationLevel level, Long generatedById);
    
    // Comparative Analytics
    List<CurriculumAnalyticsDTO> generateComparativeAnalytics(List<Long> curriculumIds, CurriculumAnalytics.AggregationLevel level, Long generatedById);
    
    CurriculumAnalyticsDTO generateTrendAnalytics(Long curriculumId, LocalDate startDate, LocalDate endDate, Long generatedById);
    
    // Real-time Analytics
    Map<String, Object> getRealTimeProgress(Long curriculumId, Long schoolId);
    
    Map<String, Object> getRealTimePerformanceMetrics(Long curriculumId);
    
    Map<String, Object> getLiveImplementationStatus(Long curriculumId, Long regionId);
    
    // Dashboard Analytics
    Map<String, Object> getDashboardMetrics(Long curriculumId, CurriculumAnalytics.AggregationLevel level);
    
    Map<String, Object> getExecutiveSummary(Long curriculumId, Long regionId);
    
    Map<String, Object> getTeacherDashboard(Long curriculumId, Long teacherId);
    
    Map<String, Object> getSchoolDashboard(Long curriculumId, Long schoolId);
    
    // Progress Tracking
    Double calculateOverallProgress(Long curriculumId, Long schoolId);
    
    Map<String, Double> calculateProgressByUnit(Long curriculumId, Long schoolId);
    
    Map<String, Double> calculateProgressByTopic(Long curriculumId, Long schoolId);
    
    List<Map<String, Object>> getProgressTimeline(Long curriculumId, Long schoolId);
    
    // Performance Analytics
    Double calculateAveragePerformance(Long curriculumId, CurriculumAnalytics.AggregationLevel level);
    
    Map<String, Double> getPerformanceBySubject(Long curriculumId, Long schoolId);
    
    Map<String, Double> getPerformanceByGradeLevel(Long curriculumId);
    
    List<Map<String, Object>> getPerformanceTrends(Long curriculumId, LocalDate startDate, LocalDate endDate);
    
    // Resource Analytics
    Double calculateResourceUtilizationRate(Long curriculumId, Long schoolId);
    
    Map<String, Integer> getResourceUsageStatistics(Long curriculumId);
    
    List<Map<String, Object>> getMostUsedResources(Long curriculumId, int limit);
    
    List<Map<String, Object>> getUnderutilizedResources(Long curriculumId);
    
    // Teacher Analytics
    Double calculateTeacherReadinessScore(Long curriculumId, Long schoolId);
    
    Map<String, Object> getTeacherTrainingProgress(Long curriculumId);
    
    Map<String, Double> getTeacherEffectivenessScores(Long curriculumId, Long schoolId);
    
    // Student Analytics
    Map<String, Object> getStudentEngagementMetrics(Long curriculumId, Long schoolId);
    
    Double calculateCompletionRate(Long curriculumId, Long schoolId);
    
    Map<String, Double> getStudentPerformanceDistribution(Long curriculumId);
    
    // Risk and Quality Analytics
    String assessImplementationRisk(Long curriculumId, Long schoolId);
    
    Double calculateQualityScore(Long curriculumId, Long schoolId);
    
    Double calculateAlignmentScore(Long curriculumId);
    
    List<Map<String, Object>> identifyImplementationChallenges(Long curriculumId);
    
    // Predictive Analytics
    Map<String, Object> predictCompletionDate(Long curriculumId, Long schoolId);
    
    Map<String, Object> predictPerformanceOutcomes(Long curriculumId, Long schoolId);
    
    List<String> generateRecommendations(Long curriculumId, Long schoolId);
    
    // Export and Reporting
    String generateAnalyticsReport(Long analyticsId, String format); // PDF, Excel, JSON
    
    byte[] exportAnalyticsData(Long curriculumId, CurriculumAnalytics.AnalyticsType type, String format);
    
    // Scheduled Analytics
    void scheduleAnalyticsGeneration(Long curriculumId, CurriculumAnalytics.AnalyticsType type, String frequency);
    
    List<CurriculumAnalyticsDTO> getScheduledAnalytics(Long curriculumId);
    
    // Historical Analytics
    List<CurriculumAnalyticsDTO> getHistoricalAnalytics(Long curriculumId, CurriculumAnalytics.AnalyticsType type, LocalDate startDate, LocalDate endDate);
    
    Map<String, Object> getAnalyticsTrends(Long curriculumId, String metric, LocalDate startDate, LocalDate endDate);
} 