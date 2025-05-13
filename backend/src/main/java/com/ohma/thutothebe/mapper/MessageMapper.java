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
        return new MessageDTO(
            message.getId(),
            message.getContent(),
            message.getSender() != null ? message.getSender().getId() : null,
            message.getRecipient() != null ? message.getRecipient().getId() : null,
            message.getGroup() != null ? message.getGroup().getId() : null,
            message.getCreatedAt(),
            message.isActive()
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
        message.setActive(dto.active());
        // Sender, recipient, and group are set in the service layer
        return message;
    }

    public void updateEntityFromDto(MessageDTO dto, Message message) {
        if (dto == null || message == null) {
            return;
        }
        message.setContent(dto.content());
        message.setActive(dto.active());
        // Sender, recipient, and group are set in the service layer
    }
} 