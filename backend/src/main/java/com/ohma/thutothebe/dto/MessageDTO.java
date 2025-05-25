package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.MessageType;
import java.time.LocalDateTime;

public record MessageDTO(
    Long id,
    String content,
    Long senderId,
    String senderName,
    Long recipientId,
    String recipientName,
    Long groupId,
    String groupName,
    MessageType messageType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean active,
    
    // Real-time messaging fields
    boolean isDelivered,
    boolean isRead,
    LocalDateTime deliveredAt,
    LocalDateTime readAt,
    Long replyToMessageId,
    boolean edited,
    LocalDateTime editedAt
) {
    public MessageDTO {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Message content cannot be null or blank");
        }
        if (senderId == null) {
            throw new IllegalArgumentException("Sender ID cannot be null");
        }
        if (recipientId == null && groupId == null) {
            throw new IllegalArgumentException("Either recipient ID or group ID must be provided");
        }
        if (messageType == null) {
            throw new IllegalArgumentException("Message type cannot be null");
        }
    }
} 