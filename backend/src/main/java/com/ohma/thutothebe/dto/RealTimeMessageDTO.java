package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RealTimeMessageDTO(
    @NotNull
    Long id,
    
    @NotBlank
    String content,
    
    @NotNull
    Long senderId,
    
    String senderName,
    
    String senderRole,
    
    Long recipientId,
    
    String recipientName,
    
    Long groupId,
    
    String groupName,
    
    @NotNull
    LocalDateTime createdAt,
    
    LocalDateTime updatedAt,
    
    boolean active,
    
    // Real-time specific fields
    @NotNull
    String eventType, // "SENT", "UPDATED", "DELETED", "DELIVERED", "READ"
    
    @NotNull
    String channelId, // Target channel for WebSocket subscription
    
    String message, // Optional notification message
    
    // Message status fields
    boolean isDelivered,
    
    boolean isRead,
    
    LocalDateTime deliveredAt,
    
    LocalDateTime readAt,
    
    // Typing indicator fields
    boolean isTyping,
    
    Long typingUserId,
    
    String typingUserName
) {
    public RealTimeMessageDTO {
        if (content != null && content.isBlank()) {
            throw new IllegalArgumentException("Content cannot be blank");
        }
        if (eventType != null && eventType.isBlank()) {
            throw new IllegalArgumentException("Event type cannot be blank");
        }
        if (channelId != null && channelId.isBlank()) {
            throw new IllegalArgumentException("Channel ID cannot be blank");
        }
        if (senderId == null && !eventType.equals("TYPING")) {
            throw new IllegalArgumentException("Sender ID cannot be null for message events");
        }
        if (recipientId == null && groupId == null && !eventType.equals("TYPING")) {
            throw new IllegalArgumentException("Either recipient ID or group ID must be provided for message events");
        }
    }
} 