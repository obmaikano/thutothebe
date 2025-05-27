package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.entity.ImplementationStatus;

import java.time.LocalDate;
import java.util.List;

public interface CurriculumProgressService extends BaseService<CurriculumProgressDTO, Long> {

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
} 