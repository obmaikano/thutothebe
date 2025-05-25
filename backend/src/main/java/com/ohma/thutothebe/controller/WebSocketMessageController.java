package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.service.MessageChannelService;
import com.ohma.thutothebe.service.MessageService;
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
public class WebSocketMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageChannelService messageChannelService;
    private final MessageService messageService;

    @MessageMapping("/messages/subscribe")
    public void subscribeToMessages(@Payload Map<String, Object> payload, 
                                   SimpMessageHeaderAccessor headerAccessor,
                                   Principal principal) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            // Get all subscription channels for the user
            List<String> subscriptionChannels = messageChannelService.getAllUserChannelSubscriptions(userId);
            
            // Store subscription channels in session attributes for later use
            headerAccessor.getSessionAttributes().put("subscriptionChannels", subscriptionChannels);
            headerAccessor.getSessionAttributes().put("userId", userId);
            
            log.info("User {} subscribed to message channels: {}", userId, subscriptionChannels);
            
            // Send confirmation back to user
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/messages/subscription-confirmed",
                Map.of(
                    "status", "success",
                    "message", "Successfully subscribed to messages",
                    "channels", subscriptionChannels
                )
            );
            
        } catch (Exception e) {
            log.error("Error subscribing user to messages: {}", e.getMessage(), e);
            
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/messages/subscription-error",
                Map.of(
                    "status", "error",
                    "message", "Failed to subscribe to messages: " + e.getMessage()
                )
            );
        }
    }

    @MessageMapping("/messages/typing")
    public void handleTypingIndicator(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String channelId = payload.get("channelId").toString();
            boolean isTyping = Boolean.parseBoolean(payload.get("isTyping").toString());
            
            // Verify user has access to the channel
            if (!messageChannelService.hasChannelAccess(userId, channelId)) {
                log.warn("User {} attempted to send typing indicator to unauthorized channel: {}", userId, channelId);
                return;
            }
            
            // Send typing indicator
            messageService.sendTypingIndicator(userId, channelId, isTyping);
            
            log.debug("Processed typing indicator for user {} in channel {}: {}", userId, channelId, isTyping);
            
        } catch (Exception e) {
            log.error("Error processing typing indicator: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/mark-delivered")
    public void markMessageAsDelivered(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long messageId = Long.valueOf(payload.get("messageId").toString());
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            messageService.markMessageAsDelivered(messageId, userId);
            
            log.debug("Marked message {} as delivered for user {}", messageId, userId);
            
        } catch (Exception e) {
            log.error("Error marking message as delivered: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/mark-read")
    public void markMessageAsRead(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long messageId = Long.valueOf(payload.get("messageId").toString());
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            messageService.markMessageAsRead(messageId, userId);
            
            log.debug("Marked message {} as read for user {}", messageId, userId);
            
        } catch (Exception e) {
            log.error("Error marking message as read: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/mark-conversation-read")
    public void markConversationAsRead(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Long partnerId = Long.valueOf(payload.get("partnerId").toString());
            
            messageService.markConversationAsRead(userId, partnerId);
            
            log.debug("Marked conversation as read for user {} with partner {}", userId, partnerId);
            
        } catch (Exception e) {
            log.error("Error marking conversation as read: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/ping")
    public void ping(Principal principal) {
        // Simple ping-pong for connection health check
        messagingTemplate.convertAndSendToUser(
            principal.getName(),
            "/queue/messages/pong",
            Map.of(
                "status", "success",
                "timestamp", System.currentTimeMillis()
            )
        );
    }
} 