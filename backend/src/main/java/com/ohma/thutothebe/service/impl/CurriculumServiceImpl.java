package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.dto.CurriculumSubjectDTO;
import com.ohma.thutothebe.dto.CurriculumUnitDTO;
import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.dto.UpdateCurriculumSubjectRequest;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CurriculumMapper;
import com.ohma.thutothebe.mapper.CurriculumSubjectMapper;
import com.ohma.thutothebe.mapper.CurriculumUnitMapper;
import com.ohma.thutothebe.mapper.SubjectMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumServiceImpl extends BaseServiceImpl<Curriculum, CurriculumDTO, Long> implements CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final CurriculumMapper curriculumMapper;
    private final CurriculumUnitMapper curriculumUnitMapper;
    private final CurriculumSubjectMapper curriculumSubjectMapper;
    private final SubjectMapper subjectMapper;
    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final SchoolRepository schoolRepository;
    private final SubjectRepository subjectRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final CurriculumTeacherRepository curriculumTeacherRepository;
    private final CurriculumUnitRepository curriculumUnitRepository;
    private final CurriculumTopicRepository curriculumTopicRepository;

    @Autowired
    public CurriculumServiceImpl(
            CurriculumRepository curriculumRepository,
            CurriculumMapper curriculumMapper,
            CurriculumUnitMapper curriculumUnitMapper,
            CurriculumSubjectMapper curriculumSubjectMapper,
            SubjectMapper subjectMapper,
            UserRepository userRepository,
            RegionRepository regionRepository,
            SchoolRepository schoolRepository,
            SubjectRepository subjectRepository,
            CurriculumSubjectRepository curriculumSubjectRepository,
            CurriculumTeacherRepository curriculumTeacherRepository,
            CurriculumUnitRepository curriculumUnitRepository,
            CurriculumTopicRepository curriculumTopicRepository) {
        super(curriculumRepository);
        this.curriculumRepository = curriculumRepository;
        this.curriculumMapper = curriculumMapper;
        this.curriculumUnitMapper = curriculumUnitMapper;
        this.curriculumSubjectMapper = curriculumSubjectMapper;
        this.subjectMapper = subjectMapper;
        this.userRepository = userRepository;
        this.regionRepository = regionRepository;
        this.schoolRepository = schoolRepository;
        this.subjectRepository = subjectRepository;
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.curriculumTeacherRepository = curriculumTeacherRepository;
        this.curriculumUnitRepository = curriculumUnitRepository;
        this.curriculumTopicRepository = curriculumTopicRepository;
    }

    @Override
    protected Curriculum mapToEntity(CurriculumDTO dto) {
        Curriculum entity = curriculumMapper.toEntity(dto);
        
        // Set relationships
        if (dto.createdById() != null) {
            User createdBy = userRepository.findById(dto.createdById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.createdById()));
            entity.setCreatedBy(createdBy);
        }
        
        if (dto.regionId() != null) {
            Region region = regionRepository.findById(dto.regionId())
                .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + dto.regionId()));
            entity.setRegion(region);
        }
        
        if (dto.schoolId() != null) {
            School school = schoolRepository.findById(dto.schoolId())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }
        
        if (dto.approvedById() != null) {
            User approvedBy = userRepository.findById(dto.approvedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.approvedById()));
            entity.setApprovedBy(approvedBy);
        }
        
        return entity;
    }

    @Override
    protected CurriculumDTO mapToDto(Curriculum entity) {
        return curriculumMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Curriculum entity, CurriculumDTO dto) {
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setCurriculumType(dto.curriculumType());
        entity.setGradeLevel(dto.gradeLevel());
        entity.setStatus(dto.status());
        entity.setAcademicYear(dto.academicYear());
        entity.setEffectiveDate(dto.effectiveDate());
        entity.setExpiryDate(dto.expiryDate());
        entity.setLearningOutcomes(dto.learningOutcomes());
        entity.setDurationWeeks(dto.durationWeeks());
        entity.setTotalHours(dto.totalHours());
        entity.setActive(dto.active());
        entity.setMetadata(dto.metadata());
        
        // Update relationships if needed
        if (dto.regionId() != null && (entity.getRegion() == null || !entity.getRegion().getId().equals(dto.regionId()))) {
            Region region = regionRepository.findById(dto.regionId())
                .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + dto.regionId()));
            entity.setRegion(region);
        }
        
        if (dto.schoolId() != null && (entity.getSchool() == null || !entity.getSchool().getId().equals(dto.schoolId()))) {
            School school = schoolRepository.findById(dto.schoolId())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + dto.schoolId()));
            entity.setSchool(school);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findAllActive() {
        return curriculumRepository.findAllActive().stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByStatus(CurriculumStatus status) {
        return curriculumRepository.findByStatus(status).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByCurriculumType(CurriculumType type) {
        return curriculumRepository.findByCurriculumType(type).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByGradeLevel(GradeLevel gradeLevel) {
        return curriculumRepository.findByGradeLevel(gradeLevel).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByAcademicYear(Integer academicYear) {
        return curriculumRepository.findByAcademicYear(academicYear).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByRegionId(Long regionId) {
        return curriculumRepository.findByRegionId(regionId).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findBySchoolId(Long schoolId) {
        return curriculumRepository.findBySchoolId(schoolId).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByCreatedById(Long createdById) {
        return curriculumRepository.findByCreatedById(createdById).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByGradeLevelAndType(GradeLevel gradeLevel, CurriculumType type) {
        return curriculumRepository.findByGradeLevelAndType(gradeLevel, type).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findEffectiveOnDate(LocalDate date) {
        return curriculumRepository.findEffectiveOnDate(date).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByTitleContaining(String title) {
        return curriculumRepository.findByTitleContaining(title).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByApprovedById(Long approvedById) {
        return curriculumRepository.findByApprovedById(approvedById).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByStatusAndGradeLevelAndAcademicYear(CurriculumStatus status, GradeLevel gradeLevel, Integer academicYear) {
        return curriculumRepository.findByStatusAndGradeLevelAndAcademicYear(status, gradeLevel, academicYear).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTitleAndGradeLevelAndAcademicYear(String title, GradeLevel gradeLevel, Integer academicYear) {
        return curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(title, gradeLevel, academicYear);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumDTO> findByRegionAndGradeLevelAndAcademicYear(Long regionId, GradeLevel gradeLevel, Integer academicYear) {
        return curriculumRepository.findByRegionAndGradeLevelAndAcademicYear(regionId, gradeLevel, academicYear).stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public CurriculumDTO approveCurriculum(Long curriculumId, Long approvedById) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        User approvedBy = userRepository.findById(approvedById)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + approvedById));
        
        curriculum.setStatus(CurriculumStatus.APPROVED);
        curriculum.setApprovedBy(approvedBy);
        curriculum.setApprovedAt(LocalDate.now());
        
        Curriculum savedCurriculum = curriculumRepository.save(curriculum);
        return curriculumMapper.toDto(savedCurriculum);
    }

    @Override
    public CurriculumDTO activateCurriculum(Long curriculumId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        curriculum.setStatus(CurriculumStatus.ACTIVE);
        
        Curriculum savedCurriculum = curriculumRepository.save(curriculum);
        return curriculumMapper.toDto(savedCurriculum);
    }

    @Override
    public CurriculumDTO suspendCurriculum(Long curriculumId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        curriculum.setStatus(CurriculumStatus.SUSPENDED);
        
        Curriculum savedCurriculum = curriculumRepository.save(curriculum);
        return curriculumMapper.toDto(savedCurriculum);
    }

    @Override
    public CurriculumDTO archiveCurriculum(Long curriculumId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        curriculum.setStatus(CurriculumStatus.ARCHIVED);
        
        Curriculum savedCurriculum = curriculumRepository.save(curriculum);
        return curriculumMapper.toDto(savedCurriculum);
    }

    @Override
    public CurriculumDTO submitCurriculumForReview(Long curriculumId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        // Validate that curriculum is in DRAFT status
        if (curriculum.getStatus() != CurriculumStatus.DRAFT) {
            throw new IllegalStateException("Only curricula in DRAFT status can be submitted for review");
        }
        
        curriculum.setStatus(CurriculumStatus.UNDER_REVIEW);
        curriculum.setModifiedAt(LocalDateTime.now());
        
        Curriculum savedCurriculum = curriculumRepository.save(curriculum);
        return curriculumMapper.toDto(savedCurriculum);
    }

    // Additional methods will be implemented in subsequent iterations
    @Override
    public CurriculumDTO addSubjectToCurriculum(Long curriculumId, Long subjectId, boolean isCore, Integer allocatedHours, Double weightPercentage) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        
        // Check if subject is already assigned to curriculum
        if (curriculumSubjectRepository.existsByCurriculumIdAndSubjectId(curriculumId, subjectId)) {
            throw new IllegalArgumentException("Subject is already assigned to this curriculum");
        }
        
        CurriculumSubject curriculumSubject = new CurriculumSubject();
        curriculumSubject.setCurriculum(curriculum);
        curriculumSubject.setSubject(subject);
        curriculumSubject.setCore(isCore);
        curriculumSubject.setAllocatedHours(allocatedHours);
        curriculumSubject.setWeightPercentage(weightPercentage);
        curriculumSubject.setActive(true);
        
        curriculumSubjectRepository.save(curriculumSubject);
        
        return curriculumMapper.toDto(curriculum);
    }

    @Override
    public CurriculumDTO removeSubjectFromCurriculum(Long curriculumId, Long subjectId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        CurriculumSubject curriculumSubject = curriculumSubjectRepository.findByCurriculumIdAndSubjectId(curriculumId, subjectId)
            .orElseThrow(() -> new ResourceNotFoundException("Subject not found in curriculum"));
        
        curriculumSubject.setActive(false);
        curriculumSubjectRepository.save(curriculumSubject);
        
        return curriculumMapper.toDto(curriculum);
    }

    @Override
    public CurriculumDTO assignTeacherToCurriculum(Long curriculumId, Long teacherId, Long subjectId, boolean isPrimary, Double responsibilityPercentage) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        User teacher = userRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
        
        Subject subject = null;
        if (subjectId != null) {
            subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        }
        
        // Check if teacher is already assigned to curriculum
        if (curriculumTeacherRepository.existsByCurriculumIdAndTeacherId(curriculumId, teacherId)) {
            throw new IllegalArgumentException("Teacher is already assigned to this curriculum");
        }
        
        CurriculumTeacher curriculumTeacher = new CurriculumTeacher();
        curriculumTeacher.setCurriculum(curriculum);
        curriculumTeacher.setTeacher(teacher);
        curriculumTeacher.setSubject(subject);
        curriculumTeacher.setAssignedDate(LocalDate.now());
        curriculumTeacher.setPrimary(isPrimary);
        curriculumTeacher.setResponsibilityPercentage(responsibilityPercentage);
        curriculumTeacher.setActive(true);
        
        curriculumTeacherRepository.save(curriculumTeacher);
        
        return curriculumMapper.toDto(curriculum);
    }

    @Override
    public CurriculumDTO removeTeacherFromCurriculum(Long curriculumId, Long teacherId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        CurriculumTeacher curriculumTeacher = curriculumTeacherRepository.findByCurriculumIdAndTeacherId(curriculumId, teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found in curriculum"));
        
        curriculumTeacher.setActive(false);
        curriculumTeacherRepository.save(curriculumTeacher);
        
        return curriculumMapper.toDto(curriculum);
    }

    @Override
    public CurriculumDTO createCurriculumUnit(Long curriculumId, String title, String description, Integer unitOrder, Integer durationWeeks, Integer allocatedHours) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        // Check if unit with same order already exists
        if (curriculumUnitRepository.findByCurriculumIdAndUnitOrder(curriculumId, unitOrder).isPresent()) {
            throw new IllegalArgumentException("Unit with order " + unitOrder + " already exists in this curriculum");
        }
        
        CurriculumUnit curriculumUnit = new CurriculumUnit();
        curriculumUnit.setCurriculum(curriculum);
        curriculumUnit.setTitle(title);
        curriculumUnit.setDescription(description);
        curriculumUnit.setUnitOrder(unitOrder);
        curriculumUnit.setDurationWeeks(durationWeeks);
        curriculumUnit.setAllocatedHours(allocatedHours);
        curriculumUnit.setActive(true);
        
        curriculumUnitRepository.save(curriculumUnit);
        
        return curriculumMapper.toDto(curriculum);
    }

    @Override
    public CurriculumDTO createCurriculumTopic(Long curriculumUnitId, String title, String description, Integer topicOrder, Integer durationHours) {
        CurriculumUnit curriculumUnit = curriculumUnitRepository.findById(curriculumUnitId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum unit not found with id: " + curriculumUnitId));
        
        // Check if topic with same order already exists
        if (curriculumTopicRepository.findByCurriculumUnitIdAndTopicOrder(curriculumUnitId, topicOrder).isPresent()) {
            throw new IllegalArgumentException("Topic with order " + topicOrder + " already exists in this unit");
        }
        
        CurriculumTopic curriculumTopic = new CurriculumTopic();
        curriculumTopic.setCurriculumUnit(curriculumUnit);
        curriculumTopic.setTitle(title);
        curriculumTopic.setDescription(description);
        curriculumTopic.setTopicOrder(topicOrder);
        curriculumTopic.setDurationHours(durationHours);
        curriculumTopic.setActive(true);
        
        curriculumTopicRepository.save(curriculumTopic);
        
        return curriculumMapper.toDto(curriculumUnit.getCurriculum());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumUnitDTO> getCurriculumUnits(Long curriculumId) {
        log.info("Fetching curriculum units for curriculum ID: {}", curriculumId);
        
        // Verify curriculum exists and get basic info
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        List<CurriculumUnit> units = curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(curriculumId);
        
        // Map to DTOs with curriculum info to avoid lazy loading
        return units.stream()
            .map(unit -> mapToUnitDTO(unit, curriculum.getId(), curriculum.getTitle()))
            .collect(Collectors.toList());
    }
    
    private CurriculumUnitDTO mapToUnitDTO(CurriculumUnit unit, Long curriculumId, String curriculumTitle) {
        // Safely handle lazy-loaded topics collection
        Set<Long> topicIds = Collections.emptySet();
        Set<String> topicTitles = Collections.emptySet();
        
        if (unit.getCurriculumTopics() != null && Hibernate.isInitialized(unit.getCurriculumTopics())) {
            topicIds = unit.getCurriculumTopics().stream()
                .map(topic -> topic.getId())
                .collect(Collectors.toSet());
                
            topicTitles = unit.getCurriculumTopics().stream()
                .map(topic -> topic.getTitle())
                .collect(Collectors.toSet());
        }

        return new CurriculumUnitDTO(
            unit.getId(),
            curriculumId,
            curriculumTitle,
            unit.getTitle(),
            unit.getDescription(),
            unit.getUnitOrder(),
            unit.getDurationWeeks(),
            unit.getAllocatedHours(),
            unit.getLearningObjectives(),
            unit.getAssessmentCriteria(),
            topicIds,
            topicTitles,
            unit.isActive(),
            unit.getCreatedAt(),
            unit.getModifiedAt()
        );
    }

    @Override
    public List<CurriculumDTO> getCurriculumRecommendations(GradeLevel gradeLevel, CurriculumType type, Long regionId) {
        // Get curricula that match the criteria and are approved/active
        List<Curriculum> recommendations = curriculumRepository.findByGradeLevelAndType(gradeLevel, type)
            .stream()
            .filter(c -> c.getStatus() == CurriculumStatus.APPROVED || c.getStatus() == CurriculumStatus.ACTIVE)
            .filter(c -> regionId == null || (c.getRegion() != null && c.getRegion().getId().equals(regionId)))
            .collect(Collectors.toList());
        
        return recommendations.stream()
            .map(curriculumMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public void validateCurriculumAlignment(Long curriculumId, Long regionId) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        Region region = regionRepository.findById(regionId)
            .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + regionId));
        
        // Validation logic for curriculum alignment with regional standards
        if (curriculum.getCurriculumType() == CurriculumType.NATIONAL) {
            // National curricula should be aligned across all regions
            log.info("National curriculum {} is valid for all regions", curriculum.getTitle());
        } else if (curriculum.getCurriculumType() == CurriculumType.REGIONAL) {
            // Regional curricula should match the specified region
            if (curriculum.getRegion() == null || !curriculum.getRegion().getId().equals(regionId)) {
                throw new IllegalArgumentException("Regional curriculum is not aligned with the specified region");
            }
        } else if (curriculum.getCurriculumType() == CurriculumType.SCHOOL_SPECIFIC) {
            // School-specific curricula should be within the region
            if (curriculum.getSchool() == null || 
                curriculum.getSchool().getRegion() == null || 
                !curriculum.getSchool().getRegion().getId().equals(regionId)) {
                throw new IllegalArgumentException("School-specific curriculum is not within the specified region");
            }
        }
        
        log.info("Curriculum {} is aligned with region {}", curriculum.getTitle(), region.getName());
    }

    @Override
    public CurriculumDTO duplicateCurriculum(Long curriculumId, String newTitle, Integer newAcademicYear) {
        Curriculum originalCurriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        // Check if curriculum with new title and academic year already exists
        if (existsByTitleAndGradeLevelAndAcademicYear(newTitle, originalCurriculum.getGradeLevel(), newAcademicYear)) {
            throw new IllegalArgumentException("Curriculum with title '" + newTitle + "' already exists for this grade level and academic year");
        }
        
        // Create new curriculum
        Curriculum newCurriculum = new Curriculum();
        newCurriculum.setTitle(newTitle);
        newCurriculum.setDescription(originalCurriculum.getDescription());
        newCurriculum.setCurriculumType(originalCurriculum.getCurriculumType());
        newCurriculum.setGradeLevel(originalCurriculum.getGradeLevel());
        newCurriculum.setStatus(CurriculumStatus.DRAFT);
        newCurriculum.setAcademicYear(newAcademicYear);
        newCurriculum.setLearningOutcomes(originalCurriculum.getLearningOutcomes());
        newCurriculum.setDurationWeeks(originalCurriculum.getDurationWeeks());
        newCurriculum.setTotalHours(originalCurriculum.getTotalHours());
        newCurriculum.setRegion(originalCurriculum.getRegion());
        newCurriculum.setSchool(originalCurriculum.getSchool());
        newCurriculum.setCreatedBy(originalCurriculum.getCreatedBy());
        newCurriculum.setActive(true);
        newCurriculum.setCurriculumVersion(1);
        newCurriculum.setMetadata(originalCurriculum.getMetadata());
        
        Curriculum savedCurriculum = curriculumRepository.save(newCurriculum);
        
        // Duplicate curriculum subjects
        List<CurriculumSubject> originalSubjects = curriculumSubjectRepository.findByCurriculumId(curriculumId);
        for (CurriculumSubject originalSubject : originalSubjects) {
            CurriculumSubject newSubject = new CurriculumSubject();
            newSubject.setCurriculum(savedCurriculum);
            newSubject.setSubject(originalSubject.getSubject());
            newSubject.setCore(originalSubject.isCore());
            newSubject.setAllocatedHours(originalSubject.getAllocatedHours());
            newSubject.setWeightPercentage(originalSubject.getWeightPercentage());
            newSubject.setObjectives(originalSubject.getObjectives());
            newSubject.setActive(true);
            curriculumSubjectRepository.save(newSubject);
        }
        
        // Duplicate curriculum units and topics
        List<CurriculumUnit> originalUnits = curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(curriculumId);
        for (CurriculumUnit originalUnit : originalUnits) {
            CurriculumUnit newUnit = new CurriculumUnit();
            newUnit.setCurriculum(savedCurriculum);
            newUnit.setTitle(originalUnit.getTitle());
            newUnit.setDescription(originalUnit.getDescription());
            newUnit.setUnitOrder(originalUnit.getUnitOrder());
            newUnit.setDurationWeeks(originalUnit.getDurationWeeks());
            newUnit.setAllocatedHours(originalUnit.getAllocatedHours());
            newUnit.setLearningObjectives(originalUnit.getLearningObjectives());
            newUnit.setAssessmentCriteria(originalUnit.getAssessmentCriteria());
            newUnit.setActive(true);
            CurriculumUnit savedUnit = curriculumUnitRepository.save(newUnit);
            
            // Duplicate topics for this unit
            List<CurriculumTopic> originalTopics = curriculumTopicRepository.findByCurriculumUnitIdOrderByTopicOrder(originalUnit.getId());
            for (CurriculumTopic originalTopic : originalTopics) {
                CurriculumTopic newTopic = new CurriculumTopic();
                newTopic.setCurriculumUnit(savedUnit);
                newTopic.setTitle(originalTopic.getTitle());
                newTopic.setDescription(originalTopic.getDescription());
                newTopic.setTopicOrder(originalTopic.getTopicOrder());
                newTopic.setDurationHours(originalTopic.getDurationHours());
                newTopic.setLearningObjectives(originalTopic.getLearningObjectives());
                newTopic.setActivities(originalTopic.getActivities());
                newTopic.setResources(originalTopic.getResources());
                newTopic.setAssessmentMethods(originalTopic.getAssessmentMethods());
                newTopic.setActive(true);
                curriculumTopicRepository.save(newTopic);
            }
        }
        
        return curriculumMapper.toDto(savedCurriculum);
    }

    @Override
    @Transactional
    public CurriculumDTO updateCurriculumSubjects(Long curriculumId, List<Long> subjectIds) {
        log.info("Updating curriculum subjects for curriculum ID: {} with subjects: {}", curriculumId, subjectIds);
        
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        // Validate that all subject IDs exist
        for (Long subjectId : subjectIds) {
            if (!subjectRepository.existsById(subjectId)) {
                throw new ResourceNotFoundException("Subject not found with id: " + subjectId);
            }
        }
        
        // Get current curriculum subjects
        List<CurriculumSubject> currentSubjects = curriculumSubjectRepository.findByCurriculumId(curriculumId);
        
        // Deactivate subjects that are no longer in the list
        for (CurriculumSubject currentSubject : currentSubjects) {
            if (!subjectIds.contains(currentSubject.getSubject().getId())) {
                currentSubject.setActive(false);
                curriculumSubjectRepository.save(currentSubject);
                log.debug("Deactivated subject {} from curriculum {}", currentSubject.getSubject().getId(), curriculumId);
            }
        }
        
        // Add new subjects or reactivate existing ones
        for (Long subjectId : subjectIds) {
            CurriculumSubject existingSubject = curriculumSubjectRepository
                .findByCurriculumIdAndSubjectId(curriculumId, subjectId)
                .orElse(null);
            
            if (existingSubject != null) {
                // Reactivate if it was deactivated
                if (!existingSubject.isActive()) {
                    existingSubject.setActive(true);
                    curriculumSubjectRepository.save(existingSubject);
                    log.debug("Reactivated subject {} for curriculum {}", subjectId, curriculumId);
                }
            } else {
                // Create new curriculum subject association
                Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
                
                CurriculumSubject newCurriculumSubject = new CurriculumSubject();
                newCurriculumSubject.setCurriculum(curriculum);
                newCurriculumSubject.setSubject(subject);
                newCurriculumSubject.setCore(true); // Default to core, can be updated later
                newCurriculumSubject.setActive(true);
                
                curriculumSubjectRepository.save(newCurriculumSubject);
                log.debug("Added new subject {} to curriculum {}", subjectId, curriculumId);
            }
        }
        
        log.info("Successfully updated curriculum subjects for curriculum ID: {}", curriculumId);
        return curriculumMapper.toDto(curriculum);
    }

    @Override
    @Transactional(readOnly = true)
    public String exportCurriculum(Long curriculumId, String format) {
        log.info("Exporting curriculum ID: {} in format: {}", curriculumId, format);
        
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum not found with id: " + curriculumId));
        
        try {
            // Create comprehensive export data
            CurriculumExportData exportData = new CurriculumExportData();
            exportData.setCurriculum(curriculumMapper.toDto(curriculum));
            
            // Include curriculum subjects
            List<CurriculumSubject> subjects = curriculumSubjectRepository.findByCurriculumId(curriculumId);
            exportData.setSubjects(subjects.stream()
                .map(cs -> new CurriculumSubjectExportData(
                    cs.getSubject().getId(),
                    cs.getSubject().getName(),
                    cs.getSubject().getCode(),
                    cs.isCore(),
                    cs.getAllocatedHours(),
                    cs.getWeightPercentage(),
                    cs.getObjectives()
                ))
                .collect(Collectors.toList()));
            
            // Include curriculum units and topics
            List<CurriculumUnit> units = curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(curriculumId);
            List<CurriculumUnitExportData> unitExportData = new ArrayList<>();
            
            for (CurriculumUnit unit : units) {
                List<CurriculumTopic> topics = curriculumTopicRepository.findByCurriculumUnitIdOrderByTopicOrder(unit.getId());
                List<CurriculumTopicExportData> topicExportData = topics.stream()
                    .map(topic -> new CurriculumTopicExportData(
                        topic.getTitle(),
                        topic.getDescription(),
                        topic.getTopicOrder(),
                        topic.getDurationHours(),
                        topic.getLearningObjectives(),
                        topic.getActivities(),
                        topic.getResources(),
                        topic.getAssessmentMethods()
                    ))
                    .collect(Collectors.toList());
                
                unitExportData.add(new CurriculumUnitExportData(
                    unit.getTitle(),
                    unit.getDescription(),
                    unit.getUnitOrder(),
                    unit.getDurationWeeks(),
                    unit.getAllocatedHours(),
                    unit.getLearningObjectives(),
                    unit.getAssessmentCriteria(),
                    topicExportData
                ));
            }
            exportData.setUnits(unitExportData);
            
            // Add export metadata
            exportData.setExportedAt(LocalDate.now());
            exportData.setExportedBy(curriculum.getCreatedBy() != null ? curriculum.getCreatedBy().getUsername() : "system");
            exportData.setVersion("1.0");
            exportData.setFormat(format.toUpperCase());
            
            // Convert to requested format
            switch (format.toLowerCase()) {
                case "json":
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.registerModule(new JavaTimeModule());
                    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                    return objectMapper.writeValueAsString(exportData);
                case "xml":
                    return convertToXml(exportData);
                default:
                    throw new IllegalArgumentException("Unsupported export format: " + format);
            }
        } catch (Exception e) {
            log.error("Error exporting curriculum {}: {}", curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to export curriculum", e);
        }
    }

    @Override
    @Transactional
    public CurriculumDTO importCurriculum(String fileContent, String format) {
        log.info("Importing curriculum in format: {}", format);
        
        try {
            CurriculumExportData importData;
            
            // Parse based on format
            switch (format.toLowerCase()) {
                case "json":
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.registerModule(new JavaTimeModule());
                    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                    importData = objectMapper.readValue(fileContent, CurriculumExportData.class);
                    break;
                case "xml":
                    importData = convertFromXml(fileContent);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported import format: " + format);
            }
            
            // Validate import data
            if (importData.getCurriculum() == null) {
                throw new IllegalArgumentException("Invalid import data: curriculum information is missing");
            }
            
            CurriculumDTO curriculumDTO = importData.getCurriculum();
            
            // Check if curriculum with same title, grade level, and academic year already exists
            if (existsByTitleAndGradeLevelAndAcademicYear(
                    curriculumDTO.title(), 
                    curriculumDTO.gradeLevel(), 
                    curriculumDTO.academicYear())) {
                throw new IllegalArgumentException(
                    "Curriculum with title '" + curriculumDTO.title() + 
                    "' already exists for this grade level and academic year");
            }
            
            // Create new curriculum with imported data
            Curriculum newCurriculum = new Curriculum();
            newCurriculum.setTitle(curriculumDTO.title() + " (Imported)");
            newCurriculum.setDescription(curriculumDTO.description());
            newCurriculum.setCurriculumType(curriculumDTO.curriculumType());
            newCurriculum.setGradeLevel(curriculumDTO.gradeLevel());
            newCurriculum.setStatus(CurriculumStatus.DRAFT); // Always import as draft
            newCurriculum.setAcademicYear(curriculumDTO.academicYear());
            newCurriculum.setEffectiveDate(curriculumDTO.effectiveDate());
            newCurriculum.setExpiryDate(curriculumDTO.expiryDate());
            newCurriculum.setLearningOutcomes(curriculumDTO.learningOutcomes());
            newCurriculum.setDurationWeeks(curriculumDTO.durationWeeks());
            newCurriculum.setTotalHours(curriculumDTO.totalHours());
            newCurriculum.setActive(true);
            newCurriculum.setCurriculumVersion(1);
            newCurriculum.setMetadata(curriculumDTO.metadata());
            
            // Set relationships if provided
            if (curriculumDTO.regionId() != null) {
                Region region = regionRepository.findById(curriculumDTO.regionId())
                    .orElse(null); // Don't fail if region doesn't exist
                newCurriculum.setRegion(region);
            }
            
            if (curriculumDTO.schoolId() != null) {
                School school = schoolRepository.findById(curriculumDTO.schoolId())
                    .orElse(null); // Don't fail if school doesn't exist
                newCurriculum.setSchool(school);
            }
            
            Curriculum savedCurriculum = curriculumRepository.save(newCurriculum);
            
            // Import subjects if provided
            if (importData.getSubjects() != null && !importData.getSubjects().isEmpty()) {
                for (CurriculumSubjectExportData subjectData : importData.getSubjects()) {
                    // Try to find subject by code first
                    Subject subject = subjectRepository.findByCode(subjectData.getCode())
                        .orElse(null);
                    
                    if (subject != null) {
                        CurriculumSubject curriculumSubject = new CurriculumSubject();
                        curriculumSubject.setCurriculum(savedCurriculum);
                        curriculumSubject.setSubject(subject);
                        curriculumSubject.setCore(subjectData.isCore());
                        curriculumSubject.setAllocatedHours(subjectData.getAllocatedHours());
                        curriculumSubject.setWeightPercentage(subjectData.getWeightPercentage());
                        curriculumSubject.setObjectives(subjectData.getObjectives());
                        curriculumSubject.setActive(true);
                        
                        curriculumSubjectRepository.save(curriculumSubject);
                        log.debug("Imported subject {} for curriculum {}", subject.getName(), savedCurriculum.getId());
                    } else {
                        log.warn("Subject not found during import: {} ({})", subjectData.getName(), subjectData.getCode());
                    }
                }
            }
            
            // Import units and topics if provided
            if (importData.getUnits() != null && !importData.getUnits().isEmpty()) {
                for (CurriculumUnitExportData unitData : importData.getUnits()) {
                    CurriculumUnit unit = new CurriculumUnit();
                    unit.setCurriculum(savedCurriculum);
                    unit.setTitle(unitData.getTitle());
                    unit.setDescription(unitData.getDescription());
                    unit.setUnitOrder(unitData.getUnitOrder());
                    unit.setDurationWeeks(unitData.getDurationWeeks());
                    unit.setAllocatedHours(unitData.getAllocatedHours());
                    unit.setLearningObjectives(unitData.getLearningObjectives());
                    unit.setAssessmentCriteria(unitData.getAssessmentCriteria());
                    unit.setActive(true);
                    
                    CurriculumUnit savedUnit = curriculumUnitRepository.save(unit);
                    
                    // Import topics for this unit
                    if (unitData.getTopics() != null && !unitData.getTopics().isEmpty()) {
                        for (CurriculumTopicExportData topicData : unitData.getTopics()) {
                            CurriculumTopic topic = new CurriculumTopic();
                            topic.setCurriculumUnit(savedUnit);
                            topic.setTitle(topicData.getTitle());
                            topic.setDescription(topicData.getDescription());
                            topic.setTopicOrder(topicData.getTopicOrder());
                            topic.setDurationHours(topicData.getDurationHours());
                            topic.setLearningObjectives(topicData.getLearningObjectives());
                            topic.setActivities(topicData.getActivities());
                            topic.setResources(topicData.getResources());
                            topic.setAssessmentMethods(topicData.getAssessmentMethods());
                            topic.setActive(true);
                            
                            curriculumTopicRepository.save(topic);
                        }
                    }
                }
            }
            
            log.info("Successfully imported curriculum: {}", savedCurriculum.getTitle());
            return curriculumMapper.toDto(savedCurriculum);
            
        } catch (Exception e) {
            log.error("Error importing curriculum: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to import curriculum: " + e.getMessage(), e);
        }
    }

    // Helper methods for XML conversion
    private String convertToXml(CurriculumExportData exportData) {
        // Simple XML conversion - in a real implementation, you might use JAXB or Jackson XML
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<curriculumExport>\n");
        xml.append("  <curriculum>\n");
        xml.append("    <title>").append(escapeXml(exportData.getCurriculum().title())).append("</title>\n");
        xml.append("    <description>").append(escapeXml(exportData.getCurriculum().description())).append("</description>\n");
        xml.append("    <gradeLevel>").append(exportData.getCurriculum().gradeLevel()).append("</gradeLevel>\n");
        xml.append("    <academicYear>").append(exportData.getCurriculum().academicYear()).append("</academicYear>\n");
        xml.append("  </curriculum>\n");
        xml.append("  <exportMetadata>\n");
        xml.append("    <exportedAt>").append(exportData.getExportedAt()).append("</exportedAt>\n");
        xml.append("    <version>").append(exportData.getVersion()).append("</version>\n");
        xml.append("  </exportMetadata>\n");
        xml.append("</curriculumExport>");
        return xml.toString();
    }

    private CurriculumExportData convertFromXml(String xmlContent) {
        // Simple XML parsing - in a real implementation, you might use JAXB or Jackson XML
        throw new UnsupportedOperationException("XML import is not yet implemented");
    }

    private String escapeXml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;");
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDTO> getAvailableSubjects(Long curriculumId) {
        log.info("Fetching available subjects for curriculum ID: {}", curriculumId);
        
        // Verify curriculum exists
        if (!curriculumRepository.existsById(curriculumId)) {
            throw new ResourceNotFoundException("Curriculum not found with id: " + curriculumId);
        }
        
        // Get all active subjects
        List<Subject> allSubjects = subjectRepository.findByActive(true);
        
        // Get subjects already associated with this curriculum
        List<CurriculumSubject> curriculumSubjects = curriculumSubjectRepository.findByCurriculumId(curriculumId);
        Set<Long> associatedSubjectIds = curriculumSubjects.stream()
            .map(cs -> cs.getSubject().getId())
            .collect(Collectors.toSet());
        
        // Filter out already associated subjects
        List<Subject> availableSubjects = allSubjects.stream()
            .filter(subject -> !associatedSubjectIds.contains(subject.getId()))
            .collect(Collectors.toList());
        
        log.info("Found {} available subjects for curriculum ID: {}", availableSubjects.size(), curriculumId);
        
        return availableSubjects.stream()
            .map(subjectMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CurriculumSubjectDTO updateCurriculumSubject(Long curriculumId, Long subjectId, UpdateCurriculumSubjectRequest request) {
        log.info("Updating curriculum subject for curriculum ID: {} and subject ID: {}", curriculumId, subjectId);
        
        // Find the curriculum subject association
        CurriculumSubject curriculumSubject = curriculumSubjectRepository.findByCurriculumIdAndSubjectId(curriculumId, subjectId)
            .orElseThrow(() -> new ResourceNotFoundException("Curriculum subject association not found for curriculum: " + curriculumId + " and subject: " + subjectId));
        
        // Update the fields
        curriculumSubject.setCore(request.isCore());
        
        if (request.allocatedHours() != null) {
            curriculumSubject.setAllocatedHours(request.allocatedHours());
        }
        
        if (request.weightPercentage() != null) {
            curriculumSubject.setWeightPercentage(request.weightPercentage());
        }
        
        if (request.objectives() != null) {
            curriculumSubject.setObjectives(request.objectives());
        }
        
        CurriculumSubject savedCurriculumSubject = curriculumSubjectRepository.save(curriculumSubject);
        
        log.info("Successfully updated curriculum subject for curriculum ID: {} and subject ID: {}", curriculumId, subjectId);
        
        return curriculumSubjectMapper.toDto(savedCurriculumSubject);
    }

    // Inner classes for export/import data structure
    public static class CurriculumExportData {
        private CurriculumDTO curriculum;
        private List<CurriculumSubjectExportData> subjects;
        private List<CurriculumUnitExportData> units;
        private LocalDate exportedAt;
        private String exportedBy;
        private String version;
        private String format;

        // Getters and setters
        public CurriculumDTO getCurriculum() { return curriculum; }
        public void setCurriculum(CurriculumDTO curriculum) { this.curriculum = curriculum; }
        public List<CurriculumSubjectExportData> getSubjects() { return subjects; }
        public void setSubjects(List<CurriculumSubjectExportData> subjects) { this.subjects = subjects; }
        public List<CurriculumUnitExportData> getUnits() { return units; }
        public void setUnits(List<CurriculumUnitExportData> units) { this.units = units; }
        public LocalDate getExportedAt() { return exportedAt; }
        public void setExportedAt(LocalDate exportedAt) { this.exportedAt = exportedAt; }
        public String getExportedBy() { return exportedBy; }
        public void setExportedBy(String exportedBy) { this.exportedBy = exportedBy; }
        public String getVersion() { return version; }
        public void setVersion(String version) { this.version = version; }
        public String getFormat() { return format; }
        public void setFormat(String format) { this.format = format; }
    }

    public static class CurriculumSubjectExportData {
        private Long subjectId;
        private String name;
        private String code;
        private boolean isCore;
        private Integer allocatedHours;
        private Double weightPercentage;
        private String objectives;

        public CurriculumSubjectExportData() {}

        public CurriculumSubjectExportData(Long subjectId, String name, String code, boolean isCore, 
                                         Integer allocatedHours, Double weightPercentage, String objectives) {
            this.subjectId = subjectId;
            this.name = name;
            this.code = code;
            this.isCore = isCore;
            this.allocatedHours = allocatedHours;
            this.weightPercentage = weightPercentage;
            this.objectives = objectives;
        }

        // Getters and setters
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public boolean isCore() { return isCore; }
        public void setCore(boolean core) { isCore = core; }
        public Integer getAllocatedHours() { return allocatedHours; }
        public void setAllocatedHours(Integer allocatedHours) { this.allocatedHours = allocatedHours; }
        public Double getWeightPercentage() { return weightPercentage; }
        public void setWeightPercentage(Double weightPercentage) { this.weightPercentage = weightPercentage; }
        public String getObjectives() { return objectives; }
        public void setObjectives(String objectives) { this.objectives = objectives; }
    }

    public static class CurriculumUnitExportData {
        private String title;
        private String description;
        private Integer unitOrder;
        private Integer durationWeeks;
        private Integer allocatedHours;
        private String learningObjectives;
        private String assessmentCriteria;
        private List<CurriculumTopicExportData> topics;

        public CurriculumUnitExportData() {}

        public CurriculumUnitExportData(String title, String description, Integer unitOrder, Integer durationWeeks,
                                      Integer allocatedHours, String learningObjectives, String assessmentCriteria,
                                      List<CurriculumTopicExportData> topics) {
            this.title = title;
            this.description = description;
            this.unitOrder = unitOrder;
            this.durationWeeks = durationWeeks;
            this.allocatedHours = allocatedHours;
            this.learningObjectives = learningObjectives;
            this.assessmentCriteria = assessmentCriteria;
            this.topics = topics;
        }

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Integer getUnitOrder() { return unitOrder; }
        public void setUnitOrder(Integer unitOrder) { this.unitOrder = unitOrder; }
        public Integer getDurationWeeks() { return durationWeeks; }
        public void setDurationWeeks(Integer durationWeeks) { this.durationWeeks = durationWeeks; }
        public Integer getAllocatedHours() { return allocatedHours; }
        public void setAllocatedHours(Integer allocatedHours) { this.allocatedHours = allocatedHours; }
        public String getLearningObjectives() { return learningObjectives; }
        public void setLearningObjectives(String learningObjectives) { this.learningObjectives = learningObjectives; }
        public String getAssessmentCriteria() { return assessmentCriteria; }
        public void setAssessmentCriteria(String assessmentCriteria) { this.assessmentCriteria = assessmentCriteria; }
        public List<CurriculumTopicExportData> getTopics() { return topics; }
        public void setTopics(List<CurriculumTopicExportData> topics) { this.topics = topics; }
    }

    public static class CurriculumTopicExportData {
        private String title;
        private String description;
        private Integer topicOrder;
        private Integer durationHours;
        private String learningObjectives;
        private String activities;
        private String resources;
        private String assessmentMethods;

        public CurriculumTopicExportData() {}

        public CurriculumTopicExportData(String title, String description, Integer topicOrder, Integer durationHours,
                                       String learningObjectives, String activities, String resources, String assessmentMethods) {
            this.title = title;
            this.description = description;
            this.topicOrder = topicOrder;
            this.durationHours = durationHours;
            this.learningObjectives = learningObjectives;
            this.activities = activities;
            this.resources = resources;
            this.assessmentMethods = assessmentMethods;
        }

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Integer getTopicOrder() { return topicOrder; }
        public void setTopicOrder(Integer topicOrder) { this.topicOrder = topicOrder; }
        public Integer getDurationHours() { return durationHours; }
        public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }
        public String getLearningObjectives() { return learningObjectives; }
        public void setLearningObjectives(String learningObjectives) { this.learningObjectives = learningObjectives; }
        public String getActivities() { return activities; }
        public void setActivities(String activities) { this.activities = activities; }
        public String getResources() { return resources; }
        public void setResources(String resources) { this.resources = resources; }
        public String getAssessmentMethods() { return assessmentMethods; }
        public void setAssessmentMethods(String assessmentMethods) { this.assessmentMethods = assessmentMethods; }
    }

    @Override
    protected Long extractSchoolId(Curriculum entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Curriculum entity) {
        // Extract region from curriculum's region or school's region
        if (entity.getRegion() != null) {
            return entity.getRegion().getId();
        }
        if (entity.getSchool() != null && entity.getSchool().getRegion() != null) {
            return entity.getSchool().getRegion().getId();
        }
        return null;
    }
} 