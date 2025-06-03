package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.dto.AnnouncementReadReceiptDTO;
import com.ohma.thutothebe.dto.AnnouncementAcknowledgmentDTO;
import com.ohma.thutothebe.entity.AnnouncementType;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AnnouncementService extends BaseService<AnnouncementDTO, Long> {
    
    /**
     * Get announcements visible to a specific user based on their role and context
     */
    Page<AnnouncementDTO> getAnnouncementsForUser(Long userId, Pageable pageable);
    
    /**
     * Get announcements by type for a specific user
     */
    Page<AnnouncementDTO> getAnnouncementsByTypeForUser(Long userId, AnnouncementType type, Pageable pageable);
    
    /**
     * Get announcements created by a specific user
     */
    Page<AnnouncementDTO> getAnnouncementsByCreator(Long creatorId, Pageable pageable);
    
    /**
     * Create an announcement with role-based validation
     */
    AnnouncementDTO createAnnouncement(AnnouncementDTO dto, Long creatorId);
    
    /**
     * Update an announcement with role-based validation
     */
    AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO dto, Long userId);
    
    /**
     * Delete an announcement with role-based validation
     */
    void deleteAnnouncement(Long id, Long userId);
    
    /**
     * Mark an announcement as read by a user
     */
    AnnouncementReadReceiptDTO markAsRead(Long announcementId, Long userId);
    
    /**
     * Acknowledge an announcement
     */
    AnnouncementAcknowledgmentDTO acknowledgeAnnouncement(Long announcementId, Long userId, String note);
    
    /**
     * Get pending acknowledgments count for a user
     */
    Long getPendingAcknowledgmentsCount(Long userId);
    
    /**
     * Search announcements for a user
     */
    Page<AnnouncementDTO> searchAnnouncementsForUser(Long userId, String searchTerm, Pageable pageable);
    
    /**
     * Get announcements by tag for a user
     */
    Page<AnnouncementDTO> getAnnouncementsByTagForUser(Long userId, String tag, Pageable pageable);
    
    /**
     * Get a single announcement by ID with user-specific status
     */
    AnnouncementDTO getAnnouncementByIdWithUserStatus(Long announcementId, Long userId);
    
    /**
     * Get read receipts for an announcement
     */
    List<AnnouncementReadReceiptDTO> getReadReceipts(Long announcementId, Long requesterId);
    
    /**
     * Get acknowledgments for an announcement
     */
    List<AnnouncementAcknowledgmentDTO> getAcknowledgments(Long announcementId, Long requesterId);
    
    /**
     * Validate if user can create announcement for specified target
     */
    boolean canUserCreateAnnouncementForTarget(UserRole userRole, Long userRegionId, Long userSchoolId, 
                                             Long targetRegionId, Long targetSchoolId, UserRole targetRole);
    
    /**
     * Validate if user can edit/delete announcement
     */
    boolean canUserModifyAnnouncement(Long userId, Long announcementId);
    
    /**
     * Get global announcements (visible to all users)
     */
    Page<AnnouncementDTO> getGlobalAnnouncements(Pageable pageable);
    
    /**
     * Activate/deactivate announcement
     */
    AnnouncementDTO toggleAnnouncementStatus(Long id, Long userId);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get announcements filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<AnnouncementDTO> getAnnouncementsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get active announcements filtered by accessible scope IDs
     */
    List<AnnouncementDTO> getActiveAnnouncementsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get announcements by specific school ID (for school-level access)
     */
    List<AnnouncementDTO> getAnnouncementsBySchoolId(Long schoolId);
    
    /**
     * Get announcements by specific region ID (for regional access)
     */
    List<AnnouncementDTO> getAnnouncementsByRegionId(Long regionId);
    
    /**
     * Get active announcements by school ID
     */
    List<AnnouncementDTO> getActiveAnnouncementsBySchoolId(Long schoolId);
    
    /**
     * Get active announcements by region ID
     */
    List<AnnouncementDTO> getActiveAnnouncementsByRegionId(Long regionId);
    
    /**
     * Get announcements by multiple school IDs (for class-level access across schools)
     */
    List<AnnouncementDTO> getAnnouncementsBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get announcements by multiple region IDs (for regional access across regions)
     */
    List<AnnouncementDTO> getAnnouncementsByRegionIds(List<Long> regionIds);
    
    /**
     * Get announcements by specific creator IDs (for user-level access)
     */
    List<AnnouncementDTO> getAnnouncementsByCreatorIds(List<Long> creatorIds);
    
    /**
     * Get active announcements by multiple school IDs
     */
    List<AnnouncementDTO> getActiveAnnouncementsBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get active announcements by multiple region IDs
     */
    List<AnnouncementDTO> getActiveAnnouncementsByRegionIds(List<Long> regionIds);
    
    /**
     * Get active announcements by specific creator IDs
     */
    List<AnnouncementDTO> getActiveAnnouncementsByCreatorIds(List<Long> creatorIds);
    
    /**
     * Get announcements by multi-scope access (combines school, region, and creator level access)
     */
    List<AnnouncementDTO> getAnnouncementsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> creatorIds);
    
    /**
     * Get active announcements by multi-scope access
     */
    List<AnnouncementDTO> getActiveAnnouncementsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> creatorIds);
    
    /**
     * Get announcements by type and accessible scopes (secure type filtering)
     */
    List<AnnouncementDTO> getAnnouncementsByTypeAndAccessibleScopes(AnnouncementType type, Long currentUserId);
    
    /**
     * Get announcements by priority and accessible scopes (secure priority filtering)
     */
    List<AnnouncementDTO> getAnnouncementsByPriorityAndAccessibleScopes(com.ohma.thutothebe.entity.AnnouncementPriority priority, Long currentUserId);
    
    /**
     * Get announcements by target role and accessible scopes (secure role filtering)
     */
    List<AnnouncementDTO> getAnnouncementsByTargetRoleAndAccessibleScopes(UserRole targetRole, Long currentUserId);
    
    /**
     * Get announcements requiring acknowledgment by accessible scopes (secure acknowledgment filtering)
     */
    List<AnnouncementDTO> getAnnouncementsRequiringAcknowledgmentByAccessibleScopes(Long currentUserId);
    
    /**
     * Search announcements by accessible scopes (secure search)
     */
    List<AnnouncementDTO> searchAnnouncementsByAccessibleScopes(String searchTerm, Long currentUserId);
    
    /**
     * Get announcements by tag and accessible scopes (secure tag filtering)
     */
    List<AnnouncementDTO> getAnnouncementsByTagAndAccessibleScopes(String tag, Long currentUserId);
    
    /**
     * Get announcements by creator and accessible scopes (secure creator filtering)
     */
    List<AnnouncementDTO> getAnnouncementsByCreatorAndAccessibleScopes(Long creatorId, Long currentUserId);
} 