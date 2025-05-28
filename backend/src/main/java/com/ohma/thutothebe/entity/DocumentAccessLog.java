package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "document_access_logs")
@EqualsAndHashCode(callSuper = true)
public class DocumentAccessLog extends BaseEntity {

    @NotNull(message = "Document is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Access type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "access_type", nullable = false)
    private DocumentAccessType accessType;

    @Column(name = "accessed_at", nullable = false)
    private LocalDateTime accessedAt;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "success", nullable = false)
    private boolean success = true;

    @Column(name = "error_message")
    private String errorMessage;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (accessedAt == null) {
            accessedAt = LocalDateTime.now();
        }
    }
} 