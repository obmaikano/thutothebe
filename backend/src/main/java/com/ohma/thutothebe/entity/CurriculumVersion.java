package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "curriculum_versions")
@EqualsAndHashCode(callSuper = true)
public class CurriculumVersion extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @NotNull
    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @NotBlank
    @Column(name = "version_name", nullable = false)
    private String versionName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "snapshot_data", columnDefinition = "JSONB", nullable = false)
    private String snapshotData; // JSON snapshot of curriculum state

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "change_summary", columnDefinition = "TEXT")
    private String changeSummary;

    @Column(name = "is_major_version", nullable = false)
    private boolean isMajorVersion = false;

    @Column(name = "is_current", nullable = false)
    private boolean isCurrent = false;

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON array of tags

    @Column(name = "file_path")
    private String filePath; // Path to exported version file

    @Column(name = "checksum")
    private String checksum; // For integrity verification

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
} 