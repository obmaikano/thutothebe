package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumAssessment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumAssessmentRepository extends JpaRepository<CurriculumAssessment, Long> {

    @Query("SELECT MAX(ca.sequenceOrder) FROM CurriculumAssessment ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Integer getMaxSequenceOrderByCurriculumId(@Param("curriculumId") Long curriculumId);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumIdAndCurriculumUnitIdAndCurriculumTopicIdAndIsActive(
            Long curriculumId, Long curriculumUnitId, Long curriculumTopicId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumIdAndCurriculumUnitIdAndIsActive(
            Long curriculumId, Long curriculumUnitId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumIdAndCurriculumTopicIdAndIsActive(
            Long curriculumId, Long curriculumTopicId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumIdAndIsActiveOrderBySequenceOrder(
            Long curriculumId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumUnitIdAndIsActiveOrderBySequenceOrder(
            Long curriculumUnitId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumTopicIdAndIsActiveOrderBySequenceOrder(
            Long curriculumTopicId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByAssessmentPurposeAndIsActive(
            CurriculumAssessment.AssessmentPurpose purpose, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumIdAndIsMandatoryAndIsActive(
            Long curriculumId, boolean isMandatory, boolean isActive);

    Long countByCurriculumIdAndIsActive(Long curriculumId, boolean isActive);

    Long countByCurriculumIdAndIsMandatoryAndIsActive(Long curriculumId, boolean isMandatory, boolean isActive);

    Long countByCurriculumIdAndAssessmentPurposeAndIsActive(
            Long curriculumId, CurriculumAssessment.AssessmentPurpose purpose, boolean isActive);

    @Query("SELECT AVG(ca.weightPercentage) FROM CurriculumAssessment ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Double getAverageWeightByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT SUM(ca.weightPercentage) FROM CurriculumAssessment ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Double getTotalWeightByCurriculumId(@Param("curriculumId") Long curriculumId);

    boolean existsByCurriculumIdAndCurriculumUnitIdAndIsActive(Long curriculumId, Long curriculumUnitId, boolean isActive);

    boolean existsByCurriculumIdAndAssessmentPurposeAndIsActive(
            Long curriculumId, CurriculumAssessment.AssessmentPurpose purpose, boolean isActive);

    boolean existsByCurriculumIdAndAssessmentIdAndIsActive(Long curriculumId, Long assessmentId, boolean isActive);

    @Query("SELECT ca FROM CurriculumAssessment ca WHERE ca.prerequisiteAssessments LIKE %:assessmentId% AND ca.isActive = true")
    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findDependentAssessments(@Param("assessmentId") Long assessmentId);

    @Query("SELECT ca FROM CurriculumAssessment ca WHERE ca.curriculum.id = :curriculumId AND ca.assessmentPurpose = :purpose AND ca.isActive = true ORDER BY ca.sequenceOrder")
    @EntityGraph(attributePaths = {"curriculum", "assessment", "curriculumUnit", "curriculumTopic", "linkedBy"})
    List<CurriculumAssessment> findByCurriculumIdAndAssessmentPurposeOrderBySequenceOrder(
            @Param("curriculumId") Long curriculumId, 
            @Param("purpose") CurriculumAssessment.AssessmentPurpose purpose);

    @Query("SELECT COUNT(ca) FROM CurriculumAssessment ca WHERE ca.curriculum.id = :curriculumId AND ca.assessmentPurpose = :purpose AND ca.isActive = true")
    Long getAssessmentCount(@Param("curriculumId") Long curriculumId, 
                           @Param("purpose") CurriculumAssessment.AssessmentPurpose purpose);

    @Query("SELECT SUM(ca.weightPercentage) FROM CurriculumAssessment ca WHERE ca.curriculum.id = :curriculumId AND ca.isActive = true")
    Double getTotalWeightPercentage(@Param("curriculumId") Long curriculumId);
} 