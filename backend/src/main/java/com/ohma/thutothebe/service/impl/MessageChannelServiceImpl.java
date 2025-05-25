package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.repository.MessageRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.MessageChannelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageChannelServiceImpl implements MessageChannelService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    private static final String CONVERSATION_PREFIX = "conversation:";
    private static final String GROUP_PREFIX = "group:";
    private static final String CLASS_PREFIX = "class:";
    private static final String SCHOOL_PREFIX = "school:";
    private static final String ROLE_PREFIX = "role:";

    @Override
    public List<String> determineTargetChannels(MessageDTO message) {
        List<String> channels = new ArrayList<>();
        
        try {
            if (message.groupId() != null) {
                // Group message
                channels.add(generateGroupChannelId(message.groupId()));
                log.debug("Added group channel for message: {}", message.id());
            } else if (message.recipientId() != null) {
                // One-on-one conversation
                String conversationChannel = generateConversationChannelId(message.senderId(), message.recipientId());
                channels.add(conversationChannel);
                log.debug("Added conversation channel for message: {}", message.id());
            }
            
            log.info("Determined {} target channels for message {}", channels.size(), message.id());
            return channels;
            
        } catch (Exception e) {
            log.error("Error determining target channels for message {}: {}", message.id(), e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<String> getAllUserChannelSubscriptions(Long userId) {
        List<String> subscriptions = new ArrayList<>();
        
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            
            // Add user's personal conversation channels
            // This would include all conversations the user is part of
            List<Long> conversationPartners = getConversationPartners(userId);
            for (Long partnerId : conversationPartners) {
                subscriptions.add(generateConversationChannelId(userId, partnerId));
            }
            
            // Add group channels the user is member of
            List<Long> userGroups = getUserGroups(userId);
            for (Long groupId : userGroups) {
                subscriptions.add(generateGroupChannelId(groupId));
            }
            
            // Add role-based channels based on user's role and school
            if (user.getSchool() != null) {
                Long schoolId = user.getSchool().getId();
                
                // School-wide channel
                subscriptions.add(generateSchoolChannelId(schoolId));
                
                // Role-specific channel
                subscriptions.add(generateRoleChannelId(schoolId, user.getRole().name()));
                
                // Class-specific channels for students and teachers
                if (user.getRole() == UserRole.STUDENT || user.getRole() == UserRole.TEACHER) {
                    List<Long> userClasses = getUserClasses(userId, user.getRole());
                    for (Long classId : userClasses) {
                        subscriptions.add(generateClassChannelId(classId));
                    }
                }
            }
            
            log.info("Generated {} channel subscriptions for user {}", subscriptions.size(), userId);
            return subscriptions;
            
        } catch (Exception e) {
            log.error("Error getting channel subscriptions for user {}: {}", userId, e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public String generateConversationChannelId(Long userId1, Long userId2) {
        // Ensure consistent channel ID regardless of parameter order
        Long smaller = Math.min(userId1, userId2);
        Long larger = Math.max(userId1, userId2);
        return CONVERSATION_PREFIX + smaller + ":" + larger;
    }

    @Override
    public String generateGroupChannelId(Long groupId) {
        return GROUP_PREFIX + groupId;
    }

    @Override
    public String generateClassChannelId(Long classId) {
        return CLASS_PREFIX + classId;
    }

    @Override
    public String generateSchoolChannelId(Long schoolId) {
        return SCHOOL_PREFIX + schoolId;
    }

    @Override
    public String generateRoleChannelId(Long schoolId, String role) {
        return ROLE_PREFIX + schoolId + ":" + role.toLowerCase();
    }

    @Override
    public boolean hasChannelAccess(Long userId, String channelId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            
            if (channelId.startsWith(CONVERSATION_PREFIX)) {
                // Extract user IDs from conversation channel
                String[] parts = channelId.substring(CONVERSATION_PREFIX.length()).split(":");
                if (parts.length == 2) {
                    Long userId1 = Long.parseLong(parts[0]);
                    Long userId2 = Long.parseLong(parts[1]);
                    return userId.equals(userId1) || userId.equals(userId2);
                }
            } else if (channelId.startsWith(GROUP_PREFIX)) {
                // Check if user is member of the group
                Long groupId = Long.parseLong(channelId.substring(GROUP_PREFIX.length()));
                return isUserGroupMember(userId, groupId);
            } else if (channelId.startsWith(CLASS_PREFIX)) {
                // Check if user belongs to the class
                Long classId = Long.parseLong(channelId.substring(CLASS_PREFIX.length()));
                return isUserClassMember(userId, classId);
            } else if (channelId.startsWith(SCHOOL_PREFIX)) {
                // Check if user belongs to the school
                Long schoolId = Long.parseLong(channelId.substring(SCHOOL_PREFIX.length()));
                return user.getSchool() != null && user.getSchool().getId().equals(schoolId);
            } else if (channelId.startsWith(ROLE_PREFIX)) {
                // Check if user has the role in the school
                String[] parts = channelId.substring(ROLE_PREFIX.length()).split(":");
                if (parts.length == 2) {
                    Long schoolId = Long.parseLong(parts[0]);
                    String role = parts[1].toUpperCase();
                    return user.getSchool() != null && 
                           user.getSchool().getId().equals(schoolId) && 
                           user.getRole().name().equals(role);
                }
            }
            
            return false;
            
        } catch (Exception e) {
            log.error("Error checking channel access for user {} and channel {}: {}", userId, channelId, e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Long getUnreadMessageCount(Long userId) {
        try {
            // This would typically use a Redis cache for performance
            // For now, we'll use a database query
            return messageRepository.countUnreadMessagesForUser(userId);
        } catch (Exception e) {
            log.error("Error getting unread message count for user {}: {}", userId, e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    public Long getUnreadMessageCountForChannel(Long userId, String channelId) {
        try {
            if (channelId.startsWith(CONVERSATION_PREFIX)) {
                String[] parts = channelId.substring(CONVERSATION_PREFIX.length()).split(":");
                if (parts.length == 2) {
                    Long userId1 = Long.parseLong(parts[0]);
                    Long userId2 = Long.parseLong(parts[1]);
                    Long partnerId = userId.equals(userId1) ? userId2 : userId1;
                    return messageRepository.countUnreadMessagesInConversation(userId, partnerId);
                }
            } else if (channelId.startsWith(GROUP_PREFIX)) {
                Long groupId = Long.parseLong(channelId.substring(GROUP_PREFIX.length()));
                return messageRepository.countUnreadMessagesInGroup(userId, groupId);
            }
            
            return 0L;
            
        } catch (Exception e) {
            log.error("Error getting unread message count for user {} and channel {}: {}", userId, channelId, e.getMessage(), e);
            return 0L;
        }
    }

    // Helper methods
    private List<Long> getConversationPartners(Long userId) {
        // This would get all users the current user has had conversations with
        // For now, return empty list - would be implemented based on message history
        return new ArrayList<>();
    }

    private List<Long> getUserGroups(Long userId) {
        // This would get all message groups the user is a member of
        // For now, return empty list - would be implemented based on group membership
        return new ArrayList<>();
    }

    private List<Long> getUserClasses(Long userId, UserRole role) {
        // This would get all classes the user is associated with
        // For students: their enrolled classes
        // For teachers: classes they teach
        // For now, return empty list - would be implemented based on class enrollment/assignment
        return new ArrayList<>();
    }

    private boolean isUserGroupMember(Long userId, Long groupId) {
        // This would check if user is a member of the message group
        // For now, return false - would be implemented based on group membership
        return false;
    }

    private boolean isUserClassMember(Long userId, Long classId) {
        // This would check if user belongs to the class
        // For now, return false - would be implemented based on class enrollment/assignment
        return false;
    }
} 