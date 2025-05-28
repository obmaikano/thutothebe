# Real-Time Messaging System Implementation

## Overview

This document describes the implementation of a comprehensive real-time, low-latency messaging system for the Spring Boot application. The system provides instant message delivery, role-based chat capabilities (1:1, group, broadcast), typing indicators, message status tracking, and cross-instance scaling using WebSockets and Redis pub/sub.

## Architecture

### Technology Stack
- **Backend**: Spring Boot 3 + WebSocket + Redis
- **Real-Time**: STOMP over WebSocket (SockJS)
- **Messaging**: Redis Pub/Sub for cross-instance communication
- **Database**: PostgreSQL for message persistence
- **Serialization**: Jackson JSON

### Core Components

#### 1. Enhanced Message Entity (`Message.java`)
```java
@Entity
@Table(name = "messages")
public class Message extends BaseEntity {
    // Basic message fields
    private String content;
    private User sender;
    private User recipient;
    private MessageGroup group;
    private MessageType messageType;
    
    // Real-time messaging features
    private boolean isDelivered = false;
    private boolean isRead = false;
    private LocalDateTime deliveredAt;
    private LocalDateTime readAt;
    private Long replyToMessageId;
    private boolean edited = false;
    private LocalDateTime editedAt;
    
    // Convenience methods
    public void markAsDelivered();
    public void markAsRead();
    public void markAsEdited();
}
```

**Features:**
- Message delivery tracking
- Read receipts
- Message editing history
- Reply threading support
- Multiple message types (TEXT, IMAGE, FILE, AUDIO, VIDEO, SYSTEM)

#### 2. Enhanced MessageDTO (`MessageDTO.java`)
```java
public record MessageDTO(
    Long id,
    String content,
    Long senderId,
    String senderName,
    Long recipientId,
    String recipientName,
    Long groupId,
    String groupName,
    MessageType messageType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean active,
    
    // Real-time messaging fields
    boolean isDelivered,
    boolean isRead,
    LocalDateTime deliveredAt,
    LocalDateTime readAt,
    Long replyToMessageId,
    boolean edited,
    LocalDateTime editedAt
) {}
```

#### 3. Real-Time Message DTO (`RealTimeMessageDTO.java`)
```java
public record RealTimeMessageDTO(
    // Standard message fields
    Long id,
    String content,
    Long senderId,
    String senderName,
    String senderRole,
    Long recipientId,
    String recipientName,
    Long groupId,
    String groupName,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean active,
    
    // Real-time specific fields
    String eventType, // "SENT", "UPDATED", "DELETED", "DELIVERED", "READ", "TYPING"
    String channelId, // Target channel for WebSocket subscription
    String message, // Optional notification message
    
    // Message status fields
    boolean isDelivered,
    boolean isRead,
    LocalDateTime deliveredAt,
    LocalDateTime readAt,
    
    // Typing indicator fields
    boolean isTyping,
    Long typingUserId,
    String typingUserName
) {}
```

#### 4. Message Channel Service (`MessageChannelService.java`)
Handles channel routing and access control for different message types:

**Channel Types:**
- **Conversation channels**: `conversation:userId1:userId2`
- **Group channels**: `group:groupId`
- **Class channels**: `class:classId`
- **School channels**: `school:schoolId`
- **Role channels**: `role:schoolId:role`

**Key Methods:**
```java
List<String> determineTargetChannels(MessageDTO message);
List<String> getAllUserChannelSubscriptions(Long userId);
String generateConversationChannelId(Long userId1, Long userId2);
boolean hasChannelAccess(Long userId, String channelId);
Long getUnreadMessageCount(Long userId);
```

#### 5. Real-Time Message Service (`RealTimeMessageService.java`)
Handles real-time broadcasting and WebSocket communication:

**Broadcasting Methods:**
```java
void broadcastMessageSent(MessageDTO message);
void broadcastMessageUpdated(MessageDTO message);
void broadcastMessageDeleted(MessageDTO message);
void broadcastMessageDelivered(MessageDTO message);
void broadcastMessageRead(MessageDTO message);
void broadcastTypingIndicator(Long userId, String channelId, boolean isTyping);
void sendUnreadCountUpdate(Long userId, String channelId);
```

#### 6. Enhanced Message Service (`MessageService.java`)
Extended with real-time messaging capabilities:

**Real-Time Methods:**
```java
MessageDTO sendMessage(MessageDTO messageDTO);
MessageDTO updateMessage(Long messageId, MessageDTO messageDTO, Long userId);
void deleteMessage(Long messageId, Long userId);
void markMessageAsDelivered(Long messageId, Long userId);
void markMessageAsRead(Long messageId, Long userId);
void markConversationAsRead(Long userId, Long partnerId);
void markGroupMessagesAsRead(Long groupId, Long userId);
void sendTypingIndicator(Long userId, String channelId, boolean isTyping);
```

