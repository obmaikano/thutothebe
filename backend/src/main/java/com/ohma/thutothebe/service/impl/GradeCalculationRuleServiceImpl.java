package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.GradeCalculationRuleDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.GradeCalculationRule;
import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.GradeCalculationRuleMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.GradeCalculationRuleRepository;
import com.ohma.thutothebe.service.GradeCalculationRuleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class GradeCalculationRuleServiceImpl extends BaseServiceImpl<GradeCalculationRule, GradeCalculationRuleDTO, Long> 
        implements GradeCalculationRuleService {

    @Autowired
    private GradeCalculationRuleRepository ruleRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private GradeCalculationRuleMapper ruleMapper;

    public GradeCalculationRuleServiceImpl(GradeCalculationRuleRepository ruleRepository) {
        super(ruleRepository);
        this.ruleRepository = ruleRepository;
    }

    @Override
    protected GradeCalculationRule mapToEntity(GradeCalculationRuleDTO dto) {
        return ruleMapper.toEntity(dto);
    }

    @Override
    protected GradeCalculationRuleDTO mapToDto(GradeCalculationRule entity) {
        return ruleMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(GradeCalculationRule entity, GradeCalculationRuleDTO dto) {
        entity.setGradeType(dto.gradeType());
        entity.setWeightPercentage(dto.weightPercentage());
        entity.setPassingGrade(dto.passingGrade());
        entity.setDescription(dto.description());
        entity.setActive(dto.active());
        entity.setTerm(dto.term());
        entity.setAcademicYear(dto.academicYear());
        entity.setModifiedAt(LocalDateTime.now());
    }

    @Override
    public GradeCalculationRuleDTO create(GradeCalculationRuleDTO dto) {
        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.courseId()));

        GradeCalculationRule rule = ruleMapper.toEntityWithReferences(dto, course);
        beforeCreate(rule);
        GradeCalculationRule savedRule = ruleRepository.save(rule);
        
        log.info("Created grade calculation rule with id: {} for course: {}", savedRule.getId(), course.getId());
        return ruleMapper.toDto(savedRule);
    }

    @Override
    public List<GradeCalculationRuleDTO> findByCourseIdAndTerm(Long courseId, Term term) {
        return ruleRepository.findByCourseIdAndTerm(courseId, term)
                .stream()
                .map(ruleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<GradeCalculationRuleDTO> findByCourseIdAndTermAndGradeType(Long courseId, Term term, GradeType gradeType) {
        return ruleRepository.findByCourseIdAndTermAndGradeType(courseId, term, gradeType)
                .map(ruleMapper::toDto);
    }

    @Override
    public List<GradeCalculationRuleDTO> findByCourseId(Long courseId) {
        return ruleRepository.findByCourseId(courseId)
                .stream()
                .map(ruleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeCalculationRuleDTO> findByTerm(Term term) {
        return ruleRepository.findByTerm(term)
                .stream()
                .map(ruleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeCalculationRuleDTO> findByGradeType(GradeType gradeType) {
        return ruleRepository.findByGradeType(gradeType)
                .stream()
                .map(ruleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByCourseIdAndTerm(Long courseId, Term term) {
        return ruleRepository.existsByCourseIdAndTerm(courseId, term);
    }

    @Override
    public Double getTotalWeightByCourseIdAndTerm(Long courseId, Term term) {
        return ruleRepository.getTotalWeightByCourseIdAndTerm(courseId, term);
    }

    @Override
    public boolean validateWeightPercentages(Long courseId, Term term) {
        Double totalWeight = getTotalWeightByCourseIdAndTerm(courseId, term);
        return totalWeight != null && Math.abs(totalWeight - 100.0) < 0.01;
    }

    @Override
    public GradeCalculationRuleDTO createRule(Long courseId, GradeType gradeType, Double weightPercentage, 
                                            Double passingGrade, Term term, Integer academicYear, String description) {
        GradeCalculationRuleDTO dto = new GradeCalculationRuleDTO(
                null, courseId, gradeType, weightPercentage, passingGrade, 
                description, true, term, academicYear, null, null
        );
        return create(dto);
    }

    @Override
    public List<GradeCalculationRuleDTO> createDefaultRulesForCourse(Long courseId, Term term, Integer academicYear) {
        // Create default Botswana education system rules: 40% continuous assessment, 60% final exam
        List<GradeCalculationRuleDTO> defaultRules = Arrays.asList(
                new GradeCalculationRuleDTO(
                        null, courseId, GradeType.CONTINUOUS, 40.0, 50.0,
                        "Continuous assessment including assignments, quizzes, and class participation",
                        true, term, academicYear, null, null
                ),
                new GradeCalculationRuleDTO(
                        null, courseId, GradeType.FINAL, 60.0, 50.0,
                        "Final examination",
                        true, term, academicYear, null, null
                )
        );

        return defaultRules.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Override
    public void deactivateRule(Long ruleId) {
        GradeCalculationRule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade calculation rule not found with id: " + ruleId));
        
        rule.setActive(false);
        rule.setModifiedAt(LocalDateTime.now());
        ruleRepository.save(rule);
        
        log.info("Deactivated grade calculation rule with id: {}", ruleId);
    }

    @Override
    public void reactivateRule(Long ruleId) {
        GradeCalculationRule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade calculation rule not found with id: " + ruleId));
        
        rule.setActive(true);
        rule.setModifiedAt(LocalDateTime.now());
        ruleRepository.save(rule);
        
        log.info("Reactivated grade calculation rule with id: {}", ruleId);
    }

    @Override
    public List<GradeCalculationRuleDTO> findActiveRulesByCourseAndTerm(Long courseId, Term term) {
        return ruleRepository.findByCourseIdAndTerm(courseId, term)
                .stream()
                .filter(GradeCalculationRule::isActive)
                .map(ruleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    protected Long extractSchoolId(GradeCalculationRule entity) {
        return entity.getCourse() != null && entity.getCourse().getClassEntity() != null && entity.getCourse().getClassEntity().getSchool() != null 
            ? entity.getCourse().getClassEntity().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(GradeCalculationRule entity) {
        return entity.getCourse() != null && entity.getCourse().getClassEntity() != null && entity.getCourse().getClassEntity().getSchool() != null && entity.getCourse().getClassEntity().getSchool().getRegion() != null 
            ? entity.getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }
} 