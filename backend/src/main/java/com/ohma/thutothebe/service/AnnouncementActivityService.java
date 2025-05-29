package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AnnouncementActivityDto;
import com.ohma.thutothebe.entity.AnnouncementActivityType;

import java.util.List;

public interface AnnouncementActivityService extends BaseService<AnnouncementActivityDto, Long> {
    
    List<AnnouncementActivityDto> getActivitiesByAnnouncementId(Long announcementId);
    
    List<AnnouncementActivityDto> getActivitiesByAnnouncementIdAndType(Long announcementId, AnnouncementActivityType type);
    
    List<AnnouncementActivityDto> getActivitiesByUserId(Long userId);
    
    AnnouncementActivityDto createActivity(Long announcementId, Long userId, AnnouncementActivityType type, String details);
    
    long getActivityCount(Long announcementId, AnnouncementActivityType type);
    
    boolean hasUserPerformedActivity(Long announcementId, Long userId, AnnouncementActivityType type);
    
    void recordReadActivity(Long announcementId, Long userId);
    
    void recordAcknowledgeActivity(Long announcementId, Long userId);
    
    void recordCommentActivity(Long announcementId, Long userId, String commentContent);
    
    void recordLikeActivity(Long announcementId, Long userId, String details);
} 