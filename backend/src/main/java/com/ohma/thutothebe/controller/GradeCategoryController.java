package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.GradeCategoryDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.GradeCategoryService;
import com.ohma.thutothebe.util.LoggingUtil;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grade-categories")
public class GradeCategoryController extends BaseController<GradeCategoryDTO, Long> {

    private final GradeCategoryService gradeCategoryService;
    private final Logger logger = LoggingUtil.getLogger(GradeCategoryController.class);

    @Autowired
    public GradeCategoryController(GradeCategoryService gradeCategoryService) {
        super(gradeCategoryService);
        this.gradeCategoryService = gradeCategoryService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<?>> getByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting grade categories for course: {}", courseId);
            List<GradeCategoryDTO> categories = gradeCategoryService.getByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade categories retrieved successfully", categories, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting grade categories for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting active grade categories for course: {}", courseId);
            List<GradeCategoryDTO> categories = gradeCategoryService.getActiveByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active grade categories retrieved successfully", categories, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting active grade categories for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/total-weight")
    public ResponseEntity<OhmaApiResponse<?>> getTotalWeightByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting total weight for course: {}", courseId);
            Double totalWeight = gradeCategoryService.getTotalWeightByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Total weight retrieved successfully", totalWeight, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting total weight for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/average-passing-grade")
    public ResponseEntity<OhmaApiResponse<?>> getAveragePassingGradeByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting average passing grade for course: {}", courseId);
            Double averagePassingGrade = gradeCategoryService.getAveragePassingGradeByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Average passing grade retrieved successfully", averagePassingGrade, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting average passing grade for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 