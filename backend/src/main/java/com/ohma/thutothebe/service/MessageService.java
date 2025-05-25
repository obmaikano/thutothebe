package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.dto.UserDTO;
import java.util.List;

public interface MessageService extends BaseService<MessageDTO, Long> {
    
    List<MessageDTO> findByUserId(Long userId);
    
    List<MessageDTO> findByUserIdAndActive(Long userId, boolean active);
    
    List<MessageDTO> findBySenderAndRecipient(Long senderId, Long recipientId);
    
    List<MessageDTO> findBySenderAndRecipientAndActive(Long senderId, Long recipientId, boolean active);
    
    List<MessageDTO> findByGroupId(Long groupId);
    
    List<MessageDTO> findByGroupIdAndActive(Long groupId, boolean active);
    
    boolean isMessageOwner(Long messageId, Long userId);
    
    List<UserDTO> getContactsForStudent(Long studentId);
    
    List<Object> getConversationsForUser(Long userId);
} 