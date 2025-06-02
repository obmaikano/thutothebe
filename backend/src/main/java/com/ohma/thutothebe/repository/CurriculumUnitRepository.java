package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumUnit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumUnitRepository extends JpaRepository<CurriculumUnit, Long> {

    @Query("SELECT cu FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.active = true ORDER BY cu.unitOrder")
    @EntityGraph(attributePaths = {"curriculumTopics"})
    List<CurriculumUnit> findByCurriculumIdOrderByUnitOrder(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cu FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.unitOrder = :unitOrder AND cu.active = true")
    Optional<CurriculumUnit> findByCurriculumIdAndUnitOrder(@Param("curriculumId") Long curriculumId, @Param("unitOrder") Integer unitOrder);

    @Query("SELECT cu FROM CurriculumUnit cu WHERE cu.title LIKE %:title% AND cu.active = true")
    List<CurriculumUnit> findByTitleContaining(@Param("title") String title);

    @Query("SELECT SUM(cu.durationWeeks) FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.active = true")
    Integer getTotalDurationWeeksByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT SUM(cu.allocatedHours) FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.active = true")
    Integer getTotalAllocatedHoursByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT COUNT(cu) FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.active = true")
    Long countByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT MAX(cu.unitOrder) FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.active = true")
    Integer getMaxUnitOrderByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT CASE WHEN COUNT(cu) > 0 THEN true ELSE false END FROM CurriculumUnit cu WHERE cu.curriculum.id = :curriculumId AND cu.title = :title AND cu.active = true")
    boolean existsByCurriculumIdAndTitle(@Param("curriculumId") Long curriculumId, @Param("title") String title);
} 