package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/schedules")
@Tag(name = "Schedule Controller", description = "APIs for managing schedules and timetables")
public class ScheduleController {

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get schedule for a student")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getStudentSchedule(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            Map<String, Object> scheduleData = new HashMap<>();
            
            // Current week schedule
            List<Map<String, Object>> weeklySchedule = new ArrayList<>();
            String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"};
            String[] subjects = {"Mathematics", "English", "Science", "History", "Physical Education"};
            String[] rooms = {"Room 101", "Room 102", "Room 103", "Room 104", "Gymnasium"};
            String[] teachers = {"Prof. Johnson", "Ms. Smith", "Dr. Brown", "Mr. Davis", "Coach Wilson"};
            
            for (int day = 0; day < days.length; day++) {
                Map<String, Object> daySchedule = new HashMap<>();
                daySchedule.put("day", days[day]);
                daySchedule.put("date", LocalDate.now().plusDays(day).toString());
                
                List<Map<String, Object>> classes = new ArrayList<>();
                
                // Morning classes
                for (int period = 0; period < 4; period++) {
                    Map<String, Object> classInfo = new HashMap<>();
                    classInfo.put("id", (day * 10) + period + 1);
                    classInfo.put("period", period + 1);
                    classInfo.put("subject", subjects[(day + period) % subjects.length]);
                    classInfo.put("teacher", teachers[(day + period) % teachers.length]);
                    classInfo.put("room", rooms[(day + period) % rooms.length]);
                    classInfo.put("startTime", LocalTime.of(8 + period, 0).toString());
                    classInfo.put("endTime", LocalTime.of(8 + period + 1, 0).toString());
                    classInfo.put("type", "LECTURE");
                    classInfo.put("status", "SCHEDULED");
                    classes.add(classInfo);
                }
                
                // Lunch break
                Map<String, Object> lunch = new HashMap<>();
                lunch.put("id", (day * 10) + 99);
                lunch.put("period", "LUNCH");
                lunch.put("subject", "Lunch Break");
                lunch.put("teacher", null);
                lunch.put("room", "Cafeteria");
                lunch.put("startTime", "12:00");
                lunch.put("endTime", "13:00");
                lunch.put("type", "BREAK");
                lunch.put("status", "SCHEDULED");
                classes.add(lunch);
                
                // Afternoon classes
                for (int period = 4; period < 6; period++) {
                    Map<String, Object> classInfo = new HashMap<>();
                    classInfo.put("id", (day * 10) + period + 1);
                    classInfo.put("period", period + 1);
                    classInfo.put("subject", subjects[(day + period) % subjects.length]);
                    classInfo.put("teacher", teachers[(day + period) % teachers.length]);
                    classInfo.put("room", rooms[(day + period) % rooms.length]);
                    classInfo.put("startTime", LocalTime.of(9 + period, 0).toString());
                    classInfo.put("endTime", LocalTime.of(9 + period + 1, 0).toString());
                    classInfo.put("type", "LECTURE");
                    classInfo.put("status", "SCHEDULED");
                    classes.add(classInfo);
                }
                
                daySchedule.put("classes", classes);
                weeklySchedule.add(daySchedule);
            }
            
            scheduleData.put("weeklySchedule", weeklySchedule);
            
            // Next class information
            Map<String, Object> nextClass = new HashMap<>();
            nextClass.put("subject", "Mathematics");
            nextClass.put("teacher", "Prof. Johnson");
            nextClass.put("room", "Room 101");
            nextClass.put("startTime", "10:00");
            nextClass.put("endTime", "11:00");
            nextClass.put("date", LocalDate.now().toString());
            nextClass.put("timeUntil", "2 hours");
            scheduleData.put("nextClass", nextClass);
            
            // Today's schedule
            List<Map<String, Object>> todayClasses = new ArrayList<>();
            for (int i = 0; i < 6; i++) {
                Map<String, Object> classInfo = new HashMap<>();
                classInfo.put("id", i + 1);
                classInfo.put("period", i < 4 ? i + 1 : i == 4 ? "LUNCH" : i);
                classInfo.put("subject", i == 4 ? "Lunch Break" : subjects[i % subjects.length]);
                classInfo.put("teacher", i == 4 ? null : teachers[i % teachers.length]);
                classInfo.put("room", i == 4 ? "Cafeteria" : rooms[i % rooms.length]);
                classInfo.put("startTime", i == 4 ? "12:00" : LocalTime.of(8 + (i < 4 ? i : i - 1), 0).toString());
                classInfo.put("endTime", i == 4 ? "13:00" : LocalTime.of(8 + (i < 4 ? i : i - 1) + 1, 0).toString());
                classInfo.put("type", i == 4 ? "BREAK" : "LECTURE");
                classInfo.put("status", "SCHEDULED");
                classInfo.put("current", i == 1); // Mark second class as current
                todayClasses.add(classInfo);
            }
            scheduleData.put("todaySchedule", todayClasses);
            
