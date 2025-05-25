package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Announcement;
import com.ohma.thutothebe.entity.AnnouncementType;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.id = :id")
    Optional<Announcement> findByIdWithDetails(@Param("id") Long id);

    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findActiveAnnouncements(@Param("now") LocalDateTime now, Pageable pageable);

    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "a.type = :type " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findActiveAnnouncementsByType(@Param("now") LocalDateTime now, 
                                                   @Param("type") AnnouncementType type, 
                                                   Pageable pageable);

    // Global announcements (no specific targeting)
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "a.targetRegion IS NULL AND a.targetSchool IS NULL AND a.targetRole IS NULL " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findGlobalAnnouncements(@Param("now") LocalDateTime now, Pageable pageable);

    // Region-specific announcements
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "(a.targetRegion.id = :regionId OR a.targetRegion IS NULL) " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findAnnouncementsForRegion(@Param("regionId") Long regionId, 
                                                @Param("now") LocalDateTime now, 
                                                Pageable pageable);

    // School-specific announcements
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "(a.targetSchool.id = :schoolId OR " +
           " (a.targetSchool IS NULL AND (a.targetRegion.id = :regionId OR a.targetRegion IS NULL))) " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findAnnouncementsForSchool(@Param("schoolId") Long schoolId, 
                                                @Param("regionId") Long regionId,
                                                @Param("now") LocalDateTime now, 
                                                Pageable pageable);

    // Role-specific announcements
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "(a.targetRole = :role OR a.targetRole IS NULL) AND " +
           "(a.targetSchool.id = :schoolId OR " +
           " (a.targetSchool IS NULL AND (a.targetRegion.id = :regionId OR a.targetRegion IS NULL))) " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findAnnouncementsForUserRole(@Param("role") UserRole role,
                                                   @Param("schoolId") Long schoolId,
                                                   @Param("regionId") Long regionId,
                                                   @Param("now") LocalDateTime now,
                                                   Pageable pageable);

    // Announcements created by a specific user
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.creator.id = :creatorId " +
           "ORDER BY a.createdAt DESC")
    Page<Announcement> findByCreatorId(@Param("creatorId") Long creatorId, Pageable pageable);

    // Count announcements requiring acknowledgment for a user
    @Query("SELECT COUNT(a) FROM Announcement a WHERE a.active = true AND " +
           "a.acknowledgmentRequired = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "(a.targetRole = :role OR a.targetRole IS NULL) AND " +
           "(a.targetSchool.id = :schoolId OR " +
           " (a.targetSchool IS NULL AND (a.targetRegion.id = :regionId OR a.targetRegion IS NULL))) AND " +
           "NOT EXISTS (SELECT 1 FROM AnnouncementAcknowledgment ack WHERE ack.announcement = a AND ack.user.id = :userId)")
    Long countPendingAcknowledgments(@Param("userId") Long userId,
                                   @Param("role") UserRole role,
                                   @Param("schoolId") Long schoolId,
                                   @Param("regionId") Long regionId,
                                   @Param("now") LocalDateTime now);

    // Search announcements by title or content
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           " LOWER(a.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> searchAnnouncements(@Param("searchTerm") String searchTerm,
                                         @Param("now") LocalDateTime now,
                                         Pageable pageable);

    // Find announcements by tags
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    @Query("SELECT a FROM Announcement a WHERE a.active = true AND " +
           "(a.startDate IS NULL OR a.startDate <= :now) AND " +
           "(a.endDate IS NULL OR a.endDate >= :now) AND " +
           "a.tags LIKE CONCAT('%', :tag, '%') " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    Page<Announcement> findByTag(@Param("tag") String tag,
                               @Param("now") LocalDateTime now,
                               Pageable pageable);

    List<Announcement> findByActive(boolean active);
} 