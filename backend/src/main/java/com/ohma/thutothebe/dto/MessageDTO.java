package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record MessageDTO(
    Long id,
    String content,
    Long senderId,
    Long recipientId,
    Long groupId,
    LocalDateTime createdAt,
    boolean active
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
    }
} 