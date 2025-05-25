package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.MessageDTO;
import java.util.List;

public interface MessageChannelService {
    
    /**
     * Determine target channels for a message based on recipients
     * @param message The message to route
     * @return List of channel IDs for WebSocket routing
     */
    List<String> determineTargetChannels(MessageDTO message);
    
    /**
     * Get all channel subscriptions for a user
     * @param userId The user ID
     * @return List of channel IDs the user should subscribe to
     */
    List<String> getAllUserChannelSubscriptions(Long userId);
    
    /**
     * Generate channel ID for one-on-one conversation
     * @param userId1 First user ID
     * @param userId2 Second user ID
     * @return Channel ID for the conversation
     */
    String generateConversationChannelId(Long userId1, Long userId2);
    
    /**
     * Generate channel ID for group conversation
     * @param groupId The group ID
     * @return Channel ID for the group
     */
    String generateGroupChannelId(Long groupId);
    
    /**
     * Generate channel ID for class-based messaging
     * @param classId The class ID
     * @return Channel ID for the class
     */
    String generateClassChannelId(Long classId);
    
    /**
     * Generate channel ID for school-wide messaging
     * @param schoolId The school ID
     * @return Channel ID for the school
     */
    String generateSchoolChannelId(Long schoolId);
    
    /**
     * Generate channel ID for role-based messaging
     * @param schoolId The school ID
     * @param role The user role
     * @return Channel ID for role-based messaging
     */
    String generateRoleChannelId(Long schoolId, String role);
    
    /**
     * Check if user has access to a specific channel
     * @param userId The user ID
     * @param channelId The channel ID
     * @return true if user has access, false otherwise
     */
    boolean hasChannelAccess(Long userId, String channelId);
    
    /**
     * Get unread message count for user across all channels
     * @param userId The user ID
     * @return Total unread message count
     */
    Long getUnreadMessageCount(Long userId);
    
    /**
     * Get unread message count for specific channel
     * @param userId The user ID
     * @param channelId The channel ID
     * @return Unread message count for the channel
     */
    Long getUnreadMessageCountForChannel(Long userId, String channelId);
} 