package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.entity.ContentType;
import com.ohma.thutothebe.service.ContentService;
import com.ohma.thutothebe.util.LoggingUtil;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController extends BaseController<ContentDTO, Long> {

    private final ContentService contentService;
    private final Logger logger = LoggingUtil.getLogger(ContentController.class);

    @Autowired
    public ContentController(ContentService contentService) {
        super(contentService);
        this.contentService = contentService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger,"Getting content for course: {}", courseId);
            List<ContentDTO> content = contentService.getByCourse(courseId);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting content for course: {}", courseId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}/type/{type}")
    public ResponseEntity<?> getByType(@PathVariable Long courseId, @PathVariable ContentType type) {
        try {
            LoggingUtil.logInfo(logger,"Getting content of type {} for course: {}", type, courseId);
            List<ContentDTO> content = contentService.getByType(courseId, type);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting content of type {} for course: {}", type, courseId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<?> getActiveByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger,"Getting active content for course: {}", courseId);
            List<ContentDTO> content = contentService.getActiveByCourse(courseId);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting active content for course: {}", courseId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}/type/{type}/active")
    public ResponseEntity<?> getActiveByType(@PathVariable Long courseId, @PathVariable ContentType type) {
        try {
            LoggingUtil.logInfo(logger,"Getting active content of type {} for course: {}", type, courseId);
            List<ContentDTO> content = contentService.getActiveByType(courseId, type);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting active content of type {} for course: {}", type, courseId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<?> existsByTitleAndCourse(@RequestParam String title, @RequestParam Long courseId) {
        try {
            LoggingUtil.logInfo(logger,"Checking if content exists with title {} in course: {}", title, courseId);
            boolean exists = contentService.existsByTitleAndCourse(title, courseId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error checking if content exists with title {} in course: {}", title, courseId, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 