package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CommentDTO;
import com.ohma.thutothebe.entity.Comment;
import com.ohma.thutothebe.repository.ThreadRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper implements BaseDtoMapper<Comment, CommentDTO> {
    
    @Autowired
    private ThreadRepository threadRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Override
    public CommentDTO toDto(Comment comment) {
        if (comment == null) {
            return null;
        }
        
        return new CommentDTO(
            comment.getId(),
            comment.getContent(),
            comment.getThread().getId(),
            comment.getAuthor().getId(),
            comment.getParent() != null ? comment.getParent().getId() : null,
            comment.getCreatedAt(),
            comment.getUpdatedAt(),
            comment.isActive()
        );
    }
    
    @Override
    public Comment toEntity(CommentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Comment comment = new Comment();
        comment.setId(dto.id());
        comment.setContent(dto.content());
        comment.setThread(threadRepository.findById(dto.threadId())
            .orElseThrow(() -> new IllegalArgumentException("Thread not found")));
        comment.setAuthor(userRepository.findById(dto.authorId())
            .orElseThrow(() -> new IllegalArgumentException("User not found")));
        if (dto.parentId() != null) {
            comment.setParent(commentRepository.findById(dto.parentId())
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found")));
        }
        comment.setCreatedAt(dto.createdAt());
        comment.setUpdatedAt(dto.updatedAt());
        comment.setActive(dto.active());
        
        return comment;
    }
    
   
    public void updateEntityFromDto(CommentDTO dto, Comment entity) {
        if (dto == null || entity == null) {
            return;
        }
        
        entity.setContent(dto.content());
        entity.setThread(threadRepository.findById(dto.threadId())
            .orElseThrow(() -> new IllegalArgumentException("Thread not found")));
        entity.setAuthor(userRepository.findById(dto.authorId())
            .orElseThrow(() -> new IllegalArgumentException("User not found")));
        if (dto.parentId() != null) {
            entity.setParent(commentRepository.findById(dto.parentId())
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found")));
        }
        entity.setUpdatedAt(dto.updatedAt());
        entity.setActive(dto.active());
    }
} 