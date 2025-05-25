package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.entity.UserRole;

import java.util.List;

public interface AnnouncementGroupService {
    
    /**
     * Determine target group IDs for an announcement based on its targeting criteria
     * @param announcement The announcement to analyze
     * @return List of group IDs that should receive this announcement
     */
    List<String> determineTargetGroups(AnnouncementDTO announcement);
    
    /**
     * Generate group ID for a specific targeting combination
     * @param regionId Target region ID (null for global)
     * @param schoolId Target school ID (null for region-wide)
     * @param role Target role (null for all roles)
     * @param department Target department (null for all departments)
     * @param className Target class (null for all classes)
     * @return Generated group ID
     */
    String generateGroupId(Long regionId, Long schoolId, UserRole role, String department, String className);
    
    /**
     * Get group ID that a user should subscribe to based on their profile
     * @param userId User ID
     * @return Group ID for subscription
     */
    String getUserSubscriptionGroupId(Long userId);
    
    /**
     * Get all group IDs a user should subscribe to (including hierarchical groups)
     * @param userId User ID
     * @return List of group IDs for subscription
     */
    List<String> getAllUserSubscriptionGroupIds(Long userId);
} 