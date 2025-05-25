package com.ohma.thutothebe.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.RealTimeAnnouncementDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisAnnouncementSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    private static final String WEBSOCKET_TOPIC_PREFIX = "/topic/announcements/";

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String channel = new String(message.getChannel());
            String messageBody = new String(message.getBody());
            
            log.debug("Received Redis message on channel: {}", channel);
            
            // Extract group ID from channel name
            String groupId = extractGroupIdFromChannel(channel);
            if (groupId == null) {
                log.warn("Could not extract group ID from channel: {}", channel);
                return;
            }
            
            // Deserialize the announcement
            RealTimeAnnouncementDTO announcement = objectMapper.readValue(messageBody, RealTimeAnnouncementDTO.class);
            
            // Forward to WebSocket subscribers
            String destination = WEBSOCKET_TOPIC_PREFIX + groupId;
            messagingTemplate.convertAndSend(destination, announcement);
            
            log.debug("Forwarded Redis message to WebSocket topic: {}", destination);
            
        } catch (Exception e) {
            log.error("Error processing Redis message: {}", e.getMessage(), e);
        }
    }

    private String extractGroupIdFromChannel(String channel) {
        // Channel format: "announcements:{groupId}"
        if (channel.startsWith("announcements:")) {
            return channel.substring("announcements:".length());
        }
        return null;
    }
} 