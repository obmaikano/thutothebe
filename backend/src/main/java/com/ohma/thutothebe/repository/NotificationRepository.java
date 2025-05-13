package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Notification;
import com.ohma.thutothebe.entity.Notification.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.active = :active ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndActive(@Param("userId") Long userId, @Param("active") boolean active, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.type = :type ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndType(@Param("userId") Long userId, @Param("type") NotificationType type, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.type = :type AND n.active = :active ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndTypeAndActive(@Param("userId") Long userId, @Param("type") NotificationType type, @Param("active") boolean active, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.readAt IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByRecipientId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :userId AND n.readAt IS NULL")
    long countUnreadByRecipientId(@Param("userId") Long userId);
} 