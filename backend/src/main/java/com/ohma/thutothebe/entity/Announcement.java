package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "announcements")
@Data
@EqualsAndHashCode(callSuper = true)
public class Announcement extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnnouncementType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnnouncementPriority priority = AnnouncementPriority.NORMAL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "creator_role", nullable = false)
    private UserRole creatorRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_region_id")
    private Region targetRegion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_school_id")
    private School targetSchool;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_role")
    private UserRole targetRole;

    @Column(name = "target_department")
    private String targetDepartment;

    @Column(name = "target_class")
    private String targetClass;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "comments_enabled", nullable = false)
    private boolean commentsEnabled = false;

    @Column(name = "acknowledgment_required", nullable = false)
    private boolean acknowledgmentRequired = false;

    @Column(name = "attachment_urls", columnDefinition = "TEXT")
    private String attachmentUrls; // JSON array of attachment URLs

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON array of tags

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "announcement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AnnouncementReadReceipt> readReceipts = new HashSet<>();

    @OneToMany(mappedBy = "announcement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AnnouncementAcknowledgment> acknowledgments = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (startDate == null) {
            startDate = LocalDateTime.now();
        }
    }
} 