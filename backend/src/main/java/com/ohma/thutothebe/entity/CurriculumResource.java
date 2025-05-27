package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "curriculum_resources")
@EqualsAndHashCode(callSuper = true)
public class CurriculumResource extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id")
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_unit_id")
    private CurriculumUnit curriculumUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_topic_id")
    private CurriculumTopic curriculumTopic;

    @NotBlank
    @Size(max = 255)
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false)
    private ResourceType resourceType;

    @NotBlank
    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize; // in bytes

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // for videos/audio

    @Column(name = "language")
    private String language;

    @Column(name = "accessibility_features", columnDefinition = "TEXT")
    private String accessibilityFeatures; // JSON array

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON array

    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata; // Additional metadata

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "access_count", nullable = false)
    private Long accessCount = 0L;

    @Column(name = "download_count", nullable = false)
    private Long downloadCount = 0L;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = false;

    @Column(name = "requires_authentication", nullable = false)
    private boolean requiresAuthentication = true;

    @Column(name = "copyright_info", columnDefinition = "TEXT")
    private String copyrightInfo;

    @Column(name = "license_type")
    private String licenseType;

    @Column(name = "external_id")
    private String externalId; // For external system integration

    @Column(name = "checksum")
    private String checksum; // For file integrity

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }

    public enum ResourceType {
        DOCUMENT,
        VIDEO,
        AUDIO,
        IMAGE,
        PRESENTATION,
        SPREADSHEET,
        INTERACTIVE,
        LINK,
        ARCHIVE,
        EBOOK,
        SIMULATION,
        ASSESSMENT_TOOL,
        REFERENCE_MATERIAL,
        MULTIMEDIA_PACKAGE
    }
} 