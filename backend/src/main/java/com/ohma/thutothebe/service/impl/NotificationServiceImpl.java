package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.NotificationDTO;
import com.ohma.thutothebe.entity.Notification;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.NotificationMapper;
import com.ohma.thutothebe.repository.NotificationRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NotificationServiceImpl extends BaseServiceImpl<Notification, NotificationDTO, Long> implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository, NotificationMapper notificationMapper) {
        super(notificationRepository);
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    protected NotificationDTO mapToDto(Notification entity) {
        return notificationMapper.toDto(entity);
    }

    @Override
    protected Notification mapToEntity(NotificationDTO dto) {
        return notificationMapper.toEntity(dto);
    }

    @Override
    protected void updateEntity(Notification entity, NotificationDTO dto) {
        notificationMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    public Page<NotificationDTO> findByRecipientId(Long recipientId, Pageable pageable) {
        return notificationRepository.findByRecipientId(recipientId, pageable)
                .map(notificationMapper::toDto);
    }

    @Override
    public Page<NotificationDTO> findByRecipientIdAndActive(Long recipientId, boolean active, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndActive(recipientId, active, pageable)
                .map(notificationMapper::toDto);
    }

    @Override
    public Page<NotificationDTO> findByRecipientIdAndType(Long recipientId, Notification.NotificationType type, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndType(recipientId, type, pageable)
                .map(notificationMapper::toDto);
    }

    @Override
    public Page<NotificationDTO> findByRecipientIdAndTypeAndActive(Long recipientId, Notification.NotificationType type, boolean active, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndTypeAndActive(recipientId, type, active, pageable)
                .map(notificationMapper::toDto);
    }

    @Override
    public List<NotificationDTO> findUnreadByRecipientId(Long recipientId) {
        return notificationRepository.findUnreadByRecipientId(recipientId).stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public long countUnreadByRecipientId(Long recipientId) {
        return notificationRepository.countUnreadByRecipientId(recipientId);
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setReadAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long recipientId) {
        List<Notification> unread = notificationRepository.findUnreadByRecipientId(recipientId);
        for (Notification n : unread) {
            n.setReadAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unread);
    }

    @Override
    public boolean isNotificationRecipient(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        return notification.getRecipient().getId().equals(userId);
    }
} 