#### 7. Enhanced Message Repository (`MessageRepository.java`)
Added queries for real-time messaging:

```java
// Unread message counts
Long countUnreadMessagesForUser(@Param("userId") Long userId);
Long countUnreadMessagesInConversation(@Param("userId") Long userId, @Param("partnerId") Long partnerId);
Long countUnreadMessagesInGroup(@Param("userId") Long userId, @Param("groupId") Long groupId);

// Conversation queries
List<Message> findConversationMessages(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);

// Bulk read status updates
@Modifying
void markConversationMessagesAsRead(@Param("userId") Long userId, @Param("senderId") Long senderId);
@Modifying
void markGroupMessagesAsRead(@Param("groupId") Long groupId, @Param("userId") Long userId);
```

#### 8. Redis Integration (`RedisMessageSubscriber.java`)
Handles cross-instance message broadcasting:

```java
@Service
public class RedisMessageSubscriber implements MessageListener {
    @Override
    public void onMessage(Message message, byte[] pattern) {
        // 1. Extract channel ID from Redis channel
        // 2. Deserialize RealTimeMessageDTO
        // 3. Forward to WebSocket subscribers
    }
}
```

#### 9. WebSocket Configuration (`WebSocketConfig.java`)
Already configured for messaging:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // Endpoints: /ws with SockJS fallback
    // Topics: /topic/messages/{channelId}
    // Queues: /queue/messages/*
    // User destinations: /user/{userId}/queue/messages/*
}
```

#### 10. WebSocket Message Controller (`WebSocketMessageController.java`)
Handles client WebSocket connections:

```java
@MessageMapping("/messages/subscribe")
public void subscribeToMessages(@Payload Map<String, Object> payload);

@MessageMapping("/messages/typing")
public void handleTypingIndicator(@Payload Map<String, Object> payload);

@MessageMapping("/messages/mark-delivered")
public void markMessageAsDelivered(@Payload Map<String, Object> payload);

@MessageMapping("/messages/mark-read")
public void markMessageAsRead(@Payload Map<String, Object> payload);

@MessageMapping("/messages/ping")
public void ping(Principal principal);
```

#### 11. Enhanced Message Controller (`MessageController.java`)
REST API endpoints for messaging:

**Real-Time Endpoints:**
```java
POST /messages - Send a new message
PUT /messages/{messageId} - Update a message
DELETE /messages/{messageId} - Delete a message
POST /messages/{messageId}/delivered - Mark message as delivered
POST /messages/{messageId}/read - Mark message as read
POST /messages/conversation/read - Mark conversation as read
POST /messages/group/{groupId}/read - Mark group messages as read
GET /messages/conversation/{userId1}/{userId2} - Get conversation messages
GET /messages/unread-count/{userId} - Get unread message count
```

## Real-Time Features

### 1. Instant Message Delivery
- Messages are immediately broadcast via WebSocket to target channels
- Cross-instance delivery via Redis pub/sub
- Automatic channel routing based on message type

### 2. Message Status Tracking
- **Delivered**: Message reached recipient's device
- **Read**: Message was opened/viewed by recipient
- **Edited**: Message content was modified
- Timestamps for all status changes

### 3. Typing Indicators
- Real-time typing status broadcasting
- Channel-specific typing indicators
- Automatic cleanup of typing status

### 4. Unread Count Management
- Real-time unread count updates
- Per-conversation and total unread counts
- Efficient Redis caching for performance

### 5. Role-Based Access Control
- Hierarchical channel system
- Permission-based channel access
- School/class/role-based message routing

## Channel Routing System

### Channel Types and Access Control

#### 1. Conversation Channels (`conversation:userId1:userId2`)
- **Purpose**: One-on-one messaging
- **Access**: Only the two participants
- **Format**: Smaller user ID first for consistency

#### 2. Group Channels (`group:groupId`)
- **Purpose**: Group messaging
- **Access**: Group members only
- **Features**: Group-specific unread counts

#### 3. Class Channels (`class:classId`)
- **Purpose**: Class-wide announcements and discussions
- **Access**: Students and teachers of the class
- **Use Cases**: Homework announcements, class discussions

#### 4. School Channels (`school:schoolId`)
- **Purpose**: School-wide communications
- **Access**: All users within the school
- **Use Cases**: School announcements, events

#### 5. Role Channels (`role:schoolId:role`)
- **Purpose**: Role-specific communications
- **Access**: Users with specific role in the school
- **Examples**: `role:1:teacher`, `role:1:student`

## WebSocket Communication Flow

### 1. Client Connection
```javascript
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    // Subscribe to message channels
    stompClient.send("/app/messages/subscribe", {}, 
        JSON.stringify({ userId: currentUserId }));
});
```

### 2. Channel Subscription
```javascript
// Server responds with available channels
stompClient.subscribe('/queue/messages/subscription-confirmed', (message) => {
    const response = JSON.parse(message.body);
    response.channels.forEach(channelId => {
        stompClient.subscribe(`/topic/messages/${channelId}`, handleMessage);
    });
});
```

### 3. Message Handling
```javascript
const handleMessage = (message) => {
    const realTimeMessage = JSON.parse(message.body);
    
    switch(realTimeMessage.eventType) {
        case 'SENT':
            addMessageToUI(realTimeMessage);
            break;
        case 'UPDATED':
            updateMessageInUI(realTimeMessage);
            break;
        case 'DELETED':
            removeMessageFromUI(realTimeMessage);
            break;
        case 'DELIVERED':
            markMessageAsDelivered(realTimeMessage);
            break;
        case 'READ':
            markMessageAsRead(realTimeMessage);
            break;
        case 'TYPING':
            showTypingIndicator(realTimeMessage);
            break;
    }
};
```

### 4. Typing Indicators
```javascript
// Send typing indicator
const sendTypingIndicator = (channelId, isTyping) => {
    stompClient.send("/app/messages/typing", {}, JSON.stringify({
        userId: currentUserId,
        channelId: channelId,
        isTyping: isTyping
    }));
};
```

## Performance Optimizations

### 1. Redis Caching
- Unread message counts cached in Redis
- Channel subscription lists cached
- Typing indicator state management

### 2. Efficient Channel Routing
- Hierarchical channel system reduces message volume
- Group-based targeting minimizes unnecessary broadcasts
- Channel access validation prevents unauthorized subscriptions

### 3. Database Optimizations
- Indexed queries for message retrieval
- Bulk update operations for read status
- Lazy loading for related entities

### 4. WebSocket Optimizations
- Connection pooling and management
- Message batching for high-volume scenarios
- Automatic reconnection handling

## Security Considerations

### 1. Authentication
- WebSocket connections require valid JWT tokens
- User identity verified before subscription setup
- Session-based channel access control

### 2. Authorization
- Server-side validation of user permissions
- Channel access based on user role and relationships
- Message ownership verification for updates/deletes

### 3. Data Protection
- Message content validation and sanitization
- Audit logging of all message operations
- Rate limiting for message sending

## API Usage Examples

### 1. Send a Message
```bash
POST /messages
Content-Type: application/json

