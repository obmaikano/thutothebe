package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumTeacherRepository extends JpaRepository<CurriculumTeacher, Long> {

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.active = true")
    List<CurriculumTeacher> findByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.teacher.id = :teacherId AND ct.active = true")
    List<CurriculumTeacher> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.teacher.id = :teacherId AND ct.active = true")
    Optional<CurriculumTeacher> findByCurriculumIdAndTeacherId(@Param("curriculumId") Long curriculumId, @Param("teacherId") Long teacherId);

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.isPrimary = true AND ct.active = true")
    List<CurriculumTeacher> findPrimaryTeachersByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.subject.id = :subjectId AND ct.active = true")
    List<CurriculumTeacher> findBySubjectId(@Param("subjectId") Long subjectId);

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.subject.id = :subjectId AND ct.active = true")
    List<CurriculumTeacher> findByCurriculumIdAndSubjectId(@Param("curriculumId") Long curriculumId, @Param("subjectId") Long subjectId);

    @Query("SELECT ct FROM CurriculumTeacher ct WHERE ct.teacher.id = :teacherId AND ct.subject.id = :subjectId AND ct.active = true")
    List<CurriculumTeacher> findByTeacherIdAndSubjectId(@Param("teacherId") Long teacherId, @Param("subjectId") Long subjectId);

    @Query("SELECT COUNT(ct) FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.active = true")
    Long countByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT COUNT(ct) FROM CurriculumTeacher ct WHERE ct.teacher.id = :teacherId AND ct.active = true")
    Long countByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT CASE WHEN COUNT(ct) > 0 THEN true ELSE false END FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.teacher.id = :teacherId AND ct.active = true")
    boolean existsByCurriculumIdAndTeacherId(@Param("curriculumId") Long curriculumId, @Param("teacherId") Long teacherId);

    @Query("SELECT SUM(ct.responsibilityPercentage) FROM CurriculumTeacher ct WHERE ct.curriculum.id = :curriculumId AND ct.active = true")
    Double getTotalResponsibilityPercentageByCurriculumId(@Param("curriculumId") Long curriculumId);
} 