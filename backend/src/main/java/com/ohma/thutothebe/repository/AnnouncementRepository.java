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

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering (through creator → school and targetSchool relationships)
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id = :schoolId OR a.targetSchool.id = :schoolId) AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id = :schoolId OR a.targetSchool.id = :schoolId) AND a.active = :active")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findBySchoolIdAndActive(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id = :schoolId OR a.targetSchool.id = :schoolId) AND a.type = :type AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findBySchoolIdAndType(@Param("schoolId") Long schoolId, @Param("type") AnnouncementType type);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id = :schoolId OR a.targetSchool.id = :schoolId) AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findActiveAnnouncementsBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering (through creator → school → region and targetRegion relationships)
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id = :regionId OR a.targetRegion.id = :regionId) AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id = :regionId OR a.targetRegion.id = :regionId) AND a.active = :active")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id = :regionId OR a.targetRegion.id = :regionId) AND a.type = :type AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByRegionIdAndType(@Param("regionId") Long regionId, @Param("type") AnnouncementType type);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id = :regionId OR a.targetRegion.id = :regionId) AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findActiveAnnouncementsByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) AND a.active = :active")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) AND a.type = :type AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findBySchoolIdInAndType(@Param("schoolIds") List<Long> schoolIds, @Param("type") AnnouncementType type);
    
    // Region IDs list filtering
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) AND a.active = :active")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) AND a.type = :type AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByRegionIdInAndType(@Param("regionIds") List<Long> regionIds, @Param("type") AnnouncementType type);
    
    // Creator IDs list filtering (for user-level access)
    @Query("SELECT a FROM Announcement a WHERE a.creator.id IN :creatorIds AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByCreatorIdIn(@Param("creatorIds") List<Long> creatorIds);
    
    @Query("SELECT a FROM Announcement a WHERE a.creator.id IN :creatorIds AND a.active = :active")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByCreatorIdInAndActive(@Param("creatorIds") List<Long> creatorIds, @Param("active") boolean active);
    
    @Query("SELECT a FROM Announcement a WHERE a.creator.id IN :creatorIds AND a.type = :type AND a.active = true")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByCreatorIdInAndType(@Param("creatorIds") List<Long> creatorIds, @Param("type") AnnouncementType type);
    
    // Combined filtering for complex access patterns
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                             @Param("regionIds") List<Long> regionIds, 
                                             @Param("creatorIds") List<Long> creatorIds);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.active = :active " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds, 
                                                      @Param("regionIds") List<Long> regionIds, 
                                                      @Param("creatorIds") List<Long> creatorIds,
                                                      @Param("active") boolean active);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.type = :type AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndType(@Param("schoolIds") List<Long> schoolIds, 
                                                    @Param("regionIds") List<Long> regionIds, 
                                                    @Param("creatorIds") List<Long> creatorIds,
                                                    @Param("type") AnnouncementType type);
    
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.active = :active AND a.type = :type " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndActiveAndType(@Param("schoolIds") List<Long> schoolIds, 
                                                             @Param("regionIds") List<Long> regionIds, 
                                                             @Param("creatorIds") List<Long> creatorIds,
                                                             @Param("active") boolean active,
                                                             @Param("type") AnnouncementType type);
    
    // Priority filtering with multi-tenancy
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.priority = :priority AND a.active = true " +
           "ORDER BY a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndPriority(@Param("schoolIds") List<Long> schoolIds, 
                                                        @Param("regionIds") List<Long> regionIds, 
                                                        @Param("creatorIds") List<Long> creatorIds,
                                                        @Param("priority") com.ohma.thutothebe.entity.AnnouncementPriority priority);
    
    // Role filtering with multi-tenancy
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND (a.targetRole = :role OR a.targetRole IS NULL) AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndTargetRole(@Param("schoolIds") List<Long> schoolIds, 
                                                          @Param("regionIds") List<Long> regionIds, 
                                                          @Param("creatorIds") List<Long> creatorIds,
                                                          @Param("role") UserRole role);
    
    // Acknowledgment required filtering with multi-tenancy
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.acknowledgmentRequired = :acknowledgmentRequired AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndAcknowledgmentRequired(@Param("schoolIds") List<Long> schoolIds, 
                                                                      @Param("regionIds") List<Long> regionIds, 
                                                                      @Param("creatorIds") List<Long> creatorIds,
                                                                      @Param("acknowledgmentRequired") boolean acknowledgmentRequired);
    
    // Search with multi-tenancy
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "     LOWER(a.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndSearch(@Param("schoolIds") List<Long> schoolIds, 
                                                      @Param("regionIds") List<Long> regionIds, 
                                                      @Param("creatorIds") List<Long> creatorIds,
                                                      @Param("searchTerm") String searchTerm);
    
    // Tag filtering with multi-tenancy
    @Query("SELECT a FROM Announcement a WHERE " +
           "((a.creator.school.id IN :schoolIds OR a.targetSchool.id IN :schoolIds) OR " +
           " (a.creator.school.region.id IN :regionIds OR a.targetRegion.id IN :regionIds) OR " +
           " a.creator.id IN :creatorIds) " +
           "AND a.tags LIKE CONCAT('%', :tag, '%') " +
           "AND a.active = true " +
           "ORDER BY a.priority DESC, a.createdAt DESC")
    @EntityGraph(attributePaths = {"creator", "targetRegion", "targetSchool"})
    List<Announcement> findByMultiScopeAccessAndTag(@Param("schoolIds") List<Long> schoolIds, 
                                                   @Param("regionIds") List<Long> regionIds, 
                                                   @Param("creatorIds") List<Long> creatorIds,
                                                   @Param("tag") String tag);
} 