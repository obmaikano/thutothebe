package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.ForumDTO;
import com.ohma.thutothebe.entity.Forum;
import com.ohma.thutothebe.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ForumMapper implements BaseDtoMapper<Forum, ForumDTO> {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Override
    public ForumDTO toDto(Forum forum) {
        if (forum == null) {
            return null;
        }
        
        return new ForumDTO(
            forum.getId(),
            forum.getTitle(),
            forum.getDescription(),
            forum.getCourse().getId(),
            forum.isActive()
        );
    }
    
    @Override
    public Forum toEntity(ForumDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Forum forum = new Forum();
        forum.setId(dto.id());
        forum.setTitle(dto.title());
        forum.setDescription(dto.description());
        forum.setCourse(courseRepository.findById(dto.courseId())
            .orElseThrow(() -> new IllegalArgumentException("Course not found")));
        forum.setActive(dto.active());
        
        return forum;
    }
    
    
    public void updateEntityFromDto(ForumDTO dto, Forum entity) {
        if (dto == null || entity == null) {
            return;
        }
        
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setCourse(courseRepository.findById(dto.courseId())
            .orElseThrow(() -> new IllegalArgumentException("Course not found")));
        entity.setActive(dto.active());
    }
} 