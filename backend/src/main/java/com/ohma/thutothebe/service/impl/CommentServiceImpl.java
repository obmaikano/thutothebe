package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CommentDTO;
import com.ohma.thutothebe.entity.Comment;
import com.ohma.thutothebe.mapper.CommentMapper;
import com.ohma.thutothebe.repository.CommentRepository;
import com.ohma.thutothebe.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl extends BaseServiceImpl<Comment, CommentDTO, Long> implements CommentService {
    
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    
    @Autowired
    public CommentServiceImpl(CommentRepository repository, CommentMapper mapper) {
        super(repository);
        this.commentRepository = repository;
        this.commentMapper = mapper;
    }
    
    @Override
    protected Comment mapToEntity(CommentDTO dto) {
        return commentMapper.toEntity(dto);
    }
    
    @Override
    protected CommentDTO mapToDto(Comment entity) {
        return commentMapper.toDto(entity);
    }
    
    @Override
    protected void updateEntity(Comment entity, CommentDTO dto) {
        commentMapper.updateEntityFromDto(dto, entity);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findByThreadId(Long threadId) {
        return commentRepository.findByThreadId(threadId).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findByThreadIdAndActive(Long threadId, boolean active) {
        return commentRepository.findByThreadIdAndActive(threadId, active).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findByAuthorId(Long authorId) {
        return commentRepository.findByAuthorId(authorId).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findByAuthorIdAndActive(Long authorId, boolean active) {
        return commentRepository.findByAuthorIdAndActive(authorId, active).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findByParentId(Long parentId) {
        return commentRepository.findByParentId(parentId).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findByParentIdAndActive(Long parentId, boolean active) {
        return commentRepository.findByParentIdAndActive(parentId, active).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public CommentDTO findByIdWithReplies(Long id) {
        Comment comment = commentRepository.findByIdWithReplies(id);
        return comment == null ? null : commentMapper.toDto(comment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findTopLevelCommentsByThreadId(Long threadId) {
        return commentRepository.findTopLevelCommentsByThreadId(threadId).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> findRepliesByParentId(Long parentId) {
        return commentRepository.findRepliesByParentId(parentId).stream()
            .map(commentMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    protected Long extractSchoolId(Comment entity) {
        return entity.getThread() != null && entity.getThread().getForum() != null && entity.getThread().getForum().getCourse() != null && entity.getThread().getForum().getCourse().getClassEntity() != null && entity.getThread().getForum().getCourse().getClassEntity().getSchool() != null 
            ? entity.getThread().getForum().getCourse().getClassEntity().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Comment entity) {
        return entity.getThread() != null && entity.getThread().getForum() != null && entity.getThread().getForum().getCourse() != null && entity.getThread().getForum().getCourse().getClassEntity() != null && entity.getThread().getForum().getCourse().getClassEntity().getSchool() != null && entity.getThread().getForum().getCourse().getClassEntity().getSchool().getRegion() != null 
            ? entity.getThread().getForum().getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }
} 