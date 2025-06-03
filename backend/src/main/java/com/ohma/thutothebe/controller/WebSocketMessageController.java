package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.MessageChannelService;
import com.ohma.thutothebe.service.MessageService;
import com.ohma.thutothebe.service.impl.RuleBasedAccessControlServiceImpl;
import com.ohma.thutothebe.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;

    @Autowired
    private AuthUtils authUtils;

    /**
     * Helper method to get current user ID from Principal
     */
    private Long getCurrentUserId(Principal principal) {
        if (principal == null) {
            return null;
        }
        try {
            return Long.valueOf(principal.getName());
        } catch (NumberFormatException e) {
            log.warn("Invalid user ID in principal: {}", principal.getName());
            return null;
        }
    }

    /**
     * Helper method to check access for WebSocket operations
     */
    private boolean hasAccess(Long userId, AccessScope scope, Long scopeId) {
        if (userId == null) {
            return false;
        }
        return accessControlService.hasAccess(userId, scope, scopeId);
    }

    /**
     * Helper method to send error response to user
     */
    private void sendErrorResponse(Principal principal, String destination, String message) {
        if (principal != null) {
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                destination,
                Map.of(
                    "status", "error",
                    "message", message
                )
            );
        }
    }

    @MessageMapping("/messages/subscribe")
    public void subscribeToMessages(@Payload Map<String, Object> payload, 
                                   SimpMessageHeaderAccessor headerAccessor,
                                   Principal principal) {
        try {
            Long currentUserId = getCurrentUserId(principal);
            if (currentUserId == null) {
                log.warn("Unauthenticated user attempted to subscribe to messages");
                sendErrorResponse(principal, "/queue/messages/subscription-error", "Authentication required");
                return;
            }

            Long userId = Long.valueOf(payload.get("userId").toString());
            
            // Check if user has access to subscribe for this user ID (self-access or admin access)
            if (!hasAccess(currentUserId, AccessScope.USER, userId) && !hasAccess(currentUserId, AccessScope.GLOBAL, null)) {
                log.warn("User {} attempted to subscribe to messages for unauthorized user: {}", currentUserId, userId);
                sendErrorResponse(principal, "/queue/messages/subscription-error", "Access denied to subscribe for this user");
                return;
            }
            
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
            sendErrorResponse(principal, "/queue/messages/subscription-error", "Failed to subscribe to messages: " + e.getMessage());
        }
    }

    @MessageMapping("/messages/typing")
    public void handleTypingIndicator(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long currentUserId = getCurrentUserId(principal);
            if (currentUserId == null) {
                log.warn("Unauthenticated user attempted to send typing indicator");
                return;
            }

            Long userId = Long.valueOf(payload.get("userId").toString());
            String channelId = payload.get("channelId").toString();
            boolean isTyping = Boolean.parseBoolean(payload.get("isTyping").toString());
            
            // Check if user has access to send typing indicators for this user ID (self-access or admin access)
            if (!hasAccess(currentUserId, AccessScope.USER, userId) && !hasAccess(currentUserId, AccessScope.GLOBAL, null)) {
                log.warn("User {} attempted to send typing indicator for unauthorized user: {}", currentUserId, userId);
                return;
            }
            
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
            Long currentUserId = getCurrentUserId(principal);
            if (currentUserId == null) {
                log.warn("Unauthenticated user attempted to mark message as delivered");
                return;
            }

            Long messageId = Long.valueOf(payload.get("messageId").toString());
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            // Check if user has access to mark messages as delivered for this user ID (self-access or admin access)
            if (!hasAccess(currentUserId, AccessScope.USER, userId) && !hasAccess(currentUserId, AccessScope.GLOBAL, null)) {
                log.warn("User {} attempted to mark message as delivered for unauthorized user: {}", currentUserId, userId);
                return;
            }
            
            messageService.markMessageAsDelivered(messageId, userId);
            
            log.debug("Marked message {} as delivered for user {}", messageId, userId);
            
        } catch (Exception e) {
            log.error("Error marking message as delivered: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/mark-read")
    public void markMessageAsRead(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long currentUserId = getCurrentUserId(principal);
            if (currentUserId == null) {
                log.warn("Unauthenticated user attempted to mark message as read");
                return;
            }

            Long messageId = Long.valueOf(payload.get("messageId").toString());
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            // Check if user has access to mark messages as read for this user ID (self-access or admin access)
            if (!hasAccess(currentUserId, AccessScope.USER, userId) && !hasAccess(currentUserId, AccessScope.GLOBAL, null)) {
                log.warn("User {} attempted to mark message as read for unauthorized user: {}", currentUserId, userId);
                return;
            }
            
            messageService.markMessageAsRead(messageId, userId);
            
            log.debug("Marked message {} as read for user {}", messageId, userId);
            
        } catch (Exception e) {
            log.error("Error marking message as read: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/mark-conversation-read")
    public void markConversationAsRead(@Payload Map<String, Object> payload, Principal principal) {
        try {
            Long currentUserId = getCurrentUserId(principal);
            if (currentUserId == null) {
                log.warn("Unauthenticated user attempted to mark conversation as read");
                return;
            }

            Long userId = Long.valueOf(payload.get("userId").toString());
            Long partnerId = Long.valueOf(payload.get("partnerId").toString());
            
            // Check if user has access to mark conversations as read for this user ID (self-access or admin access)
            if (!hasAccess(currentUserId, AccessScope.USER, userId) && !hasAccess(currentUserId, AccessScope.GLOBAL, null)) {
                log.warn("User {} attempted to mark conversation as read for unauthorized user: {}", currentUserId, userId);
                return;
            }
            
            messageService.markConversationAsRead(userId, partnerId);
            
            log.debug("Marked conversation as read for user {} with partner {}", userId, partnerId);
            
        } catch (Exception e) {
            log.error("Error marking conversation as read: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/messages/ping")
    public void ping(Principal principal) {
        try {
            Long currentUserId = getCurrentUserId(principal);
            if (currentUserId == null) {
                log.warn("Unauthenticated user attempted to ping");
                sendErrorResponse(principal, "/queue/messages/pong", "Authentication required");
                return;
            }

            // Simple ping-pong for connection health check - authenticated users can ping
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/messages/pong",
                Map.of(
                    "status", "success",
                    "timestamp", System.currentTimeMillis(),
                    "userId", currentUserId
                )
            );
            
            log.debug("Processed ping from user {}", currentUserId);
            
        } catch (Exception e) {
            log.error("Error processing ping: {}", e.getMessage(), e);
            sendErrorResponse(principal, "/queue/messages/pong", "Failed to process ping: " + e.getMessage());
        }
    }
} 