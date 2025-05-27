package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Curriculum;
import com.ohma.thutothebe.entity.CurriculumStatus;
import com.ohma.thutothebe.entity.CurriculumType;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Long> {

    @Query("SELECT c FROM Curriculum c WHERE c.active = true")
    List<Curriculum> findAllActive();

    @Query("SELECT c FROM Curriculum c WHERE c.status = :status AND c.active = true")
    List<Curriculum> findByStatus(@Param("status") CurriculumStatus status);

    @Query("SELECT c FROM Curriculum c WHERE c.curriculumType = :type AND c.active = true")
    List<Curriculum> findByCurriculumType(@Param("type") CurriculumType type);

    @Query("SELECT c FROM Curriculum c WHERE c.gradeLevel = :gradeLevel AND c.active = true")
    List<Curriculum> findByGradeLevel(@Param("gradeLevel") GradeLevel gradeLevel);

    @Query("SELECT c FROM Curriculum c WHERE c.academicYear = :academicYear AND c.active = true")
    List<Curriculum> findByAcademicYear(@Param("academicYear") Integer academicYear);

    @Query("SELECT c FROM Curriculum c WHERE c.region.id = :regionId AND c.active = true")
    List<Curriculum> findByRegionId(@Param("regionId") Long regionId);

    @Query("SELECT c FROM Curriculum c WHERE c.school.id = :schoolId AND c.active = true")
    List<Curriculum> findBySchoolId(@Param("schoolId") Long schoolId);

    @Query("SELECT c FROM Curriculum c WHERE c.createdBy.id = :createdById AND c.active = true")
    List<Curriculum> findByCreatedById(@Param("createdById") Long createdById);

    @Query("SELECT c FROM Curriculum c WHERE c.gradeLevel = :gradeLevel AND c.curriculumType = :type AND c.active = true")
    List<Curriculum> findByGradeLevelAndType(@Param("gradeLevel") GradeLevel gradeLevel, @Param("type") CurriculumType type);

    @Query("SELECT c FROM Curriculum c WHERE c.effectiveDate <= :date AND (c.expiryDate IS NULL OR c.expiryDate >= :date) AND c.active = true")
    List<Curriculum> findEffectiveOnDate(@Param("date") LocalDate date);

    @Query("SELECT c FROM Curriculum c WHERE c.title LIKE %:title% AND c.active = true")
    List<Curriculum> findByTitleContaining(@Param("title") String title);

    @Query("SELECT c FROM Curriculum c WHERE c.approvedBy.id = :approvedById AND c.active = true")
    List<Curriculum> findByApprovedById(@Param("approvedById") Long approvedById);

    @Query("SELECT c FROM Curriculum c WHERE c.status = :status AND c.gradeLevel = :gradeLevel AND c.academicYear = :academicYear AND c.active = true")
    List<Curriculum> findByStatusAndGradeLevelAndAcademicYear(
        @Param("status") CurriculumStatus status,
        @Param("gradeLevel") GradeLevel gradeLevel,
        @Param("academicYear") Integer academicYear
    );

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Curriculum c WHERE c.title = :title AND c.gradeLevel = :gradeLevel AND c.academicYear = :academicYear AND c.active = true")
    boolean existsByTitleAndGradeLevelAndAcademicYear(
        @Param("title") String title,
        @Param("gradeLevel") GradeLevel gradeLevel,
        @Param("academicYear") Integer academicYear
    );

    @Query("SELECT c FROM Curriculum c WHERE c.region.id = :regionId AND c.gradeLevel = :gradeLevel AND c.academicYear = :academicYear AND c.active = true")
    List<Curriculum> findByRegionAndGradeLevelAndAcademicYear(
        @Param("regionId") Long regionId,
        @Param("gradeLevel") GradeLevel gradeLevel,
        @Param("academicYear") Integer academicYear
    );
} 