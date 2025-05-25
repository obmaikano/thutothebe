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
    
    // Real-time messaging methods
    MessageDTO sendMessage(MessageDTO messageDTO);
    
    MessageDTO updateMessage(Long messageId, MessageDTO messageDTO, Long userId);
    
    void deleteMessage(Long messageId, Long userId);
    
    void markMessageAsDelivered(Long messageId, Long userId);
    
    void markMessageAsRead(Long messageId, Long userId);
    
    void markConversationAsRead(Long userId, Long partnerId);
    
    void markGroupMessagesAsRead(Long groupId, Long userId);
    
    List<MessageDTO> getConversationMessages(Long userId1, Long userId2);
    
    List<MessageDTO> getActiveConversationMessages(Long userId1, Long userId2);
    
    Long getUnreadMessageCount(Long userId);
    
    Long getUnreadMessageCountForConversation(Long userId, Long partnerId);
    
    Long getUnreadMessageCountForGroup(Long userId, Long groupId);
    
    void sendTypingIndicator(Long userId, String channelId, boolean isTyping);
} 