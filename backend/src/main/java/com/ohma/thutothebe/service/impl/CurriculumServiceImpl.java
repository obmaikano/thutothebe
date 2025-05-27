package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CurriculumMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumServiceImpl extends BaseServiceImpl<Curriculum, CurriculumDTO, Long> implements CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final CurriculumMapper curriculumMapper;
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
} 