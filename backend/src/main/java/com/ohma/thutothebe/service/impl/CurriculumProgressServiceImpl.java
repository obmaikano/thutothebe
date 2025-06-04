package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.CurriculumProgressMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumProgressService;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumProgressServiceImpl extends BaseServiceImpl<CurriculumProgress, CurriculumProgressDTO, Long> implements CurriculumProgressService {

    private static final String PROGRESS_CACHE = "curriculumProgress";

    private final CurriculumProgressRepository curriculumProgressRepository;
    private final CurriculumRepository curriculumRepository;
    private final SchoolRepository schoolRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final CurriculumProgressMapper curriculumProgressMapper;

    @Autowired
    public CurriculumProgressServiceImpl(
            CurriculumProgressRepository curriculumProgressRepository,
            CurriculumRepository curriculumRepository,
            SchoolRepository schoolRepository,
            ClassRepository classRepository,
            UserRepository userRepository,
            CurriculumProgressMapper curriculumProgressMapper) {
        super(curriculumProgressRepository);
        this.curriculumProgressRepository = curriculumProgressRepository;
        this.curriculumRepository = curriculumRepository;
        this.schoolRepository = schoolRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.curriculumProgressMapper = curriculumProgressMapper;
    }

    @Override
    protected CurriculumProgress mapToEntity(CurriculumProgressDTO dto) {
        return curriculumProgressMapper.toEntity(dto);
    }

    @Override
    protected CurriculumProgressDTO mapToDto(CurriculumProgress entity) {
        return curriculumProgressMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumProgress entity, CurriculumProgressDTO dto) {
        entity.setImplementationStatus(dto.implementationStatus());
        entity.setProgressPercentage(dto.progressPercentage());
        entity.setStartDate(dto.startDate());
        entity.setExpectedCompletionDate(dto.expectedCompletionDate());
        entity.setActualCompletionDate(dto.actualCompletionDate());
        entity.setLastUpdatedDate(dto.lastUpdatedDate());
        entity.setNotes(dto.notes());
        entity.setChallenges(dto.challenges());
        entity.setAchievements(dto.achievements());
        entity.setActive(dto.active());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = PROGRESS_CACHE, key = "#curriculumId + '_curriculum'")
    public List<CurriculumProgressDTO> findByCurriculumId(@NotNull @Positive Long curriculumId) {
        log.debug("Finding progress by curriculum ID: {}", curriculumId);
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByCurriculumId(curriculumId);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = PROGRESS_CACHE, key = "#schoolId + '_school'")
    public List<CurriculumProgressDTO> findBySchoolId(@NotNull @Positive Long schoolId) {
        log.debug("Finding progress by school ID: {}", schoolId);
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findBySchoolId(schoolId);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = PROGRESS_CACHE, key = "#classId + '_class'")
    public List<CurriculumProgressDTO> findByClassId(@NotNull @Positive Long classId) {
        log.debug("Finding progress by class ID: {}", classId);
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByClassId(classId);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = PROGRESS_CACHE, key = "#teacherId + '_teacher'")
    public List<CurriculumProgressDTO> findByTeacherId(@NotNull @Positive Long teacherId) {
        log.debug("Finding progress by teacher ID: {}", teacherId);
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByTeacherId(teacherId);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = PROGRESS_CACHE, key = "#status + '_status'")
    public List<CurriculumProgressDTO> findByImplementationStatus(@NotNull ImplementationStatus status) {
        log.debug("Finding progress by implementation status: {}", status);
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByImplementationStatus(status);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CurriculumProgressDTO findByCurriculumIdAndSchoolId(@NotNull @Positive Long curriculumId, @NotNull @Positive Long schoolId) {
        log.debug("Finding progress by curriculum ID: {} and school ID: {}", curriculumId, schoolId);
        
        Optional<CurriculumProgress> progress = curriculumProgressRepository.findByCurriculumIdAndSchoolId(curriculumId, schoolId);
        return progress.map(curriculumProgressMapper::toDto).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public CurriculumProgressDTO findByCurriculumIdAndClassId(@NotNull @Positive Long curriculumId, @NotNull @Positive Long classId) {
        log.debug("Finding progress by curriculum ID: {} and class ID: {}", curriculumId, classId);
        
        Optional<CurriculumProgress> progress = curriculumProgressRepository.findByCurriculumIdAndClassId(curriculumId, classId);
        return progress.map(curriculumProgressMapper::toDto).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumProgressDTO> findByProgressPercentageBetween(@NotNull Double minPercentage, @NotNull Double maxPercentage) {
        log.debug("Finding progress between {}% and {}%", minPercentage, maxPercentage);
        
        if (minPercentage < 0 || maxPercentage > 100 || minPercentage > maxPercentage) {
            throw new IllegalArgumentException("Invalid percentage range");
        }
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByProgressPercentageBetween(minPercentage, maxPercentage);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumProgressDTO> findOverdueProgress(@NotNull LocalDate date) {
        log.debug("Finding overdue progress as of date: {}", date);
        
        List<CurriculumProgress> progressList = curriculumProgressRepository.findOverdueProgress(date);
        return progressList.stream()
                .map(curriculumProgressMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageProgressByCurriculumId(@NotNull @Positive Long curriculumId) {
        log.debug("Getting average progress for curriculum ID: {}", curriculumId);
        
        Double average = curriculumProgressRepository.getAverageProgressByCurriculumId(curriculumId);
        return average != null ? average : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByCurriculumIdAndStatus(@NotNull @Positive Long curriculumId, @NotNull ImplementationStatus status) {
        log.debug("Counting progress for curriculum ID: {} with status: {}", curriculumId, status);
        
        Long count = curriculumProgressRepository.countByCurriculumIdAndStatus(curriculumId, status);
        return count != null ? count : 0L;
    }

    @Override
    @Transactional
    @CacheEvict(value = PROGRESS_CACHE, allEntries = true)
    public CurriculumProgressDTO updateImplementationStatus(@NotNull @Positive Long progressId, 
            @NotNull ImplementationStatus status, Double progressPercentage, @NotNull @Positive Long updatedById) {
        log.info("Updating implementation status for progress ID: {} to status: {}", progressId, status);
        
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found with ID: " + progressId));
        
        User updatedBy = userRepository.findById(updatedById)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + updatedById));
        
        progress.setImplementationStatus(status);
        progress.setLastUpdatedDate(LocalDate.now());
        progress.setUpdatedBy(updatedBy);
        
        if (progressPercentage != null) {
            if (progressPercentage < 0 || progressPercentage > 100) {
                throw new IllegalArgumentException("Progress percentage must be between 0 and 100");
            }
            progress.setProgressPercentage(progressPercentage);
        }
        
        // Set completion date if status is COMPLETED
        if (status == ImplementationStatus.COMPLETED && progress.getActualCompletionDate() == null) {
            progress.setActualCompletionDate(LocalDate.now());
            progress.setProgressPercentage(100.0);
        }
        
        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    @Transactional
    @CacheEvict(value = PROGRESS_CACHE, allEntries = true)
    public CurriculumProgressDTO addNotes(@NotNull @Positive Long progressId, String notes, String challenges, 
            String achievements, @NotNull @Positive Long updatedById) {
        log.info("Adding notes to progress ID: {}", progressId);
        
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Progress not found with ID: " + progressId));
        
        User updatedBy = userRepository.findById(updatedById)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + updatedById));
        
        progress.setNotes(notes);
        progress.setChallenges(challenges);
        progress.setAchievements(achievements);
        progress.setLastUpdatedDate(LocalDate.now());
        progress.setUpdatedBy(updatedBy);
        
        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    @Transactional
    @CacheEvict(value = PROGRESS_CACHE, allEntries = true)
    public CurriculumProgressDTO initializeProgress(@NotNull @Positive Long curriculumId, Long schoolId, 
            Long classId, Long teacherId, LocalDate expectedCompletionDate, @NotNull @Positive Long updatedById) {
        log.info("Initializing progress for curriculum ID: {}", curriculumId);
        
        // Validate required entities
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum not found with ID: " + curriculumId));
        
        User updatedBy = userRepository.findById(updatedById)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + updatedById));
        
        CurriculumProgress progress = new CurriculumProgress();
        progress.setCurriculum(curriculum);
        progress.setImplementationStatus(ImplementationStatus.NOT_STARTED);
        progress.setProgressPercentage(0.0);
        progress.setStartDate(LocalDate.now());
        progress.setExpectedCompletionDate(expectedCompletionDate);
        progress.setLastUpdatedDate(LocalDate.now());
        progress.setUpdatedBy(updatedBy);
        progress.setActive(true);
        
        // Set optional entities
        if (schoolId != null) {
            School school = schoolRepository.findById(schoolId)
                    .orElseThrow(() -> new IllegalArgumentException("School not found with ID: " + schoolId));
            progress.setSchool(school);
        }
        
        if (classId != null) {
            com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
                    .orElseThrow(() -> new IllegalArgumentException("Class not found with ID: " + classId));
            progress.setClassEntity(classEntity);
        }
        
        if (teacherId != null) {
            User teacher = userRepository.findById(teacherId)
                    .orElseThrow(() -> new IllegalArgumentException("Teacher not found with ID: " + teacherId));
            progress.setTeacher(teacher);
        }
        
        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    protected Long extractSchoolId(CurriculumProgress entity) {
        // Extract school from direct school relationship, class entity, or curriculum
        if (entity.getSchool() != null) {
            return entity.getSchool().getId();
        }
        if (entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null) {
            return entity.getClassEntity().getSchool().getId();
        }
        if (entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null) {
            return entity.getCurriculum().getSchool().getId();
        }
        return null;
    }
    
    @Override
    protected Long extractRegionId(CurriculumProgress entity) {
        // Extract region from school's region, class's school region, or curriculum's region
        if (entity.getSchool() != null && entity.getSchool().getRegion() != null) {
            return entity.getSchool().getRegion().getId();
        }
        if (entity.getClassEntity() != null && entity.getClassEntity().getSchool() != null && entity.getClassEntity().getSchool().getRegion() != null) {
            return entity.getClassEntity().getSchool().getRegion().getId();
        }
        if (entity.getCurriculum() != null && entity.getCurriculum().getRegion() != null) {
            return entity.getCurriculum().getRegion().getId();
        }
        if (entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null && entity.getCurriculum().getSchool().getRegion() != null) {
            return entity.getCurriculum().getSchool().getRegion().getId();
        }
        return null;
    }
} 