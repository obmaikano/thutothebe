package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.dto.RealTimeMessageDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.MessageChannelService;
import com.ohma.thutothebe.service.RealTimeMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RealTimeMessageServiceImpl implements RealTimeMessageService {

    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final MessageChannelService messageChannelService;
    private final UserRepository userRepository;

    private static final String REDIS_CHANNEL_PREFIX = "messages:";
    private static final String WEBSOCKET_TOPIC_PREFIX = "/topic/messages/";
    private static final String WEBSOCKET_USER_PREFIX = "/user/";
    private static final String WEBSOCKET_QUEUE_PREFIX = "/queue/messages/";

    @Override
    public void broadcastMessageSent(MessageDTO message) {
        log.info("Starting to broadcast message sent: {}", message.id());
        log.info("Message details - Sender: {}, Recipient: {}, Content: {}", 
                message.senderId(), message.recipientId(), message.content());
        
        List<String> targetChannels = messageChannelService.determineTargetChannels(message);
        log.info("Determined target channels: {}", targetChannels);
        
        for (String channelId : targetChannels) {
            log.info("Broadcasting to channel: {}", channelId);
            
            RealTimeMessageDTO realTimeMessage = convertToRealTimeDTO(
                message, 
                "SENT", 
                channelId, 
                "New message received"
            );
            
            log.info("Created real-time message DTO: {}", realTimeMessage);
            
            sendToChannel(channelId, realTimeMessage);
            publishToRedis(channelId, realTimeMessage);
        }
        
        // Send unread count update to recipient
        if (message.recipientId() != null) {
            log.info("Sending unread count update to recipient: {}", message.recipientId());
            sendUnreadCountUpdate(message.recipientId(), null);
        }
        
        log.info("Broadcasted message sent: {} to {} channels", message.id(), targetChannels.size());
    }

    @Override
    public void broadcastMessageUpdated(MessageDTO message) {
        List<String> targetChannels = messageChannelService.determineTargetChannels(message);
        
        for (String channelId : targetChannels) {
            RealTimeMessageDTO realTimeMessage = convertToRealTimeDTO(
                message, 
                "UPDATED", 
                channelId, 
                "Message updated"
            );
            
            sendToChannel(channelId, realTimeMessage);
            publishToRedis(channelId, realTimeMessage);
        }
        
        log.info("Broadcasted message update: {} to {} channels", message.id(), targetChannels.size());
    }

    @Override
    public void broadcastMessageDeleted(MessageDTO message) {
        List<String> targetChannels = messageChannelService.determineTargetChannels(message);
        
        for (String channelId : targetChannels) {
            RealTimeMessageDTO realTimeMessage = convertToRealTimeDTO(
                message, 
                "DELETED", 
                channelId, 
                "Message deleted"
            );
            
            sendToChannel(channelId, realTimeMessage);
            publishToRedis(channelId, realTimeMessage);
        }
        
        // Send unread count update to recipient
        if (message.recipientId() != null) {
            sendUnreadCountUpdate(message.recipientId(), null);
        }
        
        log.info("Broadcasted message deletion: {} to {} channels", message.id(), targetChannels.size());
    }

    @Override
    public void broadcastMessageDelivered(MessageDTO message) {
        // Send delivery confirmation to sender only
        String senderChannel = WEBSOCKET_USER_PREFIX + message.senderId() + WEBSOCKET_QUEUE_PREFIX + "delivery";
        
        RealTimeMessageDTO realTimeMessage = convertToRealTimeDTO(
            message, 
            "DELIVERED", 
            senderChannel, 
            "Message delivered"
        );
        
        try {
            messagingTemplate.convertAndSendToUser(
                message.senderId().toString(),
                "/queue/messages/delivery",
                realTimeMessage
            );
            
            log.debug("Sent delivery confirmation for message {} to user {}", message.id(), message.senderId());
        } catch (Exception e) {
            log.error("Failed to send delivery confirmation for message {}: {}", message.id(), e.getMessage(), e);
        }
    }

    @Override
    public void broadcastMessageRead(MessageDTO message) {
        // Send read confirmation to sender only
        String senderChannel = WEBSOCKET_USER_PREFIX + message.senderId() + WEBSOCKET_QUEUE_PREFIX + "read";
        
        RealTimeMessageDTO realTimeMessage = convertToRealTimeDTO(
            message, 
            "READ", 
            senderChannel, 
            "Message read"
        );
        
        try {
            messagingTemplate.convertAndSendToUser(
                message.senderId().toString(),
                "/queue/messages/read",
                realTimeMessage
            );
            
            log.debug("Sent read confirmation for message {} to user {}", message.id(), message.senderId());
        } catch (Exception e) {
            log.error("Failed to send read confirmation for message {}: {}", message.id(), e.getMessage(), e);
        }
    }

    @Override
    public void broadcastTypingIndicator(Long userId, String channelId, boolean isTyping) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            
            RealTimeMessageDTO typingIndicator = createTypingIndicatorDTO(
                userId, 
                user.getFirstName() + " " + user.getLastName(), 
                channelId, 
                isTyping
            );
            
            sendToChannel(channelId, typingIndicator);
            publishToRedis(channelId, typingIndicator);
            
            log.debug("Broadcasted typing indicator for user {} in channel {}: {}", userId, channelId, isTyping);
            
        } catch (Exception e) {
            log.error("Failed to broadcast typing indicator for user {} in channel {}: {}", userId, channelId, e.getMessage(), e);
        }
    }

    @Override
    public void sendToChannel(String channelId, RealTimeMessageDTO realTimeMessage) {
        try {
            String destination = WEBSOCKET_TOPIC_PREFIX + channelId;
            log.info("Sending real-time message to WebSocket destination: {}", destination);
            log.info("Message content: {}", realTimeMessage);
            
            messagingTemplate.convertAndSend(destination, realTimeMessage);
            log.info("Successfully sent real-time message to WebSocket topic: {}", destination);
        } catch (Exception e) {
            log.error("Failed to send real-time message to channel {}: {}", channelId, e.getMessage(), e);
        }
    }

    @Override
    public RealTimeMessageDTO convertToRealTimeDTO(MessageDTO message, String eventType, String channelId, String notificationMessage) {
        try {
            // Get sender information
            User sender = userRepository.findById(message.senderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with id: " + message.senderId()));
            
            // Get recipient information if available
            String recipientName = null;
            if (message.recipientId() != null) {
                User recipient = userRepository.findById(message.recipientId()).orElse(null);
                if (recipient != null) {
                    recipientName = recipient.getFirstName() + " " + recipient.getLastName();
                }
            }
            
            return new RealTimeMessageDTO(
                message.id(),
                message.content(),
                message.senderId(),
                sender.getFirstName() + " " + sender.getLastName(),
                sender.getRole().name(),
                message.recipientId(),
                recipientName,
                message.groupId(),
                null, // Group name would be fetched if needed
                message.createdAt(),
                null, // Updated at would be set if available
                message.active(),
                eventType,
                channelId,
                notificationMessage,
                false, // isDelivered - would be set based on actual status
                false, // isRead - would be set based on actual status
                null, // deliveredAt
                null, // readAt
                false, // isTyping
                null, // typingUserId
                null  // typingUserName
            );
            
        } catch (Exception e) {
            log.error("Error converting message {} to real-time DTO: {}", message.id(), e.getMessage(), e);
            throw new RuntimeException("Failed to convert message to real-time DTO", e);
        }
    }

    @Override
    public RealTimeMessageDTO createTypingIndicatorDTO(Long userId, String userName, String channelId, boolean isTyping) {
        return new RealTimeMessageDTO(
            null, // No message ID for typing indicator
            "", // No content for typing indicator
            userId,
            userName,
            null, // No role needed for typing indicator
            null, // No recipient for typing indicator
            null, // No recipient name
            null, // No group ID
            null, // No group name
            LocalDateTime.now(),
            null, // No updated at
            true, // Active
            "TYPING", // Event type
            channelId,
            isTyping ? userName + " is typing..." : userName + " stopped typing",
            false, // Not delivered
            false, // Not read
            null, // No delivered at
            null, // No read at
            isTyping, // Typing status
            userId, // Typing user ID
            userName // Typing user name
        );
    }

    @Override
    public void sendUnreadCountUpdate(Long userId, String channelId) {
        try {
            Long totalUnreadCount = messageChannelService.getUnreadMessageCount(userId);
            Long channelUnreadCount = null;
            
            if (channelId != null) {
                channelUnreadCount = messageChannelService.getUnreadMessageCountForChannel(userId, channelId);
            }
            
            Map<String, Object> unreadUpdate = new HashMap<>();
            unreadUpdate.put("userId", userId);
            unreadUpdate.put("totalUnreadCount", totalUnreadCount);
            unreadUpdate.put("channelId", channelId);
            unreadUpdate.put("channelUnreadCount", channelUnreadCount);
            unreadUpdate.put("timestamp", LocalDateTime.now());
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/messages/unread-count",
                unreadUpdate
            );
            
            log.debug("Sent unread count update to user {}: total={}, channel={}:{}", 
                userId, totalUnreadCount, channelId, channelUnreadCount);
            
        } catch (Exception e) {
            log.error("Failed to send unread count update to user {}: {}", userId, e.getMessage(), e);
        }
    }

    private void publishToRedis(String channelId, RealTimeMessageDTO realTimeMessage) {
        try {
            String redisChannel = REDIS_CHANNEL_PREFIX + channelId;
            redisTemplate.convertAndSend(redisChannel, realTimeMessage);
            log.debug("Published real-time message to Redis channel: {}", redisChannel);
        } catch (Exception e) {
            log.error("Failed to publish to Redis channel {}: {}", channelId, e.getMessage(), e);
        }
    }
} 