package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.entity.Message;
import com.ohma.thutothebe.entity.MessageGroup;
import com.ohma.thutothebe.entity.User;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper implements BaseDtoMapper<Message, MessageDTO> {
    @Override
    public MessageDTO toDto(Message message) {
        if (message == null) {
            return null;
        }
        
        String senderName = null;
        if (message.getSender() != null) {
            senderName = message.getSender().getFirstName() + " " + message.getSender().getLastName();
        }
        
        String recipientName = null;
        if (message.getRecipient() != null) {
            recipientName = message.getRecipient().getFirstName() + " " + message.getRecipient().getLastName();
        }
        
        String groupName = null;
        if (message.getGroup() != null) {
            groupName = message.getGroup().getName();
        }
        
        return new MessageDTO(
            message.getId(),
            message.getContent(),
            message.getSender() != null ? message.getSender().getId() : null,
            senderName,
            message.getRecipient() != null ? message.getRecipient().getId() : null,
            recipientName,
            message.getGroup() != null ? message.getGroup().getId() : null,
            groupName,
            message.getMessageType(),
            message.getCreatedAt(),
            message.getUpdatedAt(),
            message.isActive(),
            message.isDelivered(),
            message.isRead(),
            message.getDeliveredAt(),
            message.getReadAt(),
            message.getReplyToMessageId(),
            message.isEdited(),
            message.getEditedAt()
        );
    }

    @Override
    public Message toEntity(MessageDTO dto) {
        if (dto == null) {
            return null;
        }
        Message message = new Message();
        message.setId(dto.id());
        message.setContent(dto.content());
        message.setMessageType(dto.messageType());
        message.setActive(dto.active());
        message.setDelivered(dto.isDelivered());
        message.setRead(dto.isRead());
        message.setDeliveredAt(dto.deliveredAt());
        message.setReadAt(dto.readAt());
        message.setReplyToMessageId(dto.replyToMessageId());
        message.setEdited(dto.edited());
        message.setEditedAt(dto.editedAt());
        // Sender, recipient, and group are set in the service layer
        return message;
    }

    public void updateEntityFromDto(MessageDTO dto, Message message) {
        if (dto == null || message == null) {
            return;
        }
        message.setContent(dto.content());
        message.setMessageType(dto.messageType());
        message.setActive(dto.active());
        message.setDelivered(dto.isDelivered());
        message.setRead(dto.isRead());
        message.setDeliveredAt(dto.deliveredAt());
        message.setReadAt(dto.readAt());
        message.setReplyToMessageId(dto.replyToMessageId());
        message.setEdited(dto.edited());
        message.setEditedAt(dto.editedAt());
        // Sender, recipient, and group are set in the service layer
    }
} 