package com.ohma.thutothebe.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.RealTimeMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    private static final String WEBSOCKET_TOPIC_PREFIX = "/topic/messages/";

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String channel = new String(message.getChannel());
            String messageBody = new String(message.getBody());
            
            log.debug("Received Redis message on channel: {}", channel);
            
            // Extract channel ID from Redis channel name
            String channelId = extractChannelIdFromRedisChannel(channel);
            if (channelId == null) {
                log.warn("Could not extract channel ID from Redis channel: {}", channel);
                return;
            }
            
            // Deserialize the real-time message
            RealTimeMessageDTO realTimeMessage = objectMapper.readValue(messageBody, RealTimeMessageDTO.class);
            
            // Forward to WebSocket subscribers
            String destination = WEBSOCKET_TOPIC_PREFIX + channelId;
            messagingTemplate.convertAndSend(destination, realTimeMessage);
            
            log.debug("Forwarded Redis message to WebSocket topic: {}", destination);
            
        } catch (Exception e) {
            log.error("Error processing Redis message: {}", e.getMessage(), e);
        }
    }

    private String extractChannelIdFromRedisChannel(String redisChannel) {
        // Redis channel format: "messages:{channelId}"
        if (redisChannel.startsWith("messages:")) {
            return redisChannel.substring("messages:".length());
        }
        return null;
    }
} 