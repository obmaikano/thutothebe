package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
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
} 