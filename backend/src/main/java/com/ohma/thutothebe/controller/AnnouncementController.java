package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/announcements")
@Tag(name = "Announcement Controller", description = "APIs for managing announcements")
public class AnnouncementController {

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get announcements for a student")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getAnnouncementsForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            List<Map<String, Object>> announcements = new ArrayList<>();
            
            // Sample announcements
            Map<String, Object> announcement1 = new HashMap<>();
            announcement1.put("id", 1L);
            announcement1.put("title", "End of Term Exams");
            announcement1.put("content", "End of term exams will start on May 10th, 2025. Please prepare accordingly and review all course materials.");
            announcement1.put("type", "EXAM");
            announcement1.put("priority", "HIGH");
            announcement1.put("authorName", "Academic Office");
            announcement1.put("createdAt", LocalDateTime.now().minusDays(1).toString());
            announcement1.put("expiresAt", LocalDateTime.now().plusDays(30).toString());
            announcement1.put("targetAudience", "ALL_STUDENTS");
            announcement1.put("read", false);
            announcements.add(announcement1);
            
            Map<String, Object> announcement2 = new HashMap<>();
            announcement2.put("id", 2L);
            announcement2.put("title", "School Holiday");
            announcement2.put("content", "School will be closed on April 25th for a national holiday. Classes will resume on April 26th.");
            announcement2.put("type", "HOLIDAY");
            announcement2.put("priority", "MEDIUM");
            announcement2.put("authorName", "Administration");
            announcement2.put("createdAt", LocalDateTime.now().minusDays(3).toString());
            announcement2.put("expiresAt", LocalDateTime.now().plusDays(7).toString());
            announcement2.put("targetAudience", "ALL_STUDENTS");
            announcement2.put("read", true);
            announcements.add(announcement2);
            
            Map<String, Object> announcement3 = new HashMap<>();
            announcement3.put("id", 3L);
            announcement3.put("title", "Library Hours Extended");
            announcement3.put("content", "The library will now be open until 10 PM on weekdays to support students during exam preparation.");
            announcement3.put("type", "FACILITY");
            announcement3.put("priority", "LOW");
            announcement3.put("authorName", "Library Staff");
            announcement3.put("createdAt", LocalDateTime.now().minusDays(5).toString());
            announcement3.put("expiresAt", LocalDateTime.now().plusDays(14).toString());
            announcement3.put("targetAudience", "ALL_STUDENTS");
            announcement3.put("read", false);
            announcements.add(announcement3);
            
            Map<String, Object> announcement4 = new HashMap<>();
            announcement4.put("id", 4L);
            announcement4.put("title", "Mathematics Assignment Due");
            announcement4.put("content", "Reminder: Mathematics Assignment 3 is due tomorrow. Please submit your work before 11:59 PM.");
            announcement4.put("type", "ASSIGNMENT");
            announcement4.put("priority", "HIGH");
            announcement4.put("authorName", "Prof. Johnson");
            announcement4.put("createdAt", LocalDateTime.now().minusHours(6).toString());
            announcement4.put("expiresAt", LocalDateTime.now().plusDays(1).toString());
            announcement4.put("targetAudience", "CLASS_SPECIFIC");
            announcement4.put("read", false);
            announcements.add(announcement4);
            
            List<Object> result = announcements.stream().map(a -> (Object) a).toList();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcements retrieved successfully", result, null));
        } catch (Exception e) {
            log.error("Error retrieving announcements: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get announcements for a school")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getAnnouncementsForSchool(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        try {
            List<Map<String, Object>> announcements = new ArrayList<>();
            
            // Sample school-wide announcements
            Map<String, Object> announcement1 = new HashMap<>();
            announcement1.put("id", 5L);
            announcement1.put("title", "Parent-Teacher Conference");
            announcement1.put("content", "Parent-teacher conferences will be held on May 15th-16th. Please schedule your appointments through the school portal.");
            announcement1.put("type", "EVENT");
            announcement1.put("priority", "MEDIUM");
            announcement1.put("authorName", "Principal");
            announcement1.put("createdAt", LocalDateTime.now().minusDays(2).toString());
            announcement1.put("expiresAt", LocalDateTime.now().plusDays(20).toString());
            announcement1.put("targetAudience", "ALL_SCHOOL");
            announcement1.put("read", false);
            announcements.add(announcement1);
            
            List<Object> result = announcements.stream().map(a -> (Object) a).toList();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School announcements retrieved successfully", result, null));
        } catch (Exception e) {
            log.error("Error retrieving school announcements: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{announcementId}/mark-read")
    @Operation(summary = "Mark announcement as read")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<String>> markAnnouncementAsRead(
            @Parameter(description = "Announcement ID") @PathVariable Long announcementId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            // In a real implementation, this would update the read status in the database
            log.info("Marking announcement {} as read for user {}", announcementId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement marked as read", "OK", null));
        } catch (Exception e) {
            log.error("Error marking announcement as read: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unread-count/student/{studentId}")
    @Operation(summary = "Get unread announcement count for student")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Integer>> getUnreadAnnouncementCount(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            // Sample unread count
            int unreadCount = 3;
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unread count retrieved", unreadCount, null));
        } catch (Exception e) {
            log.error("Error getting unread announcement count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 