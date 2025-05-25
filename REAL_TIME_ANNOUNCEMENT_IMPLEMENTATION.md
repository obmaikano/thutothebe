# Real-Time Announcement Management System

## Overview

This document describes the implementation of a real-time push delivery system for announcements using WebSocket and Redis pub/sub messaging. The system provides instant notification delivery to target users based on role-based access control (RBAC) without requiring polling or page refresh.

## Architecture

### Technology Stack
- **Backend**: Spring Boot 3 + WebSocket + Redis
- **Real-Time**: STOMP over WebSocket (SockJS)
- **Messaging**: Redis Pub/Sub
- **Serialization**: Jackson JSON

### Components

#### 1. WebSocket Configuration (`WebSocketConfig.java`)
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // Configures STOMP endpoints and message brokers
    // Endpoint: /ws with SockJS fallback
    // Topics: /topic/announcements/{groupId}
    // Queues: /queue/announcements/*
}
```

#### 2. Redis Configuration (`RedisConfig.java`)
```java
@Configuration
public class RedisConfig {
    // Configures Redis template with JSON serialization
    // Sets up message listener container for pub/sub
    // Channel pattern: announcements:*
}
```

#### 3. Real-Time DTOs

##### RealTimeAnnouncementDTO
```java
public record RealTimeAnnouncementDTO(
    // Standard announcement fields
    Long id, String title, String content, AnnouncementType type,
    AnnouncementPriority priority, Long creatorId, String creatorName,
    UserRole creatorRole, Long targetRegionId, String targetRegionName,
    Long targetSchoolId, String targetSchoolName, UserRole targetRole,
    String targetDepartment, String targetClass, LocalDateTime startDate,
    LocalDateTime endDate, boolean commentsEnabled, boolean acknowledgmentRequired,
    List<String> attachmentUrls, List<String> tags, LocalDateTime createdAt,
    
    // Real-time specific fields
    String eventType,  // CREATED, UPDATED, DELETED, ACTIVATED, DEACTIVATED
    String groupId,    // Target group for WebSocket subscription
    String message     // Optional notification message
)
```

#### 4. Group Management Service

##### AnnouncementGroupService
Determines target groups for announcements based on hierarchical targeting:

**Group ID Format:**
- Global: `global`
- Region: `region_{regionId}`
- School: `region_{regionId}_school_{schoolId}`
- Role: `region_{regionId}_school_{schoolId}_role_{role}`
- Department: `region_{regionId}_school_{schoolId}_role_{role}_dept_{department}`
- Class: `region_{regionId}_school_{schoolId}_role_{role}_dept_{department}_class_{class}`

**User Subscription Logic:**
```java
public List<String> getAllUserSubscriptionGroupIds(Long userId) {
    // Users subscribe to hierarchical groups:
    // 1. Global announcements
    // 2. Region-level announcements
    // 3. School-level announcements
    // 4. Role-specific announcements
    // 5. Department-specific (if applicable)
    // 6. Class-specific (for students)
}
```

#### 5. Real-Time Broadcasting Service

##### RealTimeAnnouncementService
Handles broadcasting of announcement events:

```java
public interface RealTimeAnnouncementService {
    void broadcastAnnouncementCreated(AnnouncementDTO announcement);
    void broadcastAnnouncementUpdated(AnnouncementDTO announcement);
    void broadcastAnnouncementDeleted(AnnouncementDTO announcement);
    void broadcastAnnouncementStatusChanged(AnnouncementDTO announcement, boolean activated);
    void sendToGroup(String groupId, RealTimeAnnouncementDTO realTimeAnnouncement);
}
```

**Implementation Flow:**
1. Determine target groups using `AnnouncementGroupService`
2. Convert announcement to `RealTimeAnnouncementDTO`
3. Send to WebSocket topics: `/topic/announcements/{groupId}`
4. Publish to Redis channels: `announcements:{groupId}`

#### 6. Redis Subscriber

##### RedisAnnouncementSubscriber
Handles cross-instance messaging for scalability:

```java
@Service
public class RedisAnnouncementSubscriber implements MessageListener {
    @Override
    public void onMessage(Message message, byte[] pattern) {
        // 1. Extract group ID from Redis channel
        // 2. Deserialize RealTimeAnnouncementDTO
        // 3. Forward to WebSocket subscribers
    }
}
```

#### 7. WebSocket Controller

##### WebSocketAnnouncementController
Handles client WebSocket connections:

```java
@Controller
public class WebSocketAnnouncementController {
    @MessageMapping("/announcements/subscribe")
    public void subscribeToAnnouncements(@Payload Map<String, Object> payload);
    
