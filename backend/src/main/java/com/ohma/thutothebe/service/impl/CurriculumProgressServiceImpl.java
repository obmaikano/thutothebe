package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CreateCurriculumProgressRequest;
import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.dto.UpdateCurriculumProgressRequest;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.CurriculumProgressMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CurriculumProgressServiceImpl extends BaseServiceImpl<CurriculumProgress, CurriculumProgressDTO, Long> implements CurriculumProgressService {

    private final CurriculumProgressRepository curriculumProgressRepository;
    private final CurriculumRepository curriculumRepository;
    private final SchoolRepository schoolRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final CurriculumProgressMapper curriculumProgressMapper;
    private final CourseRepository courseRepository;

    @Autowired
    public CurriculumProgressServiceImpl(
            CurriculumProgressRepository curriculumProgressRepository,
            CurriculumRepository curriculumRepository,
            SchoolRepository schoolRepository,
            ClassRepository classRepository,
            UserRepository userRepository,
            CurriculumProgressMapper curriculumProgressMapper,
            CourseRepository courseRepository) {
        super(curriculumProgressRepository);
        this.curriculumProgressRepository = curriculumProgressRepository;
        this.curriculumRepository = curriculumRepository;
        this.schoolRepository = schoolRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.curriculumProgressMapper = curriculumProgressMapper;
        this.courseRepository = courseRepository;
    }

    @Override
    public CurriculumProgressDTO createCurriculumProgress(CreateCurriculumProgressRequest request) {
        // The DTO is designed for a different entity structure, so we'll create a basic progress entry
        Curriculum curriculum = curriculumRepository.findById(request.curriculumId())
                .orElseThrow(() -> new IllegalArgumentException("Curriculum not found"));
        
        // For now, we'll create a basic progress entry without school/class/teacher relationships
        // since the DTO doesn't provide these fields
        CurriculumProgress progress = new CurriculumProgress();
        progress.setCurriculum(curriculum);
        progress.setImplementationStatus(ImplementationStatus.NOT_STARTED);
        progress.setProgressPercentage(request.progressPercentage() != null ? request.progressPercentage().doubleValue() : 0.0);
        progress.setStartDate(request.startDate() != null ? request.startDate().toLocalDate() : LocalDate.now());
        progress.setLastUpdatedDate(LocalDate.now());
        progress.setNotes(request.notes());
        progress.setActive(true);

        // We need to set updatedBy, but the DTO doesn't provide it
        // For now, we'll use a default user or throw an exception
        throw new UnsupportedOperationException("CreateCurriculumProgressRequest DTO is not compatible with CurriculumProgress entity structure. Please use initializeProgress method instead.");
    }

    @Override
    public CurriculumProgressDTO updateCurriculumProgress(Long id, UpdateCurriculumProgressRequest request) {
        CurriculumProgress progress = curriculumProgressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        // The DTO is designed for a different entity structure, so we'll only update the fields that match
        if (request.progressPercentage() != null) {
            progress.setProgressPercentage(request.progressPercentage().doubleValue());
        }

        if (request.startDate() != null) {
            progress.setStartDate(request.startDate().toLocalDate());
        }

        if (request.status() != null) {
            try {
                ImplementationStatus status = ImplementationStatus.valueOf(request.status().toUpperCase());
                progress.setImplementationStatus(status);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + request.status());
            }
        }

        if (request.notes() != null) {
            progress.setNotes(request.notes());
        }

        if (request.active() != null) {
            progress.setActive(request.active());
        }

        progress.setLastUpdatedDate(LocalDate.now());

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public List<CurriculumProgressDTO> findByCurriculumId(Long curriculumId) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByCurriculumId(curriculumId);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public List<CurriculumProgressDTO> findBySchoolId(Long schoolId) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findBySchoolId(schoolId);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public List<CurriculumProgressDTO> findByClassId(Long classId) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByClassId(classId);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public List<CurriculumProgressDTO> findByTeacherId(Long teacherId) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByTeacherId(teacherId);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public CurriculumProgressDTO findByCurriculumIdAndSchoolId(Long curriculumId, Long schoolId) {
        Optional<CurriculumProgress> progress = curriculumProgressRepository.findByCurriculumIdAndSchoolId(curriculumId, schoolId);
        return progress.map(curriculumProgressMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));
    }

    @Override
    public CurriculumProgressDTO findByCurriculumIdAndClassId(Long curriculumId, Long classId) {
        Optional<CurriculumProgress> progress = curriculumProgressRepository.findByCurriculumIdAndClassId(curriculumId, classId);
        return progress.map(curriculumProgressMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));
    }

    @Override
    public List<CurriculumProgressDTO> findByImplementationStatus(ImplementationStatus status) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByImplementationStatus(status);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public List<CurriculumProgressDTO> findByProgressPercentageBetween(Double minPercentage, Double maxPercentage) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findByProgressPercentageBetween(minPercentage, maxPercentage);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public List<CurriculumProgressDTO> findOverdueProgress(LocalDate date) {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findOverdueProgress(date);
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public Double getAverageProgressByCurriculumId(Long curriculumId) {
        return curriculumProgressRepository.getAverageProgressByCurriculumId(curriculumId);
    }

    @Override
    public Long countByCurriculumIdAndStatus(Long curriculumId, ImplementationStatus status) {
        return curriculumProgressRepository.countByCurriculumIdAndStatus(curriculumId, status);
    }

    @Override
    public CurriculumProgressDTO updateImplementationStatus(Long progressId, ImplementationStatus status, Double progressPercentage, Long updatedById) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        progress.setImplementationStatus(status);
        if (progressPercentage != null) {
            progress.setProgressPercentage(progressPercentage);
        }
        progress.setLastUpdatedDate(LocalDate.now());
        
        User updatedBy = userRepository.findById(updatedById)
                .orElseThrow(() -> new IllegalArgumentException("Updated by user not found"));
        progress.setUpdatedBy(updatedBy);

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public CurriculumProgressDTO addNotes(Long progressId, String notes, String challenges, String achievements, Long updatedById) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        if (notes != null) {
            progress.setNotes(notes);
        }
        if (challenges != null) {
            progress.setChallenges(challenges);
        }
        if (achievements != null) {
            progress.setAchievements(achievements);
        }
        progress.setLastUpdatedDate(LocalDate.now());
        
        User updatedBy = userRepository.findById(updatedById)
                .orElseThrow(() -> new IllegalArgumentException("Updated by user not found"));
        progress.setUpdatedBy(updatedBy);

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public CurriculumProgressDTO initializeProgress(Long curriculumId, Long schoolId, Long classId, Long teacherId, LocalDate expectedCompletionDate, Long updatedById) {
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum not found"));
        
        School school = null;
        if (schoolId != null) {
            school = schoolRepository.findById(schoolId)
                    .orElseThrow(() -> new IllegalArgumentException("School not found"));
        }
        
        com.ohma.thutothebe.entity.Class classEntity = null;
        if (classId != null) {
            classEntity = classRepository.findById(classId)
                    .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        }
        
        User teacher = null;
        if (teacherId != null) {
            teacher = userRepository.findById(teacherId)
                    .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
        }
        
        User updatedBy = userRepository.findById(updatedById)
                .orElseThrow(() -> new IllegalArgumentException("Updated by user not found"));

        CurriculumProgress progress = new CurriculumProgress();
        progress.setCurriculum(curriculum);
        progress.setSchool(school);
        progress.setClassEntity(classEntity);
        progress.setTeacher(teacher);
        progress.setImplementationStatus(ImplementationStatus.NOT_STARTED);
        progress.setProgressPercentage(0.0);
        progress.setExpectedCompletionDate(expectedCompletionDate);
        progress.setLastUpdatedDate(LocalDate.now());
        progress.setUpdatedBy(updatedBy);
        progress.setActive(true);

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    // Placeholder implementations for methods that don't match the entity structure
    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByStudentId(Long studentId) {
        // CurriculumProgress doesn't have student relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCourseId(Long courseId) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCurriculumId(Long curriculumId) {
        return findByCurriculumId(curriculumId);
    }

    @Override
    public CurriculumProgressDTO getCurriculumProgressByStudentIdAndCourseId(Long studentId, Long courseId) {
        // CurriculumProgress doesn't have student relationship
        throw new UnsupportedOperationException("Student relationship not supported in CurriculumProgress");
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByStatus(String status) {
        try {
            ImplementationStatus implementationStatus = ImplementationStatus.valueOf(status.toUpperCase());
            return findByImplementationStatus(implementationStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByStudentIdAndStatus(Long studentId, String status) {
        // CurriculumProgress doesn't have student relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndStatus(Long courseId, String status) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public Long countCurriculumProgressByStudentId(Long studentId) {
        // CurriculumProgress doesn't have student relationship
        return 0L;
    }

    @Override
    public Long countCurriculumProgressByCourseId(Long courseId) {
        // CurriculumProgress doesn't have course relationship
        return 0L;
    }

    @Override
    public Long countCurriculumProgressByStudentIdAndStatus(Long studentId, String status) {
        // CurriculumProgress doesn't have student relationship
        return 0L;
    }

    @Override
    public Long countCurriculumProgressByCourseIdAndStatus(Long courseId, String status) {
        // CurriculumProgress doesn't have course relationship
        return 0L;
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByProgressPercentageBetween(Double minPercentage, Double maxPercentage) {
        return findByProgressPercentageBetween(minPercentage, maxPercentage);
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByStudentIdAndProgressPercentageBetween(Long studentId, Double minPercentage, Double maxPercentage) {
        // CurriculumProgress doesn't have student relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndProgressPercentageBetween(Long courseId, Double minPercentage, Double maxPercentage) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCompletedCurriculumProgressByStudentId(Long studentId) {
        // CurriculumProgress doesn't have student relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCompletedCurriculumProgressByCourseId(Long courseId) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndScoreAbove(Long courseId, Double score) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndScoreBelow(Long courseId, Double score) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndScoreBetween(Long courseId, Double minScore, Double maxScore) {
        // CurriculumProgress doesn't have course relationship
        return List.of();
    }

    @Override
    public CurriculumProgressDTO startProgress(Long studentId, Long curriculumId, Long courseId) {
        // CurriculumProgress doesn't have student relationship
        throw new UnsupportedOperationException("Student relationship not supported in CurriculumProgress");
    }

    @Override
    public CurriculumProgressDTO updateProgressPercentage(Long progressId, Double percentage) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        progress.setProgressPercentage(percentage);
        progress.setLastUpdatedDate(LocalDate.now());

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public CurriculumProgressDTO completeProgress(Long progressId, Double finalScore) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        progress.setImplementationStatus(ImplementationStatus.COMPLETED);
        progress.setProgressPercentage(finalScore != null ? finalScore : 100.0);
        progress.setActualCompletionDate(LocalDate.now());
        progress.setLastUpdatedDate(LocalDate.now());

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public CurriculumProgressDTO pauseProgress(Long progressId, String reason) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        progress.setImplementationStatus(ImplementationStatus.ON_HOLD);
        progress.setNotes(reason);
        progress.setLastUpdatedDate(LocalDate.now());

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public CurriculumProgressDTO resumeProgress(Long progressId) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        progress.setImplementationStatus(ImplementationStatus.IN_PROGRESS);
        progress.setLastUpdatedDate(LocalDate.now());

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public CurriculumProgressDTO dropProgress(Long progressId, String reason) {
        CurriculumProgress progress = curriculumProgressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));

        progress.setImplementationStatus(ImplementationStatus.CANCELLED);
        progress.setNotes(reason);
        progress.setLastUpdatedDate(LocalDate.now());

        CurriculumProgress savedProgress = curriculumProgressRepository.save(progress);
        return curriculumProgressMapper.toDto(savedProgress);
    }

    @Override
    public Map<String, Object> getCurriculumProgressAnalytics(Long courseId) {
        // CurriculumProgress doesn't have course relationship
        return Map.of(
            "totalProgress", 0L,
            "inProgressCount", 0L,
            "completedCount", 0L,
            "averageProgress", 0.0
        );
    }

    @Override
    public Map<String, Object> getStudentCurriculumProgressAnalytics(Long studentId, String startDate, String endDate) {
        // CurriculumProgress doesn't have student relationship
        return Map.of(
            "totalProgress", 0L,
            "inProgressCount", 0L,
            "completedCount", 0L,
            "averageProgress", 0.0
        );
    }

    @Override
    public Map<String, Object> getCurriculumProgressAnalyticsByCurriculum(Long curriculumId) {
        Long totalProgress = curriculumProgressRepository.countByCurriculumIdAndStatus(curriculumId, null);
        Long inProgressCount = curriculumProgressRepository.countByCurriculumIdAndStatus(curriculumId, ImplementationStatus.IN_PROGRESS);
        Long completedCount = curriculumProgressRepository.countByCurriculumIdAndStatus(curriculumId, ImplementationStatus.COMPLETED);
        Double averageProgress = curriculumProgressRepository.getAverageProgressByCurriculumId(curriculumId);

        return Map.of(
            "curriculumId", curriculumId,
            "totalProgress", totalProgress,
            "inProgressCount", inProgressCount,
            "completedCount", completedCount,
            "averageProgress", averageProgress != null ? averageProgress : 0.0
        );
    }

    // BaseServiceImpl abstract methods
    @Override
    protected CurriculumProgress mapToEntity(CurriculumProgressDTO dto) {
        // This method is not used in this implementation since we use direct entity operations
        throw new UnsupportedOperationException("mapToEntity not implemented for CurriculumProgress");
    }

    @Override
    protected CurriculumProgressDTO mapToDto(CurriculumProgress entity) {
        return curriculumProgressMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumProgress entity, CurriculumProgressDTO dto) {
        // This method is not used in this implementation since we use direct entity operations
        throw new UnsupportedOperationException("updateEntity not implemented for CurriculumProgress");
    }

    @Override
    protected Long extractSchoolId(CurriculumProgress entity) {
        return entity.getSchool() != null ? entity.getSchool().getId() : null;
    }

    @Override
    protected Long extractRegionId(CurriculumProgress entity) {
        // CurriculumProgress doesn't have a direct region relationship
        // Return null or implement based on school's region if needed
        return null;
    }

    // Missing methods from CurriculumProgressService interface
    @Override
    public List<CurriculumProgressDTO> getAllCurriculumProgress() {
        List<CurriculumProgress> progressList = curriculumProgressRepository.findAll();
        return curriculumProgressMapper.toDtoList(progressList);
    }

    @Override
    public CurriculumProgressDTO getCurriculumProgressById(Long id) {
        CurriculumProgress progress = curriculumProgressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));
        return curriculumProgressMapper.toDto(progress);
    }

    @Override
    public void deleteCurriculumProgress(Long id) {
        CurriculumProgress progress = curriculumProgressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum progress not found"));
        progress.setActive(false);
        curriculumProgressRepository.save(progress);
    }
} 