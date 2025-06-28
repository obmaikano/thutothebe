package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CreateCurriculumProgressRequest;
import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.dto.UpdateCurriculumProgressRequest;
import com.ohma.thutothebe.entity.ImplementationStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CurriculumProgressService extends BaseService<CurriculumProgressDTO, Long> {

    // Additional methods for controller
    List<CurriculumProgressDTO> getAllCurriculumProgress();
    
    CurriculumProgressDTO getCurriculumProgressById(Long id);
    
    CurriculumProgressDTO createCurriculumProgress(CreateCurriculumProgressRequest request);
    
    CurriculumProgressDTO updateCurriculumProgress(Long id, UpdateCurriculumProgressRequest request);
    
    void deleteCurriculumProgress(Long id);

    // Existing methods
    List<CurriculumProgressDTO> findByCurriculumId(Long curriculumId);

    List<CurriculumProgressDTO> findBySchoolId(Long schoolId);

    List<CurriculumProgressDTO> findByClassId(Long classId);

    List<CurriculumProgressDTO> findByTeacherId(Long teacherId);

    List<CurriculumProgressDTO> findByImplementationStatus(ImplementationStatus status);

    CurriculumProgressDTO findByCurriculumIdAndSchoolId(Long curriculumId, Long schoolId);

    CurriculumProgressDTO findByCurriculumIdAndClassId(Long curriculumId, Long classId);

    List<CurriculumProgressDTO> findByProgressPercentageBetween(Double minPercentage, Double maxPercentage);

    List<CurriculumProgressDTO> findOverdueProgress(LocalDate date);

    Double getAverageProgressByCurriculumId(Long curriculumId);

    Long countByCurriculumIdAndStatus(Long curriculumId, ImplementationStatus status);

    CurriculumProgressDTO updateImplementationStatus(Long progressId, ImplementationStatus status, Double progressPercentage, Long updatedById);

    CurriculumProgressDTO addNotes(Long progressId, String notes, String challenges, String achievements, Long updatedById);

    CurriculumProgressDTO initializeProgress(Long curriculumId, Long schoolId, Long classId, Long teacherId, LocalDate expectedCompletionDate, Long updatedById);
    
    // Additional methods for controller
    List<CurriculumProgressDTO> getCurriculumProgressByStudentId(Long studentId);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCourseId(Long courseId);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCurriculumId(Long curriculumId);
    
    CurriculumProgressDTO getCurriculumProgressByStudentIdAndCourseId(Long studentId, Long courseId);
    
    List<CurriculumProgressDTO> getCurriculumProgressByStatus(String status);
    
    List<CurriculumProgressDTO> getCurriculumProgressByStudentIdAndStatus(Long studentId, String status);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndStatus(Long courseId, String status);
    
    Long countCurriculumProgressByStudentId(Long studentId);
    
    Long countCurriculumProgressByCourseId(Long courseId);
    
    Long countCurriculumProgressByStudentIdAndStatus(Long studentId, String status);
    
    Long countCurriculumProgressByCourseIdAndStatus(Long courseId, String status);
    
    List<CurriculumProgressDTO> getCurriculumProgressByProgressPercentageBetween(Double minPercentage, Double maxPercentage);
    
    List<CurriculumProgressDTO> getCurriculumProgressByStudentIdAndProgressPercentageBetween(Long studentId, Double minPercentage, Double maxPercentage);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndProgressPercentageBetween(Long courseId, Double minPercentage, Double maxPercentage);
    
    List<CurriculumProgressDTO> getCompletedCurriculumProgressByStudentId(Long studentId);
    
    List<CurriculumProgressDTO> getCompletedCurriculumProgressByCourseId(Long courseId);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndScoreAbove(Long courseId, Double score);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndScoreBelow(Long courseId, Double score);
    
    List<CurriculumProgressDTO> getCurriculumProgressByCourseIdAndScoreBetween(Long courseId, Double minScore, Double maxScore);
    
    // Progress management methods
    CurriculumProgressDTO startProgress(Long studentId, Long curriculumId, Long courseId);
    
    CurriculumProgressDTO updateProgressPercentage(Long progressId, Double percentage);
    
    CurriculumProgressDTO completeProgress(Long progressId, Double finalScore);
    
    CurriculumProgressDTO pauseProgress(Long progressId, String reason);
    
    CurriculumProgressDTO resumeProgress(Long progressId);
    
    CurriculumProgressDTO dropProgress(Long progressId, String reason);
    
    // Analytics methods
    Map<String, Object> getCurriculumProgressAnalytics(Long courseId);
    
    Map<String, Object> getStudentCurriculumProgressAnalytics(Long studentId, String startDate, String endDate);
    
    Map<String, Object> getCurriculumProgressAnalyticsByCurriculum(Long curriculumId);
} 