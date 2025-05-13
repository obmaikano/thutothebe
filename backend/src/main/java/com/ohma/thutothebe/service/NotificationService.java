package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.NotificationDTO;
import com.ohma.thutothebe.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService extends BaseService<NotificationDTO, Long> {
    
    Page<NotificationDTO> findByRecipientId(Long recipientId, Pageable pageable);
    
    Page<NotificationDTO> findByRecipientIdAndActive(Long recipientId, boolean active, Pageable pageable);
    
    Page<NotificationDTO> findByRecipientIdAndType(Long recipientId, Notification.NotificationType type, Pageable pageable);
    
    Page<NotificationDTO> findByRecipientIdAndTypeAndActive(Long recipientId, Notification.NotificationType type, boolean active, Pageable pageable);
    
    List<NotificationDTO> findUnreadByRecipientId(Long recipientId);
    
    long countUnreadByRecipientId(Long recipientId);
    
    NotificationDTO markAsRead(Long id);
    
    void markAllAsRead(Long recipientId);
    
    boolean isNotificationRecipient(Long notificationId, Long userId);
} 