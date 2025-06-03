package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ThreadDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.ThreadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/threads")
@Tag(name = "Thread Management", description = "APIs for managing discussion threads")
public class ThreadController extends BaseController<ThreadDTO, Long> {

    private final ThreadService threadService;

    public ThreadController(ThreadService threadService) {
        super(threadService);
        this.threadService = threadService;
    }

    @GetMapping("/forum/{forumId}")
    @Operation(summary = "Get threads by forum ID")
    public ResponseEntity<OhmaApiResponse<List<ThreadDTO>>> getByForumId(@PathVariable Long forumId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view threads for this forum (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view forum threads", null, null));
            }

            List<ThreadDTO> threads = threadService.findByForumId(forumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Threads retrieved successfully", threads, null));
        } catch (Exception e) {
            log.error("Error retrieving threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/forum/{forumId}/active")
    @Operation(summary = "Get active threads by forum ID")
    public ResponseEntity<OhmaApiResponse<List<ThreadDTO>>> getByForumIdAndActive(
            @PathVariable Long forumId,
            @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view active threads for this forum (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view active forum threads", null, null));
            }

            List<ThreadDTO> threads = threadService.findByForumIdAndActive(forumId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Threads retrieved successfully", threads, null));
        } catch (Exception e) {
            log.error("Error retrieving threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/author/{authorId}")
    @Operation(summary = "Get threads by author ID")
    public ResponseEntity<OhmaApiResponse<List<ThreadDTO>>> getByAuthorId(@PathVariable Long authorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view threads for this author (self-access or admin access)
            if (!hasAccess(AccessScope.USER, authorId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view author threads", null, null));
            }

            List<ThreadDTO> threads = threadService.findByAuthorId(authorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Threads retrieved successfully", threads, null));
        } catch (Exception e) {
            log.error("Error retrieving threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/author/{authorId}/active")
    @Operation(summary = "Get active threads by author ID")
    public ResponseEntity<OhmaApiResponse<List<ThreadDTO>>> getByAuthorIdAndActive(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view active threads for this author (self-access or admin access)
            if (!hasAccess(AccessScope.USER, authorId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view active author threads", null, null));
            }

            List<ThreadDTO> threads = threadService.findByAuthorIdAndActive(authorId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Threads retrieved successfully", threads, null));
        } catch (Exception e) {
            log.error("Error retrieving threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Get thread with comments by ID")
    public ResponseEntity<OhmaApiResponse<ThreadDTO>> getByIdWithComments(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view thread with comments (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view thread with comments", null, null));
            }

            ThreadDTO thread = threadService.findByIdWithComments(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Thread with comments retrieved successfully", thread, null));
        } catch (Exception e) {
            log.error("Error retrieving thread with comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/forum/{forumId}/comments")
    @Operation(summary = "Get threads with comments by forum ID")
    public ResponseEntity<OhmaApiResponse<List<ThreadDTO>>> getByForumIdWithComments(@PathVariable Long forumId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view threads with comments for this forum (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view forum threads with comments", null, null));
            }

            List<ThreadDTO> threads = threadService.findByForumIdWithComments(forumId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Threads with comments retrieved successfully", threads, null));
        } catch (Exception e) {
            log.error("Error retrieving threads with comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/forum/{forumId}/ordered")
    @Operation(summary = "Get threads ordered by pinned status and last activity")
    public ResponseEntity<OhmaApiResponse<Page<ThreadDTO>>> getByForumIdOrdered(
            @PathVariable Long forumId,
            Pageable pageable) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view ordered threads for this forum (user-level access required)
            if (!hasAccess(AccessScope.USER, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view ordered forum threads", null, null));
            }

            Page<ThreadDTO> threads = threadService.findByForumIdOrderByPinnedAndLastActivity(forumId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Threads retrieved successfully", threads, null));
        } catch (Exception e) {
            log.error("Error retrieving threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 