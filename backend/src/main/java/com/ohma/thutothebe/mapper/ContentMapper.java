package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.entity.Content;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ContentMapper implements BaseDtoMapper<Content, ContentDTO> {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ContentDTO toDto(Content content) {
        return new ContentDTO(
            content.getId(),
            content.getTitle(),
            content.getDescription(),
            content.getType(),
            content.getUrl(),
            content.getCourse().getId(),
            content.getCreatedBy().getId(),
            content.getCreatedAt(),
            content.isActive()
        );
    }

    @Override
    public Content toEntity(ContentDTO dto) {
        Content content = new Content();
        content.setId(dto.id());
        content.setTitle(dto.title());
        content.setDescription(dto.description());
        content.setType(dto.type());
        content.setUrl(dto.url());
        content.setCourse(courseRepository.findById(dto.courseId())
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + dto.courseId())));
        content.setCreatedBy(userRepository.findById(dto.createdById())
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + dto.createdById())));
        content.setActive(dto.active());
        return content;
    }

    public void updateEntityFromDto(ContentDTO dto, Content content) {
        if (dto == null || content == null) {
            return;
        }

        content.setId(dto.id());
        content.setTitle(dto.title());
        content.setDescription(dto.description());
        content.setType(dto.type());
        content.setUrl(dto.url());

    }
} 