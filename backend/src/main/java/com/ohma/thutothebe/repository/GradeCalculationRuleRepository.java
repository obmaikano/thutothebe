package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.GradeCalculationRule;
import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeCalculationRuleRepository extends JpaRepository<GradeCalculationRule, Long> {

    @Query("SELECT gcr FROM GradeCalculationRule gcr WHERE gcr.course.id = :courseId AND gcr.term = :term")
    List<GradeCalculationRule> findByCourseIdAndTerm(@Param("courseId") Long courseId, @Param("term") Term term);

    @Query("SELECT gcr FROM GradeCalculationRule gcr WHERE gcr.course.id = :courseId AND gcr.term = :term AND gcr.gradeType = :gradeType")
    Optional<GradeCalculationRule> findByCourseIdAndTermAndGradeType(
            @Param("courseId") Long courseId, 
            @Param("term") Term term, 
            @Param("gradeType") GradeType gradeType);

    @Query("SELECT gcr FROM GradeCalculationRule gcr WHERE gcr.course.id = :courseId")
    List<GradeCalculationRule> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT gcr FROM GradeCalculationRule gcr WHERE gcr.term = :term")
    List<GradeCalculationRule> findByTerm(@Param("term") Term term);

    @Query("SELECT gcr FROM GradeCalculationRule gcr WHERE gcr.gradeType = :gradeType")
    List<GradeCalculationRule> findByGradeType(@Param("gradeType") GradeType gradeType);

    @Query("SELECT CASE WHEN COUNT(gcr) > 0 THEN true ELSE false END FROM GradeCalculationRule gcr WHERE gcr.course.id = :courseId AND gcr.term = :term")
    boolean existsByCourseIdAndTerm(@Param("courseId") Long courseId, @Param("term") Term term);

    @Query("SELECT SUM(gcr.weightPercentage) FROM GradeCalculationRule gcr WHERE gcr.course.id = :courseId AND gcr.term = :term")
    Double getTotalWeightByCourseIdAndTerm(@Param("courseId") Long courseId, @Param("term") Term term);
} 