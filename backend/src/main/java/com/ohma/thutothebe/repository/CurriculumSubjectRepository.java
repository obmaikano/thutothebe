package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumSubjectRepository extends JpaRepository<CurriculumSubject, Long> {

    @Query("SELECT cs FROM CurriculumSubject cs WHERE cs.curriculum.id = :curriculumId AND cs.active = true")
    List<CurriculumSubject> findByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cs FROM CurriculumSubject cs WHERE cs.subject.id = :subjectId AND cs.active = true")
    List<CurriculumSubject> findBySubjectId(@Param("subjectId") Long subjectId);

    @Query("SELECT cs FROM CurriculumSubject cs WHERE cs.curriculum.id = :curriculumId AND cs.subject.id = :subjectId AND cs.active = true")
    Optional<CurriculumSubject> findByCurriculumIdAndSubjectId(@Param("curriculumId") Long curriculumId, @Param("subjectId") Long subjectId);

    @Query("SELECT cs FROM CurriculumSubject cs WHERE cs.curriculum.id = :curriculumId AND cs.isCore = :isCore AND cs.active = true")
    List<CurriculumSubject> findByCurriculumIdAndIsCore(@Param("curriculumId") Long curriculumId, @Param("isCore") boolean isCore);

    @Query("SELECT cs FROM CurriculumSubject cs WHERE cs.isCore = true AND cs.active = true")
    List<CurriculumSubject> findAllCoreSubjects();

    @Query("SELECT cs FROM CurriculumSubject cs WHERE cs.isCore = false AND cs.active = true")
    List<CurriculumSubject> findAllElectiveSubjects();

    @Query("SELECT SUM(cs.allocatedHours) FROM CurriculumSubject cs WHERE cs.curriculum.id = :curriculumId AND cs.active = true")
    Integer getTotalAllocatedHoursByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT SUM(cs.weightPercentage) FROM CurriculumSubject cs WHERE cs.curriculum.id = :curriculumId AND cs.active = true")
    Double getTotalWeightPercentageByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT CASE WHEN COUNT(cs) > 0 THEN true ELSE false END FROM CurriculumSubject cs WHERE cs.curriculum.id = :curriculumId AND cs.subject.id = :subjectId AND cs.active = true")
    boolean existsByCurriculumIdAndSubjectId(@Param("curriculumId") Long curriculumId, @Param("subjectId") Long subjectId);
} 