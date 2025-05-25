package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.dto.RealTimeAnnouncementDTO;

public interface RealTimeAnnouncementService {
    
    /**
     * Broadcast announcement creation to target users
     * @param announcement The created announcement
     */
    void broadcastAnnouncementCreated(AnnouncementDTO announcement);
    
    /**
     * Broadcast announcement update to target users
     * @param announcement The updated announcement
     */
    void broadcastAnnouncementUpdated(AnnouncementDTO announcement);
    
    /**
     * Broadcast announcement deletion to target users
     * @param announcement The deleted announcement
     */
    void broadcastAnnouncementDeleted(AnnouncementDTO announcement);
    
    /**
     * Broadcast announcement status change to target users
     * @param announcement The announcement with status change
     * @param activated Whether the announcement was activated or deactivated
     */
    void broadcastAnnouncementStatusChanged(AnnouncementDTO announcement, boolean activated);
    
    /**
     * Send real-time announcement to specific group
     * @param groupId Target group ID
     * @param realTimeAnnouncement The real-time announcement data
     */
    void sendToGroup(String groupId, RealTimeAnnouncementDTO realTimeAnnouncement);
    
    /**
     * Convert announcement DTO to real-time announcement DTO
     * @param announcement The announcement
     * @param eventType The event type (CREATED, UPDATED, DELETED, etc.)
     * @param groupId The target group ID
     * @param message Optional notification message
     * @return Real-time announcement DTO
     */
    RealTimeAnnouncementDTO convertToRealTimeDTO(AnnouncementDTO announcement, String eventType, String groupId, String message);
} 