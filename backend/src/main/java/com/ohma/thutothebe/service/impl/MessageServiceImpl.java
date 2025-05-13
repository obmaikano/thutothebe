package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.entity.Message;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.MessageMapper;
import com.ohma.thutothebe.repository.MessageRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MessageServiceImpl extends BaseServiceImpl<Message, MessageDTO, Long> implements MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;
    
    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository, MessageMapper messageMapper) {
        super(messageRepository);
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.messageMapper = messageMapper;
    }
    
    @Override
    protected MessageDTO mapToDto(Message entity) {
        return messageMapper.toDto(entity);
    }
    
    @Override
    protected Message mapToEntity(MessageDTO dto) {
        Message message = messageMapper.toEntity(dto);
        if (dto.senderId() != null) {
            User sender = userRepository.findById(dto.senderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
            message.setSender(sender);
        }
        if (dto.recipientId() != null) {
            User recipient = userRepository.findById(dto.recipientId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
            message.setRecipient(recipient);
        }
        return message;
    }
    
    @Override
    protected void updateEntity(Message entity, MessageDTO dto) {
        messageMapper.updateEntityFromDto(dto, entity);
        if (dto.senderId() != null) {
            User sender = userRepository.findById(dto.senderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
            entity.setSender(sender);
        }
        if (dto.recipientId() != null) {
            User recipient = userRepository.findById(dto.recipientId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
            entity.setRecipient(recipient);
        }
    }
    
    @Override
    public List<MessageDTO> findByUserId(Long userId) {
        return messageRepository.findByUserId(userId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findByUserIdAndActive(Long userId, boolean active) {
        return messageRepository.findByUserIdAndActive(userId, active).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findBySenderAndRecipient(Long senderId, Long recipientId) {
        return messageRepository.findBySenderAndRecipient(senderId, recipientId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findBySenderAndRecipientAndActive(Long senderId, Long recipientId, boolean active) {
        return messageRepository.findBySenderAndRecipientAndActive(senderId, recipientId, active).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findByGroupId(Long groupId) {
        return messageRepository.findByGroupId(groupId).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MessageDTO> findByGroupIdAndActive(Long groupId, boolean active) {
        return messageRepository.findByGroupIdAndActive(groupId, active).stream()
                .map(messageMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean isMessageOwner(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        return message.getSender().getId().equals(userId);
    }
} 