    @MessageMapping("/announcements/ping")
    public void ping(Principal principal);
}
```

## Role-Based Filtering

### Permission Matrix

| User Role | Can Create For | Receives From |
|-----------|---------------|---------------|
| SUPER_ADMIN | Anyone | Global |
| MINISTRY_EXECUTIVE | Any region/school/role | Global, National |
| MINISTRY_STAFF | Assigned departments/schools | Global, National, Assigned |
| DIRECTOR | Regional/school users | Global, Regional |
| REGIONAL_ADMIN | Schools within region | Global, Regional |
| REGIONAL_OFFICER | Assigned schools | Global, Regional, Assigned |
| SCHOOL_ADMIN | Full school scope | Global, Regional, School |
| SCHOOL_HEAD | School departments | Global, Regional, School, Department |
| DEPARTMENT_HEAD | Department scope | Global, Regional, School, Department |
| SENIOR_TEACHER | Class/department level | Global, Regional, School, Department, Class |
| TEACHER | Own courses | Global, Regional, School, Department, Class |
| STUDENT | None | Global, Regional, School, Class |
| PARENT | None | Global, Regional, School, Student-specific |

### Targeting Examples

1. **Global Announcement**: All users receive
   - Group: `global`

2. **School-wide Announcement**: All users in specific school
   - Group: `region_1_school_5`

3. **Role-specific Announcement**: All teachers in a school
   - Group: `region_1_school_5_role_teacher`

4. **Department Announcement**: All users in Mathematics department
   - Group: `region_1_school_5_role_teacher_dept_mathematics`

5. **Class Announcement**: Students in Grade 10A
   - Group: `region_1_school_5_role_student_class_grade_10a`

## Integration with Existing System

### Modified Services

#### AnnouncementServiceImpl
Enhanced with real-time broadcasting:

```java
@Override
@Transactional
public AnnouncementDTO createAnnouncement(AnnouncementDTO dto, Long creatorId) {
    // Existing validation and creation logic
    AnnouncementDTO createdDto = create(createDto);
    
    // NEW: Real-time broadcasting
    realTimeAnnouncementService.broadcastAnnouncementCreated(createdDto);
    
    return createdDto;
}
```

Similar integration for:
- `updateAnnouncement()`
- `deleteAnnouncement()`
- `toggleAnnouncementStatus()`

## Client-Side Integration

### WebSocket Connection
```javascript
// Connect to WebSocket
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to user-specific announcement groups
    subscribeToAnnouncements(userId);
});

function subscribeToAnnouncements(userId) {
    // Get user's subscription groups from server
    stompClient.send("/app/announcements/subscribe", {}, JSON.stringify({
        userId: userId
    }));
    
    // Subscribe to global announcements
    stompClient.subscribe('/topic/announcements/global', function(message) {
        const announcement = JSON.parse(message.body);
        handleRealTimeAnnouncement(announcement);
    });
    
    // Subscribe to user-specific groups (determined by server)
    // Additional subscriptions will be set up based on user role/location
}

