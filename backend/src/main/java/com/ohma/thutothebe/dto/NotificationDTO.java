package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.Notification.NotificationType;
import java.time.LocalDateTime;

public record NotificationDTO(
    Long id,
    String title,
    String content,
    Long recipientId,
    NotificationType type,
    Long referenceId,
    String referenceType,
    LocalDateTime createdAt,
    LocalDateTime readAt,
    boolean active
) {
    public NotificationDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Notification title cannot be null or blank");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Notification content cannot be null or blank");
        }
        if (recipientId == null) {
            throw new IllegalArgumentException("Recipient ID cannot be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("Notification type cannot be null");
        }
    }
} 