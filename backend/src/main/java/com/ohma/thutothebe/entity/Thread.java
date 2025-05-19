package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "threads")
@EqualsAndHashCode(callSuper = true)
public class Thread extends BaseEntity {
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_id", nullable = false)
    private Forum forum;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();
    
    @Column(nullable = false)
    private boolean pinned = false;
    
    @Column(name = "last_activity_at", nullable = false)
    private LocalDateTime lastActivityAt;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastActivityAt = LocalDateTime.now();
    }
} 