package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.GradeCalculationRuleDTO;
import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;

import java.util.List;
import java.util.Optional;

public interface GradeCalculationRuleService extends BaseService<GradeCalculationRuleDTO, Long> {

    List<GradeCalculationRuleDTO> findByCourseIdAndTerm(Long courseId, Term term);
    
    Optional<GradeCalculationRuleDTO> findByCourseIdAndTermAndGradeType(Long courseId, Term term, GradeType gradeType);
    
    List<GradeCalculationRuleDTO> findByCourseId(Long courseId);
    
    List<GradeCalculationRuleDTO> findByTerm(Term term);
    
    List<GradeCalculationRuleDTO> findByGradeType(GradeType gradeType);
    
    boolean existsByCourseIdAndTerm(Long courseId, Term term);
    
    Double getTotalWeightByCourseIdAndTerm(Long courseId, Term term);
    
    boolean validateWeightPercentages(Long courseId, Term term);
    
    GradeCalculationRuleDTO createRule(Long courseId, GradeType gradeType, Double weightPercentage, 
                                      Double passingGrade, Term term, Integer academicYear, String description);
    
    List<GradeCalculationRuleDTO> createDefaultRulesForCourse(Long courseId, Term term, Integer academicYear);
    
    void deactivateRule(Long ruleId);
    
    void reactivateRule(Long ruleId);
    
    List<GradeCalculationRuleDTO> findActiveRulesByCourseAndTerm(Long courseId, Term term);
} 