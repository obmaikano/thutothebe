package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumAssessmentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.CurriculumAssessmentMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumAssessmentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumAssessmentServiceImpl extends BaseServiceImpl<CurriculumAssessment, CurriculumAssessmentDTO, Long> implements CurriculumAssessmentService {

    private static final String ASSESSMENT_CACHE = "curriculumAssessments";
    private static final String ALIGNMENT_CACHE = "assessmentAlignment";
    private static final int MAX_PREREQUISITES = 10;
    private static final double MIN_ALIGNMENT_SCORE = 0.7;

    private final CurriculumAssessmentRepository curriculumAssessmentRepository;
    private final CurriculumRepository curriculumRepository;
    private final CurriculumUnitRepository curriculumUnitRepository;
    private final CurriculumTopicRepository curriculumTopicRepository;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final CurriculumAssessmentMapper curriculumAssessmentMapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public CurriculumAssessmentServiceImpl(
            CurriculumAssessmentRepository curriculumAssessmentRepository,
            CurriculumRepository curriculumRepository,
            CurriculumUnitRepository curriculumUnitRepository,
            CurriculumTopicRepository curriculumTopicRepository,
            AssessmentRepository assessmentRepository,
            UserRepository userRepository,
            CurriculumAssessmentMapper curriculumAssessmentMapper,
            ObjectMapper objectMapper) {
        super(curriculumAssessmentRepository);
        this.curriculumAssessmentRepository = curriculumAssessmentRepository;
        this.curriculumRepository = curriculumRepository;
        this.curriculumUnitRepository = curriculumUnitRepository;
        this.curriculumTopicRepository = curriculumTopicRepository;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
        this.curriculumAssessmentMapper = curriculumAssessmentMapper;
        this.objectMapper = objectMapper;
    }

    // ==================== ABSTRACT METHOD IMPLEMENTATIONS ====================

    @Override
    protected CurriculumAssessment mapToEntity(CurriculumAssessmentDTO dto) {
        return curriculumAssessmentMapper.toEntity(dto);
    }

    @Override
    protected CurriculumAssessmentDTO mapToDto(CurriculumAssessment entity) {
        return curriculumAssessmentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumAssessment entity, CurriculumAssessmentDTO dto) {
        curriculumAssessmentMapper.updateEntity(entity, dto);
    }

    // ==================== ASSESSMENT LINKING METHODS ====================

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = {ASSESSMENT_CACHE, ALIGNMENT_CACHE}, allEntries = true)
    public CurriculumAssessmentDTO linkAssessment(@NotNull CurriculumAssessmentDTO assessmentData) {
        log.info("Linking assessment {} to curriculum {}", assessmentData.assessmentId(), assessmentData.curriculumId());
        
        try {
            validateAssessmentLinking(assessmentData);
            
            Curriculum curriculum = curriculumRepository.findById(assessmentData.curriculumId())
                    .orElseThrow(() -> new IllegalArgumentException("Curriculum not found with ID: " + assessmentData.curriculumId()));
            
            Assessment assessment = assessmentRepository.findById(assessmentData.assessmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentData.assessmentId()));
            
            User linkedBy = userRepository.findById(assessmentData.linkedById())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + assessmentData.linkedById()));

            CurriculumAssessment curriculumAssessment = createCurriculumAssessment(assessmentData, curriculum, assessment, linkedBy);
            
            // Set unit and topic if provided
            if (assessmentData.curriculumUnitId() != null) {
                CurriculumUnit unit = curriculumUnitRepository.findById(assessmentData.curriculumUnitId())
                        .orElseThrow(() -> new IllegalArgumentException("Unit not found with ID: " + assessmentData.curriculumUnitId()));
                curriculumAssessment.setCurriculumUnit(unit);
            }
            
            if (assessmentData.curriculumTopicId() != null) {
                CurriculumTopic topic = curriculumTopicRepository.findById(assessmentData.curriculumTopicId())
                        .orElseThrow(() -> new IllegalArgumentException("Topic not found with ID: " + assessmentData.curriculumTopicId()));
                curriculumAssessment.setCurriculumTopic(topic);
            }

            // Auto-assign sequence order if not provided
            if (curriculumAssessment.getSequenceOrder() == null) {
                Integer maxOrder = curriculumAssessmentRepository.getMaxSequenceOrderByCurriculumId(assessmentData.curriculumId());
                curriculumAssessment.setSequenceOrder(maxOrder != null ? maxOrder + 1 : 1);
            }

            CurriculumAssessment savedAssessment = curriculumAssessmentRepository.save(curriculumAssessment);
            log.info("Assessment linked successfully with ID: {}", savedAssessment.getId());
            
            return curriculumAssessmentMapper.toDto(savedAssessment);
            
        } catch (Exception e) {
            log.error("Error linking assessment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to link assessment", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {ASSESSMENT_CACHE, ALIGNMENT_CACHE}, allEntries = true)
    public void unlinkAssessment(@NotNull @Positive Long curriculumAssessmentId, @NotNull @Positive Long unlinkedById) {
        log.info("Unlinking curriculum assessment ID: {} by user ID: {}", curriculumAssessmentId, unlinkedById);
        
        CurriculumAssessment curriculumAssessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum assessment not found with ID: " + curriculumAssessmentId));
        
        // Check if assessment has dependents
        List<CurriculumAssessment> dependents = getDependentAssessmentsInternal(curriculumAssessmentId);
        if (!dependents.isEmpty()) {
            throw new IllegalStateException("Cannot unlink assessment with dependent assessments. Remove dependencies first.");
        }
        
        // Soft delete by setting active to false
        curriculumAssessment.setActive(false);
        curriculumAssessmentRepository.save(curriculumAssessment);
        
        log.info("Assessment unlinked successfully");
    }

    // ==================== ASSESSMENT RETRIEVAL METHODS ====================

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = ASSESSMENT_CACHE, key = "#curriculumId + '_' + #unitId + '_' + #topicId")
    public List<CurriculumAssessmentDTO> getAssessmentsByCurriculum(@NotNull @Positive Long curriculumId, 
            Long unitId, Long topicId) {
        log.debug("Retrieving assessments for curriculum ID: {}, unit: {}, topic: {}", curriculumId, unitId, topicId);
        
        List<CurriculumAssessment> assessments;
        
        if (unitId != null && topicId != null) {
            assessments = curriculumAssessmentRepository.findByCurriculumIdAndUnitIdAndTopicIdAndIsActive(
                    curriculumId, unitId, topicId, true);
        } else if (unitId != null) {
            assessments = curriculumAssessmentRepository.findByCurriculumIdAndUnitIdAndIsActive(
                    curriculumId, unitId, true);
        } else if (topicId != null) {
            assessments = curriculumAssessmentRepository.findByCurriculumIdAndTopicIdAndIsActive(
                    curriculumId, topicId, true);
        } else {
            assessments = curriculumAssessmentRepository.findByCurriculumIdAndIsActiveOrderBySequenceOrder(
                    curriculumId, true);
        }
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = ASSESSMENT_CACHE, key = "#unitId + '_unit'")
    public List<CurriculumAssessmentDTO> getAssessmentsByUnit(@NotNull @Positive Long unitId) {
        log.debug("Retrieving assessments for unit ID: {}", unitId);
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByUnitIdAndIsActiveOrderBySequenceOrder(unitId, true);
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = ASSESSMENT_CACHE, key = "#topicId + '_topic'")
    public List<CurriculumAssessmentDTO> getAssessmentsByTopic(@NotNull @Positive Long topicId) {
        log.debug("Retrieving assessments for topic ID: {}", topicId);
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByTopicIdAndIsActiveOrderBySequenceOrder(topicId, true);
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = ASSESSMENT_CACHE, key = "#purpose + '_purpose'")
    public List<CurriculumAssessmentDTO> getAssessmentsByPurpose(@NotNull CurriculumAssessment.AssessmentPurpose purpose) {
        log.debug("Retrieving assessments by purpose: {}", purpose);
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByAssessmentPurposeAndIsActive(purpose, true);
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // ==================== ASSESSMENT SEQUENCING METHODS ====================

    @Override
    @Transactional
    @CacheEvict(value = ASSESSMENT_CACHE, allEntries = true)
    public CurriculumAssessmentDTO updateSequenceOrder(@NotNull @Positive Long curriculumAssessmentId, 
            @NotNull Integer newOrder) {
        log.info("Updating sequence order for assessment ID: {} to order: {}", curriculumAssessmentId, newOrder);
        
        if (newOrder <= 0) {
            throw new IllegalArgumentException("Sequence order must be positive");
        }
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        Integer oldOrder = assessment.getSequenceOrder();
        Long curriculumId = assessment.getCurriculum().getId();
        
        // Reorder other assessments to make space
        if (oldOrder != null && !oldOrder.equals(newOrder)) {
            reorderAssessmentsForSequenceChange(curriculumId, oldOrder, newOrder);
        }
        
        assessment.setSequenceOrder(newOrder);
        CurriculumAssessment savedAssessment = curriculumAssessmentRepository.save(assessment);
        
        return curriculumAssessmentMapper.toDto(savedAssessment);
    }

    @Override
    @Transactional
    @CacheEvict(value = ASSESSMENT_CACHE, allEntries = true)
    public List<CurriculumAssessmentDTO> reorderAssessments(@NotNull @Positive Long curriculumId, 
            @NotNull List<Long> assessmentIds) {
        log.info("Reordering assessments for curriculum ID: {} with new order: {}", curriculumId, assessmentIds);
        
        if (assessmentIds.isEmpty()) {
            throw new IllegalArgumentException("Assessment IDs list cannot be empty");
        }
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByCurriculumIdAndIsActiveOrderBySequenceOrder(curriculumId, true);
        
        // Validate that all provided IDs exist
        Set<Long> existingIds = assessments.stream()
                .map(CurriculumAssessment::getId)
                .collect(Collectors.toSet());
        
        for (Long id : assessmentIds) {
            if (!existingIds.contains(id)) {
                throw new IllegalArgumentException("Assessment ID not found in curriculum: " + id);
            }
        }
        
        // Update sequence orders
        Map<Long, CurriculumAssessment> assessmentMap = assessments.stream()
                .collect(Collectors.toMap(CurriculumAssessment::getId, a -> a));
        
        for (int i = 0; i < assessmentIds.size(); i++) {
            Long assessmentId = assessmentIds.get(i);
            CurriculumAssessment assessment = assessmentMap.get(assessmentId);
            assessment.setSequenceOrder(i + 1);
        }
        
        List<CurriculumAssessment> savedAssessments = curriculumAssessmentRepository.saveAll(assessments);
        
        return savedAssessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = ASSESSMENT_CACHE, key = "#curriculumId + '_sequence'")
    public List<CurriculumAssessmentDTO> getAssessmentsInSequence(@NotNull @Positive Long curriculumId) {
        log.debug("Retrieving assessments in sequence for curriculum ID: {}", curriculumId);
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByCurriculumIdAndIsActiveOrderBySequenceOrder(curriculumId, true);
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // ==================== PREREQUISITE MANAGEMENT METHODS ====================

    @Override
    @Transactional
    @CacheEvict(value = ASSESSMENT_CACHE, allEntries = true)
    public void addPrerequisite(@NotNull @Positive Long curriculumAssessmentId, 
            @NotNull @Positive Long prerequisiteAssessmentId) {
        log.info("Adding prerequisite {} to assessment {}", prerequisiteAssessmentId, curriculumAssessmentId);
        
        if (curriculumAssessmentId.equals(prerequisiteAssessmentId)) {
            throw new IllegalArgumentException("Assessment cannot be a prerequisite of itself");
        }
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        CurriculumAssessment prerequisite = curriculumAssessmentRepository.findById(prerequisiteAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Prerequisite assessment not found with ID: " + prerequisiteAssessmentId));
        
        // Validate same curriculum
        if (!assessment.getCurriculum().getId().equals(prerequisite.getCurriculum().getId())) {
            throw new IllegalArgumentException("Prerequisites must be from the same curriculum");
        }
        
        // Check for circular dependencies
        if (wouldCreateCircularDependency(curriculumAssessmentId, prerequisiteAssessmentId)) {
            throw new IllegalArgumentException("Adding this prerequisite would create a circular dependency");
        }
        
        List<Long> prerequisites = getPrerequisiteIds(assessment);
        
        if (prerequisites.size() >= MAX_PREREQUISITES) {
            throw new IllegalArgumentException("Maximum number of prerequisites (" + MAX_PREREQUISITES + ") exceeded");
        }
        
        if (!prerequisites.contains(prerequisiteAssessmentId)) {
            prerequisites.add(prerequisiteAssessmentId);
            assessment.setPrerequisiteAssessments(serializeIds(prerequisites));
            curriculumAssessmentRepository.save(assessment);
            
            log.info("Prerequisite added successfully");
        } else {
            log.warn("Prerequisite already exists");
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = ASSESSMENT_CACHE, allEntries = true)
    public void removePrerequisite(@NotNull @Positive Long curriculumAssessmentId, 
            @NotNull @Positive Long prerequisiteAssessmentId) {
        log.info("Removing prerequisite {} from assessment {}", prerequisiteAssessmentId, curriculumAssessmentId);
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        List<Long> prerequisites = getPrerequisiteIds(assessment);
        
        if (prerequisites.remove(prerequisiteAssessmentId)) {
            assessment.setPrerequisiteAssessments(serializeIds(prerequisites));
            curriculumAssessmentRepository.save(assessment);
            
            log.info("Prerequisite removed successfully");
        } else {
            log.warn("Prerequisite not found in assessment");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumAssessmentDTO> getPrerequisites(@NotNull @Positive Long curriculumAssessmentId) {
        log.debug("Getting prerequisites for assessment ID: {}", curriculumAssessmentId);
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        List<Long> prerequisiteIds = getPrerequisiteIds(assessment);
        
        if (prerequisiteIds.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<CurriculumAssessment> prerequisites = curriculumAssessmentRepository.findAllById(prerequisiteIds);
        
        return prerequisites.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumAssessmentDTO> getDependentAssessments(@NotNull @Positive Long curriculumAssessmentId) {
        log.debug("Getting dependent assessments for assessment ID: {}", curriculumAssessmentId);
        
        return getDependentAssessmentsInternal(curriculumAssessmentId).stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // ==================== ALIGNMENT METHODS ====================

    @Override
    @Transactional
    @CacheEvict(value = ALIGNMENT_CACHE, allEntries = true)
    public CurriculumAssessmentDTO updateLearningObjectives(@NotNull @Positive Long curriculumAssessmentId, 
            @NotNull List<String> objectives) {
        log.info("Updating learning objectives for assessment ID: {}", curriculumAssessmentId);
        
        if (objectives.isEmpty()) {
            throw new IllegalArgumentException("Learning objectives cannot be empty");
        }
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        try {
            String objectivesJson = objectMapper.writeValueAsString(objectives);
            assessment.setLearningObjectivesCovered(objectivesJson);
            
            CurriculumAssessment savedAssessment = curriculumAssessmentRepository.save(assessment);
            
            log.info("Learning objectives updated successfully");
            return curriculumAssessmentMapper.toDto(savedAssessment);
            
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize learning objectives", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = ALIGNMENT_CACHE, allEntries = true)
    public CurriculumAssessmentDTO updateCompetencies(@NotNull @Positive Long curriculumAssessmentId, 
            @NotNull List<String> competencies) {
        log.info("Updating competencies for assessment ID: {}", curriculumAssessmentId);
        
        if (competencies.isEmpty()) {
            throw new IllegalArgumentException("Competencies cannot be empty");
        }
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        try {
            String competenciesJson = objectMapper.writeValueAsString(competencies);
            assessment.setCompetenciesAssessed(competenciesJson);
            
            CurriculumAssessment savedAssessment = curriculumAssessmentRepository.save(assessment);
            
            log.info("Competencies updated successfully");
            return curriculumAssessmentMapper.toDto(savedAssessment);
            
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize competencies", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = ALIGNMENT_CACHE, key = "#curriculumAssessmentId + '_alignment'")
    public Double calculateAlignmentScore(@NotNull @Positive Long curriculumAssessmentId) {
        log.debug("Calculating alignment score for assessment ID: {}", curriculumAssessmentId);
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(curriculumAssessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + curriculumAssessmentId));
        
        double score = 0.0;
        int factors = 0;
        
        // Factor 1: Learning objectives coverage (40%)
        List<String> objectives = getLearningObjectives(assessment);
        if (!objectives.isEmpty()) {
            score += 0.4 * calculateObjectivesCoverage(assessment, objectives);
            factors++;
        }
        
        // Factor 2: Competencies alignment (30%)
        List<String> competencies = getCompetencies(assessment);
        if (!competencies.isEmpty()) {
            score += 0.3 * calculateCompetenciesAlignment(assessment, competencies);
            factors++;
        }
        
        // Factor 3: Assessment purpose alignment (20%)
        score += 0.2 * calculatePurposeAlignment(assessment);
        factors++;
        
        // Factor 4: Sequence appropriateness (10%)
        score += 0.1 * calculateSequenceAlignment(assessment);
        factors++;
        
        double finalScore = factors > 0 ? score : 0.0;
        
        log.debug("Alignment score calculated: {}", finalScore);
        return BigDecimal.valueOf(finalScore).setScale(3, RoundingMode.HALF_UP).doubleValue();
    }

    // ==================== ANALYTICS METHODS ====================

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumAssessmentDTO> getMandatoryAssessments(@NotNull @Positive Long curriculumId) {
        log.debug("Getting mandatory assessments for curriculum ID: {}", curriculumId);
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByCurriculumIdAndIsMandatoryAndIsActive(curriculumId, true, true);
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumAssessmentDTO> getOptionalAssessments(@NotNull @Positive Long curriculumId) {
        log.debug("Getting optional assessments for curriculum ID: {}", curriculumId);
        
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByCurriculumIdAndIsMandatoryAndIsActive(curriculumId, false, true);
        
        return assessments.stream()
                .map(curriculumAssessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssessmentStatistics(@NotNull @Positive Long curriculumId) {
        log.debug("Getting assessment statistics for curriculum ID: {}", curriculumId);
        
        Map<String, Object> stats = new HashMap<>();
        
        Long totalAssessments = curriculumAssessmentRepository.countByCurriculumIdAndIsActive(curriculumId, true);
        Long mandatoryAssessments = curriculumAssessmentRepository.countByCurriculumIdAndIsMandatoryAndIsActive(curriculumId, true, true);
        Long optionalAssessments = totalAssessments - mandatoryAssessments;
        
        stats.put("totalAssessments", totalAssessments);
        stats.put("mandatoryAssessments", mandatoryAssessments);
        stats.put("optionalAssessments", optionalAssessments);
        
        // Assessment purpose distribution
        Map<CurriculumAssessment.AssessmentPurpose, Long> purposeDistribution = new HashMap<>();
        for (CurriculumAssessment.AssessmentPurpose purpose : CurriculumAssessment.AssessmentPurpose.values()) {
            Long count = curriculumAssessmentRepository.countByCurriculumIdAndAssessmentPurposeAndIsActive(
                    curriculumId, purpose, true);
            purposeDistribution.put(purpose, count);
        }
        stats.put("purposeDistribution", purposeDistribution);
        
        // Average weight
        Double averageWeight = curriculumAssessmentRepository.getAverageWeightByCurriculumId(curriculumId);
        stats.put("averageWeight", averageWeight != null ? averageWeight : 0.0);
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalWeight(@NotNull @Positive Long curriculumId) {
        log.debug("Calculating total weight for curriculum ID: {}", curriculumId);
        
        Double totalWeight = curriculumAssessmentRepository.getTotalWeightByCurriculumId(curriculumId);
        return totalWeight != null ? totalWeight : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumAssessmentDTO> getAssessmentsWithLowAlignment(@NotNull @Positive Long curriculumId, 
            Double threshold) {
        log.debug("Getting assessments with low alignment for curriculum ID: {}, threshold: {}", curriculumId, threshold);
        
        if (threshold == null) {
            threshold = MIN_ALIGNMENT_SCORE;
        }
        
        List<CurriculumAssessment> allAssessments = curriculumAssessmentRepository
                .findByCurriculumIdAndIsActiveOrderBySequenceOrder(curriculumId, true);
        
        List<CurriculumAssessmentDTO> lowAlignmentAssessments = new ArrayList<>();
        
        for (CurriculumAssessment assessment : allAssessments) {
            Double alignmentScore = calculateAlignmentScore(assessment.getId());
            if (alignmentScore < threshold) {
                lowAlignmentAssessments.add(curriculumAssessmentMapper.toDto(assessment));
            }
        }
        
        return lowAlignmentAssessments;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssessmentCoverage(@NotNull @Positive Long curriculumId) {
        log.debug("Getting assessment coverage for curriculum ID: {}", curriculumId);
        
        Map<String, Object> coverage = new HashMap<>();
        
        // Unit coverage
        List<CurriculumUnit> units = curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(curriculumId);
        Map<String, Boolean> unitCoverage = new HashMap<>();
        
        for (CurriculumUnit unit : units) {
            boolean hasAssessments = curriculumAssessmentRepository
                    .existsByCurriculumIdAndCurriculumUnitIdAndIsActive(curriculumId, unit.getId(), true);
            unitCoverage.put(unit.getTitle(), hasAssessments);
        }
        coverage.put("unitCoverage", unitCoverage);
        
        // Purpose coverage
        Map<CurriculumAssessment.AssessmentPurpose, Boolean> purposeCoverage = new HashMap<>();
        for (CurriculumAssessment.AssessmentPurpose purpose : CurriculumAssessment.AssessmentPurpose.values()) {
            boolean hasPurpose = curriculumAssessmentRepository
                    .existsByCurriculumIdAndAssessmentPurposeAndIsActive(curriculumId, purpose, true);
            purposeCoverage.put(purpose, hasPurpose);
        }
        coverage.put("purposeCoverage", purposeCoverage);
        
        return coverage;
    }

    @Override
    @Transactional(readOnly = true)
    public Double getTotalWeightPercentage(@NotNull @Positive Long curriculumId) {
        log.debug("Getting total weight percentage for curriculum ID: {}", curriculumId);
        
        Double totalWeight = curriculumAssessmentRepository.getTotalWeightPercentage(curriculumId);
        return totalWeight != null ? totalWeight : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getAssessmentCount(@NotNull @Positive Long curriculumId, 
            @NotNull CurriculumAssessment.AssessmentPurpose purpose) {
        log.debug("Getting assessment count for curriculum ID: {} and purpose: {}", curriculumId, purpose);
        
        Long count = curriculumAssessmentRepository.getAssessmentCount(curriculumId, purpose);
        return count != null ? count.intValue() : 0;
    }

    // ==================== PRIVATE HELPER METHODS ====================

    private void validateAssessmentLinking(CurriculumAssessmentDTO assessmentData) {
        if (assessmentData.weightPercentage() != null && 
            (assessmentData.weightPercentage() < 0 || assessmentData.weightPercentage() > 100)) {
            throw new IllegalArgumentException("Weight percentage must be between 0 and 100");
        }
        
        if (assessmentData.sequenceOrder() != null && assessmentData.sequenceOrder() <= 0) {
            throw new IllegalArgumentException("Sequence order must be positive");
        }
        
        // Check if assessment is already linked to this curriculum
        boolean alreadyLinked = curriculumAssessmentRepository
                .existsByCurriculumIdAndAssessmentIdAndIsActive(
                        assessmentData.curriculumId(), assessmentData.assessmentId(), true);
        
        if (alreadyLinked) {
            throw new IllegalArgumentException("Assessment is already linked to this curriculum");
        }
    }

    private CurriculumAssessment createCurriculumAssessment(CurriculumAssessmentDTO dto, 
            Curriculum curriculum, Assessment assessment, User linkedBy) {
        
        CurriculumAssessment curriculumAssessment = new CurriculumAssessment();
        curriculumAssessment.setCurriculum(curriculum);
        curriculumAssessment.setAssessment(assessment);
        curriculumAssessment.setAssessmentPurpose(dto.assessmentPurpose());
        curriculumAssessment.setWeightPercentage(dto.weightPercentage());
        curriculumAssessment.setMandatory(dto.isMandatory());
        curriculumAssessment.setSequenceOrder(dto.sequenceOrder());
        curriculumAssessment.setAlignmentNotes(dto.alignmentNotes());
        curriculumAssessment.setLinkedBy(linkedBy);
        curriculumAssessment.setLinkedAt(LocalDateTime.now());
        curriculumAssessment.setActive(true);
        
        // Set learning objectives and competencies if provided
        if (dto.learningObjectivesCovered() != null && !dto.learningObjectivesCovered().isEmpty()) {
            try {
                curriculumAssessment.setLearningObjectivesCovered(
                        objectMapper.writeValueAsString(dto.learningObjectivesCovered()));
            } catch (JsonProcessingException e) {
                log.warn("Failed to serialize learning objectives: {}", e.getMessage());
            }
        }
        
        if (dto.competenciesAssessed() != null && !dto.competenciesAssessed().isEmpty()) {
            try {
                curriculumAssessment.setCompetenciesAssessed(
                        objectMapper.writeValueAsString(dto.competenciesAssessed()));
            } catch (JsonProcessingException e) {
                log.warn("Failed to serialize competencies: {}", e.getMessage());
            }
        }
        
        return curriculumAssessment;
    }

    private void reorderAssessmentsForSequenceChange(Long curriculumId, Integer oldOrder, Integer newOrder) {
        List<CurriculumAssessment> assessments = curriculumAssessmentRepository
                .findByCurriculumIdAndIsActiveOrderBySequenceOrder(curriculumId, true);
        
        if (newOrder > oldOrder) {
            // Moving down: shift assessments up
            for (CurriculumAssessment assessment : assessments) {
                Integer order = assessment.getSequenceOrder();
                if (order != null && order > oldOrder && order <= newOrder) {
                    assessment.setSequenceOrder(order - 1);
                }
            }
        } else {
            // Moving up: shift assessments down
            for (CurriculumAssessment assessment : assessments) {
                Integer order = assessment.getSequenceOrder();
                if (order != null && order >= newOrder && order < oldOrder) {
                    assessment.setSequenceOrder(order + 1);
                }
            }
        }
        
        curriculumAssessmentRepository.saveAll(assessments);
    }

    private boolean wouldCreateCircularDependency(Long assessmentId, Long prerequisiteId) {
        // Check if prerequisiteId has assessmentId as a prerequisite (direct or indirect)
        Set<Long> visited = new HashSet<>();
        return hasPrerequisiteRecursive(prerequisiteId, assessmentId, visited);
    }

    private boolean hasPrerequisiteRecursive(Long assessmentId, Long targetId, Set<Long> visited) {
        if (visited.contains(assessmentId)) {
            return false; // Avoid infinite loops
        }
        visited.add(assessmentId);
        
        CurriculumAssessment assessment = curriculumAssessmentRepository.findById(assessmentId).orElse(null);
        if (assessment == null) {
            return false;
        }
        
        List<Long> prerequisites = getPrerequisiteIds(assessment);
        
        if (prerequisites.contains(targetId)) {
            return true;
        }
        
        for (Long prerequisiteId : prerequisites) {
            if (hasPrerequisiteRecursive(prerequisiteId, targetId, visited)) {
                return true;
            }
        }
        
        return false;
    }

    private List<CurriculumAssessment> getDependentAssessmentsInternal(Long assessmentId) {
        return curriculumAssessmentRepository.findDependentAssessments(assessmentId);
    }

    private List<Long> getPrerequisiteIds(CurriculumAssessment assessment) {
        String prerequisitesJson = assessment.getPrerequisiteAssessments();
        if (prerequisitesJson == null || prerequisitesJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(prerequisitesJson, new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to deserialize prerequisites for assessment {}: {}", assessment.getId(), e.getMessage());
            return new ArrayList<>();
        }
    }

    private String serializeIds(List<Long> ids) {
        try {
            return objectMapper.writeValueAsString(ids);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize IDs: {}", e.getMessage());
            return "[]";
        }
    }

    private List<String> getLearningObjectives(CurriculumAssessment assessment) {
        String objectivesJson = assessment.getLearningObjectivesCovered();
        if (objectivesJson == null || objectivesJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(objectivesJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to deserialize learning objectives: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<String> getCompetencies(CurriculumAssessment assessment) {
        String competenciesJson = assessment.getCompetenciesAssessed();
        if (competenciesJson == null || competenciesJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(competenciesJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to deserialize competencies: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // Alignment calculation methods (simplified implementations)
    private double calculateObjectivesCoverage(CurriculumAssessment assessment, List<String> objectives) {
        // Simplified: assume good coverage if objectives are defined
        return objectives.size() >= 3 ? 0.9 : 0.6;
    }

    private double calculateCompetenciesAlignment(CurriculumAssessment assessment, List<String> competencies) {
        // Simplified: assume good alignment if competencies are defined
        return competencies.size() >= 2 ? 0.85 : 0.5;
    }

    private double calculatePurposeAlignment(CurriculumAssessment assessment) {
        // Simplified: different purposes have different base alignment scores
        return switch (assessment.getAssessmentPurpose()) {
            case SUMMATIVE, CERTIFICATION -> 0.95;
            case FORMATIVE, PROGRESS_MONITORING -> 0.85;
            case DIAGNOSTIC, PLACEMENT -> 0.75;
            case COMPETENCY_BASED, FINAL_EVALUATION -> 0.9;
        };
    }

    private double calculateSequenceAlignment(CurriculumAssessment assessment) {
        // Simplified: assume good sequence if order is defined
        return assessment.getSequenceOrder() != null ? 0.8 : 0.4;
    }
} 