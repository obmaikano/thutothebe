package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumVersion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumVersionRepository extends JpaRepository<CurriculumVersion, Long> {

    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    List<CurriculumVersion> findByCurriculumIdOrderByVersionNumberDesc(Long curriculumId);

    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    Optional<CurriculumVersion> findByCurriculumIdAndIsCurrent(Long curriculumId, boolean isCurrent);

    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    Optional<CurriculumVersion> findByCurriculumIdAndVersionNumber(Long curriculumId, Integer versionNumber);

    @Query("SELECT cv FROM CurriculumVersion cv WHERE cv.curriculum.id = :curriculumId AND cv.isMajorVersion = true ORDER BY cv.versionNumber DESC")
    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    List<CurriculumVersion> findMajorVersionsByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cv FROM CurriculumVersion cv WHERE cv.createdAt BETWEEN :startDate AND :endDate ORDER BY cv.createdAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    List<CurriculumVersion> findVersionsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT cv FROM CurriculumVersion cv WHERE cv.createdBy.id = :userId ORDER BY cv.createdAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    List<CurriculumVersion> findVersionsByCreatedBy(@Param("userId") Long userId);

    @Query("SELECT MAX(cv.versionNumber) FROM CurriculumVersion cv WHERE cv.curriculum.id = :curriculumId")
    Optional<Integer> findMaxVersionNumberByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cv FROM CurriculumVersion cv WHERE cv.curriculum.id = :curriculumId AND cv.tags LIKE %:tag% ORDER BY cv.versionNumber DESC")
    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    List<CurriculumVersion> findVersionsByTag(@Param("curriculumId") Long curriculumId, @Param("tag") String tag);

    @Query("SELECT COUNT(cv) FROM CurriculumVersion cv WHERE cv.curriculum.id = :curriculumId")
    Long countVersionsByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT cv FROM CurriculumVersion cv WHERE cv.curriculum.id = :curriculumId AND cv.versionNumber BETWEEN :startVersion AND :endVersion ORDER BY cv.versionNumber")
    @EntityGraph(attributePaths = {"curriculum", "createdBy"})
    List<CurriculumVersion> findVersionsInRange(@Param("curriculumId") Long curriculumId, @Param("startVersion") Integer startVersion, @Param("endVersion") Integer endVersion);

    boolean existsByCurriculumIdAndVersionName(Long curriculumId, String versionName);

    @Query("SELECT cv FROM CurriculumVersion cv WHERE cv.checksum = :checksum")
    Optional<CurriculumVersion> findByChecksum(@Param("checksum") String checksum);
} 