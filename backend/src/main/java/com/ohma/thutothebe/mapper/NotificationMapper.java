package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.NotificationDTO;
import com.ohma.thutothebe.entity.Notification;
import com.ohma.thutothebe.entity.User;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper implements BaseDtoMapper<Notification, NotificationDTO> {
    @Override
    public NotificationDTO toDto(Notification notification) {
        if (notification == null) {
            return null;
        }
        return new NotificationDTO(
            notification.getId(),
            notification.getTitle(),
            notification.getContent(),
            notification.getRecipient() != null ? notification.getRecipient().getId() : null,
            notification.getType(),
            notification.getReferenceId(),
            notification.getReferenceType(),
            notification.getCreatedAt(),
            notification.getReadAt(),
            notification.isActive()
        );
    }

    @Override
    public Notification toEntity(NotificationDTO dto) {
        if (dto == null) {
            return null;
        }
        Notification notification = new Notification();
        notification.setId(dto.id());
        notification.setTitle(dto.title());
        notification.setContent(dto.content());
        notification.setType(dto.type());
        notification.setReferenceId(dto.referenceId());
        notification.setReferenceType(dto.referenceType());
        notification.setActive(dto.active());
        // Recipient is set in the service layer
        return notification;
    }

    public void updateEntityFromDto(NotificationDTO dto, Notification notification) {
        if (dto == null || notification == null) {
            return;
        }
        notification.setTitle(dto.title());
        notification.setContent(dto.content());
        notification.setType(dto.type());
        notification.setReferenceId(dto.referenceId());
        notification.setReferenceType(dto.referenceType());
        notification.setActive(dto.active());
        // Recipient is set in the service layer
    }
}
