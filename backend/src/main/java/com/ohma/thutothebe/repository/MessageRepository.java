package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.recipient.id = :userId ORDER BY m.createdAt DESC")
    List<Message> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.recipient.id = :userId) AND m.active = :active ORDER BY m.createdAt DESC")
    List<Message> findByUserIdAndActive(@Param("userId") Long userId, @Param("active") boolean active);
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId AND m.recipient.id = :recipientId ORDER BY m.createdAt DESC")
    List<Message> findBySenderAndRecipient(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId AND m.recipient.id = :recipientId AND m.active = :active ORDER BY m.createdAt DESC")
    List<Message> findBySenderAndRecipientAndActive(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId, @Param("active") boolean active);
    
    @Query("SELECT m FROM Message m WHERE m.group.id = :groupId ORDER BY m.createdAt DESC")
    List<Message> findByGroupId(@Param("groupId") Long groupId);
    
    @Query("SELECT m FROM Message m WHERE m.group.id = :groupId AND m.active = :active ORDER BY m.createdAt DESC")
    List<Message> findByGroupIdAndActive(@Param("groupId") Long groupId, @Param("active") boolean active);
    
    // Unread message count methods for real-time messaging
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient.id = :userId AND m.isRead = false AND m.active = true")
    Long countUnreadMessagesForUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient.id = :userId AND m.sender.id = :partnerId AND m.isRead = false AND m.active = true")
    Long countUnreadMessagesInConversation(@Param("userId") Long userId, @Param("partnerId") Long partnerId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.group.id = :groupId AND m.isRead = false AND m.active = true AND m.sender.id != :userId")
    Long countUnreadMessagesInGroup(@Param("userId") Long userId, @Param("groupId") Long groupId);
    
    // Additional queries for real-time messaging
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :senderId AND m.recipient.id = :recipientId) OR (m.sender.id = :recipientId AND m.recipient.id = :senderId) ORDER BY m.createdAt ASC")
    List<Message> findConversationMessages(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);
    
    @Query("SELECT m FROM Message m WHERE ((m.sender.id = :senderId AND m.recipient.id = :recipientId) OR (m.sender.id = :recipientId AND m.recipient.id = :senderId)) AND m.active = :active ORDER BY m.createdAt ASC")
    List<Message> findConversationMessagesAndActive(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId, @Param("active") boolean active);
    
    // Mark messages as read
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP WHERE m.recipient.id = :userId AND m.sender.id = :senderId AND m.isRead = false")
    void markConversationMessagesAsRead(@Param("userId") Long userId, @Param("senderId") Long senderId);
    
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP WHERE m.group.id = :groupId AND m.sender.id != :userId AND m.isRead = false")
    void markGroupMessagesAsRead(@Param("groupId") Long groupId, @Param("userId") Long userId);
} 