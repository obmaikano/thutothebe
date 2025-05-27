package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumResource;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumResourceRepository extends JpaRepository<CurriculumResource, Long> {

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndIsActive(Long curriculumId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndResourceType(Long curriculumId, CurriculumResource.ResourceType resourceType);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndCurriculumUnitId(Long curriculumId, Long unitId);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndCurriculumTopicId(Long curriculumId, Long topicId);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndResourceTypeAndCurriculumUnitId(Long curriculumId, CurriculumResource.ResourceType resourceType, Long unitId);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndResourceTypeAndCurriculumTopicId(Long curriculumId, CurriculumResource.ResourceType resourceType, Long topicId);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndResourceTypeAndCurriculumUnitIdAndCurriculumTopicId(Long curriculumId, CurriculumResource.ResourceType resourceType, Long unitId, Long topicId);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumUnitIdAndIsActive(Long unitId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumTopicIdAndIsActive(Long topicId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByResourceTypeAndIsActive(CurriculumResource.ResourceType resourceType, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndIsPublicAndIsActive(Long curriculumId, boolean isPublic, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByCurriculumIdAndLanguageAndIsActive(Long curriculumId, String language, boolean isActive);

    @Query("SELECT cr FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND (LOWER(cr.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(cr.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND cr.isActive = true")
    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> searchByTitleOrDescription(@Param("searchTerm") String searchTerm, @Param("curriculumId") Long curriculumId);

    @Query("SELECT cr FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.tags LIKE %:tag% AND cr.isActive = true")
    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findByTagsContainingAndCurriculumId(@Param("tag") String tag, @Param("curriculumId") Long curriculumId);

    @Query("SELECT cr FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.isActive = true ORDER BY cr.accessCount DESC LIMIT :limit")
    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findMostAccessedByCurriculumId(@Param("curriculumId") Long curriculumId, @Param("limit") int limit);

    @Query("SELECT cr FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.isActive = true ORDER BY cr.uploadedAt DESC LIMIT :limit")
    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findRecentlyAddedByCurriculumId(@Param("curriculumId") Long curriculumId, @Param("limit") int limit);

    @Query("SELECT cr FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.accessCount < 5 AND cr.isActive = true ORDER BY cr.accessCount ASC")
    @EntityGraph(attributePaths = {"curriculum", "curriculumUnit", "curriculumTopic", "uploadedBy"})
    List<CurriculumResource> findUnderutilizedByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT COUNT(cr) FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.isActive = true")
    Long countActiveByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT SUM(cr.fileSize) FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.isActive = true")
    Long getTotalFileSizeByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cr.resourceType, COUNT(cr) FROM CurriculumResource cr WHERE cr.curriculum.id = :curriculumId AND cr.isActive = true GROUP BY cr.resourceType")
    List<Object[]> getResourceTypeStatsByCurriculumId(@Param("curriculumId") Long curriculumId);
} 