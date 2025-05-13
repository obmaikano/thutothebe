package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CommentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/comments")
@Tag(name = "Comment Management", description = "APIs for managing comments")
public class CommentController extends BaseController<CommentDTO, Long> {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        super(commentService);
        this.commentService = commentService;
    }

    @GetMapping("/thread/{threadId}")
    @Operation(summary = "Get comments by thread ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getByThreadId(@PathVariable Long threadId) {
        try {
            List<CommentDTO> comments = commentService.findByThreadId(threadId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/thread/{threadId}/active")
    @Operation(summary = "Get active comments by thread ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getByThreadIdAndActive(
            @PathVariable Long threadId,
            @RequestParam(defaultValue = "true") boolean active) {
        try {
            List<CommentDTO> comments = commentService.findByThreadIdAndActive(threadId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/author/{authorId}")
    @Operation(summary = "Get comments by author ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getByAuthorId(@PathVariable Long authorId) {
        try {
            List<CommentDTO> comments = commentService.findByAuthorId(authorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/author/{authorId}/active")
    @Operation(summary = "Get active comments by author ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getByAuthorIdAndActive(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "true") boolean active) {
        try {
            List<CommentDTO> comments = commentService.findByAuthorIdAndActive(authorId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/parent/{parentId}")
    @Operation(summary = "Get comments by parent ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getByParentId(@PathVariable Long parentId) {
        try {
            List<CommentDTO> comments = commentService.findByParentId(parentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/parent/{parentId}/active")
    @Operation(summary = "Get active comments by parent ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getByParentIdAndActive(
            @PathVariable Long parentId,
            @RequestParam(defaultValue = "true") boolean active) {
        try {
            List<CommentDTO> comments = commentService.findByParentIdAndActive(parentId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/replies")
    @Operation(summary = "Get comment with replies by ID")
    public ResponseEntity<OhmaApiResponse<CommentDTO>> getByIdWithReplies(@PathVariable Long id) {
        try {
            CommentDTO comment = commentService.findByIdWithReplies(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Comment with replies retrieved successfully", comment, null));
        } catch (Exception e) {
            log.error("Error retrieving comment with replies: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/thread/{threadId}/top-level")
    @Operation(summary = "Get top-level comments by thread ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getTopLevelCommentsByThreadId(@PathVariable Long threadId) {
        try {
            List<CommentDTO> comments = commentService.findTopLevelCommentsByThreadId(threadId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Top-level comments retrieved successfully", comments, null));
        } catch (Exception e) {
            log.error("Error retrieving top-level comments: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/parent/{parentId}/replies")
    @Operation(summary = "Get replies by parent ID")
    public ResponseEntity<OhmaApiResponse<List<CommentDTO>>> getRepliesByParentId(@PathVariable Long parentId) {
        try {
            List<CommentDTO> replies = commentService.findRepliesByParentId(parentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Replies retrieved successfully", replies, null));
        } catch (Exception e) {
            log.error("Error retrieving replies: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 