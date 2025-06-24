package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.dto.RealTimeAnnouncementDTO;
import com.ohma.thutothebe.service.AnnouncementGroupService;
import com.ohma.thutothebe.service.RealTimeAnnouncementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true", matchIfMissing = true)
public class RealTimeAnnouncementServiceImpl implements RealTimeAnnouncementService {

    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AnnouncementGroupService announcementGroupService;

    private static final String REDIS_CHANNEL_PREFIX = "announcements:";
    private static final String WEBSOCKET_TOPIC_PREFIX = "/topic/announcements/";

    @Override
    public void broadcastAnnouncementCreated(AnnouncementDTO announcement) {
        List<String> targetGroups = announcementGroupService.determineTargetGroups(announcement);
        
        for (String groupId : targetGroups) {
            RealTimeAnnouncementDTO realTimeAnnouncement = convertToRealTimeDTO(
                announcement, 
                "CREATED", 
                groupId, 
                "New announcement: " + announcement.title()
            );
            
            sendToGroup(groupId, realTimeAnnouncement);
            publishToRedis(groupId, realTimeAnnouncement);
        }
        
        log.info("Broadcasted announcement creation: {} to {} groups", 
                announcement.id(), targetGroups.size());
    }

    @Override
    public void broadcastAnnouncementUpdated(AnnouncementDTO announcement) {
        List<String> targetGroups = announcementGroupService.determineTargetGroups(announcement);
        
        for (String groupId : targetGroups) {
            RealTimeAnnouncementDTO realTimeAnnouncement = convertToRealTimeDTO(
                announcement, 
                "UPDATED", 
                groupId, 
                "Announcement updated: " + announcement.title()
            );
            
            sendToGroup(groupId, realTimeAnnouncement);
            publishToRedis(groupId, realTimeAnnouncement);
        }
        
        log.info("Broadcasted announcement update: {} to {} groups", 
                announcement.id(), targetGroups.size());
    }

    @Override
    public void broadcastAnnouncementDeleted(AnnouncementDTO announcement) {
        List<String> targetGroups = announcementGroupService.determineTargetGroups(announcement);
        
        for (String groupId : targetGroups) {
            RealTimeAnnouncementDTO realTimeAnnouncement = convertToRealTimeDTO(
                announcement, 
                "DELETED", 
                groupId, 
                "Announcement deleted: " + announcement.title()
            );
            
            sendToGroup(groupId, realTimeAnnouncement);
            publishToRedis(groupId, realTimeAnnouncement);
        }
        
        log.info("Broadcasted announcement deletion: {} to {} groups", 
                announcement.id(), targetGroups.size());
    }

    @Override
    public void broadcastAnnouncementStatusChanged(AnnouncementDTO announcement, boolean activated) {
        List<String> targetGroups = announcementGroupService.determineTargetGroups(announcement);
        String eventType = activated ? "ACTIVATED" : "DEACTIVATED";
        String message = String.format("Announcement %s: %s", 
                activated ? "activated" : "deactivated", announcement.title());
        
        for (String groupId : targetGroups) {
            RealTimeAnnouncementDTO realTimeAnnouncement = convertToRealTimeDTO(
                announcement, 
                eventType, 
                groupId, 
                message
            );
            
            sendToGroup(groupId, realTimeAnnouncement);
            publishToRedis(groupId, realTimeAnnouncement);
        }
        
        log.info("Broadcasted announcement status change: {} ({}) to {} groups", 
                announcement.id(), eventType, targetGroups.size());
    }

    @Override
    public void sendToGroup(String groupId, RealTimeAnnouncementDTO realTimeAnnouncement) {
        try {
            String destination = WEBSOCKET_TOPIC_PREFIX + groupId;
            messagingTemplate.convertAndSend(destination, realTimeAnnouncement);
            log.debug("Sent real-time announcement to WebSocket topic: {}", destination);
        } catch (Exception e) {
            log.error("Failed to send real-time announcement to group {}: {}", groupId, e.getMessage(), e);
        }
    }

    @Override
    public RealTimeAnnouncementDTO convertToRealTimeDTO(AnnouncementDTO announcement, String eventType, String groupId, String message) {
        return new RealTimeAnnouncementDTO(
            announcement.id(),
            announcement.title(),
            announcement.content(),
            announcement.type(),
            announcement.priority(),
            announcement.creatorId(),
            announcement.creatorName(),
            announcement.creatorRole(),
            announcement.targetRegionId(),
            announcement.targetRegionName(),
            announcement.targetSchoolId(),
            announcement.targetSchoolName(),
            announcement.targetRole(),
            announcement.targetDepartment(),
            announcement.targetClass(),
            announcement.startDate(),
            announcement.endDate(),
            announcement.commentsEnabled(),
            announcement.acknowledgmentRequired(),
            announcement.attachmentUrls(),
            announcement.tags(),
            announcement.createdAt(),
            eventType,
            groupId,
            message
        );
    }

    private void publishToRedis(String groupId, RealTimeAnnouncementDTO realTimeAnnouncement) {
        try {
            String channel = REDIS_CHANNEL_PREFIX + groupId;
            redisTemplate.convertAndSend(channel, realTimeAnnouncement);
            log.debug("Published real-time announcement to Redis channel: {}", channel);
        } catch (Exception e) {
            log.error("Failed to publish to Redis channel {}: {}", groupId, e.getMessage(), e);
        }
    }
} 