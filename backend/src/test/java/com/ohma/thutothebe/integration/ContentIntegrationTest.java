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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

    private ContentDTO contentDTO;
    private Long courseId;
    private Long userId;

    @BeforeEach
    void setUp() {
        // Create test user (teacher)
        User teacher = new User();
        teacher.setUsername("testteacher");
        teacher.setEmail("teacher@example.com");
        teacher.setPassword("password");
        teacher.setFirstName("TeacherFirst");
        teacher.setLastName("TeacherLast");
        teacher = userRepository.save(teacher);

        // Create test course
        Course course = new Course();
        course.setName("Test Course");
        course.setCode("TEST101");
        course.setDescription("Test Description");
        course.setTeacher(teacher);
        course = courseRepository.save(course);
        courseId = course.getId();

        // Create test user (content creator)
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setFirstName("UserFirst");
        user.setLastName("UserLast");
        user = userRepository.save(user);
        userId = user.getId();

        // Create test content DTO
        contentDTO = new ContentDTO(
            null,
            "Test Content",
            "Test Description",
            ContentType.DOCUMENT,
            "http://test.com",
            courseId,
            userId,
            LocalDateTime.now(),
            true
        );
    }

    @Test
    void whenCreateContent_thenReturnCreatedContent() throws Exception {
        mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(contentDTO.title()))
                .andExpect(jsonPath("$.type").value(contentDTO.type().toString()));
    }

    @Test
    void whenGetContentByCourse_thenReturnContentList() throws Exception {
        // Create test content
        mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk());

        // Get content by course
        mockMvc.perform(get("/content/course/{courseId}", courseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value(contentDTO.title()))
                .andExpect(jsonPath("$[0].type").value(contentDTO.type().toString()));
    }

    @Test
    void whenGetContentByType_thenReturnContentList() throws Exception {
        // Create test content
        mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk());

        // Get content by type
        mockMvc.perform(get("/content/course/{courseId}/type/{type}", courseId, ContentType.DOCUMENT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value(contentDTO.title()))
                .andExpect(jsonPath("$[0].type").value(contentDTO.type().toString()));
    }

    @Test
    void whenGetActiveContentByCourse_thenReturnContentList() throws Exception {
        // Create test content
        mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk());

        // Get active content by course
        mockMvc.perform(get("/content/course/{courseId}/active", courseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value(contentDTO.title()))
                .andExpect(jsonPath("$[0].type").value(contentDTO.type().toString()));
    }

    @Test
    void whenGetActiveContentByType_thenReturnContentList() throws Exception {
        // Create test content
        mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk());

        // Get active content by type
        mockMvc.perform(get("/content/course/{courseId}/type/{type}/active", courseId, ContentType.DOCUMENT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value(contentDTO.title()))
                .andExpect(jsonPath("$[0].type").value(contentDTO.type().toString()));
    }

    @Test
    void whenCheckContentExists_thenReturnTrue() throws Exception {
        // Create test content
        mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk());

        // Check if content exists
        mockMvc.perform(get("/content/exists")
                .param("title", contentDTO.title())
                .param("courseId", courseId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void whenUpdateContent_thenReturnUpdatedContent() throws Exception {
        // Create test content
        var response = mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk())
                .andReturn();

        var createdContent = objectMapper.readValue(response.getResponse().getContentAsString(), ContentDTO.class);

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
            true
        );

        mockMvc.perform(put("/content/{id}", createdContent.id())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(updatedDTO.title()))
                .andExpect(jsonPath("$.type").value(updatedDTO.type().toString()));
    }

    @Test
    void whenDeleteContent_thenReturnOk() throws Exception {
        // Create test content
        var response = mockMvc.perform(post("/content")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contentDTO)))
                .andExpect(status().isOk())
                .andReturn();

        var createdContent = objectMapper.readValue(response.getResponse().getContentAsString(), ContentDTO.class);

        // Delete content
        mockMvc.perform(delete("/content/{id}", createdContent.id()))
                .andExpect(status().isOk());

        // Verify content is deleted
        mockMvc.perform(get("/content/{id}", createdContent.id()))
                .andExpect(status().isBadRequest());
    }
}