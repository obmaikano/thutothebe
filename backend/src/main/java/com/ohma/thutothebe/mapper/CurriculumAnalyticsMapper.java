package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumAnalyticsDTO;
import com.ohma.thutothebe.entity.CurriculumAnalytics;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CurriculumAnalyticsMapper implements BaseDtoMapper<CurriculumAnalytics, CurriculumAnalyticsDTO> {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public CurriculumAnalyticsDTO toDto(CurriculumAnalytics entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumAnalyticsDTO(
                entity.getId(),
                entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
                entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
                entity.getSchool() != null ? entity.getSchool().getId() : null,
                entity.getSchool() != null ? entity.getSchool().getName() : null,
                entity.getRegion() != null ? entity.getRegion().getId() : null,
                entity.getRegion() != null ? entity.getRegion().getName() : null,
                entity.getReportDate(),
                entity.getAnalyticsType(),
                entity.getAggregationLevel(),
                entity.getTotalSchools(),
                entity.getSchoolsStarted(),
                entity.getSchoolsCompleted(),
                entity.getOverallProgressPercentage(),
                entity.getTotalTeachers(),
                entity.getTeachersTrained(),
                entity.getTeachersImplementing(),
                entity.getTeacherReadinessScore(),
                entity.getTotalStudents(),
                entity.getStudentsEnrolled(),
                entity.getStudentPerformanceAverage(),
                entity.getCompletionRate(),
                entity.getResourcesAvailable(),
                entity.getResourcesUtilized(),
                entity.getResourceUtilizationRate(),
                entity.getAssessmentsConducted(),
                entity.getAverageAssessmentScore(),
                entity.getAssessmentCompletionRate(),
                entity.getPlannedDurationWeeks(),
                entity.getActualDurationWeeks(),
                entity.getTimeEfficiencyRatio(),
                entity.getQualityScore(),
                entity.getAlignmentScore(),
                entity.getEffectivenessRating(),
                entity.getChallengesIdentified(),
                entity.getIssuesResolved(),
                entity.getRiskLevel(),
                parseJsonToMap(entity.getDetailedMetrics()),
                parseJsonToMap(entity.getTrendData()),
                parseJsonToMap(entity.getComparativeData()),
                entity.getGeneratedBy() != null ? entity.getGeneratedBy().getId() : null,
                entity.getGeneratedBy() != null ? 
                    entity.getGeneratedBy().getFirstName() + " " + entity.getGeneratedBy().getLastName() : null,
                entity.getGeneratedAt(),
                entity.getDataSource(),
                entity.getCalculationMethod(),
                entity.isActive()
        );
    }

    @Override
    public CurriculumAnalytics toEntity(CurriculumAnalyticsDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumAnalytics entity = new CurriculumAnalytics();
        entity.setId(dto.id());
        entity.setReportDate(dto.reportDate());
        entity.setAnalyticsType(dto.analyticsType());
        entity.setAggregationLevel(dto.aggregationLevel());
        entity.setTotalSchools(dto.totalSchools());
        entity.setSchoolsStarted(dto.schoolsStarted());
        entity.setSchoolsCompleted(dto.schoolsCompleted());
        entity.setOverallProgressPercentage(dto.overallProgressPercentage());
        entity.setTotalTeachers(dto.totalTeachers());
        entity.setTeachersTrained(dto.teachersTrained());
        entity.setTeachersImplementing(dto.teachersImplementing());
        entity.setTeacherReadinessScore(dto.teacherReadinessScore());
        entity.setTotalStudents(dto.totalStudents());
        entity.setStudentsEnrolled(dto.studentsEnrolled());
        entity.setStudentPerformanceAverage(dto.studentPerformanceAverage());
        entity.setCompletionRate(dto.completionRate());
        entity.setResourcesAvailable(dto.resourcesAvailable());
        entity.setResourcesUtilized(dto.resourcesUtilized());
        entity.setResourceUtilizationRate(dto.resourceUtilizationRate());
        entity.setAssessmentsConducted(dto.assessmentsConducted());
        entity.setAverageAssessmentScore(dto.averageAssessmentScore());
        entity.setAssessmentCompletionRate(dto.assessmentCompletionRate());
        entity.setPlannedDurationWeeks(dto.plannedDurationWeeks());
        entity.setActualDurationWeeks(dto.actualDurationWeeks());
        entity.setTimeEfficiencyRatio(dto.timeEfficiencyRatio());
        entity.setQualityScore(dto.qualityScore());
        entity.setAlignmentScore(dto.alignmentScore());
        entity.setEffectivenessRating(dto.effectivenessRating());
        entity.setChallengesIdentified(dto.challengesIdentified());
        entity.setIssuesResolved(dto.issuesResolved());
        entity.setRiskLevel(dto.riskLevel());
        entity.setDetailedMetrics(mapToJson(dto.detailedMetrics()));
        entity.setTrendData(mapToJson(dto.trendData()));
        entity.setComparativeData(mapToJson(dto.comparativeData()));
        entity.setGeneratedAt(dto.generatedAt());
        entity.setDataSource(dto.dataSource());
        entity.setCalculationMethod(dto.calculationMethod());
        entity.setActive(dto.isActive());

        return entity;
    }

    public void updateEntity(CurriculumAnalytics entity, CurriculumAnalyticsDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setReportDate(dto.reportDate());
        entity.setAnalyticsType(dto.analyticsType());
        entity.setAggregationLevel(dto.aggregationLevel());
        entity.setTotalSchools(dto.totalSchools());
        entity.setSchoolsStarted(dto.schoolsStarted());
        entity.setSchoolsCompleted(dto.schoolsCompleted());
        entity.setOverallProgressPercentage(dto.overallProgressPercentage());
        entity.setTotalTeachers(dto.totalTeachers());
        entity.setTeachersTrained(dto.teachersTrained());
        entity.setTeachersImplementing(dto.teachersImplementing());
        entity.setTeacherReadinessScore(dto.teacherReadinessScore());
        entity.setTotalStudents(dto.totalStudents());
        entity.setStudentsEnrolled(dto.studentsEnrolled());
        entity.setStudentPerformanceAverage(dto.studentPerformanceAverage());
        entity.setCompletionRate(dto.completionRate());
        entity.setResourcesAvailable(dto.resourcesAvailable());
        entity.setResourcesUtilized(dto.resourcesUtilized());
        entity.setResourceUtilizationRate(dto.resourceUtilizationRate());
        entity.setAssessmentsConducted(dto.assessmentsConducted());
        entity.setAverageAssessmentScore(dto.averageAssessmentScore());
        entity.setAssessmentCompletionRate(dto.assessmentCompletionRate());
        entity.setPlannedDurationWeeks(dto.plannedDurationWeeks());
        entity.setActualDurationWeeks(dto.actualDurationWeeks());
        entity.setTimeEfficiencyRatio(dto.timeEfficiencyRatio());
        entity.setQualityScore(dto.qualityScore());
        entity.setAlignmentScore(dto.alignmentScore());
        entity.setEffectivenessRating(dto.effectivenessRating());
        entity.setChallengesIdentified(dto.challengesIdentified());
        entity.setIssuesResolved(dto.issuesResolved());
        entity.setRiskLevel(dto.riskLevel());
        entity.setDetailedMetrics(mapToJson(dto.detailedMetrics()));
        entity.setTrendData(mapToJson(dto.trendData()));
        entity.setComparativeData(mapToJson(dto.comparativeData()));
        entity.setDataSource(dto.dataSource());
        entity.setCalculationMethod(dto.calculationMethod());
        entity.setActive(dto.isActive());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonToMap(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private String mapToJson(Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
} 