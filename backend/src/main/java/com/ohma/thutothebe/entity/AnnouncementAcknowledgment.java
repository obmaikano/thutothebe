package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcement_acknowledgments", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"announcement_id", "user_id"}))
@Data
@EqualsAndHashCode(callSuper = true)
public class AnnouncementAcknowledgment extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "acknowledged_at", nullable = false)
    private LocalDateTime acknowledgedAt;

    @Column(name = "acknowledgment_note", columnDefinition = "TEXT")
    private String acknowledgmentNote;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (acknowledgedAt == null) {
            acknowledgedAt = LocalDateTime.now();
        }
    }
} 