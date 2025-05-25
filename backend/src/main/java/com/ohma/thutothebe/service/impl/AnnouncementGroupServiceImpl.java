package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.AnnouncementGroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementGroupServiceImpl implements AnnouncementGroupService {

    private final UserRepository userRepository;

    @Override
    public List<String> determineTargetGroups(AnnouncementDTO announcement) {
        List<String> targetGroups = new ArrayList<>();
        
        // Global announcement (no specific targeting)
        if (announcement.targetRegionId() == null && 
            announcement.targetSchoolId() == null && 
            announcement.targetRole() == null &&
            announcement.targetDepartment() == null &&
            announcement.targetClass() == null) {
            targetGroups.add("global");
            return targetGroups;
        }
        
        // Generate specific group ID based on targeting criteria
        String groupId = generateGroupId(
            announcement.targetRegionId(),
            announcement.targetSchoolId(),
            announcement.targetRole(),
            announcement.targetDepartment(),
            announcement.targetClass()
        );
        targetGroups.add(groupId);
        
        // Add hierarchical groups for broader reach
        addHierarchicalGroups(targetGroups, announcement);
        
        return targetGroups;
    }

    @Override
    public String generateGroupId(Long regionId, Long schoolId, UserRole role, String department, String className) {
        StringBuilder groupId = new StringBuilder();
        
        if (regionId != null) {
            groupId.append("region_").append(regionId);
        } else {
            groupId.append("global");
        }
        
        if (schoolId != null) {
            groupId.append("_school_").append(schoolId);
        }
        
        if (role != null) {
            groupId.append("_role_").append(role.name().toLowerCase());
        }
        
        if (department != null && !department.trim().isEmpty()) {
            groupId.append("_dept_").append(department.toLowerCase().replaceAll("\\s+", "_"));
        }
        
        if (className != null && !className.trim().isEmpty()) {
            groupId.append("_class_").append(className.toLowerCase().replaceAll("\\s+", "_"));
        }
        
        return groupId.toString();
    }

    @Override
    public String getUserSubscriptionGroupId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        return generateGroupId(
            user.getRegion() != null ? user.getRegion().getId() : null,
            user.getSchool() != null ? user.getSchool().getId() : null,
            user.getRole(),
            null, // No department field in User entity
            null // Users don't subscribe to specific class groups unless they're students
        );
    }

    @Override
    public List<String> getAllUserSubscriptionGroupIds(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        List<String> subscriptionGroups = new ArrayList<>();
        
        // Always subscribe to global announcements
        subscriptionGroups.add("global");
        
        // Subscribe to region-level announcements
        if (user.getRegion() != null) {
            subscriptionGroups.add(generateGroupId(user.getRegion().getId(), null, null, null, null));
        }
        
        // Subscribe to school-level announcements
        if (user.getSchool() != null) {
            subscriptionGroups.add(generateGroupId(
                user.getRegion() != null ? user.getRegion().getId() : null,
                user.getSchool().getId(),
                null, null, null
            ));
        }
        
        // Subscribe to role-specific announcements
        subscriptionGroups.add(generateGroupId(
            user.getRegion() != null ? user.getRegion().getId() : null,
            user.getSchool() != null ? user.getSchool().getId() : null,
            user.getRole(),
            null, null
        ));
        
        // For students, check if they have class assignments
        if (user.getRole() == UserRole.STUDENT) {
            // Note: This would need to be implemented based on student-class relationships
            // For now, we'll use a placeholder
            log.debug("Student class subscriptions would be added here for user: {}", userId);
        }
        
        return subscriptionGroups;
    }

    private void addHierarchicalGroups(List<String> targetGroups, AnnouncementDTO announcement) {
        // Add broader scope groups to ensure hierarchical delivery
        
        // If targeting a specific class, also target the department and role
        if (announcement.targetClass() != null) {
            String deptGroup = generateGroupId(
                announcement.targetRegionId(),
                announcement.targetSchoolId(),
                announcement.targetRole(),
                announcement.targetDepartment(),
                null
            );
            if (!targetGroups.contains(deptGroup)) {
                targetGroups.add(deptGroup);
            }
        }
        
        // If targeting a specific department, also target the role
        if (announcement.targetDepartment() != null) {
            String roleGroup = generateGroupId(
                announcement.targetRegionId(),
                announcement.targetSchoolId(),
                announcement.targetRole(),
                null, null
            );
            if (!targetGroups.contains(roleGroup)) {
                targetGroups.add(roleGroup);
            }
        }
        
        // If targeting a specific role, also target the school
        if (announcement.targetRole() != null) {
            String schoolGroup = generateGroupId(
                announcement.targetRegionId(),
                announcement.targetSchoolId(),
                null, null, null
            );
            if (!targetGroups.contains(schoolGroup)) {
                targetGroups.add(schoolGroup);
            }
        }
        
        // If targeting a specific school, also target the region
        if (announcement.targetSchoolId() != null) {
            String regionGroup = generateGroupId(
                announcement.targetRegionId(),
                null, null, null, null
            );
            if (!targetGroups.contains(regionGroup)) {
                targetGroups.add(regionGroup);
            }
        }
    }
} 