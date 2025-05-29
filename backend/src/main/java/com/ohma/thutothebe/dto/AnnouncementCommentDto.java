package com.ohma.thutothebe.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AnnouncementCommentDto {
    private Long id;
    private String content;
    private Long announcementId;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private Long parentCommentId;
    private List<AnnouncementCommentDto> replies;
    private int likes;
    private boolean isLiked;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
} 