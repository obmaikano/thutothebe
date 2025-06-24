package com.ohma.thutothebe.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.entity.Content;
import com.ohma.thutothebe.entity.ContentType;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.ContentRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.ohma.thutothebe.dto.AuthRequest;
import com.ohma.thutothebe.dto.AuthResponse;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.controller.AuthController;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ContentIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private ContentRepository contentRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AuthController authController;

        @Autowired
        private BCryptPasswordEncoder passwordEncoder;

        private HttpHeaders headers;

        private ContentDTO contentDTO;
        private Long courseId;
        private Long userId;

        @DisplayName("Setup test user, course, and content data")
        @BeforeEach
        void setUp() throws Exception {
            headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Generate a short unique suffix
            String uniqueSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 7).toUpperCase();

            // Create test teacher
            String teacherEmail = "testteacher_" + uniqueSuffix + "@example.com";
            String teacherUsername = "testteacher_" + uniqueSuffix;
            User user = createUser(teacherUsername, teacherEmail, UserRole.TEACHER);

            // Login to get JWT token
            AuthRequest authRequest = new AuthRequest(teacherEmail, "password");
            var loginResponse = mockMvc.perform(post("/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(authRequest)))
                            .andExpect(status().isOk())
                            .andReturn();
            var responseBody = objectMapper.readValue(loginResponse.getResponse().getContentAsString(),
                            OhmaApiResponse.class);
            var authResponse = objectMapper.convertValue(responseBody.getData(), AuthResponse.class);
            String token = authResponse.token();
            headers.setBearerAuth(token);

            // Generate course code (max 10 characters)
            String courseCode = ("TST" + uniqueSuffix);
            if (courseCode.length() > 10) {
                    courseCode = courseCode.substring(0, 10);
            }

            // Create test course
            Course course = new Course();
            course.setName("Test Course");
            course.setCode(courseCode);
            course.setActive(true);
            course = courseRepository.save(course);
            courseId = course.getId();

            // Verify course was saved
            Course savedCourse = courseRepository.findById(courseId)
                    .orElseThrow(() -> new IllegalStateException("Course was not saved properly"));

            // Create test content creator user
            String creatorEmail = "testcreator_" + uniqueSuffix + "@example.com";
            String creatorUsername = "testuser_" + uniqueSuffix;
            User userCreator = createUser(creatorUsername, creatorEmail, UserRole.STUDENT);
            userId = userCreator.getId();

            // Create test content DTO with all required fields
            contentDTO = new ContentDTO(
                            null,
                            "Test Content",
                            "Test Description",
                            ContentType.DOCUMENT,
                            "http://test.com",
                            courseId,
                            userId,
                            LocalDateTime.now(),
                            true,
                    0L);
        }

        @DisplayName("Create content successfully returns created content")
        @Test
        void whenCreateContent_thenReturnCreatedContent() throws Exception {
                mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.title").value(contentDTO.title()))
                                .andExpect(jsonPath("$.data.type").value(contentDTO.type().toString()));
        }

    @DisplayName("Creating content with missing required fields returns Bad Request")
    @Test
    void whenCreateContentWithMissingFields_thenReturnBadRequest() throws Exception {
        String invalidJson = """
        {
          "id": null,
          "title": "",
          "description": "Missing title",
          "type": "DOCUMENT",
          "url": "http://test.com",
          "courseId": %d,
          "createdById": %d,
          "createdAt": "%s",
          "active": true
        }
        """.formatted(courseId, userId, LocalDateTime.now().toString());

        mockMvc.perform(post("/content")
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Title cannot be null or blank"));
    }


    @DisplayName("Get all content for a course returns content list")
        @Test
        void whenGetContentByCourse_thenReturnContentList() throws Exception {
                // Create test content
                mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk());

                // Get content by course
                mockMvc.perform(get("/content/course/{courseId}", courseId)
                                .headers(headers))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data[0].title").value(contentDTO.title()))
                                .andExpect(jsonPath("$.data[0].type").value(contentDTO.type().toString()));
        }

        @DisplayName("Get content by type for a course returns filtered content list")
        @Test
        void whenGetContentByType_thenReturnContentList() throws Exception {
                // Create test content
                mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk());

                // Get content by type
                mockMvc.perform(get("/content/course/{courseId}/type/{type}", courseId, ContentType.DOCUMENT)
                                .headers(headers))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data[0].title").value(contentDTO.title()))
                                .andExpect(jsonPath("$.data[0].type").value(contentDTO.type().toString()));
        }

        @DisplayName("Should return active content list for a course")
        @Test
        void whenGetActiveContentByCourse_thenReturnContentList() throws Exception {
                // Create test content
                mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk());

                // Get active content by course
                mockMvc.perform(get("/content/course/{courseId}/active", courseId)
                                .headers(headers))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data[0].title").value(contentDTO.title()))
                                .andExpect(jsonPath("$.data[0].type").value(contentDTO.type().toString()));
        }

        @DisplayName("Get active content by type returns filtered active content list")
        @Test
        void whenGetActiveContentByType_thenReturnContentList() throws Exception {
                // Create test content
                mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk());

                // Get active content by type
                mockMvc.perform(get("/content/course/{courseId}/type/{type}/active", courseId, ContentType.DOCUMENT)
                                .headers(headers))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data[0].title").value(contentDTO.title()))
                                .andExpect(jsonPath("$.data[0].type").value(contentDTO.type().toString()));
        }

        @DisplayName("Check content existence by title and course returns true if exists")
        @Test
        void whenCheckContentExists_thenReturnTrue() throws Exception {
                // Create test content
                mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk());

                // Check if content exists
                mockMvc.perform(get("/content/exists")
                                .headers(headers)
                                .param("title", contentDTO.title())
                                .param("courseId", courseId.toString()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data").value(true));
        }

        @DisplayName("Update content successfully returns updated content")
        @Test
        void whenUpdateContent_thenReturnUpdatedContent() throws Exception {
                // Create test content
                var response = mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk())
                                .andReturn();

                var responseBody = objectMapper.readValue(response.getResponse().getContentAsString(),
                                OhmaApiResponse.class);
                var createdContent = objectMapper.convertValue(responseBody.getData(), ContentDTO.class);

                // Update content
                var updatedDTO = new ContentDTO(
                                createdContent.id(),
                                "Updated Content",
                                "Updated Description",
                                ContentType.VIDEO,
                                "http://updated.com",
                                courseId,
                                userId,
                                LocalDateTime.now(),
                                true,
                        1L);

                mockMvc.perform(put("/content/{id}", createdContent.id())
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updatedDTO)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data.title").value(updatedDTO.title()))
                                .andExpect(jsonPath("$.data.type").value(updatedDTO.type().toString()));
        }

        @DisplayName("Delete content successfully removes content")
        @Test
        void whenDeleteContent_thenReturnOk() throws Exception {
                // Create test content
                var response = mockMvc.perform(post("/content")
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(contentDTO)))
                                .andExpect(status().isOk())
                                .andReturn();

                var responseBody = objectMapper.readValue(response.getResponse().getContentAsString(),
                                OhmaApiResponse.class);
                var createdContent = objectMapper.convertValue(responseBody.getData(), ContentDTO.class);

                // Delete content
                mockMvc.perform(delete("/content/{id}", createdContent.id())
                                .headers(headers))
                                .andExpect(status().isOk());

                // Verify content is deleted
                mockMvc.perform(get("/content/{id}", createdContent.id())
                                .headers(headers))
                                .andExpect(status().isBadRequest());
        }

    @DisplayName("Concurrent updates throw optimistic locking exception")
    @Test
    void whenConcurrentUpdate_thenThrowOptimisticLockingException() throws Exception {
        // Create test content
        var response = mockMvc.perform(post("/content")
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk())
                .andReturn();

        var responseBody = objectMapper.readValue(response.getResponse().getContentAsString(),
                OhmaApiResponse.class);
        var createdContent = objectMapper.convertValue(responseBody.getData(), ContentDTO.class);

        // First update (simulates User A)
        ContentDTO update1 = new ContentDTO(
                createdContent.id(),
                "Updated Title 1",
                createdContent.description(),
                createdContent.type(),
                createdContent.url(),
                createdContent.courseId(),
                createdContent.createdById(),
                createdContent.createdAt(),
                createdContent.active(),
                0L // Version 0
        );

        // Second update (simulates User B with stale version)
        ContentDTO update2 = new ContentDTO(
                createdContent.id(),
                "Updated Title 2",
                createdContent.description(),
                createdContent.type(),
                createdContent.url(),
                createdContent.courseId(),
                createdContent.createdById(),
                createdContent.createdAt(),
                createdContent.active(),
                0L // Still using Version 0
        );

        // Perform first update — should succeed and increment version
        mockMvc.perform(put("/content/{id}", createdContent.id())
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update1)))
                .andExpect(status().isOk());

        // Perform second update — should fail due to version mismatch
        mockMvc.perform(put("/content/{id}", createdContent.id())
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update2)))
                .andExpect(status().isConflict()) // 409 Conflict is the correct HTTP status
                .andExpect(jsonPath("$.message")
                        .value("The resource was modified by another user. Please refresh and try again."));
    }

    @AfterEach
        void tearDown() {
            courseRepository.deleteAll();
            userRepository.deleteAll();
        }

        private User createUser(String username, String email, UserRole role) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("password"));
            user.setRole(role);
            user.setFirstName("First");
            user.setLastName("Last");
            return userRepository.save(user);
        }
}