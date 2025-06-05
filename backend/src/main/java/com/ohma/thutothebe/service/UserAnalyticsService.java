package com.ohma.thutothebe.service;

import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAnalyticsService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        
        // Get active users
        long activeUsers = userRepository.countByActiveTrue();
        stats.put("activeUsers", activeUsers);
        
        // Get users by role
        Map<UserRole, Integer> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            usersByRole.put(role, userRepository.countByRole(role));
        }
        stats.put("usersByRole", usersByRole);
        
        // Get recent activity (users who logged in today)
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        long todayActive = userRepository.countByLastLoginTimeAfter(today);
        stats.put("todayActive", todayActive);
        
        // Get weekly active users
        LocalDateTime weekAgo = today.minusDays(7);
        long weeklyActive = userRepository.countByLastLoginTimeAfter(weekAgo);
        stats.put("weeklyActive", weeklyActive);
        
        // Get monthly active users
        LocalDateTime monthAgo = today.minusDays(30);
        long monthlyActive = userRepository.countByLastLoginTimeAfter(monthAgo);
        stats.put("monthlyActive", monthlyActive);
        
        return stats;
    }
} 