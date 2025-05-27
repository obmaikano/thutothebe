package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumSubjectDTO;

import java.util.List;

public interface CurriculumSubjectService extends BaseService<CurriculumSubjectDTO, Long> {

    List<CurriculumSubjectDTO> findByCurriculumId(Long curriculumId);

    List<CurriculumSubjectDTO> findBySubjectId(Long subjectId);

    CurriculumSubjectDTO findByCurriculumIdAndSubjectId(Long curriculumId, Long subjectId);

    List<CurriculumSubjectDTO> findByCurriculumIdAndIsCore(Long curriculumId, boolean isCore);

    List<CurriculumSubjectDTO> findAllCoreSubjects();

    List<CurriculumSubjectDTO> findAllElectiveSubjects();

    Integer getTotalAllocatedHoursByCurriculumId(Long curriculumId);

    Double getTotalWeightPercentageByCurriculumId(Long curriculumId);

    boolean existsByCurriculumIdAndSubjectId(Long curriculumId, Long subjectId);
} 