            // Schedule statistics
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalClassesThisWeek", 25);
            stats.put("completedClasses", 8);
            stats.put("upcomingClasses", 17);
            stats.put("averageClassDuration", "60 minutes");
            scheduleData.put("statistics", stats);
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Schedule retrieved successfully", scheduleData, null));
        } catch (Exception e) {
            log.error("Error retrieving student schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/today")
    @Operation(summary = "Get today's schedule for a student")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getTodaySchedule(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            List<Map<String, Object>> todayClasses = new ArrayList<>();
            String[] subjects = {"Mathematics", "English", "Science", "History", "Physical Education"};
            String[] rooms = {"Room 101", "Room 102", "Room 103", "Room 104", "Gymnasium"};
            String[] teachers = {"Prof. Johnson", "Ms. Smith", "Dr. Brown", "Mr. Davis", "Coach Wilson"};
            
            for (int i = 0; i < 6; i++) {
                Map<String, Object> classInfo = new HashMap<>();
                classInfo.put("id", i + 1);
                classInfo.put("period", i < 4 ? i + 1 : i == 4 ? "LUNCH" : i);
                classInfo.put("subject", i == 4 ? "Lunch Break" : subjects[i % subjects.length]);
                classInfo.put("teacher", i == 4 ? null : teachers[i % teachers.length]);
                classInfo.put("room", i == 4 ? "Cafeteria" : rooms[i % rooms.length]);
                classInfo.put("startTime", i == 4 ? "12:00" : LocalTime.of(8 + (i < 4 ? i : i - 1), 0).toString());
                classInfo.put("endTime", i == 4 ? "13:00" : LocalTime.of(8 + (i < 4 ? i : i - 1) + 1, 0).toString());
                classInfo.put("type", i == 4 ? "BREAK" : "LECTURE");
                classInfo.put("status", i < 2 ? "COMPLETED" : i == 2 ? "CURRENT" : "SCHEDULED");
                classInfo.put("current", i == 2);
                todayClasses.add(classInfo);
            }
            
            List<Object> result = todayClasses.stream().map(c -> (Object) c).toList();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Today's schedule retrieved", result, null));
        } catch (Exception e) {
            log.error("Error retrieving today's schedule: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/next-class")
    @Operation(summary = "Get next class for a student")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getNextClass(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            Map<String, Object> nextClass = new HashMap<>();
            nextClass.put("id", 3);
            nextClass.put("subject", "Science");
            nextClass.put("teacher", "Dr. Brown");
            nextClass.put("room", "Room 103");
            nextClass.put("startTime", "11:00");
            nextClass.put("endTime", "12:00");
            nextClass.put("date", LocalDate.now().toString());
            nextClass.put("timeUntil", "45 minutes");
            nextClass.put("type", "LECTURE");
            nextClass.put("status", "SCHEDULED");
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Next class retrieved", nextClass, null));
        } catch (Exception e) {
            log.error("Error retrieving next class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/timetable")
    @Operation(summary = "Get timetable for a class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getClassTimetable(
            @Parameter(description = "Class ID") @PathVariable Long classId) {
        try {
            Map<String, Object> timetable = new HashMap<>();
            
            // Weekly timetable structure
            Map<String, List<Map<String, Object>>> weeklyTimetable = new HashMap<>();
            String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"};
            String[] subjects = {"Mathematics", "English", "Science", "History", "Physical Education", "Art"};
            String[] teachers = {"Prof. Johnson", "Ms. Smith", "Dr. Brown", "Mr. Davis", "Coach Wilson", "Ms. Garcia"};
            
            for (String day : days) {
                List<Map<String, Object>> dayClasses = new ArrayList<>();
                
                for (int period = 1; period <= 6; period++) {
                    if (period == 4) continue; // Skip lunch period
                    
                    Map<String, Object> classInfo = new HashMap<>();
                    classInfo.put("period", period > 4 ? period - 1 : period);
                    classInfo.put("subject", subjects[(period - 1) % subjects.length]);
                    classInfo.put("teacher", teachers[(period - 1) % teachers.length]);
                    classInfo.put("room", "Room " + (100 + period));
                    classInfo.put("startTime", LocalTime.of(8 + (period > 4 ? period - 1 : period - 1), 0).toString());
                    classInfo.put("endTime", LocalTime.of(8 + (period > 4 ? period - 1 : period - 1) + 1, 0).toString());
                    dayClasses.add(classInfo);
                }
                
                weeklyTimetable.put(day, dayClasses);
            }
            
            timetable.put("weeklyTimetable", weeklyTimetable);
            timetable.put("classId", classId);
            timetable.put("className", "Grade 10A");
            timetable.put("academicYear", "2024-2025");
            timetable.put("term", "Spring");
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class timetable retrieved", timetable, null));
        } catch (Exception e) {
            log.error("Error retrieving class timetable: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 