package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.util.LoggingUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/courses")
public class CourseController extends BaseController<CourseDTO, Long> {

    private final CourseService courseService;
    private final UserService userService;
    private final UserMapper userMapper;

    public CourseController(CourseService courseService, UserService userService, UserMapper userMapper) {
        super(courseService);
        this.courseService = courseService;
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> getCourseByCode(@PathVariable String code) {
        try {
            CourseDTO course = courseService.getCourseByCode(code);
            return ResponseEntity.ok(OhmaApiResponse.success(course));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error getting course by code: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Course not found with code: " + code));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByTeacher(@PathVariable Long teacherId) {
        try {
            UserDTO teacherDTO = userService.getById(teacherId);
            var teacher = userMapper.toEntity(teacherDTO);
            List<CourseDTO> courses = (List<CourseDTO>) courseService.getCoursesByTeacher(teacher);
            return ResponseEntity.ok(OhmaApiResponse.success(courses));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error getting courses by teacher: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OhmaApiResponse.error(404, "Teacher not found with id: " + teacherId));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByStudent(@PathVariable Long studentId) {
        try {
            List<CourseDTO> courses = courseService.findByEnrolledStudentId(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(courses));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error getting courses by student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getActiveCourses() {
        try {
            List<CourseDTO> courses = (List<CourseDTO>) courseService.getActiveCourses();
            return ResponseEntity.ok(OhmaApiResponse.success(courses));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error getting active courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Error getting active courses: " + e.getMessage()));
        }
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<OhmaApiResponse<List<CourseDTO>>> getCoursesByInstructor(@PathVariable Long instructorId) {
        try {
            List<CourseDTO> courses = courseService.findByInstructorId(instructorId);
            return ResponseEntity.ok(OhmaApiResponse.success(courses));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error getting courses by instructor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> enrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        try {
            CourseDTO course = courseService.enrollStudent(courseId, studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(course));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error enrolling student {} in course {}: {}", new Object[]{studentId, courseId, e.getMessage()}, e);
            return ResponseEntity.badRequest().body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/{courseId}/unenroll/{studentId}")
    public ResponseEntity<OhmaApiResponse<CourseDTO>> unenrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        try {
            CourseDTO course = courseService.unenrollStudent(courseId, studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(course));
        } catch (Exception e) {
            LoggingUtil.error(log, "Error unenrolling student {} from course {}: {}", new Object[]{studentId, courseId, e.getMessage()}, e);
            return ResponseEntity.badRequest().body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 