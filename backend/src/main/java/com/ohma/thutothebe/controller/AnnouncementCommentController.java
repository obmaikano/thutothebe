package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AnnouncementCommentDto;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.AnnouncementCommentService;
import com.ohma.thutothebe.service.AnnouncementActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/announcement-comments")
@Tag(name = "Announcement Comments", description = "Announcement comment management operations")
public class AnnouncementCommentController extends BaseController<AnnouncementCommentDto, Long> {

    private final AnnouncementCommentService commentService;
    private final AnnouncementActivityService activityService;

    public AnnouncementCommentController(
            AnnouncementCommentService commentService,
            AnnouncementActivityService activityService) {
        super(commentService);
        this.commentService = commentService;
        this.activityService = activityService;
    }

    @GetMapping("/announcement/{announcementId}")
    @Operation(summary = "Get comments for an announcement")
    public ResponseEntity<OhmaApiResponse<List<AnnouncementCommentDto>>> getCommentsByAnnouncement(
            @PathVariable Long announcementId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view comments for this announcement (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view announcement comments", null, null));
            }

            List<AnnouncementCommentDto> comments = commentService.getCommentsByAnnouncementId(announcementId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments for announcement {}: {}", announcementId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new comment")
    public ResponseEntity<OhmaApiResponse<AnnouncementCommentDto>> createComment(
            @RequestBody Map<String, Object> request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long announcementId = Long.valueOf(request.get("announcementId").toString());
            Long authorId = Long.valueOf(request.get("authorId").toString());
            String content = request.get("content").toString();
            Long parentCommentId = request.get("parentCommentId") != null ? 
                    Long.valueOf(request.get("parentCommentId").toString()) : null;

            // Check if user has access to create comments as this author (self-access or admin access)
            if (!hasAccess(AccessScope.USER, authorId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create comment as this author", null, null));
            }

            AnnouncementCommentDto comment = commentService.createComment(announcementId, authorId, content, parentCommentId);
            
            // Record activity
            activityService.recordCommentActivity(announcementId, authorId, content);
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comment created successfully", comment, null));
        } catch (Exception e) {
            log.error("Error creating comment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{commentId}/like")
    @Operation(summary = "Toggle like on a comment")
    public ResponseEntity<OhmaApiResponse<Void>> toggleLike(
            @PathVariable Long commentId,
            @RequestBody Map<String, Object> request) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long userId = Long.valueOf(request.get("userId").toString());

            // Check if user has access to toggle like as this user (self-access required)
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to toggle like as this user", null, null));
            }

            commentService.toggleLike(commentId, userId);
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Like toggled successfully", null, null));
        } catch (Exception e) {
            log.error("Error toggling like for comment {}: {}", commentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 