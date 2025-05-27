package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumAssessmentDTO;
import com.ohma.thutothebe.entity.CurriculumAssessment;

import java.util.List;
import java.util.Map;

public interface CurriculumAssessmentService extends BaseService<CurriculumAssessmentDTO, Long> {

    // Assessment Linking
    CurriculumAssessmentDTO linkAssessment(CurriculumAssessmentDTO assessmentData);
    
    void unlinkAssessment(Long curriculumAssessmentId, Long unlinkedById);
    
    List<CurriculumAssessmentDTO> getAssessmentsByCurriculum(Long curriculumId, Long unitId, Long topicId);
    
    List<CurriculumAssessmentDTO> getAssessmentsByUnit(Long unitId);
    
    List<CurriculumAssessmentDTO> getAssessmentsByTopic(Long topicId);
    
    List<CurriculumAssessmentDTO> getAssessmentsByPurpose(CurriculumAssessment.AssessmentPurpose purpose);
    
    // Assessment Sequencing
    CurriculumAssessmentDTO updateSequenceOrder(Long curriculumAssessmentId, Integer newOrder);
    
    List<CurriculumAssessmentDTO> reorderAssessments(Long curriculumId, List<Long> assessmentIds);
    
    List<CurriculumAssessmentDTO> getAssessmentsInSequence(Long curriculumId);
    
    // Assessment Prerequisites
    void addPrerequisite(Long curriculumAssessmentId, Long prerequisiteAssessmentId);
    
    void removePrerequisite(Long curriculumAssessmentId, Long prerequisiteAssessmentId);
    
    List<CurriculumAssessmentDTO> getPrerequisites(Long curriculumAssessmentId);
    
    List<CurriculumAssessmentDTO> getDependentAssessments(Long curriculumAssessmentId);
    
    // Assessment Alignment
    CurriculumAssessmentDTO updateLearningObjectives(Long curriculumAssessmentId, List<String> objectives);
    
    CurriculumAssessmentDTO updateCompetencies(Long curriculumAssessmentId, List<String> competencies);
    
    Double calculateAlignmentScore(Long curriculumAssessmentId);
    
    // Assessment Analytics
    List<CurriculumAssessmentDTO> getMandatoryAssessments(Long curriculumId);
    
    List<CurriculumAssessmentDTO> getOptionalAssessments(Long curriculumId);
    
    Map<String, Object> getAssessmentStatistics(Long curriculumId);
    
    Double calculateTotalWeight(Long curriculumId);
    
    List<CurriculumAssessmentDTO> getAssessmentsWithLowAlignment(Long curriculumId, Double threshold);
    
    Map<String, Object> getAssessmentCoverage(Long curriculumId);
    
    Double getTotalWeightPercentage(Long curriculumId);
    
    Integer getAssessmentCount(Long curriculumId, CurriculumAssessment.AssessmentPurpose purpose);
} 