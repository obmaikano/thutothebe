package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AnnouncementCommentDto;

import java.util.List;

public interface AnnouncementCommentService extends BaseService<AnnouncementCommentDto, Long> {
    
    List<AnnouncementCommentDto> getCommentsByAnnouncementId(Long announcementId);
    
    List<AnnouncementCommentDto> getRepliesByParentCommentId(Long parentCommentId);
    
    AnnouncementCommentDto createComment(Long announcementId, Long authorId, String content, Long parentCommentId);
    
    AnnouncementCommentDto updateComment(Long commentId, String content, Long userId);
    
    void deleteComment(Long commentId, Long userId);
    
    void toggleLike(Long commentId, Long userId);
    
    boolean isCommentLikedByUser(Long commentId, Long userId);
    
    long getCommentCount(Long announcementId);
    
    List<AnnouncementCommentDto> getCommentsByAuthor(Long authorId);
} 