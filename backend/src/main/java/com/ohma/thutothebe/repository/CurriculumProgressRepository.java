package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumProgress;
import com.ohma.thutothebe.entity.ImplementationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumProgressRepository extends JpaRepository<CurriculumProgress, Long> {

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.curriculum.id = :curriculumId AND cp.active = true")
    List<CurriculumProgress> findByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.school.id = :schoolId AND cp.active = true")
    List<CurriculumProgress> findBySchoolId(@Param("schoolId") Long schoolId);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.classEntity.id = :classId AND cp.active = true")
    List<CurriculumProgress> findByClassId(@Param("classId") Long classId);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.teacher.id = :teacherId AND cp.active = true")
    List<CurriculumProgress> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.implementationStatus = :status AND cp.active = true")
    List<CurriculumProgress> findByImplementationStatus(@Param("status") ImplementationStatus status);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.curriculum.id = :curriculumId AND cp.school.id = :schoolId AND cp.active = true")
    Optional<CurriculumProgress> findByCurriculumIdAndSchoolId(@Param("curriculumId") Long curriculumId, @Param("schoolId") Long schoolId);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.curriculum.id = :curriculumId AND cp.classEntity.id = :classId AND cp.active = true")
    Optional<CurriculumProgress> findByCurriculumIdAndClassId(@Param("curriculumId") Long curriculumId, @Param("classId") Long classId);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.progressPercentage >= :minPercentage AND cp.progressPercentage <= :maxPercentage AND cp.active = true")
    List<CurriculumProgress> findByProgressPercentageBetween(@Param("minPercentage") Double minPercentage, @Param("maxPercentage") Double maxPercentage);

    @Query("SELECT cp FROM CurriculumProgress cp WHERE cp.expectedCompletionDate < :date AND cp.implementationStatus != 'COMPLETED' AND cp.active = true")
    List<CurriculumProgress> findOverdueProgress(@Param("date") LocalDate date);

    @Query("SELECT AVG(cp.progressPercentage) FROM CurriculumProgress cp WHERE cp.curriculum.id = :curriculumId AND cp.active = true")
    Double getAverageProgressByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT COUNT(cp) FROM CurriculumProgress cp WHERE cp.curriculum.id = :curriculumId AND cp.implementationStatus = :status AND cp.active = true")
    Long countByCurriculumIdAndStatus(@Param("curriculumId") Long curriculumId, @Param("status") ImplementationStatus status);
} 