{
    "content": "Hello, how are you?",
    "senderId": 1,
    "recipientId": 2,
    "messageType": "TEXT",
    "active": true
}
```

### 2. Mark Conversation as Read
```bash
POST /messages/conversation/read?userId=2&partnerId=1
```

### 3. Get Unread Count
```bash
GET /messages/unread-count/2
```

### 4. Get Conversation Messages
```bash
GET /messages/conversation/1/2
```

## Testing

### 1. Unit Tests
- Message service operations
- Channel routing logic
- Real-time broadcasting
- Repository queries

### 2. Integration Tests
- End-to-end WebSocket communication
- Redis pub/sub message flow
- Cross-instance message delivery
- Database transaction handling

### 3. Load Testing
- Multiple concurrent WebSocket connections
- High-volume message broadcasting
- Redis performance under load
- Database query performance

## Deployment Configuration

### Application Properties
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: -1ms

# WebSocket configuration
websocket:
  allowed-origins: "*"  # Configure for production
  endpoint: "/ws"
  topic-prefix: "/topic"
  queue-prefix: "/queue"
  app-prefix: "/app"
```

### Redis Configuration
```bash
# Redis server configuration for production
redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
```

## Monitoring and Metrics

### 1. WebSocket Metrics
- Active connection count per instance
- Message throughput per channel
- Connection establishment/termination rates

### 2. Redis Metrics
- Message volume per channel
- Pub/sub latency measurements
- Memory usage for cached data

### 3. Database Metrics
- Message query performance
- Unread count query efficiency
- Bulk update operation timing

### 4. Application Metrics
- Message delivery success rates
- Typing indicator frequency
- Channel subscription patterns

## Future Enhancements

### 1. Message Persistence for Offline Users
- Store messages for offline users
- Delivery queue management
- Push notification integration

### 2. File and Media Sharing
- File upload endpoints
- Image/video message support
- File storage integration

### 3. Advanced Features
- Message reactions/emojis
- Message forwarding
- Voice messages
- Video calling integration

### 4. Analytics and Insights
- Message analytics dashboard
- User engagement metrics
- Communication pattern analysis

## Conclusion

The real-time messaging system provides a comprehensive, scalable solution for instant communication within the learning management system. It supports various communication patterns (1:1, group, broadcast) with role-based access control, real-time features like typing indicators and read receipts, and cross-instance scaling capabilities.

The system is built following SOLID principles, uses established architectural patterns, and provides both REST API and WebSocket interfaces for maximum flexibility and integration capabilities. 