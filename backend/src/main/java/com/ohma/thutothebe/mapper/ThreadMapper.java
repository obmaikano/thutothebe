package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.ThreadDTO;
import com.ohma.thutothebe.entity.Thread;
import com.ohma.thutothebe.repository.ForumRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ThreadMapper implements BaseDtoMapper<Thread, ThreadDTO> {
    
    @Autowired
    private ForumRepository forumRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public ThreadDTO toDto(Thread thread) {
        if (thread == null) {
            return null;
        }
        
        return new ThreadDTO(
            thread.getId(),
            thread.getTitle(),
            thread.getContent(),
            thread.getForum().getId(),
            thread.getAuthor().getId(),
            thread.isPinned(),
            thread.getLastActivityAt(),
            thread.isActive()
        );
    }
    
    @Override
    public Thread toEntity(ThreadDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Thread thread = new Thread();
        thread.setId(dto.id());
        thread.setTitle(dto.title());
        thread.setContent(dto.content());
        thread.setForum(forumRepository.findById(dto.forumId())
            .orElseThrow(() -> new IllegalArgumentException("Forum not found")));
        thread.setAuthor(userRepository.findById(dto.authorId())
            .orElseThrow(() -> new IllegalArgumentException("User not found")));
        thread.setPinned(dto.pinned());
        thread.setLastActivityAt(dto.lastActivityAt());
        thread.setActive(dto.active());
        
        return thread;
    }
    
    
    public void updateEntityFromDto(ThreadDTO dto, Thread entity) {
        if (dto == null || entity == null) {
            return;
        }
        
        entity.setTitle(dto.title());
        entity.setContent(dto.content());
        entity.setForum(forumRepository.findById(dto.forumId())
            .orElseThrow(() -> new IllegalArgumentException("Forum not found")));
        entity.setAuthor(userRepository.findById(dto.authorId())
            .orElseThrow(() -> new IllegalArgumentException("User not found")));
        entity.setPinned(dto.pinned());
        entity.setLastActivityAt(dto.lastActivityAt());
        entity.setActive(dto.active());
    }
} 