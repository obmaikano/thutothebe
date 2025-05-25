package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "messages")
@EqualsAndHashCode(callSuper = true)
public class Message extends BaseEntity {
    
    @Column(length = 4000, nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private MessageGroup group;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType = MessageType.TEXT;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private boolean active = true;
    
    // Real-time messaging features
    @Column(name = "is_delivered", nullable = false)
    private boolean isDelivered = false;
    
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;
    
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @Column(name = "reply_to_message_id")
    private Long replyToMessageId;
    
    @Column(name = "edited", nullable = false)
    private boolean edited = false;
    
    @Column(name = "edited_at")
    private LocalDateTime editedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        setModifiedAt(LocalDateTime.now());
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        setModifiedAt(LocalDateTime.now());
        if (isRead && readAt == null) {
            readAt = LocalDateTime.now();
        }
        if (isDelivered && deliveredAt == null) {
            deliveredAt = LocalDateTime.now();
        }
    }
    
    public void markAsDelivered() {
        this.isDelivered = true;
        this.deliveredAt = LocalDateTime.now();
    }
    
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
        if (!this.isDelivered) {
            markAsDelivered();
        }
    }
    
    public void markAsEdited() {
        this.edited = true;
        this.editedAt = LocalDateTime.now();
    }
} 