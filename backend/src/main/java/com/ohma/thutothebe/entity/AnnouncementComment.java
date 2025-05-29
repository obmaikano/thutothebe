package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "announcement_comments")
@Data
@EqualsAndHashCode(callSuper = true)
public class AnnouncementComment extends BaseEntity {

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private AnnouncementComment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AnnouncementComment> replies = new HashSet<>();

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AnnouncementCommentLike> likes = new HashSet<>();

    @Column(nullable = false)
    private boolean active = true;

    // Helper method to get like count
    public int getLikeCount() {
        return likes != null ? likes.size() : 0;
    }

    // Helper method to check if user liked this comment
    public boolean isLikedByUser(Long userId) {
        return likes != null && likes.stream()
                .anyMatch(like -> like.getUser().getId().equals(userId) && like.isActive());
    }
} 