function handleRealTimeAnnouncement(announcement) {
    switch(announcement.eventType) {
        case 'CREATED':
            showNewAnnouncementNotification(announcement);
            addAnnouncementToList(announcement);
            break;
        case 'UPDATED':
            updateAnnouncementInList(announcement);
            break;
        case 'DELETED':
            removeAnnouncementFromList(announcement.id);
            break;
        case 'ACTIVATED':
        case 'DEACTIVATED':
            updateAnnouncementStatus(announcement);
            break;
    }
}
```

### React Integration
```typescript
// Custom hook for real-time announcements
export const useRealTimeAnnouncements = (userId: number) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const socket = new SockJS('/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            setClient(stompClient);
            
            // Subscribe to announcements
            stompClient.send("/app/announcements/subscribe", {}, 
                JSON.stringify({ userId }));
            
            // Handle subscription confirmation
            stompClient.subscribe('/queue/announcements/subscription-confirmed', 
                (message) => {
                    const response = JSON.parse(message.body);
                    response.groups.forEach(groupId => {
                        stompClient.subscribe(`/topic/announcements/${groupId}`, 
                            handleAnnouncementMessage);
                    });
                });
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [userId]);

    const handleAnnouncementMessage = (message: any) => {
        const announcement = JSON.parse(message.body);
        // Update state based on event type
        // Show notifications
        // Update UI
    };

    return { announcements, client };
};
```

## Performance Considerations

### Scalability
1. **Redis Pub/Sub**: Enables horizontal scaling across multiple application instances
2. **Group-based Targeting**: Reduces message volume by targeting specific user groups
3. **Hierarchical Subscriptions**: Users only subscribe to relevant channels

### Optimization
1. **Connection Pooling**: Redis connection pooling for high throughput
2. **Message Batching**: Batch multiple announcements when possible
3. **Lazy Loading**: Load announcement details on demand
4. **Caching**: Cache user group memberships

### Monitoring
1. **WebSocket Connections**: Monitor active connections per instance
2. **Redis Channels**: Track message volume per channel
3. **Delivery Metrics**: Monitor successful/failed deliveries
4. **Performance Metrics**: Track message latency

## Security Considerations

### Authentication
- WebSocket connections require valid JWT tokens
- User identity verified before subscription setup

### Authorization
- Server-side validation of user permissions
- Group subscriptions based on user role and location
- No client-side group selection

### Data Protection
- Sensitive announcement data filtered based on user permissions
- Audit logging of all real-time message deliveries

## Testing

### Unit Tests
- `RealTimeAnnouncementServiceImplTest`: Tests broadcasting logic
- `AnnouncementGroupServiceImplTest`: Tests group determination
- `WebSocketAnnouncementControllerTest`: Tests WebSocket endpoints

### Integration Tests
- End-to-end WebSocket communication
- Redis pub/sub message flow
- Cross-instance message delivery

### Load Testing
- Multiple concurrent WebSocket connections
- High-volume announcement broadcasting
- Redis performance under load

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

## Future Enhancements

1. **Message Persistence**: Store messages for offline users
2. **Delivery Receipts**: Track message delivery confirmation
3. **Push Notifications**: Mobile push notifications for offline users
4. **Message Queuing**: Advanced queuing for high-volume scenarios
5. **Analytics Dashboard**: Real-time delivery metrics and analytics
6. **Message Filtering**: Client-side filtering preferences
7. **Announcement Scheduling**: Advanced scheduling with time zones
8. **Multi-language Support**: Localized announcement delivery

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failures**
   - Check CORS configuration
   - Verify JWT token validity
   - Ensure SockJS fallback is working

2. **Redis Connection Issues**
   - Verify Redis server availability
   - Check connection pool configuration
   - Monitor Redis memory usage

3. **Message Delivery Failures**
   - Check user group subscriptions
   - Verify announcement targeting logic
   - Monitor WebSocket connection status

4. **Performance Issues**
   - Monitor Redis pub/sub performance
   - Check WebSocket connection limits
   - Optimize group targeting logic

### Debugging

1. **Enable Debug Logging**
   ```yaml
   logging:
     level:
       com.ohma.thutothebe.service.impl.RealTimeAnnouncementServiceImpl: DEBUG
       com.ohma.thutothebe.service.impl.RedisAnnouncementSubscriber: DEBUG
   ```

2. **Monitor Redis Channels**
   ```bash
   redis-cli MONITOR
   redis-cli PUBSUB CHANNELS announcements:*
   ```

3. **WebSocket Connection Monitoring**
   - Use browser developer tools
   - Monitor WebSocket frame traffic
   - Check connection lifecycle events

This implementation provides a robust, scalable real-time announcement delivery system that integrates seamlessly with the existing RBAC system while providing instant notifications to target users. 