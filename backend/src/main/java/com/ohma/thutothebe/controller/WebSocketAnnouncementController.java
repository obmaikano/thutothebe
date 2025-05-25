package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.service.AnnouncementGroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketAnnouncementController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AnnouncementGroupService announcementGroupService;

    @MessageMapping("/announcements/subscribe")
    public void subscribeToAnnouncements(@Payload Map<String, Object> payload, 
                                       SimpMessageHeaderAccessor headerAccessor,
                                       Principal principal) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            // Get all subscription groups for the user
            List<String> subscriptionGroups = announcementGroupService.getAllUserSubscriptionGroupIds(userId);
            
            // Store subscription groups in session attributes for later use
            headerAccessor.getSessionAttributes().put("subscriptionGroups", subscriptionGroups);
            headerAccessor.getSessionAttributes().put("userId", userId);
            
            log.info("User {} subscribed to announcement groups: {}", userId, subscriptionGroups);
            
            // Send confirmation back to user
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/announcements/subscription-confirmed",
                Map.of(
                    "status", "success",
                    "message", "Successfully subscribed to announcements",
                    "groups", subscriptionGroups
                )
            );
            
        } catch (Exception e) {
            log.error("Error subscribing user to announcements: {}", e.getMessage(), e);
            
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/announcements/subscription-error",
                Map.of(
                    "status", "error",
                    "message", "Failed to subscribe to announcements: " + e.getMessage()
                )
            );
        }
    }

    @MessageMapping("/announcements/ping")
    public void ping(Principal principal) {
        // Simple ping-pong for connection health check
        messagingTemplate.convertAndSendToUser(
            principal.getName(),
            "/queue/announcements/pong",
            Map.of(
                "status", "success",
                "timestamp", System.currentTimeMillis()
            )
        );
    }
} 