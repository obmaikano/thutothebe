package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.entity.CurriculumStatus;
import com.ohma.thutothebe.entity.CurriculumType;
import com.ohma.thutothebe.entity.enums.GradeLevel;

import java.time.LocalDate;
import java.util.List;

public interface CurriculumService extends BaseService<CurriculumDTO, Long> {

    List<CurriculumDTO> findAllActive();

    List<CurriculumDTO> findByStatus(CurriculumStatus status);

    List<CurriculumDTO> findByCurriculumType(CurriculumType type);

    List<CurriculumDTO> findByGradeLevel(GradeLevel gradeLevel);

    List<CurriculumDTO> findByAcademicYear(Integer academicYear);

    List<CurriculumDTO> findByRegionId(Long regionId);

    List<CurriculumDTO> findBySchoolId(Long schoolId);

    List<CurriculumDTO> findByCreatedById(Long createdById);

    List<CurriculumDTO> findByGradeLevelAndType(GradeLevel gradeLevel, CurriculumType type);

    List<CurriculumDTO> findEffectiveOnDate(LocalDate date);

    List<CurriculumDTO> findByTitleContaining(String title);

    List<CurriculumDTO> findByApprovedById(Long approvedById);

    List<CurriculumDTO> findByStatusAndGradeLevelAndAcademicYear(CurriculumStatus status, GradeLevel gradeLevel, Integer academicYear);

    boolean existsByTitleAndGradeLevelAndAcademicYear(String title, GradeLevel gradeLevel, Integer academicYear);

    List<CurriculumDTO> findByRegionAndGradeLevelAndAcademicYear(Long regionId, GradeLevel gradeLevel, Integer academicYear);

    CurriculumDTO approveCurriculum(Long curriculumId, Long approvedById);

    CurriculumDTO activateCurriculum(Long curriculumId);

    CurriculumDTO suspendCurriculum(Long curriculumId);

    CurriculumDTO archiveCurriculum(Long curriculumId);

    CurriculumDTO addSubjectToCurriculum(Long curriculumId, Long subjectId, boolean isCore, Integer allocatedHours, Double weightPercentage);

    CurriculumDTO removeSubjectFromCurriculum(Long curriculumId, Long subjectId);

    CurriculumDTO assignTeacherToCurriculum(Long curriculumId, Long teacherId, Long subjectId, boolean isPrimary, Double responsibilityPercentage);

    CurriculumDTO removeTeacherFromCurriculum(Long curriculumId, Long teacherId);

    CurriculumDTO createCurriculumUnit(Long curriculumId, String title, String description, Integer unitOrder, Integer durationWeeks, Integer allocatedHours);

    CurriculumDTO createCurriculumTopic(Long curriculumUnitId, String title, String description, Integer topicOrder, Integer durationHours);

    List<CurriculumDTO> getCurriculumRecommendations(GradeLevel gradeLevel, CurriculumType type, Long regionId);

    void validateCurriculumAlignment(Long curriculumId, Long regionId);

    CurriculumDTO duplicateCurriculum(Long curriculumId, String newTitle, Integer newAcademicYear);
} 