package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.dto.RealTimeMessageDTO;

public interface RealTimeMessageService {
    
    /**
     * Broadcast a new message to target channels
     * @param message The message that was sent
     */
    void broadcastMessageSent(MessageDTO message);
    
    /**
     * Broadcast message update to target channels
     * @param message The message that was updated
     */
    void broadcastMessageUpdated(MessageDTO message);
    
    /**
     * Broadcast message deletion to target channels
     * @param message The message that was deleted
     */
    void broadcastMessageDeleted(MessageDTO message);
    
    /**
     * Broadcast message delivery status to sender
     * @param message The message that was delivered
     */
    void broadcastMessageDelivered(MessageDTO message);
    
    /**
     * Broadcast message read status to sender
     * @param message The message that was read
     */
    void broadcastMessageRead(MessageDTO message);
    
    /**
     * Broadcast typing indicator to target channels
     * @param userId The user who is typing
     * @param channelId The channel where typing is happening
     * @param isTyping Whether user is typing or stopped typing
     */
    void broadcastTypingIndicator(Long userId, String channelId, boolean isTyping);
    
    /**
     * Send real-time message to specific channel
     * @param channelId The target channel
     * @param realTimeMessage The real-time message to send
     */
    void sendToChannel(String channelId, RealTimeMessageDTO realTimeMessage);
    
    /**
     * Convert MessageDTO to RealTimeMessageDTO
     * @param message The message to convert
     * @param eventType The event type (SENT, UPDATED, DELETED, DELIVERED, READ)
     * @param channelId The target channel
     * @param notificationMessage Optional notification message
     * @return RealTimeMessageDTO
     */
    RealTimeMessageDTO convertToRealTimeDTO(MessageDTO message, String eventType, String channelId, String notificationMessage);
    
    /**
     * Create typing indicator DTO
     * @param userId The user who is typing
     * @param userName The name of the user who is typing
     * @param channelId The channel where typing is happening
     * @param isTyping Whether user is typing or stopped typing
     * @return RealTimeMessageDTO for typing indicator
     */
    RealTimeMessageDTO createTypingIndicatorDTO(Long userId, String userName, String channelId, boolean isTyping);
    
    /**
     * Send unread count update to user
     * @param userId The user to send update to
     * @param channelId The channel with updated count (optional)
     */
    void sendUnreadCountUpdate(Long userId, String channelId);
} 