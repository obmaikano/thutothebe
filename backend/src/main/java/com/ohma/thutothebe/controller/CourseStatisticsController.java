package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CourseStatisticsDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.CourseStatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/analytics/course-statistics")
@Tag(name = "Course Statistics", description = "APIs for managing course statistics")
public class CourseStatisticsController extends BaseController<CourseStatisticsDTO, Long> {

    private final CourseStatisticsService courseStatisticsService;

    @Autowired
    public CourseStatisticsController(CourseStatisticsService courseStatisticsService) {
        super(courseStatisticsService);
        this.courseStatisticsService = courseStatisticsService;
    }

    @GetMapping("/course/{courseId}/current")
    @Operation(summary = "Get current statistics for a course")
    public ResponseEntity<OhmaApiResponse<CourseStatisticsDTO>> getCurrentStatistics(@PathVariable Long courseId) {
        try {
            CourseStatisticsDTO statistics = courseStatisticsService.getCurrentStatistics(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(statistics));
        } catch (Exception e) {
            log.error("Error getting current statistics for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}/historical")
    @Operation(summary = "Get historical statistics for a course")
    public ResponseEntity<OhmaApiResponse<List<CourseStatisticsDTO>>> getHistoricalStatistics(@PathVariable Long courseId) {
        try {
            List<CourseStatisticsDTO> statistics = courseStatisticsService.getHistoricalStatistics(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(statistics));
        } catch (Exception e) {
            log.error("Error getting historical statistics for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get statistics by date range")
    public ResponseEntity<OhmaApiResponse<List<CourseStatisticsDTO>>> getStatisticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<CourseStatisticsDTO> statistics = courseStatisticsService.getStatisticsByDateRange(startDate, endDate);
            return ResponseEntity.ok(OhmaApiResponse.success(statistics));
        } catch (Exception e) {
            log.error("Error getting statistics by date range: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/course/{courseId}/update")
    @Operation(summary = "Update statistics for a course")
    public ResponseEntity<OhmaApiResponse<Void>> updateStatistics(@PathVariable Long courseId) {
        try {
            courseStatisticsService.updateStatistics(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(null));
        } catch (Exception e) {
            log.error("Error updating statistics for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 