package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.UserAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/analytics/users")
@Tag(name = "User Analytics", description = "APIs for user analytics and statistics")
@RequiredArgsConstructor
public class UserAnalyticsController {

    private final UserAnalyticsService userAnalyticsService;

    @GetMapping("/stats")
    @Operation(summary = "Get user statistics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getUserStats() {
        try {
            Map<String, Object> stats = userAnalyticsService.getUserStats();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User statistics retrieved successfully", stats, null));
        } catch (Exception e) {
            log.error("Error retrieving user statistics: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 