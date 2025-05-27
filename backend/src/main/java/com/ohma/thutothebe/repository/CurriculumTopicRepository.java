package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumTopicRepository extends JpaRepository<CurriculumTopic, Long> {

    @Query("SELECT ct FROM CurriculumTopic ct WHERE ct.curriculumUnit.id = :curriculumUnitId AND ct.active = true ORDER BY ct.topicOrder")
    List<CurriculumTopic> findByCurriculumUnitIdOrderByTopicOrder(@Param("curriculumUnitId") Long curriculumUnitId);

    @Query("SELECT ct FROM CurriculumTopic ct WHERE ct.curriculumUnit.id = :curriculumUnitId AND ct.topicOrder = :topicOrder AND ct.active = true")
    Optional<CurriculumTopic> findByCurriculumUnitIdAndTopicOrder(@Param("curriculumUnitId") Long curriculumUnitId, @Param("topicOrder") Integer topicOrder);

    @Query("SELECT ct FROM CurriculumTopic ct WHERE ct.title LIKE %:title% AND ct.active = true")
    List<CurriculumTopic> findByTitleContaining(@Param("title") String title);

    @Query("SELECT ct FROM CurriculumTopic ct WHERE ct.curriculumUnit.curriculum.id = :curriculumId AND ct.active = true")
    List<CurriculumTopic> findByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT SUM(ct.durationHours) FROM CurriculumTopic ct WHERE ct.curriculumUnit.id = :curriculumUnitId AND ct.active = true")
    Integer getTotalDurationHoursByCurriculumUnitId(@Param("curriculumUnitId") Long curriculumUnitId);

    @Query("SELECT COUNT(ct) FROM CurriculumTopic ct WHERE ct.curriculumUnit.id = :curriculumUnitId AND ct.active = true")
    Long countByCurriculumUnitId(@Param("curriculumUnitId") Long curriculumUnitId);

    @Query("SELECT MAX(ct.topicOrder) FROM CurriculumTopic ct WHERE ct.curriculumUnit.id = :curriculumUnitId AND ct.active = true")
    Integer getMaxTopicOrderByCurriculumUnitId(@Param("curriculumUnitId") Long curriculumUnitId);

    @Query("SELECT CASE WHEN COUNT(ct) > 0 THEN true ELSE false END FROM CurriculumTopic ct WHERE ct.curriculumUnit.id = :curriculumUnitId AND ct.title = :title AND ct.active = true")
    boolean existsByCurriculumUnitIdAndTitle(@Param("curriculumUnitId") Long curriculumUnitId, @Param("title") String title);
} 