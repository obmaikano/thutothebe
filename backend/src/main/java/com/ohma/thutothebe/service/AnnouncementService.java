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
} 